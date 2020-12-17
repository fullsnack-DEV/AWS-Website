import {
  Text, TouchableOpacity, StyleSheet, View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import images from '../../../../Constants/ImagePath';
import TCStarRating from '../../../../components/TCStarRating';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';

const RenderScorekeeper = ({
  profilePic,
  name,
  fees,
  rating,
  country,
  isSelected,
  onRadioClick,
}) => (
  <View style={styles.refereeContainer}>

    {/* Profile Pic */}
    <View style={{
      flex: 0.15, paddingHorizontal: 5, justifyContent: 'center', alignItems: 'center',
    }}>
      <FastImage
                resizeMode={'contain'}
                source={profilePic ? { uri: profilePic } : images.profilePlaceHolder}
                style={styles.profilePic}
            />
    </View>

    {/*  Refree Detail */}
    <View style={{
      flex: 0.5,
      paddingHorizontal: 5,
      justifyContent: 'center',
    }}>
      {/*   Player Name */}
      <Text style={styles.refereeName}>{name}</Text>

      {/* Country */}
      <Text style={styles.countryName}>{country}</Text>

      {/* Rating */}
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <TCStarRating rating={rating} />
        <Text style={{
          marginLeft: 5, color: colors.themeColor, fontFamily: fonts.RRegular, fontSize: 12,
        }}>{rating?.toFixed(1)}</Text>
      </View>
    </View>

    {/* Referee Fees */}
    <View style={{
      flex: 0.25,
      paddingHorizontal: 5,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Text style={{ fontSize: 18, color: colors.lightBlackColor, fontFamily: fonts.RRegular }}>
        ${fees}
        <Text style={{ fontSize: 11 }}> CAD </Text>
        <Text style={{ fontSize: 10 }}>(/h)</Text>
      </Text>
    </View>

    {/* Referee Filter */}
    <View style={{
      flex: 0.1,
      paddingHorizontal: 5,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <TouchableOpacity style={{
        borderColor: colors.magnifyIconColor, height: 22, width: 22, borderWidth: 2, borderRadius: 50, alignItems: 'center', justifyContent: 'center',
      }}
        onPress={onRadioClick}>
        {isSelected && (
          <LinearGradient
                        colors={[colors.orangeColor, colors.yellowColor]}
                        end={{ x: 0.0, y: 0.25 }}
                        start={{ x: 1, y: 0.5 }}
                        style={{ height: 13, width: 13, borderRadius: 50 }}>
          </LinearGradient>
        )}
      </TouchableOpacity>
    </View>

  </View>
)

const styles = StyleSheet.create({
  refereeContainer: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: 5,
    borderBottomColor: colors.grayBackgroundColor,
    borderBottomWidth: 2,
  },
  profilePic: {
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  refereeName: {
    marginVertical: 1,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 14,
  },
  countryName: {
    marginVertical: 1,
    fontSize: 12,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
})
export default RenderScorekeeper;
