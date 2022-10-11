/* eslint-disable react/jsx-indent */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable no-empty */
/* eslint-disable no-console */
/* eslint-disable react-native/no-raw-text */
/* eslint-disable no-nested-ternary */
import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import FastImage from 'react-native-fast-image';
// import MarqueeText from 'react-native-marquee';

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  FlatList,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Animated,
  ImageBackground,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';

import moment from 'moment';
import ActionSheet from 'react-native-actionsheet';
import LinearGradient from 'react-native-linear-gradient';
import {useIsFocused} from '@react-navigation/native';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import {format} from 'react-string-format';
import BackgroundProfile from '../../components/Home/BackgroundProfile';
import Header from '../../components/Home/Header';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import {
  getRefereedMatch,
  getRefereeReviewData,
  getScroreboardGameDetails,
  getTeamReviews,
  getScorekeeperReviewData,
  getScorekeeperMatch,
} from '../../api/Games';

import AuthContext from '../../auth/context';
import TCScrollableProfileTabs from '../../components/TCScrollableProfileTabs';
import {
  getUserDetails,
  followUser,
  unfollowUser,
  inviteUser,
  patchRegisterRefereeDetails,
  patchRegisterScorekeeperDetails,
  userActivate,
} from '../../api/Users';
import {createPost, createReaction} from '../../api/NewsFeeds';
import {
  getGroupDetails,
  getTeamsOfClub,
  getGroupMembers,
  followGroup,
  unfollowGroup,
  joinTeam,
  leaveTeam,
  inviteTeam,
  groupUnpaused,
} from '../../api/Groups';
import * as RefereeUtils from '../referee/RefereeUtility';
import * as ScorekeeperUtils from '../scorekeeper/ScorekeeperUtility';
import * as Utils from '../challenge/ChallengeUtility';

import ActivityLoader from '../../components/loader/ActivityLoader';
import ImageProgress from '../../components/newsFeed/ImageProgress';

import ScheduleTabView from '../../components/Home/ScheduleTabView';
import EventScheduleScreen from '../account/schedule/EventScheduleScreen';
import UserHomeTopSection from '../../components/Home/User/UserHomeTopSection';
import ClubHomeTopSection from '../../components/Home/Club/ClubHomeTopSection';
import TeamHomeTopSection from '../../components/Home/Team/TeamHomeTopSection';
import {strings} from '../../../Localization/translation';
import ScoreboardSportsScreen from './ScoreboardSportsScreen';
import UpcomingMatchScreen from './UpcomingMatchScreen';
import {deleteEvent, getEventById} from '../../api/Schedule';
import BackForwardView from '../../components/Schedule/BackForwardView';
import TwoTabView from '../../components/Schedule/TowTabView';
import EventAgendaSection from '../../components/Schedule/EventAgendaSection';
import EventInCalender from '../../components/Schedule/EventInCalender';
import CreateEventButton from '../../components/Schedule/CreateEventButton';
import CreateEventBtnModal from '../../components/Schedule/CreateEventBtnModal';
import EventCalendar from '../../components/Schedule/EventCalendar/EventCalendar';
import CalendarTimeTableView from '../../components/Schedule/CalendarTimeTableView';
import EventBlockTimeTableView from '../../components/Schedule/EventBlockTimeTableView';
import RefereesProfileSection from '../../components/Home/User/RefereesProfileSection';
import RefereeInfoSection from '../../components/Home/RefereeInfoSection';
import ReviewSection from '../../components/Home/ReviewSection';
import ReviewRecentMatch from '../../components/Home/ReviewRecentMatch';
import RefereeReviewerList from './RefereeReviewerList';
import * as Utility from '../../utils';
import {
  QB_ACCOUNT_TYPE,
  QBconnectAndSubscribe,
  QBlogin,
  QBLogout,
} from '../../utils/QuickBlox';

import RefereeReservationItem from '../../components/Schedule/RefereeReservationItem';
import {getRefereeReservationDetails} from '../../api/Reservations';
import TCSearchBox from '../../components/TCSearchBox';
import {getGameHomeScreen} from '../../utils/gameUtils';
import TCInnerLoader from '../../components/TCInnerLoader';
import TCThinDivider from '../../components/TCThinDivider';
import ScorekeeperInfoSection from '../../components/Home/User/ScorekeeperInfoSection';
import PlayInModule from './playInModule/PlayInModule';
import TCGradientDivider from '../../components/TCThinGradientDivider';
import HomeFeed from '../homeFeed/HomeFeed';
import RefereeFeedPostItems from '../../components/game/soccer/home/review/reviewForReferee/RefereeFeedPostItems';
import ScorekeeperFeedPostItems from '../../components/game/soccer/home/review/reviewForScorekeeper/ScorekeeperFeedPostItems';
import ProfileScreenShimmer from '../../components/shimmer/account/ProfileScreenShimmer';
import {ImageUploadContext} from '../../context/GetContexts';
import GameStatus from '../../Constants/GameStatus';
import UserHomeHeader from '../../components/Home/UserHomeHeader';
import UserProfileScreenShimmer from '../../components/shimmer/account/UserProfileScreenShimmer';
import TCGameCard from '../../components/TCGameCard';
import * as settingUtils from '../challenge/manageChallenge/settingUtility';
import {
  getCalendarIndex,
  getGameIndex,
  getGroupIndex,
} from '../../api/elasticSearch';
import TCAccountDeactivate from '../../components/TCAccountDeactivate';
import {
  TAB_ITEMS_REFEREE,
  TAB_ITEMS_SCOREKEEPER,
  league_Data,
  history_Data,
} from '../../utils/constant';
import Verbs from '../../Constants/Verbs';
import TCGrayButton from '../../components/TCGrayButton';
// import { getSetting } from '../challenge/manageChallenge/settingUtility';
let entityObject = {};

const {width} = Dimensions.get('window');

