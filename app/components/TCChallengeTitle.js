import React from 'react';
import {
 StyleSheet, Text, View, Image,
 } from 'react-native';

import { Tooltip } from 'react-native-elements';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

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
  ...otherProps
}) {
  return (
    <View style={[styles.mainViewContainer, containerStyle]}>
      <Text style={[styles.labelText, titleStyle]} {...otherProps}>
        {title}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={[styles.valueText, valueStyle]}>{value}</Text><Text style={styles.staticValueText}>{staticValueText}</Text>
        {tooltipText !== '' && (
          <Tooltip
            popover={
              <Text
                style={{
                  color: colors.whiteColor,

                  fontSize: 11,
                  fontFamily: fonts.RRegular,
                }}>
                {tooltipText}
              </Text>
            }
            height={tooltipHeight}
            width={tooltipWidth}
            backgroundColor={colors.themeColor}
            overlayColor={'transparent'}
            skipAndroidStatusBar={true}>
            <Image source={images.infoToolTipIcon} style={styles.infoImage} />
            {/* <Text style={ styles.whyAskingText } >Info</Text> */}
          </Tooltip>
        )}
        {isEdit && (
          <Text
            style={{ color: colors.themeColor, marginLeft: 10 }}
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
  infoImage: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  staticValueText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
});

export default TCChallengeTitle;
