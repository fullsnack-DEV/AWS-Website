import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { createReaction, deletePost, getNewsFeed } from '../../api/NewsFeeds';
import ActivityLoader from '../../components/loader/ActivityLoader';
import NewsFeedPostItems from '../../components/newsFeed/NewsFeedPostItems';
import colors from '../../Constants/Colors'

export default function NewsFeedList({
  navigation, postData,
}) {
  const [pullRefresh, setPullRefresh] = useState(false);
  const [data, setData] = useState(postData);
  const [loading, setloading] = useState(false);
  const [userID, setUserID] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const currentUserID = await AsyncStorage.getItem('CurrentUserId');
      if (currentUserID) {
        setUserID(currentUserID);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const onProfilePress = (item) => {
    navigation.navigate('HomeScreen', {
      uid: item.actor.id,
      role: item.actor.data.entity_type === 'player' ? 'user' : item.actor.data.entity_type,
    })
  }

  return (
    <View>
      <ActivityLoader visible={loading} />
      <FlatList
        bounces={false}
        data={data.length > 0 ? data : postData}
        ItemSeparatorComponent={() => (
          <View
            style={{
              marginTop: 10,
              height: 8,
              backgroundColor: colors.postSeprator,
            }}
          />
        )}
        ListFooterComponent={() => (
          <View
            style={{
              height: hp(10),
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, key }) => (
          <NewsFeedPostItems
            key={key}
            item={item}
            navigation={navigation}
            caller_id={userID}
            onImageProfilePress={() => onProfilePress(item) }
            onLikePress={() => {
              const bodyParams = {
                reaction_type: 'clap',
                activity_id: item.id,
              };
              createReaction(bodyParams)
                .then(() => getNewsFeed())
                .then((response) => {
                  setData(response.payload.results);
                })
                .catch((e) => {
                  Alert.alert('', e.messages)
                });
            }}
            onDeletePost={() => {
              setloading(true);
              const params = {
                activity_id: item.id,
              };
              deletePost(params)
                .then(() => getNewsFeed())
                .then((response) => {
                  setloading(false);
                  setData(response.payload.results);
                })
                .catch((e) => {
                  setloading(false);
                  Alert.alert('', e.messages)
                });
            }}
          />
        )}
        refreshing={pullRefresh}
        onRefresh={() => {
          setPullRefresh(true);
          getNewsFeed()
            .then((response) => {
              setData(response.payload.results);
              setPullRefresh(false);
            })
            .catch((e) => {
              Alert.alert('', e.messages)
              setPullRefresh(false);
            });
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
