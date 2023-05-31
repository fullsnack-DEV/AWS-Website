import React, {useContext, useLayoutEffect, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  Pressable,
} from 'react-native';
import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';
import ScreenHeader from '../../../components/ScreenHeader';
import {
  doublesInviteOptions,
  eventsInviteOptions,
  grouInviteOptions,
} from '../../../Constants/GeneralConstants';
import {getPrivacyValue} from '../../../utils';

export default function GroupInviteSettingPrivacyScreen({navigation, route}) {
  const [pointEvent] = useState('auto');
  const [settingOptions, setSettingOptions] = useState([]);

  const {type} = route.params;
  const authContext = useContext(AuthContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    let options = [];
    if (type === Verbs.entityTypeTeam) {
      options = [strings.inviteToDoubleTeamTitle, strings.canTeamInviteYou];
    } else if (type === Verbs.entityTypeClub) {
      options = [strings.canClubInviteYou];
    } else if (type === Verbs.eventVerb) {
      options = [strings.whoCanInviteYouToEvent];
    }
    setSettingOptions(options);
  }, [type]);

  const getSettingValue = (option) => {
    const value = getPrivacyValue(option, authContext);

    switch (option) {
      case strings.inviteToDoubleTeamTitle:
        return doublesInviteOptions[value];

      case strings.canTeamInviteYou:
      case strings.canClubInviteYou:
        return grouInviteOptions[value];

      case strings.whoCanInviteYouToEvent:
        return eventsInviteOptions[value];

      default:
        return grouInviteOptions[0];
    }
  };

  const renderMenu = ({item, index}) => (
    <>
      <Pressable
        style={[
          styles.listContainer,
          {opacity: authContext.isAccountDeactivated && index <= 1 ? 0.5 : 1},
        ]}
        pointerEvents={
          authContext.isAccountDeactivated && index <= 1 ? pointEvent : 'auto'
        }
        disabled={authContext.isAccountDeactivated}
        onPress={() => {
          navigation.navigate('GroupInviteYouScreen', {
            groupInviteYou: getPrivacyValue(item, authContext),
            type: item,
            comeFrom: 'GroupInviteSettingPrivacyScreen',
            routeParams: {
              type,
            },
          });
        }}>
        <View style={{flex: 1}}>
          <Text style={styles.label}>{item}</Text>
        </View>
        <View style={[styles.row, {flex: 1, justifyContent: 'flex-end'}]}>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <Text style={styles.currencyTypeStyle} numberOfLines={2}>
              {getSettingValue(item)}
            </Text>
          </View>
          <Image source={images.nextArrow} style={styles.nextArrow} />
        </View>
      </Pressable>
      <View style={styles.separatorLine} />
    </>
  );

  const getTitle = () => {
    if (type === Verbs.entityTypeTeam) {
      return strings.teamText;
    }

    if (type === Verbs.entityTypeClub) {
      return strings.clubText;
    }

    if (type === Verbs.eventVerb) {
      return strings.event;
    }
    return '';
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={getTitle()}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        containerStyle={styles.headerRow}
      />
      <View style={{paddingTop: 25}}>
        <FlatList
          data={settingOptions}
          keyExtractor={(item) => item}
          renderItem={renderMenu}
          showsVerticalScrollIndicator={false}
          bounces={false}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  headerRow: {
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 14,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextArrow: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
  },
  separatorLine: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    margin: 15,
  },

  currencyTypeStyle: {
    marginRight: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.greeColor,
  },
});
