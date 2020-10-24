import React, { useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { createReaction, deletePost, getNewsFeed } from '../../api/NewsFeedapi';
import ActivityLoader from '../../components/loader/ActivityLoader';
import NewsFeedPostItems from '../../components/newsFeed/NewsFeedPostItems';
import colors from '../../Constants/Colors'

export default function NewsFeedList({
  navigation, postData,
}) {
  const [pullRefresh, setPullRefresh] = useState(false);
  const [data, setData] = useState(postData);
  const [loading, setloading] = useState(false);

  return (
    <View>
      <ActivityLoader visible={loading} />
      <FlatList
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
