import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ActionSheet from 'react-native-actionsheet';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'
import PostDescription from './PostDescription';

function ReviewerItemView({
  item,
  onImageProfilePress,
  indexNumber,
  totalData,
  onReadMorePress,
}) {
  console.log('Index ::--', indexNumber);
  console.log('Total Data ::--', totalData);

  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const actionSheet = useRef();
  let attachedImages = [];
  const descriptions = 'This is the test description. This is the test description. This is the test description. This is the test description. This is the test description. This is the test description. This is the test description.';
  if (item.attachments) {
    attachedImages = item.attachments;
  }

  return (
    <View>
      <View style={styles.containerStyle}>
        <View style={styles.mainContainer}>
          <TouchableWithoutFeedback onPress={onImageProfilePress}>
            <Image
              style={styles.background}
              source={images.profilePlaceHolder}
              resizeMode={'cover'}
            />
          </TouchableWithoutFeedback>
          <View style={styles.userNameView}>
            <Text style={styles.userNameTxt} onPress={onImageProfilePress}>{item.userName}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
              <Text style={styles.activeTimeAgoTxt}>
                {item.created_date}
              </Text>
              <View style={styles.eventImageViewStyle}>
                <Image source={images.team_ph} style={styles.imageStyle} resizeMode={'cover'} />
              </View>
              <Text style={[styles.activeTimeAgoTxt, { fontSize: 14 }]}>{'Newyork City FC'}</Text>
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
            descriptions={descriptions}
            character={140}
            containerStyle={{ marginHorizontal: 12 }}
            onReadMorePress={onReadMorePress}
          />
          {
              attachedImages.length > 0 && <View style={styles.mainImageView}>
                {attachedImages.length >= 1 && <Image
                  source={attachedImages[0].thumbnail}
                  style={styles.postImageStyle}
                  resizeMode={'cover'}
                />}
                {attachedImages.length >= 2 && <Image
                  source={attachedImages[1].thumbnail}
                  style={styles.postImageStyle}
                  resizeMode={'cover'}
                />}
                {attachedImages.length >= 3 && <View style={styles.threePlusImageView}>
                  <Image
                      source={attachedImages[2].thumbnail}
                      style={styles.postImageStyle}
                      resizeMode={'cover'}
                  />
                  {attachedImages.length > 3 && <Text style={styles.plusCountTextStyle}>
                    {attachedImages.length > 0 ? `+${attachedImages.length - 3}` : ''}
                  </Text>}
                </View>}
              </View>
          }

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
                <TouchableOpacity
                  onPress={() => {}}
                  style={styles.imageTouchStyle}>
                  <Image
                    style={[styles.commentImage, { top: 2 }]}
                    source={images.commentImage}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
                <Text style={styles.commentlengthStyle}>1</Text>
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
                <Text style={styles.commentlengthStyle}>2</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                width: wp('32%'),
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <Text
                  style={[
                    styles.commentlengthStyle,
                    {
                      color: like === true ? '#FF8A01' : colors.reactionCountColor,
                    },
                  ]}>9</Text>
              <TouchableOpacity
                onPress={() => {
                  setLike(!like);
                  if (like) {
                    setLikeCount(likeCount - 1);
                  } else {
                    setLikeCount(likeCount + 1);
                  }
                  // onLikePress()
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
              options={['Edit Post', 'Delete Post', 'Cancel']}
              cancelButtonIndex={2}
              destructiveButtonIndex={1}
              onPress={(index) => {
                if (index === 0) {
                  // navigation.navigate('EditPostScreen', { data: item });
                } else if (index === 1) {
                  // onDeletePost();
                }
              }}
          />
        </View>
      </View>
      {(totalData.length > 3 && indexNumber === 2) && <View style={styles.maxReviewImageView}>
        <Image source={images.themeGradientImage} style={styles.maxReviewImageStyle} resizeMode={'cover'} />
      </View>}
      {(totalData.length > 3 && indexNumber === 2) && <TouchableOpacity
        style={styles.maxReviewTouchStyle}
        onPress={onReadMorePress}
      >
        <Text style={styles.maxCountTextStyle}>{totalData.length > 0 ? `+${totalData.length - 3} ` : ''}</Text>
        <Text style={styles.reviewsTextStyle}>reviews</Text>
      </TouchableOpacity>}
    </View>
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
    marginHorizontal: 12,
  },
  userNameTxt: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
  userNameView: {
    flexDirection: 'column',
    marginLeft: wp('4%'),
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
  },
  threePlusImageView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventImageViewStyle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    shadowOpacity: 0.3,
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
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
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
});

export default ReviewerItemView;
