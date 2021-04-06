import React, {
  Fragment, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { StatusBar, View } from 'react-native';
import Orientation from 'react-native-orientation';
import colors from '../../../Constants/Colors';
import FeedAbsoluteShadeView from './FeedAbsoluteShadeVIew';
import FeedAbsoluteTopView from './FeedAbsoluteTopView';
import FeedAbsoluteBottomView from './FeedAbsoluteBottomView';
import { createReaction } from '../../../api/NewsFeeds';
import AuthContext from '../../../auth/context';

const FeedViewScreen = ({ navigation, route }) => {
  const authContext = useContext(AuthContext);
  const [isLandScape, setIsLandScape] = useState(false);
  const [feedItem, setFeedItem] = useState(route?.params?.feedItem)
  const [feedSubItem, setFeedSubItem] = useState(null)
  const [readMore, setReadMore] = useState(false)

  useEffect(() => {
    if (route?.params?.feedItem) {
      setFeedItem({ ...route?.params?.feedItem })
      const item = route?.params?.feedItem;
      const subItem = typeof item?.object === 'string' ? JSON.parse(item?.object) : item?.object;
      setFeedSubItem({ ...subItem });
    }
  }, [route?.params?.feedItem])

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor(colors.blackColor);
    Orientation.unlockAllOrientations();
    Orientation.addOrientationListener(orientationChange);
    return () => {
      Orientation.lockToPortrait();
      Orientation.removeOrientationListener(orientationChange);
    };
  }, [])

  const orientationChange = useCallback((orientation) => {
    if (['LANDSCAPE', 'PORTRAITUPSIDEDOWN']?.includes(orientation)) setIsLandScape(true);
    else setIsLandScape(false);
  }, []);

  const renderTopView = useMemo(() => (
    <FeedAbsoluteTopView
        feedSubItem={feedSubItem}
        navigation={navigation}
        feedItem={feedItem}
        isLandScape={isLandScape}
        readMore={readMore}
        setReadMore={setReadMore}
      />
    ), [feedItem, feedSubItem, isLandScape, navigation, readMore])

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
        isLandScape={isLandScape}
        feedItem={feedItem}
        feedSubItem={feedSubItem}
        onLikePress={onLikePress}
        readMore={readMore}
        setReadMore={setReadMore}
    />
  ), [feedItem, feedSubItem, isLandScape, navigation, onLikePress, readMore])

  const renderAbsoluteShadeView = useMemo(() => <FeedAbsoluteShadeView isLandscape={isLandScape}/>, [isLandScape])

  const renderAbsoluteView = useMemo(() => (
    <Fragment>
      {renderAbsoluteShadeView}
      {renderTopView}
      {renderBottomView}
    </Fragment>
  ), [renderAbsoluteShadeView, renderBottomView, renderTopView])

  const renderPostView = useMemo(() => (
    <View style={{
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      zIndex: -2,
      height: '100%',
    }}>
    </View>
  ), [])

  return (
    <View style={{ flex: 1, backgroundColor: colors.blackColor }}>
      {renderAbsoluteView}
      {renderPostView}
    </View>
  )
}
export default FeedViewScreen;
