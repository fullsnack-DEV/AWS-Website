import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import colors from '../Constants/Colors';
import { heightPercentageToDP as hp } from '../utils';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

const TCGameUserStats = ({
  profilePic = images.profilePlaceHolder,
  name,
  rightIconImage = null,
  count = '',
  countTextColor = colors.themeColor,
}) => (
  <View style={styles.mainContainer}>
    <FastImage
        resizeMode={'contain'}
        source={profilePic}
          style={styles.profilePic}
      />
    <Text style={styles.nameText}>
      {name}
    </Text>
    <FastImage
          resizeMode={'contain'}
          source={rightIconImage}
          style={styles.rightIconImage}
      />
    <Text style={{ ...styles.countText, color: countTextColor }}>
      {count}
    </Text>
  </View>
)

const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
    marginVertical: hp(1),
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.whiteColor,
    borderRadius: 15,
    elevation: 10,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 0.8,
    alignItems: 'center',
  },
  profilePic: {
    flex: 0.17,
    height: 40,
    width: 40,
  },
  nameText: {
    flex: 0.67,
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  rightIconImage: {
    flex: 0.10,
    height: 30,
    width: 30,
  },
  countText: {
    flex: 0.05,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: fonts.RBold,
  },
})
export default TCGameUserStats;
