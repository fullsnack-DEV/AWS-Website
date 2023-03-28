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
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import {format} from 'react-string-format';
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import Verbs from '../../Constants/Verbs';
import {getSportDetails} from '../../utils/sportsActivityUtils';

export default function SportAccountSettingScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  const [pointEvent, setPointEvent] = useState('auto');
  const [userSetting, setUserSetting] = useState();
  const [sport] = useState(route.params.sport);
  const [type] = useState(route.params.type);
  const [sportObj, setSportObj] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    setIsAccountDeactivated(false);
    setPointEvent('auto');
    if (isFocused) {
      if (
        authContext.entity.obj?.is_pause === true ||
        authContext.entity.obj?.is_deactivate === true
      ) {
        setIsAccountDeactivated(true);
        setPointEvent('none');
      }
    }
  }, [authContext, isFocused]);

  useEffect(() => {
    const sportDetails = getSportDetails(
      sport.sport,
      sport.sport_type,
      authContext.sports,
      type,
    );
    setSportObj(sportDetails);
  }, [authContext.sports, sport, type]);

  const getUserSettingMenu = useCallback(() => {
    const list = [strings.deactivateActivityText];
    if (type === Verbs.entityTypePlayer) {
      if (sport?.sport_type === Verbs.singleSport) {
        list.splice(0, 0, format(strings.challengeSetting, Verbs.challenge));
        list.splice(1, 0, strings.lookingForClubText);
      } else {
        list.splice(0, 0, strings.lookingForTeamText);
      }
    } else {
      list.splice(0, 0, format(strings.challengeSetting, Verbs.reservation));
      list.splice(1, 0, strings.lookingForTeamText);
    }

    setUserSetting(list);
  }, [sport?.sport_type, type]);

  useEffect(() => {
    getUserSettingMenu();
  }, [getUserSettingMenu]);

  const handleOptions = (options) => {
    if (options.toLowerCase() === strings.challengeSettingText.toLowerCase()) {
      navigation.navigate('ManageChallengeScreen', {
        groupObj: authContext.entity.obj,
        sportName: sport.sport,
        sportType: sport.sport_type,
      });
    } else if (
      options.toLowerCase() === strings.reservationSettingText.toLowerCase()
    ) {
      if (type === Verbs.entityTypeReferee) {
        navigation.navigate('RefereeReservationSetting', {
          sportName: sport.sport,
        });
      } else {
        navigation.navigate('ScorekeeperReservationSetting', {
          sportName: sport.sport,
        });
      }
    } else if (
      options === strings.lookingForClubText ||
      options === strings.lookingForTeamText
    ) {
      navigation.navigate('LookingForSettingScreen', {
        entityType: type,
        sport,
        comeFrom: 'SportAccountSettingScreen',
        routeParams: {type, sport},
      });
    } else if (options === strings.deactivateActivityText) {
      navigation.navigate('DeactivateSportScreen', {
        sportObj: sport,
      });
    }
  };

  const renderMenu = ({item, index}) => (
    <>
      <Pressable
        style={[
          styles.row,
          styles.menuItem,
          {opacity: isAccountDeactivated && index <= 3 ? 0.5 : 1},
        ]}
        onPress={() => {
          handleOptions(item);
        }}
        pointerEvents={
          isAccountDeactivated && index <= 3 ? pointEvent : 'auto'
        }>
        <View style={{flex: 1}}>
          <Text style={styles.label}>{item}</Text>
        </View>
        <View style={styles.row}>
          {item === strings.lookingForClubText ||
          item === strings.lookingForTeamText ? (
            <Text style={[styles.label, {color: colors.greenColorCard}]}>
              {sport?.lookingForTeamClub ? strings.yes : strings.no}
            </Text>
          ) : null}

          <Image source={images.nextArrow} style={styles.nextArrow} />
        </View>
      </Pressable>

      <View style={styles.separatorLine} />
    </>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={images.backArrow} style={styles.image} />
        </TouchableOpacity>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={styles.headerTitle}>{strings.settingsTitleText}</Text>
          <Text style={styles.headerText}>{sportObj.sport_name}</Text>
        </View>
        <View style={styles.backIcon} />
      </View>

      <FlatList
        data={userSetting}
        keyExtractor={(index) => index.toString()}
        contentContainerStyle={{paddingHorizontal: 15, paddingTop: 25}}
        renderItem={renderMenu}
        showsVerticalScrollIndicator={false}
        bounces={false}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItem: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  nextArrow: {
    width: 8,
    height: 14,
    marginLeft: 15,
  },
  separatorLine: {
    backgroundColor: colors.grayBackgroundColor,
    height: 1,
    marginVertical: 15,
  },
  backIcon: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 6,
    paddingTop: 3,
    borderBottomWidth: 1,
    borderBottomColor: colors.writePostSepratorColor,
  },
  headerTitle: {
    fontSize: 16,
    lineHeight: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  headerText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
});
