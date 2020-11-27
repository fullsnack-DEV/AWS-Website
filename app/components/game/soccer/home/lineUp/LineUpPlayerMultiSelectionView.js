import React, {

} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import images from '../../../../../Constants/ImagePath'
import colors from '../../../../../Constants/Colors'
import fonts from '../../../../../Constants/Fonts'

export default function LineUpPlayerMultiSelectionView() {
  return (
    <TouchableOpacity>
      <View style={styles.topViewContainer}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.profileView}>
            <Image source={ images.profilePlaceHolder } style={ styles.profileImage } />
          </View>
          <View style={styles.topTextContainer}>
            <Text style={styles.mediumNameText} numberOfLines={1}>{'Kishan Makani'}</Text>
            <Text style={styles.locationText} numberOfLines={1}>{'2 Forward'}</Text>
          </View>
        </View>
        <Image source={images.whiteUncheck} style={styles.checkGreenImage}/>
      </View>

      <LinearGradient
    colors={[colors.greenGradientStart, colors.greenGradientEnd]}
    style={styles.topViewContainer}
    >
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.profileView}>
            <Image source={ images.profilePlaceHolder } style={ styles.profileImage } />
          </View>
          <View style={styles.topTextContainer}>
            <Text style={styles.mediumNameTextWhite} numberOfLines={1}>{'Kishan Makani'}</Text>
            <Text style={styles.locationTextWhite} numberOfLines={1}>{'2 Forward'}</Text>
          </View>
        </View>
        <Image source={images.checkGreen} style={styles.checkGreenImage}/>
      </LinearGradient>
    </TouchableOpacity>

  );
}
const styles = StyleSheet.create({
  profileImage: {
    alignSelf: 'center',
    height: 36,
    resizeMode: 'cover',
    width: 36,
    borderRadius: 18,
  },

  topViewContainer: {
    flexDirection: 'row',
    backgroundColor: colors.offwhite,
    height: 60,
    width: ('90%'),
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 10,
    marginBottom: 10,
    marginTop: 5,

    borderRadius: 10,
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  profileView: {
    backgroundColor: colors.whiteColor,
    height: 38,
    width: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center',
  },
  topTextContainer: {
    marginLeft: 10,
    alignSelf: 'center',
  },
  mediumNameText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  mediumNameTextWhite: {
    fontSize: 16,
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
  },
  locationText: {
    fontSize: 14,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
  },
  locationTextWhite: {
    fontSize: 14,
    color: colors.whiteColor,
    fontFamily: fonts.RLight,
  },
  checkGreenImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
