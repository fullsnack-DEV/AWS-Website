import React from 'react';
import {
  StyleSheet, View, Image, Text, TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as Progress from 'react-native-progress';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts';

function ImageProgress({
  numberOfUploaded,
  totalUpload,
  onCancelPress,
  postDataItem,
}) {
  let userImage = '';
  if (postDataItem && postDataItem.thumbnail) {
    userImage = postDataItem.thumbnail;
  }
  return (
    <View style={ styles.mainContainer }>
      <View style={styles.viewStyle}>
        <View style={styles.profileImageViewStyle}>
          <Image style={ styles.profileImg } source={userImage ? { uri: userImage } : images.profilePlaceHolder} />
        </View>
        <View style={styles.textViewStyle}>
          <Text style={ styles.writePostText }>
            Uploading...
          </Text>
          <Text style={ styles.writePostText }>  {`${numberOfUploaded}/${totalUpload}`}</Text>
        </View>
        <TouchableOpacity style={styles.cancelTouchStyle} onPress={onCancelPress}>
          <Image style={ styles.cancelImagestyle } source={images.cancelImage} />
        </TouchableOpacity>
      </View>
      <Progress.Bar
            progress={(1 * numberOfUploaded) / totalUpload}
            width={wp('100%')}
            borderRadius={0}
            borderWidth={0}
            unfilledColor={colors.uploadUnfillColor}
            color={colors.uploadTextColor}
            />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    // flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    position: 'absolute',
    bottom: -wp('1%'),
    zIndex: 999,
  },
  viewStyle: {
    flexDirection: 'row',
    paddingHorizontal: wp('4%'),
    paddingVertical: wp('1%'),
    backgroundColor: colors.uploadBGColor,
    alignItems: 'center',
  },
  profileImageViewStyle: {
    width: wp('12%'),
  },
  profileImg: {
    // alignSelf: 'center',
    height: hp('4.5%'),
    resizeMode: 'cover',
    width: hp('4.5%'),
  },
  textViewStyle: {
    width: wp('72%'),
    marginHorizontal: wp('1%'),
    flexDirection: 'row',
  },
  writePostText: {
    alignSelf: 'center',
    color: colors.uploadTextColor,
    fontSize: 14,
    fontFamily: fonts.LRegular,
  },
  cancelImagestyle: {
    alignSelf: 'center',
    height: hp('1.6%'),
    resizeMode: 'cover',
    width: hp('1.6%'),
    tintColor: colors.uploadTextColor,
  },
  cancelTouchStyle: {
    alignSelf: 'center',
    height: hp('2.5%'),
    resizeMode: 'cover',
    width: hp('2.5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ImageProgress;
