import React from 'react';
import {
  StyleSheet, View, Image, Text,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import constants from '../../config/constants';
import PATH from '../../Constants/ImagePath';

const { colors } = constants;

function WritePost({ navigation, postDataItem }) {
  let userImage = '';
  if (postDataItem && postDataItem.actor && postDataItem.actor.data) {
    userImage = postDataItem.actor.data.thumbnail;
  }

  return (
      <View style={ styles.mainContainer }>
          <Image style={ styles.profileImg } source={ userImage ? { uri: userImage } : PATH.profilePlaceHolder } />

          <Text
        style={ styles.writePostText }
        onPress={ () => navigation.navigate('WritePostScreen', { postDataItem }) }>
              Write a post...
          </Text>

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

  writePostText: {
    alignSelf: 'center',

    backgroundColor: colors.whiteColor,
    borderColor: colors.whiteColor,
    borderRadius: 5,

    borderWidth: 1,
    color: colors.grayColor,
    fontSize: wp('3.6%'),
    height: 40,

    marginLeft: wp('4%'),
    padding: 8,
    paddingLeft: 12,

    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,

    shadowRadius: 0.5,
    width: wp('75%'),
  },
});

export default WritePost;
