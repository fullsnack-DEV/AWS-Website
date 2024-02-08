import {
  StyleSheet,
  SafeAreaView,
  View,
  BackHandler,
  ScrollView,
  Text,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import ScreenHeader from '../../../components/ScreenHeader';
import {strings} from '../../../../Localization/translation';
import images from '../../../Constants/ImagePath';
import QuestionAndOptionsComponent from './QuestionAndOptionsComponent';
import AuthContext from '../../../auth/context';
import {
  BinaryPrivacyOptionsEnum,
  FollowerFollowingOptionsEnum,
  GroupDefalutPrivacyOptionsEnum,
  GroupDefaultPrivacyOptionsForDoubleTeamEnum,
  GroupInviteToJoinForTeamSportOptionsEnum,
  GroupInviteToJoinOptionsEnum,
  GroupJoinOptionsEnum,
  InviteToEventOptionsEnum,
  PersonalUserPrivacyEnum,
  PrivacyKeyEnum,
  TeamChatPrivacyOptionsEnum,
  defaultClubPrivacyOptions,
  groupJoinOptions,
  InviteToJoinClubOptionsEnum,
  TeamJoinClubOptionsEnum,
  ClubChatPrivacyOptionsEnum,
  InviteToCreateDoubleTeamOptionsEnum,
  PostOptionsEnumForDoubleTeamSport,
} from '../../../Constants/PrivacyOptionsConstant';
import {patchPlayer} from '../../../api/Users';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {setAuthContextData} from '../../../utils';
import colors from '../../../Constants/Colors';
import Verbs from '../../../Constants/Verbs';
import fonts from '../../../Constants/Fonts';
import {patchGroup} from '../../../api/Groups';

const PrivacyOptionsScreen = ({navigation, route}) => {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const {headerTitle, privacyOptions} = route.params;

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPrivacyKeyVal = useCallback(
    (item) => {
      const entity = {...authContext.entity.obj};

      if (route.params?.isFromSportActivitySettings) {
        if (route.params?.sportObject?.privacy_settings) {
          const sportPrivacyObj = {
            ...route.params.sportObject.privacy_settings,
          };

          if (
            route.params.sportObject.sport_type === Verbs.singleSport ||
            [
              PrivacyKeyEnum.ScoreboardTimePeriod,
              PrivacyKeyEnum.Scoreboard,
            ].includes(item.key)
          ) {
            return sportPrivacyObj[item.key] >= 0
              ? sportPrivacyObj[item.key]
              : 1;
          }

          return sportPrivacyObj[item.key] >= 0 ? sportPrivacyObj[item.key] : 0;
        }
        if (
          route.params?.sportObject?.sport_type === Verbs.singleSport ||
          [
            PrivacyKeyEnum.ScoreboardTimePeriod,
            PrivacyKeyEnum.Scoreboard,
          ].includes(item.key)
        ) {
          return 1;
        }
        return 0;
      }

      if (
        [
          PrivacyKeyEnum.Gender,
          PrivacyKeyEnum.YearOfBirth,
          PrivacyKeyEnum.Height,
          PrivacyKeyEnum.Weight,
        ].includes(item.key)
      ) {
        return entity[item.key] >= 0 ? entity[item.key] : 0;
      }
      return entity[item.key] >= 0 ? entity[item.key] : 1;
    },
    [
      authContext.entity.obj,
      route.params?.isFromSportActivitySettings,
      route.params?.sportObject?.privacy_settings,
      route.params?.sportObject?.sport_type,
    ],
  );

  const getLabelForOption = useCallback(
    (key, privacyVal) => {
      if (authContext.entity.role === Verbs.entityTypeTeam) {
        switch (key) {
          case PrivacyKeyEnum.JoinAsMember:
            return GroupJoinOptionsEnum[privacyVal];

          case PrivacyKeyEnum.InvitePersonToJoinGroup:
            if (authContext.entity.obj.sport_type === Verbs.doubleSport) {
              return GroupInviteToJoinForTeamSportOptionsEnum[privacyVal];
            }
            return GroupInviteToJoinOptionsEnum[privacyVal];

          case PrivacyKeyEnum.ViewYourGroupMembers:
            return GroupDefaultPrivacyOptionsForDoubleTeamEnum[privacyVal];

          case PrivacyKeyEnum.InviteForClub:
          case PrivacyKeyEnum.InviteForLeague:
            return BinaryPrivacyOptionsEnum[privacyVal];

          case PrivacyKeyEnum.Follow:
            return FollowerFollowingOptionsEnum[privacyVal];

          case PrivacyKeyEnum.Chats:
            return TeamChatPrivacyOptionsEnum[privacyVal];

          case PrivacyKeyEnum.Posts:
          case PrivacyKeyEnum.PostWrite:
            if (authContext.entity.obj.sport_type === Verbs.doubleSport) {
              return PostOptionsEnumForDoubleTeamSport[privacyVal];
            }
            return GroupDefalutPrivacyOptionsEnum[privacyVal];

          default:
            if (authContext.entity.obj.sport_type === Verbs.doubleSport) {
              return GroupDefaultPrivacyOptionsForDoubleTeamEnum[privacyVal];
            }
            return GroupDefalutPrivacyOptionsEnum[privacyVal];
        }
      } else if (authContext.entity.role === Verbs.entityTypeClub) {
        switch (key) {
          case PrivacyKeyEnum.JoinAsMember:
            return groupJoinOptions[privacyVal];

          case PrivacyKeyEnum.InvitePersonToJoinGroup:
            return InviteToJoinClubOptionsEnum[privacyVal];

          case PrivacyKeyEnum.Follow:
            return FollowerFollowingOptionsEnum[privacyVal];

          case PrivacyKeyEnum.TeamJoinClub:
            return TeamJoinClubOptionsEnum[privacyVal];

          case PrivacyKeyEnum.Chats:
            return ClubChatPrivacyOptionsEnum[privacyVal];

          default:
            return defaultClubPrivacyOptions[privacyVal];
        }
      } else {
        switch (key) {
          case PrivacyKeyEnum.Follow:
            return FollowerFollowingOptionsEnum[privacyVal];

          case PrivacyKeyEnum.InviteToJoinEvent:
            return InviteToEventOptionsEnum[privacyVal];

          case PrivacyKeyEnum.InviteForTeam:
          case PrivacyKeyEnum.InviteForClub:
            return BinaryPrivacyOptionsEnum[privacyVal];

          case PrivacyKeyEnum.Chats:
            return InviteToEventOptionsEnum[privacyVal];

          case PrivacyKeyEnum.CreateTeamForDoubleSport:
            return InviteToCreateDoubleTeamOptionsEnum[privacyVal];

          default:
            return PersonalUserPrivacyEnum[privacyVal];
        }
      }
    },
    [authContext.entity.obj.sport_type, authContext.entity.role],
  );

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    if (isFocused) {
      const newValues = privacyOptions.map((item) => {
        const privacyVal = getPrivacyKeyVal(item);
        const obj = {
          label: getLabelForOption(item.key, privacyVal),
          value: privacyVal,
          key: item.key,
        };
        return obj;
      });

      setSelectedOptions(newValues);
    }
  }, [isFocused, getPrivacyKeyVal, privacyOptions, getLabelForOption]);

  const handleSave = () => {
    let payload = {};
    const privacyKeyValues = {};
    selectedOptions.forEach((item) => {
      privacyKeyValues[item.key] = item.value;
    });

    if (
      [Verbs.entityTypeTeam, Verbs.entityTypeClub].includes(
        authContext.entity.role,
      )
    ) {
      payload = {...privacyKeyValues};

      setLoading(true);
      patchGroup(authContext.entity.uid, payload, authContext)
        .then(async (response) => {
          await setAuthContextData(response.payload, authContext);
          navigation.goBack();
          setLoading(false);
        })
        .catch((err) => {
          console.log('error ==>', err);
          setLoading(false);
        });
    } else {
      if (
        route.params?.isFromSportActivitySettings &&
        route.params?.sportObject?.sport
      ) {
        const entity = {...authContext.entity.obj};
        if (route.params.sportObject.type === Verbs.entityTypePlayer) {
          const updatedSports = (entity.registered_sports ?? []).map((item) => {
            if (item.sport === route.params.sportObject.sport) {
              return {
                ...item,
                privacy_settings: {
                  ...(item?.privacy_settings ?? {}),
                  ...privacyKeyValues,
                },
              };
            }
            return item;
          });
          payload.registered_sports = [...updatedSports];
        } else if (route.params.sportObject.type === Verbs.entityTypeReferee) {
          const updatedSports = (entity.referee_data ?? []).map((item) => {
            if (item.sport === route.params.sportObject.sport) {
              return {
                ...item,
                privacy_settings: {
                  ...(item?.privacy_settings ?? {}),
                  ...privacyKeyValues,
                },
              };
            }
            return item;
          });
          payload.referee_data = [...updatedSports];
        }
      } else {
        payload = {...privacyKeyValues};
      }

      setLoading(true);
      patchPlayer(payload, authContext)
        .then(async (response) => {
          await setAuthContextData(response.payload, authContext);
          if (route.params?.isFromSportActivitySettings) {
            navigation.navigate('PersonalUserPrivacySettingsScreen');
          } else {
            navigation.goBack();
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log('error ==>', err);
          setLoading(false);
        });
    }
  };

  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeader
        title={headerTitle}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        isRightIconText
        rightButtonText={strings.save}
        onRightButtonPress={handleSave}
      />

      <ActivityLoader visible={loading} />
      <View style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}>
          {headerTitle === strings.basicInfoText ? (
            <View>
              <Text style={styles.titleQuestion}>
                {strings.whoCanSeeItemsOfBasicInfo}
              </Text>
              <Text style={styles.titleSubText}>
                {strings.theseSettingsWillBeAppliedForBasicInfo}
              </Text>
            </View>
          ) : null}
          {(privacyOptions ?? []).map((item, index) => {
            const selectedOption =
              selectedOptions.find((ele) => item.key === ele.key) ?? {};

            return (
              <View key={index}>
                <QuestionAndOptionsComponent
                  title={item.question}
                  subText={item?.subText}
                  options={item.options}
                  privacyKey={item.key}
                  onSelect={(option) => {
                    const updatedList = selectedOptions.map((ele) => {
                      if (ele.key === option.key) {
                        return {...option};
                      }
                      return ele;
                    });

                    setSelectedOptions(updatedList);
                  }}
                  selectedOption={selectedOption}
                />
                {privacyOptions.length - 1 !== index && (
                  <View style={styles.separatorLine} />
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
      {[Verbs.entityTypeTeam, Verbs.entityTypeClub].includes(
        authContext.entity.role,
      ) && (
        <View style={styles.bottomContainer}>
          <Text style={styles.note}>{strings.groupsBottomText}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  separatorLine: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 25,
  },
  bottomContainer: {
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 25,
  },
  note: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  titleQuestion: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    marginBottom: 15,
  },
  titleSubText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    marginBottom: 25,
  },
});

export default PrivacyOptionsScreen;
