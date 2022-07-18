/* eslint-disable no-shadow */
import React, {useEffect, useContext} from 'react';
import {StyleSheet, View, FlatList, ScrollView, Text} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import moment from 'moment';
import Carousel from 'react-native-snap-carousel';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
// import images from '../../Constants/ImagePath';
// import strings from '../../Constants/String';
import EventItemRender from '../Schedule/EventItemRender';
import ReviewerItemView from './ReviewerItemView';
import ReviewRatingView from './ReviewRatingView';
import ReviewRecentMatch from './ReviewRecentMatch';
import {getSportName} from '../../utils';
import AuthContext from '../../auth/context';

function UserReviewSection({
  isTeamReviewSection = false,
  reviewsData,
  loading,
  // onAboutRatingPress,
  onReadMorePress,
  reviewsFeed,
  onFeedPress = () => {},
}) {
  // const [reviewAllData] = useState(review_all_data);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (isTeamReviewSection) {
      const teamProperty = [];
      let Obj = {};
      for (let i = 0; i < reviewsData?.length; i++) {
        Obj = {...Obj};
        Obj[Object.keys(reviewsData[i])[0]] = Object.values(reviewsData[i])[0];
        teamProperty.push(Object.keys(reviewsData[i])[0]);
      }
    }
  }, [isTeamReviewSection, reviewsData]);
  return (
    <ScrollView>
      <EventItemRender
        title={`Ratings (${reviewsFeed?.reviews?.results?.length || 0})`}
      >
        {reviewsData && (
          <View>
            <FlatList
              data={reviewsData}
              bounces={false}
              ListEmptyComponent={() =>
                !loading && (
                  <View>
                    <Text style={styles.noRating}>No Ratings Yet</Text>
                  </View>
                )
              }
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    marginVertical: 6,
                  }}
                />
              )}
              style={{marginVertical: 15}}
              renderItem={({item: reviewItem}) => (
                <ReviewRatingView
                  title={
                    Object.keys(reviewItem)?.[0] === 'respectforreferre'
                      ? 'Respect For Referee'
                      : Object.keys(reviewItem)?.[0]?.charAt(0).toUpperCase() +
                        Object.keys(reviewItem)?.[0]?.slice(1)
                  }
                  rating={parseFloat(Object.values(reviewItem)?.[0]).toFixed(2)}
                  ratingCount={Object.values(reviewItem)?.[0]}
                  rateStarSize={18}
                  titleStyle={{fontFamily: fonts.RMedium}}
                  containerStyle={{marginHorizontal: 0, marginLeft: 12}}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            {/* {reviewsData.length > 0 && (
              <Text
                style={styles.detailRatingTextStyle}
                onPress={onAboutRatingPress}>
                {strings.aboutRatingTitle}
              </Text>
            )} */}
          </View>
        )}
      </EventItemRender>
      <View style={styles.sepratorViewStyle} />
      <EventItemRender
        title={`Reviews (${reviewsFeed?.reviews?.results?.length || 0})`}
        containerStyle={{width: wp('100%'), padding: 0}}
        headerTextStyle={{paddingLeft: 12}}
      >
        {/* review_all_data */}
        {/* reviewsFeed?.reviews?.results || []  */}
        <FlatList
          data={reviewsFeed?.reviews?.results || []}
          bounces={false}
          ListEmptyComponent={() =>
            !loading && (
              <View>
                <Text style={styles.noRating}>No Reviews Yet</Text>
              </View>
            )
          }
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View
              style={{
                marginVertical: 6,
              }}
            />
          )}
          style={{marginVertical: 15}}
          renderItem={({item, index}) => (
            <View>
              <ReviewRecentMatch
                eventColor={colors.themeColor}
                startDate1={moment(
                  new Date(item?.game?.data?.start_time * 1000),
                ).format('MMM')}
                startDate2={moment(
                  new Date(item?.game?.data?.start_time * 1000),
                ).format('DD')}
                title={getSportName(item?.game?.data, authContext)}
                startTime={moment(
                  new Date(item?.game?.data?.start_time * 1000),
                ).format('hh:mm a')}
                endTime={moment(
                  new Date(item?.game?.data?.end_time * 1000),
                ).format('hh:mm a')}
                location={
                  item?.game?.data?.venue?.address ??
                  item?.game?.data?.venue?.description
                }
                firstUserImage={item?.game?.home_team?.data?.full_image}
                firstTeamText={item?.game?.home_team?.data?.full_name}
                secondUserImage={item?.game?.away_team?.data?.full_image}
                secondTeamText={item?.game?.away_team?.data?.full_name}
                firstTeamPoint={item?.game?.data?.home_team_goal ?? 0}
                secondTeamPoint={item?.game?.data?.away_team_goal ?? 0}
              />
              <Carousel
                data={item?.reviews}
                renderItem={({item: reviewData, index: i}) => (
                  <ReviewerItemView
                    item={reviewData}
                    gameData={item?.game}
                    indexNumber={i}
                    feedIndex={index}
                    totalData={item?.reviews}
                    onFeedPress={onFeedPress}
                    onReadMorePress={onReadMorePress}
                  />
                )}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                sliderWidth={wp(100)}
                nestedScrollEnabled={true}
                itemWidth={wp(94)}
              />
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </EventItemRender>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // detailRatingTextStyle: {
  //   fontSize: 12,
  //   fontFamily: fonts.RRegular,
  //   color: colors.lightBlackColor,
  //   textDecorationLine: 'underline',
  //   alignSelf: 'flex-end',
  // },
  sepratorViewStyle: {
    marginTop: 20,
    marginBottom: 10,
    height: 7,
    backgroundColor: colors.grayBackgroundColor,
  },
  noRating: {
    fontSize: 18,
    fontFamily: fonts.RMedium,
    color: colors.grayColor,
    alignSelf: 'center',
  },
});

export default UserReviewSection;
