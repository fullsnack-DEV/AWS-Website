import React from 'react';
import {
  Text, View, StyleSheet, Pressable, FlatList,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import fonts from '../../../../../Constants/Fonts';
import images from '../../../../../Constants/ImagePath';
import colors from '../../../../../Constants/Colors';
import TCKeyboardView from '../../../../TCKeyboardView';
import SelectedImageList from '../../../../WritePost/SelectedImageList';
import NewsFeedDescription from '../../../../newsFeed/NewsFeedDescription';
import UserRatePerformance from './UserRatePerformance';

// const makeTagedUser=()=>{
//   if(reviewsData?.team_reviews[teamNo]?.comment)
//   const strColor = str.replace(/\d+/, match => <span style={{color: 'red'}}> {match} </span> );
//   <Text style={{ color: 'red' }}>{reviewsData?.team_reviews[teamNo]?.comment}</Text>
// }
const UserReview = ({
  teamNo,
  reviewsData,
  setTeamReview,
  reviewAttributes,
  teamData,
  starColor,
  navigation,
  tags = [],
}) => (
  <TCKeyboardView>
    <View style={styles.mainContainer}>
      {/* Title */}
      <Text style={styles.titleText}>
        Please, rate the performance of {teamData?.full_name} and leave a
        review for the team.
      </Text>

      {/*  Logo Container */}
      <View style={styles.logoContainer}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <FastImage
            source={
              teamData?.full_image
                ? { uri: teamData?.full_image }
                : images.teamPlaceholder
            }
            resizeMode={'contain'}
            style={{ height: 50, width: 50 }}
          />
        </View>

        {/*    Team name */}
        <Text style={styles.teamName}>{teamData?.group_name}</Text>

        {/*    Country Name */}
        <Text style={styles.countryName}>{teamData?.country}</Text>
      </View>

      {/* Seperator */}
      <View style={styles.seperator} />

      {/*  Rate Performance */}
      <UserRatePerformance
        teamNo={teamNo}
        reviewsData={reviewsData}
        setTeamReview={(key, value) => setTeamReview(teamNo, key, value)}
        reviewAttributes={reviewAttributes}
        starColor={starColor}
      />

      {/*  Leave a Review */}
      <View style={styles.leaveReviewContainer}>
        <Text style={styles.titleText}>Leave a review</Text>
        {/* <TCInputBox
          onChangeText={(value) => setTeamReview(teamNo, 'comment', value)}
          value={reviewsData?.team_reviews?.[teamNo]?.comment ?? ''}
          multiline={true}
          placeHolderText={'Describe what you thought and felt about New York City FC while watching or playing the game.'}
          textInputStyle={{ fontSize: 16, color: colors.userPostTimeColor }}
          style={{
            height: 120,
            marginVertical: 10,
            alignItems: 'flex-start',
            padding: 15,
          }}
      /> */}
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
              comeFrom: 'LeaveReviewTennis',
              postData: null,
              searchText: reviewsData?.comment ?? '',
              // onPressDone: callthis,
              selectedImageList:
                reviewsData?.attachments || [],
              taggedData: reviewsData?.tagged || [],
            });
          }}>
          <View pointerEvents="none">
            {/* <TCInputBox
                        value={reviewsData?.team_reviews[teamNo]?.comment ?? ''}
                        multiline={true}
                        placeHolderText={`Describe what you thought and felt about ${teamData?.group_name} while watching or playing the game.`}
                        textInputStyle={{ fontSize: 16, color: colors.userPostTimeColor }}
                        style={{
                          height: 120,
                          marginVertical: 10,
                          alignItems: 'flex-start',
                          padding: 15,
                        }} /> */}

            {reviewsData?.comment !== '' ? (
              <NewsFeedDescription
                          descriptions={reviewsData.comment}
                          containerStyle={{ marginHorizontal: 5, marginVertical: 2 }}
                          tags={tags}
                        />
            ) : (
              <Text
                      style={{
                        fontFamily: fonts.RRegular,
                        fontSize: 16,
                        color: colors.grayColor,
                      }}>
                {`Describe what you thought and felt about ${teamData?.group_name} while watching or playing the game.`}
              </Text>)}
          </View>
        </Pressable>
      </View>
      <FlatList
        data={reviewsData?.attachments || []}
        horizontal={true}
        // scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <SelectedImageList
            data={item}
            isClose={false}
            isCounter={false}
            itemNumber={index + 1}
            totalItemNumber={
              reviewsData?.attachments?.length
            }
            onItemPress={() => {
              const imgs = reviewsData?.attachments;
              const idx = imgs.indexOf(item);
              if (idx > -1) {
                imgs.splice(idx, 1);
              }
              // setSelectImage(imgs);
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
);
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.whiteColor,
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
  footerText: {
    color: colors.lightBlackColor,
    fontSize: 12,
    fontFamily: fonts.RLight,
  },
  leaveReviewContainer: {},
});
export default UserReview;
