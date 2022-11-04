import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Text} from 'react-native-elements';
import ActionSheet from 'react-native-actionsheet';

import Carousel from 'react-native-snap-carousel';
import images from '../../Constants/ImagePath';
import SingleImage from '../newsFeed/SingleImage';
import VideoPost from '../newsFeed/VideoPost';
import PostImageSet from '../newsFeed/PostImageSet';
import MultiPostVideo from '../newsFeed/MultiPostVideo';
import NewsFeedDescription from '../newsFeed/NewsFeedDescription';
import {formatTimestampForDisplay} from '../../utils/formatTimestampForDisplay';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {strings} from '../../../Localization/translation';

function RefereeReviewItem({
  navigation,
  key,
  item,
  onLikePress,
  caller_id,
  onDeletePost,
  onImageProfilePress,
}) {
  const [like, setLike] = useState(() => {
    let filterLike = [];
    if (item.own_reactions && item.own_reactions.clap) {
      filterLike = item.own_reactions.clap.filter(
        (clapItem) => clapItem.user_id === caller_id,
      );
      if (filterLike.length > 0) {
        return true;
      }
      return false;
    }
    return false;
  });
  const [likeCount, setLikeCount] = useState(() => {
    if (item.reaction_counts && item.reaction_counts.clap !== undefined) {
      return item.reaction_counts.clap;
    }
    return 0;
  });

  useEffect(() => {
    if (item.reaction_counts && item.reaction_counts.clap !== undefined) {
      setLikeCount(item.reaction_counts.clap);
    }
  }, [item]);
  const actionSheet = useRef();

  let userImage = '';
  if (item.actor && item.actor.data) {
    userImage = item.actor.data.full_image;
  }

  let attachedImages = [];
  let descriptions =
    'This is the test description. This is the test description. This is the test description. This is the test description. This is the test description. This is the test description. This is the test description.';
  if (item.object) {
    if (
      JSON.parse(item.object).attachments !== undefined &&
      JSON.parse(item.object).attachments.length > 0
    ) {
      attachedImages = JSON.parse(item.object).attachments;
    }
    descriptions = JSON.parse(item.object).text;
  }

  return (
    <View key={key}>
      <View style={styles.mainContainer}>
        <TouchableWithoutFeedback onPress={onImageProfilePress}>
          <Image
            style={styles.background}
            source={!userImage ? images.profilePlaceHolder : {uri: userImage}}
            resizeMode={'cover'}
          />
        </TouchableWithoutFeedback>
        <View style={styles.userNameView}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.userNameTxt} onPress={onImageProfilePress}>
              {item.actor.data.full_name}
            </Text>
            <Text
              style={[
                styles.userNameTxt,
                {fontFamily: fonts.RRegular, marginLeft: 5},
              ]}>
              {'left a review'}
            </Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 3}}>
            <Text style={styles.activeTimeAgoTxt}>
              {formatTimestampForDisplay(item.time)}
            </Text>
            <View style={styles.eventImageViewStyle}>
              <Image
                source={images.usaImage}
                style={styles.imageStyle}
                resizeMode={'contain'}
              />
            </View>
            <Text
              style={[
                styles.activeTimeAgoTxt,
                {fontSize: 12, fontFamily: fonts.RMedium},
              ]}>
              {'Newyork City FC'}
            </Text>
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
      <View style={{marginTop: 10}} />
      {attachedImages.length > 0 ? (
        <NewsFeedDescription descriptions={descriptions} character={140} />
      ) : (
        <NewsFeedDescription descriptions={descriptions} character={420} />
      )}
      <View style={{marginTop: 10}} />
      <View>
        {attachedImages && attachedImages.length === 1 ? (
          <FlatList
            data={attachedImages}
            horizontal={true}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            ListHeaderComponent={() => <View style={{width: wp('2%')}} />}
            ListFooterComponent={() => <View style={{width: wp('2%')}} />}
            ItemSeparatorComponent={() => <View style={{width: wp('2%')}} />}
            renderItem={({item: attachItem}) => {
              if (attachItem.type === 'image') {
                return <SingleImage data={attachItem} />;
              }
              if (attachItem.type === 'video') {
                return <VideoPost data={attachItem} />;
              }
              return <View />;
            }}
            keyExtractor={(index) => index.toString()}
          />
        ) : (
          <Carousel
            data={attachedImages}
            renderItem={({item: multiAttachItem, index}) => {
              if (multiAttachItem.type === 'image') {
                return (
                  <PostImageSet
                    activeIndex={index}
                    data={multiAttachItem}
                    itemNumber={index + 1}
                    attachedImages={attachedImages}
                    totalItemNumber={attachedImages.length}
                  />
                );
              }
              if (multiAttachItem.type === 'video') {
                return (
                  <MultiPostVideo
                    activeIndex={index}
                    data={multiAttachItem}
                    itemNumber={index + 1}
                    attachedImages={attachedImages}
                    totalItemNumber={attachedImages.length}
                  />
                );
              }
              return <View />;
            }}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            sliderWidth={wp(100)}
            itemWidth={wp(94)}
          />
        )}

        <View style={styles.commentShareLikeView}>
          <View
            style={{
              flexDirection: 'row',
              width: wp('60%'),
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('WriteCommentScreen', {
                    data: item,
                  });
                }}
                style={styles.imageTouchStyle}>
                <Image
                  style={styles.commentImage}
                  source={images.commentImage}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
              {item.reaction_counts &&
                item.reaction_counts.comment !== undefined && (
                  <Text style={styles.commentlengthStyle}>
                    {item.reaction_counts.comment > 0
                      ? item.reaction_counts.comment
                      : ''}
                  </Text>
                )}
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 10,
              }}>
              <TouchableOpacity
                onPress={() => {}}
                style={styles.imageTouchStyle}>
                <Image
                  style={styles.commentImage}
                  source={images.shareImage}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
              <Text style={styles.commentlengthStyle}>99,999</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              width: wp('32%'),
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            {item.reaction_counts && item.reaction_counts.clap !== undefined && (
              <Text
                style={[
                  styles.commentlengthStyle,
                  {
                    color:
                      like === true ? '#FF8A01' : colors.reactionCountColor,
                  },
                ]}>
                {likeCount === 0 ? '' : likeCount}
              </Text>
            )}
            <TouchableOpacity
              onPress={() => {
                setLike(!like);
                if (like) {
                  setLikeCount(likeCount - 1);
                } else {
                  setLikeCount(likeCount + 1);
                }
                onLikePress();
              }}
              style={styles.imageTouchStyle}>
              {like === true ? (
                <Image
                  style={styles.commentImage}
                  source={images.likeImage}
                  resizeMode={'contain'}
                />
              ) : (
                <Image
                  style={styles.commentImage}
                  source={images.unlikeImage}
                  resizeMode={'contain'}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <ActionSheet
          ref={actionSheet}
          title={'News Feed Post'}
          options={['Edit Post', 'Delete Post', strings.cancel]}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={(index) => {
            if (index === 0) {
              navigation.navigate('EditPostScreen', {data: item});
            } else if (index === 1) {
              onDeletePost();
            }
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    height: 15,
    width: 15,
    alignSelf: 'flex-end',
  },
  commentShareLikeView: {
    flexDirection: 'row',
    marginHorizontal: '4%',
    marginVertical: '2%',
  },
  commentlengthStyle: {
    alignSelf: 'center',
    color: colors.reactionCountColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
    marginHorizontal: 5,
  },
  dotImageStyle: {
    height: hp('2%'),
    margin: wp('1.5%'),
    tintColor: colors.googleColor,
    width: hp('2%'),
  },
  dotImageTouchStyle: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  imageTouchStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    flexDirection: 'row',
    margin: wp('3%'),
    marginHorizontal: wp('4%'),
  },
  userNameTxt: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
  userNameView: {
    flexDirection: 'column',
    marginLeft: wp('4%'),
    width: wp('70%'),
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
  },
});

export default RefereeReviewItem;
