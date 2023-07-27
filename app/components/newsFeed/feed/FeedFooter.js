// @flow
import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text} from 'react-native';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';

const FeedFooter = ({
  like = false,
  likeCount = 0,
  repostCount = 0,
  commentCount = 0,
  setShowLikeModal = () => {},
  onWriteCommentPress = () => {},
  onNewsFeedLikePress = () => {},
  setShowShareOptionsModal = () => {},
}) => (
  <>
    <View
      style={[styles.row, {justifyContent: 'space-between', marginTop: 15}]}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.commentShareLikeView}
          onPress={onNewsFeedLikePress}>
          <Image
            source={like ? images.likeImage : images.unlikeImage}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onWriteCommentPress}
          style={[styles.commentShareLikeView, {marginLeft: 15}]}>
          <Image style={styles.icon} source={images.commentImage} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          setShowShareOptionsModal();
        }}
        style={styles.commentShareLikeView}>
        <Image style={styles.icon} source={images.shareImage} />
      </TouchableOpacity>
    </View>

    {likeCount > 0 || commentCount > 0 || repostCount > 0 ? (
      <>
        <View
          style={{
            height: 1,
            backgroundColor: colors.grayBackgroundColor,
            marginTop: 15,
          }}
        />
        {/* Like comments count part */}
        <View
          style={[
            styles.row,
            {paddingTop: 15, justifyContent: 'space-between'},
          ]}>
          <View style={styles.row}>
            {likeCount > 0 ? (
              <TouchableOpacity
                onPress={() => setShowLikeModal()}
                style={styles.row}>
                <Text style={styles.likeText}>
                  {likeCount <= 0 ? 0 : likeCount}{' '}
                </Text>
                <Text style={styles.likeText}>
                  {likeCount > 1 ? strings.likesTitle : strings.likeTitle}
                </Text>
              </TouchableOpacity>
            ) : null}
            {likeCount > 0 && commentCount > 0 ? (
              <View style={styles.divider} />
            ) : null}
            {commentCount > 0 ? (
              <TouchableOpacity
                onPress={onWriteCommentPress}
                style={styles.row}>
                <Text style={styles.likeText}>
                  {commentCount <= 0 ? 0 : commentCount}{' '}
                </Text>
                <Text style={styles.likeText}>
                  {commentCount > 1 ? strings.comments : strings.comment}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {repostCount > 0 ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.likeText}>
                {repostCount <= 0 ? 0 : repostCount}{' '}
              </Text>
              <Text style={styles.likeText}>
                {repostCount > 1 ? strings.reposts : strings.repost}
              </Text>
            </View>
          ) : null}
        </View>
      </>
    ) : null}
  </>
);

const styles = StyleSheet.create({
  commentShareLikeView: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.veryLightBlack,
    fontFamily: fonts.RRegular,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: colors.veryLightBlack,
    marginHorizontal: 10,
  },
});
export default FeedFooter;
