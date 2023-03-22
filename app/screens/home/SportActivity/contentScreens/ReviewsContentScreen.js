// @flow
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {AirbnbRating} from 'react-native-ratings';
import {strings} from '../../../../../Localization/translation';
import {getReviewsByRole} from '../../../../api/Games';
import AuthContext from '../../../../auth/context';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import Verbs from '../../../../Constants/Verbs';
import {getRatingsOptions} from '../../../../utils';
import ReviewsList from '../components/reviews/ReviewsList';

const ReviewsContentScreen = ({
  userId,
  sportObj = {},
  onPressMore = () => {},
  isAdmin = false,
  onReply = () => {},
  onPressMedia = () => {},
  onPressGame = () => {},
  entityType = Verbs.entityTypePlayer,
}) => {
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [ratingsOption, setRatingsOption] = useState([]);

  const authContext = useContext(AuthContext);

  const getReviews = useCallback(() => {
    setLoading(true);
    getReviewsByRole(userId, sportObj?.sport, entityType, authContext)
      .then((res) => {
        const result = res.payload?.reviews.results ?? [];
        setReviews(result);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [userId, sportObj, entityType, authContext]);

  useEffect(() => {
    if (userId) {
      getReviews();
    }
  }, [userId, getReviews]);

  useEffect(() => {
    const list = getRatingsOptions(authContext, sportObj?.sport, entityType);
    setRatingsOption([...list]);
  }, [authContext, sportObj, entityType]);

  useEffect(() => {
    if (sportObj?.avg_review) {
      const ratingOpt = {...sportObj.avg_review};
      delete ratingOpt.total_avg;
      setRatings(ratingOpt);
      setTotalRatings(sportObj.total_ratings ?? 0);
      setTotalReviews(sportObj.total_reviews ?? 0);
    }
  }, [sportObj]);

  return loading ? (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size={'large'} />
    </View>
  ) : (
    <View style={styles.parent}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{paddingHorizontal: 15, paddingVertical: 25}}>
          <Text style={styles.title}>
            {strings.ratings.toUpperCase()} ({totalRatings})
          </Text>

          {ratingsOption.length > 0 &&
            ratingsOption.map((item, index) => (
              <View
                style={[
                  styles.row,
                  {justifyContent: 'space-between', marginBottom: 15},
                ]}
                key={index}>
                <View>
                  <Text style={styles.label}>{item.title}</Text>
                </View>
                <View style={styles.row}>
                  <AirbnbRating
                    count={5}
                    defaultRating={ratings[item.name] ?? 0}
                    showRating={false}
                    size={23}
                    selectedColor={colors.themeColor}
                  />
                  <Text
                    style={[
                      styles.label,
                      {
                        color:
                          parseFloat(ratings[item.name]).toFixed(1) > 0
                            ? colors.themeColor
                            : colors.userPostTimeColor,
                        fontFamily: fonts.RMedium,
                        marginLeft: 10,
                      },
                    ]}>
                    {ratings[item.name]
                      ? parseFloat(ratings[item.name]).toFixed(1)
                      : 0}
                  </Text>
                </View>
              </View>
            ))}

          <TouchableOpacity style={styles.buttonContainer}>
            <Text style={styles.buttonText}>
              {strings.detailInfoAboutRating}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{height: 7, backgroundColor: colors.grayBackgroundColor}}
        />
        <View style={{paddingHorizontal: 15, paddingTop: 25}}>
          <Text style={styles.title}>
            {strings.reviews.toUpperCase()} ({totalReviews})
          </Text>
        </View>
        <ReviewsList
          onPressMore={onPressMore}
          list={reviews}
          isAdmin={isAdmin}
          onReply={onReply}
          onPressMedia={onPressMedia}
          onPressGame={onPressGame}
          entityType={entityType}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: colors.whiteColor,
  },
  title: {
    fontSize: 20,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    textDecorationLine: 'underline',
  },
  logoContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
export default ReviewsContentScreen;
