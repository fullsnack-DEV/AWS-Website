import React, {useContext, useLayoutEffect, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AuthContext from '../../auth/context';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import {strings} from '../../../Localization/translation';
import Verbs from '../../Constants/Verbs';
import ScreenHeader from '../../components/ScreenHeader';

export default function GroupSettingPrivacyScreen({navigation}) {
  const authContext = useContext(AuthContext);
  const [groupSettings, setGroupSettings] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const options =
      authContext.entity.role === Verbs.entityTypeTeam
        ? [
            strings.profileText,
            strings.basicinfotitle,
            strings.member,
            strings.club,
            strings.privacyText,
            strings.pauseTeamTitle,
            strings.terminateAccountText,
          ]
        : [
            strings.profileText,
            strings.membersTitle,
            strings.team,
            strings.privacyText,
            strings.pauseClubTitle,
            strings.terminateAccountText,
          ];
    setGroupSettings(options);
  }, [authContext.entity.role]);

  const handleOptions = (option) => {
    switch (option) {
      case strings.profileText:
        navigation.navigate('EditGroupProfileScreen');
        break;

      case strings.basicinfotitle:
        navigation.navigate('EditGroupBasicInfoScreen', {
          groupDetails: authContext.entity.obj,
        });
        break;

      case strings.membersTitle:
      case strings.member:
        navigation.navigate('GroupMembersSettingScreen');
        break;

      case strings.club:
        navigation.navigate('ClubSettingPrivacyScreen');
        break;

      case strings.team:
        navigation.navigate('TeamSettingPrivacyScreen');
        break;

      case strings.event:
        navigation.navigate('EventSettingPrivacyScreen');
        break;

      case strings.account:
        Alert.alert(strings.thisFeatureisUnderDevelopment);
        break;

      case strings.privacyText:
        Alert.alert(strings.thisFeatureisUnderDevelopment);
        break;

      case strings.pauseClubTitle:
      case strings.pauseTeamTitle:
        navigation.navigate('PauseGroupScreen');
        break;

      case strings.terminateAccountText:
        navigation.navigate('TerminateAccountScreen');
        break;

      default:
        break;
    }
  };

  const renderMenu = ({item, index}) => (
    <>
      <TouchableOpacity
        style={[
          styles.listContainer,
          {opacity: authContext.isAccountDeactivated && index <= 4 ? 0.5 : 4},
        ]}
        pointerEvents={
          authContext.isAccountDeactivated && index <= 4 ? 'none' : 'auto'
        }
        disabled={authContext.isAccountDeactivated && index <= 4}
        onPress={() => {
          handleOptions(item);
        }}>
        <View style={{flex: 1}}>
          <Text style={styles.listItems}>{item}</Text>
        </View>

        <Image source={images.nextArrow} style={styles.nextArrow} />
      </TouchableOpacity>
      <View style={styles.separatorLine} />
    </>
  );
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.settingsTitleText}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
      />
      <View style={{paddingTop: 20, paddingHorizontal: 15}}>
        <FlatList
          data={groupSettings}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderMenu}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  listItems: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  nextArrow: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  separatorLine: {
    height: 1,
    marginVertical: 15,
    backgroundColor: colors.grayBackgroundColor,
  },
});
