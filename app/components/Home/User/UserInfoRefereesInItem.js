import React from 'react';
import {
  View, Text, StyleSheet, Image,
} from 'react-native';

import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath'

export default function UserInfoRefereesInItem({
  title,
  thumbURL,
}) {
  return (
    <View>
      <View style={styles.containerStyle}>
        <Image source={images.myRefereeing} style={styles.refereeIconStyle}/>
        <Image source={thumbURL} style={styles.imageStyle}/>
        <View style={{ marginLeft: 10, marginRight: 12 }}>
          <Text style={styles.titleStyle}>
            {title}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 8,
    marginLeft: 15,
    marginBottom: 10,
    backgroundColor: colors.whiteColor,
    shadowColor: colors.blackColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    alignItems: 'center',
  },
  refereeIconStyle: {
    height: 24,
    width: 24,
    alignSelf: 'flex-start',
    marginLeft: 2,
    marginTop: 2,
    position: 'absolute',
    zIndex: 1001,
  },
  imageStyle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderColor: colors.whiteColor,
    borderWidth: 2,
    marginLeft: 8,
  },
  titleStyle: { fontFamily: fonts.RMedium, fontSize: 16 },
})
