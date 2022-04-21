import React, { memo } from 'react';
import {
 StyleSheet, View, Text,
 } from 'react-native';

import { TouchableOpacity } from 'react-native-gesture-handler';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

function millisToMinutesAndSeconds(millis) {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function ShortsCard({ onPress, cardItem }) {
  const json = JSON.parse(cardItem.object) ?? {};
  console.log('json?.attachments?.[0]?.thumbnail:=>', json?.attachments?.[0]?.thumbnail);
  return (
    <TouchableOpacity onPress={() => onPress({ cardItem }) }>
      <View>
        <Video
        source={{ uri: json?.attachments?.[0]?.thumbnail }}
        style={styles.shortView}
        resizeMode={'cover'}
        paused={true}
      />
        <View style={styles.durationContainer}>
          <Text style={styles.durationLable}>
            {millisToMinutesAndSeconds(json?.attachments?.[0]?.duration)}
          </Text>
        </View>
        <LinearGradient
          colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.3)']}
          style={styles.overlayStyle}>
          <Text style={styles.entityLable} numberOfLines={2}>
            {cardItem?.actor?.data?.entity_type === 'player'
            ? cardItem?.actor?.data?.full_name
            : cardItem?.actor?.data?.group_name}
          </Text>
          <Text style={styles.viewsLable}>121 views</Text>
        </LinearGradient>
      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shortView: {
    height: 250,
    width: 150,
    resizeMode: 'cover',
    borderRadius: 5,
    marginLeft: 15,
    overflow: 'hidden',
  },
  durationLable: {
    fontFamily: fonts.RRegular,
    fontSize: 12,
    color: colors.whiteColor,

  },
  entityLable: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.whiteColor,
    marginBottom: 5,
    marginLeft: 8,
    marginTop: 15,
  },
  viewsLable: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.whiteColor,
    marginLeft: 8,
    paddingBottom: 15,
  },
  // shortsTextContainer: {
  //   position: 'absolute',
  //   // top: 0,
  //   left: 15,
  //   right: 0,
  //   bottom: 15,
  // },
  overlayStyle: {
    position: 'absolute',
    // top: 0,
    left: 15,
    right: 0,
    bottom: 0,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  durationContainer: {
    width: 30,
    height: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

    borderRadius: 4,
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    left: 22,
    right: 0,

    // bottom: 15,
  },
});

export default memo(ShortsCard);
