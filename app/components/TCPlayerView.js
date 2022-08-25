import React, {memo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

function TCPlayerView({onPress, showStar = false, data}) {
  console.log('Player data:=>', data);
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.viewContainer}>
        <View style={styles.backgroundView}>
          <Image
            source={
              data?.thumbnail
                ? {uri: data?.thumbnail}
                : images.profilePlaceHolder
            }
            style={styles.profileImage}
          />
        </View>
        <View style={{flexDirection: 'column', marginLeft: 5, flex: 1}}>
          <Text style={styles.entityName} numberOfLines={2}>
            {data?.full_name}
          </Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {data?.city} ·{' '}
            {data?.sports.map((value) => value.sport_name).join(', ')}
          </Text>
        </View>
        {showStar && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}>
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
    height: 40,
    width: 40,
    borderRadius: 80,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    // backgroundColor: 'red',
    // height: 125,
  },
  profileImage: {
    resizeMode: 'cover',
    height: 36,
    width: 36,
    borderRadius: 80,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  entityName: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  locationText: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
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

export default memo(TCPlayerView);
