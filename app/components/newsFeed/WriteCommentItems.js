import React, {useState} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import PATH from '../../Constants/ImagePath';
import constants from '../../config/constants';
const {colors, fonts} = constants;

function WriteCommentItems({data}) {
  console.log('Data :-', data);
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
          {moment(data.created_at).fromNow()}
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
