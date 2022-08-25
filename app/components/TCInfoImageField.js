import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

export default function TCInfoImageField({
  title,
  image,
  name,
  color = colors.lightBlackColor,
  ...Props
}) {
  return (
    <View style={[styles.fieldView, Props]}>
      <Text style={styles.fieldTitle} numberOfLines={2}>
        {title}
      </Text>
      <View style={styles.fieldValue}>
        <Image source={image} style={styles.imageView} />
        <Text
          style={{
            marginLeft: 5,
            fontFamily: fonts.RMedium,
            fontSize: 16,
            color,
          }}
          numberOfLines={1}>
          {name}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  fieldView: {
    flexDirection: 'row',
    marginLeft: 25,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  fieldTitle: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    flex: 0.3,
    paddingTop: 4,
  },
  fieldValue: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    flex: 0.7,
    marginRight: 15,
  },
  imageView: {
    width: 25,
    height: 25,
    borderRadius: 13,
    resizeMode: 'cover',
  },
});
