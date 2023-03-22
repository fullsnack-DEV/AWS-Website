import React, {memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import Verbs from '../Constants/Verbs';
import {strings} from '../../Localization/translation';

function TCTeamSearchView({
  onPress,
  showStar = false,
  data,
  isClub = false,
  authContext,
  onPressChallengeButton,
  onPressJoinButton,
}) {
  let teamIcon = '';
  let teamImagePH = '';
  let isChallengeButtonShow = false;
  let isJoinButton = false;
  if (data.entity_type === Verbs.entityTypeTeam) {
    teamIcon = images.newTeamIcon;
    teamImagePH = images.teamBcgPlaceholder;
    if (authContext.entity.role === Verbs.entityTypeUser) {
      isJoinButton = true;
    } else if (
      authContext.entity.role === Verbs.entityTypeTeam &&
      data.setting?.availibility === 'On' &&
      authContext.entity.obj.sport === data.sport &&
      authContext.entity.uid !== data.group_id
    ) {
      isChallengeButtonShow = true;
    }
  } else if (data.entity_type === Verbs.entityTypeClub) {
    teamIcon = images.newClubIcon;
    teamImagePH = images.clubBcgPlaceholder;
    if (authContext.entity.role === Verbs.entityTypeUser) {
      isJoinButton = true;
    }
  } else if (data.entity_type === Verbs.entityTypeLeague) {
    teamIcon = images.myLeagues;
    teamImagePH = images.leaguePlaceholder;
  }
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.viewContainer}>
        <View style={styles.placeholderView}>
          <Image
            source={data.thumbnail ? {uri: data.thumbnail} : teamImagePH}
            // style={styles.profileImage}
            style={[
              styles.placeHolderImg,
              data.thumbnail ? styles.profileImage : styles.placeHolderImg,
            ]}
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
            flex: 1,
          }}>
          <Text style={styles.entityName} numberOfLines={2}>
            {data.group_name}
          </Text>

          {isClub ? (
            <Text style={styles.locationText} numberOfLines={1}>
              {data.city} ·{' '}
              {data.sports
                .map(
                  (value) =>
                    value.sport?.charAt(0).toUpperCase() +
                    value.sport?.slice(1),
                )
                .join(',')}
            </Text>
          ) : (
            <Text style={styles.locationText} numberOfLines={1}>
              {data.city} ·{' '}
              {data.sport?.charAt(0).toUpperCase() + data.sport?.slice(1)}
            </Text>
          )}

          {showStar && (
            <Text style={styles.starPoints} numberOfLines={1}>
              LV {data.point}
              {' · '}
              {data.setting?.game_fee?.fee}{' '}
              {data.setting?.game_fee?.currency_type}
              {/* {data.length === 1 && data[0].setting
                ? ` · ${data[0].setting.game_fee?.fee} ${
                    data[0].setting.game_fee?.currency_type ??
                    strings.defaultCurrency
                  }`
                : ''} */}
            </Text>
          )}
        </View>
        {isJoinButton && (
          <TouchableWithoutFeedback
            onPress={() => {
              onPressJoinButton(data.group_id);
            }}>
            <View
              style={{
                backgroundColor: '#FF7F00',
                width: 74,
                height: 25,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.challengeBtn}>{strings.join}</Text>
            </View>
          </TouchableWithoutFeedback>
        )}
        {isChallengeButtonShow && (
          <TouchableWithoutFeedback
            onPress={() => {
              onPressChallengeButton(data);
            }}>
            <View
              style={{
                backgroundColor: '#FF7F00',
                width: 74,
                height: 25,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.challengeBtn}>{strings.challenge}</Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    resizeMode: 'cover',
    height: 40,
    width: 40,
    borderRadius: 80,
    backgroundColor: '#00000000',
  },
  placeHolderImg: {
    height: 32,
    width: 26.5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    resizeMode: 'cover',
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
    marginTop: 24.75,
    marginLeft: -15,
  },
  oneCharacterText: {
    position: 'absolute',
    fontSize: 12,
    fontFamily: fonts.RBlack,
    color: colors.whiteColor,
    paddingBottom: 5,
    justifyContent: 'center',
  },
  placeholderView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: colors.whiteColor,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  challengeBtn: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
  },
});

export default memo(TCTeamSearchView);
