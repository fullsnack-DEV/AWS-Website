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
import {
  getUserDetails, getGallery, getUserPosts, getUserClubDetails,
} from '../../api/Homeapi';
import NewsFeedList from '../newsfeeds/NewsFeedList';
import ActivityLoader from '../../components/loader/ActivityLoader';
import TabView from '../../components/Home/TabView';
import AddPhotoItem from '../../components/Home/AddPhotoItem';
import SingleImageRender from '../../components/Home/SingleImageRender';
import MultipleImageRender from '../../components/Home/MultipleImageRender';
import SingleVideoRender from '../../components/Home/SingleVideoRender';
import MultipleVideoRender from '../../components/Home/MultipleVideoRender';
import uploadImages from '../../utils/imageAction';
import { createPost, getNewsFeed } from '../../api/NewsFeedapi';
import ImageProgress from '../../components/newsFeed/ImageProgress';
import UserInfo from '../../components/Home/User/UserInfo';
import { getJoinedTeams } from '../../api/Accountapi';

export default function HomeScreen({ navigation, route }) {
  const [postData, setPostData] = useState([]);
  const [galleryData, setGalleryData] = useState([]);
  const [currentUserData, setCurrentUserData] = useState({});
  const [loading, setloading] = useState(true);
  const [userID, setUserID] = useState('');
  const [indexCounter, setIndexCounter] = useState(0);
  const [currentTab, setCurrentTab] = useState(0);
  const [totalUploadCount, setTotalUploadCount] = useState(0);
  const [doneUploadCount, setDoneUploadCount] = useState(0);
  const [progressBar, setProgressBar] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const entity = await Utility.getStorage('loggedInEntity');

      if (entity.role === 'club' || entity.role === 'team') {
        if (entity.uid === undefined) {
          getUserDetails(entity.auth.user_id)
            .then((res) => {
              setCurrentUserData(res.payload);
              setloading(false);
            })
            .catch((error) => {
              Alert.alert('', error.messages)
              setloading(false);
            });
        } else {
          getUserClubDetails(entity.uid)
            .then((res) => {
              setCurrentUserData(res.payload);
              setloading(false);
            })
            .catch(() => setloading(false));
        }
      } else if (entity.role === 'user') {
        getUserDetails(entity.uid)
          .then((res) => {
            const userDetails = res.payload;
            setCurrentUserData(res.payload);
            getJoinedTeams(entity.uid)
              .then((response) => {
                userDetails.joined_teams = response.payload.teams;
                userDetails.joined_clubs = response.payload.clubs;
                setCurrentUserData(userDetails);
              })
              .catch((errorTeam) => {
                userDetails.joined_group_erros = errorTeam.messages;
              });
          })
          .catch((error) => {
            Alert.alert('', error.messages)
            setloading(false);
          });
      }
      if (entity.uid === undefined) {
        setUserID(entity.auth.user_id);
      } else {
        setUserID(entity.uid);
      }
      const params = {
        uid: entity.uid || entity.auth.user_id,
      };
      getUserPosts(params)
        .then((response) => {
          setPostData(response.payload.results);
          setloading(false);
        })
        .catch((e) => {
          Alert.alert('', e.messages)
          setloading(false);
        });
      getGallery(entity.uid || entity.auth.user_id)
        .then((res) => {
          setGalleryData(res.payload);
          setloading(false);
        })
        .catch((error) => {
          Alert.alert('', error.messages)
          setloading(false);
        })
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
              console.log('Pick Images :-', pickImages);
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
              console.log('Pick Images :-', pickImages);
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
              console.log('Pick Images :-', pickImages);
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
              <TouchableOpacity>
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
          <TCGradientButton
              outerContainerStyle={{ marginVertical: 10, marginTop: 20 }}
              title="Edit Profile" onPress = {() => { navigation.navigate('EditPersonalProfileScreen'); }
              }/>
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
                  <WritePost
                    navigation={navigation}
                    postDataItem={postData ? postData[0] : {}}
                    onWritePostPress={() => {
                      navigation.navigate('WritePostScreen', { postData: postData ? postData[0] : {}, onPressDone: callthis })
                    }}
                  />
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
                {tabKey === 3 && (<View style={{ flex: 1 }} />)}
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
