import React from 'react';
import {Text, View, Pressable, FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import {format} from 'react-string-format';
import fonts from '../../../../../Constants/Fonts';
import images from '../../../../../Constants/ImagePath';
import colors from '../../../../../Constants/Colors';
import SelectedImageList from '../../../../WritePost/SelectedImageList';
import NewsFeedDescription from '../../../../newsFeed/NewsFeedDescription';
import UserRatePerformance from './UserRatePerformance';
import {strings} from '../../../../../../Localization/translation';
import styles from '../../../soccer/home/review/ReviewStyles';
import {displayLocation} from '../../../../../utils';

const UserReview = ({
  reviewsData,
  setReviewRating,
  reviewAttributes,
  teamData,
  isRefereeAvailable,
  starColor,
  navigation,
  removeRatings,
  isPlayer
}) => (
  <View style={styles.mainContainer}>
    {/* Title */}
    <Text style={styles.titleText}>
      {format(
        strings.teamreviewtitle,
        teamData.full_name || teamData.group_name,
      )}
    </Text>
    {/*  Logo Container */}
    <View style={styles.logoContainer}>
      {/* Image */}
      <View style={styles.imageContainer}>
        <FastImage
          source={
            teamData.thumbnail
              ? {uri: teamData.thumbnail}
              : images.teamPlaceholder
          }
          resizeMode={'cover'}
          style={{height: 45, width: 45, borderRadius: 22.5}}
        />
      </View>

      {/* Reviewed name */}
      <Text style={styles.teamName}>
        {teamData.full_name || teamData.group_name}
      </Text>

      {/* Reviewed Location */}
      <Text style={styles.countryName}>{displayLocation(teamData)}</Text>
    </View>

    {/* Seperator */}
    <View style={[styles.seperator, {marginVertical: 15}]} />

    {/*  Rate Performance */}
    <UserRatePerformance
      reviewsData={reviewsData}
      setReviewRating={(key, value) => setReviewRating(key, value)}
      reviewAttributes={reviewAttributes}
      starColor={starColor}
      isRefereeAvailable={isRefereeAvailable}
    />

    {/*  Delete All Rating */}
    <View
      style={{
        marginBottom: 25,
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
      <Pressable
        style={{
          paddingHorizontal: 10,
          paddingVertical: 3,
          backgroundColor: colors.lightGrey,
          borderRadius: 5,
        }}
        onPress={() => {
          removeRatings();
        }}>
        <View>
          <Text
            style={{
              fontFamily: fonts.Roboto,
              fontSize: 14,
              color: colors.redColorCard,
              lineHeight: 21,
              fontWeight: '500',
            }}>
            {strings.deleteallrating}
          </Text>
        </View>
      </Pressable>
    </View>

    {/*  Leave a Review */}
    <View>
      <Text style={[styles.questionTitle, {marginBottom: 15}]}>
        {strings.leaveareview.toUpperCase()}
      </Text>
      <Pressable
        style={{
          flex: 1,
          alignItems: 'flex-start',
          paddingVertical: 10,
          paddingHorizontal: 15,
          backgroundColor: colors.lightGrey,
          borderRadius: 5,
        }}
        onPress={() => {
          navigation.navigate('WriteReviewScreen', {
            comeFrom: 'LeaveReviewTennis',   
            postData: null,
            comment: reviewsData.comment ?? '',
            selectedImageList: reviewsData.attachments || [],
            isPlayer
          });
        }}>
        <View>
          {reviewsData.comment?.length > 0 ? (
            <NewsFeedDescription
              disableTouch={true}
              descriptions={reviewsData.comment}
              containerStyle={{
                marginHorizontal: 5,
                marginVertical: 2,
              }}
            />
          ) : (
            <Text
              style={{
                fontFamily: fonts.Roboto,
                fontSize: 16,
                color: colors.userPostTimeColor,
                lineHeight: 24,
                fontWeight: '400',
              }}>
              {isPlayer ? strings.writeplayerreviewplacholder : strings.writeteamreviewplacholder}
            </Text>
          )}
        </View>
      </Pressable>
    </View>
    <FlatList
      data={reviewsData.attachments || []}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      renderItem={({item, index}) => (
        <SelectedImageList
          data={item}
          isClose={false}
          isCounter={false}
          itemNumber={index + 1}
          totalItemNumber={reviewsData.attachments?.length}
          onItemPress={() => {
            const imgs = reviewsData.attachments;
            const idx = imgs.indexOf(item);
            if (idx > -1) {
              imgs.splice(idx, 1);
            }
          }}
        />
      )}
      ItemSeparatorComponent={() => <View style={{width: 5}} />}
      style={{paddingTop: 10, marginHorizontal: 10}}
      keyExtractor={(item, index) => index.toString()}
    />
  </View>
);

export default UserReview;
