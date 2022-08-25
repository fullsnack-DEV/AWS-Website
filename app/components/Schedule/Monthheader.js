import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import moment from 'moment';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {getHitSlop} from '../../utils';
import images from '../../Constants/ImagePath';

export default function MonthHeader({monthYear = new Date()}) {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          hitSlop={getHitSlop(15)}
          onPress={() => {
            console.log('prev press');
          }}>
          <Image
            style={[styles.icon, styles.leftIcon]}
            source={images.calNextArrow}
          />
        </TouchableOpacity>
        <Text style={styles.dateText}>
          {moment(monthYear).format('MMMM YYYY')}
        </Text>
        <TouchableOpacity
          hitSlop={getHitSlop(15)}
          onPress={() => {
            console.log('next press');
          }}>
          <Image
            style={[styles.icon, styles.leftIcon]}
            source={images.calPrevArrow}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 12,
    justifyContent: 'center',
    backgroundColor: colors.whiteColor,
  },
  mainContainer: {
    flex: 1,
    elevation: 5,
    shadowOpacity: 0.16,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 5,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 15,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
  },

  leftIcon: {
    transform: [{rotate: '180deg'}],
  },
  icon: {
    width: 15,
    height: 15,
    tintColor: colors.grayColor,
  },
});
