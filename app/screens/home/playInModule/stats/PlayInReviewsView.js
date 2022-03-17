import {View, Alert} from 'react-native';
import React, {useEffect, useContext, useState} from 'react';
import AuthContext from '../../../../auth/context';

import strings from '../../../../Constants/String';

import {getUserReviews} from '../../../../api/Games';
import UserReviewSection from '../../../../components/Home/UserReviewSection';
import ActivityLoader from '../../../../components/loader/ActivityLoader';

const PlayInReviewsView = ({currentUserData}) => {
  console.log('currentUserData:=>', currentUserData);
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [userReviewData, setUserReviewData] = useState();
  const [averageUserReview, setAverageUserReview] = useState();

  useEffect(() => {
    setLoading(true);
    getUserReviews(currentUserData.user_id, authContext)
      .then((res) => {
        console.log('Get user Review Data Res ::--', res?.payload);
        setLoading(false);

        if (res?.payload) {
          setUserReviewData(res?.payload);
        } else {
          setUserReviewData();
        }

        if (currentUserData) {
          const playerSport = currentUserData.registered_sports.filter(
            (playerItem) =>
              playerItem.sport === 'tennis' &&
              playerItem.sport_type === 'single',
          )[0];

          console.log('playerSport::=>', playerSport);

          if (playerSport?.avg_review) {
            let array = Object.keys(playerSport.avg_review);
            array = array.filter((e) => e !== 'total_avg');
            const playerProperty = [];
            console.log('array player Review Data Res ::--', array);

            for (let i = 0; i < array.length; i++) {
              const obj = {
                [array[i]]: playerSport.avg_review[array[i]],
              };
              playerProperty.push(obj);
            }

            setAverageUserReview(playerProperty);
          } else {
            setAverageUserReview();
          }
        }
      })
      .catch((error) => {
        Alert.alert(strings.alertmessagetitle, error.message);
      });
  }, [authContext, currentUserData.user_id]);
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
      <ActivityLoader visible={loading}/>
      <UserReviewSection
        isTeamReviewSection={true}
        loading={loading}
        reviewsData={averageUserReview}
        reviewsFeed={userReviewData}
        onFeedPress={() => Alert.alert(5)}
        onReadMorePress={() => {
          // reviewerDetailModal();
        }}
      />
    </View>
  );
};

export default PlayInReviewsView;
