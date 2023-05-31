import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

export default function InvoiceProgressBar({
  paidamount,
  dueamount,
  Containerstyles,
  barStyle = {},
}) {
  const CalcPercentage = (paidamount / dueamount).toFixed(2) * 100;

  return (
    <View style={Containerstyles}>
      <View
        style={[
          styles.progressBarStyle,
          {
            borderColor:
              CalcPercentage !== 100 ? colors.themeColor2 : colors.neonBlue,
            borderLeftColor:
              CalcPercentage === 0 ? colors.themeColor2 : colors.neonBlue,
          },
          {...barStyle},
        ]}>
        <View
          style={[
            styles.innerGradient,
            {
              width: `${CalcPercentage}%`,
              borderWidth: CalcPercentage === 0 ? 0 : 1,
            },
          ]}>
          {CalcPercentage > 20 && (
            <Text style={styles.textcolor}>
              {`${CalcPercentage.toFixed(0)}%`}
            </Text>
          )}
        </View>

        {CalcPercentage <= 20 && (
          <Text
            style={[
              styles.textcolor,
              {marginLeft: 5},
            ]}>{`${CalcPercentage.toFixed(0)}%`}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressBarStyle: {
    height: 20,
    backgroundColor: colors.progressBarColor,
    marginHorizontal: 15,
    borderRadius: 4,
    borderWidth: 1,

    alignItems: 'flex-start',

    flexDirection: 'row',
  },
  innerGradient: {
    height: 20,
    backgroundColor: colors.progressBarBgColor,
    borderColor: colors.neonBlue,

    borderRadius: 4,

    alignSelf: 'center',
    alignItems: 'flex-end',
  },
  textcolor: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    color: colors.neonBlue,
  },
});
