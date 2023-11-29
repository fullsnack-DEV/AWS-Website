// @flow
import React from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

const SectionHeader = ({title = '', onNext = () => {}}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <TouchableOpacity onPress={onNext}>
      <Image source={images.accountScreenLogo} style={styles.nextArrow} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    // marginRight: 5,
  },
  nextArrow: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});
export default SectionHeader;
