import React, {
  Fragment, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { StatusBar, View } from 'react-native';
import Orientation from 'react-native-orientation';
import { useIsFocused } from '@react-navigation/native';
import colors from '../../../Constants/Colors';
// import FeedAbsoluteShadeView from './FeedAbsoluteShadeVIew';
import FeedAbsoluteTopView from './FeedAbsoluteTopView';
import FeedAbsoluteBottomView from './FeedAbsoluteBottomView';
import { createReaction } from '../../../api/NewsFeeds';
import AuthContext from '../../../auth/context';
import FeedPostView from './FeedPostView';

const FeedViewScreen = ({ navigation, route }) => {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [isLandscape, setisLandscape] = useState(false);
  const [feedItem, setFeedItem] = useState(route?.params?.feedItem)
  const [feedSubItem, setFeedSubItem] = useState(null)
  const [readMore, setReadMore] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [showParent, setShowsParent] = useState(true);

  useEffect(() => {
    if (route?.params?.feedItem) {
      setFeedItem({ ...route?.params?.feedItem })
      const item = route?.params?.feedItem;
      const subItem = typeof item?.object === 'string' ? JSON.parse(item?.object) : item?.object;
      setFeedSubItem({ ...subItem });
    }
  }, [route?.params?.feedItem])

  useEffect(() => {
    if (!showParent) setShowsParent(true);
  }, [currentViewIndex])

  useEffect(() => {
    if (isFocused) {
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor(colors.blackColor);
      Orientation.unlockAllOrientations();
      Orientation.addOrientationListener(orientationChange);
    } else if (!isFocused) {
      setisLandscape(false);
      Orientation.lockToPortrait();
      Orientation.removeOrientationListener(orientationChange);
    }
    return () => {
      Orientation.lockToPortrait();
      Orientation.removeOrientationListener(orientationChange);
    };
  }, [isFocused])

  const orientationChange = useCallback((orientation) => {
    if (['LANDSCAPE', 'PORTRAITUPSIDEDOWN']?.includes(orientation)) {
      setIsFullScreen(true);
      setisLandscape(true);
    } else {
      setisLandscape(false);
      setIsFullScreen(false);
    }
  }, []);

  const renderTopView = useMemo(() => (
    <FeedAbsoluteTopView
        feedSubItem={feedSubItem}
        navigation={navigation}
        feedItem={feedItem}
        isLandscape={isLandscape}
        readMore={readMore}
        setReadMore={setReadMore}
      />
    ), [feedItem, feedSubItem, isLandscape, navigation, readMore])

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

  const renderBottomView = useMemo(() => (
    <FeedAbsoluteBottomView
        navigation={navigation}
        isLandscape={isLandscape}
        feedItem={feedItem}
        feedSubItem={feedSubItem}
        onLikePress={onLikePress}
        readMore={readMore}
        setReadMore={setReadMore}
    />
  ), [feedItem, feedSubItem, isLandscape, navigation, onLikePress, readMore])

  // const renderAbsoluteShadeView = useMemo(() => <FeedAbsoluteShadeView isLandscape={isLandscape}/>, [isLandscape])
  const setShowParent = useCallback(() => {
    setShowsParent((val) => !val)
  }, [])

  const renderPostView = useMemo(() => (
    <FeedPostView
          setShowParent={setShowParent}
          isLandscape={isLandscape}
          feedSubItem={feedSubItem}
          showParent={showParent}
          currentViewIndex={currentViewIndex}
          isFullScreen={isFullScreen}
          setCurrentViewIndex={setCurrentViewIndex}
          setIsFullScreen={setIsFullScreen}
    />
  ), [currentViewIndex, feedSubItem, isFullScreen, isLandscape, setShowParent, showParent])

  const renderAbsoluteView = useMemo(() => (
    <Fragment>
      {renderPostView}
      {showParent && renderTopView }
      {/* {renderAbsoluteShadeView} */}
      {showParent && renderBottomView}
    </Fragment>
  ), [renderBottomView, renderPostView, renderTopView, showParent])

  return (
    <View style={{ flex: 1, backgroundColor: colors.blackColor }}>
      {renderAbsoluteView}
    </View>
  )
}
export default FeedViewScreen;
