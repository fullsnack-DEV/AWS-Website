/* eslint-disable consistent-return */
/* eslint-disable no-empty */
/* eslint-disable no-else-return */

import React, {useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import AuthContext from '../../auth/context';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import Verbs from '../../Constants/Verbs';

export default function ProfileCheckView({isChecked, onPress, playerDetail}) { 

  const authContext = useContext(AuthContext);


  const RenderSportDetail = () => {
    
    const sportname = playerDetail.registered_sports?.[0].sport;
    const numOfSports = playerDetail.registered_sports?.length - 1;
    const emptyString = '';

    // const capitalizeLetter = 
    //   sportname?.charAt(0).toUpperCase() + sportname?.slice(1);

    if(sportname === undefined || numOfSports.isNaN()){
      return `${emptyString}`
    }
    //! This portion is returning the sports name.
    // else if (numOfSports === 0){
    //   return `${capitalizeLetter}`;
    // }else{
    //   return `${capitalizeLetter} and ${numOfSports} more`;
    // }

  };

  const checkPrivacy = () => {
    if (
      authContext.entity.role === Verbs.entityTypeClub &&
      playerDetail.who_can_invite_for_club === 0
    ) {
      return false;
    } else if (
      authContext.entity.role === Verbs.entityTypeTeam &&
      playerDetail.who_can_invite_for_team === 0
    ) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <>
      {isChecked ? (
        <TouchableWithoutFeedback onPress={onPress}>
          <LinearGradient
            colors={[colors.whiteColor, colors.whiteColor]}
            style={styles.topViewContainer}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={
                  playerDetail.thumbnail
                    ? {uri: playerDetail.thumbnail}
                    : images.profilePlaceHolder
                }
                style={styles.profileImage}
              />

              <View style={styles.topTextContainer}>
                <Text style={styles.whiteNameText} numberOfLines={1}>
                  {playerDetail.full_name}
                </Text>
                <Text style={styles.whiteLocationText} numberOfLines={1}>
                  {playerDetail.city}
                </Text>
                <Text
                  style={[styles.locationText, {textTransform: 'capitalize'}]}
                  numberOfLines={1}>
                  {RenderSportDetail()}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={onPress}
              style={{
                height: 22,
                width: 22,
                borderWidth: StyleSheet.hairlineWidth,
                borderRadius: 7,
                borderColor: colors.veryLightGray,

                alignSelf: 'center',
              }}>
              <Image
                source={images.orangeCheckBox}
                style={styles.checkGreenImage}
              />
            </Pressable>
          </LinearGradient>
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback onPress={onPress}>
          <View
            style={[
              styles.topViewContainer,

              {opacity: checkPrivacy() ? 1 : 0.4},
            ]}
            pointerEvents={checkPrivacy() ? 'auto' : 'none'}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Image
                source={
                  playerDetail.thumbnail
                    ? {uri: playerDetail.thumbnail}
                    : images.profilePlaceHolder
                }
                style={styles.profileImage}
              />

              <View style={styles.topTextContainer}>
                <Text style={styles.mediumNameText} numberOfLines={1}>
                  {playerDetail.full_name}
                </Text>
                <Text style={styles.locationText} numberOfLines={1}>
                  {playerDetail.city}
                </Text>
                <Text style={styles.locationText} numberOfLines={1}>
                  {RenderSportDetail()}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={onPress}
              style={{
                height: 22,
                width: 22,
                borderWidth: 1,
                borderColor: colors.veryLightGray,
                borderRadius: 7,
                alignSelf: 'center',
              }}>
              <Image source={images.whiteUncheck} style={styles.checkImage} />
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  profileImage: {
    alignSelf: 'center',
    height: 42,
    resizeMode: 'cover',
    width: 42,
    borderRadius: 50,
  },

  topViewContainer: {
    flexDirection: 'row',
    height: 50,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 10,
    marginBottom: 12,
    marginTop: 12,
    borderRadius: 10,
    // backgroundColor:'red'
  },

  topTextContainer: {
    marginLeft: 10,
    marginTop:15,
    alignSelf: 'center',
  },

  mediumNameText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  whiteNameText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  locationText: {
    fontSize: 14,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
  },
  whiteLocationText: {
    fontSize: 14,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
  },
  checkImage: {
    height: 22,
    width: 22,
    paddingVertical: 1,
    alignSelf: 'center',
  },
  checkGreenImage: {
    height: 22,
    width: 22,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
});