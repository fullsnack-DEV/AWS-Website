import React, {
  Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import {
 Alert, View, SafeAreaView, StatusBar,
} from 'react-native';
import Orientation from 'react-native-orientation';
import { useIsFocused } from '@react-navigation/native';
import ActionSheet from 'react-native-actionsheet';
import Clipboard from '@react-native-community/clipboard';
import Share from 'react-native-share';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../../Constants/Colors';
import FeedAbsoluteTopView from './FeedAbsoluteTopView';
import FeedAbsoluteBottomView from './FeedAbsoluteBottomView';
import { createReaction } from '../../../api/NewsFeeds';
import AuthContext from '../../../auth/context';
import FeedPostView from './FeedPostView';

const FeedViewScreen = ({ navigation, route }) => {
  const screenInsets = useSafeAreaInsets();
  const shareActionSheetRef = useRef();
  const videoPlayerRef = useRef();
  const threeDotRef = useRef();
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [isLandscape, setIsLandscape] = useState(false);
  const [feedItem, setFeedItem] = useState(route?.params?.feedItem)
  const [feedSubItem, setFeedSubItem] = useState(null)
  const [readMore, setReadMore] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showParent, setShowsParent] = useState(true);
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [isMute, setIsMute] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [paused, setPaused] = useState(true);
  const [isPostOwner, setIsPostOwner] = useState(false);
  const onFullScreen = useCallback(() => setIsFullScreen((val) => setIsFullScreen(!val)), [])

  useEffect(() => {
  }, [])

  useEffect(() => {
    setCurrentTime(0);
    setPaused(true);
    setIsMute(false);
  }, [currentViewIndex])

  useEffect(() => {
    if (route?.params?.feedItem) {
      setIsPostOwner(route?.params?.feedItem?.ownerId === authContext?.entity?.uid || route?.params?.feedItem?.foreign_id === authContext?.entity?.uid);
      setFeedItem({ ...route?.params?.feedItem })
      const item = route?.params?.feedItem;
      const subItem = typeof item?.object === 'string' ? JSON.parse(item?.object) : item?.object;
      setFeedSubItem({ ...subItem });
    }
  }, [route?.params?.feedItem])

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
  }, [isFocused])

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

  const onThreeDotPress = useCallback(() => {
    threeDotRef.current.show();
  }, [])

  const renderTopView = useMemo(() => (
    <FeedAbsoluteTopView
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
    ), [currentViewIndex, feedItem, feedSubItem, isFullScreen, isLandscape, isMute, navigation, onThreeDotPress, readMore, screenInsets, showParent])

  const onLikePress = useCallback(() => {
    const bodyParams = {
      reaction_type: 'clap',
      activity_id: feedItem?.id,
    };
    createReaction(bodyParams, authContext)
        .catch((e) => {
          console.log('Error: ', e)
        });
  }, [authContext, feedItem?.id]);

  useEffect(() => {
    if (isLandscape) setIsFullScreen(true)
    else setIsFullScreen(false)
  }, [isLandscape])

  const renderBottomView = useMemo(() => (
    <FeedAbsoluteBottomView
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
  ), [currentTime, currentViewIndex, feedItem, feedSubItem, isFullScreen, isLandscape, navigation, onLikePress, paused, readMore, screenInsets, showParent])

  const setShowParent = useCallback((toggleValue) => {
    if (toggleValue) setShowsParent(toggleValue)
    else setShowsParent((val) => !val)
  }, [])

  const renderPostView = useMemo(() => (
    <FeedPostView
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
  ), [currentTime, currentViewIndex, feedSubItem, isFullScreen, isLandscape, isMute, onFullScreen, paused, route?.params?.currentPage, setShowParent, showParent])

  const renderAbsoluteView = useMemo(() => (
    <Fragment>
      {renderPostView}
      {renderTopView}
      {renderBottomView}
    </Fragment>
  ), [renderBottomView, renderPostView, renderTopView])

  const onShareActionSheetItemPress = useCallback((index) => {
    if (index === 0) {
      console.log(1);
    } else if (index === 1) {
      authContext.showAlert({ visible: true })
      Clipboard.setString(feedSubItem?.text);
    } else if (index === 2) {
      const options = {
        message: feedSubItem?.text,
      }
      Share.open(options)
          .then((res) => {
            console.log('res :-', res);
          })
          .catch((err) => {
            console.log('err :-', err);
          });
    }
  }, [authContext, feedSubItem?.text])

  const renderSharePostActionSheet = useMemo(() => (
    <ActionSheet
          ref={shareActionSheetRef}
          title={'News Feed Post'}
          options={['Repost', 'Copy Link', 'More', 'Cancel']}
          cancelButtonIndex={3}
          onPress={onShareActionSheetItemPress}
      />
  ), [onShareActionSheetItemPress])

  const renderThreeDotActionSheet = useMemo(() => (
    <ActionSheet
        ref={threeDotRef}
        options={isPostOwner ? ['Edit Privacy', 'Report', 'Cancel'] : ['Report', 'Cancel']}
        cancelButtonIndex={isPostOwner ? 2 : 1}
        onPress={(index) => {
          if (isPostOwner) {
            if (index === 0) Alert.alert('Edit Privacy')
            else if (index === 1) Alert.alert('Report')
          } else if (index === 0) Alert.alert('Report')
        }}
    />
  ), [isPostOwner])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.blackColor }}>
      <View style={{ flex: 1 }}>
        {renderAbsoluteView}
        {renderThreeDotActionSheet}
        {renderSharePostActionSheet}
      </View>
    </SafeAreaView>
  )
}
export default FeedViewScreen;
