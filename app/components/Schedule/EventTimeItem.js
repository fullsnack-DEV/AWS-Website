import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

function EventTimeItem({from, fromTime, to, toTime, repeat, repeatTime}) {
  return (
    <View style={styles.containerStyle}>
      <View style={styles.timeValueStyle}>
        <Text style={styles.fromTextStyle}>{from}</Text>
        <Text style={styles.fromTimeTextStyle}>{fromTime}</Text>
      </View>
      <View style={styles.timeValueStyle}>
        <Text style={styles.fromTextStyle}>{to}</Text>
        <Text style={styles.fromTimeTextStyle}>{toTime}</Text>
      </View>
      <View style={styles.timeSepratorView} />
      <View style={styles.timeValueStyle}>
        <Text style={styles.fromTextStyle}>{repeat}</Text>
        <Text style={styles.fromTimeTextStyle}>{repeatTime}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    width: wp('96%'),
  },
  timeValueStyle: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginVertical: 3,
  },
  fromTextStyle: {
    width: wp('18%'),
    fontFamily: fonts.RLight,
    fontSize: 16,
  },
  fromTimeTextStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  timeSepratorView: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
    marginRight: wp('4%'),
    marginVertical: hp('1%'),
  },
});

export default EventTimeItem;
