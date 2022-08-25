import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import moment from 'moment';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

export default function MembershipFeeView({data, onPressCard}) {
  console.log(data);
  return (
    <TouchableOpacity style={styles.viewContainer} onPress={onPressCard}>
      <View
        style={{
          width: '20%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={styles.dateView}>
          {`${moment(new Date(data.due_date * 1000)).format('MMM')}\n${moment(
            new Date(data.due_date * 1000),
          ).format('DD')}`}
        </Text>
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
          {data?.invoice_title}
        </Text>
        <Text
          style={{
            fontFamily: fonts.RMedium,
            fontSize: 14,
            color: colors.lightBlackColor,
          }}>
          ${data?.amount_paid}
          <Text
            style={{
              fontFamily: fonts.RLight,
              fontSize: 14,
              color: colors.lightBlackColor,
            }}>
            {` of $${data?.amount_due}`}
          </Text>
        </Text>
        <View style={styles.percentageView}>
          <View
            style={{
              height: 3,
              width: `${(100 * data?.amount_paid) / data?.amount_due}%`,
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
    shadowOffset: {width: 0, height: 2},
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
  dateView: {
    textAlign: 'center',
    fontFamily: fonts.RMedium,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
});
