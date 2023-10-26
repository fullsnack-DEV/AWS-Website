/* eslint-disable consistent-return */
import React, {
  useEffect,
  memo,
  useState,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {View, ActivityIndicator, FlatList, Text} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useIsFocused} from '@react-navigation/native';
import NewsFeedPostItems from '../../components/newsFeed/feed/NewsFeedPostItems';
import colors from '../../Constants/Colors';
import AuthContext from '../../auth/context';
import fonts from '../../Constants/Fonts';
import {strings} from '../../../Localization/translation';

const viewabilityConfig = {itemVisiblePercentThreshold: 50};
const NewsFeedList = ({
  onFeedScroll,
  refs,
  navigation,
  postData,
  onEndReached = () => {},
  onMomentumScrollBegin,
  footerLoading = false,
  scrollEnabled,
  ListHeaderComponent,
  onRefreshPress = () => {},
  onDeletePost = () => {},
  pullRefresh = false,
  onLikePress = () => {},
  onStartShouldSetResponderCapture = () => {},
  updateCommentCount,
  noDataFoundText = strings.noPostFoundText,
  feedAPI,
  isNewsFeedScreen = false,
  openProfilId,
  entityDetails = {},
  openLikeModal = () => {},
  openCommentModal = () => {},
  dummyCall = () => {},
}) => {
  const [userID, setUserID] = useState('');

  const [parentIndex, setParentIndex] = useState(0);
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (isFocused) {
      const entity = authContext.entity;
      if (entity) {
        setUserID(entity.uid || entity.auth.user_id);
      }
    }
  }, [isFocused, authContext.entity]);

  const onProfilePress = useCallback(
    (item) => {
      if (item?.actor?.id) {
        navigation.push('HomeStack', {
          screen: 'HomeScreen',
          params: {
            uid: item.actor.id,
            role: item?.actor?.data?.entity_type,
          },
        });
      }
    },
    [navigation],
  );

  const renderNewsFeed = ({item, index}) => {
    const onDeleteButtonPress = () => onDeletePost(item);
    const onLikeButtonPress = () => onLikePress(item);
    return (
      <View>
        <NewsFeedPostItems
          currentParentIndex={index}
          parentIndex={parentIndex}
          updateCommentCount={updateCommentCount}
          pullRefresh={pullRefresh}
          item={item}
          navigation={navigation}
          caller_id={userID}
          onImageProfilePress={() => onProfilePress(item)}
          onLikePress={onLikeButtonPress}
          onDeletePost={onDeleteButtonPress}
          isNewsFeedScreen={isNewsFeedScreen}
          openProfilId={openProfilId}
          entityDetails={entityDetails}
          openLikeModal={openLikeModal}
          openCommentModal={openCommentModal}
        />
        <View
          style={{backgroundColor: colors.grayBackgroundColor, height: 7}}
        />
      </View>
    );
  };

  const newsFeedListItemSeperator = useCallback(
    () => (
      <View
        style={{
          height: 1,
          backgroundColor: colors.whiteGradientColor,
        }}
      />
    ),
    [],
  );

  const newsFeedListFooterComponent = useMemo(
    () =>
      !footerLoading ? (
        <View
          style={{
            height: hp(10),
          }}
        />
      ) : (
        <ActivityIndicator
          size={'small'}
          color={colors.blackColor}
          style={{alignSelf: 'center', marginBottom: hp(10)}}
        />
      ),
    [footerLoading],
  );

  const newsFeedOnRefresh = useCallback(() => {
    const entity = authContext.entity;
    if (entity) {
      setUserID(entity.uid || entity.auth.user_id);
    }
    onRefreshPress();
    dummyCall();
  }, [authContext.entity, onRefreshPress]);

  const newsFeedKeyExtractor = useCallback(
    (item) => `feed1${item?.id?.toString()}`,
    [],
  );

  const onViewableItemsChanged = useCallback(({viewableItems}) => {
    if (viewableItems?.length > 0) {
      setParentIndex(viewableItems?.[0]?.index ?? 0);
    }
  }, []);

  const viewabilityConfigCallbackPairs = useRef([
    {viewabilityConfig, onViewableItemsChanged},
  ]);

  const listEmpty = useCallback(() => {
    if (feedAPI) {
      return (
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.RLight,
            textAlign: 'center',
            padding: 15,
          }}>
          {noDataFoundText}
        </Text>
      );
    }
    return <View></View>;
  }, [feedAPI, noDataFoundText]);

  return (
    <View
      onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}
      style={{flex: 1}}>
      <FlatList
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        onScroll={onFeedScroll}
        ref={refs}
        style={{flex: 1}}
        contentContainerStyle={{paddingVertical: 15}}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
        legacyImplementation={true}
        maxToRenderPerBatch={10}
        initialNumToRender={5}
        ListEmptyComponent={listEmpty}
        bounces={true}
        data={postData}
        ItemSeparatorComponent={newsFeedListItemSeperator}
        ListHeaderComponent={ListHeaderComponent}
        scrollEnabled={scrollEnabled}
        ListFooterComponent={newsFeedListFooterComponent}
        showsVerticalScrollIndicator={false}
        renderItem={renderNewsFeed}
        onEndReached={onEndReached}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onEndReachedThreshold={0.5}
        refreshing={pullRefresh}
        onRefresh={newsFeedOnRefresh}
        nestedScrollEnabled={true}
        keyExtractor={newsFeedKeyExtractor}
      />
    </View>
  );
};

export default memo(NewsFeedList);
