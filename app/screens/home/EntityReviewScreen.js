import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {AirbnbRating} from 'react-native-ratings';
import {useIsFocused} from '@react-navigation/native';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import ScreenHeader from '../../components/ScreenHeader';
import AuthContext from '../../auth/context';
import {getTeamReviews} from '../../api/Games';
import {getRatingsOptions} from '../../utils';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import ReviewsList from './SportActivity/components/reviews/ReviewsList';
import {getEntitySport} from '../../utils/sportsActivityUtils';
import {ModalTypes} from '../../Constants/GeneralConstants';
import CustomModalWrapper from '../../components/CustomModalWrapper';

const EntityReviewScreen = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [ratingsOption, setRatingsOption] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [ratings, setRatings] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [snapPoints, setSnapPoints] = useState([]);

  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const {entityData} = route.params;

  useEffect(() => {
    if (entityData?.group_id) {
      setLoading(true);
      getTeamReviews(entityData?.group_id, true, authContext)
        .then((res) => {
          const result = res.payload?.reviews?.results ?? [];
          setReviews(result);
          setLoading(false);
        })
        .catch((error) =>
          Alert.alert(strings.alertmessagetitle, error.message),
        );
    }
  }, [entityData?.group_id, authContext]);

  useEffect(() => {
    const list = getRatingsOptions(
      authContext,
      entityData?.sport,
      entityData?.entity_type,
    );
    setRatingsOption([...list]);
  }, [authContext, entityData?.sport, entityData?.entity_type]);

  useEffect(() => {
    // Need to change this logic for ratings
    if (entityData?.group_id && isFocused) {
      const sportObj = getEntitySport(entityData, entityData.entity_type);

      if (sportObj?.avg_review) {
        const ratingOpt = {...sportObj.avg_review};
        delete ratingOpt.total_avg;
        setRatings(ratingOpt);
        setTotalRatings(sportObj.total_ratings ?? 0);
        setTotalReviews(sportObj.total_reviews ?? 0);
      }
    }
  }, [entityData, isFocused]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.reviewTitle}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
      />
      <View style={{flex: 1}}>
        {loading ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size={'large'} />
          </View>
        ) : (
          <View style={styles.parent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{paddingHorizontal: 15, paddingVertical: 25}}>
                <Text style={styles.title}>
                  {strings.ratings.toUpperCase()} (
                  {parseFloat(totalRatings).toFixed(1)})
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
                          isDisabled
                          unSelectedColor={colors.grayBackgroundColor}
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
                            : '0.0'}
                        </Text>
                      </View>
                    </View>
                  ))}

                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={() => setShowModal(true)}>
                  <Text style={styles.buttonText}>
                    {strings.aboutRatingsText}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{height: 7, backgroundColor: colors.grayBackgroundColor}}
              />
              <View style={{paddingHorizontal: 15, paddingTop: 25}}>
                <Text style={styles.title}>
                  {strings.reviews.toUpperCase()} (
                  {parseFloat(totalReviews).toFixed(1)})
                </Text>
              </View>
              <ReviewsList
                // onPressMore={onPressMore}
                list={reviews}
                isAdmin
                onReply={() => {}}
                onPressMedia={() => {}}
                onPressGame={() => {}}
                entityType={entityData?.entityType}
              />
            </ScrollView>
          </View>
        )}
      </View>
      <CustomModalWrapper
        isVisible={showModal}
        closeModal={() => setShowModal(false)}
        modalType={ModalTypes.style2}
        containerStyle={{marginBottom: 25}}
        externalSnapPoints={snapPoints}>
        <View
          onLayout={(event) => {
            const contentHeight = event.nativeEvent.layout.height + 80;
            const screenHeight = Dimensions.get('window').height - 40;
            if (contentHeight <= screenHeight) {
              setSnapPoints(['50%', contentHeight, screenHeight]);
            }
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.label, {marginBottom: 25}]}>
              {strings.ratingText}
            </Text>
            {ratingsOption.length > 0
              ? ratingsOption.map((item, index) => (
                  <View key={index} style={{marginBottom: 25}}>
                    <Text style={[styles.label, {fontFamily: fonts.RBold}]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.label, {marginTop: 10}]}>
                      {item.details}
                    </Text>
                  </View>
                ))
              : null}
          </ScrollView>
        </View>
      </CustomModalWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: colors.whiteColor,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
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
});

export default EntityReviewScreen;
