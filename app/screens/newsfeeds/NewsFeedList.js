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
import {
  View,
  ActivityIndicator,
  FlatList,
  Text,
  Dimensions,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useIsFocused} from '@react-navigation/native';
import NewsFeedPostItems from '../../components/newsFeed/feed/NewsFeedPostItems';
import colors from '../../Constants/Colors';
import AuthContext from '../../auth/context';
import {strings} from '../../../Localization/translation';
import ListEmptyComponent from '../../components/NoDataComponents/ListEmptyComponent';
import images from '../../Constants/ImagePath';
import fonts from '../../Constants/Fonts';

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
  feedAPI,
  isNewsFeedScreen = false,
  openProfilId,
  entityDetails = {},
  openLikeModal = () => {},
  openCommentModal = () => {},
  dummyCall = () => {},
  fromEvent = false,
  routeData = {},
  viewPostPrivacyStatus = true,
  onUpdatePost = () => {},
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
          fromEvent={fromEvent}
          routeData={routeData}
          onUpdatePost={onUpdatePost}
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
    if (!viewPostPrivacyStatus) {
      return null;
    }
    if (feedAPI) {
      return isNewsFeedScreen ? (
        <View style={{height: Dimensions.get('window').height * 0.8}}>
          <ListEmptyComponent
            title={strings.welcomToTownCupText}
            subTitle={strings.postsFromOtherGroupWillAppearHere}
            imageUrl={images.feedNoData}
          />
        </View>
      ) : (
        <View
          style={{
            alignItems: 'center',
            marginTop: 25,
          }}>
          <Text
            style={{
              fontSize: 20,
              lineHeight: 30,
              color: colors.veryLightBlack,
              fontFamily: fonts.RBold,
            }}>
            {strings.noPostTitle}
          </Text>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 24,
              color: colors.veryLightBlack,
              fontFamily: fonts.RRegular,
              paddingTop: 5,
            }}>
            {strings.noPostFoundSubTitle}
          </Text>
        </View>
      );
    }
    return null;
  }, [feedAPI, isNewsFeedScreen, viewPostPrivacyStatus]);

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
