// @flow
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {strings} from '../../../../../../Localization/translation';
import images from '../../../../../Constants/ImagePath';
import styles from './ActivityCardStyles';
import BottomSheet from '../../../../../components/modals/BottomSheet';
import {getJSDate} from '../../../../../utils';
import MediaList from './MediaList';
import {getReactions} from '../../../../../api/NewsFeeds';
import colors from '../../../../../Constants/Colors';
import {formatTimestampForDisplay} from '../../../../../utils/formatTimestampForDisplay';
import Verbs from '../../../../../Constants/Verbs';

const ActivityCard = ({
  item = {},
  onPressMore = () => {},
  isReviewPeriodEnd = false,
  isReplyToReviewPeriodEnd = false,
  userProfile = '',
  authContext = {},
  isAdmin = false,
  onReply = () => {},
  onPressMedia = () => {},
  containerStyle = {},
  entityType,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [playerReview, setPlayerReview] = useState({});
  const [replies, setReplies] = useState([]);

  const isFocused = useIsFocused();

  const getReplies = useCallback(() => {
    const params = {
      activity_id: item?.id,
      reaction_type: 'comment',
    };
    getReactions(params, authContext)
      .then((response) => {
        setReplies(response.payload.reverse());
      })
      .catch((e) => {
        Alert.alert('', e.messages);
      });
  }, [item.id, authContext]);

  useEffect(() => {
    if (item.object) {
      let review = {};
      if (entityType === Verbs.entityTypePlayer) {
        review = JSON.parse(item.object)?.playerReview ?? {};
      }
      if (entityType === Verbs.entityTypeReferee) {
        review = JSON.parse(item.object)?.refereeReview ?? {};
      }
      if (entityType === Verbs.entityTypeScorekeeper) {
        review = JSON.parse(item.object)?.scorekeeperReview ?? {};
      }

      setPlayerReview(review);
    }
  }, [item, entityType]);

  useEffect(() => {
    if (isFocused) {
      getReplies();
    }
  }, [getReplies, isFocused]);

  const handleMoreButtonPress = () => {
    setShowModal(true);
  };

  const getReviewMoreOptions = () => {
    let review = {};
    if (entityType === Verbs.entityTypePlayer) {
      review = JSON.parse(item.object)?.playerReview ?? {};
    }
    if (entityType === Verbs.entityTypeReferee) {
      review = JSON.parse(item.object)?.refereeReview ?? {};
    }
    if (entityType === Verbs.entityTypeScorekeeper) {
      review = JSON.parse(item.object)?.scorekeeperReview ?? {};
    }

    if (review.reviewer_id === authContext.entity.obj.user_id) {
      if (isReviewPeriodEnd && !isReplyToReviewPeriodEnd) {
        return [
          strings.editReviewSentenceCase,
          strings.deleteReviewSentenceCase,
        ];
      }
    }
    return [strings.reportThisReview];
  };

  return (
    <View style={[styles.parent, containerStyle]}>
      <View style={[styles.row, {justifyContent: 'space-between'}]}>
        <View style={styles.row}>
          <View style={styles.profile}>
            <Image
              source={
                item.actor.data?.full_image
                  ? {uri: item.actor.data.full_image}
                  : images.profilePlaceHolder
              }
              style={styles.image}
            />
          </View>
          <View>
            <Text style={styles.userName}>{item.actor.data?.full_name}</Text>
            <Text style={styles.date}>
              {moment(getJSDate(playerReview.created_at).getTime()).format(
                'MMM DD',
              )}
            </Text>
          </View>
        </View>
        {isReviewPeriodEnd && !isReplyToReviewPeriodEnd ? (
          <TouchableOpacity
            style={styles.button}
            onPress={handleMoreButtonPress}>
            <Image source={images.scheduleThreeDot} style={styles.image} />
          </TouchableOpacity>
        ) : null}
      </View>
      <View>
        <Text style={styles.description} numberOfLines={3}>
          {playerReview.comment}{' '}
          <TouchableOpacity
            onPress={() =>
              onPressMore(getJSDate(playerReview.created_at).getTime())
            }>
            <Text style={styles.moreText}>{strings.moreText}</Text>
          </TouchableOpacity>
        </Text>
      </View>
      <View style={{paddingBottom: 13, paddingTop: 10}}>
        <MediaList
          list={playerReview.attachments ?? []}
          onPress={() =>
            onPressMedia(
              playerReview.attachments ?? [],
              item.actor,
              playerReview.created_at,
            )
          }
        />
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: colors.grayBackgroundColor,
          marginBottom: 15,
        }}
      />
      {replies.length > 0 ? (
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <View style={styles.row}>
            <View style={[styles.profile, {marginRight: 7}]}>
              <Image
                source={
                  replies[0].user.data?.full_image
                    ? {uri: replies[0].user.data.full_image}
                    : images.profilePlaceHolder
                }
                style={styles.image}
              />
            </View>
            <View>
              <Text style={styles.userName} numberOfLines={2}>
                {replies[0].user.data?.full_name}{' '}
                <Text style={styles.reply} numberOfLines={2}>
                  {replies[0].data.text}
                </Text>{' '}
                <TouchableOpacity
                  onPress={() =>
                    onPressMore(getJSDate(playerReview.created_at).getTime())
                  }>
                  <Text style={styles.moreText}>{strings.moreText}</Text>
                </TouchableOpacity>
              </Text>
              <Text style={styles.date}>
                {formatTimestampForDisplay(replies[0].created_at, 0)}
              </Text>
            </View>
          </View>
          {isReviewPeriodEnd && !isReplyToReviewPeriodEnd ? (
            <TouchableOpacity style={styles.button}>
              <Image source={images.scheduleThreeDot} style={styles.image} />
            </TouchableOpacity>
          ) : null}
        </View>
      ) : (
        isAdmin && (
          <View style={styles.row}>
            <View style={[styles.profile, {marginRight: 7}]}>
              <Image
                source={
                  userProfile ? {uri: userProfile} : images.profilePlaceHolder
                }
                style={styles.image}
              />
            </View>
            <TextInput
              placeholder={strings.leaveReplyText}
              style={styles.input}
              onFocus={() => {
                Alert.alert(strings.ratingsInfo, '', [
                  {
                    text: strings.okTitleText,
                    onPress: () => onReply(),
                  },
                ]);
              }}
            />
          </View>
        )
      )}

      <BottomSheet
        isVisible={showModal}
        closeModal={() => {
          setShowModal(false);
        }}
        optionList={getReviewMoreOptions()}
        onSelect={(option) => {
          console.log({option});
        }}
      />
    </View>
  );
};

export default ActivityCard;
