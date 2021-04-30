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
import { useIsFocused } from '@react-navigation/native';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
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
} from '../../api/Users';
import { createPost, createReaction } from '../../api/NewsFeeds';
import {
  getGroupDetails,
  getJoinedGroups,
  getTeamsOfClub,
  getGroupMembers,
  followGroup,
  unfollowGroup,
  joinTeam,
  leaveTeam,
  inviteTeam,
} from '../../api/Groups';
import * as RefereeUtils from '../referee/RefereeUtility';
import * as Utils from '../challenge/ChallengeUtility';
import ActivityLoader from '../../components/loader/ActivityLoader';
import ImageProgress from '../../components/newsFeed/ImageProgress';
import UserInfo from '../../components/Home/User/UserInfo';
import GroupInfo from '../../components/Home/GroupInfo';
import ScheduleTabView from '../../components/Home/ScheduleTabView';
import EventScheduleScreen from '../account/schedule/EventScheduleScreen';
import UserHomeTopSection from '../../components/Home/User/UserHomeTopSection';
import ClubHomeTopSection from '../../components/Home/Club/ClubHomeTopSection';
import TeamHomeTopSection from '../../components/Home/Team/TeamHomeTopSection';
import strings from '../../Constants/String';
import ScoreboardSportsScreen from './ScoreboardSportsScreen';
import UpcomingMatchScreen from './UpcomingMatchScreen';
import {
  deleteEvent,
  getEventById,
  getEvents,
  getSlots,
} from '../../api/Schedule';
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
  getQBAccountType,
  QBcreateUser,
  QB_ACCOUNT_TYPE,
  QBconnectAndSubscribe,
  QBlogin,
  QBLogout,
} from '../../utils/QuickBlox';

import RefereeReservationItem from '../../components/Schedule/RefereeReservationItem';
import { getRefereeReservationDetails } from '../../api/Reservations';
import TCSearchBox from '../../components/TCSearchBox';
import { getGameHomeScreen } from '../../utils/gameUtils';
import TCInnerLoader from '../../components/TCInnerLoader';
import TCThinDivider from '../../components/TCThinDivider';
import ScorekeeperInfoSection from '../../components/Home/User/ScorekeeperInfoSection';
import PlayInModule from './playInModule/PlayInModule';
import TCGradientDivider from '../../components/TCThinGradientDivider';
import HomeFeed from '../homeFeed/HomeFeed';
import RefereeFeedPostItems from '../../components/game/soccer/home/review/reviewForReferee/RefereeFeedPostItems';
import ScorekeeperFeedPostItems from '../../components/game/soccer/home/review/reviewForScorekeeper/ScorekeeperFeedPostItems';
import ScrollableTabs from '../../components/ScrollableTabs';
import ProfileScreenShimmer from '../../components/shimmer/account/ProfileScreenShimmer';
import { ImageUploadContext } from '../../context/GetContexts';
import GameStatus from '../../Constants/GameStatus';
import AllInOneGallery from './AllInOneGallery';

const TAB_ITEMS = ['Info', 'Refereed Match', 'Reviews'];
const TAB_ITEMS_SCOREKEEPER = ['Info', 'Scorekeepers Match', 'Reviews'];

const { width } = Dimensions.get('window');

const league_Data = [
  {
    group_name: 'Premiereague League',
    thumbnail: 'image',
  },
  {
    group_name: 'Premiereague League',
  },
  {
    group_name: 'La Liga',
    thumbnail: 'image',
  },
  {
    group_name: 'Premier League',
  },
];

const history_Data = [
  {
    name: 'TownsCup',
    year: '2013',
    winner: true,
  },
  {
    name: 'Premier League',
    year: '2009-2010',
    winner: false,
  },
  {
    name: 'Established',
    year: '2002',
  },
];

