import React from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  FlatList,
  ImageBackground,
  Pressable,
} from 'react-native';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

export default function TCProfileTag({dataSource, onTagCancelPress}) {
  const renderTags = ({item, index}) => (
    <>
      {item.isChecked && (
        <View style={{alignItems: 'center'}}>
          <View
            style={{
              borderRadius: 90,
              overflow: 'hidden',
              height: 45,
              width: 45,
            }}>
            <ImageBackground
              source={
                item.thumbnail
                  ? {uri: item.thumbnail}
                  : images.profilePlaceHolder
              }
              style={styles.profileImage}></ImageBackground>
          </View>
          <Pressable
            style={styles.closeButton}
            onPress={() => onTagCancelPress({item, index})}>
            <Image source={images.closeRound} style={styles.closeButton} />
          </Pressable>
          <Text style={styles.tagTitleText} numberOfLines={2}>
            {`${item.first_name} ${item.last_name}`}
          </Text>
        </View>
      )}
    </>
  );
  return (
    <View>
      <FlatList
        data={dataSource}
        renderItem={renderTags}
        keyExtractor={(item, index) => index.toString()}
        style={styles.tagListStyle}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{width: 5}} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignSelf: 'flex-end',
    width: 15,
    height: 15,
    resizeMode: 'contain',

    position: 'absolute',
    right: 2,
  },

  tagListStyle: {
    marginTop: 20,
    marginBottom: 10,
  },
  tagTitleText: {
    marginRight: 5,
    marginTop: 5,
    fontFamily: fonts.RRegular,
    fontSize: 12,
    color: colors.lightBlackColor,
    width: 50,
    textAlign: 'center',
  },
  profileImage: {
    height: 45,
    resizeMode: 'cover',
    width: 45,

    alignSelf: 'center',
  },
});
