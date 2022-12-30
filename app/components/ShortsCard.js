import React, {memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';

import {TouchableOpacity} from 'react-native-gesture-handler';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import images from '../Constants/ImagePath';

function millisToMinutesAndSeconds(millis) {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function ShortsCard({onPress, cardItem}) {
  const json = JSON.parse(cardItem.object) ?? {};
  return (
    <TouchableOpacity onPress={() => onPress({cardItem})}>
      <View>
        <Video
          source={{uri: json?.attachments?.[0]?.thumbnail}}
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
          <Text style={styles.viewsLable}>121 views</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 20,
              marginRight: 15,
              paddingBottom: 5,
            }}>
            <View
              style={{
                backgroundColor: colors.whiteColor,
                height: 32,
                width: 32,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 64,
              }}>
              <FastImage
                source={
                  cardItem?.actor?.data?.thumbnail
                    ? {uri: cardItem?.actor?.data?.thumbnail}
                    : images.teamPlaceholder
                }
                style={styles.profileImage}
              />
            </View>
            <Text style={styles.entityLable} numberOfLines={2}>
              {cardItem?.actor?.data?.full_name}
            </Text>
          </View>
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
    fontSize: 14,
    color: colors.whiteColor,
    marginLeft: 8,
    width: '90%',
  },
  viewsLable: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.whiteColor,
    marginLeft: 8,
    paddingBottom: 5,
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
  profileImage: {
    height: 30,
    width: 30,
    resizeMode: 'cover',

    borderRadius: 15,
  },
});

export default memo(ShortsCard);
