import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'
import images from '../../Constants/ImagePath';

const DELAY_PAGE_TIME = 2000;
export default function TotalTeamsScreen({ navigation, route }) {
  useEffect(() => {
    // FastImage.preload([images.checkWhite, images.uncheckWhite]);
    setTimeout(() => {
      navigation.navigate('ChooseSportsScreen', {
        teamData: route.params.teamData,
        city: route.params.city,
        state: route.params.state,
        country: route.params.country,
      })
    }, DELAY_PAGE_TIME)
  }, [])
  return (
    <LinearGradient
          colors={[colors.themeColor1, colors.themeColor3]}
          style={styles.mainContainer}>
      <FastImage resizeMode={'stretch'} style={styles.background} source={images.loginBg} />

      <View style={ styles.sectionStyle }>
        <Image source={ images.groupIcon } style={ styles.groupsImg } />
        <Text style={ styles.LocationText }>
          <Text style={ styles.foundText }> We found </Text>
          <Text style={ styles.LocationText }>
            {route.params.totalTeams}
          </Text>
          <Text style={ styles.foundText }> teams in </Text>
          <Text style={ styles.LocationText }>{route.params.city}, {route.params.state}</Text>
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  LocationText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 25,
    marginTop: 20,
    textAlign: 'center',
    width: wp('60%'),
  },
  background: {
    height: hp('100%'),
    position: 'absolute',
    width: wp('100%'),
  },
  foundText: {
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: 25,
  },
  groupsImg: {
    height: 60,
    resizeMode: 'contain',

    width: 60,
  },

  mainContainer: {
    flex: 1,
    paddingTop: 25,
  },
  sectionStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
