import React, { useRef } from 'react';
import {StyleSheet, View,Image, TouchableOpacity, FlatList} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import constants from '../../config/constants';
const {colors, fonts} = constants;
import PATH from '../../Constants/ImagePath';
import { Text } from 'react-native-elements';
import ActionSheet from 'react-native-actionsheet';
import SingleImage from './SingleImage';
import VideoPost from './VideoPost';
import moment from 'moment';
import Carousel from 'react-native-snap-carousel';
import PostImageSet from './PostImageSet';
import MultiPostVideo from './MultiPostVideo';
import NewsFeedDescription from './NewsFeedDescription';
import { loaderImage } from '../../Constants/LoaderImages';
import { deletePost, getPostDetails } from '../../api/NewsFeedapi';

const {fonts} = constants;

function NewsFeedPostItems({navigation, key, item, onLikePress, currentUserID}) {
    let actionSheet = useRef();
  let like = false, filterLike = [];
  if(item.own_reactions && item.own_reactions.clap) {
      filterLike = item.own_reactions.clap.map((clapItem) => {
           if(clapItem.user_id === currentUserID){
               return;
           }
        });
      if (filterLike.length > 0) {
          like = true;
      }
  }

  let fullName = '',
  userImage = '', entityType = '';
    if (item.actor && item.actor.data) {
    fullName = item.actor.data.full_name;
    userImage = item.actor.data.full_image;
    entityType = item.actor.data.entity_type;
    }
    let attachedImages = [],
    descriptions =
        'This is the test description. This is the test description. This is the test description. This is the test description. This is the test description. This is the test description. This is the test description.';
    if (item.object) {
    attachedImages = JSON.parse(item.object).attachments;
    // descriptions = JSON.parse(item.object).text;
    }

  return (
    <View key={key}>
        <View style={styles.mainContainer}>
        <Image
            style={styles.background}
            source={
            !userImage ? PATH.profilePlaceHolder : {uri: userImage}
            }
            resizeMode={'cover'}
        />
        <View style={styles.userNameView}>
            <Text style={styles.userNameTxt}>
            {item.actor.data.full_name}
            </Text>
            <Text style={styles.activeTimeAgoTxt}>
            {moment(item.time).startOf('hour').fromNow()}
            </Text>
        </View>
        <TouchableOpacity
            style={styles.dotImageTouchStyle}
            onPress={() => {
                actionSheet.current.show();
            }}>
            <Image
            style={styles.dotImageStyle}
            source={PATH.dotImage}
            resizeMode={'contain'}
            />
        </TouchableOpacity>
        </View>
        <View>
        {attachedImages.length > 0 ? (
            attachedImages.length === 1 ? (
            <FlatList
                data={attachedImages}
                horizontal={true}
                bounces={false}
                showsHorizontalScrollIndicator={false}
                ListHeaderComponent={() => {
                return <View style={{width: wp('2%')}} />;
                }}
                ListFooterComponent={() => {
                return <View style={{width: wp('2%')}} />;
                }}
                ItemSeparatorComponent={() => {
                return <View style={{width: wp('2%')}} />;
                }}
                renderItem={({item, index}) => {
                if (item.type === 'image') {
                    return (
                    <SingleImage
                        data={item}
                        itemNumber={index + 1}
                        totalItemNumber={attachedImages.length}
                    />
                    );
                }
                if (item.type === 'video') {
                    return (
                    <VideoPost
                        data={item}
                        itemNumber={index + 1}
                        totalItemNumber={attachedImages.length}
                        onVideoItemPress={() => {
                            navigation.navigate('FullVideoScreen', {url: item.url});
                        }}
                    />
                    );
                }
                }}
                keyExtractor={(item, index) => index.toString()}
            />
            ) : (
            <Carousel
                data={attachedImages}
                renderItem={({item, index}) => {
                if (item.type === 'image') {
                    return (
                    <PostImageSet
                        data={item}
                        itemNumber={index + 1}
                        totalItemNumber={attachedImages.length}
                    />
                    );
                }
                if (item.type === 'video') {
                    return (
                    <MultiPostVideo
                        data={item}
                        itemNumber={index + 1}
                        totalItemNumber={attachedImages.length}
                    />
                    );
                }
                }}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                sliderWidth={wp(100)}
                itemWidth={wp(94)}
            />
            )
        ) : (
            <View />
        )}
        {attachedImages.length > 0 ? (
            <NewsFeedDescription
            descriptions={descriptions}
            character={150}
            />
        ) : (
            <NewsFeedDescription
            descriptions={descriptions}
            character={450}
            />
        )}

        <View style={{marginTop: 10, marginLeft: 10}}></View>

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
                    source={PATH.comment}
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
                    source={PATH.share}
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
            {item.reaction_counts &&
                item.reaction_counts.clap !== undefined && (
                <Text
                    style={[
                    styles.commentlengthStyle,
                    {
                        color:
                        like == true
                            ? '#FF8A01'
                            : colors.reactionCountColor,
                    },
                    ]}>
                    {item.reaction_counts.clap > 0
                    ? item.reaction_counts.clap
                    : ''}
                </Text>
                )}
            <TouchableOpacity
                onPress={onLikePress}
                style={styles.imageTouchStyle}>
                {like == true ? (
                <Image
                    style={[styles.commentImage, {tintColor: '#FF8A01'}]}
                    source={PATH.feedLike}
                    resizeMode={'contain'}
                />
                ) : (
                <Image
                    style={styles.commentImage}
                    source={PATH.feedLike}
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
                console.log('Edit Post Pressed');
            } else if (index === 1) {
                let params = {
                    "activity_id": item.id,
                };
                deletePost(params).then((res) => {
                    console.log('Res :-', res);
                  if (res.status == true) {
                  getPostDetails().then((response) => {
                      console.log('get Res :-', response);
                      if (response.status == true) {
                        // navigation.goBack();
                      } else {
                      alert(response.messages);
                      }
                    //   setloading(false);
                  });
                  } else {
                //   setloading(false);
                  alert(res.messages);
                  }
                }, (error) => {})
            }
          }}
        />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        margin: wp('3%'),
        marginHorizontal: wp('4%'),
      },
      background: {
        height: hp('5%'),
        width: hp('5%'),
        borderRadius: hp('2.5%'),
      },
      dotImageTouchStyle: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      },
      dotImageStyle: {
        height: hp('2%'),
        width: hp('2%'),
        tintColor: colors.googleColor,
        margin: wp('1.5%'),
      },
      userNameView: {
        flexDirection: 'column',
        width: wp('70%'),
        marginLeft: wp('4%'),
      },
      userNameTxt: {
        fontSize: 16,
        fontFamily: fonts.RBold,
        color: colors.lightBlackColor,
      },
      activeTimeAgoTxt: {
        color: colors.userPostTimeColor,
        top: 2,
        fontSize: 14,
        fontFamily: fonts.RRegular,
      },
      margin: {
        marginLeft: 10,
      },
      commentShareLikeView: {
        marginHorizontal: '4%',
        marginVertical: '2%',
        flexDirection: 'row',
      },
      imageTouchStyle: {
        height: hp('3%'),
        width: hp('3%'),
        alignItems: 'center',
        justifyContent: 'center',
      },
      commentImage: {
        height: hp('2.5%'),
        width: hp('2.5%'),
        tintColor: colors.reactionCountColor,
      },
      commentlengthStyle: {
        fontSize: 14,
        marginHorizontal: 5,
        alignSelf: 'center',
        color: colors.reactionCountColor,
        fontFamily: fonts.RMedium,
      },
});

export default NewsFeedPostItems;
