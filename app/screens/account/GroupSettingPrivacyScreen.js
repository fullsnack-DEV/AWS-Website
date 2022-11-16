import React, {useContext, useLayoutEffect, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useIsFocused} from '@react-navigation/native';
import AuthContext from '../../auth/context';
import images from '../../Constants/ImagePath';
import Header from '../../components/Home/Header';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import {strings} from '../../../Localization/translation';
import Verbs from '../../Constants/Verbs';

export default function GroupSettingPrivacyScreen({navigation}) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  const [pointEvent, setPointEvent] = useState('auto');
  const [userSetting, setUserSetting] = useState();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    setUserSetting([
      {key: strings.profileText, id: 1},
      {key: strings.membersTitle, id: 2},
      {
        key:
          authContext.entity.role === Verbs.entityTypeClub
            ? strings.team
            : strings.club,
        id: 3,
      },
      {key: strings.event, id: 4},
      //   {key: strings.account, id: 5},

      //   {key: strings.privacyText, id: 6},
      {
        key:
          authContext.entity.role === Verbs.entityTypeClub
            ? strings.pauseClubTitle
            : strings.pauseTeamTitle,
        id: 7,
      },
      {key: strings.terminateAccountText, id: 8},
    ]);
  }, [authContext.entity.role]);

  const handleOpetions = async (opetions) => {
    if (opetions === strings.profileText) {
      navigation.navigate('EditGroupProfileScreen', {
        placeholder:
          authContext.entity.role === Verbs.entityTypeTeam
            ? strings.teamNamePlaceholder
            : strings.clubNameplaceholder,
        nameTitle:
          authContext.entity.role === Verbs.entityTypeTeam
            ? strings.teamName
            : strings.clubName,
        sportType:
          authContext.entity.role === Verbs.entityTypeTeam
            ? authContext.entity.obj.sport_type
            : authContext.entity.obj.sports_string,
      });
    } else if (opetions === strings.membersTitle) {
      navigation.navigate('GroupMembersSettingScreen');
    } else if (opetions === strings.club) {
      navigation.navigate('ClubSettingPrivacyScreen');
    } else if (opetions === strings.team) {
      navigation.navigate('TeamSettingPrivacyScreen');
    } else if (opetions === strings.event) {
      navigation.navigate('EventSettingPrivacyScreen');
    } else if (opetions === strings.account) {
      Alert.alert(strings.thisFeatureisUnderDevelopment);
    } else if (opetions === strings.privacyText) {
      Alert.alert(strings.thisFeatureisUnderDevelopment);
    } else if (
      (opetions === authContext.entity.role) === Verbs.entityTypeClub
        ? strings.pauseClubTitle
        : strings.pauseTeamTitle
    ) {
      navigation.navigate('PauseGroupScreen');
    } else if (opetions === strings.terminateAccountText) {
      navigation.navigate('TerminateAccountScreen');
    }
  };

  useEffect(() => {
    setIsAccountDeactivated(false);
    setPointEvent('auto');
    if (isFocused) {
      if (authContext?.entity?.obj?.is_pause === true) {
        setIsAccountDeactivated(true);
        setPointEvent('none');
      }
      if (authContext?.entity?.obj?.is_deactivate === true) {
        setIsAccountDeactivated(true);
        setPointEvent('none');
      }
    }
  }, [
    authContext.entity?.obj.entity_type,
    authContext.entity?.obj?.is_deactivate,
    authContext.entity?.obj?.is_pause,
    authContext.entity.role,
    isFocused,
    pointEvent,
  ]);

  const renderMenu = ({item, index}) => (
    <TouchableWithoutFeedback
      style={styles.listContainer}
      onPress={() => {
        handleOpetions(item.key);
      }}>
      <View
        style={{
          flexDirection: 'row',
          opacity: isAccountDeactivated && index <= 1 ? 0.5 : 1,
        }}
        pointerEvents={
          isAccountDeactivated && index <= 1 ? pointEvent : 'auto'
        }>
        <Text style={styles.listItems}>{item.key}</Text>
        {item.key === 'Currency' && authContext?.entity?.obj?.currency_type && (
          <Text style={styles.currencyTypeStyle}>
            {authContext?.entity?.obj?.currency_type}
          </Text>
        )}
        <Image source={images.nextArrow} style={styles.nextArrow} />
      </View>
    </TouchableWithoutFeedback>
  );
  return (
    <SafeAreaView style={{flex: 1}}>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text
            style={{
              fontSize: 16,
              color: colors.lightBlackColor,
              textAlign: 'center',
              fontFamily: fonts.RBold,
            }}>
            {strings.settingsTitleText}
          </Text>
        }
      />
      <View
        style={{
          width: '100%',
          height: 0.5,
          backgroundColor: colors.writePostSepratorColor,
        }}
      />
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
  backImageStyle: {
    height: 20,
    width: 10,
    tintColor: colors.lightBlackColor,
    resizeMode: 'contain',
  },
});
