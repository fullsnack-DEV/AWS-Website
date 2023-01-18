import React, {memo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

function TCTeamSearchView({onPress, showStar = false, data, isClub = false}) {
  let teamIcon = '';
  let teamImagePH = '';
  if (data.entity_type === 'team') {
    teamIcon = images.newTeamIcon;
    teamImagePH = images.teamPlaceholder;
  } else if (data.entity_type === 'club') {
    teamIcon = images.newClubIcon;
    teamImagePH = images.clubPlaceholder;
  } else if (data.entity_type === 'league') {
    teamIcon = images.myLeagues;
    teamImagePH = images.leaguePlaceholder;
  }
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.viewContainer}>
        <View style={styles.placeholderView}>
          <Image
            source={data.thumbnail ? {uri: data.thumbnail} : teamImagePH}
            style={styles.profileImage}
          />
          {data.thumbnail ? null : (
            <Text style={styles.oneCharacterText}>
              {data.group_name?.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
        <Image
          source={teamIcon}
          style={styles.teamIconStyle}
          resizeMode={'contain'}
        />
        <View
          style={{
            flexDirection: 'column',
            marginLeft: 10,
          }}>
          <Text style={styles.entityName} numberOfLines={2}>
            {data.group_name}
          </Text>

          {isClub ? (
            <Text style={styles.locationText} numberOfLines={1}>
              {data.city} · {data.sports.map((value) => value.sport).join(',')}
            </Text>
          ) : (
            <Text style={styles.locationText} numberOfLines={1}>
              {data.city} · {data.sport?.toString()}
            </Text>
          )}

          {showStar && (
            <Text style={styles.starPoints} numberOfLines={1}>
              LV 13{' '}
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
  viewContainer: {
    flexDirection: 'row',
  },
  profileImage: {
    resizeMode: 'cover',
    height: 40,
    width: 40,
    borderRadius: 80,
    marginLeft: 0,
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
  teamIconStyle: {
    height: 15,
    width: 15,
    marginTop: 20,
    marginLeft: -15,
  },
  oneCharacterText: {
    position: 'absolute',
    fontSize: 12,
    fontFamily: fonts.RBlack,
    color: colors.whiteColor,
    paddingBottom: 5,
  },
  placeholderView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    height: 40,
    width: 40,
    borderRadius: 80,
  },
});

export default memo(TCTeamSearchView);
