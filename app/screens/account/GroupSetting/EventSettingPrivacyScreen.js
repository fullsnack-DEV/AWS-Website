/* eslint-disable consistent-return */
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
} from 'react-native';

import {format} from 'react-string-format';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useIsFocused} from '@react-navigation/native';
import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';

export default function EventSettingPrivacyScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  const [pointEvent, setPointEvent] = useState('auto');
  const [teamSetting] = useState([
    {key: strings.whoCanCreateEventText, id: 0},
    {key: strings.whoCanInvitePeopleText, id: 1},
  ]);
  const [whoCreateEvent, setWhoCreateEvent] = useState(
    route?.params?.whoCreateEvent
      ? route?.params?.whoCreateEvent
      : authContext.entity?.obj?.who_can_create_event,
  );
  const [whoInviteEvent, setWhoInviteEvent] = useState(
    route?.params?.whoInviteEvent
      ? route?.params?.whoInviteEvent
      : authContext.entity?.obj?.who_can_invite_event,
  );
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.headerTitle}>{strings.event}</Text>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (isFocused) {
      setWhoCreateEvent(
        route?.params?.whoCreateEvent ??
          authContext.entity?.obj?.who_can_create_event,
      );
      setWhoInviteEvent(
        route?.params?.whoInviteEvent ??
          authContext.entity?.obj?.who_can_invite_event,
      );
    }
  }, [
    authContext.entity?.obj?.who_can_create_event,
    authContext.entity?.obj?.who_can_invite_event,
    isFocused,
    route?.params?.whoCreateEvent,
    route?.params?.whoInviteEvent,
  ]);

  const handleOpetions = (opetions) => {
    if (opetions === teamSetting[0].key) {
      navigation.navigate('WhoCreateEventScreen', {
        whoCreateEvent,
        comeFrom: 'EventSettingPrivacyScreen',
      });
    }
    if (opetions === teamSetting[1].key) {
      navigation.navigate('WhoCanInviteEventScreen', {
        whoInviteEvent,
        comeFrom: 'EventSettingPrivacyScreen',
      });
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

  const getSettingValue = (item) => {
    if (item === teamSetting[0].key) {
      if (whoCreateEvent === 1) {
        return format(
          strings.groupMembersText,
          authContext.entity.role === Verbs.entityTypeTeam
            ? strings.team
            : strings.club,
        );
      }
      if (whoCreateEvent === 0) {
        return format(
          strings.groupOnlyText,
          authContext.entity.role === Verbs.entityTypeTeam
            ? strings.team
            : strings.club,
        );
      }
    }
    if (item === teamSetting[1].key) {
      if (whoInviteEvent === 1) {
        return format(
          strings.groupMembersText,
          authContext.entity.role === Verbs.entityTypeTeam
            ? strings.team
            : strings.club,
        );
      }
      if (whoInviteEvent === 0) {
        return format(
          strings.groupOnlyText,
          authContext.entity.role === Verbs.entityTypeTeam
            ? strings.team
            : strings.club,
        );
      }
    }
  };

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
        {item.key === teamSetting[0].key && (
          <Text style={styles.currencyTypeStyle}>
            {getSettingValue(item.key)}
          </Text>
        )}
        {item.key === teamSetting[1].key && (
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
          data={teamSetting}
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

  headerTitle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  currencyTypeStyle: {
    marginRight: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.greeColor,
    alignSelf: 'center',
  },
});
