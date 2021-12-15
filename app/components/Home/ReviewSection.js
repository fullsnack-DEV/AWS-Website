/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import {
 StyleSheet, View, FlatList, ScrollView, 
 } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import moment from 'moment';
import Carousel from 'react-native-snap-carousel';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
// import images from '../../Constants/ImagePath';
// import strings from '../../Constants/String';
import EventItemRender from '../Schedule/EventItemRender';
import TCRadarChart from '../TCRadarChart';
import ReviewerItemView from './ReviewerItemView';
import ReviewRatingView from './ReviewRatingView';
import ReviewRecentMatch from './ReviewRecentMatch';

function ReviewSection({
  isTeamReviewSection = false,
  reviewsData,
  // onAboutRatingPress,
  onReadMorePress,
  reviewsFeed,
  onFeedPress = () => {},
}) {
  // const [reviewAllData] = useState(review_all_data);
  const [teamPropertyList, setTeamPropertyList] = useState([]);
  const [teamKeyValueList, setTeamKeyValueList] = useState([]);


  console.log('reviewsData',reviewsData);
  console.log('reviewsFeed',reviewsFeed);


  useEffect(() => {
    if (isTeamReviewSection) {
      const teamProperty = [];
      let Obj = {};
      for (let i = 0; i < reviewsData?.length; i++) {
        Obj = { ...Obj };
        Obj[Object?.keys(reviewsData?.[i])[0]] = Object?.values(reviewsData?.[i])[0];
        teamProperty.push(Object?.keys(reviewsData?.[i])[0]);
      }
      setTeamPropertyList(teamProperty);
      setTeamKeyValueList([{ ...Obj }]);
    }
  }, [isTeamReviewSection, reviewsData]);
  return (
    <>
      <ScrollView>
        {isTeamReviewSection && reviewsFeed?.reviews?.results &&(
          <TCRadarChart
          radarChartAttributes={teamPropertyList}
          radarChartData={teamKeyValueList}
        />
      )}
        <EventItemRender
        title={`Rating for teams (${
          Object?.keys(reviewsFeed?.reviews?.results ?? {})?.length ?? 0 
        })`}>
          {reviewsData && (
            <FlatList
            data={reviewsData}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  marginVertical: 6,
                }}
              />
            )}
            style={{ marginVertical: 15 }}
            renderItem={({ item: reviewItem }) => (
              <ReviewRatingView
                title={
                  Object.keys(reviewItem)?.[0]?.charAt(0).toUpperCase()
                  + Object.keys(reviewItem)?.[0]?.slice(1)
                }
                rating={parseFloat(Object.values(reviewItem)?.[0]).toFixed(2)}
                ratingCount={Object.values(reviewItem)?.[0]}
                rateStarSize={18}
                titleStyle={{ fontFamily: fonts.RMedium }}
                containerStyle={{ marginHorizontal: 0, marginLeft: 12 }}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
          {/* <Text style={styles.detailRatingTextStyle} onPress={onAboutRatingPress}>
            {strings.aboutRatingTitle}
          </Text> */}
        </EventItemRender>
        <View style={styles.sepratorViewStyle} />
        <EventItemRender
        title={`Reviews (${Object?.keys(reviewsFeed?.reviews?.results ?? {}).length || 0})`}
        containerStyle={{ width: wp('100%'), padding: 0 }}
        headerTextStyle={{ paddingLeft: 12 }}>
          {/* review_all_data */}
          {/* reviewsFeed?.reviews?.results || []  */}
          <FlatList
          data={Object.values(reviewsFeed?.reviews?.results ?? {}) || []}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View
              style={{
                marginVertical: 6,
              }}
            />
          )}
          style={{ marginVertical: 15 }}
          renderItem={({ item, index }) => {
            console.log('ITEM:::::::::=>', item);
            return (
              <View>
                <ReviewRecentMatch
                  eventColor={colors.themeColor}
                  startDate1={moment(
                    new Date(item?.[0]?.game?.data?.start_time * 1000),
                  ).format('MMM')}
                  startDate2={moment(
                    new Date(item?.[0]?.game?.data?.start_time * 1000),
                  ).format('DD')}
                  title={item?.[0]?.game?.data?.sport}
                  startTime={moment(
                    new Date(item?.[0]?.game?.data?.start_time * 1000),
                  ).format('hh:mm a')}
                  endTime={moment(
                    new Date(item?.[0]?.game?.data?.end_time * 1000),
                  ).format('hh:mm a')}
                  location={item?.[0]?.game?.data?.venue?.address}
                  firstUserImage={item?.[0]?.home_team?.data?.full_image}
                  firstTeamText={item?.[0]?.home_team?.data?.full_name}
                  secondUserImage={item?.[0]?.away_team?.data?.full_image}
                  secondTeamText={item?.[0]?.away_team?.data?.full_name}
                  firstTeamPoint={item?.[0]?.game?.data?.home_team_goal ?? 0}
                  secondTeamPoint={item?.[0]?.game?.data?.away_team_goal ?? 0}
                />
                <Carousel
                  data={item}
                  renderItem={({ item: reviewData, index: i }) => {
                      console.log('carosol review data:', reviewData);
                      return (
                        <ReviewerItemView
                          item={reviewData}
                          gameData={item?.[0]}
                          indexNumber={i}
                          feedIndex={index}
                          totalData={item?.[0]?.reviews}
                          onFeedPress={onFeedPress}
                          onReadMorePress={onReadMorePress}
                        />
                      )
                  }}
                  inactiveSlideScale={1}
                  inactiveSlideOpacity={1}
                  sliderWidth={wp(100)}
                  nestedScrollEnabled={true}
                  itemWidth={wp(94)}
                />
              </View>
            )
          }}
          keyExtractor={(item, index) => index.toString()}
        />
        </EventItemRender>
      </ScrollView>
    </>
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
});

export default ReviewSection;
