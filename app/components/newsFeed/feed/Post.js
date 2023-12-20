// @flow
import React from 'react';
import {StyleSheet, View} from 'react-native';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {getPostData} from '../../../utils';
import CustomURLPreview from '../../account/CustomURLPreview';
import NewsFeedDescription from '../NewsFeedDescription';
import FeedMedia from './FeedMedia';
import FeedProfile from './FeedProfile';

const Post = ({
  item = {},
  onImageProfilePress = () => {},
  onThreeDotPress = () => {},
  updateCommentCount,
  caller_id,
  navigation,
  onLikePress,
  currentParentIndex,
  parentIndex,
  childIndex,
  setChildIndex,
  isNewsFeedScreen = false,
  openProfilId,
  isRepost = false,
  showMoreOptions = false,
}) => {
  const postData = getPostData(item);
  const repostActivity = {...postData.activity};
  const repostData = getPostData(repostActivity);
  const data = isRepost ? repostData : postData;

  const renderURLPreview = () => {
    const obj =
      typeof item?.object === 'string'
        ? JSON.parse(item?.object)
        : item?.object;
    return <CustomURLPreview text={obj?.text} />;
  };

  return (
    <View>
      <View style={{paddingHorizontal: 15}}>
        <FeedProfile
          time={item.time}
          data={item.actor.data}
          onImageProfilePress={onImageProfilePress}
          isRepost={false}
          onThreeDotPress={onThreeDotPress}
          showMoreOptions={showMoreOptions}
        />
      </View>
      {isRepost && (
        <>
          <View style={{marginBottom: 15, paddingHorizontal: 15}}>
            <NewsFeedDescription
              descriptions={postData.text}
              numberOfLineDisplay={postData.attachments?.length > 0 ? 3 : 14}
              tagData={postData.format_tagged_data ?? []}
              navigation={navigation}
              isNewsFeedScreen={isNewsFeedScreen}
              openProfilId={openProfilId}
            />
          </View>
          <FeedMedia
            data={repostData}
            updateCommentCount={updateCommentCount}
            item={item}
            caller_id={caller_id}
            navigation={navigation}
            onImageProfilePress={onImageProfilePress}
            onLikePress={onLikePress}
            currentParentIndex={currentParentIndex}
            parentIndex={parentIndex}
            childIndex={childIndex}
            setChildIndex={setChildIndex}
          />
        </>
      )}
      <View style={isRepost ? styles.repostContainer : {flex: 1}}>
        {isRepost ? (
          <View style={{paddingHorizontal: 15}}>
            <FeedProfile
              time={repostActivity.time}
              data={repostActivity.actor.data}
              onImageProfilePress={onImageProfilePress}
              isRepost
              onThreeDotPress={onThreeDotPress}
            />
          </View>
        ) : (
          <FeedMedia
            data={postData}
            updateCommentCount={updateCommentCount}
            item={item}
            caller_id={caller_id}
            navigation={navigation}
            onImageProfilePress={onImageProfilePress}
            onLikePress={onLikePress}
            currentParentIndex={currentParentIndex}
            parentIndex={parentIndex}
            childIndex={childIndex}
            setChildIndex={setChildIndex}
          />
        )}
        <View style={{paddingHorizontal: 15}}>
          <NewsFeedDescription
            descriptions={data.text}
            numberOfLineDisplay={data.attachments?.length > 0 ? 3 : 14}
            tagData={data.format_tagged_data ?? []}
            navigation={navigation}
            isNewsFeedScreen={isNewsFeedScreen}
            openProfilId={openProfilId}
            descText={isRepost ? styles.repostText : {}}
            descriptionTxt={isRepost ? styles.repostText : {}}
          />
        </View>

        {!isRepost ? (
          <View style={{paddingHorizontal: 15}}>{renderURLPreview()}</View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  repostContainer: {
    marginLeft: 5,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.grayBackgroundColor,
  },
  repostText: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
  },
});

export default Post;
