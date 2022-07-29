import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import TCToolTip from './TCToolTip';

function TCChallengeTitle({
  title,
  titleStyle,
  value,
  staticValueText = '',
  valueStyle,
  tooltipText = '',
  tooltipHeight = 40,
  tooltipWidth = 40,
  isEdit = false,
  onEditPress,
  containerStyle,
  isNew = false,
  ...otherProps
}) {
  return (
    <View style={[styles.mainViewContainer, containerStyle]}>
      <Text style={[styles.labelText, titleStyle]} {...otherProps}>
        {title}
        {isNew && (
          <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 14,
              color: colors.darkThemeColor,
            }}>
            {'  new'}
          </Text>
        )}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={[styles.valueText, valueStyle]}>{value}</Text>
        <Text style={styles.staticValueText}>{staticValueText}</Text>
        {tooltipText !== '' && (
          <TCToolTip
            tooltipText={tooltipText}
            tooltipHeight={tooltipHeight}
            tooltipWidth={tooltipWidth}
          />
        )}
        {isEdit && (
          <Text
            style={{color: colors.themeColor, marginLeft: 10}}
            onPress={onEditPress}>
            Edit
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelText: {
    color: colors.lightBlackColor,
    fontSize: 20,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
  },
  valueText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  mainViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 15,
  },

  staticValueText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});

export default TCChallengeTitle;
