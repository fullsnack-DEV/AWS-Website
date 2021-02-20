/* eslint-disable consistent-return */
import React, { useRef, useState, useEffect } from 'react';
import {
StyleSheet, View, Image, TouchableOpacity, Text, Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ActionSheet from 'react-native-actionsheet';
import moment from 'moment';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import PostDescription from './PostDescription';

function ReviewerItemView({
  item,
  onImageProfilePress,
  indexNumber,
  feedIndex,
  gameData,
  totalData,
  onReadMorePress,
  onFeedPress,
}) {
  const videoPlayerRef = useRef();
  const [reviewObj, setReviewObj] = useState();
  const actionSheet = useRef();
  let attachedImages = [];
  if (reviewObj?.attachments) {
    attachedImages = reviewObj.attachments;
  }
  useEffect(() => {
    console.log('Item data::=>', item);
    console.log(
      'refereeReview data::=>',
      JSON.parse(item?.object)?.refereeReview || JSON.parse(item?.object)?.scorekeeperReview,
    );
    setReviewObj(
      JSON.parse(item?.object)?.refereeReview
        || JSON.parse(item?.object)?.scorekeeperReview,
    );
  }, [item]);

  const getTeamData = () => {
    const obj = {};
    if (reviewObj?.member === 'home') {
      obj.name = item?.home_team?.data?.full_name;
      obj.image = item?.home_team?.data?.full_image ?? null;
      return obj;
    }
    if (reviewObj?.member === 'away') {
      obj.name = item?.away_team?.data?.full_name;
      obj.image = item?.away_team?.data?.full_image ?? null;
      return obj;
    }
    if (reviewObj?.member === 'referee') {
      obj.name = 'Referee';
      obj.image = images.referePH;
      return obj;
    }
    if (reviewObj?.member === 'scorekeeper') {
      obj.name = 'Scorekeeper';
      obj.image = images.scorekeeperPH;
      return obj;
    }
    if (reviewObj?.member === 'both') {
      obj.home_image = item?.home_team?.data?.full_image ?? null;
      obj.away_image = item?.away_team?.data?.full_image ?? null;
      return obj;
    }
  };
  return (
    <TouchableOpacity
      onPress={() => onFeedPress(item, feedIndex, gameData, indexNumber, false)
      }>
      <View style={styles.containerStyle}>
        <View style={styles.mainContainer}>
          <TouchableWithoutFeedback onPress={onImageProfilePress}>
            <Image
              style={styles.background}
              source={
                item?.actor?.data?.full_image
                  ? { uri: item?.actor?.data?.full_image }
                  : images.profilePlaceHolder
              }
              resizeMode={'cover'}
            />
          </TouchableWithoutFeedback>
          <View style={styles.userNameView}>
            <Text style={styles.userNameTxt} onPress={onImageProfilePress}>
              {item?.actor?.data?.full_name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 3,
              }}>
              <Text style={styles.activeTimeAgoTxt}>{moment(reviewObj?.created_at * 1000).format('MMM DD')}</Text>

              {reviewObj?.member !== 'both' ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.eventImageViewStyle}>
                  <Image
                  source={
                    (reviewObj?.member
                      === 'home' && (getTeamData()?.image ? { uri: getTeamData()?.image } : images.teamPlaceholder))
                    || (reviewObj?.member
                      === 'away' && (getTeamData()?.image ? { uri: getTeamData()?.image } : images.teamPlaceholder))
                    || (reviewObj?.member
                      === 'referee' && getTeamData()?.image)
                    || (reviewObj?.member
                      === 'scorekeeper' && getTeamData()?.image)
                  }
                  style={styles.imageStyle}
                  resizeMode={'contain'}
                />
                </View>
                <Text
                style={[
                  styles.activeTimeAgoTxt,
                  { fontSize: 12, fontFamily: fonts.RMedium },
                ]}>
                  {getTeamData()?.name}
                </Text>
              </View> : <View>
                <View style={styles.eventImageViewStyle}>
                  <Image
                  source={getTeamData()?.home_image ? { uri: getTeamData()?.home_image } : images.teamPlaceholder}
                  style={styles.imageStyle}
                  resizeMode={'contain'}
                />
                </View>
                <View style={styles.eventImageViewStyle}>
                  <Image
                  source={getTeamData()?.away_image ? { uri: getTeamData()?.away_image } : images.teamPlaceholder}
                  style={styles.imageStyle}
                  resizeMode={'contain'}
                />
                </View>
              </View>}

            </View>
          </View>
          <TouchableOpacity
            style={styles.dotImageTouchStyle}
            onPress={() => {
              actionSheet.current.show();
            }}>
            <Image
              style={styles.dotImageStyle}
              source={images.dotImage}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
        <View>
          <PostDescription
            descriptions={reviewObj?.comment ?? ''}
            character={125}
            containerStyle={{ marginHorizontal: 12 }}
            onReadMorePress={onReadMorePress}
          />
          {attachedImages.length > 0 && (
            <View style={styles.mainImageView}>
              {attachedImages.length >= 1
                && attachedImages[0]?.type?.split('/')[0] === 'image' && (
                  <Image
                    source={{ uri: attachedImages[0].thumbnail }}
                    style={styles.postImageStyle}
                    resizeMode={'cover'}
                  />
                )}
              {attachedImages.length >= 1
                && attachedImages[0]?.type?.split('/')[0] === 'video' && (
                  <View>
                    <View
                      style={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                      }}>
                      <FastImage
                        source={images.videoPlayBtn}
                        tintColor={'white'}
                        resizeMode={'contain'}
                        style={{
                          height: 30,
                          width: 30,
                        }}
                      />
                    </View>
                    <Video
                      ref={videoPlayerRef}
                      paused={false}
                      muted={true}
                      source={{ uri: attachedImages[0].url }}
                      style={styles.uploadedImage}
                      resizeMode={'cover'}
                      onLoad={() => {
                        videoPlayerRef.current.seek(0);
                      }}
                    />
                  </View>
                )}
              {attachedImages.length >= 2
                && attachedImages[1]?.type?.split('/')[0] === 'image' && (
                  <Image
                    source={{ uri: attachedImages[1].thumbnail }}
                    style={styles.postImageStyle}
                    resizeMode={'cover'}
                  />
                )}
              {attachedImages.length >= 2
                && attachedImages[1]?.type?.split('/')[0] === 'video' && (
                  <View>
                    <View
                      style={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                      }}>
                      <FastImage
                        source={images.videoPlayBtn}
                        tintColor={'white'}
                        resizeMode={'contain'}
                        style={{
                          height: 30,
                          width: 30,
                        }}
                      />
                    </View>
                    <Video
                      ref={videoPlayerRef}
                      paused={false}
                      muted={true}
                      source={{ uri: attachedImages[1].url }}
                      style={styles.uploadedImage}
                      resizeMode={'cover'}
                      onLoad={() => {
                        videoPlayerRef.current.seek(0);
                      }}
                    />
                  </View>
                )}
              {attachedImages.length >= 3
                && attachedImages[2]?.type?.split('/')[0] === 'image' && (
                  <View style={styles.threePlusImageView}>
                    <Image
                      source={{ uri: attachedImages[2].thumbnail }}
                      style={styles.postImageStyle}
                      resizeMode={'cover'}
                    />
                    {attachedImages.length > 3 && (
                      <Text style={styles.plusCountTextStyle}>
                        {attachedImages.length > 0
                          ? `+${attachedImages.length - 3}`
                          : ''}
                      </Text>
                    )}
                  </View>
                )}
              {attachedImages.length >= 3
                && attachedImages[2]?.type?.split('/')[0] === 'video' && (
                  <View style={styles.threePlusImageView}>
                    <View>
                      <View
                        style={{
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'absolute',
                        }}>
                        <FastImage
                          source={images.videoPlayBtn}
                          tintColor={'white'}
                          resizeMode={'contain'}
                          style={{
                            height: 30,
                            width: 30,
                          }}
                        />
                      </View>
                      <Video
                        ref={videoPlayerRef}
                        paused={false}
                        muted={true}
                        source={{ uri: attachedImages[2].url }}
                        style={styles.uploadedImage}
                        resizeMode={'cover'}
                        onLoad={() => {
                          videoPlayerRef.current.seek(0);
                        }}
                      />
                    </View>
                    {attachedImages.length > 3 && (
                      <Text style={styles.plusCountTextStyle}>
                        {attachedImages.length > 0
                          ? `+${attachedImages.length - 3}`
                          : ''}
                      </Text>
                    )}
                  </View>
                )}
            </View>
          )}

          <View style={{ marginTop: 10, marginLeft: 10 }}></View>

          <View style={styles.commentShareLikeView}>
            <View
              style={{
                flexDirection: 'row',
                width: wp('52%'),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Image
                  style={[styles.commentImage, { top: 2 }]}
                  source={images.commentImage}
                  resizeMode={'contain'}
                />
                <Text style={styles.commentlengthStyle}>
                  {item?.reaction_counts?.comment ?? 0}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 10,
                }}>
                <Image
                  style={styles.commentImage}
                  source={images.shareImage}
                  resizeMode={'contain'}
                />

                <Text style={styles.commentlengthStyle}>0</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                width: wp('32%'),
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <Text style={styles.commentlengthStyle}>
                {item?.reaction_counts?.clap ?? 0}
              </Text>
              <Image
                style={styles.commentImage}
                source={images.unlikeImage}
                resizeMode={'contain'}
              />
            </View>
          </View>
          <ActionSheet
            ref={actionSheet}

            options={['Report', 'Cancel']}
            cancelButtonIndex={1}
            // destructiveButtonIndex={1}
            onPress={(index) => {
              if (index === 0) {
                Alert.alert('Report pressed')
              } else if (index === 1) {
                // onDeletePost();
              }
            }}
          />
        </View>
      </View>
      {totalData?.length > 2 && indexNumber === 2 && (
        <View style={styles.maxReviewImageView}>
          <Image
            source={images.themeGradientImage}
            style={styles.maxReviewImageStyle}
            resizeMode={'cover'}
          />
        </View>
      )}
      {totalData?.length > 2 && indexNumber === 2 && (
        <TouchableOpacity
          style={styles.maxReviewTouchStyle}
          onPress={() => onFeedPress(item, feedIndex, gameData, indexNumber, true)
          }>
          <Text style={styles.maxCountTextStyle}>
            {totalData?.length > 2 && indexNumber === 2
              ? `+${totalData?.length - 2} `
              : ''}
          </Text>
          <Text style={styles.reviewsTextStyle}>reviews</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: colors.whiteColor,
    marginTop: 2,
    marginHorizontal: 6,
    marginBottom: 6,
    borderRadius: 5,
    shadowOpacity: 0.4,
    shadowOffset: {
      height: 2,
      width: 1,
    },
    shadowColor: colors.lightBlackColor,
    elevation: 10,
  },
  activeTimeAgoTxt: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
  },
  background: {
    borderRadius: hp('2.5%'),
    height: hp('5%'),
    width: hp('5%'),
  },
  commentImage: {
    height: 32,
    width: 32,
  },
  commentShareLikeView: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: '2%',
    marginBottom: 10,
  },
  commentlengthStyle: {
    alignSelf: 'center',
    color: colors.reactionCountColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
    marginHorizontal: 5,
  },
  dotImageStyle: {
    height: 15,
    margin: wp('1.5%'),
    tintColor: colors.googleColor,
    width: 15,
  },
  dotImageTouchStyle: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },

  mainContainer: {
    flexDirection: 'row',
    margin: wp('3%'),
    marginHorizontal: 12,
    alignItems: 'center',
  },
  userNameTxt: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
  userNameView: {
    flexDirection: 'column',
    marginLeft: wp('3%'),
    width: wp('63%'),
  },
  mainImageView: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginTop: 10,
  },
  plusCountTextStyle: {
    position: 'absolute',
    fontSize: 20,
    fontFamily: fonts.RRegular,
    color: colors.whiteColor,
  },
  postImageStyle: {
    height: wp(28),
    width: wp(28),
    borderRadius: wp(3),
    resizeMode: 'cover',
    marginRight: 5,
    // backgroundColor: 'red',
  },
  threePlusImageView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventImageViewStyle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    elevation: 5,
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  imageStyle: {
    width: 15,
    height: 15,
    borderRadius: 30,
  },
  maxReviewImageView: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 6,
    elevation: 10,
  },
  maxReviewImageStyle: {
    width: wp(100) - 36,
    borderRadius: 5,
  },
  maxReviewTouchStyle: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(100) - 36,
    bottom: 0,
    left: 6,
    top: 0,
    elevation: 10,
  },
  maxCountTextStyle: {
    fontSize: 60,
    fontFamily: fonts.RBold,
    left: 12,
    color: colors.whiteColor,
  },
  reviewsTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.whiteColor,
  },
  uploadedImage: {
    borderRadius: wp('3%'),
    height: wp('28%'),
    marginVertical: '1%',
    width: wp('28%'),
  },
});

export default ReviewerItemView;
