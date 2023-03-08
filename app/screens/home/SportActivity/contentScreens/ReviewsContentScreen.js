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
import {getUserReviews} from '../../../../api/Games';
import AuthContext from '../../../../auth/context';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import ReviewsList from '../components/reviews/ReviewsList';

const ratingsOption = [
  strings.etiquette,
  strings.respectForReferee,
  strings.punctuality,
];

const ReviewsContentScreen = ({userId, onPressMore = () => {}}) => {
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(false);
  // const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  const authContext = useContext(AuthContext);

  const getReviews = useCallback(() => {
    setLoading(true);
    getUserReviews(userId, authContext)
      .then((res) => {
        const obj = {};
        obj[strings.etiquette] = 0;
        obj[strings.respectForReferee] = 0;
        obj[strings.punctuality] = 0;
        setRatings({...obj});

        const result = res.payload?.reviews.results ?? [];
        // setReviews(result);
        setTotalRatings(result.length);
        setTotalReviews(result.length);

        setLoading(false);
      })
      .catch((err) => {
        console.log({err});
        setLoading(false);
      });
  }, [userId, authContext]);

  useEffect(() => {
    if (userId) {
      getReviews();
    }
  }, [userId, getReviews]);

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

          {ratingsOption.map((item, index) => (
            <View
              style={[
                styles.row,
                {justifyContent: 'space-between', marginBottom: 15},
              ]}
              key={index}>
              <View>
                <Text style={styles.label}>{item}</Text>
              </View>
              <View style={styles.row}>
                <AirbnbRating
                  count={5}
                  defaultRating={ratings[item]}
                  showRating={false}
                  size={23}
                  selectedColor={colors.themeColor}
                />
                <Text
                  style={[
                    styles.label,
                    {
                      color:
                        ratings[item] > 0
                          ? colors.themeColor
                          : colors.userPostTimeColor,
                      fontFamily: fonts.RMedium,
                      marginLeft: 10,
                    },
                  ]}>
                  {parseFloat(ratings[item]).toFixed(1)}
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
        <View style={{paddingHorizontal: 15, paddingVertical: 25}}>
          <Text style={styles.title}>
            {strings.reviews.toUpperCase()} ({totalReviews})
          </Text>
          <ReviewsList onPressMore={onPressMore} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
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
