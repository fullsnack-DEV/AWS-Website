import React, {useCallback, useRef} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import ActionSheet from 'react-native-actionsheet';

import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';

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
  sportObj,
}) {
  const actionSheetSettingRef = useRef();

  const onClose = useCallback(() => {
    setTimeout(() => onModalClose(), 0);
  }, [onModalClose]);

  return (
    <View style={styles.topViewContainer}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.profileView}>
            <Image source={profileImage} style={styles.profileImage} />
          </View>
          <View style={styles.topTextContainer}>
            <Text style={styles.userNameTextStyle}>{userName}</Text>
            <Text style={styles.locationTextStyle}>{location}</Text>
          </View>
        </View>
        {isAdmin && (
          <View>
            <TouchableOpacity
              onPress={() => {
                actionSheetSettingRef.current.show();
              }}>
              <FastImage
                resizeMode={'contain'}
                source={images.SettingPrivacy}
                style={{width: 40, height: 40}}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {bookRefereeButtonVisible && (
        <TouchableOpacity onPress={onBookRefereePress} style={{marginTop: 15}}>
          <LinearGradient
            colors={
              isReferee
                ? [colors.darkThemeColor, colors.themeColor]
                : [colors.blueGradiantStart, colors.blueGradiantEnd]
            }
            style={[
              styles.containerStyle,
              {
                justifyContent: 'center',
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.challengeButtonTitle}>
                {isReferee ? 'Book Referee' : 'Book Scorekeeper'}
                <Text>{` $${feesCount} CAD / hour`}</Text>
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}

      <ActionSheet
        ref={actionSheetSettingRef}
        options={['Deactivate This Activity', strings.cancel]}
        cancelButtonIndex={1}
        // destructiveButtonIndex={2}
        onPress={(index) => {
          if (index === 0) {
            onClose(true);
            if (isReferee) {
              navigation.navigate('DeactivateSportScreen', {
                sport_name,
                sportObj,
                type:
                  (isReferee === true && 'referee') ||
                  (isReferee === false && 'scorekeeper') ||
                  'player',
              });
              console.log('setting for referee');
            } else {
              navigation.navigate('DeactivateSportScreen', {
                sport_name,
                sportObj,
                type:
                  (isReferee === true && 'referee') ||
                  (isReferee === false && 'scorekeeper') ||
                  'player',
              });
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
    backgroundColor: colors.whiteColor,
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
    shadowOffset: {width: 0, height: 3},
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

  containerStyle: {
    flexDirection: 'row',
    height: 25,
    borderRadius: 5,
    alignItems: 'center',
  },
  challengeButtonTitle: {
    color: colors.whiteColor,
    fontSize: 14,
    fontFamily: fonts.RBold,
  },
});
