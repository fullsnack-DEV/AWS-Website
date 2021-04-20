import React, {
 memo, useCallback, Fragment, useContext,
} from 'react';
import _ from 'lodash'
import {
    Image, SafeAreaView, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import Orientation from 'react-native-orientation';
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import { getHitSlop, getWidth } from '../../../utils';
import { commentPostTimeCalculate } from '../../../Constants/LoaderImages';
import fonts from '../../../Constants/Fonts';
import AuthContext from '../../../auth/context';
import FeedDescriptionSection from './FeedDescriptionSection';

const FeedAbsoluteTopView = ({
    showParent,
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

    const onFullScreen = useCallback(() => {
        const sourceData = feedSubItem?.attachments?.[currentViewIndex];
        if (isFullScreen) {
                Orientation.lockToPortrait();
                setIsLandscape(false);
                setIsFullScreen(false);
            setTimeout(() => Orientation.unlockAllOrientations(), 1500);
        } else if (sourceData?.media_height < sourceData?.media_width) {
                Orientation.lockToLandscape();
                setIsLandscape(true);
                setIsFullScreen(false);
            } else {
                Orientation.lockToPortrait();
                setIsLandscape(false);
                setIsFullScreen(true);
            }
        setTimeout(() => Orientation.unlockAllOrientations(), 1500);
    }, [currentViewIndex, feedSubItem?.attachments, isFullScreen, setIsFullScreen, setIsLandscape])

    return (
      <SafeAreaView
          pointerEvents={showParent ? 'auto' : 'none'}
          style={{
              opacity: showParent ? 1 : 0,
              position: 'absolute',
              top: 0,
          ...(readMore && { bottom: 0 }),
          backgroundColor: readMore ? 'rgba(0,0,0,0.7)' : 'transparent',
          }}>
        <View
                style={{
                    zIndex: 100,
                    paddingHorizontal: 15,
                    flexDirection: 'row',
                    width: getWidth(isLandscape, 100),
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
          <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
          }}>
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
                <Image
                            style={styles.background}
                            source={userImage}
                            resizeMode={'cover'}
                        />
              </TouchableWithoutFeedback>
              <View style={styles.userNameView}>
                <Text numberOfLines={1} style={{ ...styles.userNameTxt, maxWidth: getWidth(isLandscape, 40) }} onPress={() => {}}>
                  {_.startCase(feedItem?.actor?.data?.full_name?.toLowerCase())}
                </Text>
                <Text style={styles.activeTimeAgoTxt}>
                  {commentPostTimeCalculate(feedItem?.time, true)}
                </Text>
              </View>
            </View>

          </View>

          {/* Right Buttons */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
            {feedSubItem?.attachments?.[currentViewIndex]?.type === 'video' && (
              <Fragment>
                {/*  Mute Unmute Button */}
                <TouchableOpacity hitSlop={getHitSlop(10)} onPress={() => setIsMute((val) => !val)}>
                  <FastImage
                              source={isMute ? images.videoMuteSound : images.videoUnMuteSound}
                              resizeMode={'contain'}
                              style={{
                                  marginHorizontal: 10,
                                  height: 18,
                                  width: 18,
                                  tintColor: colors.whiteColor,
                              }}
                          />
                </TouchableOpacity>

                {/*  Full Screen Button */}
                <TouchableOpacity hitSlop={getHitSlop(10)} onPress={onFullScreen}>
                  <FastImage
                              source={isFullScreen ? images.videoNormalScreen : images.videoFullScreen }
                              resizeMode={'contain'}
                              style={{
                                  marginHorizontal: 5,
                                  height: 18,
                                  width: 18,
                                  tintColor: colors.whiteColor,
                              }}
                          />
                </TouchableOpacity>
              </Fragment>
              )}

            <TouchableOpacity onPress={onThreeDotPress}>
              <Image
                        source={images.vertical3Dot}
                        resizeMode={'contain'}
                        style={{
                            height: 18,
                            width: 18,
                            tintColor: colors.whiteColor,
                            marginHorizontal: 5,
                        }} />
            </TouchableOpacity>
          </View>
        </View>

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
          <ScrollView indicatorStyle={'white'} style={{ zIndex: 10 }}
              showsVerticalScrollIndicator={true}>
            <TouchableOpacity
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
            </TouchableOpacity>
          </ScrollView>
        </View>
          }
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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
        height: 40,
        width: 40,
    },
});

export default memo(FeedAbsoluteTopView);
