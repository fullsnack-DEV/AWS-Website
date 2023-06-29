// @flow
import React from 'react';
import {View, Dimensions} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Verbs from '../../../Constants/Verbs';
import MultiPostVideo from '../MultiPostVideo';
import PostImageSet from '../PostImageSet';
import SingleImage from '../SingleImage';
import VideoPost from '../VideoPost';

const FeedMedia = ({
  data = {},
  updateCommentCount,
  item = {},
  caller_id,
  navigation,
  onImageProfilePress = () => {},
  onLikePress = () => {},
  currentParentIndex,
  parentIndex,
  childIndex,
  setChildIndex = () => {},
}) => {
  const renderSinglePostItems = (attachItem) => {
    if (attachItem?.type === Verbs.mediaTypeImage) {
      return (
        <SingleImage
          updateCommentCount={updateCommentCount}
          item={item}
          data={attachItem}
          caller_id={caller_id}
          navigation={navigation}
          onImageProfilePress={onImageProfilePress}
          onLikePress={onLikePress}
        />
      );
    }
    if (attachItem?.type === Verbs.mediaTypeVideo) {
      return (
        <VideoPost
          currentParentIndex={currentParentIndex}
          parentIndex={parentIndex}
          updateCommentCount={updateCommentCount}
          item={item}
          data={attachItem}
          caller_id={caller_id}
          navigation={navigation}
          onImageProfilePress={onImageProfilePress}
          onLikePress={onLikePress}
        />
      );
    }
    return null;
  };

  const renderMultiplePostItems = (
    multiAttachItem = {},
    index = 0,
    attachments = [],
  ) => {
    if (multiAttachItem?.type === Verbs.mediaTypeImage) {
      return (
        <PostImageSet
          updateCommentCount={updateCommentCount}
          activeIndex={index}
          data={multiAttachItem}
          itemNumber={index + 1}
          attachedImages={attachments}
          totalItemNumber={attachments.length}
          item={item}
          caller_id={caller_id}
          navigation={navigation}
          onImageProfilePress={onImageProfilePress}
          onLikePress={onLikePress}
        />
      );
    }
    if (multiAttachItem?.type === Verbs.mediaTypeVideo) {
      return (
        <MultiPostVideo
          parentIndex={parentIndex}
          currentParentIndex={currentParentIndex}
          childIndex={childIndex}
          currentChildIndex={index}
          updateCommentCount={updateCommentCount}
          activeIndex={index}
          data={multiAttachItem}
          itemNumber={index + 1}
          attachedImages={attachments}
          totalItemNumber={attachments.length}
          item={item}
          caller_id={caller_id}
          navigation={navigation}
          onImageProfilePress={onImageProfilePress}
          onLikePress={onLikePress}
        />
      );
    }
    return <View />;
  };

  if (data.attachments?.length === 0) {
    return null;
  }
  if (data.attachments?.length === 1) {
    return (
      <View style={{marginBottom: 10}}>
        {renderSinglePostItems(data.attachments[0])}
      </View>
    );
  }
  if (data.attachments?.length > 1) {
    return (
      <View style={{marginBottom: 10}}>
        <Carousel
          onSnapToItem={setChildIndex}
          data={data.attachments ?? []}
          renderItem={({item: multiAttachItem, index}) =>
            renderMultiplePostItems(
              multiAttachItem,
              index,
              data.attachments ?? [],
            )
          }
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          sliderWidth={Dimensions.get('window').width - 30}
          itemWidth={Dimensions.get('window').width - 20}
        />
      </View>
    );
  }
  return null;
};

export default FeedMedia;