const HomeScreen = ({ navigation, route }) => {
  const authContext = useContext(AuthContext);
  const galleryRef = useRef();
  const imageUploadContext = useContext(ImageUploadContext);
  const isFocused = useIsFocused();
  // const viewRef = useRef();
  const mainFlatListRef = useRef();
  const confirmationRef = useRef();
  const [mainFlatListFromTop] = useState(new Animated.Value(0));
  const [isUserHome, setIsUserHome] = useState(false);
  const [isClubHome, setIsClubHome] = useState(false);
  const [isTeamHome, setIsTeamHome] = useState(false);
  const [playsInModalVisible, setPlaysInModalVisible] = useState(false);
  const [refereesInModalVisible, setRefereesInModalVisible] = useState(false);
  const [scorekeeperInModalVisible, setScorekeeperInModalVisible] = useState(
    false,
  );
  const [reviewDetailModalVisible, setReviewDetailModalVisible] = useState(
    false,
  );
  const [feedDataIndex, setFeedDataIndex] = useState(0);
  const [feedDetailIndex, setFeedDetailIndex] = useState(0);
  const [orangeFeed, setOrangeFeed] = useState(false);
  const [reviewGameData, setReviewGameData] = useState();
  const [refereeInfoModalVisible, setRefereeInfoModalVisible] = useState(false);
  const [
    scorekeeperInfoModalVisible,
    setScorekeeperInfoModalVisible,
  ] = useState(false);
  const [refereeMatchModalVisible, setRefereeMatchModalVisible] = useState(
    false,
  );
  const [
    scorekeeperMatchModalVisible,
    setScorekeeperMatchModalVisible,
  ] = useState(false);
  const [reviewsModalVisible, setReviewsModalVisible] = useState(false);
  const [reviewerDetailModalVisible, setReviewerDetailModalVisible] = useState(
    false,
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserData, setCurrentUserData] = useState({});
  const [loading, setloading] = useState(false);
  const [userID, setUserID] = useState('');
  const [scheduleIndexCounter, setScheduleIndexCounter] = useState(0);
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

  const [
    isDoubleSportTeamCreatedVisible,
    setIsDoubleSportTeamCreatedVisible,
  ] = useState(false);

  // const [reviewsData] = useState(reviews_data);

  const selectionDate = moment(eventSelectDate).format('YYYY-MM-DD');
  const timeTableSelectionDate = moment(timetableSelectDate).format(
    'YYYY-MM-DD',
  );
  const eventEditDeleteAction = useRef();
  const addRoleActionSheet = useRef();
  const manageChallengeActionSheet = useRef();

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
      const date = moment(new Date()).format('YYYY-MM-DD');
      const entity = authContext.entity;
      const entityRole = (route?.params?.role === 'user' ? 'users' : 'groups')
        || (entity.role === 'user' ? 'users' : 'groups');

      const uid = route?.params?.uid || entity.uid || entity.auth.user_id;
      const eventdata = [];
      const timetabledata = [];
      let eventTimeTableData = [];
      getEvents(entityRole, uid, authContext)
        .then((response) => {
          getSlots(entityRole, uid, authContext).then((res) => {
            eventTimeTableData = [...response.payload, ...res.payload];
            setEventData(eventTimeTableData);
            setTimeTable(eventTimeTableData);
            eventTimeTableData.filter((event_item) => {
              const startDate = new Date(event_item.start_datetime * 1000);
              const eventDate = moment(startDate).format('YYYY-MM-DD');
              if (eventDate === date) {
                eventdata.push(event_item);
              }
              return null;
            });
            setFilterEventData(eventdata);
            eventTimeTableData.filter((timetable_item) => {
              const timetable_date = new Date(
                timetable_item.start_datetime * 1000,
              );
              const endDate = new Date(timetable_item.end_datetime * 1000);
              const timetabledate = moment(timetable_date).format('YYYY-MM-DD');
              if (timetabledate === date) {
                const obj = {
                  ...timetable_item,
                  start: moment(timetable_date).format('YYYY-MM-DD hh:mm:ss'),
                  end: moment(endDate).format('YYYY-MM-DD hh:mm:ss'),
                };
                timetabledata.push(obj);
              }
              return null;
            });
            setFilterTimeTable(timetabledata);
          });
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });

      getScroreboardGameDetails(uid, authContext)
        .then((res) => {
          console.log('Get Scoreboard Game Details Res :-', res);
          setScoreboardGameData(res.payload);
        })
        .catch((error) => {
          console.log('error :-', error);
        });
    }
  }, [isFocused]);

  useEffect(() => {
    if (selectedEventItem) {
      eventEditDeleteAction.current.show();
    }
  }, [selectedEventItem]);

  useEffect(() => {
    if (route?.params?.fromAccountScreen) {
      const navigateScreen = route?.params?.navigateToScreen;
      const params = route?.params?.homeNavigateParams;
      const allParams = route?.params;
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
  }, [authContext.entity, route.params]);

  useEffect(() => {
    if (isTeamHome) {
      getTeamReviews(route?.params?.uid || authContext.entity.uid, authContext)
        .then((res) => {
          console.log('Get team Review Data Res ::--', res?.payload);

          if (res?.payload?.averageReviews?.[0]) {
            let array = Object.keys(
              res?.payload?.averageReviews?.[0]?.avg_review,
            );
            array = array.filter((e) => e !== 'total_avg');
            const teamProperty = [];

            for (let i = 0; i < array.length; i++) {
              const obj = {
                [array[i]]:
                  res?.payload?.averageReviews?.[0]?.avg_review[array[i]],
              };
              teamProperty.push(obj);
            }
            setAverageTeamReview(teamProperty);
            setTeamReviewData(res?.payload);
          } else {
            setAverageTeamReview([]);
            setTeamReviewData();
          }
        })
        .catch((error) => Alert.alert(strings.alertmessagetitle, error.message));
    }
  }, [authContext, isTeamHome, route?.params?.uid]);

  const getUserData = async (uid, admin) => {
    // setloading(true);
    const promises = [
      getUserDetails(uid, authContext),
      getJoinedGroups(uid, authContext),
    ];
    Promise.all(promises)
      .then(([res1, res2]) => {
        const userDetails = res1.payload;
        console.log('Get user detail by ID:=>', userDetails);
        if (!userDetails.games) {
          userDetails.games = [];
        }

        if (!userDetails.referee_data) {
          userDetails.referee_data = [];
        }

        let count = 0;
        count = userDetails.games
          && userDetails.games.length + userDetails.referee_data.length;

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

        if (res2) {
          userDetails.joined_teams = res2.payload.teams;
          userDetails.joined_clubs = res2.payload.clubs;
        }
        setCurrentUserData({ ...userDetails });
        setIsClubHome(false);
        setIsTeamHome(false);
        setIsUserHome(true);
        setUserID(uid);
        setFirstTimeLoading(false);
      })
      .catch((errResponse) => {
        console.log('promise error', errResponse);
        setFirstTimeLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, strings.defaultError);
        }, 10);
        navigation.goBack();
      });
  };

  const getData = async (uid, role, admin) => {
    const userHome = role === 'user';
    const clubHome = role === 'club';
    const teamHome = role === 'team';

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
          const groupDetails = res1.payload;
          console.log('groupDetails', groupDetails);

          groupDetails.joined_leagues = league_Data;
          groupDetails.history = history_Data;
          groupDetails.joined_members = res2.payload;
          if (res3) {
            groupDetails.joined_teams = res3.payload;
          }
          setCurrentUserData(groupDetails);
          setIsClubHome(clubHome);
          setIsTeamHome(teamHome);
          setIsUserHome(userHome);
          setUserID(uid);
          setFirstTimeLoading(false);
        })
        .catch(() => {
          setFirstTimeLoading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, strings.defaultError);
          }, 10);
          navigation.goBack();
        });
    }
  };

  const createPostAfterUpload = (dataParams) => {
    createPost({ ...dataParams, is_gallery: true }, authContext)
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
      if (postDesc.trim().length > 0 && data?.length === 0) {
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
    setCurrentUserData({ ...currentUserData });

    const params = {
      entity_type: 'player',
    };
    followUser(params, userID, authContext)
      .then(() => {
        console.log('follow user');
      })
      .catch((error) => {
        console.log('callFollowUser error with userID', error, userID);
        currentUserData.is_following = false;
        currentUserData.follower_count -= 1;
        setCurrentUserData({ ...currentUserData });
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
    setCurrentUserData({ ...currentUserData });

    const params = {
      entity_type: 'player',
    };
    unfollowUser(params, userID, authContext)
      .then(() => {
        console.log('unfollow user');
      })
      .catch((error) => {
        console.log('callUnfollowUser error with userID', error, userID);
        currentUserData.is_following = true;
        currentUserData.follower_count += 1;
        setCurrentUserData({ ...currentUserData });
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const clubInviteUser = async () => {
    const params = {
      entity_type: authContext.entity.role,
      uid: authContext.entity.uid,
    };
    inviteUser(params, userID, authContext)
      .then(() => {
        setTimeout(() => {
          Alert.alert(
            strings.alertmessagetitle,
            `“${currentUserData.first_name} ${currentUserData.last_name}“ is invited successfully`,
          );
        }, 10);
      })
      .catch((error) => {
        console.log('clubInviteUser error with userID', error, userID);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const callFollowGroup = async (silentlyCall = false) => {
    currentUserData.is_following = true;
    currentUserData.follower_count += 1;
    setCurrentUserData({ ...currentUserData });

    const params = {
      entity_type: currentUserData.entity_type,
    };
    followGroup(params, userID, authContext)
      .then(() => {
        console.log('follow group');
      })
      .catch((error) => {
        console.log('callFollowGroup error with userID', error, userID);
        currentUserData.is_following = false;
        currentUserData.follower_count -= 1;
        setCurrentUserData({ ...currentUserData });
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
    setCurrentUserData({ ...currentUserData });

    const params = {
      entity_type: currentUserData.entity_type,
    };
    unfollowGroup(params, userID, authContext)
      .then(() => {
        console.log('unfollow user');
      })
      .catch((error) => {
        console.log('callUnfollowGroup error with userID', error, userID);
        currentUserData.is_following = true;
        currentUserData.follower_count += 1;
        setCurrentUserData({ ...currentUserData });
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const userJoinGroup = async () => {
    currentUserData.is_joined = true;
    currentUserData.member_count += 1;
    if (currentUserData.is_following === false) {
      callFollowGroup(true);
    }
    setCurrentUserData({ ...currentUserData });
    const params = {};
    joinTeam(params, userID, authContext)
      .then(() => {
        console.log('user join group');
      })
      .catch((error) => {
        console.log('userJoinGroup error with userID', error, userID);
        currentUserData.is_joined = false;
        currentUserData.member_count -= 1;
        setCurrentUserData({ ...currentUserData });
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const userLeaveGroup = async () => {
    currentUserData.is_joined = false;
    if (currentUserData.member_count > 0) {
      currentUserData.member_count -= 1;
    }
    setCurrentUserData({ ...currentUserData });
    const params = {};
    leaveTeam(params, userID, authContext)
      .then(() => {
        console.log('user leave group');
      })
      .catch((error) => {
        console.log('userLeaveGroup error with userID', error, userID);
        currentUserData.is_joined = true;
        currentUserData.member_count += 1;
        setCurrentUserData({ ...currentUserData });
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const clubInviteTeam = async () => {
    const params = [userID];
    inviteTeam(params, authContext.entity.uid, authContext)
      .then(() => {
        setTimeout(() => {
          Alert.alert(
            strings.alertmessagetitle,
            `“${currentUserData.group_name}“ ${strings.isinvitedsuccesfully}`,
          );
        }, 10);
      })
      .catch((error) => {
        console.log(
          'clubInviteTeam error with userID',
          error,
          authContext.entity.uid,
        );
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const clubJoinTeam = async () => {
    const e = authContext.entity;
    e.obj.parent_group_id = currentUserData.group_id;
    if (currentUserData.joined_teams) {
      currentUserData.joined_teams.push(e.obj);
    } else {
      currentUserData.joined_teams = [e.obj];
    }
    setCurrentUserData({ ...currentUserData });
    joinTeam({}, userID, authContext)
      .then(() => {
        console.log('club join');
      })
      .catch((error) => {
        console.log('clubJoinTeam error with userID', error, userID);
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
        authContext.setEntity({ ...e });
        Utility.setStorage('authContextEntity', { ...e });
        setCurrentUserData({ ...currentUserData });
      });
  };

  const onMessageButtonPress = (user) => {
    setloading(true);
    const accountType = getQBAccountType(user?.entity_type);
    const uid = user?.entity_type === 'player' ? user?.user_id : user?.group_id;
    QBcreateUser(uid, user, accountType)
      .then(() => {
        navigation.navigate('MessageChat', {
          screen: 'MessageChatRoom',
          params: { userId: uid },
        });
        setloading(false);
      })
      .catch(() => {
        navigation.navigate('MessageChat', {
          screen: 'MessageChatRoom',
          params: { userId: uid },
        });
        setloading(false);
      });
  };
  const clubLeaveTeam = async () => {
    const e = authContext.entity;
    e.obj.parent_group_id = '';
    authContext.setEntity({ ...e });
    Utility.setStorage('authContextEntity', { ...e });
    if (currentUserData.joined_teams) {
      currentUserData.joined_teams = currentUserData.joined_teams.filter(
        (team) => team.group_id !== e.uid,
      );
    }
    setCurrentUserData({ ...currentUserData });
    const params = {};
    leaveTeam(params, userID, authContext)
      .then(() => {
        console.log('club leave');
      })
      .catch((error) => {
        console.log('clubLeaveTeam error with userID', error, userID);
        e.obj.parent_group_id = userID;
        authContext.setEntity({ ...e });
        Utility.setStorage('authContextEntity', { ...e });
        if (currentUserData.joined_teams) {
          currentUserData.joined_teams.push(e.obj);
        } else {
          currentUserData.joined_teams = [e.obj];
        }
        setCurrentUserData({ ...currentUserData });
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 10);
      });
  };

  const onUserAction = useCallback(
    (action) => {
      switch (action) {
        case 'follow':
          callFollowUser();
          break;
        case 'unfollow':
          callUnfollowUser();
          break;
        case 'invite':
          clubInviteUser();
          break;
        case 'message':
          onMessageButtonPress(currentUserData);
          break;
        case 'edit':
          navigation.navigate('EditPersonalProfileScreen');
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
        case 'follow':
          callFollowGroup();
          break;
        case 'unfollow':
          callUnfollowGroup();
          break;
        case 'join':
          userJoinGroup();
          break;
        case 'leave':
          userLeaveGroup();
          break;
        case 'joinTeam':
          if (authContext.entity.obj.parent_group_id) {
            Alert.alert(
              strings.alertmessagetitle,
              strings.alreadyjoinclubmessage,
            );
          } else {
            clubJoinTeam();
          }
          break;
        case 'leaveTeam':
          clubLeaveTeam();
          break;
        case 'message':
          onMessageButtonPress(currentUserData);
          break;
        case 'edit':
          navigation.navigate('EditGroupProfileScreen', {
            placeholder:
              authContext.entity.role === 'team'
                ? strings.teamNamePlaceholder
                : strings.clubNameplaceholder,
            nameTitle:
              authContext.entity.role === 'team'
                ? strings.teamNameTitle
                : strings.clubNameTitle,
          });
          break;
        default:
      }
    },
    [
      authContext.entity.obj.parent_group_id,
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
        case 'follow':
          callFollowGroup();
          break;
        case 'unfollow':
          callUnfollowGroup();
          break;
        case 'join':
          userJoinGroup();
          break;
        case 'leave':
          userLeaveGroup();
          break;
        case 'invite':
          clubInviteTeam();
          break;
        case 'message':
          onMessageButtonPress(currentUserData);
          break;
        case 'edit':
          // edit code here
          navigation.navigate('EditGroupProfileScreen', {
            placeholder:
              authContext.entity.role === 'team'
                ? strings.teamNamePlaceholder
                : strings.clubNameplaceholder,
            nameTitle:
              authContext.entity.role === 'team'
                ? strings.teamNameTitle
                : strings.clubNameTitle,
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
        uid: groupObject.group_id,
        backButtonVisible: true,
        role: groupObject.entity_type,
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

  const onChallengePress = async () => {
    if (
      authContext.entity.obj.sport.toLowerCase()
      === currentUserData.sport.toLowerCase()
    ) {
      setChallengePopup(true)
      // navigation.navigate('CreateChallengeForm1', { groupObj: currentUserData });
    } else {
      Alert.alert(
        strings.alertmessagetitle,
        'Sport must be same for both teams',
      );
    }
  };

  let language_string = '';

  const scorekeeperInModal = useCallback(
    (scorekeeperInObject) => {
      console.log('ScorekeeperInObject', scorekeeperInObject);

      if (scorekeeperInObject) {
        const entity = authContext.entity;
        let languagesListName = [];
        if (currentUserData) {
          currentUserData.scorekeeper_data.map((scorekeeperItem) => {
            if (scorekeeperItem.sport_name === scorekeeperInObject.sport_name) {
              setSelectScorekeeperData(scorekeeperItem);
              languagesListName = scorekeeperItem.language;
            }
            return null;
          });
        }
        if (languagesListName.length > 0) {
          languagesListName.map((langItem, index) => {
            language_string = language_string + (index ? ', ' : '') + langItem.language_name;
            return null;
          });
          console.log('Language string::=>', language_string);
          setLanguagesName(language_string);
        }
        setScorekeeperInModalVisible(!scorekeeperInModalVisible);
        setSportName(scorekeeperInObject.sport_name);

        getScorekeeperMatch(
          entity.uid || entity.auth.user_id,
          scorekeeperInObject.sport_name,
          authContext,
        )
          .then((res) => {
            const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            const recentMatch = [];
            const upcomingMatch = [];
            console.log('Recentest Match API Response::->', res);
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
          .catch((error) => Alert.alert(strings.alertmessagetitle, error.message));

        getScorekeeperReviewData(
          route?.params?.uid || entity.uid,
          scorekeeperInObject.sport_name,
          authContext,
        )
          .then((res) => {
            console.log('Get Referee Review Data Res ::--', res?.payload);

            if (res?.payload?.averageReviews?.[0]) {
              let array = Object.keys(
                res?.payload?.averageReviews?.[0]?.avg_review,
              );
              array = array.filter((e) => e !== 'total_avg');
              const scorekeeperProperty = [];

              for (let i = 0; i < array.length; i++) {
                const obj = {
                  [array[i]]:
                    res?.payload?.averageReviews?.[0]?.avg_review[array[i]],
                };
                scorekeeperProperty.push(obj);
              }
              setAverageScorekeeperReview(scorekeeperProperty);
              setScorekeeperReviewData(res?.payload);
            } else {
              setAverageRefereeReview([]);
              setScorekeeperReviewData();
            }
          })
          .catch((error) => Alert.alert(strings.alertmessagetitle, error.message));
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
          currentUserData.referee_data.map((refereeItem) => {
            if (refereeItem.sport_name === refereeInObject.sport_name) {
              setSelectRefereeData(refereeItem);
              languagesListName = refereeItem.language;
            }
            return null;
          });
        }
        if (languagesListName.length > 0) {
          languagesListName.map((langItem, index) => {
            language_string = language_string + (index ? ', ' : '') + langItem.language_name;
            return null;
          });
          setLanguagesName(language_string);
        }
        setRefereesInModalVisible(!refereesInModalVisible);
        setSportName(refereeInObject.sport_name);

        getRefereedMatch(
          entity.uid || entity.auth.user_id,
          refereeInObject.sport_name,
          authContext,
        )
          .then((res) => {
            const currentDateTime = new Date().getTime();
            const recentMatch = [];
            const upcomingMatch = [];
            console.log('Recentest Match API Response::->', res);
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
          .catch((error) => Alert.alert(strings.alertmessagetitle, error.message));

        getRefereeReviewData(
          route?.params?.uid || entity.uid,
          refereeInObject.sport_name,
          authContext,
        )
          .then((res) => {
            console.log('Get Referee Review Data Res ::--', res?.payload);

            if (res?.payload?.averageReviews?.[0]) {
              let array = Object.keys(
                res?.payload?.averageReviews?.[0]?.avg_review,
              );
              array = array.filter((e) => e !== 'total_avg');
              const refereeProperty = [];

              for (let i = 0; i < array.length; i++) {
                const obj = {
                  [array[i]]:
                    res?.payload?.averageReviews?.[0]?.avg_review[array[i]],
                };
                refereeProperty.push(obj);
              }
              setAverageRefereeReview(refereeProperty);
              setRefereeReviewData(res?.payload);
            } else {
              setAverageRefereeReview([]);
              setRefereeReviewData();
            }
          })
          .catch((error) => Alert.alert(strings.alertmessagetitle, error.message));
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
    (data) => (data?.game?.referees || []).some(
        (e) => authContext.entity.uid === e.referee_id,
      ),
    [authContext.entity.uid],
  );

  const findCancelButtonIndex = useCallback(
    (data) => {
      if (data?.game && refereeFound(data)) {
        return 2;
      }
      if (data?.game) {
        return 3;
      }
      return 2;
    },
    [refereeFound],
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
      setloading(true);
      RefereeUtils.getRefereeReservationDetail(
        data?.reservation_id,
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
        setSportName(playInObject?.sport_name);
        setCurrentPlayInObject({ ...playInObject });
        setPlaysInModalVisible(!playsInModalVisible);
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
      if (tab !== 'members') {
        navigation.navigate('UserConnections', { tab, entity_type, user_id });
      } else {
        navigation.navigate('GroupMembersScreen', { groupID: user_id });
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
        return ['Referee Reservation Details', 'Change Events Color', 'Cancel'];
      }
      return [
        'Game Reservation Details',
        'Referee Reservation Details',
        'Change Events Color',
        'Cancel',
      ];
    }
    return ['Edit', 'Delete', 'Cancel'];
  }, [refereeFound, selectedEventItem]);

  const renderRefereesTabContainer = (tabKey) => (
    <View style={{ flex: 1 }}>
      {/* Referee Info */}
      {tabKey === 0 && (
        <RefereeInfoSection
          data={currentUserData}
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
                    if (refereeItem.sport_name === sportName) {
                      setSelectRefereeData(refereeItem);
                      languagesListName = refereeItem.language;
                    }
                    return null;
                  });
                }
                if (languagesListName.length > 0) {
                  languagesListName.map((langItem, index) => {
                    language_string = language_string
                      + (index ? ', ' : '')
                      + langItem.language_name;
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
            firstTabTitle={`Completed (${refereeRecentMatch.length})`}
            secondTabTitle={`Upcoming (${refereeUpcomingMatch.length})`}
            indexCounter={scoreboardTabNumber}
            eventPrivacyContianer={{ width: wp('70%') }}
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
    <View style={{ flex: 1 }}>
      {/* scorekeeper Info */}
      {tabKey === 0 && (
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
                changedata.scorekeeper_data = res.payload.scorekeeper_data;
                changedata.gender = res.payload.gender;
                changedata.birthday = res.payload.birthday;
                setCurrentUserData(changedata);

                if (res.payload.scorekeeper_data) {
                  res.payload.scorekeeper_data.map((scorekeeperItem) => {
                    if (scorekeeperItem.sport_name === sportName) {
                      setSelectRefereeData(scorekeeperItem);
                      languagesListName = scorekeeperItem.language;
                    }
                    return null;
                  });
                }
                if (languagesListName.length > 0) {
                  languagesListName.map((langItem, index) => {
                    language_string = language_string
                      + (index ? ', ' : '')
                      + langItem.language_name;
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
            firstTabTitle={`Completed (${refereeRecentMatch.length})`}
            secondTabTitle={`Upcoming (${refereeUpcomingMatch.length})`}
            indexCounter={scoreboardTabNumber}
            eventPrivacyContianer={{ width: wp('70%') }}
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
        (x) => (x.sport && x.sport.toLowerCase().includes(text.toLowerCase()))
          || (x.sport && x.sport.toLowerCase().includes(text.toLowerCase())),
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
          entity.role === 'user' ? 'users' : 'groups',
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
    ({ item: itemValue }) => {
      const entity = authContext.entity;
      return (
        itemValue.cal_type === 'event' && (
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
                  entity.role === 'user' ? 'users' : 'groups',
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
              itemValue.game
              && itemValue.game.referees
              && itemValue.game.referees.length > 0
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
      <View style={{ flexDirection: 'row' }}>
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
            style={{ flex: 1 }}
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
            let eventTitle = 'Game';
            let eventDesc = 'Game With';
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
              <View style={{ flex: 1 }}>
                {event.cal_type === 'event' && (
                  <CalendarTimeTableView
                    title={eventTitle}
                    summary={`${eventDesc} ${eventDesc2}`}
                    containerStyle={{
                      borderLeftColor: event_color,
                      width: event.width,
                    }}
                    eventTitleStyle={{ color: event_color }}
                  />
                )}
                {event.cal_type === 'blocked' && (
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
            line: { backgroundColor: colors.lightgrayColor },
          }}
        />
        {item.length > 0 && (
          <FlatList
            data={item}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: blockItem }) => {
              if (blockItem.cal_type === 'blocked') {
                return (
                  <EventBlockTimeTableView
                    blockText={'Blocked Zone'}
                    blockZoneTime={`${moment(blockItem.start).format(
                      'hh:mma',
                    )} - ${moment(blockItem.end).format('hh:mma')}`}
                  />
                );
              }
              return <View />;
            }}
            ItemSeparatorComponent={() => <View style={{ height: wp('3%') }} />}
            style={{ marginVertical: wp('4%') }}
            keyExtractor={(itemValue, index) => index.toString()}
          />
        )}
      </View>
    ),
    [timeTableSelectionDate],
  );

  const renderRefereeReservation = useCallback(
    ({ item }) => (
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

  const renderMainInfoTab = useMemo(
    () => (
      <View style={{ flex: 1 }}>
        {isUserHome && (
          <UserInfo
            navigation={navigation}
            userDetails={currentUserData}
            isAdmin={isAdmin}
            onGroupListPress={onGroupListPress}
            onGroupPress={onTeamPress}
            onRefereesInPress={refereesInModal}
            onPlayInPress={playInModel}
          />
        )}
        {(isClubHome || isTeamHome) && (
          <GroupInfo
            navigation={navigation}
            groupDetails={currentUserData}
            isAdmin={isAdmin}
            onGroupListPress={onGroupListPress}
            onGroupPress={onTeamPress}
            onMemberPress={onMemberPress}
          />
        )}
      </View>
    ),
    [
      currentUserData,
      isAdmin,
      isClubHome,
      isTeamHome,
      isUserHome,
      navigation,
      onGroupListPress,
      onTeamPress,
      playInModel,
      refereesInModal,
    ],
  );

  const renderMainScoreboardTab = useMemo(
    () => (
      <View style={{ flex: 1 }}>
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
    ),
    [
      filterScoreboardGameData,
      navigation,
      onScoreboardSearchTextChange,
      scoreboardGameData,
      scoreboardSearchText.length,
    ],
  );

  const renderMainScheduleTab = useMemo(
    () => (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <ScheduleTabView
            firstTabTitle={'Events'}
            secondTabTitle={'Calender'}
            indexCounter={scheduleIndexCounter}
            onFirstTabPress={() => setScheduleIndexCounter(0)}
            onSecondTabPress={() => setScheduleIndexCounter(1)}
          />
        </View>
        {!eventData && <TCInnerLoader visible={true} />}
        {eventData && scheduleIndexCounter === 0 && (
          <View style={{ flex: 1 }}>
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
          <View style={{ flex: 1 }}>
            <View style={styles.shceduleCalenderView}>
              <BackForwardView
                textValue={moment(selectionDate).format('MMMM YYYY')}
              />
              <View>
                <TwoTabView
                  firstTabTitle={'Events'}
                  secondTabTitle={'Timetable'}
                  indexCounter={calenderInnerIndexCounter}
                  onFirstTabPress={() => setCalenderInnerIdexCounter(0)}
                  onSecondTabPress={() => setCalenderInnerIdexCounter(1)}
                />
              </View>
            </View>

            {calenderInnerIndexCounter === 0 && (
              <EventAgendaSection
                items={{ [selectionDate.toString()]: [filterEventData] }}
                selected={selectionDate}
                onDayPress={onCalenderDayPress}
                renderItem={renderMainCalender}
              />
            )}

            {calenderInnerIndexCounter === 1 && (
              <EventAgendaSection
                items={{ [timeTableSelectionDate.toString()]: [filterTimeTable] }}
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
            style={{ margin: 0, justifyContent: 'flex-end' }}
            hasBackdrop
            onBackdropPress={() => setIsRefereeModal(false)}
            backdropOpacity={0}>
            <SafeAreaView style={styles.modalMainViewStyle}>
              <Header
                mainContainerStyle={styles.refereeHeaderMainStyle}
                leftComponent={
                  <TouchableOpacity onPress={() => setIsRefereeModal(false)}>
                    <Image
                      source={images.cancelImage}
                      style={[
                        styles.cancelImageStyle,
                        { tintColor: colors.blackColor },
                      ]}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                }
                centerComponent={
                  <Text style={styles.headerCenterStyle}>
                    {'Choose a referee'}
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
                      { marginHorizontal: 15 },
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
                console.log('selected Event Item:', selectedEventItem);
                if (refereeFound(selectedEventItem)) {
                  goToRefereReservationDetail(selectedEventItem);
                } else {
                  console.log('Selected Event Item::', selectedEventItem);
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
                    'Towns Cup',
                    'Change Event color feature is pending',
                    [
                      {
                        text: 'OK',
                        onPress: async () => {},
                      },
                    ],
                    { cancelable: false },
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
                      console.log('Res :-', res);

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
                            'Towns Cup',
                            'No referees invited or booked by you for this game',
                            [
                              {
                                text: 'OK',
                                onPress: async () => {},
                              },
                            ],
                            { cancelable: false },
                          );
                        }, 0);
                      }
                    })
                    .catch((error) => {
                      console.log('Error :-', error);
                    });
                }
              } else {
                Alert.alert(
                  'Do you want to delete this event ?',
                  '',
                  [
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => {
                        setloading(true);
                        const entity = authContext.entity;
                        const uid = entity.uid || entity.auth.user_id;
                        const entityRole = entity.role === 'user' ? 'users' : 'groups';
                        deleteEvent(
                          entityRole,
                          uid,
                          selectedEventItem.cal_id,
                          authContext,
                        )
                          .then(() => getEvents(entityRole, uid, authContext))
                          .then((response) => {
                            setloading(false);
                            setEventData(response.payload);
                            setTimeTable(response.payload);
                          })
                          .catch((e) => {
                            setloading(false);
                            Alert.alert('', e.messages);
                          });
                      },
                    },
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                  ],
                  { cancelable: false },
                );
              }
            }
            if (index === 2) {
              if (index === 2 && selectedEventItem.game) {
                if (refereeFound(selectedEventItem)) {
                  console.log('Pressed cancel button.');
                } else {
                  Alert.alert(
                    'Towns Cup',
                    'Change Event color feature is pending',
                    [
                      {
                        text: 'OK',
                        onPress: async () => {},
                      },
                    ],
                    { cancelable: false },
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

  const renderHomeMainTabContain = useMemo(
    () => (
      <View style={{ flex: 1 }}>
        {currentTab === 1 && renderMainInfoTab}
        {currentTab === 2 && renderMainScoreboardTab}
        {currentTab === 3 && renderMainScheduleTab}
        {currentTab === 4 && (
          <AllInOneGallery
            isAdmin={isAdmin}
            ref={galleryRef}
            entity_type={
              ['user', 'player'].includes(
                route?.params?.role ?? authContext.entity?.role,
              )
                ? 'player'
                : route?.params?.role ?? authContext.entity?.role
            }
            entity_id={route?.params?.uid ?? authContext.entity?.uid}
            onAddPhotoPress={(pickImages) => {
              navigation.navigate('WritePostScreen', {
                postData: currentUserData,
                onPressDone: callthis,
                selectedImageList: pickImages,
              });
            }}
          />
        )}
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
      renderMainInfoTab,
      renderMainScheduleTab,
      renderMainScoreboardTab,
      route?.params?.role,
      route?.params?.uid,
    ],
  );

  const handleMainRefOnScroll = Animated.event([
    { nativeEvent: { contentOffset: { y: mainFlatListFromTop } } },
  ]);

  const onBackPress = useCallback(() => {
    if (route?.params?.sourceScreen) {
      navigation.popToTop();
    } else {
      if (route.params?.onBackPress) route.params.onBackPress();
      navigation.goBack();
    }
  }, [navigation, route.params]);

  const onThreeDotPressed = useCallback(() => {
    manageChallengeActionSheet.current.show()
  }, []);

  const renderTopFixedButtons = useMemo(
    () => (
      <View
        style={{
          zIndex: 5,
          top: 30,
          justifyContent: 'space-between',
          paddingLeft: 15,
          paddingRight: 15,
        }}>
        {route && route.params && route.params.backButtonVisible && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: 'rgba(0,0,0,0.4)',
                height: 30,
                width: 30,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 25,
              }}
              onPress={onBackPress}>
              <Image
                source={images.backArrow}
                style={{ height: 15, width: 15, tintColor: colors.whiteColor }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: 'rgba(0,0,0,0.4)',
                height: 30,
                width: 30,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 25,
              }}
              onPress={onThreeDotPressed}>
              <Image
                source={images.threeDotIcon}
                style={{
                  height: 15,
                  width: 15,
                  tintColor: colors.whiteColor,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    ),
    [onBackPress, route],
  );

  const renderBackground = useMemo(
    () => (bgImage ? (
      <FastImage
          source={{ uri: bgImage }}
          resizeMode={'cover'}
          style={styles.bgImageStyle}
        />
      ) : (
        <View style={styles.bgImageStyle} />
      )),
    [bgImage],
  );

  const renderHeaderBackgroundProfile = useMemo(
    () => (
      <BackgroundProfile
        currentUserData={currentUserData}
        onConnectionButtonPress={onConnectionButtonPress}
      />
    ),
    [currentUserData, onConnectionButtonPress],
  );

  const renderHeaderUserHomeTopSection = useMemo(
    () => isUserHome && (
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
      currentUserData,
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
    () => isClubHome && (
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
    () => isTeamHome && (
      <TeamHomeTopSection
          teamDetails={currentUserData}
          isAdmin={isAdmin}
          loggedInEntity={authContext.entity}
          onAction={onTeamAction}
        />
      ),
    [isTeamHome, authContext.entity, currentUserData, isAdmin, onTeamAction],
  );

  const renderMainHeaderComponent = useMemo(
    () => (
      <View style={{ zIndex: 1 }}>
        {renderHeaderBackgroundProfile}
        <View style={{ flex: 1 }}>
          {renderHeaderUserHomeTopSection}
          {renderHeaderTeamHomeTopSection}
          {renderHeaderClubHomeTopSection}
          <View style={styles.sepratorStyle} />
        </View>
      </View>
    ),
    [
      renderHeaderBackgroundProfile,
      renderHeaderClubHomeTopSection,
      renderHeaderTeamHomeTopSection,
      renderHeaderUserHomeTopSection,
    ],
  );

  const renderMainFlatList = useMemo(
    () => (
      <View style={{ flex: 1 }}>
        <ScrollableTabs
          tabs={
            isTeamHome
              ? ['Post', 'Info', 'Scoreboard', 'Schedule', 'Gallery', 'Review']
              : ['Post', 'Info', 'Scoreboard', 'Schedule', 'Gallery']
          }
          currentTab={currentTab}
          onTabPress={setCurrentTab}
        />
      </View>
    ),
    [isTeamHome, currentTab],
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
        .then((response) => {
          console.log('Like review feed res::=>', response);
        })
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

  // const onProfilePress = useCallback((item) => {
  //   if (item?.actor?.id) {
  //     if (item?.actor?.id !== authContext?.entity?.uid) {
  //       navigation.navigate('HomeScreen', {
  //         uid: item.actor.id,
  //         backButtonVisible: true,
  //         role: item?.actor?.data?.entity_type === 'player' ? 'user' : item?.actor?.data?.entity_type,
  //       })
  //     }
  //   }
  // }, [])
  const renderNewsFeed = useCallback(
    ({ item }) => {
      console.log('Render feed:=>', item);
      // const onDeleteButtonPress = () => onDeletePost(item)
      // const onProfileButtonPress = () => onProfilePress(item)
      // const onLikeButtonPress = () => onLikePress(item)
      const onDeleteButtonPress = () => alert('Delete');
      const onProfileButtonPress = () => {
        console.log('Profile pressed');
        // setReviewDetailModalVisible(!reviewDetailModalVisible)
        // setRefereeInfoModalVisible(!refereeInfoModalVisible)

        //  onProfilePress(item)
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
    ({ item }) => {
      console.log('Profile Object::=>', currentUserData);
      console.log('Render feed:=>', item);
      // const onDeleteButtonPress = () => onDeletePost(item)
      // const onProfileButtonPress = () => onProfilePress(item)
      // const onLikeButtonPress = () => onLikePress(item)
      const onDeleteButtonPress = () => alert('Delete');
      const onProfileButtonPress = () => {
        console.log('Profile pressed');
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
      {renderBackground}
      {renderMainHeaderComponent}
      {renderMainFlatList}
      {renderHomeMainTabContain}
    </>
  );

  const fixedHeader = useMemo(
    () => (
      <Animated.View
        style={{
          position: 'absolute',
          zIndex: 1,
          top: 0,
          opacity: mainFlatListFromTop.interpolate({
            inputRange: [0, 200],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
        }}>
        <ImageBackground
          source={{ uri: bgImage }}
          resizeMode={'cover'}
          blurRadius={10}
          style={styles.stickyImageStyle}>
          <Text style={styles.userTextStyle}>{fullName}</Text>
        </ImageBackground>
      </Animated.View>
    ),
    [bgImage, fullName, mainFlatListFromTop],
  );

  const renderChallengeButton = useMemo(
    () => !loading
      && isTeamHome
      && authContext.entity.role === 'team' && (
        <View style={styles.challengeButtonStyle}>
          {authContext.entity.obj.group_id !== currentUserData.group_id && (
            <View styles={[styles.outerContainerStyle, { height: 50 }]}>
              <TouchableOpacity onPress={onChallengePress}>
                <LinearGradient
                  colors={[colors.darkThemeColor, colors.themeColor]}
                  style={[
                    styles.containerStyle,
                    { justifyContent: 'space-between' },
                  ]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.buttonLeftText}>{`$${
                      currentUserData.game_fee ?? '0'
                    } ${currentUserData.currency_type}`}</Text>
                    <Text style={styles.buttonTextSmall}>
                      {' '}
                      {strings.perHourText}
                    </Text>
                  </View>
                  <Text style={styles.buttonText}>
                    {strings.challenge.toUpperCase()}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ),
    [
      authContext.entity.obj.group_id,
      authContext.entity.role,
      currentUserData.currency_type,
      currentUserData.game_fee,
      currentUserData.group_id,
      isTeamHome,
      loading,
      onChallengePress,
    ],
  );

  const openPlayInModal = useCallback(() => setPlaysInModalVisible(true), []);

  const onPlayInModalClose = useCallback(
    () => setPlaysInModalVisible(false),
    [],
  );

  const renderImageProgress = useMemo(() => <ImageProgress />, []);

  const switchQBAccount = async (accountData, entity) => {
    let currentEntity = entity;
    const entityType = accountData?.entity_type;
    const uid = entityType === 'player' ? 'user_id' : 'group_id';
    QBLogout()
      .then(() => {
        const {
 USER, CLUB, LEAGUE, TEAM,
 } = QB_ACCOUNT_TYPE;
        let accountType = USER;
        if (entityType === 'club') accountType = CLUB;
        else if (entityType === 'team') accountType = TEAM;
        else if (entityType === 'league') accountType = LEAGUE;
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
              QB: { ...res.user, connected: true, token: res?.session?.token },
            };
            authContext.setEntity({ ...currentEntity });
            await Utility.setStorage('authContextEntity', { ...currentEntity });
            QBconnectAndSubscribe(currentEntity)
              .then((qbRes) => {
                setloading(false);
                if (qbRes?.error) {
                  console.log('Towns Cup', qbRes?.error);
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

    if (item.entity_type === 'player') {
      currentEntity = {
        ...currentEntity,
        uid: item.user_id,
        role: 'user',
        obj: item,
      };
    } else if (item.entity_type === 'team') {
      currentEntity = {
        ...currentEntity,
        uid: item.group_id,
        role: 'team',
        obj: item,
      };
    } else if (item.entity_type === 'club') {
      currentEntity = {
        ...currentEntity,
        uid: item.group_id,
        role: 'club',
        obj: item,
      };
    }
    authContext.setEntity({ ...currentEntity });
    await Utility.setStorage('authContextEntity', { ...currentEntity });

    return currentEntity;
  };

  return (
    <View style={styles.mainContainer}>
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
            navigation.navigate('RegisterPlayer', { comeFrom: 'HomeScreen' });
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
          strings.cancel,
        ]}
        cancelButtonIndex={1}
        onPress={(index) => {
          if (index === 0) {
            // Add Playing
            navigation.navigate('ManageChallengeScreen');
          }
        }}
      />
      {renderChallengeButton}
      <ActivityLoader visible={loading} />

      <View style={{ flex: 1 }}>
        {renderTopFixedButtons}
        {fixedHeader}
        {firstTimeLoading ? (
          // <ShimmerLoader shimmerComponents={['BackgroundProfileShimmer']}/>
          <ProfileScreenShimmer />
        ) : (
          <HomeFeed
            onFeedScroll={handleMainRefOnScroll}
            refs={mainFlatListRef}
            homeFeedHeaderComponent={MainHeaderComponent}
            currentTab={currentTab}
            currentUserData={currentUserData}
            isAdmin={isAdmin}
            navigation={navigation}
            setGalleryData={() => {}}
            userID={route?.params?.uid ?? authContext.entity?.uid}
          />
        )}
      </View>

      {useMemo(
        () => playsInModalVisible && (
          <PlayInModule
              visible={playsInModalVisible}
              openPlayInModal={openPlayInModal}
              onModalClose={onPlayInModalClose}
              navigation={navigation}
              userData={currentUserData}
              playInObject={currentPlayInObject}
              isAdmin={isAdmin}
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
            {/* <Image style={[styles.background, { transform: [{ rotate: '180deg' }], borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }]} source={images.orangeLayer} /> */}
            <SafeAreaView style={{ flex: 1 }}>
              <Header
                mainContainerStyle={styles.headerMainContainerStyle}
                centerComponent={
                  <View style={styles.headerCenterViewStyle}>
                    <Image
                      source={images.refereesInImage}
                      style={styles.refereesImageStyle}
                      resizeMode={'contain'}
                    />
                    <Text style={styles.playInTextStyle}>{`Referees in ${
                      sportName || ''
                    }`}</Text>
                  </View>
                }
                rightComponent={
                  <TouchableOpacity
                    onPress={() => {
                      setRefereesInModalVisible(false);
                      setRefereeCurrentTab(0);
                    }}
                    style={{ padding: 10 }}>
                    <Image
                      source={images.cancelWhite}
                      style={styles.cancelImageStyle}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                }
              />
              {/* <TCThinDivider backgroundColor={colors.refereeHomeDividerColor} width={'100%'} height={2}/> */}
              <TCGradientDivider width={'100%'} height={3} />
              <RefereesProfileSection
                isReferee={true}
                bookRefereeButtonVisible={
                  authContext?.entity?.uid !== currentUserData?.user_id
                }
                profileImage={
                  userThumbnail
                    ? { uri: userThumbnail }
                    : images.profilePlaceHolder
                }
                userName={fullName}
                location={location}
                feesCount={
                  selectRefereeData && selectRefereeData.fee
                    ? selectRefereeData.fee
                    : 0
                }
                onBookRefereePress={() => {
                  setRefereesInModalVisible(false);
                  navigation.navigate('RefereeBookingDateAndTime', {
                    userData: currentUserData,
                    showMatches: true,
                    navigationName: 'HomeScreen',
                    sportName,
                  });
                }}
              />

              <TCScrollableProfileTabs
                tabItem={TAB_ITEMS}
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
                  { backgroundColor: colors.whiteColor },
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
                      <Text style={styles.playInTextStyle}>{'Reviews'}</Text>
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
                  { backgroundColor: colors.whiteColor },
                ]}>
                <LinearGradient
                  colors={[colors.orangeColor, colors.yellowColor]}
                  end={{ x: 0.0, y: 0.25 }}
                  start={{ x: 1, y: 0.5 }}
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
                      <Text style={styles.playInTextStyle}>{'Info'}</Text>
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
                            if (refereeItem.sport_name === sportName) {
                              setSelectRefereeData(refereeItem);
                              languagesListName = refereeItem.language;
                            }
                            return null;
                          });
                        }
                        if (languagesListName.length > 0) {
                          languagesListName.map((langItem, index) => {
                            language_string = language_string
                              + (index ? ', ' : '')
                              + langItem.language_name;
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
                  { backgroundColor: colors.whiteColor },
                ]}>
                <View>
                  <LinearGradient
                    colors={[colors.orangeColor, colors.yellowColor]}
                    end={{ x: 0.0, y: 0.25 }}
                    start={{ x: 1, y: 0.5 }}
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
                          {'Scoreboard'}
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
                  firstTabTitle={`Completed (${refereeRecentMatch.length})`}
                  secondTabTitle={`Upcoming (${refereeUpcomingMatch.length})`}
                  indexCounter={scoreboardTabNumber}
                  eventPrivacyContianer={{ width: wp('70%') }}
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
                  { backgroundColor: colors.whiteColor },
                ]}>
                <View>
                  <LinearGradient
                    colors={[colors.orangeColor, colors.yellowColor]}
                    end={{ x: 0.0, y: 0.25 }}
                    start={{ x: 1, y: 0.5 }}
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
                        <Text style={styles.playInTextStyle}>{'Reviews'}</Text>
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
                  onFeedPress={() => alert(3)}
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
                      { backgroundColor: colors.whiteColor },
                    ]}>
                    <View>
                      <LinearGradient
                        colors={[colors.orangeColor, colors.yellowColor]}
                        end={{ x: 0.0, y: 0.25 }}
                        start={{ x: 1, y: 0.5 }}
                        style={styles.gradiantHeaderViewStyle}></LinearGradient>
                      <Header
                        mainContainerStyle={styles.headerMainContainerStyle}
                        leftComponent={
                          <TouchableOpacity
                            onPress={() => setReviewerDetailModalVisible(false)
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
                              {'Reviews'}
                            </Text>
                          </View>
                        }
                        rightComponent={
                          <TouchableOpacity
                            onPress={() => setReviewerDetailModalVisible(false)
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
            <SafeAreaView style={{ flex: 1 }}>
              <Header
                mainContainerStyle={styles.headerMainContainerStyle}
                centerComponent={
                  <View style={styles.headerCenterViewStyle}>
                    <Image
                      source={images.myScoreKeeping}
                      style={styles.refereesImageStyle}
                      resizeMode={'contain'}
                    />
                    <Text style={styles.playInTextStyle}>{`Scorekeeper in ${
                      sportName || ''
                    }`}</Text>
                  </View>
                }
                rightComponent={
                  <TouchableOpacity
                    onPress={() => {
                      setScorekeeperInModalVisible(false);
                      setScorekeeperCurrentTab(0);
                    }}
                    style={{ padding: 10 }}>
                    <Image
                      source={images.cancelWhite}
                      style={styles.cancelImageStyle}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                }
              />
              <TCThinDivider
                backgroundColor={colors.refereeHomeDividerColor}
                width={'100%'}
                height={2}
              />
              <RefereesProfileSection
                isReferee={false}
                bookRefereeButtonVisible={
                  authContext?.entity?.uid !== currentUserData?.user_id
                }
                profileImage={
                  userThumbnail
                    ? { uri: userThumbnail }
                    : images.profilePlaceHolder
                }
                userName={fullName}
                location={location}
                feesCount={
                  selectScorekeeperData && selectScorekeeperData.fee
                    ? selectScorekeeperData.fee
                    : 0
                }
                onBookRefereePress={() => {
                  setScorekeeperInModalVisible(false);
                  navigation.navigate('ScorekeeperBookingDateAndTime', {
                    userData: currentUserData,
                    showMatches: true,
                    navigationName: 'HomeScreen',
                    sportName,
                  });
                }}
              />

              <TCScrollableProfileTabs
                tabItem={TAB_ITEMS_SCOREKEEPER}
                onChangeTab={(ChangeTab) => setScorekeeperCurrentTab(ChangeTab.i)
                }
                currentTab={currentScorekeeperTab}
                renderTabContain={(tabKey) => renderScorekeeperTabContainer(tabKey)
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
                  { backgroundColor: colors.whiteColor },
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
                      <Text style={styles.playInTextStyle}>{'Reviews'}</Text>
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
                  { backgroundColor: colors.whiteColor },
                ]}>
                <LinearGradient
                  colors={[colors.orangeColor, colors.yellowColor]}
                  end={{ x: 0.0, y: 0.25 }}
                  start={{ x: 1, y: 0.5 }}
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
                      <Text style={styles.playInTextStyle}>{'Info'}</Text>
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
                        changedata.scorekeeper_data = res.payload.scorekeeper_data;
                        changedata.gender = res.payload.gender;
                        changedata.birthday = res.payload.birthday;
                        setCurrentUserData(changedata);

                        if (res.payload.scorekeeper_data) {
                          res.payload.scorekeeper_data.map(
                            (scorekeeperItem) => {
                              if (scorekeeperItem.sport_name === sportName) {
                                setSelectScorekeeperData(scorekeeperItem);
                                languagesListName = scorekeeperItem.language;
                              }
                              return null;
                            },
                          );
                        }
                        if (languagesListName.length > 0) {
                          languagesListName.map((langItem, index) => {
                            language_string = language_string
                              + (index ? ', ' : '')
                              + langItem.language_name;
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
                  { backgroundColor: colors.whiteColor },
                ]}>
                <View>
                  <LinearGradient
                    colors={[colors.orangeColor, colors.yellowColor]}
                    end={{ x: 0.0, y: 0.25 }}
                    start={{ x: 1, y: 0.5 }}
                    style={styles.gradiantHeaderViewStyle}></LinearGradient>
                  <Header
                    mainContainerStyle={styles.headerMainContainerStyle}
                    leftComponent={
                      <TouchableOpacity
                        onPress={() => setScorekeeperMatchModalVisible(false)}>
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
                          {'Scoreboard'}
                        </Text>
                      </View>
                    }
                    rightComponent={
                      <TouchableOpacity
                        onPress={() => setScorekeeperMatchModalVisible(false)}>
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
                  firstTabTitle={`Completed (${scorekeeperRecentMatch.length})`}
                  secondTabTitle={`Upcoming (${scorekeeperUpcomingMatch.length})`}
                  indexCounter={scoreboardTabNumber}
                  eventPrivacyContianer={{ width: wp('70%') }}
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
                  { backgroundColor: colors.whiteColor },
                ]}>
                <View>
                  <LinearGradient
                    colors={[colors.orangeColor, colors.yellowColor]}
                    end={{ x: 0.0, y: 0.25 }}
                    start={{ x: 1, y: 0.5 }}
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
                        <Text style={styles.playInTextStyle}>{'Reviews'}</Text>
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
                      { backgroundColor: colors.whiteColor },
                    ]}>
                    <View>
                      <LinearGradient
                        colors={[colors.orangeColor, colors.yellowColor]}
                        end={{ x: 0.0, y: 0.25 }}
                        start={{ x: 1, y: 0.5 }}
                        style={styles.gradiantHeaderViewStyle}></LinearGradient>
                      <Header
                        mainContainerStyle={styles.headerMainContainerStyle}
                        leftComponent={
                          <TouchableOpacity
                            onPress={() => setReviewerDetailModalVisible(false)
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
                              {'Reviews'}
                            </Text>
                          </View>
                        }
                        rightComponent={
                          <TouchableOpacity
                            onPress={() => setReviewerDetailModalVisible(false)
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
            <Image style={styles.background} source={images.entityCreatedBG} />
            <TouchableOpacity
              onPress={() => confirmationRef.current.close()}
              style={{ alignSelf: 'flex-end' }}>
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
                  route?.params?.entityObj?.thumbnail
                    ? route?.params?.entityObj?.thumbnail
                    : route?.params?.role === 'club'
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
                <Text style={[styles.foundText, { fontFamily: fonts.RBold }]}>
                  {`${route?.params?.groupName}`}
                </Text>
                <Image
                  source={
                    route?.params?.role === 'team'
                      ? images.teamPatch
                      : images.clubPatch
                  }
                  style={styles.entityPatchImage}
                />
              </View>
              <Text style={[styles.foundText, { fontFamily: fonts.RRegular }]}>
                {'has been created.'}
              </Text>
              <Text style={[styles.manageChallengeDetailTitle, { margin: 15 }]}>
                {`Your account has been switched to the ${route?.params?.groupName} account.`}
              </Text>
            </View>

            {route?.params?.role === 'team' && (
              <Text style={styles.manageChallengeDetailTitle}>
                {strings.manageChallengeDetailText}
              </Text>
            )}
            <TouchableOpacity
              style={styles.goToProfileButton}
              onPress={() => {
                Alert.alert('Manage challenge');
              }}>
              <Text style={styles.goToProfileTitle}>
                {route?.params?.role === 'club'
                  ? 'OK'
                  : strings.manageChallengeText}
              </Text>
            </TouchableOpacity>
          </View>
        </Modalize>
      </Portal>
      {/* <Modal
        isVisible={isEntityCreateModalVisible}
        backdropColor="black"
        style={{
          margin: 0,
          justifyContent: 'flex-end',
          backgroundColor: colors.blackOpacityColor,
          flex: 1,
        }}
        hasBackdrop
        onBackdropPress={() => setIsEntityCreateModalVisible(false)}
        backdropOpacity={0}>

      </Modal> */}

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
        onBackdropPress={() => setIsDoubleSportTeamCreatedVisible(false)}
        backdropOpacity={0}>
        <View style={styles.modalContainerViewStyle}>
          <Image style={styles.background} source={images.orangeLayer} />
          <Image style={styles.background} source={images.entityCreatedBG} />
          <TouchableOpacity
            onPress={() => setIsDoubleSportTeamCreatedVisible(false)}
            style={{ alignSelf: 'flex-end' }}>
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
                { fontFamily: fonts.RRegular },
              ]}>
              {`You have completed all the process to create a team at your end. An invite will be sent to ${route?.params?.name}.`}
            </Text>

            <Text style={styles.inviteText}>
              When
              <Text style={{ fontFamily: fonts.RBold }}>
                {' '}
                {route?.params?.name}{' '}
              </Text>
              accepts your invite, the team will be created.
            </Text>
            <Image
              source={images.doubleTeamCreated}
              style={styles.doubleTeamImage}
            />
          </View>

          <TouchableOpacity
            style={styles.goToProfileButton}
            onPress={() => {
              setIsDoubleSportTeamCreatedVisible(false);
            }}>
            <Text style={styles.goToProfileTitle}>OK</Text>
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
              Cancel
            </Text>
            <Text style={styles.locationText}>Challenge</Text>
            <Text style={styles.doneText} onPress={() => {
              if (selectedChallengeOption === 0) {
                setChallengePopup(false)
                navigation.navigate('ChallengeScreen', { groupObj: currentUserData });
              }
              if (selectedChallengeOption === 1) {
                setChallengePopup(false)
                navigation.navigate('CreateChallengeForm1', { groupObj: currentUserData });
                // navigation.navigate('InviteChallengeScreen', { groupObj: currentUserData });
              }
            }}>{(selectedChallengeOption === 0 || selectedChallengeOption === 1) ? 'Next' : ''}</Text>
          </View>
          <TCThinDivider width={'100%'} marginBottom={15} />
          <TouchableWithoutFeedback
                  onPress={() => setSelectedChallengeOption(0)}>
            {selectedChallengeOption === 0 ? (
              <LinearGradient
                      colors={[colors.yellowColor, colors.orangeGradientColor]}
                      style={styles.backgroundView}>
                <Text
                        style={[
                          styles.curruentLocationText,
                          { color: colors.whiteColor },
                        ]}>
                  Continue to Challenge
                </Text>
              </LinearGradient>
                  ) : (
                    <View style={styles.backgroundView}>
                      <Text style={styles.curruentLocationText}>
                        Continue to Challenge
                      </Text>
                    </View>
                  )}
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
                  onPress={() => setSelectedChallengeOption(1)}>
            {selectedChallengeOption === 1 ? (
              <LinearGradient
                      colors={[colors.yellowColor, colors.orangeGradientColor]}
                      style={styles.backgroundView}>
                <Text
                        style={[styles.myCityText, { color: colors.whiteColor }]}>
                  Invite to Challenge
                </Text>
              </LinearGradient>
                  ) : (
                    <View style={styles.backgroundView}>
                      <Text style={styles.myCityText}>Invite to Challenge</Text>
                    </View>
                  )}
          </TouchableWithoutFeedback>
        </View>
      </Modal>
      {/* Create Challenge modal */}

      {!createEventModal && currentTab === 3 && (
        <CreateEventButton
          source={images.plus}
          onPress={() => setCreateEventModal(true)}
        />
      )}

      {renderImageProgress}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  userTextStyle: {
    fontSize: 20,
    fontFamily: fonts.RBold,
    textAlign: 'center',
    color: colors.whiteColor,
  },
  sepratorStyle: {
    height: 7,
    width: '100%',
    backgroundColor: colors.grayBackgroundColor,
  },

  bgImageStyle: {
    backgroundColor: colors.darkGrayTrashColor,
    width: wp(100),
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeButtonStyle: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 5,
    zIndex: 1001,
    bottom: 40,
    height: 60,
  },
  outerContainerStyle: {
    height: 45,
    width: '100%',
    shadowColor: colors.blackColor,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1.0,
    shadowRadius: 4,
    elevation: 2,
  },
  containerStyle: {
    flexDirection: 'row',
    height: 45,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonLeftText: {
    color: colors.whiteColor,
    fontSize: 16,
    marginLeft: 26,
    fontFamily: fonts.RBold,
  },
  buttonTextSmall: {
    color: colors.whiteColor,
    fontSize: 12,
    fontFamily: fonts.RRegular,
  },
  buttonText: {
    color: colors.whiteColor,
    fontSize: 16,
    marginRight: 26,
    fontFamily: fonts.RBold,
  },
  modalContainerViewStyle: {
    height: hp('94%'),
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  headerMainContainerStyle: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
  stickyImageStyle: {
    backgroundColor: colors.darkGrayTrashColor,
    width: wp('100%'),
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
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
    marginLeft: 10,
    resizeMode: 'contain',
    borderRadius: 40,
    borderColor: colors.whiteColor,
    borderWidth: 2,
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
        shadowOffset: { width: 0, height: 3 },
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
    shadowOffset: { width: 0, height: 5 },
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
  doneText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.themeColor,
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

});

export default HomeScreen;
