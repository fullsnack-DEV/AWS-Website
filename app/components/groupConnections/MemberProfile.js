import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

export default function MemberProfile({isChecked, onPress, playerDetail}) {
  return (
    <>
      {isChecked ? (
        <TouchableWithoutFeedback
          onPress={onPress}
          disabled={!playerDetail.connected}>
          <LinearGradient
            colors={[colors.whiteColor, colors.whiteColor]}
            style={[
              styles.topViewContainer,
              {opacity: playerDetail.connected ? 1 : 0.5},
            ]}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.profileView}>
                <Image
                  source={
                    playerDetail.thumbnail
                      ? {uri: playerDetail.thumbnail}
                      : images.profilePlaceHolder
                  }
                  style={styles.profileImage}
                />
              </View>
              <View style={styles.topTextContainer}>
                <Text style={styles.whiteNameText} numberOfLines={1}>
                  {playerDetail.first_name} {playerDetail.last_name}
                </Text>
                <Text style={styles.whiteLocationText} numberOfLines={1}>
                  {playerDetail.city}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={onPress}
              style={{
                height: 22,
                width: 22,
                borderWidth: 0.3,
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
        <TouchableWithoutFeedback
          onPress={onPress}
          disabled={!playerDetail.connected}>
          <View
            style={[
              styles.topViewContainer,
              {opacity: playerDetail.connected ? 1 : 0.5},
            ]}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.profileView}>
                <Image
                  source={
                    playerDetail.thumbnail
                      ? {uri: playerDetail.thumbnail}
                      : images.profilePlaceHolder
                  }
                  style={styles.profileImage}
                />
              </View>
              <View style={styles.topTextContainer}>
                <Text style={styles.mediumNameText} numberOfLines={1}>
                  {playerDetail.first_name} {playerDetail.last_name}
                </Text>
                <Text style={styles.locationText} numberOfLines={1}>
                  {playerDetail.city}
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
    height: 36,
    resizeMode: 'cover',
    width: 36,
    borderRadius: 18,
  },

  topViewContainer: {
    flexDirection: 'row',
    height: 60,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 10,
    marginBottom: 10,

    borderRadius: 10,
  },
  profileView: {
    backgroundColor: colors.whiteColor,
    height: 38,
    width: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  topTextContainer: {
    marginLeft: 10,
    alignSelf: 'center',
  },

  mediumNameText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  whiteNameText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.Roboto,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
  },
  locationText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.Roboto,
    fontWeight: '300',
    fontSize: 14,
    lineHeight: 21,
  },
  whiteLocationText: {
    fontSize: 14,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
  },
  checkImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  checkGreenImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
