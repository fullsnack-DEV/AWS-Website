import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';

import constants from '../../config/constants';
import NewsFeedVideoPlayer from '../../screens/newsfeeds/NewsFeedVideoPlayer';
import Moment from 'moment';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const {colors, fonts, PATH} = constants;
let {width} = Dimensions.get('window');

function Feed({data, navigation, route}) {
  const {navigate} = navigation;
  const [attchments, setAttachments] = useState([]);
  const [tagged, setTagged] = useState([]);

  var json = JSON.parse(data.object);

  renderItem = ({item, index}) => {
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
              }}>
              <Text
                style={{
                  color: colors.whiteColor,
                  // fontFamily: fonts.RRegular,
                  fontSize: wp('2.8%'),
                }}>
                {index + 1}/{json.attachments.length}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    } else if (json.attachments.length == 2) {
      return (
        <TouchableWithoutFeedback
          style={styles.listItem}
          onPress={() =>
            console.log('Image pressed..', json.attachments[index].thumbnail)
          }>
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
              }}>
              <Text
                style={{
                  color: colors.whiteColor,
                  // fontFamily: fonts.RRegular,
                  fontSize: wp('2.8%'),
                }}>
                {index + 1}/{json.attachments.length}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    } else if (
      json.attachments.length == 1 &&
      json.attachments[index].media_width > json.attachments[index].media_height
    ) {
      return (
        <TouchableWithoutFeedback
          style={styles.listItem}
          onPress={() =>
            this.pushToPostDetail(
              json.attachments[index].type,
              json.attachments[index].url,
            )
          }>
          <Image
            source={{uri: json.attachments[index].thumbnail}}
            style={styles.singleMediaLandscap}
          />
        </TouchableWithoutFeedback>
      );
    } else if (
      json.attachments.length == 1 &&
      json.attachments[index].media_width < json.attachments[index].media_height
    ) {
      return (
        <TouchableWithoutFeedback
          style={styles.listItem}
          onPress={() =>
            this.pushToPostDetail(
              json.attachments[index].type,
              json.attachments[index].url,
            )
          }>
          <Image
            source={{uri: json.attachments[index].thumbnail}}
            style={styles.singleMediaPortrait}
          />
        </TouchableWithoutFeedback>
      );
    }
  };
  pushToPostDetail = (type, url) => {
    if (type == 'video') {
      navigate('NewsFeedVideoPlayer', {url: url});
    } else {
      navigate('NewsFeedVideoPlayer');
    }
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.feedheader}>
        {data.actor.data.entity_type == 'club' ? (
          <Image
            style={styles.clubProfileImg}
            source={{uri: data.actor.data.thumbnail}}
          />
        ) : null}
        {data.actor.data.entity_type == 'team' ? (
          <Image
            style={styles.profileImg}
            source={{uri: data.actor.data.thumbnail}}
          />
        ) : null}
        {data.actor.data.entity_type == 'player' ? (
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
        renderItem={this.renderItem}
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
        <Image style={styles.commentImage} source={PATH.feedComment} />
        <Image style={styles.shareImage} source={PATH.feedShare} />

        <Image style={styles.likeImage} source={PATH.feedLike} />
      </View>
      {data.reaction_counts.clap == 0 ? (
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
  mainContainer: {
    flexDirection: 'column',
  },
  feedheader: {
    flexDirection: 'row',
    marginTop: 10,
    //marginBottom: 10,
    //backgroundColor: 'red',
    //height: 70,
  },
  profileImg: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    marginLeft: 10,
    alignSelf: 'center',
    borderRadius: 35,
    borderWidth: 1,
    borderColor: colors.whiteColor,
  },
  clubProfileImg: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    marginLeft: 10,
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.whiteColor,
  },

  separatorLine: {
    position: 'absolute',
    bottom: -20,
    backgroundColor: colors.graySeparater,

    justifyContent: 'center',
    alignItems: 'center',
    width: wp('100%'),
    height: 10,
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
  date: {
    marginLeft: wp('2.5%'),

    // fontFamily: fonts.RRegular,
    fontSize: wp('3.6%'),
    color: colors.grayColor,

    paddingLeft: 8,
    alignSelf: 'center',

    width: wp('80%'),
  },
  entityheader: {
    alignSelf: 'center',
  },
  feedDescription: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,

    // fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
  },
  feedBottomView: {
    flexDirection: 'row',
    marginTop: 10,
  },
  viewMore: {
    flexDirection: 'row',
  },
  commentImage: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    tintColor: colors.googleColor,

    marginLeft: 15,
  },
  shareImage: {
    height: 23,
    width: 23,
    resizeMode: 'contain',
    tintColor: colors.googleColor,

    marginLeft: 30,
  },
  likeImage: {
    height: 25,
    width: 25,
    resizeMode: 'contain',

    position: 'absolute',
    right: 20,
  },
  separatorLine: {
    backgroundColor: colors.whiteColor,
    width: 3,
    alignSelf: 'center',
  },
  feedSeparatorLine: {
    backgroundColor: colors.grayBackgroundColor,
    width: wp('100%'),
    height: 10,
    marginTop: 20,
  },
  deviderLine: {
    backgroundColor: colors.grayBackgroundColor,
    width: wp('100%'),
    height: 1,
    marginTop: 10,
  },
  deviderLineWithoutMargin: {
    backgroundColor: colors.whiteColor,
    width: wp('100%'),
    height: 1,
  },
  singleMediaPortrait: {
    height: (width * 450.0) / 375.0,
    width: width,

    resizeMode: 'cover',
  },
  singleMediaLandscap: {
    height: (width * 207.0) / 414.0,
    width: width,
    resizeMode: 'cover',
  },
  twoMedia: {
    height: (186.0 * width) / 375.0,
    width: (186.0 * width) / 375.0,

    resizeMode: 'cover',
  },
  multipleMedia: {
    height: (166.0 * width) / 375.0,
    width: (166.0 * width) / 375.0,

    resizeMode: 'cover',
  },
  noOfComment: {
    marginLeft: 15,
  },
  noOfLike: {
    position: 'absolute',
    right: 20,
    marginBottom: 10,
  },
  comment: {
    marginLeft: 15,

    // fontFamily: fonts.RRegular
    fontSize: wp('4%'),
    color: colors.blackColor,
  },
  commentTime: {
    position: 'absolute',
    right: 20,

    // fontFamily: fonts.RRegular,
    fontSize: wp('3%'),
    color: colors.grayColor,
  },
  moreComment: {
    marginLeft: 15,

    fontFamily: fonts.RRegular,
    fontSize: wp('3.7%'),
    color: colors.grayColor,
  },
});
export default Feed;
