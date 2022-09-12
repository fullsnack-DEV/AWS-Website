/* eslint-disable consistent-return */
import React, {useContext, useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';

export default function GroupMembersSettingScreen({navigation, route}) {
  const isFocused = useIsFocused();

  const authContext = useContext(AuthContext);
  const [hiringPlayersObject, setHiringPlayersObject] = useState();
  const [whoCanJoinGroup, setWhoCanJoinGroup] = useState(
    route?.params?.whoCanJoinGroup
      ? route?.params?.whoCanJoinGroup
      : authContext.entity?.obj?.who_can_join_for_member,
  );
  const [whoCanInviteGroup, setWhoCanInviteGroup] = useState(
    route?.params?.whoCanInviteGroup
      ? route?.params?.whoCanInviteGroup
      : authContext.entity?.obj?.who_can_invite_member,
  );

  const [userSetting] = useState([
    {
      key: `Who Can Join ${
        authContext.entity.role === 'team' ? 'Team' : 'Club'
      }`,
      id: 1,
    },
    {key: 'Who Can Invite Member', id: 2},
    {key: strings.recruitingPlayerText, id: 3},
    {key: 'Members Profile', id: 4},
  ]);

  useEffect(() => {
    if (isFocused) {
      setWhoCanJoinGroup(
        route?.params?.whoCanJoinGroup ??
          authContext.entity?.obj?.who_can_join_for_member,
      );

      setWhoCanInviteGroup(
        route?.params?.whoCanInviteGroup ??
          authContext.entity?.obj?.who_can_invite_member,
      );
    }
  }, [
    authContext.entity?.obj?.who_can_invite_member,
    authContext.entity?.obj?.who_can_join_for_member,
    isFocused,
    route?.params?.whoCanInviteGroup,
    route?.params?.whoCanJoinGroup,
  ]);

  const handleOpetions = (opetions) => {
    if (opetions === userSetting[0].key) {
      navigation.navigate('WhoCanJoinTeamScreen', {
        whoCanJoinGroup,
        comeFrom: 'GroupMembersSettingScreen',
        sportName: authContext.entity?.obj?.sport,
        sportType: authContext.entity?.obj?.sport_type,
      });
    } else if (opetions === 'Who Can Invite Member') {
      navigation.navigate('WhoCanInviteMemberScreen', {
        whoCanInviteGroup,
        comeFrom: 'GroupMembersSettingScreen',
        sportName: authContext.entity?.obj?.sport,
        sportType: authContext.entity?.obj?.sport_type,
      });
    } else if (opetions === strings.recruitingPlayerText) {
      navigation.navigate('RecruitingMemberScreen', {
        settingObj: hiringPlayersObject,
        comeFrom: 'GroupMembersSettingScreen',
        sportName: authContext.entity?.obj?.sport,
        sportType: authContext.entity?.obj?.sport_type,
      });
    } else if (opetions === 'Members Profile') {
      const entity = authContext.entity;
      navigation.navigate('GroupMembersScreen', {groupID: entity.uid});
    }
  };
  const getSettings = useCallback(() => {
    if (
      authContext.entity.role === 'team' ||
      authContext.entity.role === 'club'
    ) {
      console.log('Au:::=>', authContext);
      setHiringPlayersObject(authContext?.entity?.obj);
    }
  }, [authContext]);

  useEffect(() => {
    if (route?.params?.entity?.obj) {
      setHiringPlayersObject(route?.params?.entity?.obj);
    } else {
      getSettings();
    }
  }, [
    authContext,
    getSettings,
    route?.params?.settingObj,
    hiringPlayersObject,
    route?.params?.entity?.obj,
  ]);

  const getSettingValue = useCallback(
    (item) => {
      console.log('item.key', item);
      if (item === strings.recruitingPlayerText) {
        if (hiringPlayersObject?.hiringPlayers) {
          return hiringPlayersObject?.hiringPlayers;
        }
        return 'No';
      }
      if (item === userSetting[0].key) {
        if (whoCanJoinGroup === 0) {
          return strings.everyoneRadio;
        }
        if (whoCanJoinGroup === 1) {
          return `${
            authContext.entity.role === 'team' ? 'Team Admin' : 'Club'
          }`;
        }
        if (whoCanJoinGroup === 2) {
          return strings.inviteOnly;
        }
      }
      if (item === userSetting[1].key) {
        if (whoCanInviteGroup === 0) {
          return `${
            authContext.entity.role === 'team'
              ? 'Team & members'
              : 'Club & members'
          }`;
        }
        if (whoCanInviteGroup === 1) {
          return `${
            authContext.entity.role === 'team' ? 'Team only' : 'Club only'
          }`;
        }
      }
    },
    [
      authContext.entity.role,
      hiringPlayersObject?.hiringPlayers,
      userSetting,
      whoCanInviteGroup,
      whoCanJoinGroup,
    ],
  );
  const renderMenu = ({item}) => (
    <TouchableWithoutFeedback
      style={styles.listContainer}
      onPress={() => {
        handleOpetions(item.key);
      }}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <Text style={styles.listItems}>{item.key}</Text>
        {item.key === strings.recruitingPlayerText && (
          <Text style={styles.currencyTypeStyle}>
            {getSettingValue(item.key)}
          </Text>
        )}
        {item.key === userSetting[0].key && (
          <Text style={styles.currencyTypeStyle}>
            {getSettingValue(item.key)}
          </Text>
        )}
        {item.key === userSetting[1].key && (
          <Text style={styles.currencyTypeStyle}>
            {getSettingValue(item.key)}
          </Text>
        )}
        <Image source={images.nextArrow} style={styles.nextArrow} />
      </View>
    </TouchableWithoutFeedback>
  );
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={styles.mainContainer}>
        <FlatList
          data={userSetting}
          keyExtractor={(index) => index.toString()}
          renderItem={renderMenu}
          ItemSeparatorComponent={() => (
            <View style={styles.separatorLine}></View>
          )}
        />
        <View style={styles.separatorLine}></View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  listItems: {
    flex: 1,
    padding: 20,
    paddingLeft: 15,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.blackColor,
    alignSelf: 'center',
  },
  currencyTypeStyle: {
    marginRight: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.greeColor,
    alignSelf: 'center',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  nextArrow: {
    alignSelf: 'center',
    flex: 0.1,
    height: 15,
    marginRight: 10,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
    width: 15,
  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.lightgrayColor,
    height: 0.5,
    width: wp('90%'),
  },
});
