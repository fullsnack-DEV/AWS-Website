import React, { memo } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  View,
  Text,
} from 'react-native';

import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

function ShortsCard({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <ImageBackground
        source={images.soccerBackground}
        style={styles.shortView}>
        <View
          style={{
            width: 30,
            height: 16,
            backgroundColor: colors.blackColor,
            borderRadius: 2,
            alignItems: 'center',
            position: 'absolute',
            top: 10,
            left: 15,
            right: 0,
            // bottom: 15,
          }}>

          <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 12,
              color: colors.whiteColor,
            }}>
            0:21
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            // top: 0,
            left: 15,
            right: 0,
            bottom: 15,
          }}>
          <Text
            style={{
              fontFamily: fonts.RBold,
              fontSize: 16,
              color: colors.whiteColor,
              marginBottom: 5,
            }}
            numberOfLines={2}
            >
            Champions League Champion one two
          </Text>
          <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 14,
              color: colors.whiteColor,
            }}>
            121 views
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shortView: {
    height: 250,
    width: 150,
    resizeMode: 'cover',
    borderRadius: 10,
    marginLeft: 15,
    overflow: 'hidden',

  },

});

export default memo(ShortsCard);
