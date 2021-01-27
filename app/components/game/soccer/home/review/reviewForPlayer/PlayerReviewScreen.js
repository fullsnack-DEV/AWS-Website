import React, {
  useState, useEffect, useLayoutEffect, useContext,
} from 'react';
import {
  Alert,
  ScrollView, StyleSheet, View, Text,
} from 'react-native';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import fonts from '../../../../../../Constants/Fonts';

import { STAR_COLOR } from '../../../../../../utils';
import { addGameReview } from '../../../../../../api/Games';
import TCInnerLoader from '../../../../../TCInnerLoader';
import images from '../../../../../../Constants/ImagePath';
import colors from '../../../../../../Constants/Colors';

import AuthContext from '../../../../../../auth/context';
import TCInputBox from '../../../../../TCInputBox';
import TCKeyboardView from '../../../../../TCKeyboardView';
import TCAttributeRatingWithSlider from '../../../../../TCAttributeRatingWithSlider';
import TCRatingStarSlider from '../../../../../TCRatingStarSlider';

const QUSTIONS = [
  // { attrName: 'ontime', desc: 'Did the players arrive at the match place on time?' },
  { attrName: 'manner', desc: 'Did the players keep good manners for the other players, officials and spectators during the match?' },
  { attrName: 'punctuality', desc: 'Did the players respect the referees and their decisions?' },
]
export default function PlayerReviewScreen({ navigation, route }) {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [sliderAttributesForPlayer, setSliderAttributesForPlayer] = useState([]);
  const [reviewsData, setReviewsData] = useState({
    comment: '',
    attachments: [],
    tagged: [],
  });

  useEffect(() => {
    loadSliderAttributes(route?.params?.sliderAttributesForPlayer)
    loadStarAttributes(route?.params?.starAttributesForPlayer);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text onPress={createReview} style={styles.nextButtonStyle}>
          {'Done'}
        </Text>
      ),
    });
  }, [navigation]);

  const loadSliderAttributes = (attributes) => {
    setLoading(true);
    setSliderAttributesForPlayer([...attributes]);
    const attr = {}
    attributes.map((item) => { attr[item] = 0; return true; })
    let reviews = _.cloneDeep(reviewsData);
    reviews = { ...reviews, ...attr };

    setReviewsData({ ...reviews });
    setLoading(false);
  }

  const loadStarAttributes = (attributes) => {
    setLoading(true);
    const attr = {}
    attributes.map((item) => { attr[item] = 0; return true; })
    let reviews = _.cloneDeep(reviewsData);
    reviews = { ...reviews, ...attr };

    setReviewsData({ ...reviews });
    setLoading(false);
  }

  const isValidReview = () => {
    const exceptKey = ['comment', 'attachments', 'tagged'];
    let isValid = true;
    const reviews = _.cloneDeep(reviewsData);
    const review = reviews;
    Object.keys(review).map((key) => {
      if (!exceptKey.includes(key) && isValid && Number(review?.[key]) <= 0) {
        isValid = false
      }
      return key;
    });
    return isValid;
  }
  const createReview = () => {
    console.log('Review Data::=>', reviewsData);
    if (!isValidReview()) {
      Alert.alert('Please, complete all ratings before moving to the next.')
    } else {
      setLoading(true);
      addGameReview(route?.params?.gameData?.game_id, reviewsData, authContext)
        .then(() => {
          setLoading(false);
          navigation.goBack()
        })
        .catch((error) => {
          setLoading(false);
          setTimeout(() => Alert.alert('TownsCup', error?.message), 100)
          navigation.goBack()
        })
    }
  }

  const setTeamReview = (key = '', value = '') => {
    if (reviewsData[key] !== value) {
      const reviews = _.cloneDeep(reviewsData);

      reviews[key] = value;
      setReviewsData({ ...reviews });
      console.log(`reviews::${JSON.stringify(reviews)}`);
    }
  }
  return (
    <View style={{ flex: 1 }}>
      <TCInnerLoader visible={loading} size={35}/>
      {!loading && (
        <ScrollView>
          <TCKeyboardView>
            <View style={styles.mainContainer}>
              {/* Title */}
              <Text style={styles.titleText}>Please, rate the performance of {route?.params?.userData?.profile?.first_name} {route?.params?.userData?.profile?.last_name} and leave a review for the player.</Text>

              {/*  Logo Container */}
              <View style={styles.logoContainer}>

                {/* Image */}
                <View style={styles.imageContainer}>
                  <FastImage
               source={route?.params?.userData?.profile?.thumbnail ? { uri: route?.params?.userData?.profile?.thumbnail } : images.teamPlaceholder}
               resizeMode={'contain'}
               style={{ height: 50, width: 50 }}
          />
                </View>

                {/*    Team name */}
                <Text style={styles.teamName}>{route?.params?.userData?.profile?.first_name} {route?.params?.userData?.profile?.last_name}</Text>

                {/*    Country Name */}
                <Text style={styles.countryName}>{route?.params?.userData?.profile?.country}</Text>

              </View>

              {/* Seperator */}
              <View style={styles.seperator}/>

              {/*  Rate Performance */}

              <View style={styles.mainContainerRate}>

                {/*    Title */}
                <Text style={styles.titleText}>Rate performance <Text style={{ color: colors.redDelColor }}>*</Text></Text>

                {/* Ratings */}
                <View style={styles.rateSection}>

                  {/* Poor Excellent Section */}
                  <View style={{ ...styles.poorExcellentSection }}>
                    <View style={{ flex: 0.3 }}/>
                    <View style={styles.poorExcellentChildSection}>
                      <Text style={styles.poorExcellenceText}>Poor</Text>
                      <Text>Excellent</Text>
                    </View>
                    <View style={{ flex: 0.1 }}/>
                  </View>

                  {/*    Rating Slider */}
                  {sliderAttributesForPlayer.map((item, index) => (<View key={index}>
                    <TCAttributeRatingWithSlider
            selectedTrackColors={
              [colors.yellowColor, colors.themeColor]
            }
                setTeamReview={setTeamReview}
                title={item}
                rating={reviewsData[item]}
            />
                  </View>))}
                </View>

                {/* Questions */}
                {QUSTIONS.map((item, index) => (
                  <View style={{ marginVertical: 5 }} key={index}>
                    <Text style={styles.questionText}>{item.desc}</Text>
                    <TCRatingStarSlider
            currentRating={reviewsData[item.attrName]}
            onPress={(star) => {
              setTeamReview(item.attrName, star)
            }}
              style={{ alignSelf: 'flex-end' }}
              starColor={STAR_COLOR.YELLOW}/>
                  </View>
                ))}
              </View>

              {/*  Leave a Review */}
              <View style={styles.leaveReviewContainer}>
                <Text style={styles.titleText}>Leave a review</Text>
                <TCInputBox
          onChangeText={(value) => setTeamReview('comment', value)}
          value={reviewsData?.comment ?? ''}
          multiline={true}
          placeHolderText={`Describe what you thought and felt about ${route?.params?.userData?.profile?.first_name} ${route?.params?.userData?.profile?.last_name} while watching or playing the game.`}
          textInputStyle={{ fontSize: 16, color: colors.userPostTimeColor }}
          style={{
            height: 120,
            marginVertical: 10,
            alignItems: 'flex-start',
            padding: 15,
          }}
      />
              </View>

              {/*  Footer */}
              <Text style={styles.footerText}>
                (<Text style={{ color: colors.redDelColor }}>*</Text> required)
              </Text>

            </View>
          </TCKeyboardView>
        </ScrollView>)
      }
    </View>
  )
}
const styles = StyleSheet.create({
  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 15,
  },
  titleText: {
    fontSize: 20,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamName: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
  countryName: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    fontSize: 14,
  },
  seperator: {
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 20,
    height: 2,
    width: '100%',
  },
  footerText: {
    color: colors.lightBlackColor,
    fontSize: 12,
    fontFamily: fonts.RLight,
  },
  leaveReviewContainer: {

  },
  mainContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.whiteColor,
    marginBottom: 15,
  },
  mainContainerRate: {
    flex: 1,
  },

  rateSection: {
    marginVertical: 10,
  },
  poorExcellentSection: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginVertical: 5,
  },
  poorExcellentChildSection: {
    flex: 0.6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  poorExcellenceText: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  questionText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },
});
