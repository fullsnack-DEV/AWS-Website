import React, {memo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

import FastImage from 'react-native-fast-image';
import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

function TCEntityView({onPress, showStar = false, data, placeholder = false}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.viewContainer}>
        <View style={styles.backgroundView}>
          {!placeholder ? (
            <Image
              source={
                data?.thumbnail
                  ? {uri: data?.thumbnail}
                  : images.profilePlaceHolder
              }
              style={styles.profileImage}
            />
          ) : (
            <FastImage source={images.dummyPhoto} style={styles.profileImage} />
          )}
        </View>
        <Text style={styles.entityName} numberOfLines={2}>
          {placeholder ? 'Towns Cup' : data?.full_name}
        </Text>
        {showStar && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}
          >
            <Image source={images.orangeStar} style={styles.starImage} />
            <Text style={styles.starPoints} numberOfLines={2}>
              5.0
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backgroundView: {
    backgroundColor: colors.whiteColor,
    elevation: 5,
    height: 70,
    width: 70,
    borderRadius: 35,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewContainer: {
    alignItems: 'center',
    // backgroundColor: 'red',
    width: 70,
    // height: 125,
  },
  profileImage: {
    resizeMode: 'cover',
    height: 64,
    width: 64,
    borderRadius: 32,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  entityName: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginTop: 5,
    textAlign: 'center',
  },
  starImage: {
    resizeMode: 'cover',
    height: 10,
    width: 10,
  },
  starPoints: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.themeColor,
    marginLeft: 5,
  },
});

export default memo(TCEntityView);
