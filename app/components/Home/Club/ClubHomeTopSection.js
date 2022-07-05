import React from 'react';
import {View, StyleSheet} from 'react-native';

import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import strings from '../../../Constants/String';
import TCProfileButton from '../../TCProfileButton';
import TCActionButton from '../../TCActionButton';

export default function ClubHomeTopSection({
  clubDetails,
  isAdmin,
  loggedInEntity,
  onAction,
}) {
  let isMember = false;
  let messageButtonWidth = '100%';
  if (loggedInEntity.role === 'team') {
    messageButtonWidth = '48%';
  } else if (loggedInEntity.role === 'user') {
    messageButtonWidth = '32%';
  }
  if (
    clubDetails &&
    loggedInEntity.obj.parent_groups?.includes(clubDetails.group_id)
  ) {
    isMember = true;
  }

  return (
    <View
      style={{
        paddingTop: 20,
        paddingBottom: 25,
      }}>
      {isAdmin && (
        <TCProfileButton
          title={strings.editprofiletitle}
          style={styles.editButtonStyle}
          textStyle={styles.buttonTextStyle}
          onPressProfile={() => {
            onAction('edit');
          }}
          showArrow={false}
        />
      )}
      {!isAdmin && (
        <View style={styles.otherUserStyle}>
          {loggedInEntity.role === 'user' && (
            <View style={styles.joinFollowViewStyle}>
              {clubDetails && clubDetails.is_joined && (
                <TCProfileButton
                  title={strings.joining}
                  style={styles.userButtonOuterStyle}
                  rightImage={images.check}
                  imageStyle={styles.checkMarkStyle}
                  textStyle={styles.buttonTextStyle}
                  onPressProfile={() => {
                    onAction('leave');
                  }}
                />
              )}
              {clubDetails && !clubDetails.is_joined && (
                <TCActionButton
                  outerContainerStyle={styles.userButtonOuterStyle}
                  style={styles.userButtonStyle}
                  textStyle={styles.buttonTextStyle}
                  title={strings.join}
                  onPress={() => {
                    onAction('join');
                  }}
                />
              )}

              {clubDetails && clubDetails.is_following && (
                <TCProfileButton
                  title={strings.following}
                  style={styles.userButtonOuterStyle}
                  rightImage={images.check}
                  imageStyle={styles.checkMarkStyle}
                  textStyle={styles.buttonTextStyle}
                  onPressProfile={() => {
                    onAction('unfollow');
                  }}
                />
              )}
              {clubDetails && !clubDetails.is_following && (
                <TCActionButton
                  outerContainerStyle={styles.userButtonOuterStyle}
                  style={styles.userButtonStyle}
                  textStyle={styles.buttonTextStyle}
                  title={strings.follow}
                  onPress={() => {
                    onAction('follow');
                  }}
                />
              )}
            </View>
          )}
          {loggedInEntity.role === 'team' && (
            <View style={styles.messageButtonStyle}>
              {isMember && (
                <TCProfileButton
                  title={strings.joining}
                  style={styles.firstButtonStyle}
                  rightImage={images.check}
                  imageStyle={styles.checkMarkStyle}
                  textStyle={styles.buttonTextStyle}
                  onPressProfile={() => {
                    onAction('leaveTeam');
                  }}
                />
              )}
              {!isMember && (
                <TCActionButton
                  outerContainerStyle={styles.firstButtonOuterStyle}
                  style={styles.firstButtonStyle}
                  textStyle={styles.buttonTextStyle}
                  title={strings.join}
                  onPress={() => {
                    onAction('joinTeam');
                  }}
                />
              )}
            </View>
          )}

          {/* <TCProfileButton
            title={strings.message}
            style={[styles.messageButtonStyle, {width: messageButtonWidth}]}
            textStyle={styles.buttonTextStyle}
            showArrow={false}
            onPressProfile={() => {
              onAction('message');
            }}
          /> */}
        </View>
      )}
      {/* <View style={styles.sepratorView} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  editButtonStyle: {
    marginHorizontal: 15,
    height: 28,
    marginVertical: 0,
    width: 'auto',
  },
  otherUserStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginVertical: 0,
    height: 28,
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
    flex: 1,
    margin: 0,
    marginTop: 0,
    height: 28,
    marginHorizontal: 5,
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 3},
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
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  // joinFollowViewStyle: {
  //   margin: 0,
  //   height: 28,
  //   width: '66%',
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  // },
  joinFollowViewStyle: {
    margin: 0,
    height: 28,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messageButtonStyle: {
    marginTop: 0,
    height: 28,
    width: '100%',
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
  sepratorView: {
    top: 25,
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
  },
});
