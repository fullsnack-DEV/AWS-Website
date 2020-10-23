import React, { useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { createReaction, getPostDetails } from '../../api/NewsFeedapi';
import NewsFeedPostItems from '../../components/newsFeed/NewsFeedPostItems';
import colors from '../../Constants/Colors'

export default function NewsFeedList({ navigation, postData, userID }) {
  const [pullRefresh, setPullRefresh] = useState(false);
  const [data, setData] = useState(postData);

  return (
    <View>
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
              height: 20,
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, key }) => (
          <NewsFeedPostItems
            key={key}
            item={item}
            currentUserID={userID}
            navigation={navigation}
            onLikePress={() => {
              const bodyParams = {
                reaction_type: 'clap',
                activity_id: item.id,
              };
              createReaction(bodyParams)
                .then(() => getPostDetails())
                .then((response) => {
                  setData(response.payload.results);
                })
                .catch((e) => {
                  Alert.alert('', e.messages)
                });
            }}
          />
        )}
        refreshing={pullRefresh}
        onRefresh={() => {
          setPullRefresh(true);
          getPostDetails()
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
