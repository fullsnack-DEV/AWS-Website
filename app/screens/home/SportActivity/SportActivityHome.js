// @flow
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import {strings} from '../../../../Localization/translation';
import {getGroupIndex} from '../../../api/elasticSearch';
import {getUserDetails} from '../../../api/Users';
import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import Verbs from '../../../Constants/Verbs';
import ChallengeButton from './components/ChallengeButton';
import InfoContentScreen from './contentScreens/InfoContentScreen';
import ReviewsContentScreen from './contentScreens/ReviewsContentScreen';
import ScoreboardContentScreen from './contentScreens/ScoreboardContentScreen';
import SportActivityTabBar from './components/SportActivityTabBar';
import UserInfo from './components/UserInfo';
import {getSportIconUrl, getSportName} from '../../../utils';
import ScreenHeader from '../../../components/ScreenHeader';
import BottomSheet from '../../../components/modals/BottomSheet';
import StatsContentScreen from './contentScreens/StatsContentScreen';
import AvailabilityScreen from './contentScreens/AvailabilityContentScreen';

const SportActivityHome = ({navigation, route}) => {
  const [userData, setCurrentUserData] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScorekeeper, setIsScoreKeeper] = useState(false);
  const [isReferee, setIsReferee] = useState(false);
  const [isUserWithSameSport, setIsUserWithSameSport] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [sportObj, setSportObj] = useState({});
  const [isFectchingUser, setIsFetchingUser] = useState(false);
  const [sportIcon, setSportIcon] = useState('');
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [options, setOptions] = useState([]);

  const {sport, sportType, uid, selectedTab, backScreen, backScreenParams} =
    route.params;
  const authContext = useContext(AuthContext);

  const getUserData = useCallback(
    (userId) => {
      setIsFetchingUser(true);
      getUserDetails(userId, authContext)
        .then((res1) => {
          const userDetails = res1.payload;
          if (!userDetails.games) {
            userDetails.games = [];
          }

          if (!userDetails.referee_data) {
            userDetails.referee_data = [];
          }

          let count = 0;
          count =
            userDetails.games &&
            userDetails.games.length + userDetails.referee_data.length;

          if (count < 5) {
            const userRoles = [
              ...userDetails.games,
              ...userDetails.referee_data,
            ];
            userDetails.roles = userRoles;
          }

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
    getSportIconUrl(sport, userData.entity_type, authContext).then((url) => {
      setSportIcon(url);
    });
  }, [sport, authContext, userData]);

  useEffect(() => {
    if (selectedTab) {
      setActiveTab(selectedTab);
    }
  }, [selectedTab]);

  useEffect(() => {
    if (uid) {
      setIsAdmin(authContext.entity.auth.user_id === uid);
      getUserData(uid);
    }
  }, [getUserData, uid, authContext]);

  useEffect(() => {
    (userData.scorekeeper_data ?? []).forEach((item) => {
      setIsScoreKeeper(
        item.sport === sportObj?.sport &&
          item.sport_type === sportObj?.sport_type,
      );
    });
    // registered_sports
    (userData.referee_data ?? []).forEach((item) => {
      setIsReferee(
        item.sport === sportObj?.sport &&
          item.sport_type === sportObj?.sport_type,
      );
    });

    (userData.registered_sports ?? []).forEach((item) => {
      setIsUserWithSameSport(
        item.sport === sportObj?.sport &&
          item.sport_type === sportObj?.sport_type,
      );
    });
  }, [userData, sportObj]);

  useEffect(() => {
    if (userData.user_id && userData.registered_sports?.length > 0) {
      const obj = userData.registered_sports.find(
        (item) => item.sport === sport && item.sport_type === sportType,
      );
      setSportObj(obj);
    }
  }, [userData, sport, sportType]);

  useEffect(() => {
    if (sportType === Verbs.singleSport) {
      if (isAdmin) {
        setOptions([
          strings.incomingChallengeSettingsTitle,
          strings.lookingForTeamTitle,
          strings.deactivateActivityText,
        ]);
      } else {
        setOptions([
          strings.reportThisSportActivityPage,
          strings.blockUserAccount,
        ]);
      }
    } else {
      setOptions([strings.reportThisAccount, strings.blockThisAccount]);
    }
  }, [isAdmin, sportType]);

  const handleChallengeClick = (selectedOption) => {
    switch (selectedOption) {
      case strings.inviteToChallenge:
        navigation.navigate('InviteChallengeScreen', {
          setting: sportObj?.setting,
          sportName: sportObj?.sport,
          sportType: sportObj?.sport_type,
          groupObj: userData,
        });
        break;

      case strings.refereeOffer:
        break;

      case strings.scorekeeperOffer:
        break;

      case strings.reportThisAccount:
        break;

      case strings.blockThisAccount:
        break;

      default:
        break;
    }
  };

  const handleEditNavigation = (sectionName, title) => {
    if (sectionName === strings.matchVenues) {
      navigation.navigate('ManageChallengeScreen', {
        groupObj: userData,
        sportName: sportObj?.sport,
        sportType: sportObj?.sport_type,
      });
    } else {
      navigation.navigate('EditWrapperScreen', {
        section: sectionName,
        title,
        sportObj,
        sportIcon,
      });
    }
  };

  const handlePrivacySettings = (sectionName, privacyKey) => {
    navigation.navigate('PrivacySettingsScreen', {
      sportIcon,
      section: sectionName,
      sport: sportObj?.sport,
      sportType: sportObj?.sport_type,
      privacyKey,
    });
  };

  const handleMoreOptions = (selectedOption) => {
    switch (selectedOption) {
      case strings.incomingChallengeSettingsTitle:
        navigation.navigate('ManageChallengeScreen', {
          groupObj: userData,
          sportName: sportObj?.sport,
          sportType: sportObj?.sport_type,
        });
        break;

      case strings.lookingForTeamTitle:
        break;

      case strings.deactivateActivityText:
        break;

      case strings.reportThisSportActivityPage:
        break;

      case strings.blockUserAccount:
        break;

      case strings.reportThisAccount:
        break;

      case strings.blockThisAccount:
        break;

      default:
        break;
    }
  };

  const renderContent = () => {
    if (!activeTab) return null;
    switch (activeTab) {
      case strings.infoTitle:
        return (
          <InfoContentScreen
            user={userData}
            sportObj={sportObj}
            isAdmin={isAdmin}
            handleEditOption={handleEditNavigation}
            openPrivacySettings={handlePrivacySettings}
          />
        );

      case strings.scoreboard:
        return (
          <ScoreboardContentScreen
            userData={userData}
            sport={sportObj?.sport}
          />
        );

      case strings.reviews:
        return (
          <ReviewsContentScreen
            userId={userData.user_id}
            onPressMore={() => {
              navigation.navigate('ReviewDetailsScreen');
            }}
            // sport={sportObj?.sport}
            // role={userData.entity_type}
          />
        );

      case strings.stats:
        return <StatsContentScreen sportType={sportObj?.sport_type} />;

      case strings.availability:
        return <AvailabilityScreen userData={userData}/>

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeader
        sportIcon={sportIcon}
        title={`${strings.playingTitleText} ${
          sportObj ? getSportName(sportObj, authContext) : ''
        }`}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          if (backScreen) {
            navigation.navigate(backScreen, {...backScreenParams});
          } else {
            navigation.navigate('HomeScreen', {
              uid: userData.user_id,
              role: userData.entity_type,
              backButtonVisible: true,
              menuBtnVisible: false,
            });
          }
        }}
        rightIcon1={!isAdmin ? images.tab_message : null}
        rightIcon2={images.chat3Dot}
        containerStyle={{paddingBottom: 10}}
        rightIcon2Press={() => {
          setShowMoreOptions(true);
        }}
      />

      <UserInfo
        screenType={Verbs.screenTypeMainScreen}
        user={userData}
        containerStyle={styles.userInfoContainer}
        isLookingForClub={sportObj?.lookingForTeamClub}
        isAdmin={isAdmin}
        onMessageClick={() => {
          navigation.push('MessageChat', {
            screen: 'MessageChat',
            params: {userId: userData.user_id},
          });
        }}
        level={sportObj?.level}
        loading={isFectchingUser}
      />

      <ChallengeButton
        isAdmin={isAdmin}
        isAvailable={sportObj?.setting?.availibility === 'On'}
        isScorekeeper={isScorekeeper}
        isReferee={isReferee}
        isUserWithSameSport={isUserWithSameSport}
        onPress={handleChallengeClick}
        containerStyle={{paddingHorizontal: 16, marginTop: 0, marginBottom: 20}}
      />

      <SportActivityTabBar
        sport={sportObj?.sport}
        sportType={sportObj?.sport_type}
        activeTab={selectedTab || strings.infoTitle}
        onTabChange={(tab) => setActiveTab(tab)}
      />
      {renderContent()}
      <BottomSheet
        isVisible={showMoreOptions}
        closeModal={() => {
          setShowMoreOptions(false);
        }}
        optionList={options}
        onSelect={(option) => {
          handleMoreOptions(option);
        }}
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
    paddingBottom: 20,
  },
});

export default SportActivityHome;
