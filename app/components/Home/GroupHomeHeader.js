// @flow
import React from 'react';
import {View, Text, Image} from 'react-native';
import {strings} from '../../../Localization/translation';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import {displayLocation} from '../../utils';
import {getSportName} from '../../utils/sportsActivityUtils';
import LevelBars from '../LevelBars';
import styles from './GroupHomeHeaderStyles';

const GroupHomeHeader = ({
  groupData = {},
  // loggedInUser = {},
  sportList = [],
}) => (
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
        <View style={styles.placeHolder}>
          <Image
            source={
              groupData.thumbnail ? {uri: groupData.thumbnail} : images.teamPH
            }
            style={[styles.image, {borderRadius: 30}]}
          />
          <View style={styles.teamPlaceholder}>
            <Image source={images.newTeamIcon} style={styles.image} />
          </View>
        </View>
      </View>
    </View>
    <View
      style={[
        styles.row,
        {
          marginTop: 6,
          paddingHorizontal: 15,
          alignItems: 'flex-end',
          marginBottom: 19,
        },
      ]}>
      <View style={{width: 60}} />
      <View style={[styles.row, {flex: 1, justifyContent: 'space-between'}]}>
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
        <View
          style={[
            styles.row,
            {marginLeft: 10, flex: 1, justifyContent: 'flex-end'},
          ]}>
          <View style={[styles.row, {marginRight: 15, flex: 1}]}>
            <Text style={styles.count}>{groupData.member_count}</Text>
            <Text style={styles.label}>{strings.membersTitle}</Text>
          </View>
          <View style={[styles.row, {flex: 1}]}>
            <Text style={styles.count}>{groupData.follower_count}</Text>
            <Text style={styles.label}>{strings.followerTitleText}</Text>
          </View>
        </View>
      </View>
    </View>

    <View style={{paddingHorizontal: 5}}>
      <Text style={styles.groupName}>{groupData.group_name}</Text>
      <Text
        style={[
          styles.label,
          {fontFamily: fonts.RMedium, marginBottom: 15},
        ]}>{`${displayLocation(groupData)} · ${getSportName(
        groupData.sport,
        groupData.sport_type,
        sportList,
      )}`}</Text>
      {groupData.description ? (
        <Text style={[styles.label, {marginBottom: 25}]}>
          {groupData.description}
        </Text>
      ) : null}
    </View>
  </View>
);

export default GroupHomeHeader;
