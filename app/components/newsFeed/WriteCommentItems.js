import React, {useState} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import PATH from '../../Constants/ImagePath';
import constants from '../../config/constants';
import { commentPostTimeCalculate } from '../../Constants/LoaderImages';
const {colors, fonts} = constants;

function WriteCommentItems({data}) {

  let commentTime = '';
  if (data && data.created_at) {
    commentTime = data.created_at;
  }

  let commentText = '';
  if (data && data.data && data.data.text) {
    commentText = data.data.text;
  }
  let userName = '',
    userProfile = '';
  if (data && data.user && data.user.data) {
    userName = data.user.data.full_name;
    userProfile = data.user.data.full_image;
  }

  // let minutes = moment(new Date()).diff(commentPostTime, 'minute');
  // let hours = moment(new Date()).diff(commentPostTime, 'hour');
  let month = moment(new Date()).diff('2020-09-10T05:26:07.423048Z', 'week');
    console.log('Month :-', data.created_at);
    // console.log('hour :-', hours);
    // console.log('Minute :-', minutes);
    // if (hours > 1 && hours < 24) {
    //     return hours + 'h ago';
    // } else if (minutes < 60) {
    //     return minutes + ' min ago';
    // }

  return (
    <View style={styles.mainContainer}>
      <Image
        style={styles.background}
        source={!userProfile ? PATH.profilePlaceHolder : {uri: userProfile}}
        resizeMode={'cover'}
      />
      <View style={styles.userNameView}>
        <View style={styles.userCommentTextStyle}>
          <Text style={styles.userNameTxt}>
            {userName}
            {'  '}
            <Text style={styles.commentTextStyle}>{commentText}</Text>
          </Text>
        </View>
        <Text style={styles.activeTimeAgoTxt}>
          {/* {moment(data.created_at).fromNow()} */}
          {commentPostTimeCalculate(data.created_at)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    margin: wp('3%'),
    marginHorizontal: wp('4%'),
  },
  background: {
    height: hp('5%'),
    width: hp('5%'),
    borderRadius: hp('2.5%'),
  },
  userNameView: {
    flexDirection: 'column',
    width: wp('70%'),
    marginLeft: wp('4%'),
  },
  userNameTxt: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  commentTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  activeTimeAgoTxt: {
    color: colors.userPostTimeColor,
    top: 2,
    fontSize: 14,
    fontFamily: fonts.RRegular,
  },
  userCommentTextStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default WriteCommentItems;
