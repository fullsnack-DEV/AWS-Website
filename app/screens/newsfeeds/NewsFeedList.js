import React, {
  useEffect, memo, useState, useContext, useCallback,
} from 'react';
import {
  View, ActivityIndicator, FlatList,
} from 'react-native';
import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import NewsFeedPostItems from '../../components/newsFeed/NewsFeedPostItems';
import colors from '../../Constants/Colors'
import AuthContext from '../../auth/context'

const NewsFeedList = ({
  onFeedScroll,
  refs,
  navigation,
  postData,
  onEndReached = () => {},
  footerLoading = false,
  scrollEnabled,
  ListHeaderComponent,
  onEditPressDone = () => {},
  onRefreshPress = () => {},
  onDeletePost = () => {},
  pullRefresh = false,
  onLikePress = () => {},
  onStartShouldSetResponderCapture = () => {},
}) => {
  const [userID, setUserID] = useState('');
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext)
  useEffect(() => {
    if (isFocused) {
      const entity = authContext.entity
      if (entity) {
        setUserID(entity.uid || entity.auth.user_id);
      }
    }
  }, [isFocused]);

  const onProfilePress = useCallback((item) => {
    if (item?.actor?.id) {
      if (item?.actor?.id !== authContext?.entity?.uid) {
        navigation.navigate('HomeScreen', {
          uid: item.actor.id,
          backButtonVisible: true,
          role: item?.actor?.data?.entity_type === 'player' ? 'user' : item?.actor?.data?.entity_type,
        })
      }
    }
  }, [authContext?.entity?.uid, navigation])

  const renderNewsFeed = useCallback(({ item }) => {
    const onDeleteButtonPress = () => onDeletePost(item)
    const onLikeButtonPress = () => onLikePress(item)
    return (
      <NewsFeedPostItems
            pullRefresh={pullRefresh}
            item={item}
            navigation={navigation}
            caller_id={userID}
            onEditPressDone={onEditPressDone}
            onImageProfilePress={() => onProfilePress(item)}
            onLikePress={onLikeButtonPress}
            onDeletePost={onDeleteButtonPress}
        />
    )
  }, [pullRefresh, navigation, userID, onEditPressDone, onDeletePost, onProfilePress, onLikePress])

  const newsFeedListItemSeperator = useCallback(() => (
    <View
            style={{
              marginTop: 10,
              height: 8,
              backgroundColor: colors.whiteGradientColor,
            }}
        />
    ), [])

  const newsFeedListFooterComponent = useCallback(() => (
      !footerLoading ? <View
          style={{
            height: hp(10),
          }}
      /> : <ActivityIndicator size={'small'} color={ colors.blackColor } style={{ alignSelf: 'center', marginBottom: hp(10) }} />
  ), [footerLoading])

  const newsFeedOnRefresh = useCallback(() => {
    if (onRefreshPress) {
      const entity = authContext.entity
      if (entity) {
        setUserID(entity.uid || entity.auth.user_id);
      }
      onRefreshPress();
    }
  }, [authContext.entity, onRefreshPress])

  const newsFeedKeyExtractor = useCallback((item) => `feed1${item?.id?.toString()}`, [])

  return (
    <View onStartShouldSetResponderCapture={onStartShouldSetResponderCapture} style={{ flex: 1 }}>
      <FlatList
        onScroll={onFeedScroll}
        ref={refs}
        style={{ flex: 1 }}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
        legacyImplementation={true}
        maxToRenderPerBatch={10}
        initialNumToRender={5}
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
        nestedScrollEnabled={true}
        keyExtractor={newsFeedKeyExtractor}
      />
    </View>
  );
}

export default memo(NewsFeedList);
