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
import BackgroundProfile from '../../components/Home/BackgroundProfile';
import TCGradientButton from '../../components/TCGradientButton';
import Header from '../../components/Home/Header';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import * as Utility from '../../utils/index';
import TCScrollableProfileTabs from '../../components/TCScrollableProfileTabs';
import WritePost from '../../components/newsFeed/WritePost';
import { getUserDetails, getGallery } from '../../api/Users';
import { getUserPosts, createPost, getNewsFeed } from '../../api/NewsFeeds';
import { getGroupDetails, getJoinedGroups } from '../../api/Groups';
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
import ScheduleTabView from '../../components/Home/ScheduleTabView';
import TouchableIcon from '../../components/Home/TouchableIcon';
import EventScheduleScreen from '../account/schedule/EventScheduleScreen';
import TCMessageButton from '../../components/TCMessageButton';

export default function HomeScreen({ navigation, route }) {
  const [postData, setPostData] = useState([]);
  const [galleryData, setGalleryData] = useState([]);
  const [currentUserData, setCurrentUserData] = useState({});
  const [loading, setloading] = useState(true);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [userID, setUserID] = useState('');
  const [indexCounter, setIndexCounter] = useState(0);
  const [scheduleIndexCounter, setScheduleIndexCounter] = useState(0);
  const [currentTab, setCurrentTab] = useState(0);
  const [totalUploadCount, setTotalUploadCount] = useState(0);
  const [doneUploadCount, setDoneUploadCount] = useState(0);
  const [progressBar, setProgressBar] = useState(false);

  const getData = async (uid, isUserHome) => {
    const user_ID = uid;
    if (isUserHome) {
      getUserDetails(uid).then((res) => {
        const userDetails = res.payload;
        setCurrentUserData(res.payload);
        getJoinedGroups(uid).then((response) => {
          if (response) {
            userDetails.joined_teams = response.payload.teams;
            userDetails.joined_clubs = response.payload.clubs;
            setCurrentUserData(userDetails);
          }
        });
      });
    } else {
      getGroupDetails(uid).then((res) => {
        setCurrentUserData(res.payload);
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
      const uid = entity.uid || entity.auth.user_id;
      getData(uid, entity.role === 'user').catch((error) => {
        Alert.alert('', error.messages);
        setloading(false);
      });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const entity = await Utility.getStorage('loggedInEntity');
      setEditProfileVisible(false);
      if (entity.obj.user_id !== undefined) {
        if (entity.obj.user_id === entity.auth.user_id) {
          setEditProfileVisible(true);
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);

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
          .catch((e) => {
            Alert.alert('', e.messages)
          });
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

  return (
    <View style={ styles.mainContainer }>
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
        <TCMessageButton title={'Challenge'} marginHorizontal={20} onPress={() => navigation.navigate('CreateChallengeForm1')}/>
        <View style={{ flex: 1 }}>
          {editProfileVisible && <TCGradientButton
              outerContainerStyle={{ marginVertical: 10, marginTop: 20 }}
              title="Edit Profile" onPress = {() => { navigation.navigate('EditPersonalProfileScreen'); }
              }/>}
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
                  {editProfileVisible && <WritePost
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
                  <UserInfo
                    navigation={navigation}
                    userDetails={currentUserData}
                    userID={userID}
                  />
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
    marginVertical: 10,
    height: 6,
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
});
