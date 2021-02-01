/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, {
  useState, useEffect, useLayoutEffect, useContext,
} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  FlatList,
} from 'react-native';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import fonts from '../../../../../../Constants/Fonts';

import { STAR_COLOR } from '../../../../../../utils';
import { addRefereeReview } from '../../../../../../api/Games';
import TCInnerLoader from '../../../../../TCInnerLoader';
import images from '../../../../../../Constants/ImagePath';
import colors from '../../../../../../Constants/Colors';
import uploadImages from '../../../../../../utils/imageAction';

import AuthContext from '../../../../../../auth/context';
import TCInputBox from '../../../../../TCInputBox';
import TCKeyboardView from '../../../../../TCKeyboardView';
import TCRatingStarSlider from '../../../../../TCRatingStarSlider';
import Header from '../../../../../Home/Header';
import SelectedImageList from '../../../../../WritePost/SelectedImageList';
import strings from '../../../../../../Constants/String';
import ActivityLoader from '../../../../../loader/ActivityLoader';
import NewsFeedDescription from '../../../../../newsFeed/NewsFeedDescription';

const QUSTIONS = [
  // { attrName: 'ontime', desc: 'Did the players arrive at the match place on time?' },
  // { attrName: 'manner', desc: 'Did the players keep good manners for the other players, officials and spectators during the match?' },
  { attrName: 'punctuality', desc: strings.punchualityDesc },
];
export default function RefereeReviewScreen({ navigation, route }) {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [sliderAttributesForPlayer, setSliderAttributesForPlayer] = useState(
    [],
  );
  const [gameData] = useState(route?.params?.gameData);
  const [progressBar, setProgressBar] = useState(false);
  const [totalUploadCount, setTotalUploadCount] = useState(0);
  const [doneUploadCount, setDoneUploadCount] = useState(0);
  const [cancelApiRequest, setCancelApiRequest] = useState(null);
  const [currentUserDetail, setCurrentUserDetail] = useState(null);
  const [selectImage, setSelectImage] = useState(
    route?.params?.selectedImageList || [],
  );
  const [reviewsData, setReviewsData] = useState({
    comment: '',
    attachments: [],
    tagged: [],
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const entity = authContext.entity;
      setCurrentUserDetail(entity.obj || entity.auth.user);
    });

    return () => {
      unsubscribe();
    };
  }, [authContext.entity]);

  useEffect(() => {
    console.log(
      'Progress Data::=>',
      progressBar + totalUploadCount + doneUploadCount,
    );
    console.log('Review data::=>', route?.params?.searchText);

    if (route?.params?.searchText) {
      const obj = { ...reviewsData }
      obj.comment = route?.params?.searchText ?? ''
      setReviewsData({ ...obj })
      // setTeamReview('comment', route?.params?.searchText);
    }
    if (route?.params?.selectedImageList) {
      setSelectImage(route?.params?.selectedImageList);
    }
    loadSliderAttributes(route?.params?.sliderAttributesForReferee);
    loadStarAttributes(route?.params?.starAttributesForReferee);
  }, [route?.params?.selectedImageList, route?.params?.searchText]);

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
    const attr = {};
    attributes.map((item) => {
      attr[item] = 0;
      return true;
    });
    let reviews = _.cloneDeep(reviewsData);
    reviews = { ...reviews, ...attr };

    setReviewsData({ ...reviews });
    setLoading(false);
  };

  const loadStarAttributes = (attributes) => {
    setLoading(true);
    const attr = {};
    attributes.map((item) => {
      attr[item] = 0;
      return true;
    });
    let reviews = _.cloneDeep(reviewsData);
    reviews = { ...reviews, ...attr };

    setReviewsData({ ...reviews });
    setLoading(false);
  };

  const isValidReview = () => {
    const exceptKey = ['comment', 'attachments', 'tagged'];
    let isValid = true;
    console.log('reviewsData ::=>', reviewsData);
    const reviews = _.cloneDeep(reviewsData);

    Object.keys(reviews).map((key) => {
      if (!exceptKey.includes(key) && isValid && Number(reviews?.[key]) <= 0) {
        isValid = false;
      }
      return key;
    });
    return isValid;
  };
  const createReview = () => {
    console.log('Review Data::=>', reviewsData);
    if (!isValidReview()) {
      Alert.alert('Please, complete all ratings before moving to the next.');
    } else {
      console.log('route?.params?.gameData?.game_id::=>', gameData);
      uploadMedia();
    }
  };

  const setTeamReview = (key = '', value = '') => {
    if (reviewsData[key] !== value) {
      const reviews = _.cloneDeep(reviewsData);

      reviews[key] = value;
      setReviewsData({ ...reviews });
      console.log(`reviews::${JSON.stringify(reviews)}`);
    }
  };
  const onCancelImageUpload = () => {
    if (cancelApiRequest) {
      cancelApiRequest.cancel('Cancel Image Uploading');
    }
    setProgressBar(false);
    setDoneUploadCount(0);
    setTotalUploadCount(0);
  };

  const progressStatus = (completed, total) => {
    setDoneUploadCount(completed < total ? completed + 1 : total);
  };

  const cancelRequest = (axiosTokenSource) => {
    setCancelApiRequest({ ...axiosTokenSource });
  };

  const uploadMedia = () => {
    if (selectImage.length) {
      const UrlArray = [];
      const pathArray = [];
      const o = selectImage.map((e) => {
        if (e.path) {
          pathArray.push(e);
        } else {
          UrlArray.push(e);
        }
      });
      setLoading(true);
      setTotalUploadCount(pathArray?.length || 1);
      setProgressBar(true);
      const imageArray = pathArray;
      uploadImages(imageArray, authContext, progressStatus, cancelRequest).then(
        (responses) => {
          const attachments = responses.map((item) => ({
            type: item.type,
            url: item.fullImage,
            thumbnail: item.thumbnail,
            media_height: item.height,
            media_width: item.width,
          }));
          console.log('Attachments::=>', attachments);
          const dataParams = {
            ...reviewsData,
            attachments: [...attachments, ...UrlArray],
            comment: route?.params?.searchText,
            // text: postDesc && postDesc,
            // attachments,
          };
          console.log('dataParams::=>', dataParams);
          addRefereeReview(
            route?.params?.userData?.user_id,
            gameData?.game_id,
            dataParams,
            authContext,
          )
            .then(() => {
              setLoading(false);
              navigation.goBack();
            })
            .catch((error) => {
              setLoading(false);
              setTimeout(
                () => Alert.alert(strings.alertmessagetitle, error?.message),
                100,
              );
            });
        },
      );
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTextStyle}>Leave a Referee review</Text>
        }
        rightComponent={
          <Text onPress={createReview} style={styles.nextButtonStyle}>
            {'Done'}
          </Text>
        }
      />
      {/* Seperator */}
      <View style={styles.headerSeperator} />
      <ActivityLoader visible={loading} />
      {!loading && (
        <ScrollView>
          <TCKeyboardView>
            <View style={styles.mainContainer}>
              {/* Title */}
              <Text style={styles.titleText}>
                Please, rate the performance of{' '}
                {route?.params?.userData?.first_name}{' '}
                {route?.params?.userData?.last_name} and leave a review for the
                referee.
              </Text>

              {/*  Logo Container */}
              <View style={styles.logoContainer}>
                {/* Image */}
                <View style={styles.imageContainer}>
                  <FastImage
                    source={
                      route?.params?.userData?.thumbnail
                        ? { uri: route?.params?.userData?.thumbnail }
                        : images.teamPlaceholder
                    }
                    resizeMode={'contain'}
                    style={{ height: 50, width: 50 }}
                  />
                </View>

                {/*    Team name */}
                <Text style={styles.teamName}>
                  {route?.params?.userData?.first_name}{' '}
                  {route?.params?.userData?.last_name}
                </Text>

                {/*    Country Name */}
                <Text style={styles.countryName}>
                  {route?.params?.userData?.country}
                </Text>
              </View>

              {/* Seperator */}
              <View style={styles.seperator} />

              {/*  Rate Performance */}

              <View style={styles.mainContainerRate}>
                {/*    Title */}
                <Text style={styles.titleText}>
                  Rate performance{' '}
                  <Text style={{ color: colors.redDelColor }}>*</Text>
                </Text>

                {/* Ratings */}
                <View style={styles.rateSection}>
                  {sliderAttributesForPlayer.map((item, index) => (
                    <View
                      style={{
                        marginVertical: 10,
                        flexDirection: 'row',
                      }}
                      key={index}>
                      <Text style={styles.starText}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </Text>
                      <View style={{ flex: 1 }}>
                        <TCRatingStarSlider
                          currentRating={reviewsData[item.name]}
                          onPress={(star) => {
                            setTeamReview(item, star);
                          }}
                          style={{ alignSelf: 'flex-end' }}
                          starColor={STAR_COLOR.GREEN}
                        />
                      </View>
                    </View>
                  ))}
                </View>

                {/* Questions */}
                {QUSTIONS.map((item, index) => (
                  <View style={{ marginVertical: 5 }} key={index}>
                    <Text style={styles.questionText}>{item.desc}</Text>
                    <TCRatingStarSlider
                      currentRating={reviewsData[item.attrName]}
                      onPress={(star) => {
                        setTeamReview(item.attrName, star);
                      }}
                      style={{ alignSelf: 'flex-end' }}
                      starColor={STAR_COLOR.GREEN}
                    />
                  </View>
                ))}
              </View>

              {/*  Leave a Review */}
              <View style={styles.leaveReviewContainer}>
                <Text style={styles.titleText}>Leave a review</Text>
                <Pressable
                style={{
                  height: 120,
                  marginVertical: 10,
                  alignItems: 'flex-start',
                  padding: 15,
                  backgroundColor: colors.offwhite,
                  shadowColor: colors.googleColor,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                  elevation: 5,
                  borderRadius: 5,
                }}
                  onPress={() => {
                    navigation.navigate('WriteReviewScreen', {
                      comeFrom: 'RefereeReviewScreen',
                      postData: currentUserDetail,
                      searchText: route?.params?.searchText ?? '',
                      // onPressDone: callthis,
                      selectedImageList: selectImage || [],
                    });
                  }}>
                  <View pointerEvents="none">
                    {/* <TCInputBox
                        value={route?.params?.searchText ?? ''}
                        multiline={true}
                        placeHolderText={`Describe what you thought and felt about ${route?.params?.userData?.first_name} ${route?.params?.userData?.last_name} while watching or playing the game.`}
                        textInputStyle={{ fontSize: 16, color: colors.userPostTimeColor }}
                        style={{
                          height: 120,
                          marginVertical: 10,
                          alignItems: 'flex-start',
                          padding: 15,
                        }} /> */}

                    {route?.params?.searchText ? (
                      <NewsFeedDescription
                          descriptions={route?.params?.searchText ?? ''}
                          containerStyle={{ marginHorizontal: 5, marginVertical: 2 }}
                        />
                    ) : (
                      <Text
                      style={{
                        fontFamily: fonts.RRegular,
                        fontSize: 16,
                        color: colors.grayColor,
                      }}>
                        {`Describe what you thought and felt about ${route?.params?.userData?.first_name} ${route?.params?.userData?.last_name} while watching or playing the game.`}
                      </Text>)}
                  </View>
                </Pressable>
              </View>
              <FlatList
                data={selectImage || []}
                horizontal={true}
                // scrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <SelectedImageList
                    data={item}
                    isClose={false}
                    isCounter={false}
                    itemNumber={index + 1}
                    totalItemNumber={selectImage?.length}
                    onItemPress={() => {
                      const imgs = [...selectImage];
                      const idx = imgs.indexOf(item);
                      if (idx > -1) {
                        imgs.splice(idx, 1);
                      }
                      setSelectImage(imgs);
                    }}
                  />
                )}
                ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
                style={{ paddingTop: 10, marginHorizontal: 10 }}
                keyExtractor={(item, index) => index.toString()}
              />
              {/*  Footer */}
              <Text style={styles.footerText}>
                (<Text style={{ color: colors.redDelColor }}>*</Text> required)
              </Text>
            </View>
          </TCKeyboardView>
        </ScrollView>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
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
  headerSeperator: {
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 0,
    height: 2,
    width: '100%',
  },
  footerText: {
    color: colors.lightBlackColor,
    fontSize: 12,
    fontFamily: fonts.RLight,
  },
  leaveReviewContainer: {},
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
  questionText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },
  starText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    // flex: 0.4,
  },
  backImageStyle: {
    height: 20,
    width: 16,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  eventTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
});
