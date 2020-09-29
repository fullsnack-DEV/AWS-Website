import React from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import constants from '../../config/constants';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const {colors, fonts} = constants;
import PATH from '../../Constants/ImagePath';
import strings from '../../Constants/String';

function WritePost() {
  return (
    <View style={styles.mainContainer}>
      <Image style={styles.profileImg} source={PATH.profilePlaceHolder} />

      <Text style={styles.writePostText} onPress={() => console.log('Pressed')}>
        Write a post...
      </Text>

      <View style={styles.separatorLine}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    //backgroundColor: 'red',
    height: 70,
  },
  profileImg: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    backgroundColor: colors.themeColor,
    marginLeft: 10,
    alignSelf: 'center',
    borderRadius: 35,
    borderWidth: 1,
    borderColor: colors.whiteColor,
  },

  separatorLine: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: colors.grayColor,

    justifyContent: 'center',
    alignItems: 'center',
    width: wp('100%'),
    height: 0.5,
  },

  writePostText: {
    marginLeft: wp('2.5%'),

    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.whiteColor,

    shadowRadius: 0.5,
    shadowOffset: {width: 0, height: 1},
    shadowColor: colors.googleColor,
    shadowOpacity: 0.5,

    // fontFamily: fonts.RRegular,
    fontSize: wp('3.6%'),
    color: colors.grayColor,
    backgroundColor: colors.whiteColor,

    padding: 8,
    paddingLeft: 12,
    alignSelf: 'center',

    height: 40,
    width: wp('80%'),
  },
});

export default WritePost;
