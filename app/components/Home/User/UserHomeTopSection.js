/* eslint-disable consistent-return */
import React, {
 memo, useCallback, useEffect, useMemo,
} from 'react';
import {
  View, StyleSheet, FlatList,
} from 'react-native';
import strings from '../../../Constants/String';
import TCEditHeader from '../../TCEditHeader'

import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import UserInfoPlaysInItem from './UserInfoPlaysInItem';
import UserInfoRefereesInItem from './UserInfoRefereesInItem';

import UserInfoAddRole from './UserInfoAddRole';
import UserInfoScorekeeperInItem from './UserInfoScorekeeperInItem';
import EntityStatus from '../../../Constants/GeneralConstants';

const UserHomeTopSection = ({
  userDetails, isAdmin, onRefereesInPress, onScorekeeperInPress, onPlayInPress, onAddRolePress,
}) => {
  useEffect(() => {
    isSectionEnable()
  }, [])

  const isSectionEnable = useCallback(() => {
    const gameLength = userDetails?.games?.length ?? 0
    const refereeLength = userDetails?.referee_data?.length ?? 0
    const scorekeeperLength = userDetails?.scorekeeper_data?.length ?? 0
    const totalLength = gameLength + refereeLength + scorekeeperLength

    if (totalLength > 500) return true
    return false
  }, [userDetails?.games, userDetails?.referee_data, userDetails?.scorekeeper_data]);

  const oneLineSection = useMemo(() => {
    let games = []
    if (userDetails?.games?.length) {
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
  }, [userDetails?.games, userDetails?.referee_data, userDetails?.scorekeeper_data])

  const renderPlayIn = ({ item }) => {
    if (item.item_type) {
      return renderAddPlayInRole({ item })
    }

    return (<UserInfoPlaysInItem
        title={item.sport_name}
        totalGames={item.totalGames}
        thumbURL={ images.goalsImage || undefined}
        onPlayInPress={() => {
          if (onPlayInPress) onPlayInPress(item)
        }}/>)
  };

  const renderRefereesIn = useCallback(({ item }) => {
    if (item.item_type) {
      return renderAddRefereeRole({ item })
    }

    return (<UserInfoRefereesInItem
        title={item.sport_name}
        thumbURL={images.refereesInImage}
        onRefereesInPress={() => {
          if (onRefereesInPress) onRefereesInPress(item)
        }}
      />)
  }, [onRefereesInPress])

  const renderScorekeeperIn = useCallback(({ item }) => {
    if (item.item_type) {
      return renderAddScorekeeperRole({ item })
    }

    return (<UserInfoScorekeeperInItem
        title={item.sport_name}
        thumbURL={images.myScoreKeeping}
        onRefereesInPress={() => {
          if (onScorekeeperInPress) onScorekeeperInPress(item)
        }}
      />)
  }, [onScorekeeperInPress])

  const renderAddRole = useCallback(() => {
    if (isAdmin) {
      return (
        <UserInfoAddRole
      title={strings.addrole}
      thumbURL={images.addRole}
      onPress={() => {
        if (onAddRolePress) onAddRolePress();
      }}
    />
      )
    }
    return null;
  }, [isAdmin, onAddRolePress]);

  const renderAddRefereeRole = useCallback(({ item }) => {
    if (isAdmin) {
      return (
        <UserInfoAddRole
              title={item.sport_name}
              thumbURL={images.addRole}
              onPress={() => {
                if (onRefereesInPress) onRefereesInPress()
              }}
          />
      );
    }
    return null;
  }, [isAdmin, onRefereesInPress])

  const renderAddScorekeeperRole = useCallback(({ item }) => {
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
  }, [isAdmin, onScorekeeperInPress])

  const renderAddPlayInRole = useCallback(({ item }) => {
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
  }, [isAdmin, onPlayInPress])

  const renderUserRole = useCallback(({ item }) => {
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
  }, [])

  const renderPlayInGames = useMemo(() => userDetails?.games?.length > 0 && (
    <View>
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
    </View>
    ), [userDetails.games])

  return (
    <View style={{ paddingTop: 20, paddingBottom: 20 }}>

      {/* {!isAdmin && <View style={styles.otherUserStyle}>

        {loggedInEntity.role !== 'user' && <View style={styles.messageButtonStyle}>
          {isMember && <TCProfileButton
          title={strings.member}
          style={styles.firstButtonStyle}
          rightImage = {images.check}
          imageStyle = {styles.checkMarkStyle}
          textStyle={styles.buttonTextStyle}/> }

          {!isMember && <TCGradientButton
          outerContainerStyle={styles.firstButtonOuterStyle}
          style={styles.firstButtonStyle}
          textStyle={styles.buttonTextStyle}
          startGradientColor={colors.greenGradientStart}
          endGradientColor={colors.greenGradientEnd}
          title={strings.invite}
          onPress = {() => { onAction('invite') }}/> }
        </View>}
      </View> } */}

      {/* Play in section */}
      { isSectionEnable() ? <View>
        {renderPlayInGames}

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
            data={oneLineSection}
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
    marginBottom: 0,
    marginHorizontal: 15,
    backgroundColor: colors.whiteColor,
  },

})

export default memo(UserHomeTopSection);
