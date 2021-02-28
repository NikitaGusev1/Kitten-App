import * as React from 'react';
import {Text, Image, View, StyleSheet} from 'react-native';

export function KittenInfoView({route, navigation}) {
  const {kittenImage} = route.params;
  const {kittenName} = route.params;
  console.log(kittenImage);

  return (
    <View>
      <View style={styles.imageViewStyle}>
        <Image
          style={styles.imageStyle}
          source={{uri: `data:image/png;base64,${kittenImage}`}}
        />
      </View>
      <View>
        <Text style={styles.nameStyle}>{kittenName}</Text>
        <Text style={styles.descriptionStyle}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageStyle: {height: 150, width: 250, marginTop: 5},
  imageViewStyle: {alignSelf: 'center', marginBottom: 10},
  nameStyle: {
    fontSize: 20,
    alignSelf: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  descriptionStyle: {fontSize: 16, alignSelf: 'center', marginLeft: 5},
});
