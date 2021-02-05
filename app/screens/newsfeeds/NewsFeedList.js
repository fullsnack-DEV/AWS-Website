import React, { useEffect, useState, useContext } from 'react';
import {
  View, FlatList, ActivityIndicator,
} from 'react-native';
import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
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
  onEditPressDone,
  onRefreshPress,
  onDeletePost,
  pullRefresh = false,
  onLikePress,
}) {
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
    if (item?.actor?.id) {
      if (item?.actor?.id !== authContext?.entity?.uid) {
        navigation.navigate('HomeScreen', {
          uid: item.actor.id,
          backButtonVisible: true,
          role: item?.actor?.data?.entity_type === 'player' ? 'user' : item?.actor?.data?.entity_type,
        })
      }
    }
  }

  return (
    <View>
      <FlatList
        bounces={true}
        data={postData ?? []}
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
              pullRefresh={pullRefresh}
            key={key}
            item={item}
            navigation={navigation}
            caller_id={userID}
              onEditPressDone={onEditPressDone}
            onImageProfilePress={() => onProfilePress(item) }
            onLikePress={() => onLikePress(item)}
            onDeletePost={() => onDeletePost(item)}
          />
        )}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshing={pullRefresh}
        onRefresh={() => {
          const entity = authContext.entity
          if (entity) {
            setUserID(entity.uid || entity.auth.user_id);
          }
          onRefreshPress();
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
