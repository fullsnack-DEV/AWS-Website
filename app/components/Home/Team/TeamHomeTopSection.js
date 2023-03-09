import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {strings} from '../../../../Localization/translation';

import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import TCProfileButton from '../../TCProfileButton';
import fonts from '../../../Constants/Fonts';
import TCActionButton from '../../TCActionButton';

export default function TeamHomeTopSection({
  teamDetails,
  isAdmin,
  loggedInEntity,
  onAction,
  isThreeDotShow,
}) {
  return (
    <View style={{marginTop: !isAdmin ? 0 : 15, marginBottom: 15}}>
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
          {/* {loggedInEntity.role === 'user' && teamDetails?.createdBy?.uid !== loggedInEntity.uid && ( */}
          {loggedInEntity.role === 'user' && (
            <View style={styles.joinFollowViewStyle}>
              {teamDetails && teamDetails.is_joined && (
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
              {teamDetails && !teamDetails.is_joined && (
                <TCActionButton
                  outerContainerStyle={styles.userButtonOuterStyle}
                  style={styles.userButtonStyle}
                  textStyle={styles.buttonTextStyle}
                  title={teamDetails.joinBtnTitle}
                  onPress={() => {
                    onAction('join');
                  }}
                />
              )}

              {teamDetails && teamDetails.is_following && (
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
              {teamDetails && !teamDetails.is_following && (
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

              {teamDetails && isThreeDotShow && (
                <TCActionButton
                  outerContainerStyle={{width: 50, height: 28, marginLeft: 5}}
                  style={{
                    height: 28,
                    width: '100%',
                    borderRadius: 5,
                  }}
                  textStyle={{fontSize: 10, color: colors.lightBlackColor}}
                  title={'•••'}
                  onPress={() => {
                    onAction('dot');
                  }}
                />
              )}
            </View>
          )}

          {loggedInEntity.role === 'club' && (
            <View style={styles.messageButtonStyle}>
              {teamDetails?.parent_groups?.includes(loggedInEntity.uid) && (
                <TCProfileButton
                  title={strings.joining}
                  style={styles.firstButtonStyle}
                  rightImage={images.check}
                  imageStyle={styles.checkMarkStyle}
                  textStyle={styles.buttonTextStyle}
                  onPressProfile={() =>
                    Alert.alert('Please ask to team for leave your club.')
                  }
                />
              )}
              {!teamDetails?.parent_groups?.includes(loggedInEntity.uid) && (
                <TCActionButton
                  outerContainerStyle={styles.firstButtonOuterStyle}
                  style={styles.firstButtonStyle}
                  textStyle={styles.buttonTextStyle}
                  title={strings.invite}
                  onPress={() => {
                    onAction('invite');
                  }}
                />
              )}
            </View>
          )}

          {/* {loggedInEntity.role !== 'team' && <TCProfileButton
        title={strings.message}
        style={[styles.messageButtonStyle, { width: loggedInEntity.role === 'user' ? '32%' : '48%' }]}
        textStyle={styles.buttonTextStyle}
        showArrow={false}
        onPressProfile = {() => { onAction('message') }}/>} */}

          {/* {loggedInEntity.role === 'team' && <TCProfileButton
        title={strings.message}
        style={[styles.messageButtonStyle, { width: '100%' }]}
        textStyle={styles.buttonTextStyle}
        showArrow={false}
        onPressProfile = {() => { onAction('message') }}/>} */}
        </View>
      )}
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
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    height: 28,
    marginVertical: 0,
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
});
