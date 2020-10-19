import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import constants from '../../config/constants';
import ActivityLoader from '../../components/loader/ActivityLoader';
import { createReaction, getPostDetails } from '../../api/NewsFeedapi';
import NewsFeedPostItems from '../../components/newsFeed/NewsFeedPostItems';

const { colors } = constants;

export default function NewsFeedList({ navigation, postData, userID }) {
  const [loading, setloading] = useState(false);
  const [pullRefresh, setPullRefresh] = useState(false);
  const [data, setData] = useState(postData);

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
              setloading(true);
              const bodyParams = {
                reaction_type: 'clap',
                activity_id: item.id,
              };
              createReaction(bodyParams).then(
                (res) => {
                  if (res.status) {
                    getPostDetails().then((response) => {
                      if (response.status) {
                        setData(response.payload.results);
                      } else {
                        alert(response.messages);
                      }
                      setloading(false);
                    });
                  } else {
                    setloading(false);
                    alert(res.messages);
                  }
                },
                setloading(false),
              );
            }}
          />
        )}
        refreshing={pullRefresh}
        onRefresh={() => {
          setPullRefresh(true);
          getPostDetails().then(
            (response) => {
              if (response.status) {
                setData(response.payload.results);
              } else {
                alert(response.messages);
              }
              setPullRefresh(false);
            },
            setPullRefresh(false),
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
      </View>
  );
}
