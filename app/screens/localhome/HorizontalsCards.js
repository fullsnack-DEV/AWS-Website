import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import fonts from '../../Constants/Fonts';

import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import {strings} from '../../../Localization/translation';

export default function HorizontalsCards({
  item,
  upComingMatch = false,
  onPress,
  placeholder = false,
  isdeactivated = false,
}) {
  return (
    <View>
      <TouchableOpacity
        disabled={isdeactivated}
        onPress={onPress}
        style={[
          styles.mainContaianer,
          {
            backgroundColor: upComingMatch
              ? colors.lightYellowColor
              : colors.lightGrayBackground,
            marginTop: placeholder ? 0 : 5,
          },
        ]}>
        <View style={styles.teamContainer}>
          <FastImage source={images.teamCover} style={styles.teamImg} />
          <Text numberOfLines={1} style={styles.teamNameStyle}>
            {item.home_team.group_name}
          </Text>
        </View>

        <View>
          {upComingMatch ? (
            <Text style={styles.scoreStyleContainer}>{strings.VS}</Text>
          ) : (
            <Text style={styles.scoreStyleContainer}>
              {item.home_team_goal ?? 0} : {item.away_team_goal ?? 0}
            </Text>
          )}
        </View>
        <View style={styles.teamContainer}>
          <Text style={styles.teamNameStyle} numberOfLines={1}>
            {item.away_team.group_name}
          </Text>
          <FastImage source={images.teamCover} style={styles.teamImg} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContaianer: {
    width: 295,
    height: 25,
    marginHorizontal: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamImg: {
    height: 15,
    width: 15,
  },
  teamNameStyle: {
    width: 92,
    lineHeight: 18,
    fontSize: 14,
    fontFamily: fonts.RRegular,
    marginLeft: 5,
    color: '#333333',
  },
  scoreStyleContainer: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    lineHeight: 18,
  },
});
