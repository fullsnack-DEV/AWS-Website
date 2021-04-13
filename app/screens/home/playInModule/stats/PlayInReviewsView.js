import {
  View, Alert,
} from 'react-native';
import React, { useEffect, useContext, useState } from 'react';
import AuthContext from '../../../../auth/context';

import strings from '../../../../Constants/String';

import {

  getUserReviews,

} from '../../../../api/Games';
import UserReviewSection from '../../../../components/Home/UserReviewSection';

const PlayInReviewsView = ({
  currentUserData,
}) => {
  console.log('currentUserData:=>', currentUserData);
  const authContext = useContext(AuthContext);
  const [userReviewData, setUserReviewData] = useState()
  const [averageUserReview, setAverageUserReview] = useState()

  useEffect(() => {
      getUserReviews(currentUserData.user_id, authContext).then((res) => {
        console.log('Get user Review Data Res ::--', res?.payload);

        if (res?.payload?.averageReviews?.[0]) {
          let array = Object.keys(res?.payload?.averageReviews?.[0]?.avg_review);
          array = array.filter((e) => e !== 'total_avg');
          const userProperty = []

          for (let i = 0; i < array.length; i++) {
            const obj = {
              [array[i]]: res?.payload?.averageReviews?.[0]?.avg_review[array[i]],
            }
            userProperty.push(obj)
          }
          setAverageUserReview(userProperty)
          setUserReviewData(res?.payload)
        } else {
          setAverageUserReview([])
          setUserReviewData()
        }
      })
          .catch((error) => Alert.alert(strings.alertmessagetitle, error.message))
  }, [authContext, currentUserData.user_id])
  return (
    // <View style={{ flex: 1 }}>
    //   <EventItemRender
    //       title={'Ratings (3)'}
    //     >
    //     <FlatList
    //         data={[{ technical: '5.00' }, { punctuality: '3.00' }, { defending: '4.00' }]}
    //         bounces={false}
    //         showsHorizontalScrollIndicator={false}
    //         ItemSeparatorComponent={() => <View style={{
    //           marginVertical: 6,
    //         }} />}
    //         style={{ marginVertical: 15 }}
    //         renderItem={({ item: reviewItem }) => <ReviewRatingView
    //         title={Object.keys(reviewItem)?.[0]?.charAt(0).toUpperCase() + Object.keys(reviewItem)?.[0]?.slice(1)}
    //         rating={parseFloat(Object.values(reviewItem)?.[0]).toFixed(2)}
    //         ratingCount={Object.values(reviewItem)?.[0]}
    //         rateStarSize={18}
    //         titleStyle={{ fontFamily: fonts.RMedium }}
    //         containerStyle={{ marginHorizontal: 0, marginLeft: 12 }}
    //         />}
    //         keyExtractor={(item, index) => index.toString()}
    //       />
    //     <Text
    //         style={styles.detailRatingTextStyle}
    //         // onPress={onAboutRatingPress}
    //       >{strings.aboutRatingTitle}</Text>
    //   </EventItemRender>
    //   <TCThickDivider marginVertical={15}/>
    // </View>
    <View>
      <UserReviewSection
          isTeamReviewSection={true}
          reviewsData={averageUserReview}
          reviewsFeed={userReviewData}
          onFeedPress={() => Alert.alert(5)}
          onReadMorePress={() => {
            // reviewerDetailModal();
          }}
      />
    </View>
      )
}

export default PlayInReviewsView;
