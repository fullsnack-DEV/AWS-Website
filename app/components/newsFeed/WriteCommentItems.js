import React, { useState } from 'react';
import {
  StyleSheet, View, Text, Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import PATH from '../../Constants/ImagePath';
import constants from '../../config/constants';
import { commentPostTimeCalculate } from '../../Constants/LoaderImages';

const { colors, fonts } = constants;

function WriteCommentItems({ data }) {
  let commentTime = '';
  if (data && data.created_at) {
    commentTime = data.created_at;
  }

  let commentText = '';
  if (data && data.data && data.data.text) {
    commentText = data.data.text;
  }
  let userName = '';
  let userProfile = '';
  if (data && data.user && data.user.data) {
    userName = data.user.data.full_name;
    userProfile = data.user.data.full_image;
  }

  // let minutes = moment(new Date()).diff(commentPostTime, 'minute');
  // let hours = moment(new Date()).diff(commentPostTime, 'hour');
  const month = moment(new Date()).diff('2020-09-10T05:26:07.423048Z', 'week');
  console.log('Month :-', data.created_at);
  // console.log('hour :-', hours);
  // console.log('Minute :-', minutes);
  // if (hours > 1 && hours < 24) {
  //     return hours + 'h ago';
  // } else if (minutes < 60) {
  //     return minutes + ' min ago';
  // }

  return (
      <View style={ styles.mainContainer }>
          <Image
        style={ styles.background }
        source={ !userProfile ? PATH.profilePlaceHolder : { uri: userProfile } }
        resizeMode={ 'cover' }
      />
          <View style={ styles.userNameView }>
              <View style={ styles.userCommentTextStyle }>
                  <Text style={ styles.userNameTxt }>
                      {userName}
                      {'  '}
                      <Text style={ styles.commentTextStyle }>{commentText}</Text>
                  </Text>
              </View>
              <Text style={ styles.activeTimeAgoTxt }>
                  {/* {moment(data.created_at).fromNow()} */}
                  {commentPostTimeCalculate(data.created_at)}
              </Text>
          </View>
      </View>
  );
}

const styles = StyleSheet.create({
  activeTimeAgoTxt: {
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    top: 2,
  },
  background: {
    borderRadius: hp('2.5%'),
    height: hp('5%'),
    width: hp('5%'),
  },
  commentTextStyle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },
  mainContainer: {
    flexDirection: 'row',
    margin: wp('3%'),
    marginHorizontal: wp('4%'),
  },
  userCommentTextStyle: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userNameTxt: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
  userNameView: {
    flexDirection: 'column',
    marginLeft: wp('4%'),
    width: wp('70%'),
  },
});

export default WriteCommentItems;
