import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import images from '../../../../Constants/ImagePath';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';

export default function TeamCreatedScreen({navigation, route}) {
  return (
    <View style={styles.mainContainer}>
      <Image style={styles.background} source={images.orangeLayer} />
      <Image style={styles.background} source={images.bgImage} />
      <TouchableOpacity onPress={() => navigation.navigate('AccountScreen')}>
        <Image
          source={images.backArrow}
          style={{
            marginTop: 45,
            marginLeft: 20,
            height: 20,
            width: 20,
            resizeMode: 'contain',
            tintColor: colors.whiteColor,
          }}
        />
      </TouchableOpacity>
      <View style={styles.sectionStyle}>
        <Image source={images.group_ph} style={styles.groupsImg} />

        <Text style={styles.LocationText}>
          <Text style={styles.foundText}>
            {`${route.params.groupName}\nhas been created.`}
          </Text>
        </Text>
        <TouchableOpacity
          style={styles.goToProfileButton}
          onPress={() => {
            navigation.push('HomeScreen', {
              uid: route.params.group_id,
              role: route.params.entity_type,
              backButtonVisible: true,
              menuBtnVisible: false,
              sourceScreen: 'AccountScreen',
            });
          }}
        >
          <Text style={styles.goToProfileTitle}>Go to team home</Text>
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
  groupsImg: {
    height: 60,
    resizeMode: 'contain',

    width: 60,
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
});
