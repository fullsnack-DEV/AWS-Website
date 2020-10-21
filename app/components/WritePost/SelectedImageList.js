import React from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Image,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import fonts from '../../Constants/Fonts'
import colors from '../../Constants/Colors'
import images from '../../Constants/ImagePath'

function SelectedImageList({
  data, onItemPress, itemNumber, totalItemNumber,
}) {
  return (
    <View style={ styles.uploadedImage }>
      <FastImage
        style={ styles.uploadedImage }
        source={ { uri: data.path } }
        resizeMode={ FastImage.resizeMode.cover }
      />
      <TouchableOpacity style={ styles.cancelBtnView } onPress={ onItemPress }>
        <Image source={ images.cancelImage } style={ styles.cancelImageStyle } />
      </TouchableOpacity>
      <View style={ styles.lengthViewStyle }>
        <Text style={ styles.lengthTextStyle }>
          {itemNumber}
          {'/'}
          {totalItemNumber}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    tintColor: colors.whiteColor,
    width: 12,
  },
  lengthTextStyle: {
    color: '#fff',
    fontFamily: fonts.RRegular,
    fontSize: 12,
    paddingHorizontal: wp('1.5%'),
  },
  lengthViewStyle: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: wp('5%'),
    justifyContent: 'center',
    padding: wp('0.5%'),
    paddingVertical: wp('1%'),
    position: 'absolute',
    right: wp('1.5%'),
    top: wp('1.5%'),
  },
  uploadedImage: {
    borderRadius: wp('4%'),
    height: wp('30%'),
    marginVertical: '1%',
    width: wp('30%'),
  },
});

export default SelectedImageList;
