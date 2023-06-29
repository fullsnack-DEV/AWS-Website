import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

const TagView = ({source, tagText, tagTextStyle}) => (
  <View style={styles.mainContainerStyle}>
    <View style={styles.imageStyle}>
      <Image source={source} style={styles.image} resizeMode={'contain'} />
    </View>
    <Text style={{...styles.tagTextStyle, ...tagTextStyle}}>{tagText}</Text>
  </View>
);

const styles = StyleSheet.create({
  mainContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    height: 20,
    width: 20,
    marginRight: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  tagTextStyle: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RRegular,
    color: colors.userPostTimeColor,
  },
});

export default TagView;
