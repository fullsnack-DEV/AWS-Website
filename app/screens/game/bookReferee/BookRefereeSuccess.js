import React, { useEffect } from 'react';
import {
  StyleSheet, View, Text,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts'
import images from '../../../Constants/ImagePath';

const BookRefereeSuccess = ({ navigation, route }) => {
  const navigationScreenName = route?.params?.navigationScreenName;
  useEffect(() => {
    setTimeout(() => navigation.navigate(navigationScreenName.toString()), 2000);
  })
  return (
    <View style={styles.mainContainer}>
      <FastImage
                resizeMode={FastImage.resizeMode.contain}
                source={images.refereeSucessBG}
                style={{
                  height: 1400,
                  width: 1400,
                  top: hp(-100),
                  left: wp(-100),
                }}
            />
      <LinearGradient
                colors={['rgba(255,174,1,0.85)', 'rgba(255,138,1,0.85)']}
                style={{
                  height: hp(100),
                  width: wp(100),
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
            >
        <FastImage
                    source={images.requestSentImage}
                    style={{ width: 150, height: 150 }}
                />
        <Text style={{
          color: colors.whiteColor,
          fontFamily: fonts.RBold,
          fontSize: 20,
          marginTop: 10,
          textAlign: 'center',
        }}>
          Referee booking request{'\n'}sent.
        </Text>
      </LinearGradient>

    </View>
  )
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
export default BookRefereeSuccess;
