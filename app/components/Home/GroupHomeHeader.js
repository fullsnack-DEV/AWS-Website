// @flow
import ReadMore from '@fawazahmed/react-native-read-more';
import React, {useEffect, useState} from 'react';
import {View, Text, Image, Pressable, StyleSheet} from 'react-native';
import {strings} from '../../../Localization/translation';
import fonts from '../../Constants/Fonts';
import Verbs from '../../Constants/Verbs';
import {displayLocation} from '../../utils';
import {getGroupSportName} from '../../utils/sportsActivityUtils';
import GroupIcon from '../GroupIcon';
import LevelBars from '../LevelBars';
import styles from './GroupHomeHeaderStyles';

const GroupHomeHeader = ({
  groupData = {},
  sportList = [],
  isAdmin = false,
  onClickMembers = () => {},
  onClickFollowers = () => {},
  memberPrivacyStatus = true,
  followerPrivacyStatus = true,
}) => {
  const [sporName, setSportName] = useState('');

  useEffect(() => {
    setSportName(getGroupSportName(groupData, sportList, 4));
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

        <View style={styles.floatingContainer}>
          <GroupIcon
            imageUrl={groupData.thumbnail}
            groupName={groupData.group_name}
            containerStyle={{
              marginRight: 7,
              borderWidth: StyleSheet.hairlineWidth,
            }}
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

            {
              flex: 1,
              justifyContent: 'space-between',
              marginLeft: 7,
            },
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
                    : strings.newTextTitleCase}
                </Text>
              </View>
            </View>
          )}

          <View
            style={[
              styles.row,
              {
                justifyContent: 'flex-end',
                flexShrink: 1,
                paddingLeft: 5,
                marginLeft: 5,
              },
            ]}>
            {memberPrivacyStatus ? (
              <Pressable
                style={[
                  styles.row,
                  {
                    justifyContent: 'flex-end',
                    marginRight: 10,
                  },
                ]}
                onPress={onClickMembers}>
                <Text style={styles.count} allowFontScaling>
                  {groupData.member_count}
                </Text>
                <Text allowFontScaling style={[styles.label, {flexShrink: 1}]}>
                  {strings.membersTitle}
                </Text>
              </Pressable>
            ) : null}
            {followerPrivacyStatus ? (
              <Pressable
                style={[styles.row, {justifyContent: 'flex-end'}]}
                onPress={onClickFollowers}>
                <Text style={styles.count}>{groupData.follower_count}</Text>
                <Text style={styles.label}>{strings.followerTitleText}</Text>
              </Pressable>
            ) : null}
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

        {groupData.bio ? (
          <ReadMore
            numberOfLines={3}
            style={[
              styles.label,
              groupData.hiringPlayers ? {marginTop: 10} : {marginTop: 15},
            ]}
            seeMoreText={strings.moreText}
            seeLessText={strings.lessText}
            seeLessStyle={styles.moreLessText}
            seeMoreStyle={styles.moreLessText}>
            {groupData.bio}
          </ReadMore>
        ) : null}
      </View>
    </View>
  );
};

export default GroupHomeHeader;
