import * as React from 'react';
import {useState, useEffect, useCallback} from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import {Button, ActivityIndicator, View, StyleSheet, Text} from 'react-native';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import catNames from 'cat-names';
import {KittenList} from '../KittenList';

export function KittenListView() {
  const [isInternetReachable, setIsInternetReachable] = useState(false);
  const [kittens, setKittens] = useState([{image: '', name: '', id: 0}]);
  const [loading, setLoading] = useState(true);
  const [storedKittens, setStoredKittens] = useState([
    {image: '', name: '', id: 0},
  ]);
  const {getItem, setItem} = useAsyncStorage('@offlineKittens');
  const defaultCount = 30;

  const readItemFromStorage = useCallback(async () => {
    const jsonValue = await getItem();
    const parsedKittens = jsonValue != null ? JSON.parse(jsonValue) : null;
    setStoredKittens(parsedKittens);
  }, [getItem]);

  const writeItemToStorage = useCallback(
    async (itemToSave) => {
      const jsonValue = JSON.stringify(itemToSave);
      await setItem(jsonValue);
    },
    [setItem],
  );

  const retrieveImages = useCallback(
    (count) => {
      setLoading(true);
      const imageArray = [''];
      let names = generateCatNames(count);
      for (let index = 1; index <= count; index++) {
        RNFetchBlob.fetch(
          'GET',
          `http://placekitten.com/250/150?image=${
            Math.floor(Math.random() * 16) + 1
          }`,
        )
          .then((response) => {
            let status = response.info().status;

            if (status === 200) {
              let base64String = response.data;
              imageArray.push(base64String);

              assignNames(imageArray, names);
            }
          })
          .catch((errorMessage, statusCode) => {
            console.log(`Error: ${errorMessage}, code: ${statusCode}`);
          });
      }
    },
    [assignNames],
  );

  const generateCatNames = (count) => {
    const names = [''];
    for (let index = 0; index < count; index++) {
      names.push(catNames.random());
    }

    return names;
  };

  const assignNames = useCallback(
    (imagesArray, namesArray) => {
      let newKittens = [{image: '', name: '', id: 0}];

      for (let index = 1; index < imagesArray.length - 1; index++) {
        newKittens.push({
          image: imagesArray[index],
          name: namesArray[index],
          id: imagesArray[index],
        });
      }

      setKittens(newKittens);
      writeItemToStorage(newKittens);
      setLoading(false);
    },
    [writeItemToStorage],
  );

  useEffect(() => {
    checkInternet();
  }, [checkInternet]);

  const checkInternet = useCallback(() => {
    NetInfo.fetch().then((state) => {
      if (!state.isConnected) {
        setIsInternetReachable(false);
        readItemFromStorage();
      } else {
        setIsInternetReachable(true);
      }
    });
  }, [readItemFromStorage]);

  useEffect(() => {
    retrieveImages(defaultCount);
  }, [retrieveImages]);

  return (
    <View style={styles.containerStyle}>
      {isInternetReachable === false ? (
        <View>
          <Text style={styles.disclaimerStyle}>
            Couldn't connect to the Internet, showing saved kittens from last
            time. To see new ones, please connect to the Internet and reload the
            app.{' '}
          </Text>
          <KittenList kittens={storedKittens} styles={styles} />
        </View>
      ) : isInternetReachable === true && loading === true ? (
        <View>
          <ActivityIndicator animating={true} color="red" size="large" />
        </View>
      ) : (
        <View>
          <View style={styles.buttonViewStyle}>
            <View style={styles.buttonStyle}>
              <Button
                onPress={() => {
                  setKittens([]);
                  retrieveImages(30);
                }}
                title={'30'}
              />
            </View>
            <View style={styles.buttonStyle}>
              <Button
                onPress={() => {
                  setKittens([]);
                  retrieveImages(50);
                }}
                title={'50'}
              />
            </View>
            <View style={styles.buttonStyle}>
              <Button
                onPress={() => {
                  setKittens([]);
                  retrieveImages(100);
                }}
                title={'100'}
              />
            </View>
          </View>
          <KittenList kittens={kittens} styles={styles} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: 'center',
  },
  buttonViewStyle: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  buttonStyle: {
    width: 80,
  },
  catNameStyle: {textAlign: 'center', marginTop: 10, fontSize: 18},
  imageViewStyle: {marginBottom: 10},
  imageStyle: {height: 150, width: 250},
  disclaimerStyle: {textAlign: 'center', marginTop: 5, fontSize: 16},
});
