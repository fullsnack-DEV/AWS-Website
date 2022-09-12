import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Alert, View, SafeAreaView, StatusBar} from 'react-native';
import Orientation from 'react-native-orientation';
import {useIsFocused} from '@react-navigation/native';
import ActionSheet from 'react-native-actionsheet';
import Clipboard from '@react-native-community/clipboard';
import Share from 'react-native-share';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import colors from '../../../Constants/Colors';
import FeedAbsoluteTopView from './FeedAbsoluteTopView';
import FeedAbsoluteBottomView from './FeedAbsoluteBottomView';
import AuthContext from '../../../auth/context';
import FeedPostView from './FeedPostView';
import {strings} from '../../../../Localization/translation';

const FeedViewScreen = ({navigation, route}) => {
  const screenInsets = useSafeAreaInsets();
  const shareActionSheetRef = useRef();
  const videoPlayerRef = useRef();
  const threeDotRef = useRef();
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [isLandscape, setIsLandscape] = useState(false);
  const [feedItem] = useState(
    route?.params?.feedItem?.post_type === 'repost'
      ? route?.params?.feedItem?.activity
      : route?.params?.feedItem,
  );
  const [feedSubItem, setFeedSubItem] = useState(null);
  const [readMore, setReadMore] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showParent, setShowsParent] = useState(true);
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [isMute, setIsMute] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [paused, setPaused] = useState(true);
  const [isPostOwner, setIsPostOwner] = useState(false);
  const [videoMetaData, setVideoMetaData] = useState(null);
  const onFullScreen = useCallback(
    () => setIsFullScreen((val) => setIsFullScreen(!val)),
    [],
  );

  console.log('route?.params?.feedItem', feedItem);
  // On change of current slider image / video
  useEffect(() => {
    setCurrentTime(0);
    setPaused(true);
    setIsMute(false);
  }, [currentViewIndex]);

  // On data come from parent screen
  useEffect(() => {
    if (route?.params?.feedItem) {
      setIsPostOwner(
        feedItem?.ownerId === authContext?.entity?.uid ||
          feedItem?.foreign_id === authContext?.entity?.uid,
      );
      const item = route?.params?.feedItem;

      let subItem = {};
      if (typeof item?.object === 'string') {
        if (JSON.parse(item.object)?.activity) {
          const temp = JSON.parse(item.object)?.activity;
          subItem = {...JSON.parse(temp.object), ...JSON.parse(item.object)};
        } else {
          subItem = JSON.parse(item.object);
        }
      } else {
        subItem = item.object;
      }

      setFeedSubItem({...subItem});
    }
  }, [
    authContext?.entity?.uid,
    feedItem?.foreign_id,
    feedItem?.ownerId,
    route?.params?.feedItem,
  ]);

  // When isLandscape is changed
  useEffect(() => {
    if (isLandscape) setIsFullScreen(true);
    else setIsFullScreen(false);
  }, [isLandscape]);

  // When screen is focused
  useEffect(() => {
    if (isFocused) {
      StatusBar.setHidden(true);
      Orientation.unlockAllOrientations();
      Orientation.addOrientationListener(orientationChange);
    } else if (!isFocused) {
      StatusBar.setHidden(false);
      setIsLandscape(false);
      Orientation.lockToPortrait();
      Orientation.removeOrientationListener(orientationChange);
    }
    return () => {
      StatusBar.setHidden(false);
      Orientation.lockToPortrait();
      Orientation.removeOrientationListener(orientationChange);
    };
  }, [isFocused]);

  // When orientation is change
  const orientationChange = useCallback((orientation) => {
    // eslint-disable-next-line no-console
    console.log(orientation);
    if (['LANDSCAPE', 'PORTRAITUPSIDEDOWN']?.includes(orientation)) {
      setIsLandscape(true);
      setIsFullScreen(true);
    } else {
      setIsFullScreen(false);
      setIsLandscape(false);
    }
  }, []);

  // When three dot press
  const onThreeDotPress = useCallback(() => {
    threeDotRef.current.show();
  }, []);

  // Render Top Bar which contain creator name and description with other functionality
  const renderTopView = useMemo(
    () => (
      <Fragment>
        <FeedAbsoluteTopView
          videoMetaData={videoMetaData}
          screenInsets={screenInsets}
          onThreeDotPress={onThreeDotPress}
          currentViewIndex={currentViewIndex}
          feedSubItem={feedSubItem}
          isMute={isMute}
          setIsMute={setIsMute}
          isFullScreen={isFullScreen}
          setIsFullScreen={setIsFullScreen}
          setIsLandscape={setIsLandscape}
          showParent={showParent}
          navigation={navigation}
          feedItem={feedItem}
          isLandscape={isLandscape}
          readMore={readMore}
          setReadMore={setReadMore}
        />
      </Fragment>
    ),
    [
      currentViewIndex,
      feedItem,
      feedSubItem,
      isFullScreen,
      isLandscape,
      isMute,
      navigation,
      onThreeDotPress,
      readMore,
      screenInsets,
      showParent,
      videoMetaData,
    ],
  );

  // When user click on like button
  const onLikePress = useCallback(() => {
    if (route?.params?.onLikePress) {
      route.params.onLikePress(feedItem);
    }
  }, [feedItem, route?.params]);

  const onUpdateComment = useCallback(
    (updateCommentData) => {
      if (route?.params?.updateCommentCount) {
        route.params.updateCommentCount(updateCommentData);
      }
    },
    [route.params],
  );

  // Render bottom bar which contain comment , like , share button and description and tagged
  const renderBottomView = useMemo(
    () => (
      <Fragment>
        <FeedAbsoluteBottomView
          videoMetaData={videoMetaData}
          updateCommentCount={onUpdateComment}
          screenInsets={screenInsets}
          shareActionSheetRef={shareActionSheetRef}
          currentViewIndex={currentViewIndex}
          paused={paused}
          setPaused={setPaused}
          videoPlayerRef={videoPlayerRef}
          isFullScreen={isFullScreen}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          showParent={showParent}
          navigation={navigation}
          isLandscape={isLandscape}
          feedItem={feedItem}
          feedSubItem={feedSubItem}
          onLikePress={onLikePress}
          readMore={readMore}
          setReadMore={setReadMore}
        />
      </Fragment>
    ),
    [
      currentTime,
      currentViewIndex,
      feedItem,
      feedSubItem,
      isFullScreen,
      isLandscape,
      navigation,
      onLikePress,
      paused,
      readMore,
      route?.params?.updateCommentCount,
      screenInsets,
      showParent,
      videoMetaData,
    ],
  );

  // When user touch the screen for hide top and bottom view
  const setShowParent = useCallback((toggleValue) => {
    if (toggleValue) setShowsParent(toggleValue);
    else setShowsParent((val) => !val);
  }, []);

  // Render Middle View which contain post (Video / Image)
  const renderPostView = useMemo(
    () => (
      <Fragment>
        <FeedPostView
          setVideoMetaData={setVideoMetaData}
          screenInsets={screenInsets}
          setisLandscape={setIsLandscape}
          paused={paused}
          setPaused={setPaused}
          videoPlayerRef={videoPlayerRef}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          setIsFullScreen={setIsFullScreen}
          isMute={isMute}
          setIsMute={setIsMute}
          currentViewIndex={currentViewIndex}
          setCurrentViewIndex={setCurrentViewIndex}
          currentPage={route?.params?.currentPage}
          setShowParent={setShowParent}
          isLandscape={isLandscape}
          feedSubItem={feedSubItem}
          showParent={showParent}
          isFullScreen={isFullScreen}
          onFullScreen={onFullScreen}
        />
      </Fragment>
    ),
    [
      currentTime,
      currentViewIndex,
      feedSubItem,
      isFullScreen,
      isLandscape,
      isMute,
      onFullScreen,
      paused,
      route?.params?.currentPage,
      screenInsets,
      setShowParent,
      showParent,
    ],
  );

  // Render main container which contain top, bottom and middle view(post)
  const renderFeedView = useMemo(
    () => (
      <Fragment>
        {renderPostView}
        {renderTopView}
        {renderBottomView}
      </Fragment>
    ),
    [renderBottomView, renderPostView, renderTopView],
  );

  // When user click on share button
  const onShareActionSheetItemPress = useCallback(
    (index) => {
      if (index === 0) {
        console.log(1);
      } else if (index === 1) {
        authContext.showAlert({visible: true});
        Clipboard.setString(feedSubItem?.text);
      } else if (index === 2) {
        const options = {
          message: feedSubItem?.text,
        };
        Share.open(options)
          .then((res) => {
            console.log('res :-', res);
          })
          .catch((err) => {
            console.log('err :-', err);
          });
      }
    },
    [authContext, feedSubItem?.text],
  );

  // Render actionsheet for share button press
  const renderSharePostActionSheet = useMemo(
    () => (
      <Fragment>
        <ActionSheet
          ref={shareActionSheetRef}
          title={'News Feed Post'}
          options={['Repost', 'Copy Link', 'More', strings.cancel]}
          cancelButtonIndex={3}
          onPress={onShareActionSheetItemPress}
        />
      </Fragment>
    ),
    [onShareActionSheetItemPress],
  );

  // Render actionsheet for three dot button press
  const renderThreeDotActionSheet = useMemo(
    () => (
      <Fragment>
        <ActionSheet
          ref={threeDotRef}
          options={
            isPostOwner
              ? ['Edit Privacy', 'Report', strings.cancel]
              : ['Report', strings.cancel]
          }
          cancelButtonIndex={isPostOwner ? 2 : 1}
          onPress={(index) => {
            if (isPostOwner) {
              if (index === 0) Alert.alert('Edit Privacy');
              else if (index === 1) Alert.alert('Report');
            } else if (index === 0) Alert.alert('Report');
          }}
        />
      </Fragment>
    ),
    [isPostOwner],
  );

  // Main render
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.blackColor}}>
      <View style={{flex: 1}}>
        {renderFeedView}
        {renderThreeDotActionSheet}
        {renderSharePostActionSheet}
      </View>
    </SafeAreaView>
  );
};
export default FeedViewScreen;
