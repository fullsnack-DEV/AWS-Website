// @flow
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  BackHandler,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {strings} from '../../../../Localization/translation';
import {getGroupIndex} from '../../../api/elasticSearch';
import {getUserDetails} from '../../../api/Users';
import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import Verbs from '../../../Constants/Verbs';
import ChallengeButton from './components/ChallengeButton';
import UserInfo from './components/UserInfo';
import {getCalendar, getStorage, getTCDate} from '../../../utils';
import ScreenHeader from '../../../components/ScreenHeader';
import BottomSheet from '../../../components/modals/BottomSheet';
import {
  getEntitySportList,
  getHeaderTitle,
  getIsAvailable,
  getScoreboardListTitle,
  getSportDetails,
  getSportName,
} from '../../../utils/sportsActivityUtils';
import AvailabilitySection from './components/availability/AvailabilitySection';
import TeamsList from './components/TeamsList';
import ScoreBoardList from './components/ScoreBoardList';
import {
  getGameScoreboardEvents,
  getGameStatsData,
  getRefereedMatch,
  getScorekeeperMatch,
} from '../../../api/Games';
import StatSection from './components/StatSection';
import ReviewSection from './components/ReviewSection';
import SectionWrapperModal from './SectionWrapperModal';
import colors from '../../../Constants/Colors';
import InfoSection from './components/InfoSection';
import LookingForSettingModal from './contentScreens/LookingForSettingModal';
import EditWrapperScreen from './EditWrapperScreen';
import PrivacySettingsScreen from './PrivacySettingsScreen';

