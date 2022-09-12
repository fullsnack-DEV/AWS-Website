/* eslint-disable no-nested-ternary */
import React, {useState, useEffect, useContext, useCallback} from 'react';
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

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {format} from 'react-string-format';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';

export default function ManageChallengeScreen({navigation, route}) {
  const [settingObject, setSettingObject] = useState();
  const [showBottomNotes, setShowBottomNotes] = useState(true);
  const authContext = useContext(AuthContext);

  const [sportName] = useState(route?.params?.sportName);

  const [sportType] = useState(route?.params?.sportType);
  const [groupObj] = useState(route?.params?.groupObj);

  const getSettings = useCallback(() => {
    if (authContext.entity.role === 'team') {
      setSettingObject(authContext?.entity?.obj?.setting);
    }
    if (
      authContext.entity.role === Verbs.entityTypePlayer ||
      authContext.entity.role === Verbs.entityTypeUser
    ) {
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
    {key: strings.availability, id: 1},
    {key: strings.gameType, id: 2},
    {key: strings.gameFee, id: 3},
    {key: strings.refundPolicy, id: 4},
    {key: strings.homeAndAway, id: 5},
    {
      key:
        sportName === Verbs.tennisSport
          ? strings.setsPointsDuration
          : strings.gameDuration,
      id: 6,
    },
    {key: strings.venue, id: 7},
    {key: strings.gameRules, id: 8},
    {key: strings.refereesTitle, id: 9},
    {key: strings.scorekeeperTitle, id: 10},
  ];
  const handleOpetions = async (opetions) => {
    if (opetions === strings.availability) {
      if (settingObject) {
        navigation.navigate('Availibility', {
          settingObj: settingObject,
          comeFrom: 'ManageChallengeScreen',
          groupObj,
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
    } else if (opetions === strings.gameType) {
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
    } else if (opetions === strings.gameFee) {
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
    } else if (opetions === strings.refundPolicy) {
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
    } else if (opetions === strings.homeAndAway) {
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
    } else if (opetions === strings.gameDuration) {
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
    } else if (opetions === strings.setsPointsDuration) {
      if (settingObject) {
        navigation.navigate('GameTennisDuration', {
          settingObj: settingObject,
          comeFrom: 'ManageChallengeScreen',
          sportName,
          sportType,
        });
      } else {
        navigation.navigate('GameTennisDuration', {
          comeFrom: 'ManageChallengeScreen',
          sportName,
          sportType,
        });
      }
    } else if (opetions === strings.venue) {
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
    } else if (opetions === strings.gameRules) {
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
    } else if (opetions === strings.refereesTitle) {
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
    } else if (opetions === strings.scorekeeperTitle) {
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
    if (item.key === strings.availability) {
      if (settingObject?.availibility) {
        return settingObject?.availibility;
      }
    }

    if (item.key === strings.gameType) {
      if (settingObject?.game_type) {
        return settingObject?.game_type;
      }
    }
    if (item.key === strings.gameFee) {
      if (settingObject?.game_fee) {
        return `${settingObject?.game_fee?.fee} ${settingObject?.game_fee?.currency_type}`;
      }
    }
    if (item.key === strings.refundPolicy) {
      if (settingObject?.refund_policy) {
        return settingObject?.refund_policy;
      }
    }
    if (item.key === strings.homeAndAway) {
      if (settingObject?.home_away) {
        return format(strings.youSetting, settingObject?.home_away);
      }
    }
    if (item.key === strings.gameDuration) {
      if (settingObject?.game_duration) {
        return `${settingObject?.game_duration?.totalHours}h ${settingObject?.game_duration?.totalMinutes}m`;
      }
    }
    if (item.key === strings.setsPointsDuration) {
      if (settingObject?.score_rules) {
        return `${settingObject?.score_rules?.match_duration}`;
      }
    }

    if (item.key === strings.venue) {
      if (settingObject?.venue) {
        return format(strings.nVenues, settingObject?.venue?.length);
      }
    }

    if (item.key === strings.gameRules) {
      if (settingObject?.general_rules || settingObject?.general_rules === '') {
        return strings.completedTitleText;
      }
    }

    if (item.key === strings.refereesTitle) {
      if (settingObject?.responsible_for_referee) {
        return format(
          strings.nReferees,
          settingObject?.responsible_for_referee?.who_secure
            ? settingObject?.responsible_for_referee?.who_secure?.length
            : strings.no,
        );
      }
    }

    if (item.key === strings.scorekeeperTitle) {
      if (settingObject?.responsible_for_scorekeeper) {
        return format(
          strings.nScorekeeper,
          settingObject?.responsible_for_scorekeeper?.who_secure
            ? settingObject?.responsible_for_scorekeeper?.who_secure?.length
            : strings.no,
        );
      }
    }

    return strings.incomplete;
  };
  const renderMenu = ({item}) => (
    <TouchableWithoutFeedback
      style={styles.listContainer}
      onPress={() => {
        handleOpetions(item.key);
      }}>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.listItems}>{item.key}</Text>

        {getSettingValue(item) === strings.incomplete ? (
          <Text style={styles.incompleteStyle}>
            {/* {getSettingValue(item)} */}
            {strings.incomplete}
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
      <ScrollView style={styles.mainContainer} testID="manage-challenge-screen">
        {/* <ActivityLoader visible={loading} /> */}

        <View
          style={{padding: 15, backgroundColor: colors.grayBackgroundColor}}>
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
    tintColor: colors.lightBlackColor,
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
