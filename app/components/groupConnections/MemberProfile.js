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
            style={styles.topViewContainer}>
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
                <View>
                  <Text style={styles.whiteNameText} numberOfLines={1}>
                    {playerDetail.first_name} {playerDetail.last_name}
                  </Text>
                  <Text style={styles.whiteLocationText} numberOfLines={1}>
                    {playerDetail.home_city || playerDetail?.user_city}
                  </Text>
                </View>
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
            // pointerEvents={playerDetail?.connected ? 'auto' : 'none'}
            style={[
              styles.topViewContainer,
              {
                opacity: playerDetail.connected ? 1 : 0.5,
              },
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
                <View>
                  <Text style={styles.mediumNameText} numberOfLines={1}>
                    {playerDetail.first_name} {playerDetail.last_name}
                  </Text>
                  <Text style={styles.whiteLocationText} numberOfLines={1}>
                    {playerDetail.city || playerDetail?.user_city}
                  </Text>
                </View>
                {!playerDetail?.connected && (
                  <View
                    style={{
                      marginLeft: 10,
                    }}>
                    <Image
                      source={images.unlinked}
                      style={styles.unlinedImage}
                    />
                  </View>
                )}
              </View>
            </View>

            <Pressable
              pointerEvents={playerDetail?.connected ? 'auto' : 'none'}
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
    height: 40,
    resizeMode: 'cover',
    width: 40,
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
    marginBottom: 16,
    marginTop: 13,
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

    flexDirection: 'row',
    alignItems: 'center',
  },

  mediumNameText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,

    fontSize: 16,
    lineHeight: 24,
  },
  whiteNameText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,

    fontSize: 16,
    lineHeight: 24,
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
  unlinedImage: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
  },
});
