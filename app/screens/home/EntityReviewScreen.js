import React, { useState} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
   
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';

import ReviewSection from '../../components/Home/ReviewSection';
import RefereeReviewerList from './RefereeReviewerList';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import Header from '../../components/Home/Header';
import ReviewRecentMatch from '../../components/Home/ReviewRecentMatch';
import fonts from '../../Constants/Fonts';
// import { useIsFocused } from '@react-navigation/native';

// const entity = {};
export default function EntityReviewScreen({navigation, route}) {
  const {averageTeamReview, teamReviewData, userID} = route?.params ?? {};
  const [reviewerDetailModalVisible, setReviewerDetailModalVisible] = useState(
    false,
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex:1}}>
        <ReviewSection
          isTeamReviewSection={true}
          reviewsData={averageTeamReview}
          reviewsFeed={teamReviewData}
          onFeedPress={() => alert(5)}
          onReadMorePress={() => {
            setReviewerDetailModalVisible(!reviewerDetailModalVisible);
          }}
        />
        {/* <TeamHomeReview
                  navigation={navigation}
                  teamID={route?.params?.uid || authContext.entity.uid}
                  getSoccerTeamReview={getTeamReviewById}
                  isAdmin={isAdmin}
                  // gameData={gameData}
                  /> */}
      </View>
      {reviewerDetailModalVisible && (
        <Modal
          isVisible={reviewerDetailModalVisible}
          backdropColor="black"
          style={{
            margin: 0,
            justifyContent: 'flex-end',
            backgroundColor: colors.blackOpacityColor,
          }}
          hasBackdrop
          onBackdropPress={() => setReviewerDetailModalVisible(false)}
          backdropOpacity={0}>
          <SafeAreaView
            style={[
              styles.modalContainerViewStyle,
              {backgroundColor: colors.whiteColor},
            ]}>
            <View>
              <LinearGradient
                colors={[colors.orangeColor, colors.yellowColor]}
                end={{x: 0.0, y: 0.25}}
                start={{x: 1, y: 0.5}}
                style={styles.gradiantHeaderViewStyle}></LinearGradient>
              <Header
                mainContainerStyle={styles.headerMainContainerStyle}
                leftComponent={
                  <TouchableOpacity
                    onPress={() => setReviewerDetailModalVisible(false)}>
                    <Image
                      source={images.backArrow}
                      style={styles.cancelImageStyle}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                }
                centerComponent={
                  <View style={styles.headerCenterViewStyle}>
                    <Image
                      source={images.refereesInImage}
                      style={styles.refereesImageStyle}
                      resizeMode={'contain'}
                    />
                    <Text style={styles.playInTextStyle}>{'Reviews'}</Text>
                  </View>
                }
                rightComponent={
                  <TouchableOpacity
                    onPress={() => setReviewerDetailModalVisible(false)}>
                    <Image
                      source={images.cancelWhite}
                      style={styles.cancelImageStyle}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                }
              />
            </View>
            <ScrollView>
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
              <RefereeReviewerList
                navigation={navigation}
                postData={[]}
                userID={userID}
              />
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    modalContainerViewStyle: {
        height: hp('94%'),
        backgroundColor: colors.whiteColor,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
      },
      gradiantHeaderViewStyle: {
        position: 'absolute',
        width: '100%',
        height: 50,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      },
      headerMainContainerStyle: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 14,
        paddingVertical: 15,
      },
      cancelImageStyle: {
        height: 17,
        width: 17,
        tintColor: colors.lightBlackColor,
      },
      playInTextStyle: {
        fontSize: 16,
        fontFamily: fonts.RBold,
        color: colors.lightBlackColor,
      },
      refereesImageStyle: {
        height: 30,
        width: 30,
        marginHorizontal: 10,
      },
  
});
