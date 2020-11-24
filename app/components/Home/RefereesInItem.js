import React from 'react';
import {
  StyleSheet, View, Text, Image, TouchableOpacity,
} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

function RefereesInItem({
  title, children, containerStyle, onItemPress,
}) {
  return (
    <View style={[styles.containerStyle, containerStyle]}>
      <TouchableOpacity style={styles.titleViewStyle} onPress={onItemPress}>
        <Text style={styles.headerTextStyle}>{title}</Text>
        <Image source={images.arrowGraterthan} style={styles.graterThanImageStyle} />
      </TouchableOpacity>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginTop: 15,
  },
  headerTextStyle: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    marginVertical: 3,
    color: colors.whiteColor,
  },
  titleViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  graterThanImageStyle: {
    height: 12,
    width: 10,
    marginHorizontal: 5,
    tintColor: colors.whiteColor,
  },
});

export default RefereesInItem;
