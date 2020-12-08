import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  Text,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Carousel from 'react-native-snap-carousel';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import EventItemRender from '../Schedule/EventItemRender';
import ReviewerItemView from './ReviewerItemView';
import ReviewRatingView from './ReviewRatingView';
import ReviewRecentMatch from './ReviewRecentMatch';

const reviewer_data = [
  {
    userImage: images.team_ph,
    userName: 'Christiano Ronaldo',
    created_date: 'Apr 23',
    description: strings.aboutValue,
    attachments: [
      {
        thumbnail: images.orangeGradient,
        type: 'image',
      },
      {
        thumbnail: images.orangeGradient,
        type: 'image',
      },
      {
        thumbnail: images.orangeGradient,
        type: 'image',
      },
      {
        thumbnail: images.orangeGradient,
        type: 'image',
      },
      {
        thumbnail: images.orangeGradient,
        type: 'image',
      },
    ],
    commentCount: 1,
    shareCount: 2,
    likeCount: 9,
  },
  {
    userImage: images.team_ph,
    userName: 'Christiano Ronaldo',
    created_date: 'Apr 23',
    description: strings.aboutValue,
    attachments: [
      {
        thumbnail: images.orangeGradient,
        type: 'image',
      },
    ],
    commentCount: 1,
    shareCount: 2,
    likeCount: 9,
  },
];

function ReviewSection({
  reviewsData,
  onAboutRatingPress,
}) {
  const [reviewerData] = useState(reviewer_data);

  return (
    <ScrollView>
      <EventItemRender
        title={'Rating for teams (0)'}
      >
        <FlatList
            data={reviewsData}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{
              marginVertical: 6,
            }} />}
            style={{ marginVertical: 15 }}
            renderItem={({ item: reviewItem }) => <ReviewRatingView
            title={reviewItem.title}
            rating={Number(reviewItem.rating)}
            ratingCount={reviewItem.rating}
            rateStarSize={20}
            titleStyle={{ fontFamily: fonts.RMedium }}
            containerStyle={{ marginHorizontal: 0, marginLeft: 12 }}
            />}
            ListFooterComponent={() => <View style={{ marginTop: 6 }}>
              <View style={styles.lastReviewItemSeprator} />
              <ReviewRatingView
                title={'Punctuality'}
                rating={Number(4.0)}
                ratingCount={'4.0'}
                rateStarSize={20}
                titleStyle={{ fontFamily: fonts.RMedium }}
                containerStyle={{ marginHorizontal: 0, marginLeft: 12 }}
              />
            </View>}
            keyExtractor={(item, index) => index.toString()}
        />
        <Text
          style={styles.detailRatingTextStyle}
          onPress={onAboutRatingPress}
        >{strings.aboutRatingTitle}</Text>
      </EventItemRender>
      <View style={styles.sepratorViewStyle} />
      <EventItemRender
        title={'Reviews (10)'}
        containerStyle={{ width: wp('100%'), padding: 0 }}
        headerTextStyle={{ paddingLeft: 12 }}
      >
        <ReviewRecentMatch
          eventColor={colors.yellowColor}
          startDate1={'Sep'}
          startDate2={'25'}
          title={'Soccer'}
          startTime={'7:00pm -'}
          endTime={'9:10pm'}
          location={'BC Stadium'}
          firstUserImage={images.team_ph}
          firstTeamText={'Vancouver Whitecaps'}
          secondUserImage={images.team_ph}
          secondTeamText={'Newyork City FC'}
          firstTeamPoint={3}
          secondTeamPoint={1}
        />
        <Carousel
            data={reviewerData}
            renderItem={({ item }) => <ReviewerItemView
                item={item}
            />}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            sliderWidth={wp(100)}
            nestedScrollEnabled={true}
            itemWidth={wp(94)}
        />
      </EventItemRender>
      <View style={{ marginBottom: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  lastReviewItemSeprator: {
    height: 1,
    marginLeft: 12,
    marginVertical: 5,
    backgroundColor: colors.lightgrayColor,
  },
  detailRatingTextStyle: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    textDecorationLine: 'underline',
    alignSelf: 'flex-end',
  },
  sepratorViewStyle: {
    marginTop: 20,
    marginBottom: 10,
    height: 7,
    backgroundColor: colors.grayBackgroundColor,
  },
});

export default ReviewSection;
