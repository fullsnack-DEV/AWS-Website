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

export default function UserHomeTopSection({
  userDetails, isAdmin, loggedInEntity, onAction,
}) {
  const playin = userDetails.games && userDetails.games.length > 0
  const refereesIn = userDetails.referee_data && userDetails.referee_data.length > 0

  console.log('isAdmin ', isAdmin)

  const renderPlayIn = ({ item }) => (
    <UserInfoPlaysInItem title={item.sport_name}
    totalGames={item.totalGames}
    thumbURL={item.thumbnail ? { uri: item.thumbnail } : undefined}/>
  );

  const renderRefereesIn = ({ item }) => (
    <UserInfoRefereesInItem title={item.sport_name}
    thumbURL={images.gameGoal}/>
  );

  let isMember = false;

  const onFollowPress = () => {
    onAction('follow')
  }

  const onUnfollowPress = () => {
    onAction('unfollow')
  }

  const onMessgaePress = () => {
    onAction('message')
  }

  const onInvitePress = () => {
    onAction('invite')
  }

  const onEditProfilePress = () => {
    onAction('edit')
  }

  useEffect(() => {
    // User Status
    if (loggedInEntity.role === 'club') {
      const result = userDetails.clubIds.filter((clubID) => clubID === loggedInEntity.uid);
      if (result.length > 0) {
        isMember = true
      }
    } else if (loggedInEntity.role === 'team') {
      const result = userDetails.teamIds.filter((teamId) => teamId === loggedInEntity.uid);

      if (result.length > 0) {
        isMember = true
      }
    }
  }, [isMember])

  return (
    <View>
      {isAdmin && <TCProfileButton
      title={strings.editprofiletitle}
      style={styles.editButtonStyle}
      textStyle={styles.buttonTextStyle}
      onPressProfile = {onEditProfilePress}
      showArrow={false}/>}
      {!isAdmin && <View style={styles.otherUserStyle}>
        {loggedInEntity.role === 'user' && <View style={styles.messageButtonStyle}>
          {(userDetails && userDetails.is_following) && <TCProfileButton
          title={strings.following}
          style={styles.firstButtonStyle}
          rightImage = {images.check}
          imageStyle = {styles.checkMarkStyle}
          textStyle={styles.buttonTextStyle}
          onPressProfile = {onUnfollowPress }
          /> }
          {(userDetails && !userDetails.is_following) && <TCGradientButton
          outerContainerStyle={styles.firstButtonOuterStyle}
          style={styles.firstButtonStyle}
          textStyle={styles.buttonTextStyle}
          title={strings.follow}
          onPress = {onFollowPress}/> }
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
          onPress = {onInvitePress}/> }
        </View>}

        <TCProfileButton
        title={strings.message}
        style={styles.messageButtonStyle}
        textStyle={styles.buttonTextStyle}
        showArrow={false}
        onPressProfile = {onMessgaePress}/>
      </View> }
      {/* Play in section */}
      {playin && <View>
        <View style={[styles.sectionStyle, { marginHorizontal: 0 }]}>
          <TCEditHeader containerStyle={{ marginHorizontal: 15 }} title= {strings.playin}/>
          <FlatList
            style={{ marginTop: 15 }}
            data={userDetails.games}
            horizontal
            renderItem={renderPlayIn}
            keyExtractor={(index) => index.toString()}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>}
      {refereesIn && <View>
        <View style={[styles.sectionStyle, { marginHorizontal: 0 }]}>
          <TCEditHeader containerStyle={{ marginHorizontal: 10 }} title= {strings.refereesin}/>
          <FlatList
            style={{ marginTop: 15 }}
            data={userDetails.referee_data}
            horizontal
            renderItem={renderRefereesIn}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionStyle: {
    flex: 1,
    marginBottom: 17,
    marginHorizontal: 15,
    backgroundColor: colors.whiteColor,
  },
  editButtonStyle: {
    marginHorizontal: 15,
    height: 28,
    marginTop: 21,
    marginBottom: 17,
    width: 'auto',
  },
  otherUserStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    height: 33,
    marginTop: 1,
    marginBottom: 14,
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
