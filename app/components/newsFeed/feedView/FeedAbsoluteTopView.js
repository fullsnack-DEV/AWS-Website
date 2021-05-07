import React, {
    memo, useCallback, Fragment, useContext, useMemo,
} from 'react';
import _ from 'lodash'
import {
    Image, ScrollView, StyleSheet, Text, View, TouchableOpacity as ReactNativeTouchableOpacity,
} from 'react-native';
import Orientation from 'react-native-orientation';
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import { getHitSlop, getScreenWidth } from '../../../utils';
import { commentPostTimeCalculate } from '../../../Constants/LoaderImages';
import fonts from '../../../Constants/Fonts';
import AuthContext from '../../../auth/context';
import FeedDescriptionSection from './FeedDescriptionSection';

const FeedAbsoluteTopView = memo(({
    videoMetaData,
    showParent,
    screenInsets,
    feedItem = {},
    isLandscape,
    readMore,
    setReadMore,
    navigation,
    feedSubItem,
    isFullScreen,
    setIsFullScreen,
    setIsLandscape,
    isMute,
    setIsMute,
    currentViewIndex,
    onThreeDotPress,
 }) => {
    const userImage = feedItem?.actor?.data?.thumbnail ? { uri: feedItem?.actor?.data?.thumbnail } : images?.profilePlaceHolder;
    const authContext = useContext(AuthContext);

    // When user press profile pic / profile name
    const onProfilePress = useCallback(() => {
        if (feedItem?.actor?.id) {
            if (feedItem?.actor?.id !== authContext?.entity?.uid) {
                navigation.push('HomeScreen', {
                    uid: feedItem?.actor?.id,
                    backButtonVisible: true,
                    role: ['player', 'user']?.includes(feedItem?.actor?.data?.entity_type) ? 'user' : feedItem?.actor?.data?.entity_type,
                });
            }
        }
    }, [authContext?.entity?.uid, feedItem?.actor?.data?.entity_type, feedItem?.actor?.id, navigation])

    // When user press full screen icon
    const onFullScreen = useCallback(() => {
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
    }, [isFullScreen, setIsFullScreen, setIsLandscape, videoMetaData?.naturalSize?.orientation])

    // Render Top Description with read More functionality
    const renderDescriptionSection = useMemo(() => (
      <Fragment>
        {(!readMore && isLandscape) && <FeedDescriptionSection
                readMore={readMore}
                setReadMore={setReadMore}
                navigation={navigation}
                tagData={feedSubItem?.format_tagged_data}
                descriptions={feedSubItem?.text}
                isLandscape={isLandscape}
                descriptionTxt={{ color: colors.whiteColor }}
            />}

        {readMore && <View style={{ flex: 1, paddingVertical: 15, marginHorizontal: 15 }}>
          <ScrollView
                    indicatorStyle={'white'}
                    style={{ zIndex: 10 }}
                    showsVerticalScrollIndicator={true}>
            <ReactNativeTouchableOpacity
                        activeOpacity={1}
                        onPress={() => setReadMore(!readMore)}>
              <FeedDescriptionSection
                            readMore={readMore}
                            setReadMore={setReadMore}
                            navigation={navigation}
                            tagData={feedSubItem?.format_tagged_data}
                            descriptions={feedSubItem?.text}
                            isLandscape={isLandscape}
                            descriptionTxt={{ color: colors.whiteColor }}
                        />
            </ReactNativeTouchableOpacity>
          </ScrollView>
        </View>
            }
      </Fragment>
    ), [feedSubItem?.format_tagged_data, feedSubItem?.text, isLandscape, navigation, readMore, setReadMore])

    // Render right buttons contain full screen, three dots, mute/unmute
    const renderTopRightButtons = useMemo(() => (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
        {feedSubItem?.attachments?.[currentViewIndex]?.type === 'video' && (
          <Fragment>
            {/*  Mute Unmute Button */}
            <TouchableOpacity hitSlop={getHitSlop(10)} onPress={() => setIsMute((val) => !val)}>
              <FastImage
                            source={isMute ? images.videoMuteSound : images.videoUnMuteSound}
                            resizeMode={'contain'}
                            style={{
                                height: 22,
                                width: 22,
                                tintColor: colors.whiteColor,
                            }}
                        />
            </TouchableOpacity>

            {/*  Full Screen Button */}
            <TouchableOpacity hitSlop={getHitSlop(10)} onPress={onFullScreen} style={{ marginLeft: 20 }}>
              <FastImage
                            source={isFullScreen ? images.videoNormalScreen : images.videoFullScreen }
                            resizeMode={'contain'}
                            style={{
                                height: 22,
                                width: 22,
                                tintColor: colors.whiteColor,
                            }}
                        />
            </TouchableOpacity>
          </Fragment>
            )}

        <TouchableOpacity onPress={onThreeDotPress} style={{ marginLeft: 20 }}>
          <Image
                    source={images.vertical3Dot}
                    resizeMode={'contain'}
                    style={{
                        height: 22,
                        width: 22,
                        tintColor: colors.whiteColor,
                        marginHorizontal: 5,
                    }} />
        </TouchableOpacity>
      </View>
    ), [currentViewIndex, feedSubItem?.attachments, isFullScreen, isMute, onFullScreen, onThreeDotPress, setIsMute])

    // Render top profile image and name with back button
    const renderProfileDisplay = useMemo(() => (
      <View style={styles.profileContainer}>
        <TouchableOpacity
                hitSlop={getHitSlop(15)}
                onPress={() => {
                    Orientation.lockToPortrait();
                    navigation.goBack();
                }}
            >
          <FastImage
                    tintColor={colors.whiteColor}
                    source={images.backArrow}
                    resizeMode={'contain'}
                    style={{ height: 20, width: 20 }}
                />
        </TouchableOpacity>

        <View style={styles.mainContainer}>
          <TouchableWithoutFeedback onPress={onProfilePress}>
            <View style={styles.profileImageContainer}>
              <Image
                        style={styles.background}
                        source={userImage}
                        resizeMode={'cover'}
                    />
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.userNameView}>
            <Text
                numberOfLines={1}
                style={{
                        ...styles.userNameTxt,
                        maxWidth: getScreenWidth({
                                    isLandscape, screenInsets, portraitWidth: 35,
                                  }),
                }}
                onPress={() => {}}>
              {_.startCase(feedItem?.actor?.data?.full_name?.toLowerCase())}
            </Text>
            <Text style={styles.activeTimeAgoTxt}>
              {commentPostTimeCalculate(feedItem?.time, true)}
            </Text>
          </View>
        </View>

      </View>
    ), [feedItem?.actor?.data?.full_name, feedItem?.time, isLandscape, navigation, onProfilePress, screenInsets, userImage])

    return (
      <View
          pointerEvents={showParent ? 'auto' : 'none'}
          style={{
              ...styles.topMainContainer,
          opacity: showParent ? 1 : 0,
          ...(readMore && { bottom: 0 }),
          backgroundColor: readMore ? 'rgba(0,0,0,0.7)' : 'transparent',
          }}>
        <View
          style={{
          ...styles.topSubContainer,
          width: getScreenWidth({ isLandscape, screenInsets }),
          }}>

          {/* Render top profile image and name with back button */}
          {renderProfileDisplay}

          {/* Render right buttons contain full screen, three dots, mute/unmute */}
          {renderTopRightButtons}
        </View>

        {/* Render Top Description with read More functionality */}
        {renderDescriptionSection}
      </View>
    )
})

const styles = StyleSheet.create({
    topMainContainer: {
        position: 'absolute',
        top: 0,
    },
    topSubContainer: {
        zIndex: 100,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profileContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainContainer: {
        flexDirection: 'row',
        padding: wp('3%'),
    },
    userNameTxt: {
        color: colors.whiteColor,
        fontFamily: fonts.RBold,
        fontSize: 16,
    },
    userNameView: {
        flexDirection: 'column',
        marginLeft: wp('4%'),
    },
    activeTimeAgoTxt: {
        color: colors.whiteColor,
        fontFamily: fonts.RRegular,
        fontSize: 14,
        top: 2,
    },
    background: {
        borderRadius: 50,
        height: 36,
        width: 36,
    },
    profileImageContainer: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: colors.whiteColor,
    },
});

export default FeedAbsoluteTopView;
