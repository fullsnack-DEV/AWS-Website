import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

export default function ProfileCheckView({isChecked, onPress, playerDetail}) {
  console.log('player detail :=>', playerDetail);
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
              </View>
            </View>
            <Image
              source={images.orangeCheckBox}
              style={styles.checkGreenImage}
            />
          </LinearGradient>
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback onPress={onPress}>
          <View style={styles.topViewContainer}>
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
                <Text style={styles.mediumNameText} numberOfLines={1}>
                  {playerDetail.full_name}
                </Text>
                <Text style={styles.locationText} numberOfLines={1}>
                  {playerDetail.city}
                </Text>
              </View>
            </View>
            <Image source={images.whiteUncheck} style={styles.checkImage} />
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
    marginBottom: 10,

    borderRadius: 10,
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
