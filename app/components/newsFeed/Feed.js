import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';

import Moment from 'moment';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import images from '../../Constants/ImagePath';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

const {width} = Dimensions.get('window');

function Feed({data, navigation}) {
  const {navigate} = navigation;

  const json = JSON.parse(data.object);

  const renderItem = ({index}) => {
    if (json.attachments.length >= 3) {
      return (
        <TouchableWithoutFeedback>
          <View>
            <Image
              source={{uri: json.attachments[index].thumbnail}}
              style={styles.multipleMedia}
            />
            <View
              style={{
                backgroundColor: colors.blackColor,
                height: 20,
                width: 30,
                borderRadius: 10,
                position: 'absolute',
                right: 10,
                top: 10,
                opacity: 0.5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: colors.whiteColor,
                  // fontFamily: fonts.RRegular,
                  fontSize: wp('2.8%'),
                }}
              >
                {index + 1}/{json.attachments.length}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    }
    if (json.attachments.length === 2) {
      return (
        <TouchableWithoutFeedback
          style={styles.listItem}
          onPress={() =>
            console.log('Image pressed..', json.attachments[index].thumbnail)
          }
        >
          <View>
            <Image
              source={{uri: json.attachments[index].thumbnail}}
              style={styles.twoMedia}
            />
            <View
              style={{
                backgroundColor: colors.blackColor,
                height: 20,
                width: 30,
                borderRadius: 10,
                position: 'absolute',
                right: 10,
                top: 10,
                opacity: 0.5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: colors.whiteColor,
                  // fontFamily: fonts.RRegular,
                  fontSize: wp('2.8%'),
                }}
              >
                {index + 1}/{json.attachments.length}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    }
    if (
      json.attachments.length === 1 &&
      json.attachments[index].media_width > json.attachments[index].media_height
    ) {
      return (
        <TouchableWithoutFeedback
          style={styles.listItem}
          onPress={() =>
            pushToPostDetail(
              json.attachments[index].type,
              json.attachments[index].url,
            )
          }
        >
          <Image
            source={{uri: json.attachments[index].thumbnail}}
            style={styles.singleMediaLandscap}
          />
        </TouchableWithoutFeedback>
      );
    }
    if (
      json.attachments.length === 1 &&
      json.attachments[index].media_width < json.attachments[index].media_height
    ) {
      return (
        <TouchableWithoutFeedback
          style={styles.listItem}
          onPress={() =>
            pushToPostDetail(
              json.attachments[index].type,
              json.attachments[index].url,
            )
          }
        >
          <Image
            source={{uri: json.attachments[index].thumbnail}}
            style={styles.singleMediaPortrait}
          />
        </TouchableWithoutFeedback>
      );
    }
    return <View />;
  };
  const pushToPostDetail = (type, url) => {
    if (type === 'video') {
      navigate('NewsFeedVideoPlayer', {url});
    } else {
      navigate('NewsFeedVideoPlayer');
    }
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.feedheader}>
        {data.actor.data.entity_type === 'club' ? (
          <Image
            style={styles.clubProfileImg}
            source={{uri: data.actor.data.thumbnail}}
          />
        ) : null}
        {data.actor.data.entity_type === 'team' ? (
          <Image
            style={styles.profileImg}
            source={{uri: data.actor.data.thumbnail}}
          />
        ) : null}
        {data.actor.data.entity_type === 'player' ? (
          <Image
            style={styles.profileImg}
            source={{uri: data.actor.data.thumbnail}}
          />
        ) : null}
        <View style={styles.entityheader}>
          <Text style={styles.entityName}>{data.actor.data.full_name}</Text>
          <Text style={styles.date}>{Moment(data.time).format('MMM d')}</Text>
        </View>
      </View>
      <FlatList
        data={json.attachments}
        keyExtractor={() => json.attachments.url}
        renderItem={renderItem}
        horizontal={true}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View style={styles.separatorLine}></View>
        )}
        style={{marginTop: 10}}
      />
      <Text style={styles.feedDescription}>{json.text}</Text>

      <View style={styles.feedBottomView}>
        <Image style={styles.commentImage} source={images.feedComment} />
        <Image style={styles.shareImage} source={images.feedShare} />

        <Image style={styles.likeImage} source={images.feedLike} />
      </View>
      {data.reaction_counts.clap === 0 ? (
        <View style={styles.deviderLineWithoutMargin} />
      ) : (
        <View style={styles.deviderLine} />
      )}

      {data.reaction_counts.clap > 0 || data.reaction_counts.comment > 0 ? (
        <View style={styles.feedBottomView}>
          {data.reaction_counts.comment > 0 && (
            <Text style={styles.noOfComment}>
              {data.reaction_counts.comment} Comments
            </Text>
          )}
          {data.reaction_counts.clap > 0 && (
            <Text style={styles.noOfLike}>
              {data.reaction_counts.clap} Likes
            </Text>
          )}
        </View>
      ) : null}
      {data.reaction_counts.comment > 0 ? (
        <View style={styles.feedBottomView}>
          <Text style={styles.comment}>Hi</Text>

          <Text style={styles.commentTime}>Just now</Text>
        </View>
      ) : null}
      {data.reaction_counts.comment >= 2 ? (
        <View style={styles.viewMore}>
          <Text style={styles.moreComment}>
            view {data.reaction_counts.comment - 1} more comments
          </Text>
        </View>
      ) : null}

      <View style={styles.feedSeparatorLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  clubProfileImg: {
    alignSelf: 'center',
    borderColor: colors.whiteColor,
    borderRadius: 8,
    borderWidth: 1,
    height: 50,
    marginLeft: 10,
    resizeMode: 'cover',
    width: 50,
  },
  comment: {
    marginLeft: 15,

    // fontFamily: fonts.RRegular
    fontSize: wp('4%'),
    color: colors.blackColor,
  },
  commentImage: {
    height: 25,
    marginLeft: 15,
    resizeMode: 'contain',
    tintColor: colors.googleColor,

    width: 25,
  },
  commentTime: {
    position: 'absolute',
    right: 20,

    // fontFamily: fonts.RRegular,
    fontSize: wp('3%'),
    color: colors.grayColor,
  },

  date: {
    marginLeft: wp('2.5%'),

    // fontFamily: fonts.RRegular,
    fontSize: wp('3.6%'),
    color: colors.grayColor,

    paddingLeft: 8,
    alignSelf: 'center',

    width: wp('80%'),
  },

  deviderLine: {
    backgroundColor: colors.grayBackgroundColor,
    height: 1,
    marginTop: 10,
    width: wp('100%'),
  },
  deviderLineWithoutMargin: {
    backgroundColor: colors.whiteColor,
    height: 1,
    width: wp('100%'),
  },
  entityName: {
    marginLeft: wp('2.5%'),

    // fontFamily: fonts.RBold,
    fontSize: wp('4%'),
    color: colors.blackColor,

    paddingLeft: 8,
    alignSelf: 'center',

    width: wp('80%'),
  },
  entityheader: {
    alignSelf: 'center',
  },
  feedBottomView: {
    flexDirection: 'row',
    marginTop: 10,
  },
  feedDescription: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,

    // fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
  },
  feedSeparatorLine: {
    backgroundColor: colors.grayBackgroundColor,
    height: 10,
    marginTop: 20,
    width: wp('100%'),
  },
  feedheader: {
    flexDirection: 'row',
    marginTop: 10,
    // marginBottom: 10,
    // height: 70,
  },
  likeImage: {
    height: 25,
    position: 'absolute',
    resizeMode: 'contain',

    right: 20,
    width: 25,
  },
  mainContainer: {
    flexDirection: 'column',
  },
  moreComment: {
    color: colors.grayColor,

    fontFamily: fonts.RRegular,
    fontSize: wp('3.7%'),
    marginLeft: 15,
  },
  multipleMedia: {
    height: (166.0 * width) / 375.0,
    resizeMode: 'cover',

    width: (166.0 * width) / 375.0,
  },
  noOfComment: {
    marginLeft: 15,
  },
  noOfLike: {
    marginBottom: 10,
    position: 'absolute',
    right: 20,
  },
  profileImg: {
    alignSelf: 'center',
    borderColor: colors.whiteColor,
    borderRadius: 35,
    borderWidth: 1,
    height: 50,
    marginLeft: 10,
    resizeMode: 'cover',
    width: 50,
  },

  separatorLine: {
    height: 10,
    justifyContent: 'center',
    position: 'absolute',
    width: wp('100%'),
  },
  shareImage: {
    height: 23,
    marginLeft: 30,
    resizeMode: 'contain',
    tintColor: colors.googleColor,

    width: 23,
  },
  singleMediaLandscap: {
    height: (width * 207.0) / 414.0,
    resizeMode: 'cover',
    width,
  },
  singleMediaPortrait: {
    height: (width * 450.0) / 375.0,
    resizeMode: 'cover',

    width,
  },
  twoMedia: {
    height: (186.0 * width) / 375.0,
    resizeMode: 'cover',

    width: (186.0 * width) / 375.0,
  },
  viewMore: {
    flexDirection: 'row',
  },
});
export default Feed;