const SportActivityHome = ({navigation, route}) => {
  const [userData, setCurrentUserData] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [sportObj, setSportObj] = useState({});
  const [isFectchingUser, setIsFetchingUser] = useState(false);
  const [sportIcon, setSportIcon] = useState('');
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [options, setOptions] = useState([]);
  const [availabilityList, setAvailabilityList] = useState([]);
  const [fetchingAvailability, setFectchingAavailability] = useState(false);
  const [matchList, setMatchList] = useState([]);
  const [isFetchingMatchList, setIsFetchingMatchList] = useState(false);
  const [statsObject, setStatsObject] = useState({
    totalWins: 0,
    totalLosses: 0,
    totalDraws: 0,
    totalMatches: 0,
  });
  const [activeTab, setActiveTab] = useState(strings.infoTitle);
  const [settingModalObj, setSettingModalObj] = useState({
    option: '',
    title: '',
  });

  const {sport, sportType, uid, backScreen, backScreenParams, entityType} =
    route.params;
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [showSectionModal, setShowSetionModal] = useState(false);
  const [showWrapperModal, setShowWrapperModal] = useState(false);
  const lookingForModalRef = useRef();
  const privacySettingModalRef = useRef();

  const getUserData = useCallback(
    (userId) => {
      setIsFetchingUser(true);
      getUserDetails(userId, authContext)
        .then((res1) => {
          const userDetails = res1.payload;

          const groupQuery = {
            query: {
              terms: {
                _id: [
                  ...(res1?.payload?.teamIds ?? []),
                  ...(res1?.payload?.clubIds ?? []),
                ],
              },
            },
          };
          getGroupIndex(groupQuery).then((res2) => {
            userDetails.joined_teams = res2.filter(
              (obj) => obj.entity_type === Verbs.entityTypeTeam,
            );
            userDetails.joined_clubs = res2.filter(
              (obj) => obj.entity_type === Verbs.entityTypeClub,
            );

            setCurrentUserData({
              ...userDetails,
              joined_teams: res2.filter(
                (obj) => obj.entity_type === Verbs.entityTypeTeam,
              ),
              joined_clubs: res2.filter(
                (obj) => obj.entity_type === Verbs.entityTypeClub,
              ),
            });
            setIsFetchingUser(false);
          });
        })
        .catch((errResponse) => {
          console.log({errResponse});
          setIsFetchingUser(false);
        });
    },
    [authContext],
  );

  useEffect(() => {
    getStorage('appSetting').then((setting) => {
      const obj = getSportDetails(
        sport,
        sportType,
        authContext.sports,
        entityType,
      );
      setSportIcon(`${setting.base_url_sporticon}${obj.sport_image}`);
    });
  }, [sport, authContext, entityType, sportType]);

  useEffect(() => {
    if (uid) {
      setIsAdmin(authContext.entity.auth.user_id === uid);
      getUserData(uid);
    }
  }, [getUserData, uid, authContext]);

  useEffect(() => {
    if (userData.user_id && isFocused) {
      const sports = getEntitySportList(userData, entityType);

      const obj = sports.find((item) =>
        entityType === Verbs.entityTypePlayer
          ? item.sport === sport && item.sport_type === sportType
          : item.sport === sport,
      );

      setSportObj(obj);
    }
  }, [userData, sport, sportType, entityType, isFocused]);

  useEffect(() => {
    if (isAdmin) {
      if (entityType === Verbs.entityTypePlayer) {
        if (sportType === Verbs.singleSport) {
          setOptions([
            strings.incomingChallengeSettingsTitle,
            strings.incomingMatchOfferSettings,
            strings.lookingForClubText,
            strings.deactivateActivityText,
          ]);
        } else {
          setOptions([
            strings.lookingForTeamText,
            strings.deactivateActivityText,
          ]);
        }
      } else {
        setOptions([
          strings.incomingReservationSettings,
          strings.deactivateActivityText,
        ]);
      }
    } else if (sportType === Verbs.doubleSport) {
      setOptions([strings.reportThisAccount, strings.blockThisAccount]);
    } else {
      setOptions([
        strings.reportThisSportActivityPage,
        strings.blockUserAccount,
      ]);
    }
  }, [isAdmin, sportType, entityType]);

  const handleEditNavigation = (sectionName, title) => {
    if (sectionName === strings.matchVenues) {
      navigation.navigate('AccountStack', {
        screen: 'ManageChallengeScreen',
        params: {
          groupObj: userData,
          sportName: sportObj?.sport,
          sportType: sportObj?.sport_type,
        },
      });
    } else {
      setSettingModalObj({option: sectionName, title});

      setShowWrapperModal(true);
      // navigation.navigate('HomeStack', {
      //   screen: 'EditWrapperScreen',
      //   params: {
      //     section: sectionName,
      //     title,
      //     sportObj,
      //     sportIcon,
      //     entityType,
      //   },
      // });
    }
  };

  const handlePrivacySettings = (sectionName, privacyKey) => {
    // navigation.navigate('PrivacySettingsScreen', {
    //   sportIcon,
    //   section: sectionName,
    //   sport: sportObj?.sport,
    //   sportType: sportObj?.sport_type,
    //   privacyKey,
    //   entityType,
    // });
    setSettingModalObj({option: sectionName, privacyKey});
    privacySettingModalRef.current?.present();
  };

  const handleMoreOptions = (selectedOption) => {
    setShowMoreOptions(false);
    switch (selectedOption) {
      case strings.incomingChallengeSettingsTitle:
        navigation.navigate('AccountStack', {
          screen: 'ManageChallengeScreen',
          params: {
            groupObj: userData,
            sportName: sportObj?.sport,
            sportType: sportObj?.sport_type,
          },
        });
        break;

      case strings.lookingForClubText:
      case strings.lookingForTeamText:
        // navigation.navigate('AccountStack', {
        //   screen: 'LookingForSettingScreen',
        //   params: {
        //     sport: sportObj,
        //     entityType,
        //     comeFrom: 'SportActivityHome',
        //     routeParams: {
        //       sport: sportObj?.sport,
        //       sportType: sportObj?.sport_type,
        //       uid: route.params.uid,
        //       entityType,
        //       parentStack: 'App',
        //       backScreen: 'Account',
        //     },
        //   },
        // });
        lookingForModalRef.current?.present();
        break;

      case strings.incomingReservationSettings:
        if (entityType === Verbs.entityTypeReferee) {
          navigation.navigate('AccountStack', {
            screen: 'RefereeReservationSetting',
            params: {
              sportName: sportObj?.sport,
            },
          });
        }

        if (entityType === Verbs.entityTypeScorekeeper) {
          navigation.navigate('AccountStack', {
            screen: 'ScorekeeperReservationSetting',
            params: {
              sportName: sportObj?.sport,
            },
          });
        }
        break;

      case strings.deactivateActivityText:
        navigation.navigate('AccountStack', {
          screen: 'DeactivateSportScreen',
          params: {
            sportObj,
          },
        });
        break;

      case strings.reportThisSportActivityPage:
      case strings.blockUserAccount:
        break;

      case strings.reportThisAccount:
      case strings.blockThisAccount:
        break;

      default:
        break;
    }
  };

  const getAvailability = useCallback(() => {
    const date = new Date();
    date.setDate(new Date().getDate() + 7);
    setFectchingAavailability(true);
    getCalendar(
      userData.user_id,
      getTCDate(new Date()),
      getTCDate(date),
      'blocked',
    )
      .then((res) => {
        setAvailabilityList(res);
        setFectchingAavailability(false);
      })
      .catch((err) => {
        console.log({err});
        setFectchingAavailability(false);
      });
  }, [userData]);

  const getMatchList = useCallback(() => {
    setIsFetchingMatchList(true);
    const params = {
      sport,
      role: Verbs.entityTypePlayer,
    };

    getGameScoreboardEvents(userData.user_id, params, authContext)
      .then((res) => {
        setMatchList(res.payload);
        setIsFetchingMatchList(false);
      })
      .catch(() => {
        setIsFetchingMatchList(false);
      });
  }, [authContext, sport, userData]);

  const loadStatsData = useCallback(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    const chartParameter = {
      sport,
      fromDate: getTCDate(date),
    };
    getGameStatsData(userData?.user_id, chartParameter, authContext)
      .then((res) => {
        const list = res.payload.filter((item) => item.sport_name === sport);
        let totalMatches = 0;
        let totalWins = 0;
        let totalLosses = 0;
        let totalDraws = 0;
        list.forEach((item) => {
          totalMatches += item.stats.all.total_games;
          totalWins += item.stats.all.winner;
          totalLosses += item.stats.all.looser;
          totalDraws += item.stats.all.draw;
        });
        setStatsObject({totalMatches, totalWins, totalLosses, totalDraws});
      })
      .catch((err) => {
        console.log({err});
      });
  }, [authContext, sport, userData]);

  const getRefereeMatchList = useCallback(() => {
    setIsFetchingMatchList(true);
    getRefereedMatch(userData?.user_id, sport, authContext)
      .then((res) => {
        setMatchList(res.payload);
        setIsFetchingMatchList(false);
      })
      .catch((err) => {
        console.log(err);
        setIsFetchingMatchList(false);
      });
  }, [userData, sport, authContext]);

  const getScorekeeperMatchList = useCallback(() => {
    setIsFetchingMatchList(true);
    getScorekeeperMatch(userData?.user_id, sport, authContext)
      .then((res) => {
        setMatchList(res.payload);
        setIsFetchingMatchList(false);
      })
      .catch((err) => {
        console.log(err);
        setIsFetchingMatchList(false);
      });
  }, [userData, sport, authContext]);

  useEffect(() => {
    if (isFocused) {
      getAvailability();

      if (entityType === Verbs.entityTypePlayer) {
        getMatchList();
        loadStatsData();
      }
      if (entityType === Verbs.entityTypeReferee) {
        getRefereeMatchList();
      }
      if (entityType === Verbs.entityTypeScorekeeper) {
        getScorekeeperMatchList();
      }
    }
  }, [
    isFocused,
    getAvailability,
    entityType,
    getMatchList,
    loadStatsData,
    getRefereeMatchList,
    getScorekeeperMatchList,
  ]);

  const handleSectionClick = (section) => {
    if (
      section === strings.refereedMatchesTitle ||
      section === strings.scorekeptMatches
    ) {
      setActiveTab(strings.matchesTitleText);
    } else {
      setActiveTab(section);
    }
    setShowSetionModal(true);
  };

  const getHeaderBorderColor = () => {
    switch (entityType) {
      case Verbs.entityTypePlayer:
        return colors.tabFontColor;

      case Verbs.entityTypeReferee:
        return colors.redColorCard;

      case Verbs.entityTypeScorekeeper:
        return colors.lightBlueColorCard;

      default:
        return colors.tabFontColor;
    }
  };

  const getSportAcitivityName = () => {
    const activityName = getSportName(
      sportObj?.sport,
      sportObj?.sport_type,
      authContext.sports,
    );

    return activityName ?? '';
  };

  const handleBackPress = useCallback(() => {
    if (route.params?.parentStack) {
      navigation.navigate(route.params?.parentStack, {
        screen: route.params.screen,
      });
    } else {
      navigation.goBack();
    }
  }, [navigation, route.params?.parentStack, route.params?.screen]);

  useEffect(() => {
    const backAction = () => {
      handleBackPress();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [handleBackPress]);

  const getTitleForActivity = () => {
    if (sportObj) {
      return `${getHeaderTitle(entityType)} ${getSportAcitivityName()}`;
    }
    return '';
  };

  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeader
        sportIcon={sportIcon}
        title={getTitleForActivity()}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          if (route.params?.parentStack) {
            navigation.navigate(route.params.parentStack, {
              screen: backScreen,
              params: {...backScreenParams},
            });
          } else if (backScreen) {
            navigation.navigate(backScreen, {...backScreenParams});
          } else {
            navigation.navigate('HomeStack', {
              screen: 'HomeScreen',
              params: {
                uid: userData.user_id,
                role: userData.entity_type,
                backButtonVisible: true,
                menuBtnVisible: false,
              },
            });
          }
        }}
        rightIcon1={!isAdmin ? images.tab_message : null}
        rightIcon2={images.chat3Dot}
        containerStyle={{
          paddingBottom: 7,
          borderBottomWidth: 3,
          borderBottomColor: getHeaderBorderColor(),
        }}
        rightIcon2Press={() => {
          setShowMoreOptions(true);
        }}
        leftIconStyle={{width: 70}}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <UserInfo
          user={userData}
          containerStyle={styles.userInfoContainer}
          isLookingForClub={sportObj?.lookingForTeamClub}
          isAdmin={isAdmin}
          onMessageClick={() => {
            //
          }}
          level={sportObj?.level}
          loading={isFectchingUser}
          entityType={entityType}
          onPressUser={() => {
            navigation.navigate('HomeStack', {
              screen: 'HomeScreen',
              params: {
                uid: userData.user_id,
                role: userData.entity_type,
                backButtonVisible: true,
                menuBtnVisible: false,
              },
            });
          }}
          sportType={sportObj?.sport_type}
        />

        <ChallengeButton
          isAdmin={isAdmin}
          loggedInEntity={authContext.entity.obj}
          sportObj={sportObj}
          sportType={sportType}
          isAvailable={getIsAvailable(sportObj, entityType)}
          inviteToChallenge={() => {
            navigation.navigate('InviteChallengeScreen', {
              setting: sportObj?.setting,
              sportName: sportObj?.sport,
              sportType: sportObj?.sport_type,
              groupObj: userData,
            });
          }}
          containerStyle={{
            paddingHorizontal: 16,
            marginTop: 0,
            marginBottom: 20,
          }}
          continueToChallenge={() => {
            navigation.navigate('ChallengeScreen', {
              setting: sportObj?.setting ?? {},
              sportName: sportObj?.sport,
              sportType: sportObj?.sport_type,
              groupObj: userData,
            });
          }}
          bookReferee={() => {
            navigation.navigate('RefereeBookingDateAndTime', {
              userData,
              showMatches: true,
              sportName: sportObj?.sport,
              settingObj: sportObj?.setting ?? {},
            });
          }}
          bookScoreKeeper={() => {
            navigation.navigate('ScorekeeperBookingDateAndTime', {
              userData,
              showMatches: true,
              sportName: sportObj?.sport,
              settingObj: sportObj?.setting ?? {},
            });
          }}
        />

        <InfoSection
          description={sportObj?.descriptions}
          onMore={() => handleSectionClick(strings.infoTitle)}
          containerStyle={{paddingHorizontal: 15}}
          loading={isFectchingUser}
        />

        <View style={{paddingHorizontal: 15}}>
          {sportObj?.sport_type === Verbs.singleSport ||
          entityType !== Verbs.entityTypePlayer ? (
            <AvailabilitySection
              list={availabilityList}
              loading={fetchingAvailability}
              onSeeAll={() => handleSectionClick(strings.availability)}
            />
          ) : null}

          {sportObj?.sport_type !== Verbs.singleSport &&
          entityType === Verbs.entityTypePlayer ? (
            <TeamsList
              list={userData.joined_teams ?? []}
              sportType={sportObj?.sport_type}
              sport={sportObj?.sport}
              showHorizontalList
            />
          ) : null}

          <ScoreBoardList
            loading={isFetchingMatchList}
            matchList={matchList}
            onSeeAll={() =>
              handleSectionClick(getScoreboardListTitle(entityType))
            }
            screenType={Verbs.screenTypeModal}
            title={getScoreboardListTitle(entityType)}
          />
          {entityType === Verbs.entityTypePlayer ? (
            <StatSection
              onSeeAll={() => handleSectionClick(strings.statsTitle)}
              sportType={sportObj?.sport_type}
              {...statsObject}
            />
          ) : null}

          {sportObj?.sport_type === Verbs.singleSport ||
          entityType !== Verbs.entityTypePlayer ? (
            <ReviewSection
              onSeeAll={() => handleSectionClick(strings.reviews)}
              ratings={
                sportObj?.avg_review?.total_avg
                  ? parseFloat(sportObj.avg_review.total_avg).toFixed(1)
                  : 0.0
              }
            />
          ) : null}
        </View>
      </ScrollView>

      <BottomSheet
        isVisible={showMoreOptions}
        closeModal={() => {
          setShowMoreOptions(false);
        }}
        optionList={options}
        onSelect={(option) => {
          handleMoreOptions(option);
        }}
        type="ios"
      />
      <SectionWrapperModal
        isVisible={showSectionModal}
        closeModal={() => setShowSetionModal(false)}
        handleEditNavigation={handleEditNavigation}
        handlePrivacySettings={handlePrivacySettings}
        selectedOption={activeTab}
        userData={userData}
        isAdmin={isAdmin}
        sportObj={sportObj}
        entityType={entityType}
        navigation={navigation}
        sport={sport}
        sportType={sportType}
        sportIcon={sportIcon}
      />

      <LookingForSettingModal
        modalRef={lookingForModalRef}
        closeModal={() => lookingForModalRef.current.dismiss()}
        sportObj={sportObj}
        entityType={entityType}
        sportType={sportObj?.sport_type}
      />

      <EditWrapperScreen
        isVisible={showWrapperModal}
        closeModal={() => {
          setShowWrapperModal(false);
        }}
        entityType={entityType}
        section={settingModalObj.option}
        title={settingModalObj.title}
        sportIcon={sportIcon}
        sportObj={sportObj}
      />

      <PrivacySettingsScreen
        modalRef={privacySettingModalRef}
        closeModal={() => {
          privacySettingModalRef.current.dismiss();
          setShowSetionModal(false);
        }}
        section={settingModalObj.option}
        sport={sport}
        sportType={sportType}
        sportIcon={sportIcon}
        privacyKey={settingModalObj.title}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  userInfoContainer: {
    paddingHorizontal: 15,
    paddingTop: 16,
  },
});

export default SportActivityHome;
