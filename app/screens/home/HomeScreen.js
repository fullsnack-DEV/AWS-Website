import React, {
  useEffect, useRef, useState, useContext,
} from 'react';
import {
  Image,
  StyleSheet, Text, TouchableOpacity, View, Alert, FlatList, Platform, ScrollView, SafeAreaView, Dimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import moment from 'moment';
// import { AirbnbRating } from 'react-native-ratings';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';
import BackgroundProfile from '../../components/Home/BackgroundProfile';
import Header from '../../components/Home/Header';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import { getGameScoreboardEvents, getGameStatsChartData, getGameStatsData } from '../../api/Games';
import AuthContext from '../../auth/context';
import TCScrollableProfileTabs from '../../components/TCScrollableProfileTabs';
import WritePost from '../../components/newsFeed/WritePost';
import {
  getUserDetails, getGallery, followUser, unfollowUser, inviteUser, patchRegisterRefereeDetails,
} from '../../api/Users';
import { getUserPosts, createPost, getNewsFeed } from '../../api/NewsFeeds';
import {
  getGroupDetails, getJoinedGroups, getTeamsOfClub, getGroupMembers,
  followGroup, unfollowGroup, joinTeam, leaveTeam, inviteTeam,
} from '../../api/Groups';
import NewsFeedList from '../newsfeeds/NewsFeedList';
import ActivityLoader from '../../components/loader/ActivityLoader';
import TabView from '../../components/Home/TabView';
import AddPhotoItem from '../../components/Home/AddPhotoItem';
import SingleImageRender from '../../components/Home/SingleImageRender';
import MultipleImageRender from '../../components/Home/MultipleImageRender';
import SingleVideoRender from '../../components/Home/SingleVideoRender';
import MultipleVideoRender from '../../components/Home/MultipleVideoRender';
import uploadImages from '../../utils/imageAction';
import ImageProgress from '../../components/newsFeed/ImageProgress';
import UserInfo from '../../components/Home/User/UserInfo';
import GroupInfo from '../../components/Home/GroupInfo';
import ScheduleTabView from '../../components/Home/ScheduleTabView';
import TouchableIcon from '../../components/Home/TouchableIcon';
import EventScheduleScreen from '../account/schedule/EventScheduleScreen';
import UserHomeTopSection from '../../components/Home/User/UserHomeTopSection';
import ClubHomeTopSection from '../../components/Home/Club/ClubHomeTopSection';
import TeamHomeTopSection from '../../components/Home/Team/TeamHomeTopSection';
import strings from '../../Constants/String';
import ProfileViewSection from '../../components/Home/User/ProfileViewSection';
import RefereesInItem from '../../components/Home/RefereesInItem';
import NewsFeedDescription from '../../components/newsFeed/NewsFeedDescription';
import TeamViewInfoSection from '../../components/Home/TeamViewInfoSection';
import RecentMatchView from '../../components/Home/RecentMatchView';
import UpcomingMatchView from '../../components/Home/UpcomingMatchView';
import StatsView from '../../components/Home/StatsView';
import PersonalSportsInfo from '../../components/Home/PersonalSportsInfo';
import ScoreboardSportsScreen from './ScoreboardSportsScreen';
import UpcomingMatchScreen from './UpcomingMatchScreen';
import StatsScreen from './StatsScreen';
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
import CertificatesItemView from '../../components/Home/CertificatesItemView';
import LanguageViewInInfo from '../../components/Home/LanguageViewInInfo';
import RefereeInfoSection from '../../components/Home/RefereeInfoSection';
import ReviewRatingView from '../../components/Home/ReviewRatingView';
import ReviewSection from '../../components/Home/ReviewSection';

const certificate_data = [
  {
    id: 0,
    image: images.certificateImage,
    title: 'FIFA Field Certificate',
  },
  {
    id: 1,
    image: images.certificateImage,
    title: 'joinKFA Certificate',
  },
];

const reviews_data = [
  {
    id: 0,
    title: 'Fairness',
    rating: '4.0',
  },
  {
    id: 1,
    title: 'Accuracy',
    rating: '4.0',
  },
  {
    id: 2,
    title: 'Consistency',
    rating: '4.0',
  },
  {
    id: 3,
    title: 'Smoothness',
    rating: '4.0',
  },
  {
    id: 4,
    title: 'Communication',
    rating: '4.0',
  },
];

const { width } = Dimensions.get('window');

const league_Data = [{
  group_name: 'Premiereague League',
  thumbnail: 'image',
},
{
  group_name: 'Premiereague League',
}, {
  group_name: 'La Liga',
  thumbnail: 'image',
},
{
  group_name: 'Premier League',
}]

const history_Data = [{
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
}]

export default function HomeScreen({ navigation, route }) {
  const authContext = useContext(AuthContext);
  const [isUserHome, setIsUserHome] = useState(false)
  const [isClubHome, setIsClubHome] = useState(false)
  const [isTeamHome, setIsTeamHome] = useState(false)
  const [playsInModalVisible, setPlaysInModalVisible] = useState(false)
  const [refereesInModalVisible, setRefereesInModalVisible] = useState(false)
  const [infoModalVisible, setInfoModalVisible] = useState(false)
  const [refereeInfoModalVisible, setRefereeInfoModalVisible] = useState(false)
  const [scoreboardModalVisible, setScoreboardModalVisible] = useState(false)
  const [refereeMatchModalVisible, setRefereeMatchModalVisible] = useState(false)
  const [statsModalVisible, setStatsModalVisible] = useState(false)
  const [reviewsModalVisible, setReviewsModalVisible] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [postData, setPostData] = useState([]);
  const [galleryData, setGalleryData] = useState([]);
  const [currentUserData, setCurrentUserData] = useState({});
  const [loading, setloading] = useState(true);
  const [userID, setUserID] = useState('');
  const [indexCounter, setIndexCounter] = useState(0);
  const [scheduleIndexCounter, setScheduleIndexCounter] = useState(0);
  const [currentTab, setCurrentTab] = useState(0);
  const [totalUploadCount, setTotalUploadCount] = useState(0);
  const [doneUploadCount, setDoneUploadCount] = useState(0);
  const [scoreboardTabNumber, setScroboardTabNumber] = useState(0);
  const [progressBar, setProgressBar] = useState(false);
  const [recentMatchData, setRecentMatchData] = useState([]);
  const [upcomingMatchData, setUpcomingMatchData] = useState([]);
  const [gamesChartData, setGamesChartData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [gameStatsData, setGameStatsData] = useState({
    from_date: false,
    total_games: 0,
    winner: 0,
    looser: 0,
    draw: 0,
  });

  const [eventData, setEventData] = useState([]);
  const [timeTable, setTimeTable] = useState([]);
  const [selectedEventItem, setSelectedEventItem] = useState(null);
  const [filterEventData, setFilterEventData] = useState([]);
  const [filterTimeTable, setFilterTimeTable] = useState([]);
  const [calenderInnerIndexCounter, setCalenderInnerIdexCounter] = useState(0);
  const [eventSelectDate, setEventSelectDate] = useState(new Date());
  const [createEventModal, setCreateEventModal] = useState(false);
  const [timetableSelectDate, setTimeTableSelectDate] = useState(new Date());
  const [searchLocation, setSearchLocation] = useState('');
  const [locationDetail, setLocationDetail] = useState(null);
  const [sportName, setSportName] = useState('');

  const [certificatesData] = useState(certificate_data);
  const [reviewsData] = useState(reviews_data);

  const selectionDate = moment(eventSelectDate).format('YYYY-MM-DD');
  const timeTableSelectionDate = moment(timetableSelectDate).format('YYYY-MM-DD');
  const eventEditDeleteAction = useRef();
  const addRoleActionSheet = useRef();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const date = moment(new Date()).format('YYYY-MM-DD');
      const entity = authContext.entity
      const entityRole = entity.role === 'user' ? 'users' : 'groups';
      const uid = entity.uid || entity.auth.user_id;
      const eventdata = [];
      const timetabledata = [];
      let eventTimeTableData = [];
      getEvents(entityRole, uid, authContext).then((response) => {
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
            const timetable_date = new Date(timetable_item.start_datetime * 1000);
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
          })
          setFilterTimeTable(timetabledata);
        })
      }).catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message)
        }, 0.3)
      })
      return null;
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (selectedEventItem) {
      eventEditDeleteAction.current.show();
    }
  }, [selectedEventItem]);

  const getUserData = async (uid, admin) => {
    const params = {
      uid,
    };
    setloading(true);
    const promises = [getUserDetails(uid, authContext),
      getJoinedGroups(uid, authContext), getUserPosts(params, authContext),
      getGallery(uid, authContext)]
    Promise.all(promises).then(([res1, res2, res3, res4]) => {
      const userDetails = res1.payload;

      if (!userDetails.games) {
        userDetails.games = []
      }

      if (!userDetails.referee_data) {
        userDetails.referee_data = []
      }

      let count = 0
      count = userDetails.games && userDetails.games.length + userDetails.referee_data.length

      if (count < 5) {
        const userRoles = [...userDetails.games, ...userDetails.referee_data]
        if (admin) {
          const addrole = { sport_name: strings.addrole, item_type: 'add_new' }
          userRoles.push(addrole)
        }
        userDetails.roles = userRoles
      } else if (admin) {
        userDetails.games.push({ sport_name: strings.addPlaying, item_type: 'add_new' })
        userDetails.referee_data.push({ sport_name: strings.addRefereeing, item_type: 'add_new' })
      }

      if (res2) {
        userDetails.joined_teams = res2.payload.teams;
        userDetails.joined_clubs = res2.payload.clubs;
      }
      if (res3) {
        setPostData(res3.payload.results);
      }
      if (res4) {
        setGalleryData(res4.payload);
      }
      setCurrentUserData({ ...userDetails });
      setIsClubHome(false)
      setIsTeamHome(false)
      setIsUserHome(true)
      setUserID(uid);
    }).catch((errResponse) => {
      console.log('promise error', errResponse)
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, strings.defaultError);
      }, 0.3)
      navigation.goBack();
    }).finally(() => setloading(false));
  }

  const getData = async (uid, role, admin) => {
    const userHome = role === 'user'
    const clubHome = role === 'club'
    const teamHome = role === 'team'

    setloading(true);
    if (userHome) {
      getUserData(uid, admin)
    } else {
      const params = {
        uid,
      };
      const promises = [getGroupDetails(uid, authContext),
        getGroupMembers(uid, authContext), getUserPosts(params, authContext),
        getGallery(uid, authContext)]
      if (clubHome) {
        promises.push(getTeamsOfClub(uid, authContext))
      }
      Promise.all(promises).then(([res1, res2, res3, res4, res5]) => {
        const groupDetails = res1.payload;
        console.log('groupDetails', groupDetails)

        groupDetails.joined_leagues = league_Data
        groupDetails.history = history_Data
        groupDetails.joined_members = res2.payload;
        if (res3) {
          setPostData(res3.payload.results);
        }
        if (res4) {
          setGalleryData(res4.payload);
        }
        if (res5) {
          groupDetails.joined_teams = res5.payload;
        }
        setCurrentUserData(groupDetails);
        setIsClubHome(clubHome)
        setIsTeamHome(teamHome)
        setIsUserHome(userHome)
        setUserID(uid);
      }).catch((errResponse) => {
        console.log('promise error', errResponse)
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, strings.defaultError);
        }, 0.3)
        navigation.goBack();
      }).finally(() => setloading(false));
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const loginEntity = authContext.entity
      let uid = loginEntity.uid
      let role = loginEntity.role
      let admin = false
      if (route.params && route.params.uid && route.params.role) {
        uid = route.params.uid;
        role = route.params.role;
        if (loginEntity.uid === uid) {
          admin = true
          setIsAdmin(true)
        }
      } else {
        admin = true
        setIsAdmin(true)
      }

      getData(uid, role, admin).catch((error) => {
        console.log('error', error)
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 0.3)
        setloading(false);
      });
    });
    return () => {
      unsubscribe();
    };
  }, [authContext.entity]);

  const progressStatus = (completed, total) => {
    setDoneUploadCount(completed < total ? (completed + 1) : total)
  }

  const callthis = (data, postDesc) => {
    if (data) {
      setTotalUploadCount(data.length || 1);
      setProgressBar(true);
      const imageArray = data.map((dataItem) => (dataItem))
      uploadImages(imageArray, authContext, progressStatus).then((responses) => {
        const attachments = responses.map((item) => ({
          type: 'image',
          url: item.fullImage,
          thumbnail: item.thumbnail,
        }))
        const dataParams = {
          text: postDesc && postDesc,
          attachments,
        };
        createPost(dataParams, authContext)
          .then(() => getNewsFeed(authContext))
          .then((response) => {
            setPostData(response.payload.results)
            setProgressBar(false);
            getGallery(userID, authContext).then((res) => {
              setGalleryData(res.payload);
            });
          })
          .catch((error) => {
            setloading(false)
            console.log('error coming', error)
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, error.message)
            }, 0.3)
          })
      })
    }
  }

  const scrollToTop = useRef();

  const allData = [];
  const fromMeData = [];
  const taggedData = [];
  (galleryData).map((itemImage) => {
    if (itemImage.attachments && itemImage.attachments.length > 0) {
      allData.push(itemImage)
    }
    if (itemImage.activity_id && itemImage.attachments && itemImage.attachments.length > 0) {
      fromMeData.push(itemImage)
    }
    if (itemImage.tagged_activity_id && itemImage.attachments && itemImage.attachments.length > 0) {
      taggedData.push(itemImage)
    }
    return null;
  })

  let fullName = '';
  if (currentUserData && currentUserData.full_name) {
    fullName = currentUserData.full_name;
  }
  let bioDescription = '';
  if (currentUserData && currentUserData.registered_sports && currentUserData.registered_sports.length > 0) {
    bioDescription = currentUserData.registered_sports[0].descriptions ? currentUserData.registered_sports[0].descriptions : '';
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
  let teamData = [];
  if (currentUserData && currentUserData.joined_teams) {
    teamData = currentUserData.joined_teams;
  }

  const allGalleryRenderItem = (item, index) => {
    if (index === 0) {
      return (
        <AddPhotoItem
          onAddPhotoPress={() => {
            ImagePicker.openPicker({
              width: 300,
              height: 400,
              cropping: true,
              multiple: true,
              maxFiles: 10,
            }).then((pickImages) => {
              navigation.navigate('WritePostScreen', { postData: postData ? postData[0] : {}, onPressDone: callthis, selectedImageList: pickImages })
            });
          }}
        />
      );
    }
    if (item.attachments.length > 0) {
      if (item.attachments[0].type === 'image') {
        if (item.attachments.length === 1) {
          return (
            <SingleImageRender
              data={item}
            />
          );
        }
        return (
          <MultipleImageRender
            data={item}
          />
        );
      }
      if (item.attachments[0].type === 'video') {
        if (item.attachments.length === 1) {
          return (
            <SingleVideoRender
              data={item}
            />
          );
        }
        return (
          <MultipleVideoRender
            data={item}
          />
        );
      }
    }
    return <View />
  }

  const fromMeRenderItem = (item, index) => {
    if (index === 0) {
      return (
        <AddPhotoItem
          onAddPhotoPress={() => {
            ImagePicker.openPicker({
              width: 300,
              height: 400,
              cropping: true,
              multiple: true,
              maxFiles: 10,
            }).then((pickImages) => {
              navigation.navigate('WritePostScreen', { postData: postData ? postData[0] : {}, onPressDone: callthis, selectedImageList: pickImages })
            });
          }}
        />
      );
    }
    if (item.attachments.length > 0) {
      if (item.attachments[0].type === 'image') {
        if (item.attachments.length === 1) {
          return (
            <SingleImageRender
              data={item}
            />
          );
        }
        return (
          <MultipleImageRender
            data={item}
          />
        );
      }
      if (item.attachments[0].type === 'video') {
        if (item.attachments.length === 1) {
          return (
            <SingleVideoRender
              data={item}
            />
          );
        }
        return (
          <MultipleVideoRender
            data={item}
          />
        );
      }
    }
    return <View />
  }

  const taggedRenderItem = (item, index) => {
    if (index === 0) {
      return (
        <AddPhotoItem
          onAddPhotoPress={() => {
            ImagePicker.openPicker({
              width: 300,
              height: 400,
              cropping: true,
              multiple: true,
              maxFiles: 10,
            }).then((pickImages) => {
              navigation.navigate('WritePostScreen', { postData: postData ? postData[0] : {}, onPressDone: callthis, selectedImageList: pickImages })
            });
          }}
        />
      );
    }
    if (item.attachments.length > 0) {
      if (item.attachments[0].type === 'image') {
        if (item.attachments.length === 1) {
          return (
            <SingleImageRender
              data={item}
            />
          );
        }
        return (
          <MultipleImageRender
            data={item}
          />
        );
      }
      if (item.attachments[0].type === 'video') {
        if (item.attachments.length === 1) {
          return (
            <SingleVideoRender
              data={item}
            />
          );
        }
        return (
          <MultipleVideoRender
            data={item}
          />
        );
      }
    }
    return <View />
  }

  const callFollowUser = async () => {
    currentUserData.is_following = true;
    currentUserData.follower_count += 1;
    setCurrentUserData({ ...currentUserData });

    const params = {
      entity_type: 'player',
    };
    followUser(params, userID, authContext).then(() => {
      console.log('follow user')
    }).catch((error) => {
      console.log('callFollowUser error with userID', error, userID)
      currentUserData.is_following = false;
      currentUserData.follower_count -= 1;
      setCurrentUserData({ ...currentUserData });
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.message);
      }, 0.3)
    });
  };

  const callUnfollowUser = async () => {
    currentUserData.is_following = false;
    if (currentUserData.follower_count > 0) {
      currentUserData.follower_count -= 1
    }
    setCurrentUserData({ ...currentUserData });

    const params = {
      entity_type: 'player',
    };
    unfollowUser(params, userID, authContext).then(() => {
      console.log('unfollow user')
    }).catch((error) => {
      console.log('callUnfollowUser error with userID', error, userID)
      currentUserData.is_following = true;
      currentUserData.follower_count += 1
      setCurrentUserData({ ...currentUserData });
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.message);
      }, 0.3)
    });
  };

  const clubInviteUser = async () => {
    const params = {
      entity_type: authContext.entity.role,
      uid: authContext.entity.uid,
    };
    inviteUser(params, userID, authContext).then(() => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, `“${currentUserData.first_name} ${currentUserData.last_name}“ is invited successfully`);
      }, 0.3)
    }).catch((error) => {
      console.log('clubInviteUser error with userID', error, userID)
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.message);
      }, 0.3)
    });
  };

  const callFollowGroup = async (silentlyCall = false) => {
    currentUserData.is_following = true;
    currentUserData.follower_count += 1;
    setCurrentUserData({ ...currentUserData });

    const params = {
      entity_type: currentUserData.entity_type,
    };
    followGroup(params, userID, authContext).then(() => {
      console.log('follow group')
    }).catch((error) => {
      console.log('callFollowGroup error with userID', error, userID)
      currentUserData.is_following = false;
      currentUserData.follower_count -= 1;
      setCurrentUserData({ ...currentUserData });
      if (silentlyCall === false) {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.message);
        }, 0.3)
      }
    });
  };

  const callUnfollowGroup = async () => {
    currentUserData.is_following = false;
    if (currentUserData.follower_count > 0) {
      currentUserData.follower_count -= 1
    }
    setCurrentUserData({ ...currentUserData });

    const params = {
      entity_type: currentUserData.entity_type,
    };
    unfollowGroup(params, userID, authContext).then(() => {
      console.log('unfollow user')
    }).catch((error) => {
      console.log('callUnfollowGroup error with userID', error, userID)
      currentUserData.is_following = true;
      currentUserData.follower_count += 1
      setCurrentUserData({ ...currentUserData });
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.message);
      }, 0.3)
    });
  };

  const userJoinGroup = async () => {
    currentUserData.is_joined = true;
    currentUserData.member_count += 1
    if (currentUserData.is_following === false) {
      callFollowGroup(true);
    }
    setCurrentUserData({ ...currentUserData });
    const params = {};
    joinTeam(params, userID, authContext).then(() => {
      console.log('user join group')
    }).catch((error) => {
      console.log('userJoinGroup error with userID', error, userID)
      currentUserData.is_joined = false;
      currentUserData.member_count -= 1
      setCurrentUserData({ ...currentUserData });
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.message);
      }, 0.3)
    });
  };

  const userLeaveGroup = async () => {
    currentUserData.is_joined = false;
    if (currentUserData.member_count > 0) {
      currentUserData.member_count -= 1
    }
    setCurrentUserData({ ...currentUserData });
    const params = {};
    leaveTeam(params, userID, authContext).then(() => {
      console.log('user leave group')
    }).catch((error) => {
      console.log('userLeaveGroup error with userID', error, userID)
      currentUserData.is_joined = true;
      currentUserData.member_count += 1
      setCurrentUserData({ ...currentUserData });
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.message);
      }, 0.3)
    });
  };

  const clubInviteTeam = async () => {
    const params = [userID];
    inviteTeam(params, authContext.entity.uid, authContext).then(() => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, `“${currentUserData.group_name}“ ${strings.isinvitedsuccesfully}`);
      }, 0.3)
    }).catch((error) => {
      console.log('clubInviteTeam error with userID', error, authContext.entity.uid)
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.message);
      }, 0.3)
    });
  };

  const clubJoinTeam = async () => {
    const e = authContext.entity
    e.obj.parent_group_id = currentUserData.group_id;
    if (currentUserData.joined_teams) {
      currentUserData.joined_teams.push(e.obj);
    } else {
      currentUserData.joined_teams = [e.obj]
    }
    setCurrentUserData({ ...currentUserData });
    joinTeam({}, userID, authContext).then(() => {
      console.log('club join')
    }).catch((error) => {
      console.log('clubJoinTeam error with userID', error, userID)
      delete e.obj.parent_group_id;
      if (currentUserData.joined_teams) {
        currentUserData.joined_teams = currentUserData.joined_teams.filter((team) => team.group_id !== e.uid)
      }
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.message);
      }, 0.3)
    }).finally(() => {
      authContext.setEntity({ ...e })
      setCurrentUserData({ ...currentUserData });
    });
  };

  const clubLeaveTeam = async () => {
    const e = authContext.entity
    e.obj.parent_group_id = '';
    authContext.setEntity({ ...e })
    if (currentUserData.joined_teams) {
      currentUserData.joined_teams = currentUserData.joined_teams.filter((team) => team.group_id !== e.uid)
    }
    setCurrentUserData({ ...currentUserData });
    const params = {};
    leaveTeam(params, userID, authContext).then(() => {
      console.log('club leave')
    }).catch((error) => {
      console.log('clubLeaveTeam error with userID', error, userID)
      e.obj.parent_group_id = userID;
      authContext.setEntity({ ...e })
      if (currentUserData.joined_teams) {
        currentUserData.joined_teams.push(e.obj);
      } else {
        currentUserData.joined_teams = [e.obj]
      }
      setCurrentUserData({ ...currentUserData });
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.message);
      }, 0.3)
    });
  };

  const onUserAction = (action) => {
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
        navigation.navigate('Message', {
          screen: 'MessageMainScreen',
          params: { userId: currentUserData?.user_id },
        })
        break;
      case 'edit':
        navigation.navigate('EditPersonalProfileScreen')
        break;
      default:
    }
  }

  const onClubAction = (action) => {
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
          Alert.alert(strings.alertmessagetitle, strings.alreadyjoinclubmessage)
        } else {
          clubJoinTeam();
        }
        break;
      case 'leaveTeam':
        clubLeaveTeam();
        break;
      case 'message':
        navigation.navigate('Message', {
          screen: 'MessageMainScreen',
          params: { userId: currentUserData?.group_id },
        })
        break;
      case 'edit':
        navigation.navigate('EditGroupProfileScreen', {
          placeholder: authContext.entity.role === 'team' ? strings.teamNamePlaceholder : strings.clubNameplaceholder,
          nameTitle: authContext.entity.role === 'team' ? strings.teamNameTitle : strings.clubNameTitle,

        });
        break;
      default:
    }
  }

  const onTeamAction = (action) => {
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
        navigation.navigate('Message', {
          screen: 'MessageMainScreen',
          params: { userId: currentUserData?.group_id },
        })
        break;
      case 'edit':
        // edit code here
        navigation.navigate('EditGroupProfileScreen', {
          placeholder: authContext.entity.role === 'team' ? strings.teamNamePlaceholder : strings.clubNameplaceholder,
          nameTitle: authContext.entity.role === 'team' ? strings.teamNameTitle : strings.clubNameTitle,
        }); break;
      default:
    }
  }

  const onTeamPress = (groupObject) => {
    console.log('groupObject', groupObject)
    navigation.push('HomeScreen', {
      uid: groupObject.group_id,
      backButtonVisible: true,
      role: groupObject.entity_type,
    })
  }

  const onMemberPress = (memberObject) => {
    console.log('memberObject', memberObject)
  }

  const onGroupListPress = (groupList, entityType) => {
    navigation.push('GroupListScreen', {
      groups: groupList,
      entity_type: entityType,
    })
  }

  const onChallengePress = async () => {
    if (authContext.entity.obj.sport === currentUserData.sport) {
      navigation.navigate('CreateChallengeForm1', { groupObj: currentUserData })
    } else {
      Alert.alert(strings.alertmessagetitle, 'Sport must be same for both teams')
    }
  }

  const refereesInModal = (refereeInObject) => {
    console.log('refereeInObject', refereeInObject)
    if (refereeInObject) {
      setRefereesInModalVisible(!refereesInModalVisible);
      const entity = authContext.entity
      const params = {
        sport: refereeInObject.sport_name,
        role: 'player',
        status: 'ended',
      };
      getGameScoreboardEvents(entity.uid || entity.auth.user_id, params, authContext).then((res) => {
        const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        const recentMatch = [];
        const upcomingMatch = [];
        res.payload.filter((event_item) => {
          const eventStartDate = new Date(event_item.start_datetime * 1000)
          if (eventStartDate > date) {
            upcomingMatch.push(event_item);
            setUpcomingMatchData([...upcomingMatch]);
          } else {
            recentMatch.push(event_item);
            setRecentMatchData([...recentMatch]);
          }
          return null;
        });
      })
        .catch((error) => Alert.alert(strings.alertmessagetitle, error.message));
    } else {
      // add New Referee
    }
  };

  const onAddRolePress = () => {
    addRoleActionSheet.current.show()
  };

  const playInModel = (playInObject) => {
    console.log('playInObject now', playInObject)
    if (playInObject) {
      // Edit Refree Here
    } else {
      // in case add new

    }
  };

  const playsInModal = () => {
    setPlaysInModalVisible(!playsInModalVisible);
  }

  const infoModal = () => {
    setInfoModalVisible(!infoModalVisible);
  };

  const refereeInfoModal = () => {
    setRefereeInfoModalVisible(!refereeInfoModalVisible);
  };

  const scoreboardModal = () => {
    setScoreboardModalVisible(!scoreboardModalVisible);
  };

  const refereeMatchModal = () => {
    setRefereeMatchModalVisible(!refereeMatchModalVisible);
  };

  const statsModal = () => {
    setStatsModalVisible(!statsModalVisible);
  };

  const reviewsModal = () => {
    setReviewsModalVisible(!reviewsModalVisible);
  };

  useEffect(() => {
    if (route.params && route.params.locationName) {
      setInfoModalVisible(true);
      setPlaysInModalVisible(true);
      setSearchLocation(route.params.locationName);
      setLocationDetail(route.params.locationDetail);
    }
  }, [route.params]);

  return (
    <View style={ styles.mainContainer }>
      <ActionSheet
                    ref={addRoleActionSheet}
                    options={[strings.addPlaying, strings.addRefereeing, strings.cancel]}
                    cancelButtonIndex={2}
                    onPress={(index) => {
                      if (index === 0) {
                        // Add Playing
                        console.log('add playing')
                      } else if (index === 1) {
                        // Add Refereeing
                        console.log('add refereeing')
                        setRefereesInModalVisible(!refereesInModalVisible);
                      }
                    }}
                  />
      {(isTeamHome && authContext.entity.role === 'team')
      && <View style={ styles.challengeButtonStyle }>
        {authContext.entity.obj.group_id !== currentUserData.group_id && <View styles={[styles.outerContainerStyle, { height: 50 }]}><TouchableOpacity onPress={ onChallengePress }>
          <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[colors.greenGradientStart, colors.greenGradientEnd]}
          style={[styles.containerStyle, { justifyContent: currentUserData.game_fee ? 'space-between' : 'center' }]}>
            {currentUserData.game_fee && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.buttonLeftText}>{`$${currentUserData.game_fee} ${currentUserData.currency_type}`}</Text>
              <Text style={styles.buttonTextSmall}> {strings.perHourText}</Text>
            </View>}
            <Text style={ [styles.buttonText, { marginRight: currentUserData.game_fee ? 26 : 0 }] }>{strings.challenge.toUpperCase()}</Text>
          </LinearGradient>
        </TouchableOpacity></View>}
      </View>}
      <ActivityLoader visible={loading} />
      <Header
        safeAreaStyle={{ position: 'absolute' }}
        leftComponent={
          <TouchableOpacity>
            <Image source={images.backArrow} style={{ height: 22, width: 16, tintColor: colors.whiteColor }} />
          </TouchableOpacity>
        }
        rightComponent={
          <TouchableOpacity>
            <Image source={images.menu} style={{ height: 22, width: 22, tintColor: colors.whiteColor }} />
          </TouchableOpacity>
        }
      />
      <ParallaxScrollView
        ref={scrollToTop}
        backgroundColor="white"
        contentBackgroundColor="white"
        parallaxHeaderHeight={310}
        stickyHeaderHeight={Platform.OS === 'ios' ? 90 : 50}
        fadeOutForeground={false}
        renderFixedHeader={() => (
          <Header
            safeAreaStyle={{ position: 'absolute' }}
            leftComponent={
              (route && route.params && route.params.backButtonVisible) && (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Image source={images.backArrow} style={{ height: 22, width: 16, tintColor: colors.whiteColor }} />
                </TouchableOpacity>)
            }
            rightComponent={
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Image source={images.menu} style={{ height: 22, width: 22, tintColor: colors.whiteColor }} />
              </TouchableOpacity>
            }
          />
        )}
        renderStickyHeader={() => (
          <View>
            {bgImage ? <Image source={{ uri: bgImage }} resizeMode={'cover'} blurRadius={10} style={styles.stickyImageStyle} /> : <View style={styles.bgImageStyle} />}
            <Header
              safeAreaStyle={{ position: 'absolute' }}
              centerComponent={
                <Text style={styles.userTextStyle}>{fullName}</Text>
              }
            />
          </View>
        )}
        renderBackground={() => (
          bgImage ? <Image source={{ uri: bgImage }} resizeMode={'stretch'} style={styles.bgImageStyle} /> : <View style={styles.bgImageStyle} />
        )}
        renderForeground={() => (
          <BackgroundProfile
            currentUserData={currentUserData}
          />
        )}
        >
        <View style={{ flex: 1 }}>
          {isUserHome && <UserHomeTopSection userDetails={currentUserData}
                    isAdmin={isAdmin}
                    loggedInEntity={authContext.entity}
                    onAddRolePress={onAddRolePress}
                    onRefereesInPress={refereesInModal}
                    onPlayInPress={(item) => {
                      const entity = authContext.entity
                      setSportName(item.sport_name);
                      setGamesChartData([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                      setGameStatsData({
                        from_date: false,
                        total_games: 0,
                        winner: 0,
                        looser: 0,
                        draw: 0,
                      })
                      const params = {
                        sport: item.sport_name,
                        role: 'player',
                        status: 'ended',
                      };
                      getGameScoreboardEvents(entity.uid || entity.auth.user_id, params, authContext).then((res) => {
                        const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                        const recentMatch = [];
                        const upcomingMatch = [];
                        res.payload.filter((event_item) => {
                          const eventStartDate = new Date(event_item.start_datetime * 1000)
                          if (eventStartDate > date) {
                            upcomingMatch.push(event_item);
                            setUpcomingMatchData([...upcomingMatch]);
                          } else {
                            recentMatch.push(event_item);
                            setRecentMatchData([...recentMatch]);
                          }
                          return null;
                        });
                      })
                        .catch((error) => Alert.alert(strings.alertmessagetitle, error.message));
                      playsInModal()
                      const parameters = {
                        sport: item.sport_name,
                      };
                      const gameChart = [];
                      getGameStatsChartData(entity.uid || entity.auth.user_id, parameters, authContext).then((response) => {
                        if (response.payload && response.payload.length > 0) {
                          response.payload[0].data.map((gameChartItem) => {
                            gameChart.push(gameChartItem.value);
                            setGamesChartData([...gameChart]);
                            return null;
                          })
                        }
                      })
                        .catch((error) => Alert.alert(strings.alertmessagetitle, error.message));
                      const paramData = {
                        sport: item.sport_name,
                      };
                      getGameStatsData(entity.uid || entity.auth.user_id, paramData, authContext).then((response) => {
                        if (response.payload && response.payload.length > 0) {
                          setGameStatsData(response.payload[0].stats)
                        }
                      })
                        .catch((error) => Alert.alert(strings.alertmessagetitle, error.message));
                    }
                    }
                    onAction={onUserAction}/>}
          {isClubHome && <ClubHomeTopSection clubDetails={currentUserData}
            isAdmin={isAdmin}
            loggedInEntity={authContext.entity}
            onAction={onClubAction}/>}
          {isTeamHome && <TeamHomeTopSection teamDetails={currentUserData}
            isAdmin={isAdmin}
            loggedInEntity={authContext.entity}
            onAction={onTeamAction}/>}
          <View style={styles.sepratorStyle}/>
          <TCScrollableProfileTabs
            tabItem={['Post', 'Info', 'Scoreboard', 'Schedule', 'Gallery']}
            onChangeTab={(ChangeTab) => {
              scrollToTop.current.refs.ScrollView.scrollTo({ y: Platform.OS === 'ios' ? 280 : 320 })
              setCurrentTab(ChangeTab.i)
            }}
            currentTab={currentTab}
            renderTabContain={(tabKey) => (
              <View>
                {tabKey === 0 && (<View>
                  {isAdmin && <WritePost
                    navigation={navigation}
                    postDataItem={postData ? postData[0] : {}}
                    onWritePostPress={() => {
                      navigation.navigate('WritePostScreen', { postData: postData ? postData[0] : {}, onPressDone: callthis, selectedImageList: [] })
                    }}
                  />}
                  <NewsFeedList
                    navigation={navigation}
                    postData={postData}
                    userID={userID}
                  />
                </View>)}
                {tabKey === 1 && (<View style={{ flex: 1 }} >
                  {isUserHome && <UserInfo
                    navigation={navigation}
                    userDetails={currentUserData}
                    isAdmin={isAdmin}
                    onGroupListPress={onGroupListPress}
                    onGroupPress={onTeamPress}
                    onRefereesInPress={refereesInModal}
                    onPlayInPress={playInModel}
                  />}
                  {(isClubHome || isTeamHome) && <GroupInfo
                    navigation={navigation}
                    groupDetails={currentUserData}
                    isAdmin={isAdmin}
                    onGroupListPress={onGroupListPress}
                    onGroupPress={onTeamPress}
                    onMemberPress={onMemberPress}
                  />}
                </View>)}
                {tabKey === 2 && (<View style={{ flex: 1 }} />)}
                {tabKey === 3 && (<View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                    <View style={{ padding: 5, height: 16, width: 16 }} />
                    <ScheduleTabView
                      firstTabTitle={'Events'}
                      secondTabTitle={'Calender'}
                      indexCounter={scheduleIndexCounter}
                      onFirstTabPress={() => setScheduleIndexCounter(0)}
                      onSecondTabPress={() => setScheduleIndexCounter(1)}
                    />
                    <TouchableIcon
                      source={images.searchLocation}
                      onItemPress={() => {}}
                    />
                  </View>
                  {scheduleIndexCounter === 0 && <View style={{ flex: 1 }}>
                    <EventScheduleScreen
                      eventData={eventData}
                      navigation={navigation}
                      onThreeDotPress={(item) => {
                        setSelectedEventItem(item);
                      }}
                      onItemPress={async (item) => {
                        const entity = authContext.entity;
                        if (item.game_id) {
                          navigation.navigate('SoccerHome', {
                            gameId: item.game_id,
                          })
                        } else {
                          getEventById(entity.role === 'user' ? 'users' : 'groups', entity.uid || entity.auth.user_id, item.cal_id, authContext).then((response) => {
                            navigation.navigate('EventScreen', { data: response.payload, gameData: item });
                          }).catch((e) => {
                            console.log('Error :-', e);
                          })
                        }
                      }}
                    />
                  </View>}

                  {scheduleIndexCounter === 1 && <View style={{ flex: 1 }}>
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

                    {calenderInnerIndexCounter === 0 && <EventAgendaSection
                      items={{
                        [selectionDate.toString()]: [filterEventData],
                      }}
                      selected={selectionDate}
                      onDayPress={(day) => {
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
                      }}
                      renderItem={(item) => {
                        const entity = authContext.entity
                        if (item.length > 0) {
                          return (
                            <FlatList
                              data={item}
                              renderItem={({ item: itemValue }) => (itemValue.cal_type === 'event' && <EventInCalender
                                onPress={async () => {
                                  if (itemValue.game_id) {
                                    navigation.navigate('SoccerHome', {
                                      gameId: itemValue.game_id,
                                    })
                                  } else {
                                    getEventById(entity.role === 'user' ? 'users' : 'groups', entity.uid || entity.auth.user_id, itemValue.cal_id, authContext).then((response) => {
                                      navigation.navigate('EventScreen', { data: response.payload, gameData: itemValue });
                                    }).catch((e) => {
                                      console.log('Error :-', e);
                                    })
                                  }
                                }}
                                eventBetweenSection={itemValue.game}
                                eventOfSection={true}
                                onThreeDotPress={() => {
                                  setSelectedEventItem(itemValue);
                                }}
                                data={itemValue}
                              />)}
                              ListHeaderComponent={() => <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.filterHeaderText}>{moment(selectionDate).format('ddd, DD MMM')}</Text>
                                <Text style={styles.headerTodayText}>
                                  {moment(selectionDate).calendar(null, {
                                    lastWeek: '[Last] dddd',
                                    lastDay: '[Yesterday]',
                                    sameDay: '[Today]',
                                    nextDay: '[Tomorrow]',
                                    nextWeek: 'dddd',
                                  })}
                                </Text>
                              </View>}
                              bounces={false}
                              style={{ flex: 1 }}
                              keyExtractor={(itemValueKey, index) => index.toString()}
                            />
                          );
                        }
                        return <Text style={styles.dataNotFoundText}>Data Not Found!</Text>;
                      }}
                    />}

                    {calenderInnerIndexCounter === 1 && <EventAgendaSection
                      items={{
                        [timeTableSelectionDate.toString()]: [filterTimeTable],
                      }}
                      onDayPress={(day) => {
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
                      }}
                      renderItem={(item) => <View>
                        <EventCalendar
                          eventTapped={(event) => { console.log('Event ::--', event) }}
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
                                {event.cal_type === 'event' && <CalendarTimeTableView
                                  title={eventTitle}
                                  summary={`${eventDesc} ${eventDesc2}`}
                                  containerStyle={{ borderLeftColor: event_color, width: event.width }}
                                  eventTitleStyle={{ color: event_color }}
                                />}
                                {event.cal_type === 'blocked' && <View style={[styles.blockedViewStyle, {
                                  width: event.width + 68, height: event.height,
                                }]} />}
                              </View>
                            );
                          }}
                          styles={{
                            event: styles.eventViewStyle,
                            line: { backgroundColor: colors.lightgrayColor },
                          }}
                        />
                        {item.length > 0 && <FlatList
                          data={item}
                          scrollEnabled={false}
                          showsHorizontalScrollIndicator={ false }
                          renderItem={ ({ item: blockItem }) => {
                            if (blockItem.cal_type === 'blocked') {
                              return (
                                <EventBlockTimeTableView
                                  blockText={'Blocked Zone'}
                                  blockZoneTime={`${moment(blockItem.start).format('hh:mma')} - ${moment(blockItem.end).format('hh:mma')}`}
                                />
                              );
                            }
                            return <View />;
                          }}
                          ItemSeparatorComponent={ () => (
                            <View style={ { height: wp('3%') } } />
                          ) }
                          style={ { marginVertical: wp('4%') } }
                          keyExtractor={(itemValue, index) => index.toString() }
                        />}
                      </View>}
                    />}
                  </View>}
                  <ActionSheet
                    ref={eventEditDeleteAction}
                    options={['Edit', 'Delete', 'Cancel']}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={1}
                    onPress={(index) => {
                      setSelectedEventItem(null);
                      if (index === 0) {
                        navigation.navigate('EditEventScreen', { data: selectedEventItem, gameData: selectedEventItem });
                      }
                      if (index === 1) {
                        Alert.alert(
                          'Do you want to delete this event ?',
                          '',
                          [{
                            text: 'Delete',
                            style: 'destructive',
                            onPress: async () => {
                              const entity = authContext.entity
                              setloading(true);
                              deleteEvent(entity.role === 'user' ? 'users' : 'groups', entity.uid || entity.auth.user_id, selectedEventItem.cal_id, authContext)
                                .then(() => getEvents(entity.role === 'user' ? 'users' : 'groups', entity.uid || entity.auth.user_id, authContext))
                                .then((response) => {
                                  setloading(false);
                                  setEventData(response.payload);
                                  setTimeTable(response.payload);
                                })
                                .catch((e) => {
                                  setloading(false);
                                  console.log('error coming', e)
                                  setTimeout(() => {
                                    Alert.alert(strings.alertmessagetitle, e.message)
                                  }, 0.3)
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
                    }}
                  />
                  <CreateEventBtnModal
                    visible={createEventModal}
                    onCancelPress={() => setCreateEventModal(false)}
                    onCreateEventPress={() => {
                      setCreateEventModal(false)
                      navigation.navigate('CreateEventScreen', { comeName: 'ScheduleScreen' })
                    }}
                    onChallengePress={() => {
                      setCreateEventModal(false)
                      navigation.navigate('EditChallengeAvailability')
                    }}
                  />
                </View>)}
                {tabKey === 4 && (<View>
                  <TabView
                    indexCounter={indexCounter}
                    onFirstTabPress={() => setIndexCounter(0)}
                    onSecondTabPress={() => setIndexCounter(1)}
                    onThirdTabPress={() => setIndexCounter(2)}
                  />
                  <View style={styles.sepratorLineStyle} />
                  {indexCounter === 0 && <FlatList
                    data={['0', ...allData]}
                    bounces={false}
                    renderItem={({ item, index }) => allGalleryRenderItem(item, index)}
                    numColumns={3}
                    style={{ marginHorizontal: 1.5 }}
                    keyExtractor={(item, index) => index}
                  />}
                  {indexCounter === 1 && <FlatList
                    data={['0', ...fromMeData]}
                    bounces={false}
                    renderItem={({ item, index }) => fromMeRenderItem(item, index)}
                    numColumns={3}
                    style={{ marginHorizontal: 1.5 }}
                    keyExtractor={(item, index) => index}
                  />}
                  {indexCounter === 2 && <FlatList
                    data={['0', ...taggedData]}
                    bounces={false}
                    renderItem={({ item, index }) => taggedRenderItem(item, index)}
                    numColumns={3}
                    style={{ marginHorizontal: 1.5 }}
                    keyExtractor={(item, index) => index}
                  />}
                </View>
                )}
              </View>
            )}/>
        </View>
        <Modal
          isVisible={playsInModalVisible}
          backdropColor="black"
          style={{
            margin: 0, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          hasBackdrop
          onBackdropPress={() => setPlaysInModalVisible(false)}
          backdropOpacity={0}
        >
          <View style={styles.modalContainerViewStyle}>
            <Image
              style={[styles.background, { transform: [{ rotate: '180deg' }], borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }]}
              source={images.orangeLayer}
            />
            <SafeAreaView style={{ flex: 1 }}>
              <Header
                safeAreaStyle={{ marginTop: 10 }}
                mainContainerStyle={styles.headerMainContainerStyle}
                centerComponent={
                  <View style={styles.headerCenterViewStyle}>
                    <Image source={images.soccerImage} style={styles.soccerImageStyle} resizeMode={'contain'} />
                    <Text style={styles.playInTextStyle}>{'Plays in Soccer'}</Text>
                  </View>
                }
                rightComponent={
                  <TouchableOpacity onPress={() => setPlaysInModalVisible(false)}>
                    <Image source={images.cancelWhite} style={styles.cancelImageStyle} resizeMode={'contain'} />
                  </TouchableOpacity>
                }
              />
              <ProfileViewSection
                profileImage={userThumbnail ? { uri: userThumbnail } : images.profilePlaceHolder}
                userName={fullName}
              />
              <ScrollView style={{ marginHorizontal: 15 }} showsVerticalScrollIndicator={false}>
                <RefereesInItem
                  title={strings.infoTitle}
                  onItemPress={() => {
                    infoModal()
                  }}
                >
                  <NewsFeedDescription
                    character={140}
                    containerStyle={{ marginHorizontal: 0 }}
                    descriptionTxt={{
                      padding: 0, marginTop: 3, color: colors.whiteColor, fontFamily: fonts.RRegular,
                    }}
                    descText={{ fontSize: 16, color: colors.whiteGradientColor, fontFamily: fonts.RLight }}
                    descriptions={bioDescription}
                  />
                  <Text style={styles.signUpTextStyle}>{strings.signedUpTime}</Text>
                  <FlatList
                    data={teamData}
                    bounces={false}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{
                      width: 1, backgroundColor: colors.whiteColor, marginVertical: 10, marginHorizontal: 15,
                    }} />}
                    renderItem={({ item: attachItem }) => <TeamViewInfoSection
                    teamImage={attachItem.thumbnail ? { uri: attachItem.thumbnail } : images.team_ph}
                    teamTitle={attachItem.group_name}
                    teamIcon={images.myTeams}
                    teamCityName={`${attachItem.city}, ${attachItem.country}`}
                    />}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </RefereesInItem>

                <RefereesInItem
                  title={strings.recentMatchTitle}
                  onItemPress={() => {
                    setScroboardTabNumber(0);
                    scoreboardModal();
                  }}
                >
                  <RecentMatchView
                    data={recentMatchData.length > 0 ? recentMatchData[0] : null}
                  />
                </RefereesInItem>

                <RefereesInItem
                  title={strings.upcomingMatchTitle}
                  onItemPress={() => {
                    setScroboardTabNumber(1);
                    scoreboardModal();
                  }}
                >
                  <UpcomingMatchView
                    data={upcomingMatchData.length > 0 ? upcomingMatchData[0] : null}
                  />
                </RefereesInItem>

                <RefereesInItem
                  title={strings.statsTitle}
                  containerStyle={{ marginBottom: 15 }}
                  onItemPress={() => {
                    statsModal();
                  }}
                >
                  <StatsView
                    TotalGameText={'Total Games'}
                    totalGameCounter={gameStatsData ? gameStatsData.total_games : ''}
                    winTitle={'Win'}
                    winPercentage={gameStatsData ? gameStatsData.winner : ''}
                    winProgress={gameStatsData.winner !== 0 ? (1 * gameStatsData.winner) / gameStatsData.total_games : 0}
                    winProgressColor={colors.orangeColor}
                    winPercentageTextStyle={{ color: colors.orangeColor }}
                    drawTitle={'Draw'}
                    drawPercentage={gameStatsData ? gameStatsData.draw : ''}
                    drawProgress={gameStatsData.draw !== 0 ? (1 * gameStatsData.draw) / gameStatsData.total_games : 0}
                    drawProgressColor={colors.greeColor}
                    drawPercentageTextStyle={{ color: colors.greeColor }}
                    lossTitle={'Loss'}
                    lossPercentage={gameStatsData ? gameStatsData.looser : ''}
                    lossProgress={gameStatsData.looser !== 0 ? (1 * gameStatsData.looser) / gameStatsData.total_games : 0}
                    lossProgressColor={colors.blueColor}
                    lossPercentageTextStyle={{ color: colors.blueColor }}
                    sections={[
                      {
                        percentage: gameStatsData.winner !== 0 ? (100 * gameStatsData.winner) / gameStatsData.total_games : 0,
                        color: colors.orangeColor,
                      },
                      {
                        percentage: gameStatsData.draw !== 0 ? (100 * gameStatsData.draw) / gameStatsData.total_games : 0,
                        color: colors.greeColor,
                      },
                      {
                        percentage: gameStatsData.looser !== 0 ? (100 * gameStatsData.looser) / gameStatsData.total_games : 0,
                        color: colors.blueColor,
                      },
                    ]}
                    progressBarWinPercentage={gameStatsData.winner !== 0 ? (1 * gameStatsData.winner) / gameStatsData.total_games : 0}
                  />
                </RefereesInItem>
              </ScrollView>
            </SafeAreaView>
          </View>

          <Modal
            isVisible={infoModalVisible}
            backdropColor="black"
            style={{
              margin: 0, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)',
            }}
            hasBackdrop
            onBackdropPress={() => setInfoModalVisible(false)}
            backdropOpacity={0}
          >
            <SafeAreaView style={[styles.modalContainerViewStyle, { backgroundColor: colors.whiteColor }]}>
              <LinearGradient
                  colors={[colors.orangeColor, colors.yellowColor]}
                  end={{ x: 0.0, y: 0.25 }}
                  start={{ x: 1, y: 0.5 }}
                  style={styles.gradiantHeaderViewStyle}>
              </LinearGradient>
              <Header
                mainContainerStyle={styles.headerMainContainerStyle}
                leftComponent={
                  <TouchableOpacity onPress={() => setInfoModalVisible(false)}>
                    <Image source={images.backArrow} style={styles.cancelImageStyle} resizeMode={'contain'} />
                  </TouchableOpacity>
                }
                centerComponent={
                  <View style={styles.headerCenterViewStyle}>
                    <Image source={images.soccerImage} style={styles.soccerImageStyle} resizeMode={'contain'} />
                    <Text style={styles.playInTextStyle}>{'Info'}</Text>
                  </View>
                }
                rightComponent={
                  <TouchableOpacity onPress={() => setInfoModalVisible(false)}>
                    <Image source={images.cancelWhite} style={styles.cancelImageStyle} resizeMode={'contain'} />
                  </TouchableOpacity>
                }
              />
              <PersonalSportsInfo
                data={currentUserData}
                navigation={navigation}
                onItemPress={() => {
                  setInfoModalVisible(false);
                  setPlaysInModalVisible(false);
                  navigation.navigate('SearchLocationScreen', {
                    comeFrom: 'HomeScreen',
                  })
                }}
                onSavePress={(params) => {
                  patchRegisterRefereeDetails(params, authContext).then((res) => {
                    const changedata = currentUserData;
                    changedata.registered_sports = res.payload.registered_sports;
                    changedata.gender = res.payload.gender;
                    changedata.birthday = res.payload.birthday;
                    changedata.height = res.payload.height;
                    changedata.weight = res.payload.weight;
                    setCurrentUserData(changedata);
                  }).catch((error) => {
                    console.log('error coming', error)
                    Alert.alert(strings.alertmessagetitle, error.message)
                  })
                }}
                sportName={sportName}
                searchLocation={searchLocation}
                locationDetail={locationDetail}
              />
            </SafeAreaView>
          </Modal>

          <Modal
            isVisible={scoreboardModalVisible}
            backdropColor="black"
            style={{
              margin: 0, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)',
            }}
            hasBackdrop
            onBackdropPress={() => setScoreboardModalVisible(false)}
            backdropOpacity={0}
          >
            <SafeAreaView style={[styles.modalContainerViewStyle, { backgroundColor: colors.whiteColor }]}>
              <View>
                <LinearGradient
                  colors={[colors.orangeColor, colors.yellowColor]}
                  end={{ x: 0.0, y: 0.25 }}
                  start={{ x: 1, y: 0.5 }}
                  style={styles.gradiantHeaderViewStyle}>
                </LinearGradient>
                <Header
                  mainContainerStyle={styles.headerMainContainerStyle}
                  leftComponent={
                    <TouchableOpacity onPress={() => setScoreboardModalVisible(false)}>
                      <Image source={images.backArrow} style={styles.cancelImageStyle} resizeMode={'contain'} />
                    </TouchableOpacity>
                  }
                  centerComponent={
                    <View style={styles.headerCenterViewStyle}>
                      <Image source={images.soccerImage} style={styles.soccerImageStyle} resizeMode={'contain'} />
                      <Text style={styles.playInTextStyle}>{'Scoreboard'}</Text>
                    </View>
                  }
                  rightComponent={
                    <TouchableOpacity onPress={() => setScoreboardModalVisible(false)}>
                      <Image source={images.cancelWhite} style={styles.cancelImageStyle} resizeMode={'contain'} />
                    </TouchableOpacity>
                  }
                />
              </View>
              <ScheduleTabView
                firstTabTitle={'Completed'}
                secondTabTitle={'Upcoming'}
                indexCounter={scoreboardTabNumber}
                eventPrivacyContianer={{ width: wp('70%') }}
                onFirstTabPress={() => setScroboardTabNumber(0)}
                onSecondTabPress={() => setScroboardTabNumber(1)}
              />
              {scoreboardTabNumber === 0 && <ScoreboardSportsScreen
                sportsData={recentMatchData}
              />}
              {scoreboardTabNumber === 1 && <UpcomingMatchScreen
                sportsData={upcomingMatchData}
              />}
            </SafeAreaView>
          </Modal>

          <Modal
            isVisible={statsModalVisible}
            backdropColor="black"
            style={{
              margin: 0, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)',
            }}
            hasBackdrop
            onBackdropPress={() => setStatsModalVisible(false)}
            backdropOpacity={0}
          >
            <SafeAreaView style={[styles.modalContainerViewStyle, { backgroundColor: colors.whiteColor }]}>
              <LinearGradient
                colors={[colors.orangeColor, colors.yellowColor]}
                end={{ x: 0.0, y: 0.25 }}
                start={{ x: 1, y: 0.5 }}
                style={styles.gradiantHeaderViewStyle}>
              </LinearGradient>
              <Header
                mainContainerStyle={styles.headerMainContainerStyle}
                leftComponent={
                  <TouchableOpacity onPress={() => setStatsModalVisible(false)}>
                    <Image source={images.backArrow} style={styles.cancelImageStyle} resizeMode={'contain'} />
                  </TouchableOpacity>
                }
                centerComponent={
                  <View style={styles.headerCenterViewStyle}>
                    <Image source={images.soccerImage} style={styles.soccerImageStyle} resizeMode={'contain'} />
                    <Text style={styles.playInTextStyle}>{'Stats'}</Text>
                  </View>
                }
                rightComponent={
                  <TouchableOpacity onPress={() => setStatsModalVisible(false)}>
                    <Image source={images.cancelWhite} style={styles.cancelImageStyle} resizeMode={'contain'} />
                  </TouchableOpacity>
                }
              />
              <StatsScreen
                gameChartData={gamesChartData.length > 0 ? gamesChartData : []}
                gameStatsData={gameStatsData}
                isLoading={loading}
                onDonePress={(selectValue) => {
                  const entity = authContext.entity
                  setloading(true);
                  const date = new Date();
                  if (selectValue === 'Past 3 Months') {
                    date.setMonth(date.getMonth() - 3);
                  }
                  if (selectValue === 'Past 6 Months') {
                    date.setMonth(date.getMonth() - 6);
                  }
                  if (selectValue === 'Past 9 Months') {
                    date.setMonth(date.getMonth() - 9);
                  }
                  if (selectValue === 'Past 12 Months') {
                    date.setMonth(date.getMonth() - 12);
                  }
                  const paramData = {
                    sport: sportName,
                    fromDate: date / 1000,
                  };
                  getGameStatsData(entity.uid || entity.auth.user_id, paramData, authContext).then((response) => {
                    setloading(false);
                    if (response.payload && response.payload.length > 0) {
                      setGameStatsData(response.payload[0].stats)
                    }
                  })
                    .catch((error) => {
                      setloading(false);
                      Alert.alert(strings.alertmessagetitle, error.message)
                    });
                }}
              />
            </SafeAreaView>
          </Modal>
        </Modal>

        <Modal
          isVisible={refereesInModalVisible}
          backdropColor="black"
          style={{
            margin: 0, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          hasBackdrop
          onBackdropPress={() => setRefereesInModalVisible(false)}
          backdropOpacity={0}
        >
          <View style={styles.modalContainerViewStyle}>
            <Image style={[styles.background, { transform: [{ rotate: '180deg' }], borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }]} source={images.orangeLayer} />
            <SafeAreaView style={{ flex: 1 }}>
              <Header
                safeAreaStyle={{ marginTop: 10 }}
                mainContainerStyle={styles.headerMainContainerStyle}
                centerComponent={
                  <View style={styles.headerCenterViewStyle}>
                    <Image source={images.refereesInImage} style={styles.refereesImageStyle} resizeMode={'contain'} />
                    <Text style={styles.playInTextStyle}>{'Referees in Soccer'}</Text>
                  </View>
                }
                rightComponent={
                  <TouchableOpacity onPress={() => setRefereesInModalVisible(false)}>
                    <Image source={images.cancelWhite} style={styles.cancelImageStyle} resizeMode={'contain'} />
                  </TouchableOpacity>
                }
              />
              <RefereesProfileSection
                profileImage={images.profilePlaceHolder}
                userName={'Christiano Ronaldo'}
              />
              <ScrollView style={{ marginHorizontal: 15 }} showsVerticalScrollIndicator={false}>
                <RefereesInItem
                  title={strings.infoTitle}
                  onItemPress={() => {
                    refereeInfoModal();
                  }}
                >
                  <NewsFeedDescription
                    character={140}
                    containerStyle={{ marginHorizontal: 0 }}
                    descriptionTxt={{
                      padding: 0, marginTop: 3, color: colors.whiteColor, fontFamily: fonts.RRegular,
                    }}
                    descText={{ fontSize: 16, color: colors.whiteGradientColor, fontFamily: fonts.RLight }}
                    descriptions={strings.aboutValue}
                  />
                  <Text style={styles.signUpTextStyle}>{strings.signedUpTime}</Text>
                  <View style={styles.certificatesViewStyle}>
                    <Text style={[styles.playInTextStyle, { fontFamily: fonts.RMedium, marginBottom: 5 }]}>{'Certificates'}</Text>
                    <FlatList
                      data={certificatesData}
                      bounces={false}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      ItemSeparatorComponent={() => <View style={{
                        marginHorizontal: 5,
                      }} />}
                      renderItem={({ item: certItem }) => <CertificatesItemView
                        certificateImage={certItem.image}
                        certificateName={certItem.title}
                      />}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                  <LanguageViewInInfo
                    title={'Languages'}
                    languageName={'Korean, English, Deutsch, Italia'}
                  />
                </RefereesInItem>

                <RefereesInItem
                  title={strings.refereeRecentMatchTitle}
                  onItemPress={() => {
                    refereeMatchModal();
                  }}
                >
                  <RecentMatchView
                    data={recentMatchData.length > 0 ? recentMatchData[0] : null}
                  />
                </RefereesInItem>

                <RefereesInItem
                  title={strings.reviewsTitle}
                  onItemPress={() => {
                    reviewsModal();
                  }}
                >
                  <View style={styles.backgroundView}>
                    <FlatList
                      data={reviewsData}
                      bounces={false}
                      showsHorizontalScrollIndicator={false}
                      ItemSeparatorComponent={() => <View style={{
                        marginVertical: 4,
                      }} />}
                      style={{ marginVertical: 15 }}
                      renderItem={({ item: reviewItem }) => <ReviewRatingView
                        title={reviewItem.title}
                        rating={Number(reviewItem.rating)}
                        ratingCount={reviewItem.rating}
                        rateStarSize={20}
                      />}
                      ListFooterComponent={() => <View style={{ marginTop: 4 }}>
                        <View style={styles.lastReviewItemSeprator} />
                        <ReviewRatingView
                          title={'Punctuality'}
                          rating={Number(4.0)}
                          ratingCount={'4.0'}
                          rateStarSize={20}
                        />
                      </View>}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                </RefereesInItem>
              </ScrollView>
            </SafeAreaView>
          </View>

          <Modal
            isVisible={refereeInfoModalVisible}
            backdropColor="black"
            style={{
              margin: 0, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)',
            }}
            hasBackdrop
            onBackdropPress={() => setRefereeInfoModalVisible(false)}
            backdropOpacity={0}
          >
            <SafeAreaView style={[styles.modalContainerViewStyle, { backgroundColor: colors.whiteColor }]}>
              <LinearGradient
                  colors={[colors.orangeColor, colors.yellowColor]}
                  end={{ x: 0.0, y: 0.25 }}
                  start={{ x: 1, y: 0.5 }}
                  style={styles.gradiantHeaderViewStyle}>
              </LinearGradient>
              <Header
                mainContainerStyle={styles.headerMainContainerStyle}
                leftComponent={
                  <TouchableOpacity onPress={() => setRefereeInfoModalVisible(false)}>
                    <Image source={images.backArrow} style={styles.cancelImageStyle} resizeMode={'contain'} />
                  </TouchableOpacity>
                }
                centerComponent={
                  <View style={styles.headerCenterViewStyle}>
                    <Image source={images.refereesInImage} style={styles.refereesImageStyle} resizeMode={'contain'} />
                    <Text style={styles.playInTextStyle}>{'Info'}</Text>
                  </View>
                }
                rightComponent={
                  <TouchableOpacity onPress={() => setRefereeInfoModalVisible(false)}>
                    <Image source={images.cancelWhite} style={styles.cancelImageStyle} resizeMode={'contain'} />
                  </TouchableOpacity>
                }
              />
              <RefereeInfoSection
                data={currentUserData}
                searchLocation={searchLocation}
              />
            </SafeAreaView>
          </Modal>

          <Modal
            isVisible={refereeMatchModalVisible}
            backdropColor="black"
            style={{
              margin: 0, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)',
            }}
            hasBackdrop
            onBackdropPress={() => setRefereeMatchModalVisible(false)}
            backdropOpacity={0}
          >
            <SafeAreaView style={[styles.modalContainerViewStyle, { backgroundColor: colors.whiteColor }]}>
              <View>
                <LinearGradient
                  colors={[colors.orangeColor, colors.yellowColor]}
                  end={{ x: 0.0, y: 0.25 }}
                  start={{ x: 1, y: 0.5 }}
                  style={styles.gradiantHeaderViewStyle}>
                </LinearGradient>
                <Header
                  mainContainerStyle={styles.headerMainContainerStyle}
                  leftComponent={
                    <TouchableOpacity onPress={() => setRefereeMatchModalVisible(false)}>
                      <Image source={images.backArrow} style={styles.cancelImageStyle} resizeMode={'contain'} />
                    </TouchableOpacity>
                  }
                  centerComponent={
                    <View style={styles.headerCenterViewStyle}>
                      <Image source={images.refereesInImage} style={styles.refereesImageStyle} resizeMode={'contain'} />
                      <Text style={styles.playInTextStyle}>{'Scoreboard'}</Text>
                    </View>
                  }
                  rightComponent={
                    <TouchableOpacity onPress={() => setRefereeMatchModalVisible(false)}>
                      <Image source={images.cancelWhite} style={styles.cancelImageStyle} resizeMode={'contain'} />
                    </TouchableOpacity>
                  }
                />
              </View>
              <ScheduleTabView
                firstTabTitle={`Completed (${recentMatchData.length})`}
                secondTabTitle={`Upcoming (${upcomingMatchData.length})`}
                indexCounter={scoreboardTabNumber}
                eventPrivacyContianer={{ width: wp('70%') }}
                onFirstTabPress={() => setScroboardTabNumber(0)}
                onSecondTabPress={() => setScroboardTabNumber(1)}
              />
              {scoreboardTabNumber === 0 && <ScoreboardSportsScreen
                sportsData={recentMatchData}
                showEventNumbers={true}
                showAssistReferee={true}
              />}
              {scoreboardTabNumber === 1 && <UpcomingMatchScreen
                sportsData={upcomingMatchData}
                showEventNumbers={true}
              />}
            </SafeAreaView>
          </Modal>

          <Modal
            isVisible={reviewsModalVisible}
            backdropColor="black"
            style={{
              margin: 0, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)',
            }}
            hasBackdrop
            onBackdropPress={() => setReviewsModalVisible(false)}
            backdropOpacity={0}
          >
            <SafeAreaView style={[styles.modalContainerViewStyle, { backgroundColor: colors.whiteColor }]}>
              <View>
                <LinearGradient
                  colors={[colors.orangeColor, colors.yellowColor]}
                  end={{ x: 0.0, y: 0.25 }}
                  start={{ x: 1, y: 0.5 }}
                  style={styles.gradiantHeaderViewStyle}>
                </LinearGradient>
                <Header
                  mainContainerStyle={styles.headerMainContainerStyle}
                  leftComponent={
                    <TouchableOpacity onPress={() => setReviewsModalVisible(false)}>
                      <Image source={images.backArrow} style={styles.cancelImageStyle} resizeMode={'contain'} />
                    </TouchableOpacity>
                  }
                  centerComponent={
                    <View style={styles.headerCenterViewStyle}>
                      <Image source={images.refereesInImage} style={styles.refereesImageStyle} resizeMode={'contain'} />
                      <Text style={styles.playInTextStyle}>{'Reviews'}</Text>
                    </View>
                  }
                  rightComponent={
                    <TouchableOpacity onPress={() => setReviewsModalVisible(false)}>
                      <Image source={images.cancelWhite} style={styles.cancelImageStyle} resizeMode={'contain'} />
                    </TouchableOpacity>
                  }
                />
                <ReviewSection
                  reviewsData={reviewsData}
                />
              </View>
            </SafeAreaView>
          </Modal>
        </Modal>
      </ParallaxScrollView>
      {!createEventModal && currentTab === 3 && <CreateEventButton
        source={images.plus}
        onPress={() => setCreateEventModal(true) }
      />}
      {progressBar && <ImageProgress
        numberOfUploaded={doneUploadCount}
        totalUpload={totalUploadCount}
        onCancelPress={() => {
          console.log('Cancel Pressed!');
        }}
        postDataItem={postData ? postData[0] : {}}
      />}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  userTextStyle: {
    fontSize: 20,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
    color: colors.whiteColor,
  },
  sepratorStyle: {
    height: 7,
    width: ('100%'),
    backgroundColor: colors.graySeparater,
  },
  sepratorLineStyle: {
    width: wp('100%'),
    height: 2,
    backgroundColor: colors.disableColor,
    marginVertical: 1,
  },
  bgImageStyle: {
    width: wp(100),
    height: hp(30),
    backgroundColor: colors.grayBackgroundColor,
  },
  stickyImageStyle: {
    width: wp('100%'),
    height: 90,
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
    borderRadius: 4,
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
    backgroundColor: colors.themeColor,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerMainContainerStyle: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 15,
  },
  cancelImageStyle: {
    height: 17,
    width: 17,
    tintColor: colors.whiteColor,
  },
  soccerImageStyle: {
    height: 20,
    width: 20,
    marginHorizontal: 10,
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
    color: colors.whiteColor,
  },
  signUpTextStyle: {
    fontSize: 12,
    fontFamily: fonts.RLight,
    color: colors.whiteColor,
  },
  background: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
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
  certificatesViewStyle: {
    marginLeft: 10,
    marginTop: 10,
  },
  backgroundView: {
    backgroundColor: colors.matchViewColor,
    borderRadius: 5,
    elevation: 5,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginVertical: 10,
  },
  lastReviewItemSeprator: {
    height: 1,
    marginHorizontal: 15,
    marginVertical: 5,
    backgroundColor: colors.themeColor,
  },
});
