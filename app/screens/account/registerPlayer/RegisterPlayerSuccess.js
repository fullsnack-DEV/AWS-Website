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

const RegisterPlayerSuccess = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => navigation.navigate('HomeScreen'), 2000);
  }, [])
  return (
    <View style={styles.mainContainer}>
      <FastImage
                resizeMode={FastImage.resizeMode.stretch}
                source={images.playerSucessBG}
                style={{
                  height: hp(100),
                  width: wp(100),
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
                    source={images.profilePlaceHolder}
                    style={{ width: 60, height: 60 }}
                />
        <Text style={{
          color: colors.whiteColor,
          fontFamily: fonts.RBold,
          fontSize: 20,
          marginTop: 10,
            textAlign: 'center',
        }}>
          Registered as {'\n'}a player
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
export default RegisterPlayerSuccess;
