import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  StyleSheet, View, TouchableWithoutFeedback, Image, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import WritePost from '../../components/newsFeed/WritePost';
import NewsFeedList from './NewsFeedList';
import ActivityLoader from '../../components/loader/ActivityLoader';
import constants from '../../config/constants';
import PATH from '../../Constants/ImagePath';
import { getPostDetails } from '../../api/NewsFeedapi';

const { colors } = constants;

export default function FeedsScreen({ navigation }) {
  const [postData, setPostData] = useState([]);
  const [newsFeedData] = useState([]);
  const [loading, setloading] = useState(true);
  const [userID, setUserID] = useState('');

  async function setCustomerId() {
    const currentUserID = await AsyncStorage.getItem('CurrentUserId');
    if (currentUserID) {
      setUserID(currentUserID);
    }
  }
  useEffect(() => {
    setCustomerId();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getPostDetails()
        .then((response) => setPostData(response.payload.results))
        .catch((e) => Alert.alert('', e.messages));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
          <TouchableWithoutFeedback
          onPress={() => navigation.navigate('AccountScreen')}>
              <Image source={PATH.vertical3Dot} style={styles.headerRightImg} />
          </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);
  useEffect(() => {
    getPostDetails()
      .then((response) => {
        setPostData(response.payload.results);
        setloading(false);
      })
      .catch((e) => {
        Alert.alert('', e.messages)
        setloading(false);
      });
  }, []);

  return (
      <View style={styles.mainContainer}>
          <ActivityLoader visible={loading} />
          <WritePost
        navigation={navigation}
        postDataItem={postData ? postData[0] : {}}
      />
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
  headerRightImg: {
    height: 20,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 20,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});
