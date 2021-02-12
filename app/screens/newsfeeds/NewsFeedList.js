import React, {
  useEffect, memo, useState, useContext, useCallback,
} from 'react';
import {
  View, FlatList, ActivityIndicator,
} from 'react-native';
import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import NewsFeedPostItems from '../../components/newsFeed/NewsFeedPostItems';
import colors from '../../Constants/Colors'
import AuthContext from '../../auth/context'

const NewsFeedList = ({
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
}) => {
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

  const renderNewsFeed = useCallback(({ item, key }) => (
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
  ), [postData])

  const newsFeedListItemSeperator = () => (
    <View
          style={{
            marginTop: 10,
            height: 8,
            backgroundColor: colors.whiteGradientColor,
          }}
      />
  )

  const newsFeedListFooterComponent = () => (
      !footerLoading ? <View
          style={{
            height: hp(10),
          }}
      /> : <ActivityIndicator size={'small'} color={ colors.blackColor } style={{ alignSelf: 'center', marginBottom: hp(10) }} />
  )

  const newsFeedOnRefresh = () => {
    const entity = authContext.entity
    if (entity) {
      setUserID(entity.uid || entity.auth.user_id);
    }
    onRefreshPress();
  }

  const newsFeedKeyExtractor = (item, index) => `feed1${index.toString()}`

  return (
    <View>
      <FlatList
        bounces={true}
        data={postData ?? []}
        ItemSeparatorComponent={newsFeedListItemSeperator}
        ListHeaderComponent={ListHeaderComponent}
        scrollEnabled={scrollEnabled}
        ListFooterComponent={newsFeedListFooterComponent}
        showsVerticalScrollIndicator={false}
        renderItem={renderNewsFeed}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshing={pullRefresh}
        onRefresh={newsFeedOnRefresh}
        keyExtractor={newsFeedKeyExtractor}
      />
    </View>
  );
}

export default memo(NewsFeedList);
