/* eslint-disable consistent-return */
import React, {useMemo} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import images from '../Constants/ImagePath';
import fonts from '../Constants/Fonts';
import colors from '../Constants/Colors';
import TCGradientButton from './TCGradientButton';

const EntityReviewView = ({
  isShowReviewButton = false,
  title,
  subTitle = '',
  profileImage,
  myUserId,
  userID,
  isReviewed = false,
  onReviewPress,
}) => {
  const renderButtons = useMemo(() => {
    if (isShowReviewButton) {
      return (
        <TCGradientButton
          onPress={onReviewPress}
          title={!isReviewed ? 'Review' : 'Edit Review'}
          startGradientColor={
            isReviewed ? colors.whiteColor : colors.darkThemeColor
          }
          endGradientColor={isReviewed ? colors.whiteColor : colors.yellowColor}
          textStyle={{
            color: isReviewed ? colors.lightBlackColor : colors.whiteColor,
            fontSize: 11,
            fontFamily: fonts.RBold,
          }}
          style={{
            display: myUserId === userID ? 'none' : 'flex',
            borderRadius: 5,
            height: 25,
            width: 75,
            borderWidth: 1,
            borderColor: isReviewed ? colors.whiteColor : colors.yellowColor,
          }}
        />
      );
    }
  }, [isReviewed, isShowReviewButton, myUserId, onReviewPress, userID]);

  return (
    <View style={{alignItems: 'center', flexDirection: 'row'}}>
      <View style={{flex: 0.15, alignItems: 'center'}}>
        <FastImage
          resizeMode={'cover'}
          source={
            profileImage ? {uri: profileImage} : images.profilePlaceHolder
          }
          style={{width: 30, height: 30, borderRadius: 25}}
        />
      </View>
      <View style={{flex: 0.6, paddingVertical: 10, justifyContent: 'center'}}>
        <Text style={{fontSize: 16, fontFamily: fonts.RMedium}}>{title}</Text>
        {subTitle !== '' && (
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.subTitleText}>{subTitle ?? ''}</Text>
          </View>
        )}
      </View>
      <View style={{flex: 0.25, alignItems: 'center'}}>
        <View>{renderButtons}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // seperateContainer: {
  //   width: '100%',
  //   alignSelf: 'center',
  //   borderWidth: 0.5,
  //   borderColor: colors.grayBackgroundColor,
  //   marginVertical: hp(0.7),
  // },
  subTitleText: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.userPostTimeColor,
  },
});
export default EntityReviewView;
