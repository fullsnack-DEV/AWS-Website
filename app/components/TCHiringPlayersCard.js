/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import React, {memo, useContext} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

import AuthContext from '../auth/context';

import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import {getSportName} from '../utils';

const TCHiringPlayerCard = ({
  data,
  entityType,
  selectedSport,
  sportType,
  onPress,
}) => {
  const authContext = useContext(AuthContext);

  let entityName, sportText;

  if (entityType === 'player') {
    entityName = data.full_name;
  } else {
    entityName = data.group_name;
  }

  if (entityType === 'player') {
    if (selectedSport !== 'All') {
      const filterdData = (data?.registered_sports || []).filter(
        (obj) =>
          obj.sport === selectedSport &&
          obj.sport_type === sportType &&
          obj?.setting?.availibility === 'On',
      );
      console.log('filterdData', filterdData);
      if (filterdData.length > 0) {
        sportText = getSportName(filterdData[0], authContext);
      }
    } else {
      const filterdData = (data?.registered_sports || []).filter(
        (obj) => obj?.setting?.availibility === 'On',
      );
      console.log('filterdData', filterdData);

      if (filterdData.length === 1) {
        sportText = getSportName(filterdData[0], authContext);
      }
      if (filterdData.length === 2) {
        sportText = `${getSportName(filterdData[0], authContext)}`;
      }
      if (filterdData.length > 2) {
        sportText = `${getSportName(filterdData[0], authContext)} and  ${
          filterdData.length - 1
        } more`;
      }
    }
  } else {
    sportText = getSportName(data, authContext);
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.gradientContainer}>
      <View style={styles.gradientContainer}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginRight: 10,
              marginLeft: 10,
            }}>
            <Image
              source={
                data?.thumbnail
                  ? {uri: data?.thumbnail}
                  : images.profilePlaceHolder
              }
              style={styles.profileImage}
            />
            <View style={{width: 100}}>
              <Text style={styles.entityTitle} numberOfLines={2}>
                {entityName}
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: colors.grayBackgroundColor,
              margin: 10,
            }}
          />
          <View style={{flexDirection: 'column', marginLeft: 10, flex: 1}}>
            <View>
              <Text style={styles.smallTitle} numberOfLines={2}>
                {data?.city} {data?.state_abbr}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.amountTitle} numberOfLines={2}>
                LV 13
              </Text>
              <Text style={styles.sportTitle} numberOfLines={2}>
                {sportText}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    width: 165,
    borderRadius: 6,
    elevation: 5,
    flexDirection: 'row',
    height: 105,
    backgroundColor: colors.whiteColor,
    shadowOpacity: 0.16,
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 5,
    // marginTop: 15,
  },
  profileImage: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
    borderRadius: 80,
  },

  entityTitle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
    marginLeft: 5,
  },
  smallTitle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
  },
  sportTitle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
    marginLeft: 5,
  },
  amountTitle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
  },
});

export default memo(TCHiringPlayerCard);
