import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  StyleSheet, Text, TouchableOpacity, View, Alert, FlatList, Platform, ScrollView, SafeAreaView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';
import BackgroundProfile from '../../components/Home/BackgroundProfile';
import Header from '../../components/Home/Header';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import * as Utility from '../../utils/index';
import TCScrollableProfileTabs from '../../components/TCScrollableProfileTabs';
import WritePost from '../../components/newsFeed/WritePost';
import {
  getUserDetails, getGallery, followUser, unfollowUser, inviteUser,
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

const team_Data_Info = [
  {
    id: 0,
    teamImage: images.commentReport,
    teamTitle: strings.infoTeamTitle,
    teamIcon: images.myTeams,
    teamCity: strings.infoTeamCity,
  },
  {
    id: 1,
    teamImage: images.commentReport,
    teamTitle: strings.infoTeamTitle,
    teamIcon: images.myTeams,
    teamCity: strings.infoTeamCity,
  },
];

const recent_Match = [
  {
    id: 0,
    startDate: '2020-11-26 07:00:00',
    endDate: '2020-11-26 09:10:00',
    title: 'Soccer',
    description: 'Champions League/ 2020 Summer Season',
    location: 'BC Stadium',
    team1Image: images.commentReport,
    team1Title: 'Vancouver Whitecaps',
    team1Point: 3,
    team2Image: images.usaImage,
    team2Title: 'Newyork City FC',
    team2Point: 1,
    eventColor: colors.yellowColor,
  },
  {
    id: 1,
    startDate: '2020-11-25 07:00:00',
    endDate: '2020-11-25 09:10:00',
    title: 'Soccer',
    description: 'Champions League/ 2020 Summer Season',
    location: 'BC Stadium',
    team1Image: images.commentReport,
    team1Title: 'Vancouver Whitecaps',
    team1Point: 3,
    team2Image: images.usaImage,
    team2Title: 'Newyork City FC',
    team2Point: 1,
    eventColor: colors.yellowColor,
  },
  {
    id: 2,
    startDate: '2020-11-24 07:00:00',
    endDate: '2020-11-24 09:10:00',
    title: 'Soccer',
    description: 'Champions League/ 2020 Summer Season',
    location: 'BC Stadium',
    team1Image: images.commentReport,
    team1Title: 'Vancouver Whitecaps',
    team1Point: 3,
    team2Image: images.usaImage,
    team2Title: 'Newyork City FC',
    team2Point: 1,
    eventColor: colors.yellowColor,
  },
  {
    id: 3,
    startDate: '2020-11-24 07:00:00',
    endDate: '2020-11-24 09:10:00',
    title: 'Soccer',
    description: 'Champions League/ 2020 Summer Season',
    location: 'BC Stadium',
    team1Image: images.commentReport,
    team1Title: 'Vancouver Whitecaps',
    team1Point: 3,
    team2Image: images.usaImage,
    team2Title: 'Newyork City FC',
    team2Point: 1,
    eventColor: colors.yellowColor,
  },
];

const upcoming_Match = [
  {
    id: 0,
    startDate: '2020-11-26 07:00:00',
    endDate: '2020-11-26 09:10:00',
    title: 'Soccer',
    description: 'Champions League/ 2020 Summer Season',
    location: 'BC Stadium',
    team1Image: images.commentReport,
    team1Title: 'Vancouver Whitecaps',
    team1Point: 3,
    team2Image: images.usaImage,
    team2Title: 'Newyork City FC',
    team2Point: 1,
    eventColor: colors.yellowColor,
  },
  {
    id: 1,
    startDate: '2020-11-27 07:00:00',
    endDate: '2020-11-27 09:10:00',
    title: 'Soccer',
    description: 'Champions League/ 2020 Summer Season',
    location: 'BC Stadium',
    team1Image: images.commentReport,
    team1Title: 'Vancouver Whitecaps',
    team1Point: 3,
    team2Image: images.usaImage,
    team2Title: 'Newyork City FC',
    team2Point: 1,
    eventColor: colors.yellowColor,
  },
  {
    id: 2,
    startDate: '2020-11-28 07:00:00',
    endDate: '2020-11-28 09:10:00',
    title: 'Soccer',
    description: 'Champions League/ 2020 Summer Season',
    location: 'BC Stadium',
    team1Image: images.commentReport,
    team1Title: 'Vancouver Whitecaps',
    team1Point: 3,
    team2Image: images.usaImage,
    team2Title: 'Newyork City FC',
    team2Point: 1,
    eventColor: colors.yellowColor,
  },
  {
    id: 3,
    startDate: '2020-11-28 07:00:00',
    endDate: '2020-11-28 09:10:00',
    title: 'Soccer',
    description: 'Champions League/ 2020 Summer Season',
    location: 'BC Stadium',
    team1Image: images.commentReport,
    team1Title: 'Vancouver Whitecaps',
    team1Point: 3,
    team2Image: images.usaImage,
    team2Title: 'Newyork City FC',
    team2Point: 1,
    eventColor: colors.yellowColor,
  },
];

export default function HomeScreen({ navigation, route }) {
  const [isUserHome, setIsUserHome] = useState(false)
  const [isClubHome, setIsClubHome] = useState(false)
  const [isTeamHome, setIsTeamHome] = useState(false)
  const [refereesInModalVisible, setRefereesInModalVisible] = useState(false)
  const [infoModalVisible, setInfoModalVisible] = useState(false)
  const [scoreboardModalVisible, setScoreboardModalVisible] = useState(false)
  const [statsModalVisible, setStatsModalVisible] = useState(false)
  const [loggedInEntity, setLoggedInEntity] = useState({})
  const [isAdmin, setIsAdmin] = useState(false)
  const [isRender, setIsRender] = useState(false)
  const [isRender2, setIsRender2] = useState(false)
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
  const [teamDataInfo] = useState(team_Data_Info);
  const [recentMatchData] = useState(recent_Match);
  const [upcomingMatchData] = useState(upcoming_Match);

  const getData = async (uid, role) => {
    const userHome = role === 'user'
    const clubHome = role === 'club'
    const teamHome = role === 'team'

    const user_ID = uid;
    const params = {
      uid: user_ID,
    };
    setloading(true);
    if (userHome) {
      const promises = [getUserDetails(uid),
        getJoinedGroups(uid), getUserPosts(params),
        getGallery(uid)]
      Promise.all(promises).then(([res1, res2, res3, res4]) => {
        const userDetails = res1.payload;
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
        setCurrentUserData(userDetails);
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
    } else {
      const promises = [getGroupDetails(uid),
        getGroupMembers(uid), getUserPosts(params),
        getGallery(uid)]
      if (clubHome) {
        promises.push(getTeamsOfClub(uid))
      }
      Promise.all(promises).then(([res1, res2, res3, res4, res5]) => {
        const groupDetails = res1.payload;
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
      const entity = await Utility.getStorage('loggedInEntity');
      setLoggedInEntity(entity)
      let uid = entity.uid
      let role = entity.role

      if (route.params && route.params.uid && route.params.role) {
        uid = route.params.uid;
        role = route.params.role;
        if (entity.uid === uid) {
          setIsAdmin(true)
        }
      } else {
        setIsAdmin(true)
      }

      getData(uid, role).catch((error) => {
        console.log('error', error)
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.messages);
        }, 0.3)
        setloading(false);
      });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const progressStatus = (completed, total) => {
    setDoneUploadCount(completed < total ? (completed + 1) : total)
  }

  const callthis = (data, postDesc) => {
    if (data) {
      setTotalUploadCount(data.length || 1);
      setProgressBar(true);
      const imageArray = data.map((dataItem) => (dataItem))
      uploadImages(imageArray, progressStatus).then((responses) => {
        const attachments = responses.map((item) => ({
          type: 'image',
          url: item.fullImage,
          thumbnail: item.thumbnail,
        }))
        const dataParams = {
          text: postDesc && postDesc,
          attachments,
        };
        createPost(dataParams)
          .then(() => getNewsFeed())
          .then((response) => {
            setPostData(response.payload.results)
            setProgressBar(false);
            getGallery(userID).then((res) => {
              setGalleryData(res.payload);
            });
          })
          .catch((error) => {
            setloading(false)
            Alert.alert(error)
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
  if (currentUserData && currentUserData.full_name === undefined) {
    fullName = currentUserData.group_name;
  }
  let bgImage = '';
  if (currentUserData && currentUserData.background_full_image) {
    bgImage = currentUserData.background_full_image;
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
    setCurrentUserData(currentUserData);
    setIsRender(!isRender)

    const params = {
      entity_type: 'player',
    };
    followUser(params, userID).then(() => {
      console.log('follow user')
    }).catch((error) => {
      currentUserData.is_following = false;
      currentUserData.follower_count -= 1;
      setCurrentUserData(currentUserData);
      setIsRender2(!isRender2)
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.messages);
      }, 0.3)
    });
  };

  const callUnfollowUser = async () => {
    currentUserData.is_following = false;
    if (currentUserData.follower_count > 0) {
      currentUserData.follower_count -= 1
    }
    setCurrentUserData(currentUserData);
    setIsRender(!isRender)

    const params = {
      entity_type: 'player',
    };
    unfollowUser(params, userID).then(() => {
      console.log('unfollow user')
    }).catch((error) => {
      currentUserData.is_following = true;
      currentUserData.follower_count += 1
      setCurrentUserData(currentUserData);
      setIsRender2(!isRender2)
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.messages);
      }, 0.3)
    });
  };

  const clubInviteUser = async () => {
    const params = {
      entity_type: loggedInEntity.role,
      uid: loggedInEntity.uid,
    };
    inviteUser(params, userID).then(() => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, `“${currentUserData.first_name} ${currentUserData.last_name}“ is invited successfully`);
      }, 0.3)
    }).catch((error) => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.messages);
      }, 0.3)
    });
  };

  const callFollowGroup = async (silentlyCall = false) => {
    currentUserData.is_following = true;
    currentUserData.follower_count += 1;
    setCurrentUserData(currentUserData);
    setIsRender(!isRender)

    const params = {
      entity_type: currentUserData.entity_type,
    };
    followGroup(params, userID).then(() => {
      console.log('follow group')
    }).catch((error) => {
      currentUserData.is_following = false;
      currentUserData.follower_count -= 1;
      setCurrentUserData(currentUserData);
      setIsRender2(!isRender2)
      if (silentlyCall === false) {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, error.messages);
        }, 0.3)
      }
    });
  };

  const callUnfollowGroup = async () => {
    currentUserData.is_following = false;
    if (currentUserData.follower_count > 0) {
      currentUserData.follower_count -= 1
    }
    setCurrentUserData(currentUserData);
    setIsRender(!isRender)

    const params = {
      entity_type: currentUserData.entity_type,
    };
    unfollowGroup(params, userID).then(() => {
      console.log('unfollow user')
    }).catch((error) => {
      currentUserData.is_following = true;
      currentUserData.follower_count += 1
      setCurrentUserData(currentUserData);
      setIsRender2(!isRender2)
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.messages);
      }, 0.3)
    });
  };

  const userJoinGroup = async () => {
    currentUserData.is_joined = true;
    currentUserData.member_count += 1
    setCurrentUserData(currentUserData);
    if (currentUserData.is_following === false) {
      callFollowGroup(true);
    }
    setIsRender(!isRender)

    const params = {};
    joinTeam(params, userID).then(() => {
      console.log('user join group')
    }).catch((error) => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.messages);
      }, 0.3)
      currentUserData.is_joined = false;
      currentUserData.member_count -= 1
      setCurrentUserData(currentUserData);
      setIsRender2(!isRender2)
    });
  };

  const userLeaveGroup = async () => {
    currentUserData.is_joined = false;
    if (currentUserData.member_count > 0) {
      currentUserData.member_count -= 1
    }
    setCurrentUserData(currentUserData);
    setIsRender(!isRender)
    const params = {};
    leaveTeam(params, userID).then(() => {
      console.log('user leave group')
    }).catch((error) => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.messages);
      }, 0.3)
      currentUserData.is_joined = true;
      currentUserData.member_count += 1
      setCurrentUserData(currentUserData);
      setIsRender2(!isRender2)
    });
  };

  const clubInviteTeam = async () => {
    const params = [userID];
    inviteTeam(params, loggedInEntity.uid).then(() => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, `“${currentUserData.group_name}“ ${strings.isinvitedsuccesfully}`);
      }, 0.3)
    }).catch((error) => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.messages);
      }, 0.3)
    });
  };

  const clubJoinTeam = async () => {
    loggedInEntity.obj.parent_group_id = currentUserData.group_id;
    Utility.setStorage('loggedInEntity', loggedInEntity);
    if (currentUserData.joined_teams) {
      currentUserData.joined_teams.push(loggedInEntity.obj);
    } else {
      currentUserData.joined_teams = [loggedInEntity.obj]
    }
    setCurrentUserData(currentUserData);
    setLoggedInEntity(loggedInEntity);
    setIsRender(!isRender)
    const params = {};
    joinTeam(params, userID).then(() => {
      console.log('club join')
    }).catch((error) => {
      delete loggedInEntity.obj.parent_group_id;
      Utility.setStorage('loggedInEntity', loggedInEntity);
      setLoggedInEntity(loggedInEntity);
      if (currentUserData.joined_teams) {
        currentUserData.joined_teams = currentUserData.joined_teams.filter((team) => team.group_id !== loggedInEntity.uid)
      }
      setCurrentUserData(currentUserData);
      setIsRender2(!isRender2)
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.messages);
      }, 0.3)
    });
  };

  const clubLeaveTeam = async () => {
    loggedInEntity.obj.parent_group_id = '';
    Utility.setStorage('loggedInEntity', loggedInEntity);
    setLoggedInEntity(loggedInEntity);
    if (currentUserData.joined_teams) {
      currentUserData.joined_teams = currentUserData.joined_teams.filter((team) => team.group_id !== loggedInEntity.uid)
    }
    setCurrentUserData(currentUserData);
    setIsRender(!isRender)
    const params = {};
    leaveTeam(params, userID).then(() => {
      console.log('club leave')
    }).catch((error) => {
      loggedInEntity.obj.parent_group_id = userID;
      Utility.setStorage('loggedInEntity', loggedInEntity);
      setLoggedInEntity(loggedInEntity);
      if (currentUserData.joined_teams) {
        currentUserData.joined_teams.push(loggedInEntity.obj);
      } else {
        currentUserData.joined_teams = [loggedInEntity.obj]
      }
      setCurrentUserData(currentUserData);
      setIsRender2(!isRender2)
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
        if (loggedInEntity.obj.parent_group_id) {
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
          placeholder: loggedInEntity.role === 'team' ? strings.teamNamePlaceholder : strings.clubNameplaceholder,
          nameTitle: loggedInEntity.role === 'team' ? strings.teamNameTitle : strings.clubNameTitle,

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
          placeholder: loggedInEntity.role === 'team' ? strings.teamNamePlaceholder : strings.clubNameplaceholder,
          nameTitle: loggedInEntity.role === 'team' ? strings.teamNameTitle : strings.clubNameTitle,

        }); break;
      default:
    }
  }

  const onChallengePress = async () => {
    if (loggedInEntity.obj.sport === currentUserData.sport) {
      navigation.navigate('CreateChallengeForm1', { groupObj: currentUserData })
    } else {
      Alert.alert('Sport must be same for both teams')
    }
  }

  const refereesInModal = () => {
    setRefereesInModalVisible(!refereesInModalVisible);
  };

  const infoModal = () => {
    setInfoModalVisible(!infoModalVisible);
  };

  const scoreboardModal = () => {
    setScoreboardModalVisible(!scoreboardModalVisible);
  };

  const statsModal = () => {
    setStatsModalVisible(!statsModalVisible);
  };

  return (
    <View style={ styles.mainContainer }>
      {(isTeamHome && loggedInEntity.role === 'team')
      && <View style={ styles.challengeButtonStyle }>
        {loggedInEntity.obj.group_id !== currentUserData.group_id && <TouchableOpacity onPress={ onChallengePress } styles={styles.outerContainerStyle}>
          <LinearGradient
       colors={[colors.greenGradientStart, colors.greenGradientEnd]}
       style={styles.containerStyle}>
            <Text style={ styles.buttonText }>{strings.challenge.toUpperCase()}</Text>
          </LinearGradient>
        </TouchableOpacity>}
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
                    loggedInEntity={loggedInEntity}
                    onRefereesInPress={() => refereesInModal()}
                    onAction={onUserAction}/>}
          {isClubHome && <ClubHomeTopSection clubDetails={currentUserData}
            isAdmin={isAdmin}
            loggedInEntity={loggedInEntity}
            onAction={onClubAction}/>}
          {isTeamHome && <TeamHomeTopSection teamDetails={currentUserData}
            isAdmin={isAdmin}
            loggedInEntity={loggedInEntity}
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
                  />}
                  {(isClubHome || isTeamHome) && <GroupInfo
                    navigation={navigation}
                    groupDetails={currentUserData}
                    isAdmin={isAdmin}
                  />}
                </View>)}
                {tabKey === 2 && (<View style={{ flex: 1 }} />)}
                {tabKey === 3 && (<View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                    <TouchableIcon
                      source={images.searchLocation}
                      onItemPress={() => {}}
                    />
                    <ScheduleTabView
                      firstTabTitle={'Events'}
                      secondTabTitle={'Calender'}
                      indexCounter={scheduleIndexCounter}
                      onFirstTabPress={() => setScheduleIndexCounter(0)}
                      onSecondTabPress={() => setScheduleIndexCounter(1)}
                    />
                    <TouchableIcon
                      source={images.plus}
                      imageStyle={{ tintColor: colors.orangeColor }}
                      onItemPress={() => {}}
                    />
                  </View>
                  {scheduleIndexCounter === 0 && <EventScheduleScreen
                  />}
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
            <Image style={ styles.background } source={ images.bgImage } />
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
                  <TouchableOpacity onPress={() => setRefereesInModalVisible(false)}>
                    <Image source={images.cancelWhite} style={styles.cancelImageStyle} resizeMode={'contain'} />
                  </TouchableOpacity>
                }
              />
              <ProfileViewSection
                profileImage={images.profilePlaceHolder}
                userName={'Christiano Ronaldo'}
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
                    descriptions={strings.aboutValue}
                  />
                  <Text style={styles.signUpTextStyle}>{strings.signedUpTime}</Text>
                  <FlatList
                    data={teamDataInfo}
                    horizontal={true}
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{
                      width: 1, backgroundColor: colors.whiteColor, marginVertical: 10, marginHorizontal: 15,
                    }} />}
                    renderItem={({ item: attachItem }) => <TeamViewInfoSection
                    teamImage={attachItem.teamImage}
                    teamTitle={attachItem.teamTitle}
                    teamIcon={attachItem.teamIcon}
                    teamCityName={attachItem.teamCity}
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
                    date={'Sep 25.'}
                    startTime={'7:00pm - '}
                    endTime={'9:10pm'}
                    cityName={'BC Stadium'}
                    firstTeamImage={images.commentReport}
                    secondTeamImage={images.usaImage}
                    firstTeamName={'Vancouver Whitecaps'}
                    secondTeamName={'Newyork City FC'}
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
                    date={'Sep 26.'}
                    startTime={'7:00pm - '}
                    endTime={'9:10pm'}
                    cityName={'BC Stadium'}
                    firstTeamImage={images.commentReport}
                    secondTeamImage={images.usaImage}
                    firstTeamName={'Vancouver Whitecaps'}
                    secondTeamName={'Newyork City FC'}
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
                    pastTime={'[ For past 12 months ]'}
                    TotalGameText={'Total Games'}
                    totalGameCounter={'140'}
                    winTitle={'Win'}
                    winPercentage={50}
                    winProgress={0.5}
                    winProgressColor={colors.orangeColor}
                    winPercentageTextStyle={{ color: colors.orangeColor }}
                    drawTitle={'Draw'}
                    drawPercentage={40}
                    drawProgress={0.4}
                    drawProgressColor={colors.greeColor}
                    drawPercentageTextStyle={{ color: colors.greeColor }}
                    lossTitle={'Loss'}
                    lossPercentage={10}
                    lossProgress={0.1}
                    lossProgressColor={colors.blueColor}
                    lossPercentageTextStyle={{ color: colors.blueColor }}
                    sections={[
                      {
                        percentage: 50,
                        color: colors.orangeColor,
                      },
                      {
                        percentage: 40,
                        color: colors.greeColor,
                      },
                      {
                        percentage: 10,
                        color: colors.blueColor,
                      },
                    ]}
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
              <Header
                mainContainerStyle={[styles.headerMainContainerStyle, { backgroundColor: colors.orangeColor }]}
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
                <Image style={[styles.background, { borderTopLeftRadius: 10, borderTopRightRadius: 10 }]} source={ images.orangeLayer } />
                <Header
                  mainContainerStyle={[styles.headerMainContainerStyle, { backgroundColor: colors.orangeColor }]}
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
              <Header
                mainContainerStyle={[styles.headerMainContainerStyle, { backgroundColor: colors.orangeColor }]}
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
              <StatsScreen/>
            </SafeAreaView>
          </Modal>
        </Modal>
      </ParallaxScrollView>
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
  },
  outerContainerStyle: {
    shadowColor: colors.greenShadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  containerStyle: {
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
    shadowColor: colors.greenShadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    justifyContent: 'center',
    alignSelf: 'center',
    color: colors.whiteColor,
    fontSize: 17,
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
    marginTop: 5,
  },
  background: {
    height: '100%',
    position: 'absolute',
    resizeMode: 'stretch',
    width: '100%',
  },
});
