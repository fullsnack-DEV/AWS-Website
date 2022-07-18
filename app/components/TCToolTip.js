import React from 'react';
import {StyleSheet, Image} from 'react-native';

import {Tooltip, Text} from 'react-native-elements';

import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

function TCToolTip({tooltipText = '', tooltipHeight = 40, tooltipWidth = 40}) {
  return (
    <Tooltip
      popover={
        <Text
          style={{
            color: colors.whiteColor,

            fontSize: 11,
            fontFamily: fonts.RRegular,
          }}
        >
          {tooltipText}
        </Text>
      }
      height={tooltipHeight}
      width={tooltipWidth}
      backgroundColor={colors.themeColor}
      overlayColor={'transparent'}
    >
      <Image source={images.infoToolTipIcon} style={styles.infoImage} />
      {/* <Text style={ styles.whyAskingText } >Info</Text> */}
    </Tooltip>
  );
}

const styles = StyleSheet.create({
  infoImage: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginLeft: 10,
  },
});

export default TCToolTip;
