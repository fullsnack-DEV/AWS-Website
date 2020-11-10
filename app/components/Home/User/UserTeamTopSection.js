import React, { useEffect } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import strings from '../../../Constants/String';

import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import TCProfileButton from '../../TCProfileButton'
import TCGradientButton from '../../TCGradientButton'
import fonts from '../../../Constants/Fonts';

export default function UserTeamTopSection({
  teamDetails, isAdmin, loggedInEntity, onAction,
}) {
  let isMember = false;

  useEffect(() => {
    if (teamDetails && teamDetails.parent_group_id === loggedInEntity.uid) {
      isMember = true
    }
  }, [isMember])

  const onFollowPress = () => {
    onAction('follow')
  }

  const onUnfollowPress = () => {
    onAction('unfollow')
  }

  const onMessgaePress = () => {
    onAction('message')
  }

  const onJoinPress = () => {
    onAction('join')
  }

  const onUnjoinPress = () => {
    onAction('unjoin')
  }

  const onEditProfilePress = () => {
    onAction('edit')
  }

  const onInvitePress = () => {
    onAction('invite')
  }

  return (
    <View>
      {isAdmin && <TCProfileButton
      title={strings.editprofiletitle}
      style={styles.editButtonStyle}
      textStyle={styles.buttonTextStyle}
      onPressProfile = {onEditProfilePress}
      showArrow={false}/>}
      {!isAdmin && <View style={styles.otherUserStyle}>
        {loggedInEntity.role === 'user' && <View style={styles.joinFollowViewStyle}>
          {(teamDetails && teamDetails.is_joined) && <TCProfileButton
          title={strings.joining}
          style={styles.userButtonOuterStyle}
          rightImage = {images.check}
          imageStyle = {styles.checkMarkStyle}
          textStyle={styles.buttonTextStyle}
          onPressProfile = {onUnjoinPress }
          /> }
          {(teamDetails && !teamDetails.is_joined) && <TCGradientButton
          outerContainerStyle={styles.userButtonOuterStyle}
          style={styles.userButtonStyle}
          textStyle={styles.buttonTextStyle}
          title={strings.join}
          onPress = {onJoinPress}/> }

          {(teamDetails && teamDetails.is_following) && <TCProfileButton
          title={strings.following}
          style={styles.userButtonOuterStyle}
          rightImage = {images.check}
          imageStyle = {styles.checkMarkStyle}
          textStyle={styles.buttonTextStyle}
          onPressProfile = {onUnfollowPress }
          /> }
          {(teamDetails && !teamDetails.is_following) && <TCGradientButton
          outerContainerStyle={styles.userButtonOuterStyle}
          style={styles.userButtonStyle}
          textStyle={styles.buttonTextStyle}
          title={strings.follow}
          onPress = {onFollowPress}/> }
        </View>}
        {loggedInEntity.role === 'club' && <View style={styles.messageButtonStyle}>
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
          title={strings.invite}
          onPress = {onInvitePress}/> }
        </View>}

        {loggedInEntity.role !== 'team' && <TCProfileButton
        title={strings.message}
        style={[styles.messageButtonStyle, { width: loggedInEntity.role === 'user' ? '32%' : '48%' }]}
        textStyle={styles.buttonTextStyle}
        showArrow={false}
        onPressProfile = {onMessgaePress}/>}
        {loggedInEntity.role === 'team' && <TCProfileButton
        title={strings.message}
        style={[styles.messageButtonStyle, { width: '100%' }]}
        textStyle={styles.buttonTextStyle}
        showArrow={false}
        onPressProfile = {onMessgaePress}/>}
      </View> }
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 14,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  userButtonStyle: {
    margin: 0,
    marginTop: 0,
    height: 28,
    width: '100%',
    borderRadius: 5,
  },
  userButtonOuterStyle: {
    margin: 0,
    marginTop: 0,
    height: 28,
    width: '48.5%',
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
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
  joinFollowViewStyle: {
    margin: 0,
    height: 28,
    width: '66%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messageButtonStyle: {
    marginTop: 0,
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
