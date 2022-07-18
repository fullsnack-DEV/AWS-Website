import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

const TagView = ({source, tagText, tagTextStyle}) => (
  <View style={styles.mainContainerStyle}>
    <Image source={source} style={styles.imageStyle} resizeMode={'contain'} />
    <Text style={{...styles.tagTextStyle, ...tagTextStyle}}>{tagText}</Text>
  </View>
);

const styles = StyleSheet.create({
  mainContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 10,
  },
  imageStyle: {
    height: 15,
    width: 15,
    marginRight: 7.5,
  },
  tagTextStyle: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.greeColor,
  },
});

export default TagView;
