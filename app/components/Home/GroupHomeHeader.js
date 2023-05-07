// @flow
import React, {useEffect, useState} from 'react';
import {View, Text, Image} from 'react-native';
import {format} from 'react-string-format';
import {strings} from '../../../Localization/translation';
import fonts from '../../Constants/Fonts';
import Verbs from '../../Constants/Verbs';
import {displayLocation} from '../../utils';
import {getSportName} from '../../utils/sportsActivityUtils';
import GroupIcon from '../GroupIcon';
import LevelBars from '../LevelBars';
import styles from './GroupHomeHeaderStyles';

const GroupHomeHeader = ({groupData = {}, sportList = [], isAdmin = false}) => {
  const [sporName, setSportName] = useState('');

  useEffect(() => {
    if (groupData.entity_type === Verbs.entityTypeClub) {
      if (groupData.sports?.length > 0) {
        let name = '';
        groupData.sports.forEach((item, index) => {
          const sportname = getSportName(
            item.sport,
            item.sport_type,
            sportList,
          );
          if (index < 4) {
            name += index !== 0 ? `, ${sportname}` : sportname;
          }
        });
        if (groupData.sports.length > 4) {
          name += ` ${format(
            strings.andMoreText,
            groupData.sports.length - 4,
          )}`;
        }
        setSportName(name);
      } else {
        setSportName('');
      }
    } else {
      const name = getSportName(
        groupData.sport,
        groupData.sport_type,
        sportList,
      );
      setSportName(name);
    }
  }, [groupData, sportList]);

  return (
    <View style={styles.parent}>
      <View style={styles.backgroundImage}>
        {groupData.background_full_image ? (
          <Image
            source={{uri: groupData.background_full_image}}
            style={[styles.image, {borderRadius: 5, resizeMode: 'cover'}]}
          />
        ) : null}
        {/* <View
          style={{
            backgroundColor: colors.whiteColor,
            opacity: 0.95,
            paddingHorizontal: 6,
            paddingVertical: 8,
            borderRadius: 5,
            marginBottom: 5,
          }}>
          <Text>222 Matches</Text>
        </View> */}
        <View style={styles.floatingContainer}>
          <GroupIcon
            imageUrl={groupData.thumbnail}
            groupName={groupData.group_name}
            containerStyle={{marginRight: 7, padding: 5}}
            entityType={groupData.entity_type}
          />
        </View>
      </View>

      <View
        style={[
          styles.row,
          {
            marginTop: 6,
            alignItems: 'flex-end',
            marginBottom: 19,
          },
        ]}>
        <View style={{width: 60}} />
        <View
          style={[
            styles.row,
            {flex: 1, justifyContent: 'space-between', marginLeft: 7},
          ]}>
          {groupData.entity_type === Verbs.entityTypeTeam && (
            <View style={!groupData.level ? {marginTop: 6} : {}}>
              {groupData.level > 0 ? (
                <LevelBars
                  level={groupData.level}
                  containerStyle={{marginBottom: 4}}
                />
              ) : null}

              <View style={styles.levelContainer}>
                <Text style={styles.newTeamText}>
                  {groupData.level > 0
                    ? `Lv.${groupData.level}`
                    : strings.newTeamText}
                </Text>
              </View>
            </View>
          )}

          <View style={[styles.row, {flex: 1, justifyContent: 'flex-end'}]}>
            <View
              style={[
                styles.row,
                {justifyContent: 'flex-end', marginRight: 10},
              ]}>
              <Text style={styles.count}>{groupData.member_count}</Text>
              <Text style={styles.label}>{strings.membersTitle}</Text>
            </View>
            <View style={[styles.row, {justifyContent: 'flex-end'}]}>
              <Text style={styles.count}>{groupData.follower_count}</Text>
              <Text style={styles.label}>{strings.followerTitleText}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{paddingHorizontal: 5}}>
        <Text style={styles.groupName}>{groupData.group_name}</Text>
        {groupData.entity_type === Verbs.entityTypeClub &&
        groupData.sports?.length > 3 ? (
          <>
            <Text
              style={[
                styles.label,
                {fontFamily: fonts.RMedium},
              ]}>{`${displayLocation(groupData)} ·`}</Text>
            <Text style={[styles.label, {fontFamily: fonts.RMedium}]}>
              {sporName}
            </Text>
          </>
        ) : (
          <Text
            style={[
              styles.label,
              {fontFamily: fonts.RMedium},
            ]}>{`${displayLocation(groupData)} · ${sporName}`}</Text>
        )}

        {isAdmin && groupData.hiringPlayers ? (
          <View style={styles.recuritingContainer}>
            <Text style={styles.recruitingText}>
              {strings.hiringPlayerTitle}
            </Text>
          </View>
        ) : null}

        {groupData.description ? (
          <Text
            style={[
              styles.label,
              groupData.hiringPlayers ? {marginTop: 10} : {marginTop: 15},
            ]}>
            {groupData.description}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default GroupHomeHeader;
