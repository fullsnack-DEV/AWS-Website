/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import React, {memo, useContext} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

import AuthContext from '../auth/context';

import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import {getSportName} from '../utils';
import {strings} from '../../Localization/translation';
import Verbs from '../Constants/Verbs';

const TCRecruitingPlayers = ({data, entityType, selectedSport, onPress}) => {
  const authContext = useContext(AuthContext);

  let entityName, sportText, gameFee, currency;

  if (entityType === Verbs.entityTypePlayer) {
    entityName = data.full_name;
  } else {
    entityName = data.group_name;
  }

  if (entityType === Verbs.entityTypePlayer) {
    if (selectedSport.sport !== Verbs.allVerb) {
      const filterdData = (data?.registered_sports || []).filter(
        (obj) =>
          obj.sport === selectedSport.sport &&
          obj.sport_type === selectedSport.sport_type &&
          obj?.setting?.availibility === Verbs.on,
      );
      if (filterdData.length > 0) {
        sportText = `${getSportName(filterdData[0], authContext)}`;
        gameFee = filterdData[0].setting?.game_fee?.fee;
        currency = filterdData[0].setting?.game_fee?.currency_type;
      }
    } else {
      const filterdData = (data?.registered_sports || []).filter(
        (obj) => obj?.setting?.availibility === Verbs.on,
      );

      if (filterdData.length === 1) {
        sportText = getSportName(filterdData[0], authContext);
        gameFee = filterdData?.[0]?.setting?.game_fee?.fee;
        currency = filterdData?.[0].setting?.game_fee?.currency_type;
      }
      if (filterdData.length === 2) {
        sportText = `${getSportName(
          filterdData[0],
          authContext,
        )} and  ${getSportName(filterdData[1], authContext)}`;
      }
      if (filterdData.length > 2) {
        sportText = `${getSportName(filterdData[0], authContext)} and  ${
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
    <TouchableOpacity style={{flexDirection: 'row'}} onPress={onPress}>
      <Image
        source={
          data?.thumbnail ? {uri: data?.thumbnail} : images.profilePlaceHolder
        }
        style={styles.profileImage}
      />
      <View style={{flexDirection: 'column', marginLeft: 10}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.entityTitle} numberOfLines={2}>
            {entityName}
          </Text>
          <Image
            source={
              (entityType === Verbs.entityTypeTeam && images.teamT) ||
              (entityType === Verbs.entityTypeClub && images.clubC) ||
              (entityType === Verbs.entityTypeLeague && images.leagueL)
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
            {gameFee && `${strings.levelsCount} · ${gameFee} ${currency}`}
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
