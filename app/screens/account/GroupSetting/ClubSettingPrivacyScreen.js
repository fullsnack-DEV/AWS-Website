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
import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';

export default function ClubSettingPrivacyScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  const [pointEvent, setPointEvent] = useState('auto');
  const [clubSetting] = useState([{key: 'Can Club invite Team', id: 0}]);
  const [clubInviteTeam, setClubInviteTeam] = useState(
    route?.params?.clubInviteTeam
      ? route?.params?.clubInviteTeam
      : authContext.entity?.obj?.who_can_invite_for_club,
  );
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={styles.headerTitle}>Club</Text>,
    });
  }, [navigation]);

  useEffect(() => {
    if (isFocused) {
      setClubInviteTeam(
        route?.params?.clubInviteTeam ??
          authContext.entity?.obj?.who_can_invite_for_club,
      );
    }
  }, [
    authContext.entity?.obj?.who_can_invite_for_club,
    isFocused,
    route?.params?.clubInviteTeam,
  ]);

  const handleOpetions = async (opetions) => {
    if (opetions === clubSetting[0].key) {
      navigation.navigate('ClubInviteTeamScreen', {
        clubInviteTeam,
        comeFrom: 'ClubSettingPrivacyScreen',
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

      if (item === clubSetting[0].key) {
        if (clubInviteTeam === 1) {
          return strings.yes;
        }
        if (clubInviteTeam === 0) {
          return strings.no;
        }
      }
    },
    [clubInviteTeam, clubSetting],
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
        {item.key === clubSetting[0].key && (
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
          data={clubSetting}
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
