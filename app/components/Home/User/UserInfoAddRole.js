import React, { memo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';

import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';

const UserInfoAddRole = ({
  title,
  onPress,
}) => (
  <TouchableOpacity onPress={ onPress }>
    <View style={styles.containerStyle}>

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
    flexDirection: 'column',
    height: 90,
    width: 90,
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
    justifyContent: 'center',
  },

  titleStyle: {
 fontFamily: fonts.RMedium, fontSize: 16, color: colors.lightBlackColor, textAlign: 'center',
 },
})

export default memo(UserInfoAddRole)
