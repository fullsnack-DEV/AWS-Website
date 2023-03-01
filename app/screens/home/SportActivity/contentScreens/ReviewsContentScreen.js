// @flow
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text, ActivityIndicator, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {AirbnbRating} from 'react-native-ratings';
import {strings} from '../../../../../Localization/translation';
import {getUserReviewsById} from '../../../../api/Users';
import AuthContext from '../../../../auth/context';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import images from '../../../../Constants/ImagePath';

const ratingsOption = [
  strings.etiquette,
  strings.respectForReferee,
  strings.punctuality,
];

const ReviewsContentScreen = ({userId, sport, role}) => {
  const [gameReview, setGameReview] = useState({});
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);

  const authContext = useContext(AuthContext);

  const getReviews = useCallback(() => {
    setLoading(true);
    getUserReviewsById(userId, sport, role, authContext)
      .then((res) => {
        const reviewObj = res.payload.reviews?.results[0]?.reviews[0]?.object
          ? JSON.parse(res.payload.reviews.results[0].reviews[0].object)
          : {};

        const obj = {};
        obj[strings.etiquette] = reviewObj.gameReview?.manner ?? 0;
        obj[strings.respectForReferee] =
          reviewObj.gameReview?.respectforreferre ?? 0;
        obj[strings.punctuality] = reviewObj.gameReview?.punctuality ?? 0;

        setGameReview({...obj});
        setReviews(res.payload.reviews?.results ?? []);
        setLoading(false);
      })
      .catch((err) => {
        console.log({err});
        setLoading(false);
      });
  }, [userId, sport, role, authContext]);

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
      <View style={{paddingHorizontal: 15, paddingVertical: 25}}>
        <Text style={styles.title}>{strings.ratings.toUpperCase()}</Text>

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
                defaultRating={gameReview[item]}
                showRating={false}
                size={23}
                selectedColor={colors.themeColor}
              />
              <Text
                style={[
                  styles.label,
                  {
                    color:
                      gameReview[item] > 0
                        ? colors.themeColor
                        : colors.userPostTimeColor,
                    fontFamily: fonts.RMedium,
                    marginLeft: 10,
                  },
                ]}>
                {parseFloat(gameReview[item]).toFixed(1)}
              </Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.buttonContainer}>
          <Text style={styles.buttonText}>{strings.detailInfoAboutRating}</Text>
        </TouchableOpacity>
      </View>
      <View style={{height: 7, backgroundColor: colors.grayBackgroundColor}} />
      <View style={{paddingHorizontal: 15, paddingVertical: 25}}>
        <Text style={styles.title}>
          {strings.reviews.toUpperCase()} ({reviews.length})
        </Text>
        {reviews.map((item, index) => (
          <View key={index}>
            <View
              style={[
                styles.row,
                {justifyContent: 'space-between', marginTop: 8},
              ]}>
              <View
                style={[styles.row, {justifyContent: 'flex-start', flex: 1}]}>
                <View style={[styles.logoContainer, {marginRight: 5}]}>
                  <Image
                    source={
                      item.game.home_team?.thumbnail
                        ? {uri: item.game.home_team.thumbnail}
                        : images.teamPH
                    }
                    style={[styles.image, {borderRadius: 15}]}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={[styles.dateTime, {fontFamily: fonts.RMedium}]}
                    numberOfLines={2}>
                    {item.game.home_team?.full_name}
                  </Text>
                </View>
              </View>
              {/* {item.game.start_datetime > new Date().getTime() &&
              item.game.status !== GameStatus.ended
                ? null
                : getWinCount()} */}

              <View style={[styles.row, {justifyContent: 'flex-end', flex: 1}]}>
                <View style={{flex: 1}}>
                  <Text
                    style={[
                      styles.dateTime,
                      {fontFamily: fonts.RMedium, textAlign: 'right'},
                    ]}
                    numberOfLines={2}>
                    {item.game.away_team?.full_name}
                  </Text>
                </View>
                <View style={[styles.logoContainer, {marginLeft: 5}]}>
                  <Image
                    source={
                      item.game.away_team?.thumbnail
                        ? {uri: item.game.away_team.thumbnail}
                        : images.teamPH
                    }
                    style={[styles.image, {borderRadius: 15}]}
                  />
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
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
