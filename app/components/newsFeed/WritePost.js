import React from 'react';
import {
  StyleSheet, View, Image, Text,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts';

function WritePost({ postDataItem, onWritePostPress }) {
  let userImage = '';
  if (postDataItem && postDataItem.actor && postDataItem.actor.data) {
    userImage = postDataItem.actor.data.thumbnail;
  }

  return (
    <View style={ styles.mainContainer }>
      <Image style={ styles.profileImg } source={ userImage ? { uri: userImage } : images.profilePlaceHolder } />
      <View style={styles.writePostView}>
        <Text
          style={styles.writePostText}
          onPress={onWritePostPress}>
          Write a post...
        </Text>
      </View>
      <View style={ styles.separatorLine }></View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    height: 70,
    paddingHorizontal: wp('4%'),
  },
  profileImg: {
    alignSelf: 'center',
    backgroundColor: colors.themeColor,
    borderColor: colors.whiteColor,
    borderRadius: 35,
    borderWidth: 1,
    height: hp('5%'),
    resizeMode: 'cover',
    width: hp('5%'),
  },
  separatorLine: {
    alignItems: 'center',
    backgroundColor: colors.grayColor,
    bottom: 0,
    height: 0.5,
    justifyContent: 'center',
    position: 'absolute',
    width: wp('100%'),
  },
  writePostView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 8,
    height: 40,
    marginLeft: wp('4%'),
    padding: 8,
    paddingLeft: 12,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowOpacity: 0.5,
    shadowRadius: 0.5,
    elevation: 1,
    width: wp('75%'),
  },
  writePostText: {
    color: colors.userPostTimeColor,
    fontSize: 14,
    fontFamily: fonts.RRegular,
  },
});

export default WritePost;
