import React from 'react';
import {
  StyleSheet, View, Text, Image, TouchableOpacity,
} from 'react-native';

import {
  widthPercentageToDP as wp,

} from 'react-native-responsive-screen';

import fonts from '../../../../Constants/Fonts'
import colors from '../../../../Constants/Colors'
import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';

export default function ClubCreatedScreen({ navigation, route }) {
  return (
    <View style={ styles.mainContainer }>
      <Image style={ styles.background } source={ images.orangeLayer } />
      <Image style={ styles.background } source={ images.bgImage } />
      <TouchableOpacity onPress={ () => navigation.navigate('HomeScreen') }>
        <Image
          source={ images.backArrow }
          style={ styles.backArrowButton}
        />
      </TouchableOpacity>
      <View style={ styles.sectionStyle }>
        <Image source={ images.group_ph } style={ styles.groupsImg } />

        <Text style={ styles.LocationText }>
          <Text style={ styles.foundText }>
            {route.params.groupName} has been created.
          </Text>
        </Text>
        <TouchableOpacity style={ styles.goToProfileButton }>
          <Text style={ styles.goToProfileTitle }>{strings.goToClubText}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={ styles.inviteUserButton }>
          <Text style={ styles.goToProfileTitle }>{strings.inviteUserText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  LocationText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('6.5%'),

    marginTop: 20,
    textAlign: 'center',
  },
  background: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
  },
  foundText: {
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('6.5%'),
    width: wp('70%'),
  },
  goToProfileButton: {
    alignSelf: 'center',
    borderColor: colors.whiteColor,
    borderRadius: 40,
    borderWidth: 1,
    height: 50,
    marginTop: wp('20%'),
    width: '86%',
  },

  goToProfileTitle: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 17,
    height: 50,
    padding: 12,
    textAlign: 'center',
  },
  groupsImg: {
    height: 60,
    resizeMode: 'contain',

    width: 60,
  },
  inviteUserButton: {
    alignSelf: 'center',
    borderColor: colors.whiteColor,
    borderRadius: 40,
    borderWidth: 1,
    height: 50,
    marginTop: wp('5%'),
    width: '86%',
  },

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  sectionStyle: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  backArrowButton: {
    marginTop: 45,
    marginLeft: 20,
    height: 20,
    tintColor: colors.whiteColor,
    width: 20,
    resizeMode: 'contain',
  },
});
