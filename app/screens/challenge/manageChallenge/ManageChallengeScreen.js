/* eslint-disable no-nested-ternary */
import React, {
 useState, useEffect, useContext, useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';

export default function ManageChallengeScreen({ navigation, route }) {
  const [settingObject, setSettingObject] = useState();
  const [showBottomNotes, setShowBottomNotes] = useState(true);
  const authContext = useContext(AuthContext);

  const { sportName, sportType } = route?.params;

  console.log('sportName:::=>', sportName);
  console.log('sportType:::=>', sportType);


  const getSettings = useCallback(() => {
    if (authContext.entity.role === 'team') {
      console.log('Au:::=>', authContext);
      setSettingObject(authContext?.entity?.obj?.setting);
    }
    if (
      authContext.entity.role === 'player'
      || authContext.entity.role === 'user'
    ) {
      console.log(
        'Au1212121212:::=>',
        (authContext?.entity?.obj?.registered_sports ?? []).filter(
          (obj) => obj.sport === sportName && obj.sport_type === sportType,
        )?.[0]?.setting,
      );

      setSettingObject(
        (authContext?.entity?.obj?.registered_sports ?? []).filter(
          (obj) => obj.sport === sportName && obj.sport_type === sportType,
        )?.[0]?.setting,
      );
    }
  }, [authContext, sportName, sportType]);

  useEffect(() => {
    if (route?.params?.settingObj) {
      setSettingObject(route?.params?.settingObj);
    } else {
      getSettings();
    }
  }, [authContext, getSettings, route?.params?.settingObj, sportName]);

  const challengeSettingMenu = [
    { key: 'Availability', id: 1 },
    { key: 'Game Type', id: 2 },
    { key: 'Game Fee', id: 3 },
    { key: 'Refund Policy', id: 4 },
    { key: 'Home & Away', id: 5 },
    { key: 'Game Duration', id: 6 },
    { key: 'Venue', id: 7 },
    { key: 'Game Rules', id: 8 },
    { key: 'Referees', id: 9 },
    { key: 'Scorekeepers', id: 10 },
  ];
  const handleOpetions = async (opetions) => {
    if (opetions === 'Availability') {
      if (settingObject) {
        navigation.navigate('Availibility', {
          settingObj: settingObject,
          comeFrom: 'ManageChallengeScreen',
          sportName,
          sportType,
        });
      } else {
        navigation.navigate('Availibility', {
          comeFrom: 'ManageChallengeScreen',
          sportName,
          sportType,
        });
      }
    } else if (opetions === 'Game Type') {
      if (settingObject) {
        navigation.navigate('GameType', {
          settingObj: settingObject,
          comeFrom: 'ManageChallengeScreen',
          sportName,
          sportType,
        });
      } else {
        navigation.navigate('GameType', {
          comeFrom: 'ManageChallengeScreen',
          sportName,
          sportType,
        });
      }
    } else if (opetions === 'Game Fee') {
      if (settingObject) {
        navigation.navigate('GameFee', {
          settingObj: settingObject,
          comeFrom: 'ManageChallengeScreen',
          sportName,
          sportType,
        });
      } else {
        navigation.navigate('GameFee', {
          comeFrom: 'ManageChallengeScreen',
          sportName,
          sportType,
        });
      }
    } else if (opetions === 'Refund Policy') {
      if (settingObject) {
        navigation.navigate('RefundPolicy', {
          settingObj: settingObject,
          comeFrom: 'ManageChallengeScreen',
          sportName,
          sportType,
        });
      } else {
        navigation.navigate('RefundPolicy', {
          comeFrom: 'ManageChallengeScreen',
          sportName,
          sportType,
        });
      }
    } else if (opetions === 'Home & Away') {
      if (settingObject) {
        navigation.navigate('HomeAway', {
          settingObj: settingObject,
          comeFrom: 'ManageChallengeScreen',
          sportName,
          sportType,
        });
      } else {
        navigation.navigate('HomeAway', {
          comeFrom: 'ManageChallengeScreen',
          sportName,
          sportType,
        });
      }
    } else if (opetions === 'Game Duration') {
      console.log(settingObject);
      if (settingObject) {
        navigation.navigate('GameDuration', {
          settingObj: settingObject,
          comeFrom: 'ManageChallengeScreen',
          sportName,
          sportType,
        });
      } else {
        navigation.navigate('GameDuration', {
          comeFrom: 'ManageChallengeScreen',
          sportName,
          sportType,
        });
      }
    } else if (opetions === 'Venue') {
      if (settingObject) {
        navigation.navigate('Venue', {
          settingObj: settingObject,
          comeFrom: 'ManageChallengeScreen',
          sportName,
          sportType,
        });
      } else {
        navigation.navigate('Venue', {
          comeFrom: 'ManageChallengeScreen',
          sportName,
          sportType,
        });
      }
    } else if (opetions === 'Game Rules') {
      if (settingObject) {
        navigation.navigate('GameRules', {
          settingObj: settingObject,
          comeFrom: 'ManageChallengeScreen',
          sportName,
          sportType,
        });
      } else {
        navigation.navigate('GameRules', {
          comeFrom: 'ManageChallengeScreen',
          sportName,
          sportType,
        });
      }
    } else if (opetions === 'Referees') {
      if (settingObject) {
        navigation.navigate('RefereesSetting', {
          settingObj: settingObject,
          comeFrom: 'ManageChallengeScreen',
          sportName,
          sportType,
        });
      } else {
        navigation.navigate('RefereesSetting', {
          comeFrom: 'ManageChallengeScreen',
          sportName,
          sportType,
        });
      }
    } else if (opetions === 'Scorekeepers') {
      if (settingObject) {
        navigation.navigate('ScorekeepersSetting', {
          settingObj: settingObject,
          comeFrom: 'ManageChallengeScreen',
          sportName,
          sportType,
        });
      } else {
        navigation.navigate('ScorekeepersSetting', {
          comeFrom: 'ManageChallengeScreen',
          sportName,
          sportType,
        });
      }
    }
  };
  const getSettingValue = (item) => {
    if (item.key === 'Availability') {
      if (settingObject?.availibility) {
        return settingObject?.availibility;
      }
    }

    if (item.key === 'Game Type') {
      if (settingObject?.game_type) {
        return settingObject?.game_type;
      }
    }
    if (item.key === 'Game Fee') {
      if (settingObject?.game_fee) {
        return `$${settingObject?.game_fee?.fee} ${settingObject?.game_fee?.currency_type}`;
      }
    }
    if (item.key === 'Refund Policy') {
      if (settingObject?.refund_policy) {
        return settingObject?.refund_policy;
      }
    }
    if (item.key === 'Home & Away') {
      if (settingObject?.home_away) {
        return `You: ${settingObject?.home_away}`;
      }
    }
    if (item.key === 'Game Duration') {
      if (settingObject?.game_duration) {
        return `${settingObject?.game_duration?.totalHours}h ${settingObject?.game_duration?.totalMinutes}m`;
      }
    }

    if (item.key === 'Venue') {
      if (settingObject?.venue) {
        return `${settingObject?.venue?.length} Venues`;
      }
    }

    if (item.key === 'Game Rules') {
      console.log('settingObject?.general_rules', settingObject?.general_rules);
      if (settingObject?.general_rules || settingObject?.general_rules === '') {
        return 'Completed';
      }
    }

    if (item.key === 'Referees') {
      if (settingObject?.responsible_for_referee) {
        return `${
          settingObject?.responsible_for_referee?.who_secure === 'None'
            ? 'No'
            : settingObject?.responsible_for_referee?.who_secure?.length
        } Referees`;
      }
    }

    if (item.key === 'Scorekeepers') {
      if (settingObject?.responsible_for_scorekeeper) {
        return `${
          settingObject?.responsible_for_scorekeeper?.who_secure === 'None'
            ? 'No'
            : settingObject?.responsible_for_scorekeeper?.who_secure?.length
        } Scorekeepers`;
      }
    }

    return 'incomplete';
  };
  const renderMenu = ({ item }) => (
    <TouchableWithoutFeedback
      style={styles.listContainer}
      onPress={() => {
        handleOpetions(item.key);
      }}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.listItems}>{item.key}</Text>

        {getSettingValue(item) === 'incomplete' ? (
          <Text style={styles.incompleteStyle}>
            {/* {getSettingValue(item)} */}
            incomplete
          </Text>
        ) : (
          <Text style={styles.completeStyle}>
            {getSettingValue(item)}
            {/* {`$${gameFee?.fee} ${gameFee?.currency_type}`} */}
          </Text>
        )}

        <Image source={images.nextArrow} style={styles.nextArrow} />
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        {/* <ActivityLoader visible={loading} /> */}

        <View
          style={{ padding: 15, backgroundColor: colors.grayBackgroundColor }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.RRegular,
              color: colors.lightBlackColor,
            }}>
            {strings.challengeSettingTitle}
          </Text>
        </View>
        <FlatList
          data={challengeSettingMenu}
          keyExtractor={(index) => index.toString()}
          renderItem={renderMenu}
          ItemSeparatorComponent={() => (
            <View style={styles.separatorLine}></View>
          )}
        />
        <View style={styles.separatorLine}></View>
      </ScrollView>
      {showBottomNotes && (
        <LinearGradient
          colors={[colors.yellowColor, colors.orangeGradientColor]}
          style={styles.challengeNotesView}>
          <Text
            style={{
              color: colors.whiteColor,
              fontFamily: fonts.RBold,
              fontSize: 14,
              width: '88%',
            }}>
            {strings.challengeSettingNotes}
          </Text>
          <TouchableOpacity onPress={() => setShowBottomNotes(false)}>
            <Image
              source={images.cancelWhite}
              style={{
                height: 10,
                width: 10,
                resizeMode: 'contain',
                tintColor: colors.whiteColor,
              }}
            />
          </TouchableOpacity>
        </LinearGradient>
      )}
    </>
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
  incompleteStyle: {
    marginRight: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.redColor,
    alignSelf: 'center',
  },
  completeStyle: {
    marginRight: 10,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.completeTextColor,
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
    tintColor: colors.grayColor,
    width: 15,
  },
  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.lightgrayColor,
    height: 0.5,
    width: wp('90%'),
  },
  challengeNotesView: {
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
});
