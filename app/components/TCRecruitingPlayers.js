/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import React, { memo } from 'react';
import {
 View, Text, StyleSheet, Image, TouchableOpacity,
 } from 'react-native';

import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

const TCRecruitingPlayers = ({
 data, entityType, selectedSport, onPress,
 }) => {
  let entityName, sportText, gameFee, currency;

  if (entityType === 'player') {
    entityName = data.full_name;
  } else {
    entityName = data.group_name;
  }

  if (entityType === 'player') {
    if (selectedSport !== 'All') {
      const filterdData = (data?.registered_sports || []).filter(
        (obj) => obj.sport_name.toLowerCase() === selectedSport.toLowerCase()
          && obj?.setting?.availibility === 'On',
      );
      console.log('filterdData', filterdData);
      if (filterdData.length > 0) {
        sportText = `${filterdData[0].sport_name}`;
        gameFee = filterdData?.[0]?.setting?.game_fee?.fee;
        currency = filterdData?.[0].setting?.game_fee?.currency_type;
      }
    } else {
      const filterdData = (data?.registered_sports || []).filter(
        (obj) => obj?.setting?.availibility === 'On',
      );
      console.log('filterdData', filterdData);

      if (filterdData.length === 1) {
        sportText = filterdData?.[0]?.sport_name;
        gameFee = filterdData?.[0]?.setting?.game_fee?.fee;
        currency = filterdData?.[0].setting?.game_fee?.currency_type;
      }
      if (filterdData.length === 2) {
        sportText = `${filterdData?.[0]?.sport_name} and  ${filterdData?.[1]?.sport_name}`;
      }
      if (filterdData.length > 2) {
        sportText = `${filterdData?.[0]?.sport_name} and  ${
          filterdData.length - 1
        } more`;
      }
    }
  } else {
    sportText = data.sport;
    gameFee = data?.setting?.game_fee?.fee;
    currency = data?.setting?.game_fee?.currency_type;
  }

  console.log(entityType);

  return (
    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={onPress}>
      <Image
        source={
          data?.thumbnail ? { uri: data?.thumbnail } : images.profilePlaceHolder
        }
        style={styles.profileImage}
      />
      <View style={{ flexDirection: 'column', marginLeft: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.entityTitle} numberOfLines={2}>
            {entityName}
          </Text>
          <Image
              source={
                (entityType === 'team' && images.teamT)
                || (entityType === 'club' && images.clubC)
                || (entityType === 'league' && images.leagueL)
              }
              style={styles.teamTImage}
            />
        </View>
        <View>
          <Text style={styles.smallTitle} numberOfLines={2}>
            {data?.city} · {sportText}
          </Text>
        </View>
        <View>
          <Text style={styles.amountTitle} numberOfLines={2}>
            {gameFee && `LV 13 · ${gameFee} ${currency}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  },
  smallTitle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 12,
  },
  amountTitle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 12,
  },

  teamTImage: {
    resizeMode: 'contain',
    marginLeft: 5,
    // alignSelf: 'center',
    height: 15,
    width: 15,
  },
});

export default memo(TCRecruitingPlayers);
