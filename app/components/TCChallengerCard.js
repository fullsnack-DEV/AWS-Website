/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import React, { memo, useContext } from 'react';
import {
 View, Text, StyleSheet, Image,TouchableOpacity
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import AuthContext from '../auth/context';

import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import { getSportName } from '../utils';

const TCChallengerCard = ({
 data, entityType, selectedSport, sportType,onPress
}) => {
  const authContext = useContext(AuthContext);

  let entityName, sportText, gameFee, currency;

  if (entityType === 'player') {
    entityName = data.full_name;
  } else {
    entityName = data.group_name;
  }

  if (entityType === 'player') {
    if (selectedSport !== 'All') {
      const filterdData = (data?.registered_sports || []).filter(
        (obj) => obj.sport === selectedSport && obj.sport_type === sportType && obj?.setting?.availibility === 'On',
      );
      console.log('filterdData', filterdData);
      if (filterdData.length > 0) {
        sportText = getSportName(filterdData[0], authContext);
        gameFee = filterdData?.[0]?.setting?.game_fee?.fee;
        currency = filterdData?.[0].setting?.game_fee?.currency_type;
      }
    } else {
      const filterdData = (data?.registered_sports || []).filter(
        (obj) => obj?.setting?.availibility === 'On',
      );
      console.log('filterdData', filterdData);

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
    sportText = getSportName(data, authContext);
    gameFee = data?.setting?.game_fee?.fee;
    currency = data?.setting?.game_fee?.currency_type;
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
      colors={[colors.localHomeGradientStart, colors.localHomeGradientEnd]}
      style={styles.gradientContainer}>
        <Image
        source={
          data?.background_thumbnail ? { uri: data?.background_thumbnail } : null
        }
        style={styles.backgroundView}
      />
        <Image source={images.localhomeOverlay} style={styles.overlayView} />
        <View
        style={{
          width: wp('40%'),
          marginLeft: 10,
          marginTop: 10,
          position: 'absolute',
        }}>
          {/* <View style={styles.bottomView}>
          <Text style={styles.levelText}>Lv.0</Text>
          <Text style={styles.textSaperator}> | </Text>
          <Text style={styles.pointView} numberOfLines={1}>
            {data?.point} points
          </Text>
        </View> */}

          <View style={{ flexDirection: 'row' }}>
            <Image
            source={
              data?.thumbnail
                ? { uri: data?.thumbnail }
                : images.profilePlaceHolder
            }
            style={styles.profileImage}
          />
            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.entityTitle} numberOfLines={2}>
                  {entityName}
                </Text>
                {entityType === 'team' && (
                  <Image
                  source={
                    (entityType === 'team' && images.teamT)
                    || (entityType === 'club' && images.clubC)
                    || (entityType === 'league' && images.leagueL)
                  }
                  style={styles.teamTImage}
                />
              )}
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
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    alignSelf: 'center',
    width: '98%',
    borderRadius: 6,
    elevation: 5,
    flexDirection: 'row',
    height: 105,

    // marginTop: 15,
  },
  backgroundView: {
    height: 105,
    width: '100%',
  },
  overlayView: {
    position: 'absolute',
    height: 105,
    width: '100%',
  },
  profileImage: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
    borderRadius: 80,
  },

  entityTitle: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
  smallTitle: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 12,
  },
  amountTitle: {
    color: colors.whiteColor,
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

export default memo(TCChallengerCard);
