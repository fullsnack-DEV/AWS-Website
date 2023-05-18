import React, {useContext, useState, useEffect, useLayoutEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';
import ScreenHeader from '../../../components/ScreenHeader';

export default function GroupMembersSettingScreen({navigation}) {
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const [groupDetails, setGroupDetails] = useState({});

  const [groupSettings] = useState([
    format(
      strings.whoCanJoinGroupText,
      authContext.entity.role === Verbs.entityTypeTeam
        ? Verbs.team
        : Verbs.club,
    ),
    strings.whoCanInviteMemberText,
    strings.recruitingPlayerText,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    if (isFocused) {
      setGroupDetails({...authContext.entity.obj});
    }
  }, [isFocused, authContext.entity.obj]);

  const handleOptions = (option) => {
    if (
      option ===
      format(
        strings.whoCanJoinGroupText,
        authContext.entity.role === Verbs.entityTypeTeam
          ? Verbs.team
          : Verbs.club,
      )
    ) {
      navigation.navigate('WhoCanJoinTeamScreen');
    } else if (option === strings.whoCanInviteMemberText) {
      navigation.navigate('WhoCanInviteMemberScreen');
    } else if (option === strings.recruitingPlayerText) {
      navigation.navigate('RecruitingMemberScreen', {
        settingObj: authContext.entity.obj,
        comeFrom: 'GroupMembersSettingScreen',
        sportName: authContext.entity.obj.sport,
        sportType: authContext.entity.obj.sport_type,
      });
    }
  };

  const getSettingValue = (option) => {
    switch (option) {
      case format(
        strings.whoCanJoinGroupText,
        authContext.entity.role === Verbs.entityTypeTeam
          ? Verbs.team
          : Verbs.club,
      ):
        if (groupDetails.who_can_join_for_member === 0) {
          return strings.camAccepted;
        }
        if (groupDetails.who_can_join_for_member === 1) {
          return `${
            authContext.entity.role === Verbs.entityTypeTeam
              ? strings.camAccepted
              : strings.clubText
          }`;
        }
        if (groupDetails.who_can_join_for_member === 2) {
          return strings.inviteOnly;
        }
        return groupDetails.who_can_join_for_member;

      case strings.whoCanInviteMemberText:
        if (groupDetails.who_can_invite_member === 1) {
          return `${
            authContext.entity.role === Verbs.entityTypeTeam
              ? strings.teamAndMembersText
              : strings.clubAndMembersText
          }`;
        }
        if (groupDetails.who_can_invite_member === 0) {
          return `${
            authContext.entity.role === Verbs.entityTypeTeam
              ? strings.teamOnly
              : strings.clubOnly
          }`;
        }
        return groupDetails.who_can_invite_member;

      case strings.recruitingPlayerText:
        return groupDetails.hiringPlayers ? strings.yes : strings.no;

      default:
        return null;
    }
  };

  const renderMenu = ({item}) => (
    <>
      <TouchableOpacity
        style={styles.listContainer}
        onPress={() => {
          handleOptions(item);
        }}>
        <View style={{flex: 1, marginRight: 10}}>
          <Text style={styles.labelText} numberOfLines={1}>
            {item}
          </Text>
        </View>
        <View style={styles.row}>
          {getSettingValue(item) ? (
            <Text
              style={[
                styles.labelText,
                {marginRight: 10},
                getSettingValue(item) === strings.no
                  ? {color: colors.userPostTimeColor}
                  : {color: colors.greeColor},
              ]}>
              {getSettingValue(item)}
            </Text>
          ) : null}

          <Image source={images.nextArrow} style={styles.nextArrow} />
        </View>
      </TouchableOpacity>
      <View style={styles.separator} />
    </>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.membersTitle}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
      />

      <FlatList
        data={groupSettings}
        keyExtractor={(item, index) => index.toString()}
        style={{paddingHorizontal: 15, paddingTop: 25}}
        renderItem={renderMenu}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  labelText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.blackColor,
  },
  nextArrow: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  separator: {
    height: 1,
    marginVertical: 15,
    backgroundColor: colors.grayBackgroundColor,
  },
});
