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

export default function TCProfileTag({dataSource, titleKey, onTagCancelPress}) {
  const renderTags = ({item, index}) => (
    <>
      {item.isChecked && (
        <View onPress={() => onTagCancelPress({item, index})}>
          <ImageBackground
            source={
              item.thumbnail ? {uri: item.thumbnail} : images.profilePlaceHolder
            }
            style={styles.profileImage}>
            <Pressable
              style={styles.closeButton}
              onPress={() => onTagCancelPress({item, index})}>
              <Image source={images.closeRound} style={styles.closeButton} />
            </Pressable>
          </ImageBackground>

          <Text style={styles.tagTitleText} numberOfLines={2}>
            {item[titleKey]}
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
  },

  tagListStyle: {
    marginLeft: 20,
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
    borderRadius: 18,
    alignSelf: 'center',
  },
});
