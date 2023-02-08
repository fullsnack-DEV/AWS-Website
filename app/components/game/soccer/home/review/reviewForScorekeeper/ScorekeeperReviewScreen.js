/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import {
  Alert,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  FlatList,
} from 'react-native';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import {format} from 'react-string-format';
import fonts from '../../../../../../Constants/Fonts';

import {displayLocation, STAR_COLOR} from '../../../../../../utils';
import images from '../../../../../../Constants/ImagePath';
import colors from '../../../../../../Constants/Colors';
import TCRatingStarSlider from '../../../../../TCRatingStarSlider';
import Header from '../../../../../Home/Header';
import SelectedImageList from '../../../../../WritePost/SelectedImageList';
import {strings} from '../../../../../../../Localization/translation';
import ActivityLoader from '../../../../../loader/ActivityLoader';
import NewsFeedDescription from '../../../../../newsFeed/NewsFeedDescription';
import styles from '../ReviewStyles';

export default function ScorekeeperReviewScreen({navigation, route}) {
  const [loading, setLoading] = useState(false);
  const [reviewsData, setReviewsData] = useState({});
  const [starAttributesForScorekeeper] = useState(
    route.params.starAttributesForScorekeeper,
  );

  const [topStarAttributesForScorekeeper] = useState(
    route.params.starAttributesForScorekeeper?.filter(
      (reviewProp) => reviewProp.type === 'topstar',
    ),
  );

  const [middleStarAttributesForScorekeeper] = useState(
    route.params.starAttributesForScorekeeper?.filter(
      (reviewProp) => reviewProp.type === 'star',
    ),
  );

  const [bottomStarAttributesForScorekeeper] = useState(
    route.params.starAttributesForScorekeeper?.filter(
      (reviewProp) => reviewProp.type === 'bottomstar',
    ),
  );

  const [sliderAttributesForScorekeeper] = useState(
    route.params.sliderAttributesForScorekeeper,
  );

  const [userData] = useState(route.params.userData);
  const [onPressReview] = useState(
    route.params.onPressScorekeeperReviewDone
      ? () => route.params.onPressScorekeeperReviewDone
      : () => {},
  );

  useEffect(() => {
    const obj = {...reviewsData};
    if (route.params.comment) {
      obj.comment = route.params.comment ?? '';
      setReviewsData(obj);
    } else {
      obj.comment = null;
      setReviewsData(obj);
    }

    if (route.params.selectedImageList) {
      obj.attachments = route.params.selectedImageList;
      setReviewsData(obj);
    } else {
      obj.attachments = null;
      setReviewsData(obj);
    }
  }, [route.params.selectedImageList, route.params.comment]);

  useEffect(() => {
    if (route.params.gameReviewData) {
      const reviewObj = route.params.gameReviewData;
      setReviewsData({...reviewObj});
    } else {
      setLoading(true);
      if (reviewsData.length === 0) {
        const attr = {};
        sliderAttributesForScorekeeper.map((item) => {
          attr[item] = 0;
        });
        starAttributesForScorekeeper.map((item) => {
          attr[item.name] = 0;
        });
        setReviewsData({...reviewsData, ...attr});
      }
      setLoading(false);
    }
  }, [route.params.gameReviewData]);

  const isValidReview = () => {
    let returnValue = true;
    let isBlankRating = false;
    let isRating = false;
    const keys = {};
    sliderAttributesForScorekeeper.map((item) => {
      keys[item] = 0;
    });
    starAttributesForScorekeeper.map((item) => {
      keys[item.name] = 0;
    });
    Object.keys(keys).map((key) => {
      if (reviewsData[key] > 0) {
        isRating = true;
      }
      else{
        isBlankRating = true;
      }
    });

    if(isRating && isBlankRating){
      Alert.alert(strings.completeallrating);
      returnValue = false;
    }
    else if(!isRating && (!reviewsData.comment || reviewsData.comment?.length <= 0)){      
      Alert.alert(strings.reviewvalidation);
      returnValue = false;
    }

    return returnValue;
  };

  const createReview = () => {
    if (isValidReview()) {
      onPressReview(1, !!userData?.review_id, reviewsData, userData?.user_id);
      navigation.goBack();
    }
  };

  const setReviewRating = (key = '', value = '') => {
    if (reviewsData[key] !== value) {
        reviewsData[key] = value;
      setReviewsData({...reviewsData});
    }
  };

  const removeRatings = () => {
    const keys = {};
    sliderAttributesForScorekeeper.map((item) => {
      keys[item] = 0;
    });
    starAttributesForScorekeeper.map((item) => {
      keys[item.name] = 0;
    });
    Object.keys(keys).map((key) => {
      reviewsData[key] = 0
    });
    setReviewsData({...reviewsData});
  }

  const renderReviewStar = (index,item) => ( <View key={index}>
    <Text style={styles.questionTitle}>
      {item.title.toUpperCase()}
    </Text>
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
      starColor={STAR_COLOR.YELLOW}
    />
  </View>);

return (
  <View style={{flex: 1}}>
    <Header
      leftComponent={
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={images.backArrow} style={styles.backImageStyle} />
        </TouchableOpacity>
      }
      centerComponent={
        <Text style={styles.eventTextStyle}>
          {strings.leavereviewinsmall}
        </Text>
      }
      rightComponent={
        <Text onPress={createReview} style={styles.nextButtonStyle}>
          {strings.done}
        </Text>
      }
    />
    {/* Seperator */}
    <View style={styles.headerSeperator} />
    <ActivityLoader visible={loading} />
    {!loading && (
      <ScrollView>
          <View style={styles.mainContainer}>
            {/* Title */}
            <Text style={styles.titleText}>
              {format(strings.scorekeeperreviewtitle, userData.full_name)}
            </Text>

            {/*  Logo Container */}
            <View style={styles.logoContainer}>
              {/* Image */}
              <View style={styles.imageContainer}>
                <FastImage
                  source={
                    userData.thumbnail
                      ? {uri: userData.thumbnail}
                      : images.profilePlaceHolder
                  }
                  resizeMode={'cover'}
                  style={{height: 45, width: 45, borderRadius:22.5}}
                />
              </View>

              {/* Reviewed name */}
              <Text style={styles.teamName}>{userData.full_name}</Text>

              {/* Reviewed Location */}
              <Text style={styles.countryName}>{displayLocation(userData)}</Text>
            </View>

            {/* Seperator */}
            <View style={[styles.seperator,{marginVertical: 15,}]} />

            {/*  Rate Performance */}

            <View style={styles.mainContainerRate}>
              {/*    Title */}
              <Text style={[styles.titleText,{marginBottom:14}]}>
                {strings.rateperformance.toUpperCase()}
              </Text>

              {/* Ratings */}
              {sliderAttributesForScorekeeper?.map((item, index) => (
                <View
                  style={{
                    marginVertical: 10,
                    flexDirection: 'row',
                  }}
                  key={index}>
                  <Text style={styles.starText}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                  <View style={{flex: 1}}>
                    <TCRatingStarSlider
                      currentRating={reviewsData[item]}
                      onPress={(star) => {
                        setReviewRating(item, star);
                      }}
                      style={{alignSelf: 'flex-end'}}
                      starColor={STAR_COLOR.GREEN}
                    />
                  </View>
                </View>
              ))}

              {/* Top Star Rating */}
              {topStarAttributesForScorekeeper?.map((item, index) => (
                renderReviewStar(index,item)
              ))}

              {topStarAttributesForScorekeeper?.length > 0 && (
                <View style={[styles.seperator,{marginBottom:25}]} />
              )}

              {/* Middle Star Rating */}
              {middleStarAttributesForScorekeeper?.map((item, index) => (
                renderReviewStar(index,item)
              ))}

              {middleStarAttributesForScorekeeper?.length > 0 && (
                <View style={[styles.seperator,{marginBottom:25}]} />
              )}

              {/* Bottom Star Rating */}
              {bottomStarAttributesForScorekeeper?.map((item, index) => (
                renderReviewStar(index,item)
              ))}

              {bottomStarAttributesForScorekeeper?.length > 0 && (
                <View style={[styles.seperator,{marginBottom:25}]} />
              )}

            </View>

            {/*  Delete All Rating */}
            <View style={{marginBottom:25, flexDirection:'row', justifyContent:'center'}}>
              <Pressable
                style={{
                  paddingHorizontal:10,
                  paddingVertical: 3,
                  backgroundColor: colors.lightGrey,
                  borderRadius: 5,
                }}
                onPress={() => {
                  removeRatings()
                }}>
                <View>
                    <Text
                      style={{
                        fontFamily: fonts.Roboto,
                        fontSize: 14,
                        color: colors.redColorCard,
                        lineHeight:21,
                        fontWeight:'500'
                      }}>
                      {strings.deleteallrating}
                    </Text>
                </View>
              </Pressable>
            </View>

            {/*  Leave a Review */}
            <View>
              <Text style={[styles.questionTitle,{marginBottom:15}]}>{strings.leaveareview.toUpperCase()}</Text>
              <Pressable
                style={{
                  flex: 1,                    
                  alignItems: 'flex-start',
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  backgroundColor: colors.lightGrey,
                  borderRadius: 5,
                }}
                onPress={() => {
                  navigation.navigate('WriteReviewScreen', {
                    comeFrom: 'ScorekeeperReviewScreen',
                    postData: null,
                    comment: reviewsData.comment ?? '',
                    selectedImageList: reviewsData.attachments || []
                  });
                }}>
                <View>
                  {reviewsData.comment?.length > 0 ? (
                    <NewsFeedDescription
                      disableTouch={true}
                      descriptions={reviewsData.comment}
                      containerStyle={{
                        marginHorizontal: 5,
                        marginVertical: 2,
                      }}
                    />
                  ) : (
                    <Text
                      style={{
                        fontFamily: fonts.Roboto,
                        fontSize: 16,
                        color: colors.userPostTimeColor,
                        lineHeight:24,
                        fontWeight:'400'
                      }}>
                      {strings.writescorekeeperreviewplacholder}
                    </Text>
                  )}
                </View>
              </Pressable>
            </View>
            <FlatList
              data={reviewsData.attachments || []}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => (
                <SelectedImageList
                  data={item}
                  isClose={false}
                  isCounter={false}
                  itemNumber={index + 1}
                  totalItemNumber={reviewsData.attachments?.length}
                  onItemPress={() => {
                    const imgs = reviewsData.attachments;
                    const idx = imgs.indexOf(item);
                    if (idx > -1) {
                      imgs.splice(idx, 1);
                    }
                  }}
                />
              )}
              ItemSeparatorComponent={() => <View style={{width: 5}} />}
              style={{paddingTop: 10, marginHorizontal: 10}}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
      </ScrollView>
    )}
  </View>
);
}
