import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView, FlatList} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../../config/constants';
import listing from '../../api/listing';
import useApi from '../../hooks/useApi';
import storage from '../../auth/storage';
import WritePost from '../../components/newsFeed/WritePost';
import Feed from '../../components/newsFeed/Feed';
import Loader from '../../components/loader/Loader';

const {strings, colors, fonts, urls, PATH} = constants;
var uid = '';

export default function FeedsScreen({navigation, route}) {
  const getFeedList = useApi(listing.getFeedDetail);
  const [feedData, setFeedData] = useState([]);
  useEffect(() => {
    getStorageData();
  }, []);
  const getStorageData = async () => {
    uid = await storage.retriveData('UID');

    await getFeedList.request();
    setFeedData(getFeedList.data.payload.results);
    console.log('JSON DATA : ', feedData);
  };
  renderItem = ({item, index}) => {
    return <Feed data={item} navigation={navigation} />;
  };
  return (
    <View style={styles.mainContainer}>
      {/* <Loader visible={getFeedList.loading} /> */}
      <ScrollView>
        <WritePost />
        <FlatList
          data={feedData}
          keyExtractor={(feedData) => feedData.id}
          renderItem={this.renderItem}
          showsHorizontalScrollIndicator={false}
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
