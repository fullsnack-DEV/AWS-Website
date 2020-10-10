import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import WritePost from '../../components/newsFeed/WritePost';
import NewsFeedList from './NewsFeedList';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {getNewsFeedDetails, getPostDetails} from '../../api/NewsFeedapi';

export default function FeedsScreen({navigation}) {
  const [postData, setPostData] = useState([]);
  const [newsFeedData, setNewsFeedData] = useState([]);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    // getNewsFeedDetails().then((response) => {
    //   if (response) {
    //     setloading(false);
    //     setNewsFeedData(response);
    //   }
    // });
    getPostDetails().then((res) => {
      console.log('Feeds Screen Response :-', res);
      if (res) {
        setloading(false);
        setPostData(res);
      }
    });
  }, []);

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <ScrollView>
        <WritePost navigation={navigation} />
        <NewsFeedList
          navigation={navigation}
          newsFeedData={newsFeedData}
          postData={postData}
        />
      </ScrollView>
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
});
