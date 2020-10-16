import React, {useEffect, useState,useLayoutEffect} from 'react';
import {StyleSheet, View, ScrollView,TouchableWithoutFeedback,Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import WritePost from '../../components/newsFeed/WritePost';
import NewsFeedList from './NewsFeedList';
import ActivityLoader from '../../components/loader/ActivityLoader';
import constants from '../../config/constants';
const {colors} = constants;
import PATH from '../../Constants/ImagePath';
import {getNewsFeedDetails, getPostDetails} from '../../api/NewsFeedapi';
import AsyncStorage from '@react-native-community/async-storage';

export default function FeedsScreen({navigation}) {
  const [postData, setPostData] = useState([]);
  const [newsFeedData, setNewsFeedData] = useState([]);
  const [loading, setloading] = useState(true);
  const [userID, setUserID] = useState('');

  async function setCustomerId() {
    let currentUserID = await AsyncStorage.getItem('CurrentUserId');
    if (currentUserID) {
      setUserID(currentUserID);
    }
  }
  useEffect(() => {
    setCustomerId()
}, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getPostDetails().then((response) => {
        if (response.status == true) {
          setPostData(response.payload.results);
        } else {
          alert(response.messages);
        }
      });
    });

    return () => {
      unsubscribe();
    };
  },[]);

  useLayoutEffect(() => {
    navigation.setOptions({
      
      headerRight: () => (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('AccountScreen')}>
          <Image
            source={PATH.vertical3Dot}
            style={styles.headerRightImg}
          />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);
  useEffect(() => {
    getPostDetails().then((response) => {
      if (response.status == true) {
        setPostData(response.payload.results);
      } else {
        alert(response.messages);
      }
      setloading(false);
    }, (error) => setloading(false));
  }, []);

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
        <WritePost navigation={navigation} postDataItem={postData ? postData[0] : {}} />
        <NewsFeedList
          navigation={navigation}
          newsFeedData={newsFeedData}
          postData={postData}
          userID={userID}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  background: {
    position: 'absolute',
    height: hp('100%'),
    width: wp('100%'),
    resizeMode: 'stretch',
  },
  headerRightImg: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    marginRight: 20,
  },
});
