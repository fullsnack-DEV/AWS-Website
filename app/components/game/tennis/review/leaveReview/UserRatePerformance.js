import React from 'react';
import {View, Text} from 'react-native';
import TCRatingStarSlider from '../../../../TCRatingStarSlider';
import styles from '../../../soccer/home/review/ReviewStyles';
import {strings} from '../../../../../../Localization/translation';

const UserRatePerformance = ({
  reviewsData,
  setReviewRating,
  starColor,
  reviewAttributes,
  isRefereeAvailable,
}) => {
  const ommitedName = isRefereeAvailable ? '' : 'respectforreferre';

  const topStarAttributesForReferee = reviewAttributes.filter(
    (reviewProp) =>
      reviewProp.type === 'topstar' && reviewProp.name !== ommitedName,
  );

  const middleStarAttributesForReferee = reviewAttributes.filter(
    (reviewProp) =>
      reviewProp.type === 'star' && reviewProp.name !== ommitedName,
  );

  const bottomStarAttributesForReferee = reviewAttributes.filter(
    (reviewProp) =>
      reviewProp.type === 'bottomstar' && reviewProp.name !== ommitedName,
  );

  const renderReviewStar = (index, item) => (
    <View key={index}>
      <Text style={styles.questionTitle}>{item.title.toUpperCase()}</Text>
      <Text style={styles.questionText}>{item.description}</Text>
      <TCRatingStarSlider
        currentRating={reviewsData[item.name]}
        onPress={(star) => {
          setReviewRating(item.name, star);
        }}
        style={{
          alignSelf: 'center',
          marginTop: 5,
          marginBottom: 25,
        }}
        starColor={starColor}
      />
    </View>
  );

  return (
    <View style={styles.mainContainerRate}>
      {/*    Title */}
      <Text style={[styles.titleText, {marginBottom: 14}]}>
        {strings.rateperformance.toUpperCase()}
      </Text>

      {/* Top Star Rating */}
      {topStarAttributesForReferee?.map((item, index) =>
        renderReviewStar(index, item),
      )}

      {topStarAttributesForReferee?.length > 0 && (
        <View style={[styles.seperator, {marginBottom: 25}]} />
      )}

      {/* Middle Star Rating */}
      {middleStarAttributesForReferee?.map((item, index) =>
        renderReviewStar(index, item),
      )}

      {middleStarAttributesForReferee?.length > 0 && (
        <View style={[styles.seperator, {marginBottom: 25}]} />
      )}

      {/* Bottom Star Rating */}
      {bottomStarAttributesForReferee?.map((item, index) =>
        renderReviewStar(index, item),
      )}

      {bottomStarAttributesForReferee?.length > 0 && (
        <View style={[styles.seperator, {marginBottom: 25}]} />
      )}
    </View>
  );
};
export default UserRatePerformance;
