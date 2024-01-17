import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Orientation from 'react-native-orientation';
import {format} from 'react-string-format';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import {getScreenWidth} from '../../../utils';
import AuthContext from '../../../auth/context';
import fonts from '../../../Constants/Fonts';
import {strings} from '../../../../Localization/translation';
import Verbs from '../../../Constants/Verbs';

const FeedAbsoluteBottomView = ({
  videoMetaData,
  feedItem = {},
  feedSubItem = {},
  isLandscape = false,
  onLikePress = () => {},
  readMore = false,
  showParent = false,
  currentTime,
  setCurrentTime,
  paused,
  setPaused = () => {},
  videoPlayerRef,
  currentViewIndex,
  shareActionSheetRef,
  screenInsets,
  openCommentModal = () => {},
  openLikeModal = () => {},
  isMute = true,
  setIsMute = () => {},
  isFullScreen = false,
  setIsFullScreen = () => {},
  setIsLandscape = () => {},
  privacyStatusLikeCount = true,
  privacyStatusCommenting = true,
  privacyStatusReposting = true,
}) => {
  const [slidingStatus, setSlidingStatus] = useState(false);
  const authContext = useContext(AuthContext);
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [repostCount] = useState(0);

  const videoDuration = Math.floor(videoMetaData?.duration ?? 0);
  useEffect(() => {
    if (feedItem) {
      let filterLike = [];
      setLikeCount(feedItem?.reaction_counts?.clap ?? 0);
      setCommentCount(feedItem?.reaction_counts?.comment ?? 0);
      if (feedItem?.own_reactions?.clap !== undefined) {
        filterLike = feedItem?.own_reactions.clap?.filter(
          (clapItem) => clapItem.user_id === authContext?.entity?.uid,
        );
        if (filterLike?.length > 0) setLike(true);
        else setLike(false);
      } else {
        setLike(false);
      }
    }
  }, [authContext?.entity?.uid, feedItem]);

  const renderThumb = useCallback(
    () => (
      <View
        style={{
          elevation: 5,
          shadowColor: colors.googleColor,
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.5,
          shadowRadius: 5,
          borderRadius: 50,
          backgroundColor: colors.whiteColor,
          height: slidingStatus ? 30 : 10,
          width: slidingStatus ? 30 : 10,
        }}
      />
    ),
    [slidingStatus],
  );

  const secondsToHms = (date) => {
    let hDisplay = '';
    let mDisplay = '0';
    let sDisplay = '00';

    const d = Number(date);

    const h = Math.floor(d / 3600);
    // eslint-disable-next-line no-mixed-operators
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);

    // Hour
    if (h > 0 && h?.toString()?.length === 1) hDisplay = `0${h}`;
    if (h > 0 && h?.toString()?.length > 1) hDisplay = `${h}`;

    // Minuites
    if (m > 0 && m?.toString()?.length === 1) mDisplay = `0${m}`;
    if (m > 0 && m?.toString()?.length > 1) mDisplay = `${m}`;

    // Seconds
    if (s > 0 && s?.toString()?.length === 1) sDisplay = `0${s}`;
    if (s > 0 && s?.toString()?.length > 1) sDisplay = `${s}`;

    return `${hDisplay}${hDisplay ? ':' : ''}${mDisplay}:${sDisplay}`;
  };

  const onFullScreen = () => {
    if (isFullScreen) {
      Orientation.lockToPortrait();
      setIsLandscape(false);
      setIsFullScreen(false);
      setTimeout(() => Orientation.unlockAllOrientations(), 1500);
    } else if (videoMetaData?.naturalSize?.orientation === 'landscape') {
      Orientation.lockToLandscape();
      setIsLandscape(true);
      setIsFullScreen(false);
    } else {
      Orientation.lockToPortrait();
      setIsLandscape(false);
      setIsFullScreen(true);
    }
    setTimeout(() => Orientation.unlockAllOrientations(), 1500);
  };

  const renderSeekBar = () =>
    videoDuration ? (
      <View
        pointerEvents={showParent && !readMore ? 'auto' : 'none'}
        style={{
          opacity: showParent ? 1 : 0,
          paddingHorizontal: 15,
          width: getScreenWidth({isLandscape, screenInsets}),
          zIndex: 10,
        }}>
        <Text style={styles.time}>
          {currentTime > videoDuration
            ? secondsToHms(videoDuration?.toFixed(0))
            : secondsToHms(Math.ceil(currentTime?.toFixed(0)))}{' '}
          / {secondsToHms(videoDuration)}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 25,
          }}>
          <MultiSlider
            smoothSnapped={true}
            markerOffsetX={3}
            max={videoDuration}
            enabledTwo={false}
            isMarkersSeparated={true}
            customMarkerLeft={renderThumb}
            values={[currentTime]}
            sliderLength={getScreenWidth({
              isLandscape,
              avoidScreenInsets: false,
              screenInsets,
              portraitWidth: 65,
              landscapeWidth: 80,
            })}
            selectedStyle={{backgroundColor: colors.whiteColor}}
            trackStyle={{backgroundColor: colors.userPostTimeColor}}
            onValuesChange={(values) => setCurrentTime(values?.[0])}
            onValuesChangeStart={() => {
              if (!paused) setPaused(true);
              setSlidingStatus(true);
            }}
            onValuesChangeFinish={(values) => {
              if (paused) setPaused(false);
              setSlidingStatus(false);
              if (videoPlayerRef?.current?.seek)
                videoPlayerRef.current.seek(values?.[0]);
            }}
          />

          <TouchableOpacity
            onPress={onFullScreen}
            style={[styles.iconContainer, {marginLeft: 25}]}>
            <Image
              source={
                isFullScreen ? images.videoNormalScreen : images.videoFullScreen
              }
              style={styles.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsMute((val) => !val)}
            style={[styles.iconContainer, {marginLeft: 25}]}>
            <Image
              source={isMute ? images.videoMuteSound : images.videoUnMuteSound}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    ) : null;

  const renderContent = () => {
    if (isLandscape) {
      return (
        <View
          style={[
            styles.commentShareLikeView,
            {width: getScreenWidth({isLandscape, screenInsets})},
          ]}>
          <View style={[styles.row, {justifyContent: 'space-between'}]}>
            <View style={styles.row}>
              {privacyStatusLikeCount ? (
                <View style={[styles.row, {marginRight: 35}]}>
                  <TouchableOpacity
                    style={[styles.iconContainer, {marginRight: 15}]}
                    onPress={() => {
                      setLike(!like);
                      if (like) setLikeCount((val) => val - 1);
                      else setLikeCount((val) => val + 1);
                      onLikePress();
                    }}>
                    <Image
                      source={
                        like ? images.feedViewLikeButton : images.feedViewUnLike
                      }
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (likeCount > 0) {
                        openLikeModal();
                      }
                    }}>
                    <Text style={styles.countText}>
                      {likeCount}{' '}
                      {likeCount > 1
                        ? format(strings.likesTitle, likeCount)
                        : format(strings.likeTitle, likeCount)}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {privacyStatusCommenting ? (
                <View style={styles.row}>
                  <TouchableOpacity
                    style={[styles.iconContainer, {marginRight: 15}]}
                    onPress={openCommentModal}>
                    <Image
                      source={images.feedViewCommentButton}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (commentCount > 0) {
                        openCommentModal();
                      }
                    }}>
                    <Text style={styles.countText}>
                      {commentCount}{' '}
                      {commentCount > 1
                        ? format(strings.comments, commentCount)
                        : format(strings.comment, commentCount)}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
            {privacyStatusReposting ? (
              <View style={styles.row}>
                <TouchableOpacity>
                  <Text style={styles.countText}>
                    {repostCount}{' '}
                    {repostCount > 1
                      ? format(strings.reposts, repostCount)
                      : format(strings.repost, repostCount)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconContainer, {marginLeft: 15}]}
                  onPress={() => {
                    shareActionSheetRef.current.show();
                  }}>
                  <Image
                    source={images.feedViewShareButton}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      );
    }
    return (
      <View
        style={[
          styles.commentShareLikeView,
          {width: getScreenWidth({isLandscape, screenInsets})},
        ]}>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <View style={styles.row}>
            {privacyStatusLikeCount ? (
              <TouchableOpacity
                style={[styles.iconContainer, {marginRight: 24}]}
                onPress={() => {
                  setLike(!like);
                  if (like) setLikeCount((val) => val - 1);
                  else setLikeCount((val) => val + 1);
                  onLikePress();
                }}>
                <Image
                  source={
                    like ? images.feedViewLikeButton : images.feedViewUnLike
                  }
                  style={styles.icon}
                />
              </TouchableOpacity>
            ) : null}

            {privacyStatusCommenting ? (
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={openCommentModal}>
                <Image
                  source={images.feedViewCommentButton}
                  style={styles.icon}
                />
              </TouchableOpacity>
            ) : null}
          </View>

          {privacyStatusReposting ? (
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {
                shareActionSheetRef.current.show();
              }}>
              <Image source={images.feedViewShareButton} style={styles.icon} />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <View style={[styles.row, {flex: 1}]}>
            {privacyStatusLikeCount ? (
              <TouchableOpacity
                onPress={() => {
                  if (likeCount > 0) {
                    openLikeModal();
                  }
                }}>
                <Text style={styles.countText}>
                  {likeCount}{' '}
                  {likeCount > 1
                    ? format(strings.likesTitle, likeCount)
                    : format(strings.likeTitle, likeCount)}
                </Text>
              </TouchableOpacity>
            ) : null}
            {privacyStatusCommenting && privacyStatusLikeCount ? (
              <View style={styles.vrLine} />
            ) : null}

            {privacyStatusCommenting ? (
              <TouchableOpacity
                onPress={() => {
                  if (commentCount > 0) {
                    openCommentModal();
                  }
                }}>
                <Text style={styles.countText}>
                  {commentCount}{' '}
                  {commentCount > 1
                    ? format(strings.comments, commentCount)
                    : format(strings.comment, commentCount)}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {privacyStatusReposting ? (
            <TouchableOpacity>
              <Text style={styles.countText}>
                {repostCount}{' '}
                {repostCount > 1
                  ? format(strings.reposts, repostCount)
                  : format(strings.repost, repostCount)}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <>
      <View
        pointerEvents={showParent ? 'auto' : 'none'}
        style={{
          position: 'absolute',
          bottom: 0,
          width: getScreenWidth({isLandscape, screenInsets}),
          opacity: showParent ? 1 : 0,
        }}>
        <View style={{justifyContent: 'flex-end'}}>
          {feedSubItem?.attachments?.[currentViewIndex]?.type ===
            Verbs.mediaTypeVideo && renderSeekBar()}
        </View>

        {renderContent()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  commentShareLikeView: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  divider: {
    height: 1,
    marginTop: 17,
    marginBottom: 13,
    backgroundColor: colors.whiteColor,
  },
  countText: {
    fontSize: 14,
    lineHeight: 17,
    color: colors.whiteColor,
    fontFamily: fonts.RMedium,
  },
  vrLine: {
    width: 2,
    backgroundColor: colors.whiteColor,
    height: 14,
    marginHorizontal: 10,
  },
  time: {
    fontSize: 12,
    marginRight: 24,
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
  },
});

export default FeedAbsoluteBottomView;
