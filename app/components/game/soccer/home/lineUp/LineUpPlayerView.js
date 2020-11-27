import React from 'react';
import {
  Text, View, StyleSheet, Image, TouchableOpacity,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import images from '../../../../../Constants/ImagePath';
import colors from '../../../../../Constants/Colors';
import fonts from '../../../../../Constants/Fonts';
import TCMessageButton from '../../../../TCMessageButton';

export default function LineUpPlayerView({
  userData,
  onButtonPress,
  buttonType = 'nobutton',
}) {
  return (
    <TouchableOpacity>
      {userData && (
        <View style={styles.topViewContainer}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.profileView}>
              <Image
                source={
                  userData.profile.thumbnail
                    ? { uri: userData.profile.thumbnail }
                    : images.profilePlaceHolder
                }
                style={styles.profileImage}
              />
            </View>
            <View style={styles.topTextContainer}>
              <Text
                style={styles.mediumNameText}
                numberOfLines={
                1
                }>{`${userData.profile.first_name} ${userData.profile.last_name}`}</Text>
              <Text style={styles.locationText} numberOfLines={1}>
                {`${userData.profile.jersey_number || ''} ${userData.profile.positions || ''}`}
              </Text>
            </View>
          </View>
          {buttonType !== 'nobutton' && (
            //  <TouchableOpacity onPress={onButtonPress} style={styles.buttonStyle}></TouchableOpacity>
            <View style={styles.buttonStyle}>
              {buttonType === 'move' && (
                <TouchableOpacity onPress={() => onButtonPress(buttonType)}>
                  <LinearGradient
                  colors={[colors.greenGradientStart, colors.greenGradientEnd]}
                  style={styles.buttonStyle}>
                    <Text style={styles.buttonText}>{'MOVE'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              {buttonType === 'moveup' && (
                <TouchableOpacity onPress={() => onButtonPress(buttonType)}>
                  <LinearGradient
                  colors={[colors.greenGradientStart, colors.greenGradientEnd]}
                  style={styles.buttonStyle}>
                    <Text style={styles.buttonText}>{'Move up'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              {buttonType === 'movedown' && (
                <TCMessageButton
                width={70}
                height={22}
                title={'Move down'}
                onPress={() => onButtonPress(buttonType)}/>
              )}
              {buttonType === 'email' && (
                <TCMessageButton
                  width={70}
                  height={22}
                  color={colors.lightBlackColor}
                  title={'E-mail'}
                  onPress={() => onButtonPress(buttonType)}
                />
              )}
              {buttonType === 'message' && (
                <TCMessageButton
                width={70}
                height={22}
                onPress={() => onButtonPress(buttonType)}/>
              )}
              {buttonType === 'review' && (
                <TouchableOpacity onPress={() => onButtonPress(buttonType)}>
                  <LinearGradient
                  colors={[colors.yellowColor, colors.themeColor]}
                  style={styles.buttonStyle}>
                    <Text style={styles.buttonText}>{'Review'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {buttonType === 'editreview' && (
                <TCMessageButton
                  width={70}
                  height={22}
                  color={colors.themeColor}
                  title={'Edit Review'}
                  onPress={() => onButtonPress(buttonType)}
                />
              )}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
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
    backgroundColor: colors.offwhite,
    height: 60,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 10,
    marginBottom: 10,
    marginTop: 5,

    borderRadius: 10,
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  profileView: {
    backgroundColor: colors.whiteColor,
    height: 38,
    width: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
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
  locationText: {
    fontSize: 14,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
  },

  buttonStyle: {
    height: 22,
    width: 70,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    fontFamily: fonts.RBold,
    fontSize: 12,
    color: colors.whiteColor,
  },
});
