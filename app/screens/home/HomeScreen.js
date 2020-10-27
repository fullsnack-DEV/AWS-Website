import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet, Text, TouchableOpacity, View, Alert, FlatList,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import ParallaxScrollView from '../../components/ParallaxScrollView';
import BackgroundProfile from '../../components/Home/BackgroundProfile';
import TCGradientButton from '../../components/TCGradientButton';
import Header from '../../components/Home/Header';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import * as Utility from '../../utils/index';
import TCScrollableTabs from '../../components/TCScrollableTabs';
import WritePost from '../../components/newsFeed/WritePost';
import { getUserDetails, getGallery, getUserPosts } from '../../api/Homeapi';
import NewsFeedList from '../newsfeeds/NewsFeedList';
import ActivityLoader from '../../components/loader/ActivityLoader';
import TabView from '../../components/Home/TabView';

export default function HomeScreen({ navigation }) {
  const [actionButtonVisible, setActionButtonVisible] = useState(true);
  const [postData, setPostData] = useState([]);
  const [galleryData, setGalleryData] = useState([]);
  const [currentUserData, setCurrentUserData] = useState({});
  const [loading, setloading] = useState(true);
  const [userID, setUserID] = useState('');
  const [indexCounter, setIndexCounter] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const entity = await Utility.getStorage('loggedInEntity');
      setUserID(entity.uid);
      const params = {
        uid: entity.role === 'user' && entity.uid,
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
      getUserDetails(entity.uid)
        .then((res) => {
          setCurrentUserData(res.payload);
          setloading(false);
        })
        .catch((error) => {
          Alert.alert('', error.messages)
          setloading(false);
        });
      getGallery(entity.uid)
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

  const data = [];
  (galleryData).map((itemImage) => {
    if (itemImage.attachments && itemImage.attachments.length > 0) {
      data.push(...itemImage.attachments)
    }
    return null;
  })

  const onBGImageClicked = () => {
    console.log('onBGImageClicked');
  }

  const onProfileImageClicked = () => {
    console.log('onProfileImageClicked');
  }

  let profileImage = '';
  if (currentUserData && currentUserData.full_image) {
    profileImage = currentUserData.full_image;
  }
  let fullName = '';
  if (currentUserData && currentUserData.full_name) {
    fullName = currentUserData.full_name;
  }

  return (
    <View style={ styles.mainContainer }>
      <ActivityLoader visible={loading} />
      <ParallaxScrollView
        backgroundColor={'white'}
        contentBackgroundColor={'white'}
        parallaxHeaderHeight={310}
        bounces={true}
        showsVerticalScrollIndicator={false}
        fadeOutBackground={false}
        delayFade={true}
        delayFadeValue={10}
        onChangeHeaderVisibility={(val) => {
          setActionButtonVisible(val);
        }}
        renderStickyHeader={() => (
          <Header
            leftComponent={
              <TouchableOpacity>
                <Image source={images.backArrow} style={{ height: 22, width: 16, tintColor: colors.blackColor }} />
              </TouchableOpacity>
            }
            centerComponent={
              <View style={styles.stickyProfileViewStyle}>
                <Image source={profileImage ? { uri: profileImage } : images.profilePlaceHolder} style={styles.stickyProfileImage}/>
                <Text style={styles.userTextStyle}>{fullName}</Text>
              </View>
            }
            rightComponent={
              <TouchableOpacity>
                <Image source={images.menu} style={{ height: 22, width: 22, tintColor: colors.blackColor }} />
              </TouchableOpacity>
            }
          />
        )}
        isActionButtonVisible={actionButtonVisible}
        stickyHeaderHeight={90}
        renderForeground={() => (
          <BackgroundProfile
          currentUserData={currentUserData}
          onPressBGImage={() => onBGImageClicked()}
          onPressProfileImage={() => onProfileImageClicked()} />
        )}
    >
        <View style={{ flex: 1 }}>
          <TCGradientButton
              outerContainerStyle={{ marginVertical: 10 }}
              title="Edit Profile" onPress = {() => { navigation.navigate('EditPersonalProfileScreen'); }
              }/>
          <View style={styles.sepratorStyle}/>
          <TCScrollableTabs>
            <View tabLabel='Post'>
              <WritePost
              navigation={navigation}
              postDataItem={postData ? postData[0] : {}}
              onWritePostPress={() => {
                navigation.navigate('WritePostScreen', { postData: postData ? postData[0] : {} })
              }}
            />
              <NewsFeedList
                navigation={navigation}
                postData={postData}
                userID={userID}
              />
            </View>
            <View tabLabel='Info'>
            </View>
            <View tabLabel='Scoreboard'>
            </View>
            <View tabLabel='Schedule'>
            </View>
            <View tabLabel='Gallery'>
              <TabView
                indexCounter={indexCounter}
                onFirstTabPress={() => setIndexCounter(0)}
                onSecondTabPress={() => setIndexCounter(1)}
                onThirdTabPress={() => setIndexCounter(2)}
              />
              <View style={styles.sepratorLineStyle} />
              {indexCounter === 0 && <FlatList
                data={['0', ...data]}
                bounces={false}
                renderItem={({ item, index }) => {
                  if (index === 0) {
                    return (
                      <TouchableOpacity
                        style={styles.headerImagePickerView}
                        onPress={() => {
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
                      >
                        <Image
                          style={styles.plusImageStyle}
                          source={images.plus}
                        />
                        <Text style={styles.addPhotoTextStyle}>Add Photo</Text>
                      </TouchableOpacity>
                    );
                  }
                  if (item.type === 'image') {
                    return (
                      <View
                        style={styles.imagesViewStyle}>
                        <FastImage
                          style={ styles.imageStyle }
                          source={{ uri: item.thumbnail }}
                          resizeMode={ FastImage.resizeMode.cover }
                        />
                      </View>
                    );
                  }
                  if (item.type === 'video') {
                    return (
                      <View
                        style={styles.imagesViewStyle}>
                        <Video
                          source={ { uri: item.thumbnail } }
                          style={ styles.singleImageDisplayStyle }
                          resizeMode={ 'cover' }
                        />
                      </View>
                    );
                  }
                  return <View />
                }}
                numColumns={3}
                style={{ marginHorizontal: 1.5 }}
                keyExtractor={(item, index) => index}
              />}
            </View>
          </TCScrollableTabs>
        </View>
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  userTextStyle: {
    fontSize: 18,
    fontFamily: fonts.RBold,
    // alignSelf: 'center',
  },
  sepratorStyle: {
    marginVertical: 10,
    height: 6,
    width: ('100%'),
    backgroundColor: colors.graySeparater,
  },
  stickyProfileViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stickyProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    marginHorizontal: 10,
  },
  imageStyle: {
    height: wp(32.3),
    width: wp(32.3),
  },
  sepratorLineStyle: {
    width: wp('100%'),
    height: 2,
    backgroundColor: colors.disableColor,
    marginVertical: 1,
  },
  imagesViewStyle: {
    flexDirection: 'row',
    margin: 1.5,
    borderWidth: 0.5,
    borderColor: colors.disableColor,
    height: wp(32.3),
    width: wp(32.3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImagePickerView: {
    margin: 1.5,
    backgroundColor: colors.activeIndexColor,
    height: wp(32.3),
    width: wp(32.3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoTextStyle: {
    fontSize: 16,
    marginTop: 8,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
  },
  plusImageStyle: {
    height: 15,
    width: 15,
    tintColor: colors.whiteColor,
  },
});
