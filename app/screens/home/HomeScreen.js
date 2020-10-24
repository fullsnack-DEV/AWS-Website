import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ParallaxScrollView from '../../components/ParallaxScrollView';
import BackgroundProfile from '../../components/Home/BackgroundProfile';
import TCGradientButton from '../../components/TCGradientButton';
import Header from '../../components/Home/Header';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import TCScrollableTabs from '../../components/TCScrollableTabs';
import WritePost from '../../components/newsFeed/WritePost';
import { getUserPosts } from '../../api/NewsFeedapi';
import NewsFeedList from '../newsfeeds/NewsFeedList';
import ActivityLoader from '../../components/loader/ActivityLoader';

export default function HomeScreen({ navigation }) {
  const [actionButtonVisible, setActionButtonVisible] = useState(false);
  const [postData, setPostData] = useState([]);
  const [loading, setloading] = useState(true);
  const [userID, setUserID] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const currentUserID = await AsyncStorage.getItem('CurrentUserId');
      if (currentUserID) {
        setUserID(currentUserID);
      }
      const params = {
        uid: currentUserID,
      };
      getUserPosts(params)
        .then((response) => {
          console.log('Response :-', response);
          setPostData(response.payload.results);
          setloading(false);
        })
        .catch((e) => {
          Alert.alert('', e.messages)
          setloading(false);
        });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const onBGImageClicked = () => {
    console.log('onBGImageClicked');
  }

  const onProfileImageClicked = () => {
    console.log('onProfileImageClicked');
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
                <Image source={images.backArrow} style={{ height: 22, width: 16 }} />
              </TouchableOpacity>
            }
            centerComponent={
              <Text style={styles.userTextStyle}>Christiano Ronaldo</Text>
            }
            rightComponent={
              <TouchableOpacity>
                <Image source={images.menu} style={{ height: 22, width: 22 }} />
              </TouchableOpacity>
            }
          />
        )}
        isActionButtonVisible={actionButtonVisible}
        stickyHeaderHeight={87}
        renderForeground={() => (
          <BackgroundProfile
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
            <View tabLabel='Post' style={{ flex: 1 }}>
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
            <View tabLabel='Info' style={{ flex: 1 }}>
            </View>
            <View tabLabel='Scoreboard' style={{ flex: 1 }}>
            </View>
            <View tabLabel='Schedule' style={{ flex: 1 }}>
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
    fontSize: 22,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
  sepratorStyle: {
    marginVertical: 10,
    height: 6,
    width: ('100%'),
    backgroundColor: colors.graySeparater,
  },
});
