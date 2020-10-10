import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import ParsedText from 'react-native-parsed-text';
import {TagSelect} from 'react-native-tag-select';
import constants from '../../config/constants';
const {colors, fonts} = constants;
import PATH from '../../Constants/ImagePath';
import moment from 'moment';

export default function NewsFeedList({navigation, newsFeedData, postData}) {
  console.log('Post Data :-', postData);

  const [searchText, setSearchText] = useState(false);
  const [id, setId] = useState();

  // likePress = (item) => {
  //   console.log('selected item', item);
  //   // setSearchText(!item.likeValue)
  //   setId(item.id);
  //   const search = setSearchText(!searchText);

  //   console.log('search', search);
  //   console.log('id', id);
  // };

  return (
    <View>
      <FlatList
        data={postData}
        ItemSeparatorComponent={() => (
          <View
            style={{
              marginTop: 10,
              height: 8,
              backgroundColor: colors.postSeprator,
            }}
          />
        )}
        ListFooterComponent={() => (
          <View
            style={{
              height: 20,
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
        renderItem={({item, key}) => {
          let attachedImages = [],
            descriptions = '';
          if (item.object) {
            attachedImages = JSON.parse(item.object).attachments;
            descriptions = JSON.parse(item.object).text;
          }
          return (
            <View key={key}>
              <View style={styles.mainContainer}>
                <Image
                  style={styles.background}
                  source={PATH.profilePlaceHolder}
                  resizeMode={'contain'}
                />
                <View style={styles.userNameView}>
                  <Text style={styles.userNameTxt}>
                    {item.actor.data.full_name}
                  </Text>
                  <Text style={styles.activeTimeAgoTxt}>
                    {moment(item.time).startOf('hour').fromNow()}
                  </Text>
                </View>
              </View>
              <View>
                {attachedImages.length > 0 ? (
                  attachedImages.length === 1 ? (
                    <FlatList
                      data={attachedImages}
                      horizontal={true}
                      bounces={false}
                      showsHorizontalScrollIndicator={false}
                      ItemSeparatorComponent={() => {
                        return <View style={{width: wp(1)}} />;
                      }}
                      renderItem={({item, index}) => {
                        if (item.type === 'image') {
                          return (
                            // <Image
                            //   style={styles.singleImageDisplayStyle}
                            //   source={{uri: item.thumbnail}}
                            //   resizeMode={'cover'}
                            // />
                            <FastImage
                              style={styles.singleImageDisplayStyle}
                              source={{
                                uri: item.thumbnail,
                              }}
                              resizeMode={FastImage.resizeMode.cover}
                            />
                          );
                        }
                        if (item.type === 'video') {
                          return (
                            <Video
                              repeat={true}
                              source={{uri: item.url}}
                              style={styles.singleImageDisplayStyle}
                              resizeMode={'contain'}
                            />
                          );
                        }
                      }}
                    />
                  ) : (
                    <FlatList
                      data={attachedImages}
                      horizontal={true}
                      bounces={false}
                      showsHorizontalScrollIndicator={false}
                      ItemSeparatorComponent={() => {
                        return <View style={{width: wp(1)}} />;
                      }}
                      renderItem={({item, index}) => {
                        return (
                          <FastImage
                            style={styles.uploadedImage}
                            source={{
                              uri: item.thumbnail,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        );
                      }}
                    />
                  )
                ) : (
                  <View />
                )}
                {/* {descriptions.length > 0 && (
                  <Text style={styles.descriptionTxt}>{descriptions}</Text>
                )} */}
                <View style={{marginTop: 10, marginLeft: 10}}></View>

                <View style={styles.commentShareLikeView}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('WriteCommentScreen');
                    }}>
                    <Image
                      style={styles.commentImage}
                      source={PATH.comment}></Image>
                  </TouchableOpacity>
                  <Image
                    style={styles.shareImage}
                    source={PATH.exitGrey}></Image>
                  <View style={styles.likeImageView}>
                    <TouchableOpacity
                      onPress={() => {
                        // this.likePress(item)
                        console.log('selected item', item);
                        // setSearchText(!item.likeValue)
                        setId(item.id);
                        const search = setSearchText(!searchText);

                        console.log('search', search);
                        console.log('id', id);
                      }}>
                      {searchText == true && id == item.id ? (
                        <Image
                          style={[styles.likeImage, {tintColor: '#ff892c'}]}
                          source={PATH.feedLike}></Image>
                      ) : (
                        <Image
                          style={styles.likeImage}
                          source={PATH.feedLike}></Image>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <View>
                  <View
                    style={{
                      marginVertical: 8,
                      height: 1,
                      backgroundColor: colors.disableColor,
                    }}
                  />
                  <View style={styles.commentShareLikeTxtView}>
                    <Text style={styles.commentNo}>12 comments</Text>
                    <Text style={styles.shareNo}>1 share</Text>

                    <View style={styles.LikeTxtView}>
                      <Text style={styles.likeTxt}>22 Likes</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    margin: wp('2%'),
  },
  background: {
    height: hp('5%'),
    width: hp('5%'),
  },
  userNameView: {
    flexDirection: 'column',
  },
  userNameTxt: {
    marginLeft: wp('2%'),
    fontFamily: fonts.LBold,
  },
  activeTimeAgoTxt: {
    marginLeft: wp('2%'),
    color: 'grey',
    top: 4,
  },
  margin: {
    marginLeft: 10,
  },
  singleImageDisplayStyle: {
    height: hp('35%'),
    width: wp('100%'),
    marginTop: '2%',
  },
  uploadedImage: {
    height: hp('20%'),
    width: wp('49%'),
    marginTop: '2%',
  },
  descriptionTxt: {
    padding: '2%',
    fontSize: 17,
  },
  commentShareLikeView: {
    marginHorizontal: '5%',
    marginVertical: '2%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentImage: {
    height: 24,
    width: 24,
  },
  shareImage: {
    height: 22,
    width: 30,
    marginRight: wp('55%'),
  },
  likeImageView: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  likeImage: {
    height: 24,
    width: 24,
  },
  commentShareLikeTxtView: {
    marginLeft: '5%',
    marginRight: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentNo: {fontSize: 15, color: 'grey'},
  shareNo: {fontSize: 15, color: 'grey', marginRight: wp('25%')},
  likeTxtView: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  likeTxt: {fontSize: 15, color: 'grey'},

  mainContainers: {
    flexDirection: 'row',
    //backgroundColor: 'red',
    height: 70,
    marginTop: hp('5%'),
  },
  profileImg: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    backgroundColor: colors.themeColor,
    marginLeft: 10,
    alignSelf: 'center',
    borderRadius: 35,
    borderWidth: 1,
    borderColor: colors.whiteColor,
  },

  separatorLine: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: colors.grayColor,

    justifyContent: 'center',
    alignItems: 'center',
    width: wp('100%'),
    height: 0.5,
  },

  writePostText: {
    marginLeft: wp('2.5%'),

    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.whiteColor,

    shadowRadius: 0.5,
    shadowOffset: {width: 0, height: 1},
    shadowColor: colors.googleColor,
    shadowOpacity: 0.5,

    fontSize: wp('3.6%'),
    color: colors.grayColor,
    backgroundColor: colors.whiteColor,

    padding: 8,
    paddingLeft: 12,
    alignSelf: 'center',

    height: 40,
    width: wp('80%'),
  },
});
