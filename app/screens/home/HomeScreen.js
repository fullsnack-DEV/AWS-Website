import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  StyleSheet, Text, TouchableOpacity, View, Alert, FlatList, Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
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

export default function HomeScreen({ navigation, route }) {
  const [isUserHome, setUserHome] = useState(false)
  const [isClubHome, setClubHome] = useState(false)
  const [isTeamHome, setTeamHome] = useState(false)
  const [loggedInEntity, setLoggedInEntity] = useState({})
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
  const [progressBar, setProgressBar] = useState(false);

  const getData = async (uid, role) => {
    const userHome = role === 'user'
    const clubHome = role === 'club'
    const teamHome = role === 'team'

    const user_ID = uid;
    if (userHome) {
      const promises = [getUserDetails(uid), getJoinedGroups(uid)]
      Promise.all(promises).then(([res1, res2]) => {
        const userDetails = res1.payload;
        if (res2) {
          userDetails.joined_teams = res2.payload.teams;
          userDetails.joined_clubs = res2.payload.clubs;
        }
        setCurrentUserData(userDetails);
        setClubHome(clubHome)
        setTeamHome(teamHome)
        setUserHome(userHome)
      });
    } else {
      const promises = [getGroupDetails(uid), getGroupMembers(uid)]
      if (clubHome) {
        promises.push(getTeamsOfClub(uid))
      }
      Promise.all(promises).then(([res1, res2, res3]) => {
        const groupDetails = res1.payload;
        groupDetails.joined_members = res2.payload;
        if (res3) {
          groupDetails.joined_teams = res3.payload;
        }
        setCurrentUserData(groupDetails);
        setClubHome(clubHome)
        setTeamHome(teamHome)
        setUserHome(userHome)
      });
    }
    const params = {
      uid: user_ID,
    };
    getUserPosts(params).then((response) => {
      setPostData(response.payload.results);
      setloading(false);
    });
    getGallery(uid).then((res) => {
      setGalleryData(res.payload);
    });
    setUserID(uid);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const entity = await Utility.getStorage('loggedInEntity');
      setLoggedInEntity(entity)
      console.log('entity', entity)

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
              console.log('Gallery Response :::---', res);
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
    setloading(true);
    const params = {
      entity_type: 'player',
    };
    followUser(params, userID).then(() => {
      currentUserData.is_following = true;
      setCurrentUserData(currentUserData);
      setloading(false);
    }).catch((error) => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.messages);
      }, 0.3)
      setloading(false);
    });
  };

  const callUnfollowUser = async () => {
    setloading(true);
    const params = {
      entity_type: 'player',
    };
    unfollowUser(params, userID).then(() => {
      currentUserData.is_following = false;
      setCurrentUserData(currentUserData);
      setloading(false);
    }).catch((error) => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.messages);
      }, 0.3)
      setloading(false);
    });
  };

  const clubInviteUser = async () => {
    setloading(true);
    const params = {
      entity_type: loggedInEntity.role,
      uid: loggedInEntity.uid,
    };
    inviteUser(params, userID).then(() => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, `“${currentUserData.first_name} ${currentUserData.last_name}“ is invited successfully`);
      }, 0.3)
      setloading(false);
    }).catch((error) => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.messages);
      }, 0.3)
      setloading(false);
    });
  };

  const callFollowGroup = async () => {
    setloading(true);
    const params = {
      entity_type: currentUserData.entity_type,
    };
    followGroup(params, userID).then(() => {
      currentUserData.is_following = true;
      currentUserData.follower_count += 1;
      setCurrentUserData(currentUserData);
      setloading(false);
    }).catch((error) => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.messages);
      }, 0.3)
      setloading(false);
    });
  };

  const callUnfollowGroup = async () => {
    setloading(true);
    const params = {
      entity_type: currentUserData.entity_type,
    };
    unfollowGroup(params, userID).then(() => {
      currentUserData.is_following = false;
      if (currentUserData.follower_count > 0) {
        currentUserData.follower_count -= 1
      }
      setCurrentUserData(currentUserData);
      setloading(false);
    }).catch((error) => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.messages);
      }, 0.3)
      setloading(false);
    });
  };

  const userJoinGroup = async () => {
    setloading(true);
    const params = {};
    joinTeam(params, userID).then(() => {
      currentUserData.is_joined = true;
      currentUserData.member_count += 1
      if (currentUserData.is_following === false) {
        callFollowGroup();
      } else {
        setCurrentUserData(currentUserData);
        setloading(false);
      }
    }).catch((error) => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.messages);
      }, 0.3)
      setloading(false);
    });
  };

  const userLeaveGroup = async () => {
    setloading(true);
    const params = {};
    leaveTeam(params, userID).then(() => {
      currentUserData.is_joined = false;
      if (currentUserData.member_count > 0) {
        currentUserData.member_count -= 1
      }
      setCurrentUserData(currentUserData);
      setloading(false);
    }).catch((error) => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.messages);
      }, 0.3)
      setloading(false);
    });
  };

  const clubInviteTeam = async () => {
    setloading(true);
    const params = [userID];
    inviteTeam(params, loggedInEntity.uid).then(() => {
      setloading(false);
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, `“${currentUserData.group_name}“ ${strings.isinvitedsuccesfully}`);
      }, 0.3)
    }).catch((error) => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.messages);
      }, 0.3)
      setloading(false);
    });
  };

  const clubJoinTeam = async () => {
    setloading(true);
    const params = {};
    joinTeam(params, userID).then(() => {
      loggedInEntity.obj.parent_group_id = currentUserData.group_id;
      Utility.setStorage('loggedInEntity', loggedInEntity);
      setLoggedInEntity(loggedInEntity);
      setloading(false);
    }).catch((error) => {
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, error.messages);
      }, 0.3)
      setloading(false);
    });
  };

  const clubLeaveTeam = async () => {
    setloading(true);
    const params = {};
    leaveTeam(params, userID).then(() => {
      delete loggedInEntity.obj.parent_group_id;
      Utility.setStorage('loggedInEntity', loggedInEntity);
      setLoggedInEntity(loggedInEntity);
      setloading(false);
    }).catch((error) => {
      setloading(false);
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
      case 'edit':
        // edit code here
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
      case 'edit':
        // edit code here
        break;
      default:
    }
  }

  const onChallengePress = () => {
    if (loggedInEntity.obj.sport === currentUserData.sport) {
      navigation.navigate('CreateChallengeForm1', { groupObj: currentUserData })
    } else {
      Alert.alert('Sport must be same for both teams')
    }
  }

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
        // onChangeHeaderVisibility={(val) => {
        // }}
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
});
