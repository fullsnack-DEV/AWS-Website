// @flow
import React, {useContext} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {strings} from '../../../../../../Localization/translation';
import AuthContext from '../../../../../auth/context';
import colors from '../../../../../Constants/Colors';
import fonts from '../../../../../Constants/Fonts';
import {calculateReviewPeriod} from '../../../../../utils';
import ActivityCard from './ActivityCard';
import GameCard from './GameCard';

const sliderWidth = Dimensions.get('window').width;

const ReviewsList = ({
  onPressMore = () => {},
  list = [],
  isAdmin = false,
  onReply = () => {},
  onPressMedia = () => {},
  onPressGame = () => {},
}) => {
  const authContext = useContext(AuthContext);

  if (list.length > 0) {
    return list.map((review, index) => (
      <View key={index}>
        <>
          <GameCard
            data={review.game}
            containerStyle={{marginBottom: 15, marginHorizontal: 15}}
            onCardPress={() => onPressGame(review)}
          />
          {review.reviews?.length > 0 ? (
            <View
              style={{
                paddingHorizontal: 15,
                paddingBottom: 25,
                backgroundColor: colors.grayBackgroundColor,
              }}>
              <Carousel
                data={review.reviews}
                renderItem={({item}) => (
                  <ActivityCard
                    item={item}
                    isReviewPeriodEnd={
                      calculateReviewPeriod(item, review.reviews)
                        .isReviewPeriodEnd
                    }
                    isReplyToReviewPeriodEnd={
                      calculateReviewPeriod(item).isReplyToReviewPeridEnd
                    }
                    onPressMore={(dateTime) => onPressMore(review, dateTime)}
                    userProfile={authContext.entity.obj.full_image}
                    authContext={authContext}
                    isAdmin={isAdmin}
                    onReply={() => onReply(item.id)}
                    onPressMedia={onPressMedia}
                  />
                )}
                sliderWidth={sliderWidth}
                itemWidth={sliderWidth}
              />
            </View>
          ) : null}
        </>
        <View style={styles.dividor} />
      </View>
    ));
  }
  return (
    <Text style={styles.warningText}>
      {strings.noReviewsText.toUpperCase()}
    </Text>
  );
};

const styles = StyleSheet.create({
  dividor: {
    height: 7,
    width: '100%',
    marginBottom: 25,
    backgroundColor: colors.grayBackgroundColor,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.userPostTimeColor,
    paddingHorizontal: 15,
  },
});

export default ReviewsList;
