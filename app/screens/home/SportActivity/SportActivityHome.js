// @flow
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text, SafeAreaView, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {strings} from '../../../../Localization/translation';
import {getGroupIndex} from '../../../api/elasticSearch';
import {getUserDetails} from '../../../api/Users';
import AuthContext from '../../../auth/context';

import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import Verbs from '../../../Constants/Verbs';
import ChallengeButton from './components/ChallengeButton';
import InfoContentScreen from './contentScreens/InfoContentScreen';
import ReviewsContentScreen from './contentScreens/ReviewsContentScreen';
import ScoreboardContentScreen from './contentScreens/ScoreboardContentScreen';
import SportActivityTabBar from './components/SportActivityTabBar';
import UserInfo from './components/UserInfo';
import {getSportIconUrl, getSportName} from '../../../utils';

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

  const {sport, sportType, uid, selectedTab} = route.params;
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
            sport={sportObj?.sport}
            role={userData.entity_type}
          />
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.parent}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            navigation.navigate('HomeScreen', {
              uid: userData.user_id,
              role: userData.entity_type,
              backButtonVisible: true,
              menuBtnVisible: false,
            });
          }}>
          <Image source={images.backArrow} style={styles.image} />
        </TouchableOpacity>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={[styles.iconContainer, {width: 40, height: 40}]}>
            <Image
              source={sportIcon ? {uri: sportIcon} : images.accountMySports}
              style={styles.image}
            />
          </View>
          <Text style={styles.headerTitle}>{`${strings.playingTitleText} ${
            sportObj ? getSportName(sportObj, authContext) : ''
          }`}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {!isAdmin ? (
            <TouchableOpacity style={styles.iconContainer}>
              <Image source={images.tab_message} style={styles.image} />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={styles.iconContainer}>
            <Image source={images.chat3Dot} style={styles.image} />
          </TouchableOpacity>
        </View>
      </View>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.writePostSepratorColor,
  },
  headerTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  iconContainer: {
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
  userInfoContainer: {
    paddingHorizontal: 15,
    paddingTop: 16,
    paddingBottom: 20,
  },
});

export default SportActivityHome;
