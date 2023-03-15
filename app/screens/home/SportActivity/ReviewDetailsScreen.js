// @flow
import moment from 'moment';
import React, {useContext} from 'react';
import {View, SafeAreaView, StyleSheet, FlatList} from 'react-native';
import {strings} from '../../../../Localization/translation';
import AuthContext from '../../../auth/context';
import ScreenHeader from '../../../components/ScreenHeader';
import colors from '../../../Constants/Colors';

import images from '../../../Constants/ImagePath';
import {calculateReviewPeriod} from '../../../utils';
import {getGameHomeScreen} from '../../../utils/gameUtils';
import ActivityCard from './components/reviews/ActivityCard';
import GameCard from './components/reviews/GameCard';

const ReviewDetailsScreen = ({navigation, route}) => {
  const {review, dateTime, sport, sportType} = route.params;
  const authContext = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeader
        title={`${moment(dateTime).format('MMM DD')}'s ${strings.reviews}`}
        containerStyle={{paddingBottom: 10}}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.goBack();
        }}
        rightIcon2={images.chat3Dot}
      />
      <View style={styles.container}>
        <GameCard
          data={review.game}
          onCardPress={() => {
            if (review.game.id && review.game.data.sport) {
              const gameHome = getGameHomeScreen(
                review.game.data.sport.replace(' ', '_'),
              );

              navigation.navigate(gameHome, {
                gameId: review.game.id,
              });
            }
          }}
        />
      </View>
      <View style={styles.container2}>
        <FlatList
          data={review.reviews}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <>
              <ActivityCard
                item={item}
                isReviewPeriodEnd={
                  calculateReviewPeriod(item, review.reviews).isReviewPeriodEnd
                }
                isReplyToReviewPeriodEnd={
                  calculateReviewPeriod(item).isReplyToReviewPeridEnd
                }
                // onPressMore={() => onPressMore(review)}
                userProfile={authContext.entity.obj.full_image}
                authContext={authContext}
                isAdmin={item.home_team?.id === authContext.entity.obj.user_id}
                onReply={(activityId) => {
                  navigation.navigate('ReplyScreen', {
                    sport,
                    sportType,
                    activityId,
                  });
                }}
                onPressMedia={(list, user, date) => {
                  navigation.navigate('LoneStack', {
                    screen: 'MediaScreen',
                    params: {
                      mediaList: list,
                      user,
                      sport,
                      sportType,
                      userId: user.id,
                      createDate: date,
                    },
                  });
                }}
                containerStyle={styles.card}
              />
              <View style={styles.dividor} />
            </>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: colors.grayBackgroundColor,
  },
  dividor: {
    height: 7,
    width: '100%',
    marginVertical: 25,
    backgroundColor: colors.grayBackgroundColor,
  },
  card: {
    marginRight: 0,
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    paddingHorizontal: 18,
    width: '100%',
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
  },
});
export default ReviewDetailsScreen;
