import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../config/constants';

const { colors, fonts, urls} = constants;
import PATH from "../../Constants/ImagePath"
import strings from "../../Constants/String"
export default function NewsFeedList() {
  return (
      <View>
    <View style={styles.mainContainer}>
      <Image style={styles.background} source={PATH.profilePlaceHolder}></Image>
      <View style={{flexDirection:"column"}}>
      <Text style={{marginLeft:wp("2%"),fontFamily:fonts.LBold}}> Naymer JR</Text>
      <Text style={{marginLeft:wp("2%"),color:"grey",top:4}}> 2m ago</Text>

    </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    marginTop:hp("3%"),
    marginLeft:wp("3%")
  },
  background: {
    height: hp('5%'),
    width: wp('10%'),
    resizeMode: 'stretch',
  },
});
