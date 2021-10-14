import React, { memo } from 'react';
import {
 View, Text, TouchableOpacity, StyleSheet, Image,
 } from 'react-native';

import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

function TCRefereeView({
 onPress, showStar = false, data, sport,
 }) {
  let sportObj = data?.referee_data?.filter(
    (o) => o?.sport_name?.toLowerCase() === sport?.toLowerCase(),
  );
  if (sportObj.length === 1) {
    sportObj = data?.referee_data?.filter(
      (o) => o?.sport_name?.toLowerCase() === sport?.toLowerCase(),
    );
  } else {
    sportObj = data?.referee_data;
  }
  console.log('referee sport data:=>', sportObj);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.viewContainer}>
        <View style={styles.backgroundView}>
          <Image
            source={
              data?.thumbnail
                ? { uri: data?.thumbnail }
                : images.profilePlaceHolder
            }
            style={styles.profileImage}
          />
        </View>
        <View style={{ flexDirection: 'column', marginLeft: 5 }}>
          <Text style={styles.entityName} numberOfLines={2}>
            {data?.full_name}
          </Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {data?.city}
            {sportObj.length === 1
              ? ` · ${sportObj?.[0]?.sport_name}`
              : ''}
          </Text>
          {showStar && (
            <Text style={styles.starPoints} numberOfLines={1}>
              ★ 5.0 {sportObj.length === 1 && sportObj?.[0]?.setting ? ` · ${sportObj?.[0]?.setting?.game_fee?.fee} CAD` : ''}
            </Text>
          )}
        </View>
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
    shadowOffset: { width: 0, height: 5 },
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
    shadowOffset: { width: 0, height: 5 },
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

  starPoints: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});

export default memo(TCRefereeView);
