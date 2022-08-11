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
import strings from '../../../Constants/String';

export default function GroupMembersSettingScreen({navigation, route}) {
  const isFocused = useIsFocused();

  const authContext = useContext(AuthContext);
  const [hiringPlayersObject, setHiringPlayersObject] = useState();
  const [whoCanJoinGroup, setWhoCanJoinGroup] = useState(
    route?.params?.whoCanJoinGroup
      ? route?.params?.whoCanJoinGroup
      : authContext.entity?.obj?.who_can_join,
  );

  const [userSetting] = useState([
    {key: 'Who Can Join Team', id: 1},
    {key: 'Who Can Invite Member', id: 2},
    {key: 'Recruiting Player', id: 3},
    {key: 'Members Profile', id: 4},
  ]);

  useEffect(() => {
    if (isFocused && route?.params?.whoCanJoinGroup) {
      setWhoCanJoinGroup(route?.params?.whoCanJoinGroup);
    }
  }, [isFocused, route?.params?.whoCanJoinGroup]);

  const handleOpetions = async (opetions) => {
    if (opetions === 'Who Can Join Team') {
      navigation.navigate('WhoCanJoinTeamScreen', {
        whoCanJoinGroup,
        comeFrom: 'GroupMembersSettingScreen',
        sportName: authContext.entity?.obj?.sport,
        sportType: authContext.entity?.obj?.sport_type,
      });
    } else if (opetions === 'Who Can Invite Member') {
      navigation.navigate('WhoCanInviteMemberScreen', {
        whoCanJoinGroup,
        comeFrom: 'GroupMembersSettingScreen',
        sportName: authContext.entity?.obj?.sport,
        sportType: authContext.entity?.obj?.sport_type,
      });
    } else if (opetions === 'Recruiting Player') {
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

  const getSettingValue = (item) => {
    console.log('item.key', whoCanJoinGroup);
    if (item === 'Recruiting Player') {
      if (hiringPlayersObject?.hiringPlayers) {
        return hiringPlayersObject?.hiringPlayers;
      }
      return 'No';
    }
    if (item === 'Who Can Join Team') {
      if (whoCanJoinGroup) {
        return (
          (whoCanJoinGroup === 0 && strings.everyoneRadio) ||
          (whoCanJoinGroup === 1 && 'Team Admin') ||
          (whoCanJoinGroup === 2 && strings.inviteOnly)
        );
      }
      return '';
    }
  };
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
        {item.key === 'Recruiting Player' && (
          <Text style={styles.currencyTypeStyle}>
            {getSettingValue(item.key)}
          </Text>
        )}
        {item.key === 'Who Can Join Team' && (
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
