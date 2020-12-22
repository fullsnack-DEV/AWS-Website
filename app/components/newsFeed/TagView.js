import React from 'react';
import {
  StyleSheet, View, Text, Image,
} from 'react-native';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

function TagView({
  source,
  tagText,
}) {
  return (
    <View style={styles.mainContainerStyle}>
      <Image
        source={source}
        style={styles.imageStyle}
        resizeMode={'contain'}
      />
      <Text style={styles.tagTextStyle}>{tagText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginBottom: 10,
  },
  imageStyle: {
    height: 30,
    width: 30,
  },
  tagTextStyle: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.whiteColor,
  },
});

export default TagView;
