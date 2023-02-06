import React from 'react';
import {Text, View, StyleSheet, Pressable, FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import { format } from 'react-string-format';
import fonts from '../../../../../Constants/Fonts';
import images from '../../../../../Constants/ImagePath';
import colors from '../../../../../Constants/Colors';
import TCKeyboardView from '../../../../TCKeyboardView';
import SelectedImageList from '../../../../WritePost/SelectedImageList';
import NewsFeedDescription from '../../../../newsFeed/NewsFeedDescription';
import UserRatePerformance from './UserRatePerformance';
import { strings } from '../../../../../../Localization/translation';

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
  isRefereeAvailable,
  starColor,
  navigation,
  tags = [],
}) => (
  <TCKeyboardView>
    <View style={styles.mainContainer}>
      {/* Title */}
      <Text style={styles.titleText}>
        {format(strings.doubleteamtitle, teamData?.full_name)}
      </Text>

      {/*  Logo Container */}
      <View style={styles.logoContainer}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <FastImage
            source={
              teamData?.full_image
                ? {uri: teamData?.full_image}
                : images.teamPlaceholder
            }
            resizeMode={'contain'}
            style={{height: 40, width:40, borderRadius: 20}}
          />
        </View>

        {/*    Team name */}
        <Text style={styles.teamName}>
          {teamData?.group_name ?? teamData?.full_name}
        </Text>

        {/*    Country Name */}
        <Text style={styles.countryName}>{teamData.city}, {teamData.state_abbr}</Text>
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
        isRefereeAvailable={isRefereeAvailable}
      />

      {/*  Leave a Review */}
      <View style={styles.leaveReviewContainer}>
        <Text style={styles.titleText}>Leave a review</Text>

        <Pressable
          style={{
            flex: 1,
            // height: 120,
            marginVertical: 10,
            alignItems: 'flex-start',
            padding: 10,
            paddingVertical: 20,
            backgroundColor: colors.offwhite,
            shadowColor: colors.googleColor,
            shadowOffset: {width: 0, height: 2},
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
              selectedImageList: reviewsData?.attachments || [],
              taggedData: tags || [],
            });
          }}>
          <View>
            {reviewsData?.comment !== '' ? (
              <NewsFeedDescription
                disableTouch={true}
                descriptions={reviewsData.comment}
                containerStyle={{marginHorizontal: 5, marginVertical: 2}}
                tagData={tags || []}
                // tags={tags}
              />
            ) : (
              <Text
                style={{
                  fontFamily: fonts.RRegular,
                  fontSize: 16,
                  color: colors.grayColor,
                }}>
                {`Describe what you thought and felt about ${
                  teamData?.full_name ?? teamData?.group_name
                } while watching or playing the game.`}
              </Text>
            )}
          </View>
        </Pressable>
      </View>
      <FlatList
        data={reviewsData?.attachments || []}
        horizontal={true}
        // scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <SelectedImageList
            data={item}
            isClose={false}
            isCounter={false}
            itemNumber={index + 1}
            totalItemNumber={reviewsData?.attachments?.length}
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
        ItemSeparatorComponent={() => <View style={{width: 5}} />}
        style={{paddingTop: 10, marginHorizontal: 10}}
        keyExtractor={(item, index) => index.toString()}
      />
      {/*  Footer */}
      <Text style={styles.footerText}>
        (<Text style={{color: colors.redDelColor}}>*</Text> required)
      </Text>
    </View>
  </TCKeyboardView>
);
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop:20,
    paddingHorizontal:15,
    backgroundColor: colors.whiteColor,
  },
  titleText: {
    fontSize: 20,
    color: colors.lightBlackColor,
    fontWeight:'500',
    fontFamily: fonts.Roboto,
    lineHeight:30,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    marginTop:25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamName: {
    marginTop:7.5,
    color: colors.lightBlackColor,
    fontWeight:'700',
    fontFamily:fonts.Roboto,
    fontSize: 16,
    lineHeight:24
  },
  countryName: {
    color: colors.lightBlackColor,
    fontFamily: fonts.Roboto,
    fontWeight:'300',
    lineHeight:21,
    fontSize: 14,
  },
  seperator: {
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 25,
    height: 1,
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
