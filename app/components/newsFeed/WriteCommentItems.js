import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import images from '../../Constants/ImagePath';
import { commentPostTimeCalculate } from '../../Constants/LoaderImages';

import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

function WriteCommentItems({ data, onProfilePress }) {
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
      <TouchableOpacity onPress={() => onProfilePress(data)}>
        <FastImage
        style={ styles.background }
        source={ !userProfile ? images.profilePlaceHolder : { uri: userProfile } }
        resizeMode={ 'cover' }
      />
      </TouchableOpacity>
      <View style={ styles.userNameView }>
        <View style={ styles.userCommentTextStyle }>
          <Text style={ styles.userNameTxt }>
            {userName}{' '} <Text style={ styles.commentTextStyle }>{commentText} </Text>
          </Text>
          <TouchableOpacity style={{ flex: 0.1, alignSelf: 'flex-start' }}>
            <FastImage
                style={styles.commentImage}
                source={images.unlikeImage}
                resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={ styles.activeTimeAgoTxt }>
            {commentPostTimeCalculate(commentTime)}
          </Text>
          <TouchableOpacity>
            <Text style={{ ...styles.activeTimeAgoTxt, marginLeft: 10, fontFamily: fonts.RBold }}>
              99 Likes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{ ...styles.activeTimeAgoTxt, marginLeft: 10, fontFamily: fonts.RBold }}>
              Reply
            </Text>
          </TouchableOpacity>
        </View>
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
    flex: 0.9,
    color: colors.extraLightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
  userNameView: {
    flexDirection: 'column',
    marginLeft: wp('4%'),
    flex: 1,
  },
  commentImage: {
    marginLeft: 15,
    height: 15,
    width: 15,
    alignSelf: 'flex-end',
  },
});

export default WriteCommentItems;
