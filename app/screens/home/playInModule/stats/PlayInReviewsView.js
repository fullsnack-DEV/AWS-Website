import {View, Alert} from 'react-native';
import React, {useEffect, useContext, useState} from 'react';
import AuthContext from '../../../../auth/context';

import {strings} from '../../../../../Localization/translation';

import {getUserReviews} from '../../../../api/Games';
import UserReviewSection from '../../../../components/Home/UserReviewSection';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import Verbs from '../../../../Constants/Verbs';

const PlayInReviewsView = ({currentUserData}) => {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [userReviewData, setUserReviewData] = useState();
  const [averageUserReview, setAverageUserReview] = useState();

  useEffect(() => {
    setLoading(true);
    getUserReviews(currentUserData.user_id, authContext)
      .then((res) => {
        setLoading(false);

        if (res?.payload) {
          setUserReviewData(res?.payload);
        } else {
          setUserReviewData();
        }

        if (currentUserData) {
          const playerSport = currentUserData.registered_sports.filter(
            (playerItem) =>
              playerItem.sport === Verbs.tennisSport &&
              playerItem.sport_type === Verbs.singleSport,
          )[0];

          if (playerSport?.avg_review) {
            let array = Object.keys(playerSport.avg_review);
            array = array.filter((e) => e !== 'total_avg');
            const playerProperty = [];

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
    <View>
      <ActivityLoader visible={loading} />
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
