import React, { memo } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
} from 'react-native';

import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';

const UserInfoAddRole = ({
  title,
  thumbURL,
  onPress,
}) => (
  <TouchableOpacity onPress={ onPress }>
    <View style={styles.containerStyle}>
      <Image source={thumbURL} style={styles.imageStyle}/>
      <View style={{ marginLeft: 10, marginRight: 12 }}>
        <Text style={styles.titleStyle}>
          {title}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
  )

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 8,
    marginLeft: 15,
    marginBottom: 10,
    marginTop: 2,
    backgroundColor: colors.whiteColor,
    shadowColor: colors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    alignItems: 'center',
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

export default memo(UserInfoAddRole)
