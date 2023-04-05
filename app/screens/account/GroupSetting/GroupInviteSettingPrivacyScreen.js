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
import {useIsFocused} from '@react-navigation/native';
import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';
import ScreenHeader from '../../../components/ScreenHeader';
import {doublesInviteOptions} from '../../../Constants/GeneralConstants';

export default function GroupInviteSettingPrivacyScreen({navigation, route}) {
  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  const [pointEvent, setPointEvent] = useState('auto');
  const [settingOptions, setSettingOptions] = useState([]);

  const {type} = route.params;
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    if (
      isFocused &&
      (authContext.entity.obj?.is_pause === true ||
        authContext.entity.obj?.is_deactivate === true)
    ) {
      setIsAccountDeactivated(true);
      setPointEvent('none');
    }
  }, [authContext.entity?.obj, isFocused]);

  useEffect(() => {
    let options = [];
    if (type === Verbs.entityTypeTeam) {
      options = [strings.inviteToDoubleTeamTitle, strings.canTeamInviteYou];
    } else if (type === Verbs.entityTypeClub) {
      options = [strings.canClubInviteYou];
    } else if (type === Verbs.eventVerb) {
      options = [strings.canPeopleInviteYouText];
    }
    setSettingOptions(options);
  }, [type]);

  const getSettingValue = (option) => {
    const entity = authContext.entity.obj;
    switch (option) {
      case strings.inviteToDoubleTeamTitle:
        return entity.who_can_invite_for_doubles_team ?? 1;

      case strings.canTeamInviteYou:
        return entity.who_can_invite_for_team ?? 1;

      case strings.canClubInviteYou:
        return entity.who_can_invite_for_club ?? 1;

      case strings.canPeopleInviteYouText:
        return entity.invite_me_event ?? 1;

      default:
        return 0;
    }
  };

  const renderMenu = ({item, index}) => (
    <>
      <Pressable
        style={[
          styles.listContainer,
          {opacity: isAccountDeactivated && index <= 1 ? 0.5 : 1},
        ]}
        pointerEvents={isAccountDeactivated && index <= 1 ? pointEvent : 'auto'}
        disabled={isAccountDeactivated}
        onPress={() => {
          navigation.navigate('GroupInviteYouScreen', {
            groupInviteYou: getSettingValue(item),
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
        <View style={styles.row}>
          <View>
            {item === strings.inviteToDoubleTeamTitle ? (
              <Text style={styles.currencyTypeStyle}>
                {doublesInviteOptions[getSettingValue(item)]}
              </Text>
            ) : (
              <Text style={styles.currencyTypeStyle}>
                {getSettingValue(item) === 1 ? strings.yes : strings.no}
              </Text>
            )}
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
