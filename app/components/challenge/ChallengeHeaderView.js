/* eslint-disable no-nested-ternary */
import React from 'react';
import {StyleSheet, Text, Image, View} from 'react-native';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';

export default function ChallengeHeaderView({challenger, challengee, role}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
      }}
    >
      <View>
        {/* <LinearGradient
        colors={[colors.greenGradientEnd, colors.greenGradientStart]}
        style={{
          flexDirection: 'row',
          height: 25,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 5,
          borderRadius: 5,
        }}>
          <Image source={images.challengerFlag} style={styles.iconStyle} />
          <Text style={styles.entityTitleText}>Challenger</Text>
        </LinearGradient> */}
        <Image
          source={images.challengerBadge}
          style={{
            resizeMode: 'contain',
            height: 20,
            width: 150,
            marginBottom: 5,
          }}
        />
        <View style={styles.teamView}>
          <Image
            source={
              role === 'user'
                ? challenger?.thumbnail
                  ? {uri: challenger?.thumbnail}
                  : images.profilePlaceHolder
                : challenger?.thumbnail
                ? {uri: challenger?.thumbnail}
                : images.teamPlaceholder
            }
            style={styles.teamProfileImage}
          />
          <Text numberOfLines={2} style={styles.entityNameText}>
            {challenger?.full_name ?? challenger?.group_name}
          </Text>
        </View>
      </View>
      <View
        style={{
          height: 20,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.RLight,
            color: colors.lightBlackColor,
            alignSelf: 'center',
          }}
        >
          VS
        </Text>
      </View>
      <View>
        {/* <LinearGradient
          colors={[colors.yellowColor, colors.orangeGradientColor]}
          style={{
            flexDirection: 'row',
            height: 25,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 5,
            borderRadius: 5,
          }}>
          <Image
            source={images.challengeeCup}
            style={[styles.iconStyle, { height: 10, width: 12 }]}
          />
          <Text style={styles.entityTitleText}>Challengee</Text>
        </LinearGradient> */}
        <Image
          source={images.challengeeBadge}
          style={{
            resizeMode: 'contain',
            height: 20,
            width: 150,
            marginBottom: 5,
          }}
        />
        <View style={styles.teamView}>
          <Image
            source={
              role === 'user'
                ? challengee?.thumbnail
                  ? {uri: challengee?.thumbnail}
                  : images.profilePlaceHolder
                : challengee?.thumbnail
                ? {uri: challengee?.thumbnail}
                : images.teamPlaceholder
            }
            style={styles.teamProfileImage}
          />
          <Text numberOfLines={2} style={styles.entityNameText}>
            {challengee?.full_name ?? challengee?.group_name}
          </Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  teamView: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
  },

  teamProfileImage: {
    width: 25,
    height: 25,
    resizeMode: 'cover',
    borderRadius: 50,
  },

  entityNameText: {
    flex: 1,
    fontFamily: fonts.RMedium,
    fontSize: 14,
    color: colors.lightBlackColor,
    marginLeft: 5,
  },
});
