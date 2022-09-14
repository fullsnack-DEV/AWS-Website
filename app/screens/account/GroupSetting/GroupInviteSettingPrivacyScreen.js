/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
import React, {
  useContext,
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
} from 'react';
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

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';

export default function GroupInviteSettingPrivacyScreen({navigation, route}) {
  const isFocused = useIsFocused();

  const authContext = useContext(AuthContext);

  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  const [pointEvent, setPointEvent] = useState('auto');
  const [groupInviteYouSetting] = useState([
    {
      key: format(
        strings.canInviteYouText,
        route?.params?.type.charAt(0).toUpperCase() +
          route?.params?.type.slice(1),
      ),
      id: 0,
    },
  ]);
  const [groupInviteYou, setGroupInviteYou] = useState(
    route?.params?.groupInviteYou
      ? route?.params?.groupInviteYou
      : route?.params?.type === Verbs.entityTypeTeam
      ? authContext.entity?.obj?.who_can_invite_for_team
      : authContext.entity?.obj?.who_can_invite_for_club,
  );
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.headerTitle}>
          {route?.params?.type.charAt(0).toUpperCase() +
            route?.params?.type.slice(1)}
        </Text>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (isFocused) {
      setGroupInviteYou(
        route?.params?.groupInviteYou
          ? route?.params?.groupInviteYou
          : route?.params?.type === 'team'
          ? authContext.entity?.obj?.who_can_invite_for_team
          : authContext.entity?.obj?.who_can_invite_for_club,
      );
    }
  }, [
    authContext.entity?.obj?.who_can_invite_for_club,
    authContext.entity?.obj?.who_can_invite_for_team,
    isFocused,
    route?.params?.groupInviteYou,
    route?.params?.type,
  ]);

  const handleOpetions = async (opetions) => {
    if (opetions === groupInviteYouSetting[0].key) {
      navigation.navigate('GroupInviteYouScreen', {
        groupInviteYou,
        type: route?.params?.type,
        comeFrom: 'GroupInviteSettingPrivacyScreen',
      });
    }
  };

  useEffect(() => {
    setIsAccountDeactivated(false);
    setPointEvent('auto');
    if (isFocused) {
      console.log('its called....', authContext.entity.role);
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

  const getSettingValue = useCallback(
    (item) => {
      console.log('item.key', item);

      if (item === groupInviteYouSetting[0].key) {
        if (groupInviteYou === 1) {
          return strings.yes;
        }
        if (groupInviteYou === 0) {
          return strings.no;
        }
      }
    },
    [groupInviteYouSetting, groupInviteYou],
  );

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
        {item.key === groupInviteYouSetting[0].key && (
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
          data={groupInviteYouSetting}
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
