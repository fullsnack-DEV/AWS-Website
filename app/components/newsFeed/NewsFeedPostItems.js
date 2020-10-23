import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Text } from 'react-native-elements';
import ActionSheet from 'react-native-actionsheet';

import Carousel from 'react-native-snap-carousel';
import images from '../../Constants/ImagePath';
import SingleImage from './SingleImage';
import VideoPost from './VideoPost';
import PostImageSet from './PostImageSet';
import MultiPostVideo from './MultiPostVideo';
import NewsFeedDescription from './NewsFeedDescription';
import {
  commentPostTimeCalculate,
} from '../../Constants/LoaderImages';
import { deletePost, getPostDetails } from '../../api/NewsFeedapi';

import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'

function NewsFeedPostItems({
  navigation,
  key,
  item,
  onLikePress,
  currentUserID,
}) {
  const actionSheet = useRef();
  let like = false;
  let filterLike = [];
  if (item.own_reactions && item.own_reactions.clap) {
    filterLike = item.own_reactions.clap.filter((clapItem) => clapItem.user_id === currentUserID);
    if (filterLike.length > 0) {
      like = true;
    }
  }

  let userImage = '';
  if (item.actor && item.actor.data) {
    userImage = item.actor.data.full_image;
  }

  let attachedImages = [];
  let descriptions = 'This is the test description. This is the test description. This is the test description. This is the test description. This is the test description. This is the test description. This is the test description.';
  if (item.object) {
    if (JSON.parse(item.object).attachments !== undefined && JSON.parse(item.object).attachments.length > 0) {
      attachedImages = JSON.parse(item.object).attachments;
    }
    descriptions = JSON.parse(item.object).text;
  }

  return (
    <View key={key}>
      <View style={styles.mainContainer}>
        <Image
          style={styles.background}
          source={!userImage ? images.profilePlaceHolder : { uri: userImage }}
          resizeMode={'cover'}
        />
        <View style={styles.userNameView}>
          <Text style={styles.userNameTxt}>{item.actor.data.full_name}</Text>
          <Text style={styles.activeTimeAgoTxt}>
            {/* {moment(item.time).startOf('hour').fromNow()} */}
            {commentPostTimeCalculate(item.time)}
          </Text>
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
        {
                attachedImages && attachedImages.length === 1 ? (
                  <FlatList
              data={attachedImages}
              horizontal={true}
              bounces={false}
              showsHorizontalScrollIndicator={false}
              ListHeaderComponent={() => <View style={{ width: wp('2%') }} />}
              ListFooterComponent={() => <View style={{ width: wp('2%') }} />}
              ItemSeparatorComponent={() => <View style={{ width: wp('2%') }} />}
              renderItem={({ item: attachItem }) => {
                if (attachItem.type === 'image') {
                  return <SingleImage data={attachItem} />;
                }
                if (attachItem.type === 'video') {
                  return (
                    <VideoPost
                      data={attachItem}
                      onVideoItemPress={() => {
                        // navigation.navigate('FullVideoScreen', {url: attachItem.url});
                      }}
                    />
                  );
                }
                return <View />;
              }}
              keyExtractor={(index) => index.toString()}
            />
                ) : (
                  <Carousel
              data={attachedImages}
              renderItem={({ item: multiAttachItem, index }) => {
                if (multiAttachItem.type === 'image') {
                  return (
                    <PostImageSet
                      data={multiAttachItem}
                      itemNumber={index + 1}
                      totalItemNumber={attachedImages.length}
                    />
                  );
                }
                if (multiAttachItem.type === 'video') {
                  return (
                    <MultiPostVideo
                      data={multiAttachItem}
                      itemNumber={index + 1}
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
                )
              }
        {attachedImages.length > 0 ? (
          <NewsFeedDescription descriptions={descriptions} character={140} />
        ) : (
          <NewsFeedDescription descriptions={descriptions} character={650} />
        )}

        <View style={{ marginTop: 10, marginLeft: 10 }}></View>

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
                  source={images.comment}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
              {item.reaction_counts
                && item.reaction_counts.comment !== undefined && (
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
                  source={images.share}
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
                    color: like === true ? '#FF8A01' : colors.reactionCountColor,
                  },
                ]}>
                {item.reaction_counts.clap > 0 ? item.reaction_counts.clap : ''}
              </Text>
            )}
            <TouchableOpacity
              onPress={onLikePress}
              style={styles.imageTouchStyle}>
              {like === true ? (
                <Image
                  style={[styles.commentImage, { tintColor: '#FF8A01' }]}
                  source={images.feedLike}
                  resizeMode={'contain'}
                />
              ) : (
                <Image
                  style={styles.commentImage}
                  source={images.feedLike}
                  resizeMode={'contain'}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <ActionSheet
                ref={actionSheet}
                title={'News Feed Post'}
                options={['Edit Post', 'Delete Post', 'Cancel']}
                cancelButtonIndex={2}
                destructiveButtonIndex={1}
                onPress={(index) => {
                  if (index === 0) {
                    navigation.navigate('EditPostScreen', { data: item });
                  } else if (index === 1) {
                    const params = {
                      activity_id: item.id,
                    };
                    deletePost(params)
                      .then(() => getPostDetails())
                      .then(() => navigation.goBack())
                      .catch((e) => Alert.alert('', e.messages));
                  }
                }}
              />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activeTimeAgoTxt: {
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    top: 2,
  },
  background: {
    borderRadius: hp('2.5%'),
    height: hp('5%'),
    width: hp('5%'),
  },
  commentImage: {
    height: hp('2.5%'),
    tintColor: colors.reactionCountColor,
    width: hp('2.5%'),
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
    height: hp('3%'),
    justifyContent: 'center',
    width: hp('3%'),
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
});

export default NewsFeedPostItems;
