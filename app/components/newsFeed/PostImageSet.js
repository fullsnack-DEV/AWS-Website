import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import constants from '../../config/constants';
const {fonts} = constants;

function PostImageSet({data, itemNumber, totalItemNumber}) {
  return (
    <View style={styles.uploadedImage}>
      <FastImage
        style={styles.uploadedImage}
        source={{
          uri: data.thumbnail,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.lengthViewStyle}>
        <Text style={styles.lengthTextStyle}>
          {itemNumber}
          {'/'}
          {totalItemNumber}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  uploadedImage: {
    height: wp('91%'),
    width: wp('91%'),
    marginVertical: '1%',
    borderRadius: wp('4%'),
    alignSelf: 'center',
  },
  lengthViewStyle: {
    position: 'absolute',
    backgroundColor: 'red',
    alignSelf: 'flex-end',
    top: wp('5%'),
    right: wp('3%'),
    padding: wp('1.5%'),
    borderRadius: wp('5%'),
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lengthTextStyle: {
    fontSize: hp('1.9%'),
    color: '#fff',
    paddingHorizontal: wp('1.5%'),
    fontFamily: fonts.RRegular,
  },
});

export default PostImageSet;