const HomeScreen = ({navigation, route}) => {
  const authContext = useContext(AuthContext);
  const galleryRef = useRef();
  const gameListRefereeModalRef = useRef(null);
  const gameListScorekeeperModalRef = useRef(null);

  const imageUploadContext = useContext(ImageUploadContext);
  const isFocused = useIsFocused();
  // const viewRef = useRef();
  const mainFlatListRef = useRef();
  const confirmationRef = useRef();
  // eslint-disable-next-line no-unused-vars
  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);
  const [pointEvent, setPointEvent] = useState('auto');

  const [mainFlatListFromTop] = useState(new Animated.Value(0));
  const [isUserHome, setIsUserHome] = useState(false);
  const [isClubHome, setIsClubHome] = useState(false);
  const [isTeamHome, setIsTeamHome] = useState(false);
  const [playsInModalVisible, setPlaysInModalVisible] = useState(false);
  const [refereesInModalVisible, setRefereesInModalVisible] = useState(false);
  const [scorekeeperInModalVisible, setScorekeeperInModalVisible] =
    useState(false);
  const [reviewDetailModalVisible, setReviewDetailModalVisible] =
    useState(false);
  const [feedDataIndex, setFeedDataIndex] = useState(0);
  const [feedDetailIndex, setFeedDetailIndex] = useState(0);
  const [orangeFeed, setOrangeFeed] = useState(false);
  const [reviewGameData, setReviewGameData] = useState();
  const [refereeInfoModalVisible, setRefereeInfoModalVisible] = useState(false);
  const [scorekeeperInfoModalVisible, setScorekeeperInfoModalVisible] =
    useState(false);
  const [refereeMatchModalVisible, setRefereeMatchModalVisible] =
    useState(false);
  const [scorekeeperMatchModalVisible, setScorekeeperMatchModalVisible] =
    useState(false);
  const [reviewsModalVisible, setReviewsModalVisible] = useState(false);
  const [reviewerDetailModalVisible, setReviewerDetailModalVisible] =
    useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserData, setCurrentUserData] = useState({});
  const [myGroupDetail] = useState(
    authContext.entity.role === Verbs.entityTypeTeam && authContext.entity.obj,
  );

  const [loading, setloading] = useState(false);
  const [userID, setUserID] = useState('');
  const [scheduleIndexCounter, setScheduleIndexCounter] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [currentTab, setCurrentTab] = useState(0);
  const [currentRefereeTab, setRefereeCurrentTab] = useState(0);
  const [currentScorekeeperTab, setScorekeeperCurrentTab] = useState(0);

  const [refereeReviewData, setRefereeReviewData] = useState();
  const [averageRefereeReview, setAverageRefereeReview] = useState();
  const [scorekeeperReviewData, setScorekeeperReviewData] = useState();
  const [averageScorekeeperReview, setAverageScorekeeperReview] = useState();

  const [teamReviewData, setTeamReviewData] = useState();
  const [averageTeamReview, setAverageTeamReview] = useState();

  const [scoreboardTabNumber, setScroboardTabNumber] = useState(0);
  const [refereeRecentMatch, setRefereeRecentMatch] = useState([]);
  const [refereeUpcomingMatch, setRefereeUpcomingMatch] = useState([]);

  const [scorekeeperRecentMatch, setScorekeeperRecentMatch] = useState([]);
  const [firstTimeLoading, setFirstTimeLoading] = useState(true);
  const [scorekeeperUpcomingMatch, setScorekeeperUpcomingMatch] = useState([]);
  const [isRefereeModal, setIsRefereeModal] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [timeTable, setTimeTable] = useState([]);
  const [scoreboardGameData, setScoreboardGameData] = useState([]);
  const [filterScoreboardGameData, setFilterScoreboardGameData] = useState([]);
  const [scoreboardSearchText, setScoreboardSearchText] = useState([]);
  const [selectedEventItem, setSelectedEventItem] = useState(null);
  const [filterEventData, setFilterEventData] = useState([]);
  const [filterTimeTable, setFilterTimeTable] = useState([]);
  const [calenderInnerIndexCounter, setCalenderInnerIdexCounter] = useState(0);
  const [eventSelectDate, setEventSelectDate] = useState(new Date());
  const [createEventModal, setCreateEventModal] = useState(false);
  const [timetableSelectDate, setTimeTableSelectDate] = useState(new Date());
  const [searchLocation, setSearchLocation] = useState('');
  const [sportName, setSportName] = useState('');
  const [selectRefereeData, setSelectRefereeData] = useState(null);
  const [selectScorekeeperData, setSelectScorekeeperData] = useState(null);
  const [languagesName, setLanguagesName] = useState('');
  const [refereeReservData, setRefereeReserveData] = useState([]);
  const [currentPlayInObject, setCurrentPlayInObject] = useState(null);

  const [challengePopup, setChallengePopup] = useState(false);
  const [selectedChallengeOption, setSelectedChallengeOption] = useState();

  const [settingObject, setSettingObject] = useState();
  const [mySettingObject, setMySettingObject] = useState();
  const [refereeSettingObject, setRefereeSettingObject] = useState();
  const [scorekeeperSettingObject, setScorekeeperSettingObject] = useState();

  const [refereeOfferModalVisible, setRefereeOfferModalVisible] = useState();
  const [scorekeeperOfferModalVisible, setScorekeeperOfferModalVisible] =
    useState();

  const [isDoubleSportTeamCreatedVisible, setIsDoubleSportTeamCreatedVisible] =
    useState(false);

  // const [reviewsData] = useState(reviews_data);

  const selectionDate = moment(eventSelectDate).format('YYYY-MM-DD');
  const timeTableSelectionDate =
    moment(timetableSelectDate).format('YYYY-MM-DD');

  const [sportsSelection, setSportsSelection] = useState();
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [matchData, setMatchData] = useState();
  const [hideScore, SetHideScore] = useState();

  const eventEditDeleteAction = useRef();
  const addRoleActionSheet = useRef();
  const manageChallengeActionSheet = useRef();
  const offerActionSheet = useRef();
  const groupMessageActionSheet = useRef();

  useEffect(() => {
    setTimeout(() => {
      SetHideScore(true);
    }, 100000);
  }, []);

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
    authContext.entity?.obj?.is_deactivate,
    authContext.entity?.obj?.is_pause,
    authContext.entity.role,
    pointEvent,
    isAccountDeactivated,
    isFocused,
  ]);

  useEffect(() => {
    if (route?.params?.isEntityCreated) {
      onSwitchProfile(route?.params?.entityObj);
      setTimeout(() => {
        confirmationRef.current.open();
      }, 1000);
    }
  }, [route?.params?.entityObj, route?.params?.isEntityCreated]);

  useEffect(() => {
    if (route?.params?.isDoubleSportTeamCreated) {
      setIsDoubleSportTeamCreatedVisible(true);
    }
  }, [route?.params?.isDoubleSportTeamCreated]);

  useEffect(() => {
    if (isFocused) {
      // const date = moment(new Date()).format('YYYY-MM-DD');
      const entity = authContext.entity;

      const uid = route?.params?.uid || entity.uid || entity.auth.user_id;
      // const eventdata = [];
      // const timetabledata = [];
      let eventTimeTableData = [];

      Utility.getCalendar(uid, new Date().getTime() / 1000)
        .then((response) => {
          response = (response || []).filter((obj) => {
            if (obj.cal_type === Verbs.blockedVerb) {
              return obj;
            }
            if (obj.cal_type === Verbs.eventVerb) {
              if (obj?.expiry_datetime) {
                if (
                  obj?.expiry_datetime >=
                  parseFloat(new Date().getTime() / 1000).toFixed(0)
                ) {
                  return obj;
                }
              } else {
                return obj;
              }
            }
          });

          eventTimeTableData = [...response];
          let gameIDs = [...new Set(response.map((item) => item.game_id))];

          gameIDs = (gameIDs || []).filter((item) => item !== undefined);

          if (gameIDs.length > 0) {
            const gameList = {
              query: {
                terms: {
                  _id: gameIDs,
                },
              },
            };

            getGameIndex(gameList).then((games) => {
              Utility.getGamesList(games).then((gamedata) => {
                configureEvents(eventTimeTableData, gamedata);
              });
            });
          }

          configureEvents(eventTimeTableData);
          setloading(false);
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });

      getScroreboardGameDetails(uid, authContext)
        .then((res) => {
          setScoreboardGameData(res.payload);
        })
        .catch((error) => {
          console.log('error :-', error);
        });
    }
  }, [isFocused]);

  const configureEvents = useCallback(
    (eventsData, games) => {
      const eventTimeTableData = eventsData.map((item) => {
        if (item?.game_id) {
          const gameObj =
            (games || []).filter((game) => game.game_id === item.game_id) ?? [];

          if (gameObj.length > 0) {
            item.game = gameObj[0];
          }
        } else {
          return item;
        }

        return item;
      });

      setEventData(
        (eventTimeTableData || []).sort(
          (a, b) =>
            new Date(a.start_datetime * 1000) -
            new Date(b.start_datetime * 1000),
        ),
      );

      setTimeTable(eventTimeTableData);
    },
    [eventData],
  );

  useEffect(() => {
    if (selectedEventItem) {
      eventEditDeleteAction.current.show();
    }
  }, [selectedEventItem]);

  useEffect(() => {
    if (route?.params?.fromAccountScreen) {
      const navigateScreen = route?.params?.navigateToScreen;
      const params = route?.params?.homeNavigateParams;
      const allParams = route?.params ?? {};
      delete allParams?.fromAccountScreen;
      delete allParams?.navigateToScreen;
      delete allParams?.homeNavigateParams;
      navigation.setParams(allParams);
      navigation.push(navigateScreen, params);
    }
    if (route?.params?.locationName) {
      setPlaysInModalVisible(true);
      setSearchLocation(route.params.locationName);
    }
  }, [route?.params]);

  useEffect(() => {
    setFirstTimeLoading(true);
    const loginEntity = authContext.entity;
    const uid = route?.params?.uid ?? loginEntity.uid;
    const role = route?.params?.role ?? loginEntity.role;
    let admin = false;
    if (loginEntity.uid === uid) {
      admin = true;
      setIsAdmin(true);
    }

    getData(uid, role, admin).catch((error) => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.message);
      }, 10);
    });
  }, [authContext.entity, route?.params]);

  useEffect(() => {
    if (isTeamHome) {
      getTeamReviews(
        route?.params?.uid || authContext.entity.uid,
        true,
        authContext,
      )
        .then((res) => {
          if (res?.payload) {
            // setAverageTeamReview(teamProperty);
            setTeamReviewData(res?.payload);
          } else {
            setAverageTeamReview([]);
            setTeamReviewData();
          }
        })
        .catch((error) =>
          Alert.alert(strings.alertmessagetitle, error.message),
        );
    }
  }, [authContext, isTeamHome, route?.params?.uid]);

  const getUserData = (uid, admin) => {
    // setloading(true);

    getUserDetails(uid, authContext)
      .then((res1) => {
        console.log('dsffasdfasdfadfsa', res1);
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
          const userRoles = [...userDetails.games, ...userDetails.referee_data];
          // if (admin) {
          //   const addrole = { sport_name: strings.addrole, item_type: 'add_new' }
          //   userRoles.push(addrole)
          // }
          userDetails.roles = userRoles;
        } else if (admin) {
          // userDetails.games.push({ sport_name: strings.addPlaying, item_type: 'add_new' })
          // userDetails.referee_data.push({ sport_name: strings.addRefereeing, item_type: 'add_new' })
        }

        console.log('sdfsadfsafsadfsdfsfsadfres1.payload', res1.payload);
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
          entityObject = userDetails;
          setIsClubHome(false);
          setIsTeamHome(false);
          setIsUserHome(true);
          setUserID(uid);
          setFirstTimeLoading(false);
        });
      })
      .catch((errResponse) => {
        console.log('error==>', errResponse);
        setFirstTimeLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, errResponse);
        }, 10);
        navigation.goBack();
      });
  };

  const renderHeader = useMemo(
    () => (
      <Header
        showBackgroundColor={true}
        mainContainerStyle={{paddingBottom: 0}}
        leftComponent={
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {route?.params?.backButtonVisible === true && (
              <TouchableOpacity
                onPress={() => {
                  if (
                    route?.params?.isEntityCreated &&
                    route?.params?.backButtonVisible
                  ) {
                    navigation.pop(4);
                  } else {
                    navigation.goBack();
                  }
                }}
                hitSlop={Utility.getHitSlop(20)}
                // disabled={!route?.params?.backButtonVisible}
              >
                <Image
                  source={images.backArrow}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                    tintColor: colors.lightBlackColor,
                    marginRight: 15,
                  }}
                />
              </TouchableOpacity>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}>
              {/* <MarqueeText
                style={styles.userNavigationTextStyle}
                duration={3000}
                marqueeOnStart
                loop={true}>
                {currentUserData?.full_name || currentUserData?.group_name}
              </MarqueeText> */}
              <Text numberOfLines={1} style={styles.userNavigationTextStyle}>
                {currentUserData?.full_name || currentUserData?.group_name}
              </Text>
            </View>
            {/* <MarqueeText
              style={styles.userNavigationTextStyle}
              duration={3000}
              marqueeOnStart
              loop={true}>
              {currentUserData?.full_name || currentUserData?.group_name}
            </MarqueeText>

            <Image
              source={
                (currentUserData.entity_type === Verbs.entityTypeTeam && images.teamPatch) ||
                (currentUserData.entity_type === Verbs.entityTypeClub && images.clubPatch)
              }
              style={{
                height: 15,
                width: 15,
                resizeMode: 'cover',
                backgroundColor: colors.yellowColor,
              }}
            /> */}
          </View>
        }
        centerComponent={<View></View>}
        rightComponent={
          <View>
            {!isAdmin && (
              <TouchableOpacity
                onPress={() => {
                  // groupMessageActionSheet.current.show();
                  onMessageButtonPress(currentUserData);
                }}>
                <Image
                  style={styles.messageImage}
                  source={images.messageIcon}
                />
              </TouchableOpacity>
            )}

            {isAdmin && (isUserHome || isTeamHome) && (
              <View
                style={{opacity: isAccountDeactivated ? 0.5 : 1}}
                pointerEvents={pointEvent}>
                <TouchableOpacity
                  hitSlop={Utility.getHitSlop(25)}
                  onPress={() => {
                    manageChallengeActionSheet.current.show();
                  }}>
                  <Image
                    source={images.threeDotIcon}
                    style={{
                      height: 15,
                      width: 15,
                      tintColor: colors.lightBlackColor,
                      resizeMode: 'contain',
                      // marginRight: 15,
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
      />
    ),
    [currentUserData, isAdmin, isUserHome, isTeamHome],
  );

  const getSettingOfBoth = (details) => {
    settingUtils
      .getSetting(
        route?.params?.uid ?? authContext.entity.uid,
        authContext.entity.role ===
          (Verbs.entityTypeUser || Verbs.entityTypePlayer)
          ? Verbs.entityTypeUser
          : Verbs.entityTypeTeam,
        details.sport,
        authContext,
        authContext.entity.role ===
          (Verbs.entityTypeUser || Verbs.entityTypePlayer)
          ? details.sport_type
          : '',
      )
      .then((res3) => {
        setSettingObject(res3);
      })
      .catch(() => {
        setFirstTimeLoading(false);

        // navigation.goBack();
      });

    settingUtils
      .getSetting(
        authContext?.entity?.uid,
        authContext.entity.role ===
          (Verbs.entityTypeUser || Verbs.entityTypePlayer)
          ? Verbs.entityTypeUser
          : Verbs.entityTypeTeam,
        authContext.entity.role ===
          (Verbs.entityTypeUser || Verbs.entityTypePlayer)
          ? currentPlayInObject?.sport
          : currentUserData?.sport,
        authContext,
        authContext.entity.role ===
          (Verbs.entityTypeUser || Verbs.entityTypePlayer)
          ? currentPlayInObject?.sport_type
          : currentUserData?.sport_type,
      )
      .then((res4) => {
        setMySettingObject(res4);
      })
      .catch(() => {
        setFirstTimeLoading(false);

        // navigation.goBack();
      });
  };

  const getData = async (uid, role, admin) => {
    const userHome = role === Verbs.entityTypeUser;
    const clubHome = role === Verbs.entityTypeClub;
    const teamHome = role === Verbs.entityTypeTeam;

    // setloading(true);
    if (userHome) {
      getUserData(uid, admin);
    } else {
      const promises = [
        getGroupDetails(uid, authContext),
        getGroupMembers(uid, authContext),
      ];
      if (clubHome) {
        promises.push(getTeamsOfClub(uid, authContext));
      }
      Promise.all(promises)
        .then(([res1, res2, res3]) => {
          console.log('Group details api res:=>', res1);
          const groupDetails = {...res1.payload};
          setCurrentUserData(res1.payload);

          if (res1?.payload?.avg_review) {
            let array = Object.keys(res1?.payload?.avg_review);
            array = array.filter((e) => e !== 'total_avg');
            const teamProperty = [];

            for (let i = 0; i < array.length; i++) {
              const obj = {
                [array[i]]: res1?.payload?.avg_review[array[i]],
              };
              teamProperty.push(obj);
            }

            setAverageTeamReview(teamProperty);
          } else {
            setAverageTeamReview();
          }
          groupDetails.joined_leagues = league_Data;
          groupDetails.history = history_Data;
          groupDetails.joined_members = res2.payload;
          if (clubHome) {
            groupDetails.joined_teams = res3.payload;
          }

          entityObject = groupDetails;
          setCurrentUserData({...groupDetails});
          setIsClubHome(clubHome);
          setIsTeamHome(teamHome);
          setIsUserHome(userHome);
          setUserID(uid);
          setFirstTimeLoading(false);
          getSettingOfBoth(groupDetails);
        })
        .catch(() => {
          setFirstTimeLoading(false);

          // navigation.goBack();
        });
    }
  };

  const createPostAfterUpload = (dataParams) => {
    let body = dataParams;

    if (
      authContext.entity.role === Verbs.entityTypeClub ||
      authContext.entity.role === Verbs.entityTypeTeam
    ) {
      body = {
        ...dataParams,
        group_id: authContext.entity.uid,
      };
    }
    createPost({...body, is_gallery: true}, authContext)
      .then(() => {
        if (galleryRef?.current?.refreshGallery) {
          galleryRef.current.refreshGallery();
        }
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const callthis = useCallback(
    (data, postDesc, tagsOfEntity, format_tagged_data = []) => {
      if (postDesc?.trim()?.length > 0 && data?.length === 0) {
        const dataParams = {
          text: postDesc,
          tagged: tagsOfEntity ?? [],
          format_tagged_data,
        };
        createPostAfterUpload(dataParams);
      } else if (data) {
        const imageArray = data.map((dataItem) => dataItem);
        const dataParams = {
          text: postDesc && postDesc,
          attachments: [],
          tagged: tagsOfEntity ?? [],
          format_tagged_data,
        };
        imageUploadContext.uploadData(
          authContext,
          dataParams,
          imageArray,
          createPostAfterUpload,
        );
      }
    },
    [authContext, createPostAfterUpload, imageUploadContext],
  );

  let fullName = '';
  if (currentUserData && currentUserData.full_name) {
    fullName = currentUserData.full_name;
  }
  let location = '';
  if (currentUserData && currentUserData.city) {
    location = currentUserData.city;
  }
  if (currentUserData && currentUserData.full_name === undefined) {
    fullName = currentUserData.group_name;
  }
  let bgImage = '';
  if (currentUserData && currentUserData.background_full_image) {
    bgImage = currentUserData.background_full_image;
  }
  let userThumbnail = null;
  if (currentUserData && currentUserData.thumbnail) {
    userThumbnail = currentUserData.thumbnail;
  }
  const callFollowUser = async () => {
    currentUserData.is_following = true;
    currentUserData.follower_count += 1;
    entityObject = currentUserData;

    setCurrentUserData({...currentUserData});

    const params = {
      entity_type: Verbs.entityTypePlayer,
    };
    followUser(params, userID, authContext)
      .then(() => {})
      .catch((error) => {
        currentUserData.is_following = false;
        currentUserData.follower_count -= 1;
        entityObject = currentUserData;

        setCurrentUserData({...currentUserData});
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const callUnfollowUser = async () => {
    currentUserData.is_following = false;
    if (currentUserData.follower_count > 0) {
      currentUserData.follower_count -= 1;
    }
    entityObject = currentUserData;

    setCurrentUserData({...currentUserData});

    const params = {
      entity_type: Verbs.entityTypePlayer,
    };
    unfollowUser(params, userID, authContext)
      .then(() => {})
      .catch((error) => {
        currentUserData.is_following = true;
        currentUserData.follower_count += 1;
        entityObject = currentUserData;

        setCurrentUserData({...currentUserData});
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const clubInviteUser = async () => {
    setloading(true);
    const params = {
      entity_type: authContext.entity.role,
      uid: authContext.entity.uid,
    };
    inviteUser(params, userID, authContext)
      .then(() => {
        setloading(false);

        setTimeout(() => {
          Alert.alert(
            strings.alertmessagetitle,
            format(
              strings.entityInvitedSuccessfully,
              `${currentUserData.first_name} ${currentUserData.last_name}`,
            ),
          );
        }, 10);
      })
      .catch((error) => {
        setloading(false);

        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const callFollowGroup = async (silentlyCall = false) => {
    currentUserData.is_following = true;
    currentUserData.follower_count += 1;
    entityObject = currentUserData;

    setCurrentUserData({...currentUserData});

    const params = {
      entity_type: currentUserData.entity_type,
    };
    followGroup(params, userID, authContext)
      .then(() => {})
      .catch((error) => {
        currentUserData.is_following = false;
        currentUserData.follower_count -= 1;
        entityObject = currentUserData;

        setCurrentUserData({...currentUserData});
        if (silentlyCall === false) {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, error.message);
          }, 10);
        }
      });
  };

  const callUnfollowGroup = async () => {
    currentUserData.is_following = false;
    if (currentUserData.follower_count > 0) {
      currentUserData.follower_count -= 1;
    }
    entityObject = currentUserData;

    setCurrentUserData({...currentUserData});

    const params = {
      entity_type: currentUserData.entity_type,
    };
    unfollowGroup(params, userID, authContext)
      .then(() => {})
      .catch((error) => {
        currentUserData.is_following = true;
        currentUserData.follower_count += 1;
        entityObject = currentUserData;

        setCurrentUserData({...currentUserData});
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const userJoinGroup = () => {
    currentUserData.is_joined = true;
    currentUserData.member_count += 1;
    if (currentUserData.is_following === false) {
      callFollowGroup(true);
    }
    entityObject = currentUserData;

    setCurrentUserData({...currentUserData});
    const params = {};
    joinTeam(params, userID, authContext)
      .then((response) => {
        console.log('user join group', response);
      })
      .catch((error) => {
        currentUserData.is_joined = false;
        currentUserData.member_count -= 1;
        entityObject = currentUserData;

        setCurrentUserData({...currentUserData});
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const userLeaveGroup = () => {
    currentUserData.is_joined = false;
    if (currentUserData.member_count > 0) {
      currentUserData.member_count -= 1;
    }
    entityObject = currentUserData;

    setCurrentUserData({...currentUserData});
    const params = {};
    leaveTeam(params, userID, authContext)
      .then(() => {})
      .catch((error) => {
        currentUserData.is_joined = true;
        currentUserData.member_count += 1;
        entityObject = currentUserData;

        setCurrentUserData({...currentUserData});
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const clubInviteTeam = async () => {
    setloading(true);
    const params = [userID];
    inviteTeam(params, authContext.entity.uid, authContext)
      .then(() => {
        setloading(false);

        setTimeout(() => {
          Alert.alert(
            strings.alertmessagetitle,
            `“${currentUserData.group_name}“ ${strings.isinvitedsuccesfully}`,
          );
        }, 10);
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const clubJoinTeam = () => {
    const e = authContext.entity;
    const tempIds = [];
    tempIds.push(currentUserData.group_id);
    e.obj.parent_groups = tempIds;

    if (currentUserData.joined_teams) {
      currentUserData.joined_teams.push(e.obj);
    } else {
      currentUserData.joined_teams = [e.obj];
    }
    entityObject = currentUserData;

    setCurrentUserData({...currentUserData});
    joinTeam({}, userID, authContext)
      .then(async (response) => {
        const entity = authContext.entity;

        entity.auth.user = response.payload;
        entity.obj = response.payload;
        authContext.setEntity({...entity});
        authContext.setUser(response.payload);
        await Utility.setStorage('authContextUser', response.payload);
        await Utility.setStorage('authContextEntity', {...entity});
      })
      .catch((error) => {
        delete e.obj.parent_group_id;

        if (currentUserData.joined_teams) {
          currentUserData.joined_teams = currentUserData.joined_teams.filter(
            (team) => team.group_id !== e.uid,
          );
        }
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      })
      .finally(() => {
        authContext.setEntity({...e});
        Utility.setStorage('authContextEntity', {...e});
        entityObject = currentUserData;

        setCurrentUserData({...currentUserData});
      });
  };

  const onMessageButtonPress = (user) => {
    const uid =
      user?.entity_type === Verbs.entityTypePlayer
        ? user?.user_id
        : user?.group_id;

    navigation.navigate('MessageChat', {userId: uid});
  };
  const onDotPress = () => {
    offerActionSheet.current.show();
  };
  const clubLeaveTeam = () => {
    const e = authContext.entity;
    e.obj.parent_groups = [];
    authContext.setEntity({...e});
    Utility.setStorage('authContextEntity', {...e});
    if (currentUserData.parent_groups) {
      currentUserData.parent_groups = currentUserData.parent_groups.filter(
        (team) => team.group_id !== userID,
      );
    }
    entityObject = currentUserData;

    setCurrentUserData({...currentUserData});
    const params = {};
    leaveTeam(params, userID, authContext)
      .then(() => {})
      .catch((error) => {
        e.obj.parent_group_id = userID;
        authContext.setEntity({...e});
        Utility.setStorage('authContextEntity', {...e});
        if (currentUserData.joined_teams) {
          currentUserData.joined_teams.push(e.obj);
        } else {
          currentUserData.joined_teams = [e.obj];
        }
        entityObject = currentUserData;

        setCurrentUserData({...currentUserData});
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      })
      .finally(() => {
        authContext.setEntity({...e});
        Utility.setStorage('authContextEntity', {...e});
        entityObject = currentUserData;
        setCurrentUserData({...currentUserData});
      });
  };

  const onUserAction = useCallback(
    (action) => {
      switch (action) {
        case Verbs.followVerb:
          callFollowUser();
          break;
        case Verbs.unfollowVerb:
          callUnfollowUser();
          break;
        case Verbs.inviteVerb:
          clubInviteUser();
          break;
        case Verbs.messageVerb:
          // onMessageButtonPress(currentUserData);
          groupMessageActionSheet.current.show();
          break;
        case Verbs.editVerb:
          // navigation.navigate('EditPersonalProfileScreen');
          // navigation.navigate('PersonalInformationScreen');
          navigation.navigate('PersonalInformationScreen', {
            isEditProfile: true,
          });
          break;
        default:
      }
    },
    [
      callFollowUser,
      callUnfollowUser,
      clubInviteUser,
      currentUserData,
      navigation,
      onMessageButtonPress,
    ],
  );

  const onClubAction = useCallback(
    (action) => {
      switch (action) {
        case Verbs.followVerb:
          callFollowGroup();
          break;
        case Verbs.unfollowVerb:
          callUnfollowGroup();
          break;
        case Verbs.joinVerb:
          userJoinGroup();
          break;
        case Verbs.leaveVerb:
          userLeaveGroup();
          break;
        case Verbs.joinTeamVerb:
          // console.log('authContext?.entity?.obj?.parent_groups',authContext?.entity?.obj?.parent_groups);
          // console.log('currentUserData?.group_id',currentUserData?.group_id);
          // if (
          //   authContext?.entity?.obj?.parent_groups?.includes(
          //     currentUserData?.group_id,
          //   )
          // ) {
          //   clubJoinTeam();
          //   Alert.alert(
          //     strings.alertmessagetitle,
          //     strings.alreadyjoinclubmessage,
          //   );
          // } else {
          //   clubJoinTeam();
          // }
          clubJoinTeam();
          break;
        case Verbs.leaveTeamVerb:
          clubLeaveTeam();
          break;
        case Verbs.messageVerb:
          onMessageButtonPress(currentUserData);
          break;
        case Verbs.editVerb:
          navigation.navigate('EditGroupProfileScreen', {
            placeholder:
              authContext.entity.role === Verbs.entityTypeTeam
                ? strings.teamNamePlaceholder
                : strings.clubNameplaceholder,
            nameTitle:
              authContext.entity.role === Verbs.entityTypeTeam
                ? strings.teamName
                : strings.clubName,
            sportType: currentUserData.sports_string,
            isEditProfileTitle: true,
          });
          break;
        default:
      }
    },
    [
      authContext.entity.obj.parent_groups,
      authContext.entity.role,
      callFollowGroup,
      callUnfollowGroup,
      clubJoinTeam,
      clubLeaveTeam,
      currentUserData,
      navigation,
      onMessageButtonPress,
      userJoinGroup,
      userLeaveGroup,
    ],
  );

  const onTeamAction = useCallback(
    (action) => {
      switch (action) {
        case Verbs.followVerb:
          callFollowGroup();
          break;
        case Verbs.unfollowVerb:
          callUnfollowGroup();
          break;
        case Verbs.joinVerb:
          userJoinGroup();
          break;
        case Verbs.leaveVerb:
          userLeaveGroup();
          break;
        case Verbs.inviteVerb:
          clubInviteTeam();
          break;
        case Verbs.messageVerb:
          onMessageButtonPress(currentUserData);
          break;
        case Verbs.dotVerb:
          onDotPress();
          break;
        case Verbs.editVerb:
          // edit code here
          navigation.navigate('EditGroupProfileScreen', {
            placeholder:
              authContext.entity.role === Verbs.entityTypeTeam
                ? strings.teamNamePlaceholder
                : strings.clubNameplaceholder,
            nameTitle:
              authContext.entity.role === Verbs.entityTypeTeam
                ? strings.teamName
                : strings.clubName,
            sportType: currentUserData.sport_type,
            isEditProfileTitle: true,
          });
          break;
        default:
      }
    },
    [
      authContext.entity.role,
      callFollowGroup,
      callUnfollowGroup,
      clubInviteTeam,
      currentUserData,
      navigation,
      onMessageButtonPress,
      userJoinGroup,
      userLeaveGroup,
    ],
  );

  const onTeamPress = useCallback(
    (groupObject) => {
      navigation.push('HomeScreen', {
        uid: groupObject?.group_id,
        backButtonVisible: true,
        role: groupObject?.entity_type,
      });
    },
    [navigation],
  );

  const onMemberPress = (memberObject) => {
    console.log('memberObject', memberObject);
  };

  const onGroupListPress = (groupList, entityType) => {
    navigation.push('GroupListScreen', {
      groups: groupList,
      entity_type: entityType,
    });
  };

  let language_string = '';

  const scorekeeperInModal = useCallback(
    (scorekeeperInObject) => {
      if (scorekeeperInObject) {
        const entity = authContext.entity;
        let languagesListName = [];

        const scorekeeperSport = currentUserData.scorekeeper_data.filter(
          (scorekeeperItem) =>
            scorekeeperItem.sport === scorekeeperInObject.sport,
        )[0];

        setSelectScorekeeperData(scorekeeperSport);
        languagesListName = scorekeeperSport.language;

        if (scorekeeperSport?.avg_review) {
          let array = Object.keys(scorekeeperSport.avg_review);
          array = array.filter((e) => e !== 'total_avg');
          const scorekeeperProperty = [];

          for (let i = 0; i < array.length; i++) {
            const obj = {
              [array[i]]: scorekeeperSport.avg_review[array[i]],
            };
            scorekeeperProperty.push(obj);
          }
          setAverageScorekeeperReview(scorekeeperProperty);
        } else {
          setAverageScorekeeperReview();
        }
        if (languagesListName.length > 0) {
          languagesListName.map((langItem, index) => {
            language_string =
              language_string + (index ? ', ' : '') + langItem.language_name;
            return null;
          });
          setLanguagesName(language_string);
        }
        setScorekeeperInModalVisible(!scorekeeperInModalVisible);
        setSportName(Utility.getSportName(scorekeeperInObject, authContext));

        getScorekeeperMatch(
          entity.uid || entity.auth.user_id,
          scorekeeperInObject.sport,
          authContext,
        )
          .then((res) => {
            const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            const recentMatch = [];
            const upcomingMatch = [];
            if (res.payload.length > 0) {
              res.payload.filter((event_item) => {
                const eventStartDate = new Date(
                  event_item.start_datetime * 1000,
                );
                if (eventStartDate > date) {
                  upcomingMatch.push(event_item);
                  setScorekeeperUpcomingMatch([...upcomingMatch]);
                } else {
                  recentMatch.push(event_item);

                  setScorekeeperRecentMatch([...recentMatch]);
                }
                return null;
              });
            } else {
              setScorekeeperUpcomingMatch([]);
              setScorekeeperRecentMatch([]);
            }
          })
          .catch((error) =>
            Alert.alert(strings.alertmessagetitle, error.message),
          );

        getScorekeeperReviewData(
          route?.params?.uid || entity.uid,
          scorekeeperInObject.sport,
          true,
          authContext,
        )
          .then((res) => {
            if (res?.payload) {
              setScorekeeperReviewData(res?.payload);
            } else {
              setScorekeeperReviewData();
            }
          })
          .catch((error) =>
            Alert.alert(strings.alertmessagetitle, error.message),
          );

        settingUtils
          .getSetting(
            route?.params?.uid || entity.uid,
            Verbs.entityTypeScorekeeper,
            scorekeeperInObject.sport,
            authContext,
          )
          .then((response) => {
            setScorekeeperSettingObject(response);
          })
          .catch(() => {
            setFirstTimeLoading(false);

            // navigation.goBack();
          });
      } else {
        navigation.navigate('RegisterScorekeeper');
      }
    },
    [authContext, route?.params, currentUserData, scorekeeperInModalVisible],
  );

  const refereesInModal = useCallback(
    (refereeInObject) => {
      if (refereeInObject) {
        const entity = authContext.entity;
        let languagesListName = [];
        if (currentUserData) {
          const refereeSport = currentUserData.referee_data.filter(
            (refereeItem) => refereeItem.sport === refereeInObject.sport,
          )[0];

          setSelectRefereeData(refereeSport);
          languagesListName = refereeSport.language;

          if (refereeSport?.avg_review) {
            let array = Object.keys(refereeSport.avg_review);
            array = array.filter((e) => e !== 'total_avg');
            const refereeProperty = [];

            for (let i = 0; i < array.length; i++) {
              const obj = {
                [array[i]]: refereeSport.avg_review[array[i]],
              };
              refereeProperty.push(obj);
            }

            setAverageRefereeReview(refereeProperty);
          } else {
            setAverageRefereeReview();
          }
        }
        if (languagesListName.length > 0) {
          languagesListName.map((langItem, index) => {
            language_string =
              language_string + (index ? ', ' : '') + langItem.language_name;
            return null;
          });
          setLanguagesName(language_string);
        }
        setRefereesInModalVisible(!refereesInModalVisible);
        setSportName(Utility.getSportName(refereeInObject, authContext));

        getRefereedMatch(
          entity.uid || entity.auth.user_id,
          refereeInObject.sport,
          authContext,
        )
          .then((res) => {
            const currentDateTime = new Date().getTime();
            const recentMatch = [];
            const upcomingMatch = [];
            if (res.payload.length > 0) {
              res.payload.map((event_item) => {
                const eventStartDate = event_item.start_datetime * 1000;
                const isFutureDate = eventStartDate > currentDateTime;
                const isGameEnded = event_item?.status === GameStatus.ended;
                if (isGameEnded) {
                  recentMatch.push(event_item);
                  setRefereeRecentMatch([...recentMatch]);
                } else if (isFutureDate && !isGameEnded) {
                  upcomingMatch.push(event_item);
                  setRefereeUpcomingMatch([...upcomingMatch]);
                }
                return null;
              });
            } else {
              setRefereeUpcomingMatch([]);
              setRefereeRecentMatch([]);
            }
          })
          .catch((error) =>
            Alert.alert(strings.alertmessagetitle, error.message),
          );

        getRefereeReviewData(
          route?.params?.uid || entity.uid,
          refereeInObject.sport,
          true,
          authContext,
        )
          .then((res) => {
            if (res?.payload) {
              setRefereeReviewData(res?.payload);
            } else {
              setRefereeReviewData();
            }
          })
          .catch((error) =>
            Alert.alert(strings.alertmessagetitle, error.message),
          );

        settingUtils
          .getSetting(
            route?.params?.uid || entity.uid,
            Verbs.entityTypeReferee,
            refereeInObject.sport,
            authContext,
          )
          .then((response) => {
            setRefereeSettingObject(response);
          })
          .catch(() => {
            setFirstTimeLoading(false);

            // navigation.goBack();
          });
      } else {
        navigation.navigate('RegisterReferee');
      }
    },
    [authContext, route?.params, currentUserData, refereesInModalVisible],
  );

  const onAddRolePress = useCallback(() => {
    addRoleActionSheet.current.show();
  }, [addRoleActionSheet]);

  const refereeFound = useCallback(
    (data) =>
      (data?.game?.referees || []).some(
        (e) => authContext.entity.uid === e.referee_id,
      ),
    [authContext.entity.uid],
  );

  const scorekeeperFound = useCallback(
    (data) =>
      (data?.game?.scorekeepers || []).some(
        (e) => authContext.entity.uid === e.scorekeeper_id,
      ),
    [authContext.entity.uid],
  );

  const findCancelButtonIndex = useCallback(
    (data) => {
      if (data?.game && refereeFound(data)) {
        return 2;
      }
      if (data?.game && scorekeeperFound(data)) {
        return 2;
      }
      if (data?.game) {
        return 3;
      }
      return 2;
    },
    [refereeFound, scorekeeperFound],
  );

  const goToChallengeDetail = useCallback(
    (data) => {
      if (data?.responsible_to_secure_venue) {
        setloading(true);
        Utils.getChallengeDetail(data?.challenge_id, authContext).then(
          (obj) => {
            setloading(false);
            navigation.navigate(obj.screenName, {
              challengeObj: obj.challengeObj || obj.challengeObj[0],
            });
            setloading(false);
          },
        );
      }
    },
    [authContext, navigation],
  );

  const goToRefereReservationDetail = useCallback(
    (data) => {
      const refereeObj = data?.game?.referees?.filter(
        (obj) => obj?.referee_id === authContext.entity.uid,
      )?.[0];

      setloading(true);
      RefereeUtils.getRefereeReservationDetail(
        refereeObj?.reservation_id,
        authContext.entity.uid,
        authContext,
      ).then((obj) => {
        setloading(false);
        navigation.navigate(obj.screenName, {
          reservationObj: obj.reservationObj || obj.reservationObj[0],
        });
        setloading(false);
      });
    },
    [authContext, navigation],
  );

  const goToScorekeeperReservationDetail = useCallback(
    (data) => {
      const scorekeeperObj = data?.game?.scorekeepers?.filter(
        (obj) => obj?.scorekeeper_id === authContext.entity.uid,
      )?.[0];
      setloading(true);
      ScorekeeperUtils.getScorekeeperReservationDetail(
        scorekeeperObj?.reservation_id,
        authContext.entity.uid,
        authContext,
      ).then((obj) => {
        setloading(false);

        navigation.navigate(obj.screenName, {
          reservationObj: obj.reservationObj || obj.reservationObj[0],
        });
        setloading(false);
      });
    },
    [authContext, navigation],
  );

  const playInModel = useCallback(
    (playInObject) => {
      if (playInObject) {
        setSportName(Utility.getSportName(playInObject, authContext));

        setTimeout(() => {
          setCurrentPlayInObject({...playInObject});
          setPlaysInModalVisible(!playsInModalVisible);
        }, 10);

        getSettingOfBoth(playInObject);
      } else {
        navigation.navigate('RegisterPlayer');
      }
    },
    [navigation, playsInModalVisible],
  );

  const reviewerDetailModal = useCallback(() => {
    setReviewerDetailModalVisible(!reviewerDetailModalVisible);
  }, [reviewerDetailModalVisible]);

  const refereeReservModal = useCallback(() => {
    setIsRefereeModal(!isRefereeModal);
  }, [isRefereeModal]);

  const onConnectionButtonPress = useCallback(
    (tab) => {
      let entity_type = authContext?.entity?.role;
      let user_id = authContext?.entity?.uid;
      if (route?.params?.role) entity_type = route?.params?.role;
      if (route?.params?.uid) user_id = route?.params?.uid;

      if (tab === Verbs.followingVerb) {
        if (
          entity_type === Verbs.entityTypeTeam ||
          entity_type === Verbs.entityTypeClub
        ) {
          navigation.navigate('JoinedTeamsScreen', {
            uid: route?.params?.uid,
            role: route?.params?.role,
          });
        } else {
          navigation.navigate('UserConnections', {tab, entity_type, user_id});
        }
      } else if (tab === Verbs.privacyTypeFollowers) {
        navigation.navigate('UserConnections', {tab, entity_type, user_id});
      } else if (tab === Verbs.privacyTypeMembers) {
        navigation.navigate('GroupMembersScreen', {
          groupID: user_id,
          groupObj: currentUserData,
        });
      }
    },
    [
      authContext?.entity?.role,
      authContext?.entity?.uid,
      navigation,
      route?.params?.role,
      route?.params?.uid,
    ],
  );

  const actionSheetOpetions = useCallback(() => {
    if (selectedEventItem !== null && selectedEventItem.game) {
      if (refereeFound(selectedEventItem)) {
        return [
          strings.refereeReservationDetail,
          strings.changeEventColorText,
          strings.cancel,
        ];
      }
      if (scorekeeperFound(selectedEventItem)) {
        return [
          strings.scorekeeperReservationDetail,
          strings.changeEventColorText,
          strings.cancel,
        ];
      }
      return [
        strings.gameReservationDetails,
        strings.refereeReservationDetail,
        strings.changeEventColorText,
        strings.cancel,
      ];
    }
    return [strings.editText, strings.deleteText, strings.cancel];
  }, [refereeFound, selectedEventItem]);

  const renderRefereesTabContainer = (tabKey) => (
    <View style={{flex: 1}}>
      {/* Referee Info */}
      {tabKey === 0 && (
        <RefereeInfoSection
          data={currentUserData}
          refereeSetting={refereeSettingObject}
          selectRefereeData={selectRefereeData}
          searchLocation={searchLocation}
          languagesName={languagesName}
          onSavePress={(params) => {
            let languagesListName = [];
            patchRegisterRefereeDetails(params, authContext)
              .then((res) => {
                const changedata = currentUserData;
                changedata.referee_data = res.payload.referee_data;
                changedata.gender = res.payload.gender;
                changedata.birthday = res.payload.birthday;
                setCurrentUserData(changedata);

                if (res.payload.referee_data) {
                  res.payload.referee_data.map((refereeItem) => {
                    if (refereeItem.sport === sportName) {
                      setSelectRefereeData(refereeItem);
                      languagesListName = refereeItem.language;
                    }
                    return null;
                  });
                }
                if (languagesListName.length > 0) {
                  languagesListName.map((langItem, index) => {
                    language_string =
                      language_string +
                      (index ? ', ' : '') +
                      langItem.language_name;
                    return null;
                  });
                  setLanguagesName(language_string);
                }
              })
              .catch((error) => {
                console.log('error coming', error);
                Alert.alert(strings.alertmessagetitle, error.message);
              });
          }}
          navigation={navigation}
        />
      )}

      {/* Recent Match */}
      {tabKey === 1 && (
        <View>
          <ScheduleTabView
            firstTabTitle={format(
              strings.completedNGame,
              refereeRecentMatch.length,
            )}
            secondTabTitle={format(
              strings.upcomingNGame,
              refereeUpcomingMatch.length,
            )}
            indexCounter={scoreboardTabNumber}
            eventPrivacyContianer={{width: wp('70%')}}
            onFirstTabPress={() => setScroboardTabNumber(0)}
            onSecondTabPress={() => setScroboardTabNumber(1)}
          />
          {scoreboardTabNumber === 0 && (
            <ScoreboardSportsScreen
              onBackPress={() => setRefereesInModalVisible(true)}
              sportsData={refereeRecentMatch}
              showEventNumbers={false}
              showAssistReferee={true}
              navigation={navigation}
              onItemPress={() => {
                setRefereeMatchModalVisible(false);
                setRefereesInModalVisible(false);
              }}
            />
          )}
          {scoreboardTabNumber === 1 && (
            <UpcomingMatchScreen
              onBackPress={() => setRefereesInModalVisible(true)}
              sportsData={refereeUpcomingMatch}
              showEventNumbers={true}
              navigation={navigation}
              onItemPress={() => {
                setPlaysInModalVisible(false);
              }}
            />
          )}
        </View>
      )}

      {/* Reviews */}
      {tabKey === 2 && (
        <View>
          <ReviewSection
            onFeedPress={onFeedPress}
            reviewsData={averageRefereeReview}
            reviewsFeed={refereeReviewData}
            onReadMorePress={() => {
              reviewerDetailModal();
            }}
          />
        </View>
      )}
    </View>
  );

  const renderScorekeeperTabContainer = (tabKey) => (
    <View style={{flex: 1}}>
      {/* scorekeeper Info */}
      {tabKey === 0 && (
        <ScorekeeperInfoSection
          data={currentUserData}
          scorekeeperSetting={scorekeeperSettingObject}
          selectScorekeeperData={selectScorekeeperData}
          searchLocation={searchLocation}
          languagesName={languagesName}
          onSavePress={(params) => {
            let languagesListName = [];
            patchRegisterScorekeeperDetails(params, authContext)
              .then((res) => {
                const changedata = currentUserData;
                changedata.scorekeeper_data = res.payload.scorekeeper_data;
                changedata.gender = res.payload.gender;
                changedata.birthday = res.payload.birthday;
                setCurrentUserData(changedata);

                if (res.payload.scorekeeper_data) {
                  res.payload.scorekeeper_data.map((scorekeeperItem) => {
                    if (scorekeeperItem.sport === sportName) {
                      setSelectRefereeData(scorekeeperItem);
                      languagesListName = scorekeeperItem.language;
                    }
                    return null;
                  });
                }
                if (languagesListName.length > 0) {
                  languagesListName.map((langItem, index) => {
                    language_string =
                      language_string +
                      (index ? ', ' : '') +
                      langItem.language_name;
                    return null;
                  });
                  setLanguagesName(language_string);
                }
              })
              .catch((error) => {
                console.log('error coming', error);
                Alert.alert(strings.alertmessagetitle, error.message);
              });
          }}
        />
      )}

      {/* Recent Match */}
      {tabKey === 1 && (
        <View>
          <ScheduleTabView
            firstTabTitle={format(
              strings.completedNGame,
              refereeRecentMatch.length,
            )}
            secondTabTitle={format(
              strings.upcomingNGame,
              refereeUpcomingMatch.length,
            )}
            indexCounter={scoreboardTabNumber}
            eventPrivacyContianer={{width: wp('70%')}}
            onFirstTabPress={() => setScroboardTabNumber(0)}
            onSecondTabPress={() => setScroboardTabNumber(1)}
          />
          {scoreboardTabNumber === 0 && (
            <ScoreboardSportsScreen
              onBackPress={() => setScorekeeperInModalVisible(true)}
              sportsData={refereeRecentMatch}
              showEventNumbers={false}
              showAssistReferee={true}
              navigation={navigation}
              onItemPress={() => {
                setRefereeMatchModalVisible(false);
                setScorekeeperInModalVisible(false);
              }}
            />
          )}
          {scoreboardTabNumber === 1 && (
            <UpcomingMatchScreen
              onBackPress={() => setScorekeeperInModalVisible(true)}
              sportsData={refereeUpcomingMatch}
              showEventNumbers={true}
              navigation={navigation}
              onItemPress={() => {
                setScorekeeperInModalVisible(false);
                setPlaysInModalVisible(false);
              }}
            />
          )}
        </View>
      )}

      {/* scorekeeper Reviews tab */}
      {tabKey === 2 && (
        <View>
          <ReviewSection
            onFeedPress={onScorekeeperFeedPress}
            reviewsData={averageScorekeeperReview}
            reviewsFeed={scorekeeperReviewData}
            onReadMorePress={() => {
              reviewerDetailModal();
            }}
          />
        </View>
      )}
    </View>
  );

  const onScoreboardSearchTextChange = useCallback(
    (text) => {
      setScoreboardSearchText(text);
      const result = scoreboardGameData.filter(
        (x) =>
          (x.sport && x.sport.toLowerCase().includes(text.toLowerCase())) ||
          (x.sport && x.sport.toLowerCase().includes(text.toLowerCase())),
      );
      setFilterScoreboardGameData(result);
    },
    [scoreboardGameData],
  );

  const onSchedultEventItemPress = useCallback(
    async (item) => {
      const entity = authContext.entity;
      if (item?.game_id) {
        if (item?.game?.sport) {
          const gameHome = getGameHomeScreen(item.game.sport);
          navigation.navigate(gameHome, {
            gameId: item?.game_id,
          });
        }
      } else {
        getEventById(
          entity.role === Verbs.entityTypeUser ? 'users' : 'groups',
          entity.uid || entity.auth.user_id,
          item.cal_id,
          authContext,
        )
          .then((response) => {
            navigation.navigate('EventScreen', {
              data: response.payload,
              gameData: item,
            });
          })
          .catch((e) => {
            console.log('Error :-', e);
          });
      }
    },
    [authContext, navigation],
  );

  const onCalenderDayPress = useCallback(
    (day) => {
      setEventSelectDate(day.dateString);
      const date = moment(day.dateString).format('YYYY-MM-DD');
      const data = [];
      eventData.filter((event_item) => {
        const startDate = new Date(event_item.start_datetime * 1000);
        const eventDateSelect = moment(startDate).format('YYYY-MM-DD');
        if (eventDateSelect === date) {
          data.push(event_item);
        }
        return null;
      });
      setFilterEventData(data);
      return null;
    },
    [eventData],
  );

  const renderChildCalender = useCallback(
    ({item: itemValue}) => {
      const entity = authContext.entity;
      return (
        itemValue.cal_type === Verbs.eventVerb && (
          <EventInCalender
            onPress={async () => {
              if (itemValue?.game_id) {
                if (itemValue?.game?.sport) {
                  const gameHome = getGameHomeScreen(itemValue.game.sport);
                  navigation.navigate(gameHome, {
                    gameId: itemValue.game_id,
                  });
                }
              } else {
                getEventById(
                  entity.role === Verbs.entityTypeUser ? 'users' : 'groups',
                  entity.uid || entity.auth.user_id,
                  itemValue.cal_id,
                  authContext,
                )
                  .then((response) => {
                    navigation.navigate('EventScreen', {
                      data: response.payload,
                      gameData: itemValue,
                    });
                  })
                  .catch((e) => {
                    console.log('Error :-', e);
                  });
              }
            }}
            eventBetweenSection={itemValue.game}
            eventOfSection={
              itemValue.game &&
              itemValue.game.referees &&
              itemValue.game.referees.length > 0
            }
            onThreeDotPress={() => setSelectedEventItem(itemValue)}
            data={itemValue}
            entity={authContext.entity}
          />
        )
      );
    },
    [authContext, navigation],
  );

  const renderCalenderHeaderComponent = useMemo(
    () => (
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.filterHeaderText}>
          {moment(selectionDate).format('ddd, DD MMM')}
        </Text>
        <Text style={styles.headerTodayText}>
          {moment(selectionDate).calendar(null, {
            lastWeek: '[Last] dddd',
            lastDay: '[Yesterday]',
            sameDay: '[Today]',
            nextDay: '[Tomorrow]',
            nextWeek: 'dddd',
          })}
        </Text>
      </View>
    ),
    [selectionDate],
  );

  const calenderKeyExtractor = useCallback(
    (itemValueKey, index) => index.toString(),
    [],
  );
  const renderMainCalender = useCallback(
    (item) => {
      if (item.length > 0) {
        return (
          <FlatList
            data={item}
            renderItem={renderChildCalender}
            ListHeaderComponent={renderCalenderHeaderComponent}
            bounces={false}
            style={{flex: 1}}
            keyExtractor={calenderKeyExtractor}
          />
        );
      }
      return <Text style={styles.dataNotFoundText}>Data Not Found!</Text>;
    },
    [calenderKeyExtractor, renderCalenderHeaderComponent, renderChildCalender],
  );

  const onInnerCalenderDayPress = useCallback(
    (day) => {
      setTimeTableSelectDate(day.dateString);
      const date = moment(day.dateString).format('YYYY-MM-DD');
      const dataItem = [];
      timeTable.filter((time_table_item) => {
        const startDate = new Date(time_table_item.start_datetime * 1000);
        const endDate = new Date(time_table_item.end_datetime * 1000);
        const eventDateSelect = moment(startDate).format('YYYY-MM-DD');
        if (eventDateSelect === date) {
          const obj = {
            ...time_table_item,
            start: moment(startDate).format('YYYY-MM-DD hh:mm:ss'),
            end: moment(endDate).format('YYYY-MM-DD hh:mm:ss'),
          };
          dataItem.push(obj);
        }
        return null;
      });
      setFilterTimeTable(dataItem);
      return null;
    },
    [timeTable],
  );

  const renderInnerCalender = useCallback(
    (item) => (
      <View>
        <EventCalendar
          eventTapped={(event) => {
            console.log('Event ::--', event);
          }}
          events={item}
          width={width}
          initDate={timeTableSelectionDate}
          scrollToFirst={true}
          renderEvent={(event) => {
            let event_color = colors.themeColor;
            let eventTitle = strings.Game;
            let eventDesc = strings.gameWith;
            let eventDesc2 = '';
            if (event.color && event.color.length > 0) {
              if (event.color[0] !== '#') {
                event_color = `#${event.color}`;
              } else {
                event_color = event.color;
              }
            }
            if (event && event.title) {
              eventTitle = event.title;
            }
            if (event && event.descriptions) {
              eventDesc = event.descriptions;
            }
            if (event.game && event.game.away_team) {
              eventDesc2 = event.game.away_team.group_name;
            }
            return (
              <View style={{flex: 1}}>
                {event.cal_type === Verbs.eventVerb && (
                  <CalendarTimeTableView
                    title={eventTitle}
                    summary={`${eventDesc} ${eventDesc2}`}
                    containerStyle={{
                      borderLeftColor: event_color,
                      width: event.width,
                    }}
                    eventTitleStyle={{color: event_color}}
                  />
                )}
                {event.cal_type === Verbs.blockedVerb && (
                  <View
                    style={[
                      styles.blockedViewStyle,
                      {
                        width: event.width + 68,
                        height: event.height,
                      },
                    ]}
                  />
                )}
              </View>
            );
          }}
          styles={{
            event: styles.eventViewStyle,
            line: {backgroundColor: colors.lightgrayColor},
          }}
        />
        {item.length > 0 && (
          <FlatList
            data={item}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({item: blockItem}) => {
              if (blockItem.cal_type === Verbs.blockedVerb) {
                return (
                  <EventBlockTimeTableView
                    blockText={strings.blockedZone}
                    blockZoneTime={`${moment(blockItem.start).format(
                      'hh:mma',
                    )} - ${moment(blockItem.end).format('hh:mma')}`}
                  />
                );
              }
              return <View />;
            }}
            ItemSeparatorComponent={() => <View style={{height: wp('3%')}} />}
            style={{marginVertical: wp('4%')}}
            keyExtractor={(itemValue, index) => index.toString()}
          />
        )}
      </View>
    ),
    [timeTableSelectionDate],
  );

  const renderRefereeReservation = useCallback(
    ({item}) => (
      <RefereeReservationItem
        data={item}
        onPressButton={() => {
          setIsRefereeModal(false);
          goToRefereReservationDetail(item);
        }}
      />
    ),
    [goToRefereReservationDetail],
  );

  const moveToMainInfoTab = () => {
    navigation.navigate('EntityInfoScreen', {
      uid: route?.params?.uid || authContext.entity.uid,
      isAdmin: route?.params?.uid === authContext.entity.uid,
      onGroupListPress: () => onGroupListPress,
      onTeamPress: () => onTeamPress,
      refereesInModal: () => refereesInModal,
      playInModel: () => playInModel,
      onMemberPress: () => onMemberPress,
    });
  };

  const moveToScoreboardTab = () => {
    navigation.navigate('EntityScoreboardScreen', {
      uid: route?.params?.uid || authContext.entity.uid,
      isAdmin,
    });
  };

  const renderMainScoreboardTab = () => (
    <View style={{flex: 1}}>
      <TCSearchBox
        onChangeText={onScoreboardSearchTextChange}
        marginTop={20}
        marginBottom={5}
        alignSelf={'center'}
        width={wp('94%')}
        borderRadius={0}
        backgroundColor={colors.grayBackgroundColor}
        height={40}
        shadowOpacity={0}
      />
      <ScoreboardSportsScreen
        sportsData={
          scoreboardSearchText.length > 0
            ? filterScoreboardGameData
            : scoreboardGameData
        }
        navigation={navigation}
        onItemPress={() => {
          setRefereeMatchModalVisible(false);
          setRefereesInModalVisible(false);
        }}
      />
    </View>
  );

  const renderMainScheduleTab = useMemo(
    () => (
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <ScheduleTabView
            firstTabTitle={strings.events}
            secondTabTitle={strings.calender}
            indexCounter={scheduleIndexCounter}
            onFirstTabPress={() => setScheduleIndexCounter(0)}
            onSecondTabPress={() => setScheduleIndexCounter(1)}
          />
        </View>
        {!eventData && <TCInnerLoader visible={true} />}
        {eventData && scheduleIndexCounter === 0 && (
          <View style={{flex: 1}}>
            <EventScheduleScreen
              eventData={eventData}
              navigation={navigation}
              profileID={route?.params?.uid || authContext.entity.uid}
              screenUserId={route?.params?.uid}
              onThreeDotPress={(item) => setSelectedEventItem(item)}
              onItemPress={onSchedultEventItemPress}
              entity={authContext.entity}
            />
          </View>
        )}

        {eventData && scheduleIndexCounter === 1 && (
          <View style={{flex: 1}}>
            <View style={styles.shceduleCalenderView}>
              <BackForwardView
                textValue={moment(selectionDate).format('MMMM YYYY')}
              />
              <View>
                <TwoTabView
                  firstTabTitle={strings.events}
                  secondTabTitle={strings.timetable}
                  indexCounter={calenderInnerIndexCounter}
                  onFirstTabPress={() => setCalenderInnerIdexCounter(0)}
                  onSecondTabPress={() => setCalenderInnerIdexCounter(1)}
                />
              </View>
            </View>

            {calenderInnerIndexCounter === 0 && (
              <EventAgendaSection
                items={{[selectionDate.toString()]: [filterEventData]}}
                selected={selectionDate}
                onDayPress={onCalenderDayPress}
                renderItem={renderMainCalender}
              />
            )}

            {calenderInnerIndexCounter === 1 && (
              <EventAgendaSection
                items={{[timeTableSelectionDate.toString()]: [filterTimeTable]}}
                onDayPress={onInnerCalenderDayPress}
                renderItem={renderInnerCalender}
              />
            )}
          </View>
        )}

        {isRefereeModal && (
          <Modal
            isVisible={isRefereeModal}
            backdropColor="black"
            style={{margin: 0, justifyContent: 'flex-end'}}
            hasBackdrop
            onBackdropPress={() => setIsRefereeModal(false)}
            backdropOpacity={0}>
            <SafeAreaView style={styles.modalMainViewStyle}>
              <Header
                mainContainerStyle={styles.refereeHeaderMainStyle}
                leftComponent={
                  <TouchableOpacity
                    hitSlop={Utility.getHitSlop(15)}
                    onPress={() => setIsRefereeModal(false)}>
                    <Image
                      source={images.cancelImage}
                      style={[
                        styles.cancelImageStyle,
                        {tintColor: colors.blackColor},
                      ]}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                }
                centerComponent={
                  <Text style={styles.headerCenterStyle}>
                    {strings.chooseRefereeText}
                  </Text>
                }
              />
              <View style={styles.refereeSepratorStyle} />
              <FlatList
                data={refereeReservData}
                bounces={false}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                  <View
                    style={[
                      styles.refereeSepratorStyle,
                      {marginHorizontal: 15},
                    ]}
                  />
                )}
                renderItem={renderRefereeReservation}
                keyExtractor={(item, index) => index.toString()}
              />
            </SafeAreaView>
          </Modal>
        )}

        <ActionSheet
          ref={eventEditDeleteAction}
          options={actionSheetOpetions()}
          cancelButtonIndex={findCancelButtonIndex(selectedEventItem)}
          destructiveButtonIndex={
            selectedEventItem !== null && !selectedEventItem.game && 1
          }
          onPress={(index) => {
            if (index === 0) {
              if (index === 0 && selectedEventItem.game) {
                if (refereeFound(selectedEventItem)) {
                  goToRefereReservationDetail(selectedEventItem);
                } else if (scorekeeperFound(selectedEventItem)) {
                  goToScorekeeperReservationDetail(selectedEventItem);
                } else {
                  goToChallengeDetail(selectedEventItem.game);
                }
              } else {
                navigation.navigate('EditEventScreen', {
                  data: selectedEventItem,
                  gameData: selectedEventItem,
                });
              }
            }
            if (index === 1) {
              if (index === 1 && selectedEventItem.game) {
                if (refereeFound(selectedEventItem)) {
                  Alert.alert(
                    strings.appName,
                    strings.pendingFunctionality,
                    [
                      {
                        text: strings.okTitleText,
                        onPress: async () => {},
                      },
                    ],
                    {cancelable: false},
                  );
                } else {
                  setloading(true);

                  const params = {
                    caller_id: selectedEventItem.owner_id,
                  };
                  getRefereeReservationDetails(
                    selectedEventItem.game_id,
                    params,
                    authContext,
                  )
                    .then((res) => {
                      const myReferee = (res?.payload || []).filter(
                        (e) => e.initiated_by === authContext.entity.uid,
                      );
                      setRefereeReserveData(myReferee);
                      if (res.payload.length > 0) {
                        refereeReservModal();
                        setloading(false);
                      } else {
                        setloading(false);
                        setTimeout(() => {
                          Alert.alert(
                            strings.appName,
                            strings.noRefereeInvitedText,
                            [
                              {
                                text: strings.okTitleText,
                                onPress: async () => {},
                              },
                            ],
                            {cancelable: false},
                          );
                        }, 0);
                      }
                    })
                    .catch((error) => {
                      Alert.alert(error.message);
                    });
                }
              } else {
                Alert.alert(
                  strings.deleteThisEventText,
                  '',
                  [
                    {
                      text: strings.deleteText,
                      style: 'destructive',
                      onPress: async () => {
                        setloading(true);
                        const entity = authContext.entity;
                        const uid = entity.uid || entity.auth.user_id;
                        const entityRole =
                          entity.role === Verbs.entityTypeUser
                            ? 'users'
                            : 'groups';
                        deleteEvent(
                          entityRole,
                          uid,
                          selectedEventItem.cal_id,
                          authContext,
                        )
                          .then(() =>
                            Utility.getCalendar(
                              uid,
                              new Date().getTime() / 1000,
                            ),
                          )
                          .then((response) => {
                            setEventData(response);
                            setTimeTable(response);
                          })
                          .catch((e) => {
                            setloading(false);
                            Alert.alert('', e.messages);
                          });
                      },
                    },
                    {
                      text: strings.cancel,
                      style: 'cancel',
                    },
                  ],
                  {cancelable: false},
                );
              }
            }
            if (index === 2) {
              if (index === 2 && selectedEventItem.game) {
                if (refereeFound(selectedEventItem)) {
                  console.log('Pressed cancel button.');
                } else {
                  Alert.alert(
                    strings.appName,
                    strings.pendingFunctionality,
                    [
                      {
                        text: strings.okTitleText,
                        onPress: async () => {},
                      },
                    ],
                    {cancelable: false},
                  );
                }
              }
            }
            setSelectedEventItem(null);
          }}
        />
        <CreateEventBtnModal
          visible={createEventModal}
          onCancelPress={() => setCreateEventModal(false)}
          onCreateEventPress={() => {
            setCreateEventModal(false);
            navigation.navigate('CreateEventScreen', {
              comeName: 'ScheduleScreen',
            });
          }}
          onChallengePress={() => {
            setCreateEventModal(false);
            navigation.navigate('EditChallengeAvailability');
          }}
        />
      </View>
    ),
    [
      actionSheetOpetions,
      authContext,
      calenderInnerIndexCounter,
      createEventModal,
      eventData,
      filterEventData,
      filterTimeTable,
      findCancelButtonIndex,
      goToChallengeDetail,
      goToRefereReservationDetail,
      isRefereeModal,
      navigation,
      onCalenderDayPress,
      onInnerCalenderDayPress,
      onSchedultEventItemPress,
      refereeFound,
      refereeReservData,
      refereeReservModal,
      renderInnerCalender,
      renderMainCalender,
      renderRefereeReservation,
      route?.params?.uid,
      scheduleIndexCounter,
      selectedEventItem,
      selectionDate,
      timeTableSelectionDate,
    ],
  );

  const renderHomeMainReviewTab = useMemo(
    () => (
      <View>
        <ReviewSection
          isTeamReviewSection={true}
          reviewsData={averageTeamReview}
          reviewsFeed={teamReviewData}
          onFeedPress={() => alert(5)}
          onReadMorePress={() => {
            reviewerDetailModal();
          }}
        />
        {/* <TeamHomeReview
                  navigation={navigation}
                  teamID={route?.params?.uid || authContext.entity.uid}
                  getSoccerTeamReview={getTeamReviewById}
                  isAdmin={isAdmin}
                  // gameData={gameData}
                  /> */}
      </View>
    ),
    [averageTeamReview, reviewerDetailModal, teamReviewData],
  );
  const moveToSchedule = () => {
    navigation.navigate('ScheduleScreen', {
      isBackVisible: true,
      uid: route?.params?.uid || authContext?.entity?.uid,
      role: route?.params?.role || authContext?.entity?.role,
    });
  };

  const moveToGallary = () => {
    navigation.navigate('EntityGallaryScreen', {
      currentUserData,
      isAdmin,
      galleryRef,
      entityType: route?.params?.role ?? authContext.entity?.role,
      entityID: route?.params?.uid ?? authContext.entity?.uid,
      callFunction: () => callthis,
    });
  };
  const moveToReview = () => {
    navigation.navigate('EntityReviewScreen', {
      averageTeamReview,
      teamReviewData,
      userID,
    });
  };

  const moveToStats = () => {
    navigation.navigate('EntityStatScreen', {
      entityData: entityObject,
    });
  };

  const renderHomeMainTabContain = useMemo(
    () => (
      <View style={{flex: 1}}>
        {currentTab === 1 && moveToMainInfoTab()}
        {currentTab === 2 && renderMainScoreboardTab()}
        {currentTab === 3 && moveToSchedule()}
        {currentTab === 4 && moveToGallary()}
        {currentTab === 5 && isTeamHome && renderHomeMainReviewTab}
      </View>
    ),
    [
      authContext.entity?.role,
      authContext.entity?.uid,
      callthis,
      currentTab,
      currentUserData,
      isAdmin,
      isTeamHome,
      navigation,
      renderHomeMainReviewTab,
      moveToMainInfoTab,
      renderMainScheduleTab,
      renderMainScoreboardTab,
      route?.params?.role,
      route?.params?.uid,
    ],
  );

  const handleMainRefOnScroll = Animated.event([
    {nativeEvent: {contentOffset: {y: mainFlatListFromTop}}},
  ]);

  const offerOpetions = () => {
    const opetionArray = [];
    let a = [];
    let b = [];

    a = authContext?.entity?.obj?.referee_data?.filter(
      (obj) =>
        obj.sport === currentUserData?.sport &&
        obj.sport_type === currentUserData?.sport_type,
    );
    b = authContext?.entity?.obj?.scorekeeper_data?.filter(
      (obj) =>
        obj.sport === currentUserData?.sport &&
        obj.sport_type === currentUserData?.sport_type,
    );

    if (a?.length > 0) {
      opetionArray.push(strings.refereeOffer);
    }
    if (b?.length > 0) {
      opetionArray.push(strings.scorekeeperOffer);
    }
    if (a?.length > 0 || b?.length > 0) {
      opetionArray.push(strings.cancel);
    }

    return opetionArray;
  };

  const renderBackground = () => {
    if (bgImage) {
      return (
        <View style={{marginLeft: 10, marginRight: 10}}>
          <FastImage
            source={{uri: bgImage}}
            resizeMode={'cover'}
            style={styles.bgImageStyle}>
            {currentUserData.entity_type !== Verbs.entityTypeClub &&
              !hideScore && (
                <ImageBackground
                  source={images.profileLevel}
                  style={{
                    height: 58,
                    width: 93,

                    resizeMode: 'contain',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'flex-start',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8,
                    }}>
                    <FastImage
                      source={images.tc_message_top_icon}
                      resizeMode={'contain'}
                      style={{height: 35, width: 35}}
                    />
                    <View
                      style={{flexDirection: 'column', alignItems: 'center'}}>
                      <Text
                        style={{
                          fontFamily: fonts.RBold,
                          fontSize: 16,
                          color: colors.lightBlackColor,
                        }}>
                        {currentUserData?.point ?? 0}
                      </Text>
                      <Text
                        style={{
                          fontFamily: fonts.RMedium,
                          fontSize: 10,
                          color: colors.lightBlackColor,
                        }}>
                        {strings.points}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              )}
          </FastImage>
        </View>
      );
    }
    return (
      <View style={{marginLeft: 10, marginRight: 10}}>
        <View style={styles.bgImageStyle}>
          {currentUserData.entity_type !== Verbs.entityTypeClub && !hideScore && (
            <ImageBackground
              source={images.profileLevel}
              style={{
                height: 58,
                width: 93,
                resizeMode: 'contain',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'flex-start',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8,
                }}>
                <FastImage
                  source={images.tc_message_top_icon}
                  resizeMode={'contain'}
                  style={{height: 35, width: 35}}
                />
                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontFamily: fonts.RBold,
                      fontSize: 16,
                      color: colors.lightBlackColor,
                    }}>
                    {currentUserData?.point ?? 0}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.RMedium,
                      fontSize: 10,
                      color: colors.lightBlackColor,
                    }}>
                    {strings.points}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          )}
        </View>
      </View>
    );
  };

  const renderHeaderBackgroundProfile = useMemo(
    () => (
      <BackgroundProfile
        currentUserData={currentUserData}
        onAction={onUserAction}
        loggedInEntity={authContext.entity}
        onConnectionButtonPress={onConnectionButtonPress}
      />
    ),
    [currentUserData, onConnectionButtonPress],
  );

  const renderHeaderBackgroundUserProfile = useMemo(
    () => (
      <UserHomeHeader
        currentUserData={currentUserData}
        onConnectionButtonPress={onConnectionButtonPress}
        onAction={onUserAction}
        isAdmin={isAdmin}
        loggedInEntity={authContext.entity}
      />
    ),
    [
      authContext.entity,
      currentUserData,
      isAdmin,
      onConnectionButtonPress,
      onUserAction,
    ],
  );

  const renderHeaderUserHomeTopSection = useMemo(
    () =>
      isUserHome && (
        <UserHomeTopSection
          userDetails={currentUserData}
          isAdmin={isAdmin}
          loggedInEntity={authContext.entity}
          onAddRolePress={onAddRolePress}
          onRefereesInPress={refereesInModal}
          onScorekeeperInPress={scorekeeperInModal}
          onPlayInPress={playInModel}
          onAction={onUserAction}
        />
      ),
    [
      isUserHome,
      isAdmin,
      authContext.entity,
      onAddRolePress,
      refereesInModal,
      scorekeeperInModal,
      playInModel,
      onUserAction,
    ],
  );

  const renderHeaderClubHomeTopSection = useMemo(
    () =>
      isClubHome && (
        <ClubHomeTopSection
          clubDetails={currentUserData}
          isAdmin={isAdmin}
          loggedInEntity={authContext.entity}
          onAction={onClubAction}
        />
      ),
    [authContext.entity, currentUserData, isAdmin, isClubHome, onClubAction],
  );

  const renderHeaderTeamHomeTopSection = useMemo(
    () =>
      isTeamHome && (
        <TeamHomeTopSection
          teamDetails={currentUserData}
          isAdmin={isAdmin}
          loggedInEntity={authContext.entity}
          onAction={onTeamAction}
          isThreeDotShow={offerOpetions().length > 0}
        />
      ),
    [isTeamHome, authContext.entity, currentUserData, isAdmin, onTeamAction],
  );

  const renderMainHeaderComponent = useMemo(
    () => (
      <View>
        {isUserHome
          ? renderHeaderBackgroundUserProfile
          : renderHeaderBackgroundProfile}

        <View style={{flex: 1}}>
          {renderHeaderUserHomeTopSection}
          {renderHeaderTeamHomeTopSection}
          {renderHeaderClubHomeTopSection}
        </View>
      </View>
    ),
    [
      isUserHome,
      renderHeaderBackgroundProfile,
      renderHeaderBackgroundUserProfile,
      renderHeaderClubHomeTopSection,
      renderHeaderTeamHomeTopSection,
      renderHeaderUserHomeTopSection,
    ],
  );

  const renderHomeTabs = useCallback(
    ({item, index}) => (
      <TouchableOpacity
        style={{margin: 10}}
        onPress={() => {
          if (index === 0) {
            moveToMainInfoTab();
          }
          if (index === 1) {
            moveToScoreboardTab();
          }
          //   if (index === 2) {
          //     moveToSchedule();
          //   }
          if (index === 2) {
            moveToGallary();
          }
          if (index === 3) {
            moveToReview();
          }
          if (index === 4) {
            moveToStats();
          }
        }}>
        <View
          style={{
            marginTop: 2,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 5,
            height: 25,
            justifyContent: 'center',
            backgroundColor: colors.grayBackgroundColor,
            paddingHorizontal: 10,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.RMedium,
              color: colors.lightBlackColor,
              // backgroundColor: colors.redColor,
            }}>
            {item}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [],
  );

  const challengeButtonType = () => {
    if (
      mySettingObject !== null &&
      settingObject !== null &&
      settingObject?.availibility === Verbs.on &&
      mySettingObject?.availibility === Verbs.on
    ) {
      return Verbs.bothVerb;
    }
    if (settingObject === null && mySettingObject === null) {
      return Verbs.inviteVerb;
    }
    if (
      authContext.entity.obj.sport.toLowerCase() ===
        currentUserData.sport.toLowerCase() &&
      (settingObject?.game_duration || settingObject?.score_rules) &&
      settingObject?.availibility &&
      settingObject?.availibility === Verbs.on &&
      (mySettingObject?.availibility === undefined ||
        mySettingObject?.availibility === Verbs.off) &&
      settingObject?.special_rules !== undefined &&
      settingObject?.general_rules !== undefined &&
      settingObject?.responsible_for_referee &&
      settingObject?.responsible_for_scorekeeper &&
      settingObject?.game_fee &&
      settingObject?.venue &&
      settingObject?.refund_policy &&
      settingObject?.home_away &&
      settingObject?.game_type
    ) {
      return Verbs.challengeVerb;
    }
    if (
      authContext.entity.obj.sport.toLowerCase() ===
        currentUserData.sport.toLowerCase() &&
      mySettingObject !== undefined &&
      (settingObject?.availibility === undefined ||
        settingObject?.availibility === Verbs.off) &&
      (mySettingObject?.game_duration || mySettingObject?.score_rules) &&
      (mySettingObject?.availibility !== undefined ||
        mySettingObject?.availibility === Verbs.on) &&
      mySettingObject?.special_rules !== undefined &&
      mySettingObject?.general_rules !== undefined &&
      mySettingObject?.responsible_for_referee &&
      mySettingObject?.responsible_for_scorekeeper &&
      mySettingObject?.game_fee &&
      mySettingObject?.venue &&
      mySettingObject?.refund_policy &&
      mySettingObject?.home_away &&
      mySettingObject?.game_type
    ) {
      return Verbs.inviteVerb;
    }
    return Verbs.challengeVerb;
  };

  const onChallengePress = () => {
    if (challengeButtonType() === Verbs.bothVerb) {
      setChallengePopup(true);
    } else if (challengeButtonType() === Verbs.challengeVerb) {
      setChallengePopup(true);

      // navigation.navigate('ChallengeScreen', {
      //   setting: settingObject,
      //   sportName: currentUserData.sport,
      //   groupObj: currentUserData,
      // });
    } else if (challengeButtonType() === Verbs.inviteVerb) {
      if (settingObject.availibility === Verbs.on) {
        if (
          myGroupDetail.sport_type === Verbs.doubleSport &&
          (!('player_deactivated' in myGroupDetail) ||
            !myGroupDetail?.player_deactivated) &&
          (!('player_leaved' in currentUserData) ||
            !currentUserData?.player_leaved) &&
          (!('player_leaved' in myGroupDetail) || !myGroupDetail?.player_leaved)
        ) {
          if (myGroupDetail.is_pause === true) {
            Alert.alert(format(strings.groupPaused, myGroupDetail.group_name));
          } else {
            navigation.navigate('InviteChallengeScreen', {
              setting: mySettingObject,
              sportName: currentUserData?.sport,
              sportType: currentUserData?.sport_type,
              groupObj: currentUserData,
            });
          }
        } else {
          console.log('in else');
          if (myGroupDetail.sport_type === Verbs.doubleSport) {
            if (
              'player_deactivated' in myGroupDetail &&
              myGroupDetail?.player_deactivated
            ) {
              Alert.alert(strings.playerDeactivatedSport);
            } else if (
              'player_leaved' in currentUserData &&
              currentUserData?.player_leaved
            ) {
              Alert.alert(
                format(strings.groupHaveNo2Player, currentUserData?.group_name),
              );
            } else if (
              'player_leaved' in myGroupDetail &&
              myGroupDetail?.player_leaved
            ) {
              Alert.alert(strings.youHaveNo2Player);
            }
          } else {
            console.log('invite block');
            if (myGroupDetail.is_pause === true) {
              Alert.alert(
                format(strings.groupPaused, myGroupDetail.group_name),
              );
            } else {
              navigation.navigate('InviteChallengeScreen', {
                setting: mySettingObject,
                sportName: currentUserData?.sport,
                sportType: currentUserData?.sport_type,
                groupObj: currentUserData,
              });
            }
          }
        }
      } else {
        console.log('manage block');
        if (currentUserData?.is_pause === true) {
          Alert.alert(strings.yourTeamPaused);
        } else if (
          currentUserData?.player_deactivated === true &&
          currentUserData.sport_type === Verbs.doubleSport
        ) {
          Alert.alert(
            format(
              strings.groupSportActivityDeactivated,
              currentUserData.group_name,
            ),
          );
        } else {
          navigation.navigate('ManageChallengeScreen', {
            groupObj: currentUserData,
            sportName: currentUserData?.sport,
            sportType: currentUserData?.sport_type,
          });
        }
      }
    }
  };

  const challengeButton = () => {
    if (
      !loading &&
      isTeamHome &&
      authContext.entity.role === Verbs.entityTypeTeam &&
      authContext.entity.obj.sport.toLowerCase() ===
        currentUserData?.sport?.toLowerCase()
    ) {
      return (
        <View style={styles.challengeButtonStyle}>
          {authContext.entity.obj.group_id !== currentUserData.group_id && (
            <View styles={[styles.outerContainerStyle, {height: 25}]}>
              <TouchableOpacity onPress={onChallengePress}>
                <LinearGradient
                  colors={[colors.darkThemeColor, colors.themeColor]}
                  style={[
                    styles.containerStyle,
                    {
                      justifyContent: 'center',
                    },
                  ]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {(challengeButtonType() === Verbs.bothVerb ||
                      challengeButtonType() === Verbs.challengeVerb) && (
                      <Text style={styles.challengeButtonTitle}>
                        {strings.challenge}
                        {settingObject?.game_fee?.fee && (
                          <Text>{` $${settingObject?.game_fee?.fee} ${
                            currentUserData?.currency_type ??
                            strings.defaultCurrency
                          } ${strings.perMatch}`}</Text>
                        )}
                      </Text>
                    )}
                    {challengeButtonType() === Verbs.inviteVerb && (
                      <Text style={styles.challengeButtonTitle}>
                        {strings.inviteToChallenge}
                      </Text>
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    }
  };

  const renderMainFlatList = useMemo(
    () => (
      <View
        style={{
          margin: 15,
          marginTop: 0,
          marginBottom: 0,
        }}>
        {challengeButton()}
        {isUserHome ? (
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
              }}>
              {strings.postsTitleText}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 15,
                marginBottom: 20,
              }}>
              <TCGrayButton
                title={strings.galleryTitle}
                style={{marginRight: 15, alignItems: 'center'}}
                showArrow={false}
                textStyle={styles.buttonTextStyle}
                onPressProfile={() => {
                  navigation.navigate('UserGalleryScreen', {
                    isAdmin,
                    galleryRef,
                    entityType: route?.params?.role ?? authContext.entity?.role,
                    entityID: route?.params?.uid ?? authContext.entity?.uid,
                    currentUserData,
                    callFunction: () => callthis,
                  });
                }}
              />
            </View>
            <TCThinDivider width={'100%'} />
          </View>
        ) : (
          <>
            <View style={styles.sepratorView} />
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
                // marginTop: 0,
                marginLeft: 4,
              }}>
              Timeline
            </Text>

            <FlatList
              showsHorizontalScrollIndicator={false}
              data={
                isTeamHome
                  ? [
                      strings.infoTitle,
                      strings.scoreboard,
                      strings.galleryTitle,
                      strings.reviewTitle,
                      strings.statsTitle,
                    ]
                  : [
                      strings.infoTitle,
                      strings.scoreboard,
                      strings.galleryTitle,
                    ]
              }
              horizontal
              renderItem={renderHomeTabs}
              keyExtractor={(index) => index.toString()}
            />
          </>
          // <ScrollableTabs
          //   tabs={
          //     isTeamHome
          //       ? [
          //           'Post',
          //           strings.infoTitle,
          //           strings.scoreboard,
          //           'Schedule',
          //           strings.galleryTitle,
          //           'Review',
          //         ]
          //       : ['Post', strings.infoTitle, strings.scoreboard, 'Schedule', strings.galleryTitle]
          //   }
          //   currentTab={currentTab}
          //   onTabPress={setCurrentTab}
          // />
        )}
      </View>
    ),
    [
      isUserHome,
      isTeamHome,
      currentTab,
      navigation,
      isAdmin,
      route?.params?.role,
      route?.params?.uid,
      authContext.entity?.role,
      authContext.entity?.uid,
      currentUserData,
      callthis,
    ],
  );

  const onFeedPress = useCallback(
    (feed, index, gameData, detailIndex, orangeFeedPress) => {
      setReviewGameData(gameData);
      setFeedDataIndex(index);
      setFeedDetailIndex(detailIndex);
      setOrangeFeed(orangeFeedPress);
      setReviewDetailModalVisible(true);
    },
    [],
  );

  const onScorekeeperFeedPress = useCallback(
    (feed, index, gameData, detailIndex, orangeFeedPress) => {
      setReviewGameData(gameData);
      setFeedDataIndex(index);
      setFeedDetailIndex(detailIndex);
      setOrangeFeed(orangeFeedPress);
      setReviewDetailModalVisible(true);
    },
    [],
  );

  const onLikePress = useCallback(
    (item) => {
      const bodyParams = {
        reaction_type: 'clap',
        activity_id: item.id,
      };
      createReaction(bodyParams, authContext)
        .then(() => {})
        .catch((e) => {
          Alert.alert('', e.messages);
        });
    },
    [authContext],
  );

  const newsFeedListItemSeperator = useMemo(
    () => (
      <View
        style={{
          marginTop: 10,
          height: 8,
          backgroundColor: colors.whiteGradientColor,
        }}
      />
    ),
    [],
  );

  const renderNewsFeed = useCallback(
    ({item}) => {
      // const onDeleteButtonPress = () => onDeletePost(item)
      // const onProfileButtonPress = () => onProfilePress(item)
      // const onLikeButtonPress = () => onLikePress(item)
      const onDeleteButtonPress = () => Alert.alert(strings.deleteText);
      const onProfileButtonPress = () => {
        // setReviewDetailModalVisible(!reviewDetailModalVisible)
        // setRefereeInfoModalVisible(!refereeInfoModalVisible)
        // onProfilePress(item)
      };
      const onLikeButtonPress = () => onLikePress(item);
      return (
        <RefereeFeedPostItems
          // pullRefresh={pullRefresh}
          item={item}
          navigation={navigation}
          caller_id={authContext.entity.uid}
          // onEditPressDone={onEditPressDone}
          onImageProfilePress={onProfileButtonPress}
          onLikePress={onLikeButtonPress}
          onDeletePost={onDeleteButtonPress}
          profileObject={currentUserData}
        />
      );
    },
    [authContext.entity.uid, currentUserData, navigation, onLikePress],
  );

  const renderScorekeeperFeed = useCallback(
    ({item}) => {
      // const onDeleteButtonPress = () => onDeletePost(item)
      // const onProfileButtonPress = () => onProfilePress(item)
      // const onLikeButtonPress = () => onLikePress(item)
      const onDeleteButtonPress = () => Alert.alert(strings.deleteText);
      const onProfileButtonPress = () => {
        // setReviewDetailModalVisible(!reviewDetailModalVisible)
        // setRefereeInfoModalVisible(!refereeInfoModalVisible)
        //  onProfilePress(item)
      };
      const onLikeButtonPress = () => onLikePress(item);
      return (
        <ScorekeeperFeedPostItems
          // pullRefresh={pullRefresh}
          item={item}
          navigation={navigation}
          caller_id={authContext.entity.uid}
          // onEditPressDone={onEditPressDone}
          onImageProfilePress={onProfileButtonPress}
          onLikePress={onLikeButtonPress}
          onDeletePost={onDeleteButtonPress}
          profileObject={currentUserData}
        />
      );
    },
    [authContext.entity.uid, currentUserData, navigation, onLikePress],
  );

  const feedScreenHeader = useMemo(
    () => (
      <View>
        <ReviewRecentMatch
          eventColor={colors.themeColor}
          startDate1={moment(
            new Date(reviewGameData?.data?.start_time * 1000),
          ).format('MMM')}
          startDate2={moment(
            new Date(reviewGameData?.data?.start_time * 1000),
          ).format('DD')}
          title={reviewGameData?.data?.sport}
          startTime={moment(
            new Date(reviewGameData?.data?.start_time * 1000),
          ).format('hh:mm a')}
          endTime={moment(
            new Date(reviewGameData?.data?.end_time * 1000),
          ).format('hh:mm a')}
          location={reviewGameData?.data?.venue?.address}
          firstUserImage={reviewGameData?.home_team?.data?.full_image}
          firstTeamText={reviewGameData?.home_team?.data?.full_name}
          secondUserImage={reviewGameData?.away_team?.data?.full_image}
          secondTeamText={reviewGameData?.away_team?.data?.full_name}
          firstTeamPoint={reviewGameData?.data?.home_team_goal ?? 0}
          secondTeamPoint={reviewGameData?.data?.away_team_goal ?? 0}
        />
        <View style={styles.sepratorView} />
      </View>
    ),
    [reviewGameData],
  );

  const MainHeaderComponent = () => (
    <>
      {!isUserHome && renderBackground()}
      {renderMainHeaderComponent}
      {renderMainFlatList}
      {renderHomeMainTabContain}
    </>
  );

  const openPlayInModal = useCallback(() => setPlaysInModalVisible(true), []);

  const onPlayInModalClose = useCallback(() => {
    setPlaysInModalVisible(false);
  }, []);

  const renderImageProgress = useMemo(() => <ImageProgress />, []);

  const switchQBAccount = async (accountData, entity) => {
    let currentEntity = entity;
    const entityType = accountData?.entity_type;
    const uid = entityType === Verbs.entityTypePlayer ? 'user_id' : 'group_id';
    QBLogout()
      .then(() => {
        const {USER, CLUB, LEAGUE, TEAM} = QB_ACCOUNT_TYPE;
        let accountType = USER;
        if (entityType === Verbs.entityTypeClub) accountType = CLUB;
        else if (entityType === Verbs.entityTypeTeam) accountType = TEAM;
        else if (entityType === Verbs.entityTypeLeague) accountType = LEAGUE;
        QBlogin(
          accountData[uid],
          {
            ...accountData,
            full_name: accountData.group_name,
          },
          accountType,
        )
          .then(async (res) => {
            currentEntity = {
              ...currentEntity,
              QB: {...res.user, connected: true, token: res?.session?.token},
            };
            authContext.setEntity({...currentEntity});
            await Utility.setStorage('authContextEntity', {...currentEntity});
            QBconnectAndSubscribe(currentEntity)
              .then((qbRes) => {
                setloading(false);
                if (qbRes?.error) {
                  console.log(strings.appName, qbRes?.error);
                }
              })
              .catch(() => {
                setloading(false);
              });
          })
          .catch(() => {
            setloading(false);
          });
      })
      .catch(() => {
        setloading(false);
      });
  };

  const onSwitchProfile = async (item) => {
    switchProfile(item)
      .then((currentEntity) => {
        switchQBAccount(item, currentEntity);
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const switchProfile = async (item) => {
    let currentEntity = authContext.entity;

    if (item.entity_type === Verbs.entityTypePlayer) {
      currentEntity = {
        ...currentEntity,
        uid: item.user_id,
        role: Verbs.entityTypeUser,
        obj: item,
      };
    } else if (item.entity_type === Verbs.entityTypeTeam) {
      currentEntity = {
        ...currentEntity,
        uid: item.group_id,
        role: Verbs.entityTypeTeam,
        obj: item,
      };
    } else if (item.entity_type === Verbs.entityTypeClub) {
      currentEntity = {
        ...currentEntity,
        uid: item.group_id,
        role: Verbs.entityTypeClub,
        obj: item,
      };
    }
    authContext.setEntity({...currentEntity});
    await Utility.setStorage('authContextEntity', {...currentEntity});

    return currentEntity;
  };

  const renderSports = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        setSportsSelection(item);
        setVisibleSportsModal(false);

        setTimeout(() => {
          if (currentUserData?.is_pause === true) {
            Alert.alert(strings.yourTeamPaused);
          } else {
            navigation.navigate('ManageChallengeScreen', {
              groupObj: currentUserData,
              sportName: item.sport,
              sportType: currentUserData?.sport_type,
            });
          }
        }, 300);
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>
          {Utility.getSportName(item, authContext)}
        </Text>
        <View style={styles.checkbox}>
          {sportsSelection?.sport === item?.sport ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const ModalRefereeHeader = () => (
    <View style={styles.headerStyle}>
      <View style={styles.handleStyle} />
      <Text
        style={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.lightBlackColor,
          marginLeft: 15,
        }}>
        {strings.chooseGameForreferee}
      </Text>
    </View>
  );

  const ModalScorekeeperHeader = () => (
    <View style={styles.headerStyle}>
      <View style={styles.handleStyle} />
      <Text
        style={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.lightBlackColor,
          marginLeft: 15,
        }}>
        {strings.chooseGameForScorekeeper}
      </Text>
    </View>
  );

  const renderRefereeGames = useCallback(
    ({item}) => (
      <TCGameCard
        data={item}
        cardWidth={'88%'}
        onPress={() => {
          // const game = item;
          // console.log('Selected game:=>', item);
          // let isSameReferee = false;
          // const sameRefereeCount = game?.referees?.filter(
          //   (gameReferee) => gameReferee?.user_id === currentUserData?.user_id,
          // );
          // if (sameRefereeCount?.length > 0) isSameReferee = true;
          // const isCheif = currentUserData?.chief_referee;
          // const cheifCnt = game?.referees?.filter(
          //   (chal_ref) => chal_ref?.chief_referee,
          // )?.length;
          // const assistantCnt = game?.referees?.filter(
          //   (chal_ref) => !chal_ref?.chief_referee,
          // )?.length;

          // if (isSameReferee) {
          //   message = 'This referee is already booked for this game.';
          // } else if (!game.isAvailable) {
          //   message = 'There is no available slot of a referee who you can book in this game.';
          // } else if ((game?.referees?.count ?? 0) >= 3) {
          //   message = 'There is no available slot of a referee who you can book in this game.';
          // } else if (isCheif && cheifCnt >= 1) {
          //   message = 'There is no available slot of a chief referee who you can book in this game.';
          // } else if (!isCheif && assistantCnt >= 2) {
          //   message = 'There is no available slot of an assistant referee who you can book in this game.';
          // }
          const message = '';
          if (message === '') {
            gameListRefereeModalRef.current.close();
            navigation.navigate('RefereeBookingDateAndTime', {
              gameData: item,
              settingObj: refereeSettingObject,
              userData: currentUserData,
              isHirer: true,
              navigationName: 'HomeScreen',
              sportName,
            });
          } else {
            setTimeout(() => Alert.alert(strings.appName, message));
          }
        }}
      />
    ),
    [currentUserData, navigation, refereeSettingObject, sportName],
  );

  const renderScorekeeperGames = useCallback(
    ({item}) => (
      <TCGameCard
        data={item}
        cardWidth={'88%'}
        onPress={() => {
          gameListScorekeeperModalRef.current.close();
          navigation.navigate('ScorekeeperBookingDateAndTime', {
            gameData: item,
            settingObj: scorekeeperSettingObject,
            userData: currentUserData,
            isHirer: true,
            navigationName: 'HomeScreen',
            sportName,
          });
        }}
      />
    ),
    [currentUserData, navigation, scorekeeperSettingObject, sportName],
  );

  const listEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{strings.noGamesYet}</Text>
    </View>
  );

  const flatListRefereeProps = {
    showsVerticalScrollIndicator: false,
    showsHorizontalScrollIndicator: false,
    keyboardShouldPersistTaps: 'never',
    bounces: false,
    data: matchData,
    renderItem: renderRefereeGames,
    keyExtractor: (index) => index.toString(),
    ListEmptyComponent: listEmptyComponent,
    style: {marginTop: 15},
  };

  const flatListScorekeeperProps = {
    showsVerticalScrollIndicator: false,
    showsHorizontalScrollIndicator: false,
    keyboardShouldPersistTaps: 'never',
    bounces: false,
    data: matchData,
    renderItem: renderScorekeeperGames,
    keyExtractor: (index) => index.toString(),
    ListEmptyComponent: listEmptyComponent,
    style: {marginTop: 15},
  };

  const getGamesForReferee = async (refereeId, teamId) => {
    const gameListWithFilter = {
      query: {
        bool: {
          must: [
            {
              bool: {
                should: [
                  {term: {'home_team.keyword': teamId}},
                  {term: {'away_team.keyword': teamId}},
                ],
              },
            },
            {
              range: {
                end_datetime: {
                  gt: parseFloat(new Date().getTime() / 1000).toFixed(0),
                },
              },
            },
            {term: {'status.keyword': 'accepted'}},
            {
              term: {
                'challenge_referee.who_secure.responsible_team_id.keyword':
                  teamId,
              },
            },
          ],
        },
      },
      sort: [{start_datetime: 'asc'}],
    };

    const refereeList = {
      query: {
        bool: {
          must: [
            {term: {'participants.entity_id.keyword': refereeId}},
            {
              range: {
                end_datetime: {
                  gt: parseFloat(new Date().getTime() / 1000).toFixed(0),
                },
              },
            },
            {term: {'cal_type.keyword': Verbs.eventVerb}},
            {match: {blocked: true}},
          ],
        },
      },
    };

    const promiseArr = [
      getGameIndex(gameListWithFilter),
      getCalendarIndex(refereeList),
    ];

    return Promise.all(promiseArr)
      .then(([gameList, eventList]) => {
        setloading(false);

        for (const game of gameList) {
          game.isAvailable = true;
          eventList.forEach((slot) => {
            // check if slot start time comes between the game time
            if (
              game.start_datetime <= slot.start_datetime &&
              game.end_datetime >= slot.start_datetime
            ) {
              game.isAvailable = false;
            }

            // check if slot end time comes between the game time
            if (
              game.start_datetime <= slot.end_datetime &&
              game.end_datetime >= slot.end_datetime
            ) {
              game.isAvailable = false;
            }

            // Check if game is under the blocked time
            if (
              slot.start_datetime <= game.start_datetime &&
              slot.end_datetime >= game.start_datetime
            ) {
              game.isAvailable = false;
            }
          });
        }

        return Utility.getGamesList(gameList).then((gamedata) => gamedata);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.messages);
        }, 10);
      });
  };

  const renderRefereeHeader = useMemo(() => {
    console.log('');
    return (
      <Header
        mainContainerStyle={styles.headerMainContainerStyle}
        centerComponent={
          <View style={styles.headerCenterViewStyle}>
            <Image
              source={images.refereesInImage}
              style={styles.refereesImageStyle}
              resizeMode={'contain'}
            />
            <Text style={styles.playInTextStyle}>
              {format(strings.refereeInSport, sportName || '')}
            </Text>
          </View>
        }
        rightComponent={
          <TouchableOpacity
            onPress={() => {
              setRefereesInModalVisible(false);
              setRefereeCurrentTab(0);
            }}
            style={{padding: 10}}>
            <Image
              source={images.cancelWhite}
              style={styles.cancelImageStyle}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        }
      />
    );
  }, []);

  const renderScorekeeperHeader = useMemo(() => {
    console.log('');
    return (
      <Header
        mainContainerStyle={styles.headerMainContainerStyle}
        centerComponent={
          <View style={styles.headerCenterViewStyle}>
            <Image
              source={images.myScoreKeeping}
              style={styles.refereesImageStyle}
              resizeMode={'contain'}
            />
            <Text style={styles.playInTextStyle}>
              {format(strings.scorekeeperInSport, sportName || '')}
            </Text>
          </View>
        }
        rightComponent={
          <TouchableOpacity
            onPress={() => {
              setScorekeeperInModalVisible(false);
              setScorekeeperCurrentTab(0);
            }}
            style={{padding: 10}}>
            <Image
              source={images.cancelWhite}
              style={styles.cancelImageStyle}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        }
      />
    );
  }, []);

  const getGamesForScorekeeper = async (scorekeeperId, teamId) => {
    const gameListWithFilter = {
      query: {
        bool: {
          must: [
            {
              bool: {
                should: [
                  {term: {'home_team.keyword': teamId}},
                  {term: {'away_team.keyword': teamId}},
                ],
              },
            },
            {
              range: {
                end_datetime: {
                  gt: parseFloat(new Date().getTime() / 1000).toFixed(0),
                },
              },
            },
            {term: {'status.keyword': 'accepted'}},
            {
              term: {
                'challenge_scorekeepers.who_secure.responsible_team_id.keyword':
                  teamId,
              },
            },
          ],
        },
      },
      sort: [{start_datetime: 'asc'}],
    };

    const scorekeeperList = {
      query: {
        bool: {
          must: [
            {term: {'participants.entity_id.keyword': scorekeeperId}},
            {
              range: {
                end_datetime: {
                  gt: parseFloat(new Date().getTime() / 1000).toFixed(0),
                },
              },
            },
            {term: {'cal_type.keyword': Verbs.eventVerb}},
            {match: {blocked: true}},
          ],
        },
      },
    };

    const promiseArr = [
      getGameIndex(gameListWithFilter),
      getCalendarIndex(scorekeeperList),
    ];

    return Promise.all(promiseArr)
      .then(([gameList, eventList]) => {
        setloading(false);

        for (const game of gameList) {
          game.isAvailable = true;
          eventList.forEach((slot) => {
            // check if slot start time comes between the game time
            if (
              game.start_datetime <= slot.start_datetime &&
              game.end_datetime >= slot.start_datetime
            ) {
              game.isAvailable = false;
            }

            // check if slot end time comes between the game time
            if (
              game.start_datetime <= slot.end_datetime &&
              game.end_datetime >= slot.end_datetime
            ) {
              game.isAvailable = false;
            }

            // Check if game is under the blocked time
            if (
              slot.start_datetime <= game.start_datetime &&
              slot.end_datetime >= game.start_datetime
            ) {
              game.isAvailable = false;
            }
          });
        }

        return Utility.getGamesList(gameList).then((gamedata) => gamedata);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.messages);
        }, 10);
      });
  };
  const unPauseGroup = () => {
    setloading(true);
    groupUnpaused(authContext)
      .then(async (response) => {
        setIsAccountDeactivated(false);
        setloading(false);
        const entity = authContext.entity;
        entity.obj = response.payload;
        authContext.setEntity({...entity});
        await Utility.setStorage('authContextEntity', {...entity});
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const reActivateUser = () => {
    setloading(true);
    userActivate(authContext)
      .then(async (response) => {
        setloading(false);
        const entity = authContext.entity;
        entity.auth.user = response.payload;
        entity.obj = response.payload;
        authContext.setEntity({...entity});
        await Utility.setStorage('authContextUser', response.payload);
        await Utility.setStorage('authContextEntity', {...entity});
        navigation.pop(2);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  return (
    <View style={styles.mainContainer}>
      {renderHeader}

      {isAccountDeactivated && (
        <TCAccountDeactivate
          type={
            authContext?.entity?.obj?.is_pause === true
              ? Verbs.pauseVerb
              : Verbs.deactivateVerb
          }
          onPress={() => {
            Alert.alert(
              format(
                strings.pauseUnpauseAccountText,
                authContext?.entity?.obj?.is_pause === true
                  ? Verbs.unpauseVerb
                  : Verbs.reactivateVerb,
              ),
              '',
              [
                {
                  text: strings.cancel,
                  style: 'cancel',
                },
                {
                  text:
                    authContext?.entity?.obj?.is_pause === true
                      ? Verbs.unpauseVerb
                      : Verbs.reactivateVerb,
                  style: 'destructive',
                  onPress: () => {
                    if (authContext?.entity?.obj?.is_pause === true) {
                      unPauseGroup();
                    } else {
                      reActivateUser();
                    }
                  },
                },
              ],
              {cancelable: false},
            );
          }}
        />
      )}
      <View
        style={{flex: 1, opacity: isAccountDeactivated ? 0.5 : 1}}
        pointerEvents={pointEvent}>
        <ActionSheet
          ref={addRoleActionSheet}
          options={[
            strings.addPlaying,
            strings.addRefereeing,
            strings.addScorekeeping,
            strings.cancel,
          ]}
          cancelButtonIndex={3}
          onPress={(index) => {
            if (index === 0) {
              // Add Playing
              navigation.navigate('RegisterPlayer', {comeFrom: 'HomeScreen'});
            } else if (index === 1) {
              // Add Refereeing
              navigation.navigate('RegisterReferee');
            } else if (index === 2) {
              // Add Scorekeeper
              navigation.navigate('RegisterScorekeeper');
            }
          }}
        />

        <ActionSheet
          ref={manageChallengeActionSheet}
          options={[
            strings.manageChallengeShhetItem,
            strings.sportActivity,
            strings.cancel,
          ]}
          cancelButtonIndex={2}
          onPress={(index) => {
            if (index === 0) {
              // Add Playing

              const entity = authContext.entity;

              if (entity.role === Verbs.entityTypeUser) {
                if (entity?.obj?.registered_sports?.length > 0) {
                  setVisibleSportsModal(true);
                } else {
                  Alert.alert(strings.noregisterdSportValication);
                }
              }
              if (entity.role === Verbs.entityTypeTeam) {
                if (currentUserData?.is_pause === true) {
                  Alert.alert(strings.yourTeamPaused);
                } else {
                  navigation.navigate('ManageChallengeScreen', {
                    groupObj: currentUserData,
                    sportName: currentUserData?.sport,
                    sportType: currentUserData?.sport_type,
                  });
                }
              }
            } else if (index === 1) {
              // navigation.navigate('SportActivityScreen');
              navigation.navigate('SportActivitiesScreen');
            }
          }}
        />
        <ActionSheet
          ref={offerActionSheet}
          options={offerOpetions()}
          cancelButtonIndex={offerOpetions().length - 1}
          onPress={(index) => {
            if (offerOpetions()[index] === strings.refereeOffer) {
              setloading(true);
              const headers = {};
              headers.caller_id = currentUserData?.group_id;

              const promiseArr = [
                // getGameSlots(
                //   'referees',
                //   authContext?.entity?.uid,
                //   `status=accepted&sport=${currentUserData?.sport}&refereeDetail=true`,
                //   headers,
                //   authContext,
                // ),
                getGamesForReferee(
                  authContext?.entity?.uid,
                  currentUserData?.group_id,
                ),
                settingUtils.getSetting(
                  authContext?.entity?.uid,
                  Verbs.entityTypeReferee,
                  currentUserData?.sport,
                  authContext,
                ),
              ];

              Promise.all(promiseArr).then(([gameList, refereeSetting]) => {
                setloading(false);

                if (gameList) {
                  setMatchData([...gameList]);
                }
                if (
                  refereeSetting?.referee_availibility &&
                  refereeSetting?.game_fee &&
                  refereeSetting?.refund_policy &&
                  refereeSetting?.available_area
                ) {
                  gameListRefereeModalRef.current.open();
                  setRefereeSettingObject(refereeSetting);
                } else {
                  setTimeout(() => {
                    Alert.alert(strings.configureYourRefereeSetting);
                  }, 10);
                }
              });
            } else if (offerOpetions()[index] === strings.scorekeeperOffer) {
              setloading(true);
              const headers = {};
              headers.caller_id = currentUserData?.group_id;

              const promiseArr = [
                // getGameSlots(
                //   'referees',
                //   authContext?.entity?.uid,
                //   `status=accepted&sport=${currentUserData?.sport}&refereeDetail=true`,
                //   headers,
                //   authContext,
                // ),
                getGamesForScorekeeper(
                  authContext?.entity?.uid,
                  currentUserData?.group_id,
                ),
                settingUtils.getSetting(
                  authContext?.entity?.uid,
                  Verbs.entityTypeScorekeeper,
                  currentUserData?.sport,
                  authContext,
                ),
              ];

              Promise.all(promiseArr).then(([gameList, scorekeeperSetting]) => {
                setloading(false);

                if (gameList.length > 0) {
                  setMatchData([...gameList]);
                }
                if (
                  scorekeeperSetting?.scorekeeper_availibility &&
                  scorekeeperSetting?.game_fee &&
                  scorekeeperSetting?.refund_policy &&
                  scorekeeperSetting?.available_area
                ) {
                  gameListScorekeeperModalRef.current.open();
                  setScorekeeperSettingObject(scorekeeperSetting);
                } else {
                  setTimeout(() => {
                    Alert.alert(strings.cannotSendOfferSettingConfigure);
                  }, 10);
                }
              });
            } else if (offerOpetions()[index] === strings.cancel) {
            }
          }}
        />
        <ActionSheet
          ref={groupMessageActionSheet}
          options={[
            currentUserData.group_name,
            strings.withAllMember,
            strings.cancel,
          ]}
          cancelButtonIndex={3}
          onPress={(index) => {
            if (index === 0) {
              // Add Playing
              onMessageButtonPress(currentUserData);
            } else if (index === 1) {
              // Add Refereeing
              onMessageButtonPress(currentUserData);
            }
          }}
        />
        <ActivityLoader visible={loading} />

        <View style={{flex: 1}}>
          {/* renderUserTopFixedButtons */}
          {/* {!isUserHome && renderTopFixedButtons} */}
          {/* {!isUserHome && fixedHeader} */}
          {firstTimeLoading &&
            (route?.params?.role === Verbs.entityTypeUser ??
              authContext?.entity?.role === Verbs.entityTypeUser) && (
              <UserProfileScreenShimmer />
            )}
          {firstTimeLoading &&
            (route?.params?.role !== Verbs.entityTypeUser ??
              authContext?.entity?.role !== Verbs.entityTypeUser) && (
              <ProfileScreenShimmer />
            )}
          {!firstTimeLoading && (
            <HomeFeed
              onFeedScroll={handleMainRefOnScroll}
              refs={mainFlatListRef}
              homeFeedHeaderComponent={MainHeaderComponent}
              currentTab={currentTab}
              currentUserData={currentUserData}
              isAdmin={route?.params?.uid === authContext.entity.uid}
              navigation={navigation}
              setGalleryData={() => {}}
              userID={route?.params?.uid ?? authContext.entity?.uid}
            />
          )}
        </View>

        {useMemo(
          () =>
            playsInModalVisible && (
              <PlayInModule
                visible={playsInModalVisible}
                openPlayInModal={openPlayInModal}
                onModalClose={onPlayInModalClose}
                navigation={navigation}
                userData={currentUserData}
                playInObject={currentPlayInObject}
                isAdmin={isAdmin}
                opponentSetting={settingObject}
                mySetting={mySettingObject}
              />
            ),
          [
            currentPlayInObject,
            currentUserData,
            isAdmin,
            navigation,
            onPlayInModalClose,
            openPlayInModal,
            playsInModalVisible,
          ],
        )}

        {/* Referee In Modal */}
        {refereesInModalVisible && (
          <Modal
            isVisible={refereesInModalVisible}
            backdropColor="black"
            style={{
              margin: 0,
              justifyContent: 'flex-end',
              backgroundColor: colors.blackOpacityColor,
            }}
            hasBackdrop
            onBackdropPress={() => setRefereesInModalVisible(false)}
            backdropOpacity={0}>
            <View style={styles.modalContainerViewStyle}>
              <SafeAreaView style={{flex: 1}}>
                {renderRefereeHeader}
                {/* <TCThinDivider backgroundColor={colors.refereeHomeDividerColor} width={'100%'} height={2}/> */}
                <TCGradientDivider width={'100%'} height={3} />
                <RefereesProfileSection
                  isReferee={true}
                  isAdmin={isAdmin}
                  navigation={navigation}
                  sport_name={sportName}
                  sportObj={selectRefereeData}
                  bookRefereeButtonVisible={
                    authContext?.entity?.uid !== currentUserData?.user_id
                  }
                  onModalClose={(value) => setRefereesInModalVisible(value)}
                  profileImage={
                    userThumbnail
                      ? {uri: userThumbnail}
                      : images.profilePlaceHolder
                  }
                  userName={fullName}
                  location={location}
                  feesCount={
                    refereeSettingObject?.game_fee
                      ? refereeSettingObject?.game_fee?.fee
                      : 0
                  }
                  onBookRefereePress={() => {
                    if (
                      refereeSettingObject?.referee_availibility &&
                      refereeSettingObject?.game_fee &&
                      refereeSettingObject?.refund_policy &&
                      refereeSettingObject?.available_area
                    ) {
                      setRefereesInModalVisible(false);
                      navigation.navigate('RefereeBookingDateAndTime', {
                        settingObj: refereeSettingObject,
                        userData: currentUserData,
                        showMatches: true,
                        navigationName: 'HomeScreen',
                        sportName,
                      });
                    } else {
                      Alert.alert(strings.refereeSettingNotConfigureValidation);
                    }
                  }}
                />

                <TCScrollableProfileTabs
                  tabItem={TAB_ITEMS_REFEREE}
                  onChangeTab={(ChangeTab) => setRefereeCurrentTab(ChangeTab.i)}
                  currentTab={currentRefereeTab}
                  renderTabContain={renderRefereesTabContainer}
                  tabVerticalScroll={false}
                />
              </SafeAreaView>
            </View>

            {/* Review Detail View */}
            {reviewDetailModalVisible && (
              <Modal
                isVisible={reviewDetailModalVisible}
                backdropColor="black"
                style={{
                  margin: 0,
                  justifyContent: 'flex-end',
                  backgroundColor: colors.blackOpacityColor,
                }}
                hasBackdrop
                onBackdropPress={() => setRefereeInfoModalVisible(false)}
                backdropOpacity={0}>
                <SafeAreaView
                  style={[
                    styles.modalContainerViewStyle,
                    {backgroundColor: colors.whiteColor},
                  ]}>
                  <Header
                    mainContainerStyle={styles.headerMainContainerStyle}
                    leftComponent={
                      <TouchableOpacity
                        onPress={() => setReviewDetailModalVisible(false)}>
                        <Image
                          source={images.backArrow}
                          style={styles.cancelImageStyle}
                          resizeMode={'contain'}
                        />
                      </TouchableOpacity>
                    }
                    centerComponent={
                      <View style={styles.headerCenterViewStyle}>
                        <Image
                          source={images.refereesInImage}
                          style={styles.refereesImageStyle}
                          resizeMode={'contain'}
                        />
                        <Text style={styles.playInTextStyle}>
                          {strings.reviews}
                        </Text>
                      </View>
                    }
                    rightComponent={
                      <TouchableOpacity
                        onPress={() => setReviewDetailModalVisible(false)}>
                        <Image
                          source={images.cancelWhite}
                          style={styles.cancelImageStyle}
                          resizeMode={'contain'}
                        />
                      </TouchableOpacity>
                    }
                  />
                  <TCGradientDivider width={'100%'} height={3} />

                  <FlatList
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={10}
                    initialNumToRender={5}
                    bounces={true}
                    data={
                      refereeReviewData?.reviews?.results?.[feedDataIndex]
                        ?.reviews ?? []
                    }
                    ItemSeparatorComponent={newsFeedListItemSeperator}
                    ListHeaderComponent={feedScreenHeader}
                    scrollEnabled={true}
                    initialScrollIndex={orangeFeed ? 2 : feedDetailIndex}
                    // ListFooterComponent={newsFeedListFooterComponent}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderNewsFeed}
                    // onEndReached={onEndReached}
                    // onEndReachedThreshold={0.5}
                    // refreshing={pullRefresh}
                    // onRefresh={newsFeedOnRefresh}
                    keyExtractor={(item) => `test${item?.id?.toString()}`}
                  />
                  {/* <NewsFeedPostItems
          // pullRefresh={pullRefresh}
          item={reviewFeedData}
          navigation={navigation}
          caller_id={userID}
          // onEditPressDone={onEditPressDone}
          // onImageProfilePress={onProfileButtonPress}
          // onLikePress={onLikeButtonPress}
          // onDeletePost={onDeleteButtonPress}
      /> */}
                </SafeAreaView>
              </Modal>
            )}

            {/* Review Detail View */}
            {refereeInfoModalVisible && (
              <Modal
                isVisible={refereeInfoModalVisible}
                backdropColor="black"
                style={{
                  margin: 0,
                  justifyContent: 'flex-end',
                  backgroundColor: colors.blackOpacityColor,
                }}
                hasBackdrop
                onBackdropPress={() => setRefereeInfoModalVisible(false)}
                backdropOpacity={0}>
                <SafeAreaView
                  style={[
                    styles.modalContainerViewStyle,
                    {backgroundColor: colors.whiteColor},
                  ]}>
                  <LinearGradient
                    colors={[colors.orangeColor, colors.yellowColor]}
                    end={{x: 0.0, y: 0.25}}
                    start={{x: 1, y: 0.5}}
                    style={styles.gradiantHeaderViewStyle}></LinearGradient>
                  <Header
                    mainContainerStyle={styles.headerMainContainerStyle}
                    leftComponent={
                      <TouchableOpacity
                        onPress={() => setRefereeInfoModalVisible(false)}>
                        <Image
                          source={images.backArrow}
                          style={styles.cancelImageStyle}
                          resizeMode={'contain'}
                        />
                      </TouchableOpacity>
                    }
                    centerComponent={
                      <View style={styles.headerCenterViewStyle}>
                        <Image
                          source={images.refereesInImage}
                          style={styles.refereesImageStyle}
                          resizeMode={'contain'}
                        />
                        <Text style={styles.playInTextStyle}>
                          {strings.infoTitle}
                        </Text>
                      </View>
                    }
                    rightComponent={
                      <TouchableOpacity
                        onPress={() => setRefereeInfoModalVisible(false)}>
                        <Image
                          source={images.cancelWhite}
                          style={styles.cancelImageStyle}
                          resizeMode={'contain'}
                        />
                      </TouchableOpacity>
                    }
                  />
                  <RefereeInfoSection
                    data={currentUserData}
                    refereeSetting={refereeSettingObject}
                    selectRefereeData={selectRefereeData}
                    searchLocation={searchLocation}
                    languagesName={languagesName}
                    onSavePress={(params) => {
                      let languagesListName = [];
                      patchRegisterRefereeDetails(params, authContext)
                        .then((res) => {
                          const changedata = currentUserData;
                          changedata.referee_data = res.payload.referee_data;
                          changedata.gender = res.payload.gender;
                          changedata.birthday = res.payload.birthday;

                          entityObject = changedata;

                          setCurrentUserData(changedata);

                          if (res.payload.referee_data) {
                            res.payload.referee_data.map((refereeItem) => {
                              if (refereeItem.sport === sportName) {
                                setSelectRefereeData(refereeItem);
                                languagesListName = refereeItem.language;
                              }
                              return null;
                            });
                          }
                          if (languagesListName.length > 0) {
                            languagesListName.map((langItem, index) => {
                              language_string =
                                language_string +
                                (index ? ', ' : '') +
                                langItem.language_name;
                              return null;
                            });
                            setLanguagesName(language_string);
                          }
                        })
                        .catch((error) => {
                          Alert.alert(strings.alertmessagetitle, error.message);
                        });
                    }}
                  />
                </SafeAreaView>
              </Modal>
            )}

            {refereeMatchModalVisible && (
              <Modal
                isVisible={refereeMatchModalVisible}
                backdropColor="black"
                style={{
                  margin: 0,
                  justifyContent: 'flex-end',
                  backgroundColor: colors.blackOpacityColor,
                }}
                hasBackdrop
                onBackdropPress={() => setRefereeMatchModalVisible(false)}
                backdropOpacity={0}>
                <SafeAreaView
                  style={[
                    styles.modalContainerViewStyle,
                    {backgroundColor: colors.whiteColor},
                  ]}>
                  <View>
                    <LinearGradient
                      colors={[colors.orangeColor, colors.yellowColor]}
                      end={{x: 0.0, y: 0.25}}
                      start={{x: 1, y: 0.5}}
                      style={styles.gradiantHeaderViewStyle}></LinearGradient>
                    <Header
                      mainContainerStyle={styles.headerMainContainerStyle}
                      leftComponent={
                        <TouchableOpacity
                          onPress={() => setRefereeMatchModalVisible(false)}>
                          <Image
                            source={images.backArrow}
                            style={styles.cancelImageStyle}
                            resizeMode={'contain'}
                          />
                        </TouchableOpacity>
                      }
                      centerComponent={
                        <View style={styles.headerCenterViewStyle}>
                          <Image
                            source={images.refereesInImage}
                            style={styles.refereesImageStyle}
                            resizeMode={'contain'}
                          />
                          <Text style={styles.playInTextStyle}>
                            {strings.scoreboard}
                          </Text>
                        </View>
                      }
                      rightComponent={
                        <TouchableOpacity
                          onPress={() => setRefereeMatchModalVisible(false)}>
                          <Image
                            source={images.cancelWhite}
                            style={styles.cancelImageStyle}
                            resizeMode={'contain'}
                          />
                        </TouchableOpacity>
                      }
                    />
                  </View>
                  <ScheduleTabView
                    firstTabTitle={format(
                      strings.completedNGame,
                      refereeRecentMatch.length,
                    )}
                    secondTabTitle={format(
                      strings.upcomingNGame,
                      refereeUpcomingMatch.length,
                    )}
                    indexCounter={scoreboardTabNumber}
                    eventPrivacyContianer={{width: wp('70%')}}
                    onFirstTabPress={() => setScroboardTabNumber(0)}
                    onSecondTabPress={() => setScroboardTabNumber(1)}
                  />
                  {scoreboardTabNumber === 0 && (
                    <ScoreboardSportsScreen
                      sportsData={refereeRecentMatch}
                      showEventNumbers={false}
                      showAssistReferee={true}
                      navigation={navigation}
                      onItemPress={() => {
                        setRefereeMatchModalVisible(false);
                        setRefereesInModalVisible(false);
                      }}
                    />
                  )}
                  {scoreboardTabNumber === 1 && (
                    <UpcomingMatchScreen
                      sportsData={refereeUpcomingMatch}
                      showEventNumbers={true}
                      navigation={navigation}
                      onItemPress={() => {
                        setPlaysInModalVisible(false);
                      }}
                    />
                  )}
                </SafeAreaView>
              </Modal>
            )}

            {reviewsModalVisible && (
              <Modal
                isVisible={reviewsModalVisible}
                backdropColor="black"
                style={{
                  margin: 0,
                  justifyContent: 'flex-end',
                  backgroundColor: colors.blackOpacityColor,
                }}
                hasBackdrop
                onBackdropPress={() => setReviewsModalVisible(false)}
                backdropOpacity={0}>
                <SafeAreaView
                  style={[
                    styles.modalContainerViewStyle,
                    {backgroundColor: colors.whiteColor},
                  ]}>
                  <View>
                    <LinearGradient
                      colors={[colors.orangeColor, colors.yellowColor]}
                      end={{x: 0.0, y: 0.25}}
                      start={{x: 1, y: 0.5}}
                      style={styles.gradiantHeaderViewStyle}></LinearGradient>
                    <Header
                      mainContainerStyle={styles.headerMainContainerStyle}
                      leftComponent={
                        <TouchableOpacity
                          onPress={() => setReviewsModalVisible(false)}>
                          <Image
                            source={images.backArrow}
                            style={styles.cancelImageStyle}
                            resizeMode={'contain'}
                          />
                        </TouchableOpacity>
                      }
                      centerComponent={
                        <View style={styles.headerCenterViewStyle}>
                          <Image
                            source={images.refereesInImage}
                            style={styles.refereesImageStyle}
                            resizeMode={'contain'}
                          />
                          <Text style={styles.playInTextStyle}>
                            {strings.reviews}
                          </Text>
                        </View>
                      }
                      rightComponent={
                        <TouchableOpacity
                          onPress={() => setReviewsModalVisible(false)}>
                          <Image
                            source={images.cancelWhite}
                            style={styles.cancelImageStyle}
                            resizeMode={'contain'}
                          />
                        </TouchableOpacity>
                      }
                    />
                  </View>
                  <ReviewSection
                    reviewsData={averageRefereeReview}
                    reviewsFeed={refereeReviewData}
                    onFeedPress={() => Alert.alert(3)}
                    onReadMorePress={() => {
                      reviewerDetailModal();
                    }}
                  />
                </SafeAreaView>

                {reviewerDetailModalVisible && (
                  <Modal
                    isVisible={reviewerDetailModalVisible}
                    backdropColor="black"
                    style={{
                      margin: 0,
                      justifyContent: 'flex-end',
                      backgroundColor: colors.blackOpacityColor,
                    }}
                    hasBackdrop
                    onBackdropPress={() => setReviewerDetailModalVisible(false)}
                    backdropOpacity={0}>
                    <SafeAreaView
                      style={[
                        styles.modalContainerViewStyle,
                        {backgroundColor: colors.whiteColor},
                      ]}>
                      <View>
                        <LinearGradient
                          colors={[colors.orangeColor, colors.yellowColor]}
                          end={{x: 0.0, y: 0.25}}
                          start={{x: 1, y: 0.5}}
                          style={
                            styles.gradiantHeaderViewStyle
                          }></LinearGradient>
                        <Header
                          mainContainerStyle={styles.headerMainContainerStyle}
                          leftComponent={
                            <TouchableOpacity
                              onPress={() =>
                                setReviewerDetailModalVisible(false)
                              }>
                              <Image
                                source={images.backArrow}
                                style={styles.cancelImageStyle}
                                resizeMode={'contain'}
                              />
                            </TouchableOpacity>
                          }
                          centerComponent={
                            <View style={styles.headerCenterViewStyle}>
                              <Image
                                source={images.refereesInImage}
                                style={styles.refereesImageStyle}
                                resizeMode={'contain'}
                              />
                              <Text style={styles.playInTextStyle}>
                                {strings.reviews}
                              </Text>
                            </View>
                          }
                          rightComponent={
                            <TouchableOpacity
                              onPress={() =>
                                setReviewerDetailModalVisible(false)
                              }>
                              <Image
                                source={images.cancelWhite}
                                style={styles.cancelImageStyle}
                                resizeMode={'contain'}
                              />
                            </TouchableOpacity>
                          }
                        />
                      </View>
                      <ScrollView>
                        <ReviewRecentMatch
                          eventColor={colors.yellowColor}
                          startDate1={'Sep'}
                          startDate2={'25'}
                          title={'Soccer'}
                          startTime={'7:00pm -'}
                          endTime={'9:10pm'}
                          location={'BC Stadium'}
                          firstUserImage={images.team_ph}
                          firstTeamText={'Vancouver Whitecaps'}
                          secondUserImage={images.team_ph}
                          secondTeamText={'Newyork City FC'}
                          firstTeamPoint={3}
                          secondTeamPoint={1}
                        />
                        <RefereeReviewerList
                          navigation={navigation}
                          postData={[]}
                          userID={userID}
                        />
                      </ScrollView>
                    </SafeAreaView>
                  </Modal>
                )}
              </Modal>
            )}
          </Modal>
        )}

        {/* Scorekeeper model */}
        {scorekeeperInModalVisible && (
          <Modal
            isVisible={scorekeeperInModalVisible}
            backdropColor="black"
            style={{
              margin: 0,
              justifyContent: 'flex-end',
              backgroundColor: colors.blackOpacityColor,
            }}
            hasBackdrop
            onBackdropPress={() => setScorekeeperInModalVisible(false)}
            backdropOpacity={0}>
            <View style={styles.modalContainerViewStyle}>
              {/* <Image style={[styles.background, { transform: [{ rotate: '180deg' }], borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }]} source={images.orangeLayer} /> */}
              <SafeAreaView style={{flex: 1}}>
                {renderScorekeeperHeader}
                <TCThinDivider
                  backgroundColor={colors.refereeHomeDividerColor}
                  width={'100%'}
                  height={2}
                />
                <RefereesProfileSection
                  isReferee={false}
                  isAdmin={isAdmin}
                  navigation={navigation}
                  sport_name={sportName}
                  sportObj={selectScorekeeperData}
                  bookRefereeButtonVisible={
                    authContext?.entity?.uid !== currentUserData?.user_id
                  }
                  onModalClose={(value) => setScorekeeperInModalVisible(value)}
                  profileImage={
                    userThumbnail
                      ? {uri: userThumbnail}
                      : images.profilePlaceHolder
                  }
                  userName={fullName}
                  location={location}
                  feesCount={
                    scorekeeperSettingObject?.game_fee
                      ? scorekeeperSettingObject?.game_fee?.fee
                      : 0
                  }
                  onBookRefereePress={() => {
                    if (
                      scorekeeperSettingObject?.scorekeeper_availibility &&
                      scorekeeperSettingObject?.game_fee &&
                      scorekeeperSettingObject?.refund_policy &&
                      scorekeeperSettingObject?.available_area
                    ) {
                      setScorekeeperInModalVisible(false);
                      navigation.navigate('ScorekeeperBookingDateAndTime', {
                        settingObj: scorekeeperSettingObject,
                        userData: currentUserData,
                        showMatches: true,
                        navigationName: 'HomeScreen',
                        sportName,
                      });
                    } else {
                      Alert.alert(strings.scorekeeperSetiingNotValidation);
                    }
                  }}
                />

                <TCScrollableProfileTabs
                  tabItem={TAB_ITEMS_SCOREKEEPER}
                  onChangeTab={(ChangeTab) =>
                    setScorekeeperCurrentTab(ChangeTab.i)
                  }
                  currentTab={currentScorekeeperTab}
                  renderTabContain={(tabKey) =>
                    renderScorekeeperTabContainer(tabKey)
                  }
                  tabVerticalScroll={false}
                />
              </SafeAreaView>
            </View>
            {/* Review Detail View */}
            {reviewDetailModalVisible && (
              <Modal
                isVisible={reviewDetailModalVisible}
                backdropColor="black"
                style={{
                  margin: 0,
                  justifyContent: 'flex-end',
                  backgroundColor: colors.blackOpacityColor,
                }}
                hasBackdrop
                onBackdropPress={() => setRefereeInfoModalVisible(false)}
                backdropOpacity={0}>
                <SafeAreaView
                  style={[
                    styles.modalContainerViewStyle,
                    {backgroundColor: colors.whiteColor},
                  ]}>
                  <Header
                    mainContainerStyle={styles.headerMainContainerStyle}
                    leftComponent={
                      <TouchableOpacity
                        onPress={() => setReviewDetailModalVisible(false)}>
                        <Image
                          source={images.backArrow}
                          style={styles.cancelImageStyle}
                          resizeMode={'contain'}
                        />
                      </TouchableOpacity>
                    }
                    centerComponent={
                      <View style={styles.headerCenterViewStyle}>
                        <Image
                          source={images.myScoreKeeping}
                          style={styles.refereesImageStyle}
                          resizeMode={'contain'}
                        />
                        <Text style={styles.playInTextStyle}>
                          {strings.reviews}
                        </Text>
                      </View>
                    }
                    rightComponent={
                      <TouchableOpacity
                        onPress={() => setReviewDetailModalVisible(false)}>
                        <Image
                          source={images.cancelWhite}
                          style={styles.cancelImageStyle}
                          resizeMode={'contain'}
                        />
                      </TouchableOpacity>
                    }
                  />
                  <TCGradientDivider width={'100%'} height={3} />

                  <FlatList
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={10}
                    initialNumToRender={5}
                    bounces={true}
                    data={
                      scorekeeperReviewData?.reviews?.results?.[feedDataIndex]
                        ?.reviews ?? []
                    }
                    ItemSeparatorComponent={newsFeedListItemSeperator}
                    ListHeaderComponent={feedScreenHeader}
                    scrollEnabled={true}
                    initialScrollIndex={orangeFeed ? 2 : feedDetailIndex}
                    // ListFooterComponent={newsFeedListFooterComponent}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderScorekeeperFeed}
                    // onEndReached={onEndReached}
                    // onEndReachedThreshold={0.5}
                    // refreshing={pullRefresh}
                    // onRefresh={newsFeedOnRefresh}
                    keyExtractor={(item) => `feeds${item?.id?.toString()}`}
                  />
                  {/* <NewsFeedPostItems
          // pullRefresh={pullRefresh}
          item={reviewFeedData}
          navigation={navigation}
          caller_id={userID}
          // onEditPressDone={onEditPressDone}
          // onImageProfilePress={onProfileButtonPress}
          // onLikePress={onLikeButtonPress}
          // onDeletePost={onDeleteButtonPress}
      /> */}
                </SafeAreaView>
              </Modal>
            )}

            {/* Review Detail View */}
            {scorekeeperInfoModalVisible && (
              <Modal
                isVisible={scorekeeperInfoModalVisible}
                backdropColor="black"
                style={{
                  margin: 0,
                  justifyContent: 'flex-end',
                  backgroundColor: colors.blackOpacityColor,
                }}
                hasBackdrop
                onBackdropPress={() => setScorekeeperInfoModalVisible(false)}
                backdropOpacity={0}>
                <SafeAreaView
                  style={[
                    styles.modalContainerViewStyle,
                    {backgroundColor: colors.whiteColor},
                  ]}>
                  <LinearGradient
                    colors={[colors.orangeColor, colors.yellowColor]}
                    end={{x: 0.0, y: 0.25}}
                    start={{x: 1, y: 0.5}}
                    style={styles.gradiantHeaderViewStyle}></LinearGradient>
                  <Header
                    mainContainerStyle={styles.headerMainContainerStyle}
                    leftComponent={
                      <TouchableOpacity
                        onPress={() => setScorekeeperInfoModalVisible(false)}>
                        <Image
                          source={images.backArrow}
                          style={styles.cancelImageStyle}
                          resizeMode={'contain'}
                        />
                      </TouchableOpacity>
                    }
                    centerComponent={
                      <View style={styles.headerCenterViewStyle}>
                        <Image
                          source={images.refereesInImage}
                          style={styles.refereesImageStyle}
                          resizeMode={'contain'}
                        />
                        <Text style={styles.playInTextStyle}>
                          {strings.infoTitle}
                        </Text>
                      </View>
                    }
                    rightComponent={
                      <TouchableOpacity
                        onPress={() => setScorekeeperInfoModalVisible(false)}>
                        <Image
                          source={images.cancelWhite}
                          style={styles.cancelImageStyle}
                          resizeMode={'contain'}
                        />
                      </TouchableOpacity>
                    }
                  />
                  <ScorekeeperInfoSection
                    data={currentUserData}
                    selectScorekeeperData={selectScorekeeperData}
                    searchLocation={searchLocation}
                    languagesName={languagesName}
                    onSavePress={(params) => {
                      let languagesListName = [];
                      patchRegisterScorekeeperDetails(params, authContext)
                        .then((res) => {
                          const changedata = currentUserData;
                          changedata.scorekeeper_data =
                            res.payload.scorekeeper_data;
                          changedata.gender = res.payload.gender;
                          changedata.birthday = res.payload.birthday;
                          setCurrentUserData(changedata);

                          if (res.payload.scorekeeper_data) {
                            res.payload.scorekeeper_data.map(
                              (scorekeeperItem) => {
                                if (scorekeeperItem.sport === sportName) {
                                  setSelectScorekeeperData(scorekeeperItem);
                                  languagesListName = scorekeeperItem.language;
                                }
                                return null;
                              },
                            );
                          }
                          if (languagesListName.length > 0) {
                            languagesListName.map((langItem, index) => {
                              language_string =
                                language_string +
                                (index ? ', ' : '') +
                                langItem.language_name;
                              return null;
                            });
                            setLanguagesName(language_string);
                          }
                        })
                        .catch((error) => {
                          Alert.alert(strings.alertmessagetitle, error.message);
                        });
                    }}
                  />
                </SafeAreaView>
              </Modal>
            )}

            {scorekeeperMatchModalVisible && (
              <Modal
                isVisible={scorekeeperMatchModalVisible}
                backdropColor="black"
                style={{
                  margin: 0,
                  justifyContent: 'flex-end',
                  backgroundColor: colors.blackOpacityColor,
                }}
                hasBackdrop
                onBackdropPress={() => setScorekeeperMatchModalVisible(false)}
                backdropOpacity={0}>
                <SafeAreaView
                  style={[
                    styles.modalContainerViewStyle,
                    {backgroundColor: colors.whiteColor},
                  ]}>
                  <View>
                    <LinearGradient
                      colors={[colors.orangeColor, colors.yellowColor]}
                      end={{x: 0.0, y: 0.25}}
                      start={{x: 1, y: 0.5}}
                      style={styles.gradiantHeaderViewStyle}></LinearGradient>
                    <Header
                      mainContainerStyle={styles.headerMainContainerStyle}
                      leftComponent={
                        <TouchableOpacity
                          onPress={() =>
                            setScorekeeperMatchModalVisible(false)
                          }>
                          <Image
                            source={images.backArrow}
                            style={styles.cancelImageStyle}
                            resizeMode={'contain'}
                          />
                        </TouchableOpacity>
                      }
                      centerComponent={
                        <View style={styles.headerCenterViewStyle}>
                          <Image
                            source={images.refereesInImage}
                            style={styles.refereesImageStyle}
                            resizeMode={'contain'}
                          />
                          <Text style={styles.playInTextStyle}>
                            {strings.scoreboard}
                          </Text>
                        </View>
                      }
                      rightComponent={
                        <TouchableOpacity
                          onPress={() =>
                            setScorekeeperMatchModalVisible(false)
                          }>
                          <Image
                            source={images.cancelWhite}
                            style={styles.cancelImageStyle}
                            resizeMode={'contain'}
                          />
                        </TouchableOpacity>
                      }
                    />
                  </View>
                  <ScheduleTabView
                    firstTabTitle={format(
                      strings.completedNGame,
                      scorekeeperRecentMatch.length,
                    )}
                    secondTabTitle={format(
                      strings.upcomingNGame,
                      scorekeeperUpcomingMatch.length,
                    )}
                    indexCounter={scoreboardTabNumber}
                    eventPrivacyContianer={{width: wp('70%')}}
                    onFirstTabPress={() => setScroboardTabNumber(0)}
                    onSecondTabPress={() => setScroboardTabNumber(1)}
                  />
                  {scoreboardTabNumber === 0 && (
                    <ScoreboardSportsScreen
                      sportsData={scorekeeperRecentMatch}
                      showEventNumbers={false}
                      showAssistReferee={true}
                      navigation={navigation}
                      onItemPress={() => {
                        setScorekeeperMatchModalVisible(false);
                        setScorekeeperInModalVisible(false);
                      }}
                    />
                  )}
                  {scoreboardTabNumber === 1 && (
                    <UpcomingMatchScreen
                      sportsData={scorekeeperUpcomingMatch}
                      showEventNumbers={true}
                      navigation={navigation}
                      onItemPress={() => {
                        setPlaysInModalVisible(false);
                      }}
                    />
                  )}
                </SafeAreaView>
              </Modal>
            )}

            {reviewsModalVisible && (
              <Modal
                isVisible={reviewsModalVisible}
                backdropColor="black"
                style={{
                  margin: 0,
                  justifyContent: 'flex-end',
                  backgroundColor: colors.blackOpacityColor,
                }}
                hasBackdrop
                onBackdropPress={() => setReviewsModalVisible(false)}
                backdropOpacity={0}>
                <SafeAreaView
                  style={[
                    styles.modalContainerViewStyle,
                    {backgroundColor: colors.whiteColor},
                  ]}>
                  <View>
                    <LinearGradient
                      colors={[colors.orangeColor, colors.yellowColor]}
                      end={{x: 0.0, y: 0.25}}
                      start={{x: 1, y: 0.5}}
                      style={styles.gradiantHeaderViewStyle}></LinearGradient>
                    <Header
                      mainContainerStyle={styles.headerMainContainerStyle}
                      leftComponent={
                        <TouchableOpacity
                          onPress={() => setReviewsModalVisible(false)}>
                          <Image
                            source={images.backArrow}
                            style={styles.cancelImageStyle}
                            resizeMode={'contain'}
                          />
                        </TouchableOpacity>
                      }
                      centerComponent={
                        <View style={styles.headerCenterViewStyle}>
                          <Image
                            source={images.refereesInImage}
                            style={styles.refereesImageStyle}
                            resizeMode={'contain'}
                          />
                          <Text style={styles.playInTextStyle}>
                            {strings.reviewsTitle}
                          </Text>
                        </View>
                      }
                      rightComponent={
                        <TouchableOpacity
                          onPress={() => setReviewsModalVisible(false)}>
                          <Image
                            source={images.cancelWhite}
                            style={styles.cancelImageStyle}
                            resizeMode={'contain'}
                          />
                        </TouchableOpacity>
                      }
                    />
                  </View>
                  <ReviewSection
                    reviewsData={averageScorekeeperReview}
                    reviewsFeed={scorekeeperReviewData}
                    onFeedPress={() => alert(6)}
                    onReadMorePress={() => {
                      reviewerDetailModal();
                    }}
                  />
                </SafeAreaView>

                {reviewerDetailModalVisible && (
                  <Modal
                    isVisible={reviewerDetailModalVisible}
                    backdropColor="black"
                    style={{
                      margin: 0,
                      justifyContent: 'flex-end',
                      backgroundColor: colors.blackOpacityColor,
                    }}
                    hasBackdrop
                    onBackdropPress={() => setReviewerDetailModalVisible(false)}
                    backdropOpacity={0}>
                    <SafeAreaView
                      style={[
                        styles.modalContainerViewStyle,
                        {backgroundColor: colors.whiteColor},
                      ]}>
                      <View>
                        <LinearGradient
                          colors={[colors.orangeColor, colors.yellowColor]}
                          end={{x: 0.0, y: 0.25}}
                          start={{x: 1, y: 0.5}}
                          style={
                            styles.gradiantHeaderViewStyle
                          }></LinearGradient>
                        <Header
                          mainContainerStyle={styles.headerMainContainerStyle}
                          leftComponent={
                            <TouchableOpacity
                              onPress={() =>
                                setReviewerDetailModalVisible(false)
                              }>
                              <Image
                                source={images.backArrow}
                                style={styles.cancelImageStyle}
                                resizeMode={'contain'}
                              />
                            </TouchableOpacity>
                          }
                          centerComponent={
                            <View style={styles.headerCenterViewStyle}>
                              <Image
                                source={images.refereesInImage}
                                style={styles.refereesImageStyle}
                                resizeMode={'contain'}
                              />
                              <Text style={styles.playInTextStyle}>
                                {strings.reviewsTitle}
                              </Text>
                            </View>
                          }
                          rightComponent={
                            <TouchableOpacity
                              onPress={() =>
                                setReviewerDetailModalVisible(false)
                              }>
                              <Image
                                source={images.cancelWhite}
                                style={styles.cancelImageStyle}
                                resizeMode={'contain'}
                              />
                            </TouchableOpacity>
                          }
                        />
                      </View>
                      <ScrollView>
                        <ReviewRecentMatch
                          eventColor={colors.yellowColor}
                          startDate1={'Sep'}
                          startDate2={'25'}
                          title={'Soccer'}
                          startTime={'7:00pm -'}
                          endTime={'9:10pm'}
                          location={'BC Stadium'}
                          firstUserImage={images.team_ph}
                          firstTeamText={'Vancouver Whitecaps'}
                          secondUserImage={images.team_ph}
                          secondTeamText={'Newyork City FC'}
                          firstTeamPoint={3}
                          secondTeamPoint={1}
                        />
                        <RefereeReviewerList
                          navigation={navigation}
                          postData={[]}
                          userID={userID}
                        />
                      </ScrollView>
                    </SafeAreaView>
                  </Modal>
                )}
              </Modal>
            )}
          </Modal>
        )}

        {/* Entity create modal */}
        <Portal>
          <Modalize
            disableScrollIfPossible={true}
            withHandle={false}
            modalStyle={{
              margin: 0,
              justifyContent: 'flex-end',
              backgroundColor: colors.blackOpacityColor,
              flex: 1,
            }}
            ref={confirmationRef}>
            <View style={styles.modalContainerViewStyle}>
              <Image style={styles.background} source={images.orangeLayer} />
              <Image
                style={styles.background}
                source={images.entityCreatedBG}
              />
              <TouchableOpacity
                onPress={() => confirmationRef.current.close()}
                style={{alignSelf: 'flex-end'}}>
                <Image
                  source={images.cancelWhite}
                  style={{
                    marginTop: 25,
                    marginRight: 25,
                    height: 15,
                    width: 15,
                    resizeMode: 'contain',
                    tintColor: colors.whiteColor,
                  }}
                />
              </TouchableOpacity>

              <View
                style={{
                  alignItems: 'center',
                  flex: 1,
                  justifyContent: 'center',
                }}>
                <ImageBackground
                  source={
                    (route?.params?.entityObj?.thumbnail && {
                      uri: route?.params?.entityObj?.thumbnail,
                    }) ||
                    route?.params?.role === Verbs.entityTypeClub
                      ? images.clubPlaceholder
                      : images.teamGreenPH
                  }
                  style={styles.groupsImg}>
                  <Text
                    style={{
                      color: colors.whiteColor,
                      fontSize: 20,
                      fontFamily: fonts.RBlack,
                      marginBottom: 4,
                    }}>{`${route?.params?.groupName
                    ?.charAt(0)
                    ?.toUpperCase()}`}</Text>
                </ImageBackground>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={[styles.foundText, {fontFamily: fonts.RBold}]}>
                    {`${route?.params?.groupName}`}
                  </Text>
                  <View
                    style={{
                      height: 22,
                      width: 22,
                      borderRadius: 44,
                      borderColor: colors.whiteColor,
                      borderWidth: 2,
                      marginLeft: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={
                        route?.params?.role === Verbs.entityTypeTeam
                          ? images.teamPatch
                          : images.clubPatch
                      }
                      style={styles.entityPatchImage}
                    />
                  </View>
                </View>
                <Text style={[styles.foundText, {fontFamily: fonts.RRegular}]}>
                  {strings.hasBeenCreated}
                </Text>
                <Text style={[styles.manageChallengeDetailTitle, {margin: 15}]}>
                  {format(strings.accountSwitchWith, route?.params?.groupName)}
                </Text>
              </View>

              {route?.params?.role === Verbs.entityTypeTeam && (
                <Text style={styles.manageChallengeDetailTitle}>
                  {strings.manageChallengeDetailText}
                </Text>
              )}
              <TouchableOpacity
                style={styles.goToProfileButton}
                onPress={() => {
                  confirmationRef.current.close();
                  if (route?.params?.role !== Verbs.entityTypeClub) {
                    if (currentUserData?.is_pause === true) {
                      Alert.alert(strings.yourTeamPaused);
                    } else {
                      navigation.navigate('ManageChallengeScreen', {
                        groupObj: currentUserData,
                        sportName: route?.params?.entityObj?.sport,
                        sportType: currentUserData?.sport_type,
                      });
                    }
                  }
                }}>
                <Text style={styles.goToProfileTitle}>
                  {route?.params?.role === Verbs.entityTypeClub
                    ? strings.okTitleText
                    : strings.manageChallengeText}
                </Text>
              </TouchableOpacity>
            </View>
          </Modalize>
        </Portal>
        <Portal>
          <Modalize
            visible={refereeOfferModalVisible}
            onOpen={() => setRefereeOfferModalVisible(true)}
            snapPoint={hp(50)}
            withHandle={false}
            overlayStyle={{backgroundColor: 'rgba(255,255,255,0.2)'}}
            modalStyle={{
              borderTopRightRadius: 25,
              borderTopLeftRadius: 25,
              shadowColor: colors.blackColor,
              shadowOffset: {width: 0, height: -2},
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 10,
            }}
            onPositionChange={(position) => {
              if (position === 'top') {
                setRefereeOfferModalVisible(false);
              }
            }}
            ref={gameListRefereeModalRef}
            HeaderComponent={ModalRefereeHeader}
            flatListProps={flatListRefereeProps}
          />
        </Portal>

        {/* Scorekeeper offer */}

        <Portal>
          <Modalize
            visible={scorekeeperOfferModalVisible}
            onOpen={() => setScorekeeperOfferModalVisible(true)}
            snapPoint={hp(50)}
            withHandle={false}
            overlayStyle={{backgroundColor: 'rgba(255,255,255,0.2)'}}
            modalStyle={{
              borderTopRightRadius: 25,
              borderTopLeftRadius: 25,
              shadowColor: colors.blackColor,
              shadowOffset: {width: 0, height: -2},
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 10,
            }}
            onPositionChange={(position) => {
              if (position === 'top') {
                setScorekeeperOfferModalVisible(false);
              }
            }}
            ref={gameListScorekeeperModalRef}
            HeaderComponent={ModalScorekeeperHeader}
            flatListProps={flatListScorekeeperProps}
          />
        </Portal>
        <Modal
          isVisible={isDoubleSportTeamCreatedVisible} // isDoubleSportTeamCreatedVisible
          backdropColor="black"
          style={{
            margin: 0,
            justifyContent: 'flex-end',
            backgroundColor: colors.blackOpacityColor,
            flex: 1,
          }}
          hasBackdrop
          onBackdropPress={() => {
            navigation.popToTop();
            setTimeout(() => {
              setIsDoubleSportTeamCreatedVisible(false);
            }, 10);
          }}
          backdropOpacity={0}>
          <View style={styles.modalContainerViewStyle}>
            <Image style={styles.background} source={images.orangeLayer} />
            <Image style={styles.background} source={images.entityCreatedBG} />
            <TouchableOpacity
              onPress={() => {
                navigation.popToTop();
                setTimeout(() => {
                  setIsDoubleSportTeamCreatedVisible(false);
                }, 10);
              }}
              style={{alignSelf: 'flex-end'}}>
              <Image
                source={images.cancelWhite}
                style={{
                  marginTop: 25,
                  marginRight: 25,
                  height: 15,
                  width: 15,
                  resizeMode: 'contain',
                  tintColor: colors.whiteColor,
                }}
              />
            </TouchableOpacity>

            <View
              style={{
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center',
              }}>
              <Text
                style={[
                  styles.doubleSportCreatedText,
                  {fontFamily: fonts.RRegular},
                ]}>
                {format(strings.inviteSendTo, route?.params?.name)}
              </Text>

              <Text style={styles.inviteText}>
                {strings.when}
                <Text style={{fontFamily: fonts.RBold}}>
                  {' '}
                  {route?.params?.name}{' '}
                </Text>
                {strings.acceptYourInvite}
              </Text>
              <Image
                source={images.doubleTeamCreated}
                style={styles.doubleTeamImage}
              />
            </View>

            <TouchableOpacity
              style={styles.goToProfileButton}
              onPress={() => {
                navigation.popToTop();
                setTimeout(() => {
                  setIsDoubleSportTeamCreatedVisible(false);
                }, 10);
              }}>
              <Text style={styles.goToProfileTitle}>{strings.okTitleText}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        {/* Entity create modal */}

        {/* Create Challenge modal */}
        <Modal
          onBackdropPress={() => setChallengePopup(false)}
          backdropOpacity={1}
          animationType="slide"
          hasBackdrop
          style={{
            margin: 0,
            backgroundColor: colors.blackOpacityColor,
          }}
          visible={challengePopup}>
          <View style={styles.bottomPopupContainer}>
            <View style={styles.viewsContainer}>
              <Text
                onPress={() => setChallengePopup(false)}
                style={styles.cancelText}>
                {strings.cancel}
              </Text>
              <Text style={styles.locationText}>{strings.challenge}</Text>
              <Text style={styles.locationText}> </Text>
            </View>
            <TCThinDivider width={'100%'} marginBottom={15} />
            <TouchableWithoutFeedback
              onPress={() => {
                setSelectedChallengeOption(0);
                const obj = settingObject;
                if (obj?.availibility === Verbs.on) {
                  if (
                    currentUserData.sport_type === Verbs.doubleSport &&
                    (!('player_deactivated' in currentUserData) ||
                      !currentUserData?.player_deactivated) &&
                    (!('player_leaved' in currentUserData) ||
                      !currentUserData?.player_leaved) &&
                    (!('player_leaved' in myGroupDetail) ||
                      !myGroupDetail?.player_leaved)
                  ) {
                    if (
                      (obj?.game_duration || obj?.score_rules) &&
                      obj?.availibility &&
                      obj?.special_rules !== undefined &&
                      obj?.general_rules !== undefined &&
                      obj?.responsible_for_referee &&
                      obj?.responsible_for_scorekeeper &&
                      obj?.game_fee &&
                      obj?.venue &&
                      obj?.refund_policy &&
                      obj?.home_away &&
                      obj?.game_type
                    ) {
                      setChallengePopup(false);
                      navigation.navigate('ChallengeScreen', {
                        setting: obj,
                        sportName: currentUserData?.sport,
                        sportType: currentUserData?.sport_type,
                        groupObj: currentUserData,
                      });
                    } else {
                      Alert.alert(strings.teamHaveNoCompletedSetting);
                    }
                  } else {
                    console.log('in else continue :', currentUserData);
                    if (currentUserData.sport_type === Verbs.doubleSport) {
                      if (
                        'player_deactivated' in currentUserData &&
                        currentUserData?.player_deactivated
                      ) {
                        Alert.alert(strings.playerDeactivatedSport);
                      } else if (
                        'player_leaved' in currentUserData &&
                        currentUserData?.player_leaved
                      ) {
                        Alert.alert(
                          format(
                            strings.groupHaveNo2Player,
                            currentUserData?.group_name,
                          ),
                        );
                      } else if (
                        'player_leaved' in myGroupDetail &&
                        myGroupDetail?.player_leaved
                      ) {
                        Alert.alert(strings.youHaveNo2Player);
                      }
                    } else {
                      setChallengePopup(false);

                      navigation.navigate('ChallengeScreen', {
                        setting: obj,
                        sportName: currentUserData?.sport,
                        sportType: currentUserData?.sport_type,
                        groupObj: currentUserData,
                      });
                    }
                  }
                } else {
                  Alert.alert(strings.oppTeamNotForChallenge);
                }
                // setTimeout(() => {
                //   setChallengePopup(false);
                //   navigation.navigate('ChallengeScreen', {
                //     sportName: currentUserData.sport,
                //     groupObj: currentUserData,
                //   });
                // }, 300);
              }}>
              {selectedChallengeOption === 0 ? (
                <LinearGradient
                  colors={[colors.yellowColor, colors.orangeGradientColor]}
                  style={styles.backgroundView}>
                  <Text
                    style={[
                      styles.curruentLocationText,
                      {color: colors.whiteColor},
                    ]}>
                    {strings.continueToChallenge}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.backgroundView}>
                  <Text style={styles.curruentLocationText}>
                    {strings.continueToChallenge}
                  </Text>
                </View>
              )}
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                setSelectedChallengeOption(1);

                const obj = mySettingObject;
                if (obj?.availibility === Verbs.on) {
                  if (
                    myGroupDetail.sport_type === Verbs.doubleSport &&
                    (!('player_deactivated' in myGroupDetail) ||
                      !myGroupDetail?.player_deactivated) &&
                    (!('player_leaved' in currentUserData) ||
                      !currentUserData?.player_leaved) &&
                    (!('player_leaved' in myGroupDetail) ||
                      !myGroupDetail?.player_leaved)
                  ) {
                    if (
                      (obj?.game_duration || obj?.score_rules) &&
                      obj?.availibility &&
                      obj?.special_rules !== undefined &&
                      obj?.general_rules !== undefined &&
                      obj?.responsible_for_referee &&
                      obj?.responsible_for_scorekeeper &&
                      obj?.game_fee &&
                      obj?.venue &&
                      obj?.refund_policy &&
                      obj?.home_away &&
                      obj?.game_type
                    ) {
                      setChallengePopup(false);
                      if (myGroupDetail.is_pause === true) {
                        Alert.alert(
                          format(strings.groupPaused, myGroupDetail.group_name),
                        );
                      } else {
                        navigation.navigate('InviteChallengeScreen', {
                          setting: obj,
                          sportName: currentUserData?.sport,
                          sportType: currentUserData?.sport_type,
                          groupObj: currentUserData,
                        });
                      }
                    } else {
                      setTimeout(() => {
                        Alert.alert(
                          strings.completeSettingBeforeInvite,
                          '',
                          [
                            {
                              text: strings.cancel,
                              onPress: () => console.log('Cancel Pressed!'),
                            },
                            {
                              text: strings.okTitleText,
                              onPress: () => {
                                if (currentUserData?.is_pause === true) {
                                  Alert.alert(strings.yourTeamPaused);
                                } else {
                                  navigation.navigate('ManageChallengeScreen', {
                                    groupObj: currentUserData,
                                    sportName: currentUserData.sport,
                                    sportType: currentUserData?.sport_type,
                                  });
                                }
                              },
                            },
                          ],
                          {cancelable: false},
                        );
                      }, 1000);
                    }
                  } else if (myGroupDetail.sport_type === Verbs.doubleSport) {
                    if (
                      'player_deactivated' in myGroupDetail &&
                      myGroupDetail?.player_deactivated
                    ) {
                      Alert.alert(strings.playerDeactivatedSport);
                    } else if (
                      'player_leaved' in currentUserData ||
                      currentUserData?.player_leaved
                    ) {
                      Alert.alert(
                        format(
                          strings.groupHaveNo2Player,
                          currentUserData?.group_name,
                        ),
                      );
                    } else if (
                      'player_leaved' in myGroupDetail ||
                      myGroupDetail?.player_leaved
                    ) {
                      Alert.alert(strings.youHaveNo2Player);
                    }
                  } else {
                    setChallengePopup(false);
                    if (myGroupDetail.is_pause === true) {
                      Alert.alert(strings.yourTeamPaused);
                    } else {
                      setChallengePopup(false);
                      navigation.navigate('InviteChallengeScreen', {
                        setting: obj,
                        sportName: currentUserData?.sport,
                        sportType: currentUserData?.sport_type,
                        groupObj: currentUserData,
                      });
                    }
                  }
                } else {
                  Alert.alert(strings.availibilityOff);
                }
              }}>
              {selectedChallengeOption === 1 ? (
                <LinearGradient
                  colors={[colors.yellowColor, colors.orangeGradientColor]}
                  style={styles.backgroundView}>
                  <Text style={[styles.myCityText, {color: colors.whiteColor}]}>
                    {strings.inviteToChallenge}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.backgroundView}>
                  <Text style={styles.myCityText}>
                    {strings.inviteToChallenge}
                  </Text>
                </View>
              )}
            </TouchableWithoutFeedback>
          </View>
        </Modal>
        {/* Create Challenge modal */}

        {/* Sports list  modal */}
        <Modal
          isVisible={visibleSportsModal}
          backdropColor="black"
          onBackdropPress={() => setVisibleSportsModal(false)}
          onRequestClose={() => setVisibleSportsModal(false)}
          backdropOpacity={0}
          style={{
            margin: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              width: '100%',
              height: Dimensions.get('window').height / 1.3,
              backgroundColor: 'white',
              position: 'absolute',
              bottom: 0,
              left: 0,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.5,
              shadowRadius: 5,
              elevation: 15,
            }}>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 15,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                hitSlop={Utility.getHitSlop(15)}
                style={styles.closeButton}
                onPress={() => setVisibleSportsModal(false)}>
                <Image source={images.cancelImage} style={styles.closeButton} />
              </TouchableOpacity>
              <Text
                style={{
                  alignSelf: 'center',
                  marginVertical: 20,
                  fontSize: 16,
                  fontFamily: fonts.RBold,
                  color: colors.lightBlackColor,
                }}>
                {strings.sportsEventsTitle}
              </Text>

              <Text
                style={{
                  alignSelf: 'center',
                  marginVertical: 20,
                  fontSize: 16,
                  fontFamily: fonts.RRegular,
                  color: colors.themeColor,
                }}></Text>
            </View>
            <View style={styles.separatorLine} />
            <FlatList
              ItemSeparatorComponent={() => <TCThinDivider />}
              data={authContext?.entity?.obj?.registered_sports?.filter(
                (obj) => obj?.type,
              )}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderSports}
            />
          </View>
        </Modal>

        {!createEventModal && currentTab === 3 && (
          <CreateEventButton
            source={images.plus}
            onPress={() => setCreateEventModal(true)}
          />
        )}

        {renderImageProgress}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  bgImageStyle: {
    backgroundColor: colors.grayBackgroundColor,
    width: '100%',
    height: 135,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  challengeButtonStyle: {
    width: '100%',
    height: 25,
    marginBottom: 15,
  },
  outerContainerStyle: {
    height: 45,
    width: '100%',
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 1.0,
    shadowRadius: 4,
    elevation: 2,
  },
  containerStyle: {
    flexDirection: 'row',
    height: 25,
    borderRadius: 5,
    alignItems: 'center',
  },
  challengeButtonTitle: {
    color: colors.whiteColor,
    fontSize: 14,
    fontFamily: fonts.RBold,
  },

  // buttonText: {
  //   color: colors.whiteColor,
  //   fontSize: 16,
  //   marginRight: 26,
  //   fontFamily: fonts.RBold,
  // },
  modalContainerViewStyle: {
    height: hp('94%'),
    backgroundColor: colors.whiteColor,

    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  headerMainContainerStyle: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingVertical: 15,
  },
  cancelImageStyle: {
    height: 17,
    width: 17,
    tintColor: colors.lightBlackColor,
  },
  refereesImageStyle: {
    height: 30,
    width: 30,
    marginHorizontal: 10,
  },
  headerCenterViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  playInTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  shceduleCalenderView: {
    flexDirection: 'row',
    width: wp('94%'),
    alignSelf: 'center',
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  filterHeaderText: {
    marginLeft: 12,
    marginRight: 8,
    marginVertical: 5,
    fontSize: 25,
    color: colors.orangeColor,
    fontFamily: fonts.RMedium,
  },
  eventViewStyle: {
    opacity: 1,
    backgroundColor: colors.whiteColor,
    shadowOpacity: 0.8,
    borderWidth: 0.5,
    shadowColor: colors.lightgrayColor,
    shadowOffset: {
      height: 3,
      width: 1,
    },
    elevation: 5,
    overflow: 'visible',
    paddingLeft: 0,
    paddingTop: 0,
  },
  headerTodayText: {
    fontSize: 13,
    fontFamily: fonts.RRegular,
    color: colors.userPostTimeColor,
    alignSelf: 'flex-end',
    bottom: 6,
  },
  blockedViewStyle: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    position: 'absolute',
    marginLeft: -59,
    borderRadius: 10,
  },
  dataNotFoundText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    alignSelf: 'center',
    marginVertical: 10,
  },
  gradiantHeaderViewStyle: {
    position: 'absolute',
    width: '100%',
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalMainViewStyle: {
    shadowOpacity: 0.15,
    shadowOffset: {
      height: -10,
      width: 0,
    },
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  refereeHeaderMainStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 15,
  },
  refereeSepratorStyle: {
    height: 1,
    backgroundColor: colors.writePostSepratorColor,
  },

  headerCenterStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    alignSelf: 'center',
  },

  background: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  foundText: {
    color: colors.whiteColor,
    fontSize: 25,
  },
  doubleSportCreatedText: {
    color: colors.whiteColor,
    fontSize: 25,
    fontFamily: fonts.RBold,
    margin: 15,
    textAlign: 'center',
  },
  groupsImg: {
    height: 75,
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
  },

  goToProfileButton: {
    alignSelf: 'center',
    borderColor: colors.whiteColor,
    borderRadius: 40,
    borderWidth: 1,
    height: 45,
    marginBottom: wp('15%'),
    width: '92%',
  },
  manageChallengeDetailTitle: {
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.whiteColor,
    textAlign: 'center',
    marginBottom: 15,
  },
  inviteText: {
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.whiteColor,
    textAlign: 'center',
    margin: 15,
  },
  goToProfileTitle: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 15,
    height: 50,
    padding: 12,
    textAlign: 'center',
  },
  entityPatchImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  doubleTeamImage: {
    height: 150,
    width: 212,

    resizeMode: 'contain',
  },

  bottomPopupContainer: {
    paddingBottom: Platform.OS === 'ios' ? 34 : 0,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    bottom: 0,
    width: '100%',

    ...Platform.select({
      ios: {
        shadowColor: colors.googleColor,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  backgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    height: 50,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: '86%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  myCityText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  curruentLocationText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },

  locationText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.veryLightGray,
  },
  viewsContainer: {
    height: 60,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  userNavigationTextStyle: {
    width: width - 100,
    fontSize: 22,
    fontFamily: fonts.RBold,
    textAlign: 'left',
    marginRight: 10,
    // paddingLeft:15
    // backgroundColor: colors.redColor,
  },

  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginLeft: 5,
    resizeMode: 'contain',
  },

  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },

  headerStyle: {
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    backgroundColor: colors.whiteColor,
  },
  handleStyle: {
    marginVertical: 15,
    alignSelf: 'center',
    height: 5,
    width: 40,
    borderRadius: 15,
    backgroundColor: '#DADBDA',
  },
  emptyText: {
    fontSize: 18,
    fontFamily: fonts.RMedium,
    color: colors.grayColor,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: '20%',
  },
  sepratorView: {
    top: 0,
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    width: wp('100%'),
    marginBottom: 15,
    marginTop: 15,
    left: -15,
  },
  messageImage: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
});

export default HomeScreen;
