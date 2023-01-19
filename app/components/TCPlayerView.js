import React, {memo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import {strings} from '../../Localization/translation';

function TCPlayerView({
  onPress,
  showStar = false,
  data,
  showSport = false,
  subTab,
}) {
  const sports = [];
  if (subTab === strings.playerTitle) {
    data.registered_sports.map((value) => sports.push(value.sport));
  } else if (subTab === strings.refereesTitle) {
    data.referee_data.map((value) => sports.push(value.sport));
  } else if (subTab === strings.scorekeeperTitle) {
    data.scorekeeper_data.map((value) => sports.push(value.sport));
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.viewContainer}>
        <Image
          source={
            data?.thumbnail ? {uri: data?.thumbnail} : images.profilePlaceHolder
          }
          style={styles.profileImage}
        />

        <View style={{flexDirection: 'column', marginLeft: 10, flex: 1}}>
          <Text style={styles.entityName} numberOfLines={2}>
            {data?.full_name}
          </Text>
          {showSport ? (
            <Text style={styles.locationText} numberOfLines={1}>
              {data?.city} · {sports.map((value) => value).join(', ')}
            </Text>
          ) : (
            <Text style={styles.locationText} numberOfLines={1}>
              {data?.city}
            </Text>
          )}
          {showStar && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {/* <Image source={images.orangeStar} style={styles.starImage} /> */}
              <Text style={styles.starPoints} numberOfLines={2}>
                ★ 5.0 · 50 CAD
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: 'row',
  },
  profileImage: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
    borderRadius: 80,
    marginLeft: 5,
  },
  entityName: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  locationText: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginTop: 1.5,
  },

  starPoints: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginTop: 1.5,
  },
});

export default memo(TCPlayerView);
