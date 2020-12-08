import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function CertificatesItemView({
  certificateImage,
  certificateName,
  teamTitleTextStyle,
  profileImage,
}) {
  return (

    <View>
      <Image source={certificateImage} style={[styles.profileImage, profileImage]} resizeMode={'contain'} />
      <Text style={[styles.teamTitleTextStyle, teamTitleTextStyle]}>{certificateName}</Text>
    </View>

  );
}
const styles = StyleSheet.create({
  profileImage: {
    height: 150,
    width: 195,
  },
  teamTitleTextStyle: {
    fontSize: 15,
    fontFamily: fonts.RRegular,
    color: colors.whiteColor,
    marginTop: 5,
  },
});
