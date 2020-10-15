import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import constants from '../../config/constants';
const {fonts} = constants;

function SingleImage({data, itemNumber, totalItemNumber}) {
  return (
    <View
      style={[
        styles.uploadedImage,
        {
          height:
            data.media_height > data.media_width
              ? wp('114%')
              : data.media_height < data.media_width
              ? wp('74%')
              : wp('94%'),
        },
      ]}>
      <FastImage
        style={[
          styles.uploadedImage,
          {
            height:
              data.media_height > data.media_width
                ? wp('114%')
                : data.media_height < data.media_width
                ? wp('74%')
                : wp('94%'),
          },
        ]}
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
    height: wp('94%'),
    width: wp('94%'),
    marginVertical: '2%',
    borderRadius: wp('5%'),
    alignSelf: 'center',
  },
  lengthViewStyle: {
    position: 'absolute',
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
    fontSize: 15,
    color: '#fff',
    paddingHorizontal: wp('1.5%'),
    fontFamily: fonts.RRegular,
  },
});

export default SingleImage;
