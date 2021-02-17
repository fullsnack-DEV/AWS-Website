/* eslint-disable consistent-return */
import React, { useEffect } from 'react';
import {
  View, StyleSheet, FlatList,
} from 'react-native';
import strings from '../../../Constants/String';
import TCEditHeader from '../../TCEditHeader'

import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import UserInfoPlaysInItem from './UserInfoPlaysInItem';
import UserInfoRefereesInItem from './UserInfoRefereesInItem';
import TCProfileButton from '../../TCProfileButton'
import TCGradientButton from '../../TCGradientButton'
import fonts from '../../../Constants/Fonts';
import UserInfoAddRole from './UserInfoAddRole';
import UserInfoScorekeeperInItem from './UserInfoScorekeeperInItem';
import EntityStatus from '../../../Constants/GeneralConstants';

export default function UserHomeTopSection({
  userDetails, isAdmin, loggedInEntity, onAction, onRefereesInPress, onScorekeeperInPress, onPlayInPress, onAddRolePress,
}) {
  useEffect(() => {
    console.log('UserDetail::=>', userDetails);
    isSectionEnable()
  }, [])

  const isSectionEnable = () => {
    const gameLength = userDetails?.games?.length ?? 0
    const refereeLength = userDetails?.referee_data?.length ?? 0
    const scorekeeperLength = userDetails?.scorekeeper_data?.length ?? 0
    const totalLength = gameLength + refereeLength + scorekeeperLength

    console.log('userDetails?.games length ::=> ', userDetails?.games);
    console.log('gameLength length ::=> ', gameLength);
    console.log('refereeLength length ::=> ', refereeLength);
    console.log('scorekeeperLength length ::=> ', scorekeeperLength);

    console.log('Total length ::=> ', totalLength);
    if (totalLength > 5) {
      return true
    }

    return false
  }

  const oneLineSection = () => {
    let games = []
    console.log('Game data:=>', userDetails?.games);
    if (userDetails?.games) {
      games = userDetails?.games?.map((obj) => {
        const o = { ...obj };
        o.type = EntityStatus.playin;
        return o;
      }) ?? []
    }

    const referee = userDetails?.referee_data?.map((obj) => {
      const o = { ...obj };
      o.type = EntityStatus.refereein;
      return o;
    }) ?? []
    const scorekeeper = userDetails?.scorekeeper_data?.map((obj) => {
      const o = { ...obj };
      o.type = EntityStatus.scorekeeperin;
      return o;
    }) ?? []
    return [...games, ...referee, ...scorekeeper, { sport_name: strings.addrole, item_type: EntityStatus.addNew }]
  }

  const renderPlayIn = ({ item }) => {
    if (item.item_type) {
      return renderAddPlayInRole({ item })
    }
    return (<UserInfoPlaysInItem
        title={item.sport_name}
        totalGames={item.totalGames}
        thumbURL={item.thumbnail ? { uri: item.thumbnail } : undefined}
        onPlayInPress={() => {
          if (onPlayInPress) {
            onPlayInPress(item)
          }
        }}/>)
  }
  const renderRefereesIn = ({ item }) => {
    if (item.item_type) {
      return renderAddRefereeRole({ item })
    }

    return (<UserInfoRefereesInItem
        title={item.sport_name}
        thumbURL={images.gameGoal}
        onRefereesInPress={() => {
          if (onRefereesInPress) {
            onRefereesInPress(item)
          }
        }}
      />)
  }
  const renderScorekeeperIn = ({ item }) => {
    if (item.item_type) {
      return renderAddScorekeeperRole({ item })
    }

    return (<UserInfoScorekeeperInItem
        title={item.sport_name}
        thumbURL={images.myScoreKeeping}
        onRefereesInPress={() => {
          if (onScorekeeperInPress) {
            onScorekeeperInPress(item)
          }
        }}
      />)
  }
  const renderAddRole = () => {
    if (isAdmin) {
      return (
        <UserInfoAddRole
      title={strings.addrole}
      thumbURL={images.addRole}
      onPress={() => {
        if (onAddRolePress) {
          onAddRolePress();
        }
      }}
    />
      )
    }
    return null;
  };

  const renderAddRefereeRole = ({ item }) => {
    if (isAdmin) {
      return (
        <UserInfoAddRole
              title={item.sport_name}
              thumbURL={images.addRole}
              onPress={() => {
                if (onRefereesInPress) {
                  onRefereesInPress()
                }
              }}
          />
      );
    }
    return null;
  }
  const renderAddScorekeeperRole = ({ item }) => {
    if (isAdmin) {
      return (
        <UserInfoAddRole
              title={item.sport_name}
              thumbURL={images.addRole}
              onPress={() => {
                if (onScorekeeperInPress) {
                  onScorekeeperInPress()
                }
              }}
          />
      );
    }
    return null;
  }
  const renderAddPlayInRole = ({ item }) => {
    if (isAdmin) {
      return (
        <UserInfoAddRole
              title={item.sport_name}
              thumbURL={images.addRole}
              onPress={() => {
                if (onPlayInPress) {
                  onPlayInPress()
                }
              }}
          />
      );
    }
    return null;
  }

  const renderUserRole = ({ item }) => {
    if (item?.item_type === EntityStatus.addNew) {
      return renderAddRole()
    }

    if (item?.type === EntityStatus.playin) {
      return renderPlayIn({ item })
    }
    if (item?.type === EntityStatus.refereein) {
      return renderRefereesIn({ item })
    }
    if (item?.type === EntityStatus.scorekeeperin) {
      return renderScorekeeperIn({ item })
    }
  }

  // check member status
  let isMember = false;

  if (loggedInEntity.role === 'club' && userDetails.clubIds) {
    const result = userDetails.clubIds.filter((clubID) => clubID === loggedInEntity.uid);
    if (result.length > 0) {
      isMember = true
    }
  } else if (loggedInEntity.role === 'team' && userDetails.teamIds) {
    const result = userDetails.teamIds.filter((teamId) => teamId === loggedInEntity.uid);

    if (result.length > 0) {
      isMember = true
    }
  }
  console.log('oneLineSection', oneLineSection());
  console.log('isSectionEnable', isSectionEnable());
  return (
    <View style={{ paddingTop: 20, paddingBottom: 20 }}>
      {isAdmin && <TCProfileButton
      title={strings.editprofiletitle}
      style={styles.editButtonStyle}
      textStyle={styles.buttonTextStyle}
      onPressProfile = {() => { onAction('edit') }}
      showArrow={false}/>}
      {!isAdmin && <View style={styles.otherUserStyle}>
        {loggedInEntity.role === 'user' && <View style={styles.messageButtonStyle}>
          {(userDetails && userDetails.is_following) && <TCProfileButton
          title={strings.following}
          style={styles.firstButtonStyle}
          rightImage = {images.check}
          imageStyle = {styles.checkMarkStyle}
          textStyle={styles.buttonTextStyle}
          onPressProfile = {() => { onAction('unfollow') } }
          /> }
          {(userDetails && !userDetails.is_following) && <TCGradientButton
          outerContainerStyle={styles.firstButtonOuterStyle}
          style={styles.firstButtonStyle}
          textStyle={styles.buttonTextStyle}
          title={strings.follow}
          onPress = {() => { onAction('follow') }}/> }
        </View>}
        {loggedInEntity.role !== 'user' && <View style={styles.messageButtonStyle}>
          {isMember && <TCProfileButton
          title={strings.member}
          style={styles.firstButtonStyle}
          rightImage = {images.check}
          imageStyle = {styles.checkMarkStyle}
          textStyle={styles.buttonTextStyle}
          onPressProfile = {() => {}}/> }
          {!isMember && <TCGradientButton
          outerContainerStyle={styles.firstButtonOuterStyle}
          style={styles.firstButtonStyle}
          textStyle={styles.buttonTextStyle}
          startGradientColor={colors.greenGradientStart}
          endGradientColor={colors.greenGradientEnd}
          title={strings.invite}
          onPress = {() => { onAction('invite') }}/> }
        </View>}

        <TCProfileButton
        title={strings.message}
        style={styles.messageButtonStyle}
        textStyle={styles.buttonTextStyle}
        showArrow={false}
        onPressProfile = {() => { onAction('message') }}/>
      </View> }

      {/* Play in section */}
      { isSectionEnable() ? <View>
        {userDetails?.games && userDetails?.games?.length > 0 && <View>
          <View style={[styles.sectionStyle, { marginHorizontal: 0 }]}>
            <TCEditHeader containerStyle={{ marginHorizontal: 15 }} title= {strings.playin}/>
            <FlatList
            style={{ marginTop: 10, marginBottom: 0 }}
            data={[...userDetails.games, { sport_name: strings.addPlaying, item_type: EntityStatus.addNew }]}
            horizontal
            renderItem={renderPlayIn}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
          />
          </View>
        </View>}
        {userDetails?.referee_data && userDetails?.referee_data?.length > 0 && <View>
          <View style={[styles.sectionStyle, { marginHorizontal: 0 }]}>
            <TCEditHeader containerStyle={{ marginHorizontal: 10 }} title= {strings.refereesin}/>
            <FlatList
            style={{ marginTop: 10, marginBottom: 0 }}
            data={[...userDetails.referee_data, { sport_name: strings.addRefereeing, item_type: EntityStatus.addNew }]}
            horizontal
            renderItem={renderRefereesIn}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
          />
          </View>
        </View>}
        {userDetails?.scorekeeper_data && userDetails?.scorekeeper_data?.length > 0 && <View>
          <View style={[styles.sectionStyle, { marginHorizontal: 0 }]}>
            <TCEditHeader containerStyle={{ marginHorizontal: 10 }} title= {strings.scorekeeperIn}/>
            <FlatList
            style={{ marginTop: 10, marginBottom: 0 }}
            data={[...userDetails.scorekeeper_data, { sport_name: strings.addScorekeeping, item_type: EntityStatus.addNew }]}
            horizontal
            renderItem={renderScorekeeperIn}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
          />
          </View>
        </View>}
      </View> : <View style={[styles.sectionStyle, { marginHorizontal: 0 }]}>
        <FlatList
            style={{ marginTop: 10, marginBottom: 0 }}
            data={oneLineSection()}
            horizontal
            renderItem={renderUserRole}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
          />
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionStyle: {
    flex: 1,
    marginTop: 25,
    marginBottom: 0,
    marginHorizontal: 15,
    backgroundColor: colors.whiteColor,
  },
  editButtonStyle: {
    marginHorizontal: 15,
    height: 28,
    marginVertical: 0,
    width: 'auto',
  },
  otherUserStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
    marginHorizontal: 15,
    height: 28,
    marginVertical: 0,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  firstButtonStyle: {
    margin: 0,
    height: 28,
    width: '100%',
    borderRadius: 5,
  },
  firstButtonOuterStyle: {
    margin: 0,
    height: 28,
    width: '100%',
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  messageButtonStyle: {
    margin: 0,
    height: 28,
    width: '48%',
  },
  checkMarkStyle: {
    alignSelf: 'center',
    height: 7,
    resizeMode: 'contain',
    width: 10,
    marginLeft: 8,
    tintColor: colors.lightBlackColor,
  },
  buttonTextStyle: {
    fontFamily: fonts.RBold,
    fontSize: 14,
  },
})
