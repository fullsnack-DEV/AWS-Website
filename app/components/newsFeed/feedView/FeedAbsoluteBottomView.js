import React, {
    useCallback, Fragment, useContext, useEffect, useState, useMemo,
} from 'react';
import {
    Image, Platform, SafeAreaView, StyleSheet, Text, View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IosSlider from '@react-native-community/slider';
import AndroidSlider from 'rn-range-slider';
import FastImage from 'react-native-fast-image';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import { getTaggedText, getWidth } from '../../../utils';
import fonts from '../../../Constants/Fonts';
import TagView from '../TagView';
import AuthContext from '../../../auth/context';
import FeedDescriptionSection from './FeedDescriptionSection';

const FeedAbsoluteBottomView = ({
    feedItem = {},
    feedSubItem = {},
    isLandscape,
    navigation,
    onLikePress,
    readMore,
    setReadMore,
    showParent,
    currentTime,
    setCurrentTime,
    paused,
    setPaused,
    videoPlayerRef,
    currentViewIndex,
    shareActionSheetRef,
}) => {
    const sourceData = feedSubItem?.attachments?.[currentViewIndex];
    const authContext = useContext(AuthContext);
    const [like, setLike] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);

    useEffect(() => {
        if (feedItem) {
            let filterLike = []
            setLikeCount(feedItem?.reaction_counts?.clap ?? 0)
            setCommentCount(feedItem?.reaction_counts?.comment ?? 0)
            if (feedItem?.own_reactions?.clap !== undefined) {
                filterLike = feedItem?.own_reactions.clap?.filter((clapItem) => clapItem.user_id === authContext?.entity?.uid);
                if (filterLike?.length > 0) setLike(true);
                else setLike(false);
            } else {
                setLike(false);
            }
        }
    }, [feedItem])

    const onCommentButtonPress = useCallback(() => {
        navigation.navigate('WriteCommentScreen', {
            data: feedItem,
            onDonePress: (commentData) => { setCommentCount(commentData?.count) },
        });
    }, [feedItem, navigation]);

    const onTaggedPress = useCallback(() => {
        navigation.navigate('FeedTaggedScreen', { taggedData: feedSubItem?.format_tagged_data ?? [] })
    }, [feedSubItem?.format_tagged_data, navigation])

    const taggedText = useMemo(() => {
        const gameTagList = feedSubItem?.format_tagged_data?.filter((item) => item?.entity_type === 'game')
        const entityTagList = feedSubItem?.format_tagged_data?.filter((item) => item?.entity_type !== 'game')
        return getTaggedText(entityTagList, gameTagList)
    }, [feedSubItem]);

    const renderBottomButtons = useMemo(() => !readMore && (
      <View style={{ ...styles.commentShareLikeView, width: getWidth(isLandscape, 100) }}>

        {/* Comment And Share Button Button */}
        <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingLeft: 15,
                width: getWidth(isLandscape, 70),
        }}>
          <View
                    style={{
                        flexDirection: 'row',
                    }}>
            <TouchableOpacity
                        onPress={onCommentButtonPress}
                        style={styles.imageTouchStyle}>
              <Image
                            style={[styles.commentImage, { top: 2 }]}
                            source={images.feedViewCommentButton}
                            resizeMode={'cover'}
                        />
            </TouchableOpacity>
            <Text style={styles.commentlengthStyle}>
              {commentCount > 0 ? commentCount : ''}
            </Text>
          </View>

          {/* Share Button */}
          <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
            <TouchableOpacity
                        onPress={() => {
                            shareActionSheetRef.current.show();
                        }}
                        style={styles.imageTouchStyle}>
              <Image
                            style={styles.commentImage}
                            source={images.feedViewShareButton}
                            resizeMode={'contain'}
                        />
            </TouchableOpacity>
            <Text style={styles.commentlengthStyle}>{''}</Text>
          </View>
        </View>

        {/* Like Button */}
        <View
                style={{
                    paddingRight: 15,
                    width: getWidth(isLandscape, 30),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                }}>

          <Text
                    style={[
                        styles.commentlengthStyle,
                        {
                            color: like === true ? '#FF8A01' : colors.whiteColor,
                        },
                    ]}>
            {likeCount === 0 ? '' : likeCount}
          </Text>
          <TouchableOpacity
                    onPress={() => {
                        setLike(!like);
                        if (like) setLikeCount((val) => val - 1);
                        else setLikeCount((val) => val + 1);
                        onLikePress()
                    }}
                    style={styles.imageTouchStyle}>
            {like === true ? (
              <Image
                            style={styles.commentImage}
                            source={images.feedViewLikeButton}
                            resizeMode={'contain'}
                        />
                    ) : (
                      <Image
                          style={styles.commentImage}
                            source={images.feedViewUnLike}
                            resizeMode={'contain'}
                        />
                    )}
          </TouchableOpacity>
        </View>
      </View>
    ), [commentCount, isLandscape, like, likeCount, onCommentButtonPress, onLikePress, readMore])

    const renderRail = useCallback(() => (
      <View
            style={{
                flex: 1,
                height: 4,
                borderRadius: 5,
                backgroundColor: 'rgba(255,255,255,0.5)',
            }}
        />
    ), []);

    const renderRailSelected = useCallback(() => (
      <View
            style={{
                flex: 1,
                height: 4,
                borderRadius: 5,
                backgroundColor: colors.whiteColor,
            }}
        />
    ), []);

    const renderThumb = useCallback(() => (
      <FastImage
            source={images.videoThumb}
            resizeMode={'contain'}
            style={{ height: 30, width: 30 }}/>
    ), []);

    const secondsToHms = (date) => {
        let hDisplay = '';
        let mDisplay = '0';
        let sDisplay = '00';

        const d = Number(date);

        const h = Math.floor(d / 3600);
        // eslint-disable-next-line no-mixed-operators
        const m = Math.floor(d % 3600 / 60);
        const s = Math.floor(d % 3600 % 60);

        // Hour
        if (h > 0 && h?.toString()?.length === 1) hDisplay = `0${h}`
        if (h > 0 && h?.toString()?.length > 1) hDisplay = `${h}`

        // Minuites
        if (m > 0 && m?.toString()?.length === 1) mDisplay = `0${m}`
        if (m > 0 && m?.toString()?.length > 1) mDisplay = `${m}`

        // Seconds
        if (s > 0 && s?.toString()?.length === 1) sDisplay = `0${s}`
        if (s > 0 && s?.toString()?.length > 1) sDisplay = `${s}`

        return `${hDisplay}${hDisplay ? ':' : ''}${mDisplay}:${sDisplay}`;
    }

    const renderSeekBar = useMemo(() => (
      <View
            pointerEvents={showParent && !readMore ? 'auto' : 'none'}
            style={{
                opacity: (showParent && !readMore) ? 1 : 0,
                paddingHorizontal: 10,
                height: 50,
                width: getWidth(isLandscape, 100),
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                zIndex: 10,
            }}>
        <Text style={{
                textAlign: 'center',
                fontSize: 12,
                width: 50,
                color: colors.whiteColor,
        }}>
          {secondsToHms(Math.ceil(currentTime?.toFixed(0)))}
        </Text>
        {Platform?.OS === 'ios' ? (
          <IosSlider
                    tapToSeek={true}
                    value={currentTime}
                    style={{
                        flex: 1,
                    }}
                    onValueChange={(value) => setCurrentTime(value)}
                    onSlidingStart={() => !paused && setPaused(true)}
                    onSlidingComplete={(value) => {
                        if (videoPlayerRef?.current?.seek) videoPlayerRef.current.seek(value)
                        setPaused(false);
                    }}
                    step={1}
                    minimumValue={0}
                    maximumValue={(sourceData?.duration / 1000)}
                    minimumTrackTintColor={colors.whiteColor}
                    maximumTrackTintColor={'rgba(255,255,255,0.5)'}
                />
            ) : (
              <AndroidSlider
                    disableRange
                    min={0}
                    low={currentTime}
                    max={(sourceData?.duration / 1000)}
                    step={1}
                    style={{ flex: 1 }}
                    renderThumb={renderThumb}
                    renderRail={renderRail}
                    renderRailSelected={renderRailSelected}
                    onValueChanged={(lowValue, highValue, fromUser) => {
                        setCurrentTime(lowValue);
                        if (fromUser && videoPlayerRef?.current?.seek) videoPlayerRef.current.seek(lowValue);
                    }}
                />
            )}
        <Text style={{
                fontSize: 12,
                width: 50,
                color: colors.whiteColor,
                textAlign: 'center',

        }}>
          {sourceData?.duration && secondsToHms((sourceData?.duration / 1000))}
        </Text>

      </View>
    ), [currentTime, isLandscape, paused, readMore, renderRail, renderRailSelected, renderThumb, setCurrentTime, setPaused, showParent, sourceData?.duration, videoPlayerRef])

    return (
      <Fragment>
        <SafeAreaView
            pointerEvents={showParent ? 'auto' : 'none'}
            style={{
                position: 'absolute',
                bottom: 0,
                width: getWidth(isLandscape, 100),
                opacity: showParent ? 1 : 0,
            }}>
          <View style={{ justifyContent: 'flex-end' }}>
            {!readMore && !isLandscape && (
              <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
                <FeedDescriptionSection
                    readMore={readMore}
                    setReadMore={setReadMore}
                    navigation={navigation}
                    tagData={feedSubItem?.format_tagged_data}
                    descriptions={feedSubItem?.text}
                    isLandscape={isLandscape}
                    descriptionTxt={{ color: colors.whiteColor }}
                   />
              </View>
            )}
            {!isLandscape && !readMore && taggedText !== '' && (
              <TouchableOpacity onPress={onTaggedPress}>
                <TagView
                  source={images.tagGreenImage}
                  tagText={taggedText}
                />
              </TouchableOpacity>
            )}
            {feedSubItem?.attachments?.[currentViewIndex]?.type === 'video' && renderSeekBar}
          </View>

          {/* Bottom Buttons */}
          {renderBottomButtons}

        </SafeAreaView>
      </Fragment>
    )
}

const styles = StyleSheet.create({
    commentImage: {
        height: 22,
        width: 22,
        alignSelf: 'flex-end',
    },
    commentShareLikeView: {
        flexDirection: 'row',
        margin: '3%',
        marginVertical: '2%',
        alignSelf: 'center',
    },
    commentlengthStyle: {
        alignSelf: 'center',
        color: colors.whiteColor,
        fontFamily: fonts.RMedium,
        fontSize: 14,
        marginHorizontal: 5,
    },
    imageTouchStyle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default FeedAbsoluteBottomView;
