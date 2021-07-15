import React from 'react';
import {
 View, StyleSheet, Text, Image, TouchableOpacity,
 } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';

export default function BatchDetailView({ data, onPressCard }) {
  console.log(data);
  return (
    <TouchableOpacity style={styles.viewContainer} onPress={onPressCard}>
      <View
        style={{
          width: '20%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={styles.profileContainer}>
          <Image source={images.dummyPhoto} style={styles.townsCupPlusIcon} />
        </View>
      </View>
      <View
        style={{
          width: '80%',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontFamily: fonts.RMedium,
            fontSize: 16,
            color: colors.lightBlackColor,
          }}>
          {'Michael Jordan'}
        </Text>
        <Text
          style={{
            fontFamily: fonts.RMedium,
            fontSize: 14,
            color: colors.lightBlackColor,
          }}>
          $25.00
          <Text
            style={{
              fontFamily: fonts.RLight,
              fontSize: 14,
              color: colors.lightBlackColor,
            }}>
            {' '}
            of $25.00
          </Text>
        </Text>

        <View style={styles.percentageView}>
          <View
            style={{
              height: 3,
              width: '10%',
              backgroundColor: colors.greeColor,
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    backgroundColor: colors.offwhite,
    flexDirection: 'row',
    borderRadius: wp('2%'),
    justifyContent: 'space-between',

    marginBottom: 15,
    width: wp('90%'),
    height: 85,
    alignSelf: 'center',

    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  percentageView: {
    height: 3,
    backgroundColor: colors.thinDividerColor,
    marginRight: 30,
    marginTop: 10,
  },
  townsCupPlusIcon: {
    resizeMode: 'contain',
    height: 43,
    width: 43,
    alignSelf: 'center',
    borderRadius: 86,
  },
  profileContainer: {
    height: 45,
    width: 45,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
});
