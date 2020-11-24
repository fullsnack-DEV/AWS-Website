import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Pie from 'react-native-pie';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts';

export default function ProgressBarCircle({
  sections,
  circleInnerText,
  percentage,
}) {
  return (
    <View>
      <Pie
        radius={50}
        innerRadius={40}
        sections={sections}
        strokeCap={'butt'}
      />
      <View style={styles.winPercentageView}>
        <Text style={styles.winTextStyle}>{circleInnerText}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.percentageTextStyle}>{percentage}</Text>
          <Text style={styles.percentIconStyle}>%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  winPercentageView: {
    position: 'absolute',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winTextStyle: {
    fontSize: 12,
    fontFamily: fonts.RMedium,
    color: colors.themeColor,
  },
  percentageTextStyle: {
    fontSize: 25,
    fontFamily: fonts.RMedium,
    color: colors.themeColor,
  },
  percentIconStyle: {
    fontSize: 20,
    fontFamily: fonts.RLight,
    color: colors.themeColor,
    alignSelf: 'flex-end',
  },
});
