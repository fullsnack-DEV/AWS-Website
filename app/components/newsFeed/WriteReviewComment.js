import React from 'react';
import {
  StyleSheet, View, Text,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
// import { commentPostTimeCalculate } from '../../Constants/LoaderImages';

import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

function WriteReviewComment({ data }) {
  let commentText = '';
  if (data && data.data && data.data.text) {
    commentText = data.data.text;
  }
  let userName = '';

  if (data && data.user && data.user.data) {
    userName = data.user.data.full_name;
  }

  return (

    <View style={ styles.mainContainer }>
      <View style={ styles.userNameView }>
        <View style={ styles.userCommentTextStyle }>
          <Text style={ styles.userNameTxt }>
            {userName}{' '}</Text>
          <Text style={ styles.commentTextStyle }>{commentText}</Text>

        </View>

      </View>
    </View>

  );
}

const styles = StyleSheet.create({

  commentTextStyle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },
  mainContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: wp('1%'),
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

export default WriteReviewComment;
