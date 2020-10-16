import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import constants from '../../config/constants';
const {fonts, colors, PATH} = constants;

function SelectedImageList({data, onItemPress, itemNumber, totalItemNumber}) {
  return (
    <View style={styles.uploadedImage}>
      <FastImage
        style={styles.uploadedImage}
        source={{uri: data.path}}
        resizeMode={FastImage.resizeMode.cover}
      />
      <TouchableOpacity style={styles.cancelBtnView} onPress={onItemPress}>
        <Image source={PATH.cancelImage} style={styles.cancelImageStyle} />
      </TouchableOpacity>
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
    height: wp('30%'),
    width: wp('30%'),
    marginVertical: '1%',
    borderRadius: wp('4%'),
  },
  cancelBtnView: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
    // alignSelf: 'flex-end',
    top: wp('1%'),
    left: wp('1%'),
    height: wp('6%'),
    width: wp('6%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelImageStyle: {
      height: 12,
      width: 12,
      tintColor: colors.whiteColor
  },
  lengthViewStyle: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: wp('1.5%'),
    right: wp('1.5%'),
    padding: wp('0.5%'),
    paddingVertical: wp('1%'),
    borderRadius: wp('5%'),
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lengthTextStyle: {
    fontSize: 12,
    color: '#fff',
    paddingHorizontal: wp('1.5%'),
    fontFamily: fonts.RRegular,
  },
});

export default SelectedImageList;
