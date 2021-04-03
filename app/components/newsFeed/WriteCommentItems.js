import React from 'react';
import {
  StyleSheet, View, Text, Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import images from '../../Constants/ImagePath';
import { commentPostTimeCalculate } from '../../Constants/LoaderImages';

import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

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

  return (
    <View style={ styles.mainContainer }>
      <Image
        style={ styles.background }
        source={ !userProfile ? images.profilePlaceHolder : { uri: userProfile } }
        resizeMode={ 'cover' }
      />
      <View style={ styles.userNameView }>
        <View style={ styles.userCommentTextStyle }>
          <Text style={ styles.userNameTxt }>
            {userName}{' '}
          </Text>
          <Text style={ styles.commentTextStyle }>{commentText}</Text>
        </View>
        <Text style={ styles.activeTimeAgoTxt }>
          {commentPostTimeCalculate(commentTime)}
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
