import React, { useEffect, useState, useContext } from 'react';
import {
  View, FlatList, Alert, ActivityIndicator,
} from 'react-native';
import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { createReaction, deletePost, getNewsFeed } from '../../api/NewsFeeds';
import ActivityLoader from '../../components/loader/ActivityLoader';
import NewsFeedPostItems from '../../components/newsFeed/NewsFeedPostItems';
import colors from '../../Constants/Colors'
import AuthContext from '../../auth/context'

export default function NewsFeedList({
  navigation,
  postData,
  onEndReached,
  footerLoading = false,
  scrollEnabled,
  ListHeaderComponent,
}) {
  // console.log('Post Data ::--', postData);
  const [pullRefresh, setPullRefresh] = useState(false);
  const [data, setData] = useState(postData);
  const [loading, setloading] = useState(false);
  const [userID, setUserID] = useState('');
  const authContext = useContext(AuthContext)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const entity = authContext.entity
      if (entity) {
        setUserID(entity.uid || entity.auth.user_id);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const onProfilePress = (item) => {
    navigation.navigate('HomeScreen', {
      uid: item.actor.id,
      backButtonVisible: true,
      role: item.actor.data.entity_type === 'player' ? 'user' : item.actor.data.entity_type,
    })
  }

  return (
    <View>
      <ActivityLoader visible={loading} />
      <FlatList
        bounces={true}
        data={data.length > 0 ? data : postData}
        ItemSeparatorComponent={() => (
          <View
            style={{
              marginTop: 10,
              height: 8,
              backgroundColor: colors.whiteGradientColor,
            }}
          />
        )}
        ListHeaderComponent={ListHeaderComponent}
        scrollEnabled={scrollEnabled}
        ListFooterComponent={() => (
          !footerLoading ? <View
            style={{
              height: hp(10),
            }}
          /> : <ActivityIndicator size={'small'} color={ colors.blackColor } style={{ alignSelf: 'center', marginBottom: hp(10) }} />
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
              createReaction(bodyParams, authContext)
                .then(() => getNewsFeed(authContext))
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
              deletePost(params, authContext)
                .then(() => getNewsFeed(authContext))
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
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshing={pullRefresh}
        onRefresh={() => {
          setPullRefresh(true);
          getNewsFeed(authContext)
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
