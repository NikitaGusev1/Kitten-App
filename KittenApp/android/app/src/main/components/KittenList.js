import * as React from 'react';
import {Text, Image, TouchableOpacity, View, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export function KittenList(props) {
  const navigation = useNavigation();
  return (
    <FlatList
      data={props.kittens}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      maxToRenderPerBatch={3}
      initialNumToRender={3}
      updateCellsBatchingPeriod={45}
      renderItem={({item, index}) => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('KittenInfo', {
              kittenName: item.name,
              kittenImage: item.image,
            });
          }}>
          <View style={props.styles.imageViewStyle}>
            <Image
              style={props.styles.imageStyle}
              source={{uri: `data:image/png;base64,${item.image}`}}
            />
            <Text style={props.styles.catNameStyle}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
