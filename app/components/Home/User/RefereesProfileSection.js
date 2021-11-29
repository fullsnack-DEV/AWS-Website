import React, {
  useCallback,
  useRef,
} from 'react';
import {
  Text, View, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';

import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';

export default function RefereesProfileSection({
  isReferee,
  isAdmin,
  sport_name,
  feesCount,
  profileImage,
  userName,
  location,
  navigation,
  onBookRefereePress,
  onModalClose = () => {},
  bookRefereeButtonVisible = true,
}) {
  const actionSheetSettingRef = useRef();

  const onClose = useCallback(() => {
    setTimeout(() => onModalClose(), 0);
  }, [onModalClose]);

  return (
    <View style={styles.topViewContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.profileView}>
            <Image source={profileImage} style={styles.profileImage} />
          </View>
          <View style={styles.topTextContainer}>
            <Text style={styles.userNameTextStyle}>{userName}</Text>
            <Text style={styles.locationTextStyle}>{location}</Text>
          </View>
        </View>
        {isAdmin && <View>
          <TouchableOpacity onPress={() => {
            actionSheetSettingRef.current.show();
          }}>
            <FastImage
                resizeMode={'contain'}
                source={images.SettingPrivacy}
                style={{ width: 40, height: 40 }}
              />
          </TouchableOpacity>
        </View>}
      </View>
      {bookRefereeButtonVisible && (
        <TouchableOpacity
          onPress={onBookRefereePress}>
          <LinearGradient
            colors={isReferee ? [colors.themeColor, colors.yellowColor] : [colors.blueGradiantStart, colors.blueGradiantEnd]}
            style={isReferee ? styles.refereeButtonStyle : styles.scorekeeperButtonStyle}>
            <Text style={styles.editTextStyle}>
              ${feesCount} CAD (per hours)
            </Text>
            <Text style={styles.editTextStyle}>
              {isReferee ? strings.bookReferee : strings.bookScorekeeper}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      <ActionSheet
        ref={actionSheetSettingRef}
        options={['Deactivate This Activity', 'Cancel']}
        cancelButtonIndex={1}
        // destructiveButtonIndex={2}
        onPress={(index) => {
          if (index === 0) {
            onClose(true)
            if (isReferee) {
              navigation.navigate('DeactivateSportScreen', { sport_name, type: (isReferee === true && 'referee') || (isReferee === false && 'scorekeeper') || 'player' });

              console.log('setting for referee');
            } else {
              navigation.navigate('DeactivateSportScreen', { sport_name, type: (isReferee === true && 'referee') || (isReferee === false && 'scorekeeper') || 'player' });
              console.log('setting for scorekeeper');
            }
          }
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  topViewContainer: {
    backgroundColor: colors.searchGrayColor,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  profileImage: {
    alignSelf: 'center',
    height: 40,
    resizeMode: 'contain',
    width: 40,
    borderRadius: 80,
  },
  profileView: {
    backgroundColor: colors.whiteColor,
    height: 44,
    width: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  topTextContainer: {
    marginLeft: 10,
    alignSelf: 'center',
  },
  userNameTextStyle: {
    fontSize: 20,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  locationTextStyle: {
    fontSize: 14,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
  editTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
  },
  refereeButtonStyle: {
    height: 40,
    width: '98%',
    backgroundColor: colors.themeColor,
    alignSelf: 'center',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: colors.themeColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  scorekeeperButtonStyle: {
    height: 40,
    width: '98%',
    backgroundColor: colors.blueGradiantStart,
    alignSelf: 'center',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: colors.blueGradiantStart,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
});
