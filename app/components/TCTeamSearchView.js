import React, {memo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

function TCTeamSearchView({onPress, showStar = false, data}) {
  let teamIcon = '';
  let teamImagePH = '';
  if (data.entity_type === 'team') {
    teamIcon = images.myTeams;
    teamImagePH = images.team_ph;
  } else if (data.entity_type === 'club') {
    teamIcon = images.myClubs;
    teamImagePH = images.club_ph;
  } else if (data.entity_type === 'league') {
    teamIcon = images.myLeagues;
    teamImagePH = images.leaguePlaceholder;
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.viewContainer}>
        <View style={styles.backgroundView}>
          <Image
            source={data?.thumbnail ? {uri: data?.thumbnail} : teamImagePH}
            style={styles.profileImage}
          />
        </View>
        <View style={{flexDirection: 'column', marginLeft: 5}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.entityName} numberOfLines={2}>
              {data?.group_name}
            </Text>
            <Image
              source={teamIcon}
              style={styles.teamIconStyle}
              resizeMode={'contain'}
            />
          </View>
          <Text style={styles.locationText} numberOfLines={1}>
            {data?.city} · {data?.sport?.toString()}
          </Text>
          {showStar && (
            <Text style={styles.starPoints} numberOfLines={1}>
              ★ 5{' '}
              {data.length === 1 && data?.[0]?.setting
                ? ` · ${data?.[0]?.setting?.game_fee?.fee} CAD`
                : ''}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backgroundView: {
    backgroundColor: colors.whiteColor,
    elevation: 5,
    height: 40,
    width: 40,
    borderRadius: 80,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    // backgroundColor: 'red',
    // height: 125,
  },
  profileImage: {
    resizeMode: 'cover',
    height: 36,
    width: 36,
    borderRadius: 80,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  entityName: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  locationText: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },

  starPoints: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  teamIconStyle: {
    height: 25,
    width: 25,
    left: 2,
  },
});

export default memo(TCTeamSearchView);
