// @flow
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {getPostData} from '../../../utils';
import GroupIcon from '../../GroupIcon';
import FeedProfile from './FeedProfile';

const PostForEvent = ({
  postData = {},
  showThreeDot = false,
  onThreeDotPress = () => {},
  onImageProfilePress = () => {},
}) => {
  const [eventData, setEventData] = useState({});

  useEffect(() => {
    if (postData.object) {
      const data = getPostData(postData);
      setEventData(data.event_data ?? {});
    }
  }, [postData]);

  return (
    <View style={styles.parent}>
      <FeedProfile
        data={postData.actor.data}
        time={postData.time}
        onImageProfilePress={onImageProfilePress}
        isRepost={false}
        showThreeDot={showThreeDot}
        onThreeDotPress={onThreeDotPress}
        isEvent
      />
      <View style={styles.card}>
        <View style={styles.bacgroundImageContainer}>
          <Image
            source={
              eventData.background_full_image
                ? {uri: eventData.background_full_image}
                : images.backgroudPlaceholder
            }
            style={styles.backgroundImage}
          />
          <View style={styles.maskView}>
            <TouchableOpacity style={styles.dotImage}>
              <Image source={images.threeDotIcon} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.title} numberOfLines={1}>
              {eventData.text}
            </Text>
          </View>
        </View>
        <View style={{paddingHorizontal: 15, paddingVertical: 10}}>
          {eventData.is_recurring ? (
            <Text style={styles.startDate}>{strings.recurringEventText}</Text>
          ) : (
            <View style={styles.row}>
              <Text style={styles.startDate}>
                {moment(eventData.start_datetime).format(
                  'ddd, MMM DD · hh:mma',
                )}
              </Text>
              {!eventData.is_Offline && (
                <>
                  <View style={styles.verticalLine} />
                  <Text
                    style={[
                      styles.startDate,
                      {fontFamily: fonts.RBold, color: colors.tabFontColor},
                    ]}>
                    {strings.onlineText}
                  </Text>
                </>
              )}
            </View>
          )}
          <View style={[styles.row, {marginTop: 5}]}>
            <GroupIcon
              imageUrl={postData.actor.data.full_image}
              entityType={postData.actor.data.entity_type}
              groupName={postData.actor.data.group_name}
              containerStyle={styles.profileIcon}
            />
            <View>
              <Text style={styles.organizerName} numberOfLines={1}>
                {postData.actor.data.full_name ??
                  postData.actor.data.group_name}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {},
  card: {
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    shadowColor: colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1607,
    shadowRadius: 15,
    elevation: 3,
  },
  bacgroundImageContainer: {
    width: Dimensions.get('window').width - 30,
    height: 90,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  maskView: {
    position: 'absolute',
    backgroundColor: colors.maskColor,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 5,
  },
  dotImage: {
    width: 3,
    height: 15,
    alignSelf: 'flex-end',
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RBlack,
    color: colors.whiteColor,
  },
  startDate: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalLine: {
    height: 10,
    marginHorizontal: 10,
    width: 1,
    backgroundColor: colors.darkGrey,
  },
  profileIcon: {
    width: 15,
    height: 15,
  },
  organizerName: {
    fontSize: 12,
    lineHeight: 15,
    marginLeft: 10,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
});
export default PostForEvent;
