/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  FlatList,
} from 'react-native';
import moment from 'moment';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import GameFeeCard from '../../../components/challenge/GameFeeCard';

import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCThickDivider from '../../../components/TCThickDivider';
import images from '../../../Constants/ImagePath';
import TCChallengeTitle from '../../../components/TCChallengeTitle';
import SecureRefereeView from '../../../components/SecureRefereeView';
import { getNumberSuffix } from '../../../utils/gameUtils';
import EventMapView from '../../../components/Schedule/EventMapView';

const entity = {};
export default function CurruentReservationView({ reservationObj }) {
  const [challengeObj] = useState(reservationObj);

  const getChallenger = () => {
    if (
      challengeObj?.challenger === challengeObj?.home_team?.user_id
      || challengeObj?.challenger === challengeObj?.home_team?.group_id
    ) {
      return challengeObj?.home_team;
    }
    return challengeObj?.away_team;
  };

  const getChallengee = () => {
    if (
      challengeObj?.challengee === challengeObj?.home_team?.user_id
      || challengeObj?.challengee === challengeObj?.home_team?.group_id
    ) {
      return challengeObj?.home_team;
    }
    return challengeObj?.away_team;
  };

  const renderPeriod = ({ item, index }) => (
    <>
      <TCChallengeTitle
        containerStyle={{ marginLeft: 25, marginTop: 5, marginBottom: 5 }}
        title={'Interval'}
        titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
        value={item.interval}
        valueStyle={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.greenColorCard,
          marginRight: 2,
        }}
        staticValueText={'min.'}
      />
      <TCChallengeTitle
        containerStyle={{ marginLeft: 25, marginTop: 5, marginBottom: 5 }}
        title={`${getNumberSuffix(index + 2)} Period`}
        titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
        value={item.period}
        valueStyle={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.greenColorCard,
          marginRight: 2,
        }}
        staticValueText={'min.'}
      />
    </>
  );

  const renderOverTime = ({ item, index }) => (
    <>
      <TCChallengeTitle
        containerStyle={{ marginLeft: 25, marginTop: 5, marginBottom: 5 }}
        title={'Interval'}
        titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
        value={item.interval}
        valueStyle={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.greenColorCard,
          marginRight: 2,
        }}
        staticValueText={'min.'}
      />
      <TCChallengeTitle
        containerStyle={{ marginLeft: 25, marginTop: 5, marginBottom: 5 }}
        title={`${getNumberSuffix(index + 1)} Over time`}
        titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
        value={item.overTime}
        valueStyle={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.greenColorCard,
          marginRight: 2,
        }}
        staticValueText={'min.'}
      />
    </>
  );

  const renderReferees = ({ item, index }) => {
    console.log('Referee Item:=>', item);
    return (
      <SecureRefereeView
        entityName={
          item.responsible_to_secure_referee === 'challenger'
            ? getChallenger()?.full_name ?? getChallenger()?.group_name
            : getChallengee()?.full_name ?? getChallengee()?.group_name
        }
        image={
          item.responsible_to_secure_referee === 'challenger'
            ? getChallenger()?.thumbnail
              ? { uri: getChallenger()?.thumbnail }
              : getChallenger()?.full_name
              ? images.profilePlaceHolder
              : images.teamPlaceholder
            : getChallenger()?.thumbnail
            ? { uri: getChallengee()?.thumbnail }
            : getChallengee()?.full_name
            ? images.profilePlaceHolder
            : images.teamPlaceholder
        }
        entity={'Referee'}
        entityNumber={index + 1}
      />
    );
  };

  const renderScorekeepers = ({ item, index }) => (
    <SecureRefereeView
      entityName={
        item.responsible_to_secure_scorekeeper === 'challenger'
          ? getChallenger()?.full_name ?? getChallenger()?.group_name
          : getChallengee()?.full_name ?? getChallengee()?.group_name
      }
      image={
        item.responsible_to_secure_scorekeeper === 'challenger'
          ? getChallenger()?.thumbnail
            ? { uri: getChallenger()?.thumbnail }
            : getChallenger()?.full_name
            ? images.profilePlaceHolder
            : images.teamPlaceholder
          : getChallengee()?.thumbnail
          ? { uri: getChallengee()?.thumbnail }
          : getChallengee()?.full_name
          ? images.profilePlaceHolder
          : images.teamPlaceholder
      }
      entity={'Scorekeeper'}
      entityNumber={index + 1}
    />
  );

  console.log('challengeObj', challengeObj);

  return (
    <SafeAreaView>

      <View>
        <Text
            style={[
              styles.challengeNumberStyle,
              {
                marginTop: 0,
              },
            ]}>
          Request No.{`${challengeObj?.challenge_id}`}
        </Text>
        <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 15,
              }}>
          <View style={styles.challengerView}>
            <View style={styles.teamView}>
              <Image source={images.reqIcon} style={styles.reqOutImage} />
              <Text style={styles.challengerText}>Challenger</Text>
            </View>

            <View style={styles.teamView}>
              <View style={styles.profileView}>
                <Image
                      source={
                        getChallenger()?.thumbnail
                          ? { uri: getChallenger()?.thumbnail }
                          : images.teamPlaceholder
                      }
                      style={styles.profileImage}
                    />
              </View>
              <Text style={styles.teamNameText}>
                {getChallenger()?.group_id
                      ? `${getChallenger()?.group_name}`
                      : `${getChallenger()?.first_name} ${
                        getChallenger()?.last_name
                        }`}
              </Text>
            </View>
          </View>
          <View style={styles.challengeeView}>
            <View style={styles.teamView}>
              <Image source={images.reqeIcon} style={styles.reqOutImage} />
              <Text style={styles.challengeeText}>Challengee</Text>
            </View>

            <View style={styles.teamView}>
              <View style={styles.profileView}>
                <Image
                      source={
                        getChallengee()?.thumbnail
                          ? { uri: getChallengee()?.thumbnail }
                          : images.teamPlaceholder
                      }
                      style={styles.profileImage}
                    />
              </View>
              <Text style={styles.teamNameText}>
                {getChallengee()?.group_id
                      ? `${getChallengee()?.group_name}`
                      : `${getChallengee()?.first_name} ${
                        getChallengee()?.last_name
                        }`}
              </Text>
            </View>
          </View>
        </View>

        <TCThickDivider marginTop={15} />
        <View>
          <TCChallengeTitle
            title={'Home & Away'}
            isEdit={false}

          />
          <View style={styles.teamContainer}>
            <Text style={styles.homeLableStyle}>Home</Text>
            <View style={styles.teamViewStyle}>
              <Image
                source={
                  challengeObj?.home_team?.thumbnail
                    ? { uri: challengeObj?.home_team?.thumbnail }
                    : challengeObj?.home_team?.user_challenge === true
                    ? images.profilePlaceHolder
                    : images.teamPlaceholder
                }
                style={styles.imageView}
              />

              <View style={styles.teamTextContainer}>
                <Text style={styles.teamNameLable}>
                  {challengeObj?.home_team?.full_name
                    || challengeObj?.home_team?.group_name}
                </Text>
                <Text style={styles.locationLable}>
                  {`${challengeObj?.home_team?.city}, ${challengeObj?.home_team?.state_abbr}`}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.teamContainer}>
            <Text style={styles.homeLableStyle}>Away</Text>
            <View style={styles.teamViewStyle}>
              <Image
                source={
                  challengeObj?.away_team?.thumbnail
                    ? { uri: challengeObj?.away_team?.thumbnail }
                    : challengeObj?.away_team?.user_challenge === true
                    ? images.profilePlaceHolder
                    : images.teamPlaceholder
                }
                style={styles.imageView}
              />

              <View style={styles.teamTextContainer}>
                <Text style={styles.teamNameLable}>
                  {challengeObj?.away_team?.full_name
                    ?? challengeObj?.away_team?.group_name}
                </Text>
                <Text style={styles.locationLable}>
                  {`${challengeObj?.away_team?.city}, ${challengeObj?.away_team?.state_abbr}`}
                </Text>
              </View>
            </View>
          </View>
          <TCThickDivider marginTop={20} />
        </View>

        <TCChallengeTitle
          title={'Game Duration'}
          isEdit={false}

        />
        <TCChallengeTitle
          containerStyle={{ marginLeft: 25, marginTop: 15, marginBottom: 5 }}
          title={'1st period'}
          titleStyle={{ fontSize: 16, fontFamily: fonts.RRegular }}
          value={challengeObj?.game_duration?.first_period}
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
          staticValueText={'min.'}
        />

        <FlatList
          data={challengeObj?.game_duration?.period}
          renderItem={renderPeriod}
          keyExtractor={(item, index) => index.toString()}
          style={{ marginBottom: 15 }}
        />
        {challengeObj?.game_duration?.period?.length > 0 && (
          <Text style={styles.normalTextStyle}>
            {strings.gameDurationTitle2}
          </Text>
        )}

        <FlatList
          data={challengeObj?.game_duration?.overtime}
          renderItem={renderOverTime}
          keyExtractor={(item, index) => index.toString()}
          style={{ marginBottom: 15 }}
        />
        <TCThickDivider marginTop={20} />

        <View>
          <TCChallengeTitle
            title={'Date & Time'}
            isEdit={false}

          />

          <View>
            <View style={styles.dateTimeValue}>
              <Text style={styles.dateTimeText}>Start </Text>
              <Text style={styles.dateTimeText}>
                {moment(
                  new Date(
                    challengeObj?.start_datetime * 1000,
                  ),
                ).format('MMM DD, YYYY hh:mm a')}
              </Text>
            </View>
            <View style={styles.dateTimeValue}>
              <Text style={styles.dateTimeText}>End </Text>
              <Text style={styles.dateTimeText}>
                {moment(
                  new Date(
                    challengeObj?.end_datetime * 1000,
                  ),
                ).format('MMM DD, YYYY hh:mm a')}
              </Text>
            </View>
            <View style={styles.dateTimeValue}>
              <Text style={styles.dateTimeText}> </Text>
              <Text style={styles.timeZoneText}>
                Time zone{' '}
                <Text style={{ fontFamily: fonts.RRegular }}>Vancouver</Text>
              </Text>
            </View>
          </View>

          {/* <TouchableOpacity
             onPress={() => {
               navigation.navigate('ChooseTimeSlotScreen');
             }}>
             <View style={[styles.borderButtonView, styles.shadowView]}>
               <View />
               <Text style={styles.detailButtonText}>{'CHOOSE DATE & TIME'}</Text>
               <Image
                 source={images.arrowGraterthan}
                 style={styles.arrowImage}
               />
             </View>
           </TouchableOpacity> */}
          <TCThickDivider marginTop={10} />
        </View>

        <View>
          <TCChallengeTitle
            title={'Venue'}
            isEdit={false}

          />

          <View style={styles.venueContainer}>
            <Text style={styles.venueTitle}>{challengeObj?.venue?.name}</Text>
            <Text style={styles.venueAddress}>
              {challengeObj?.venue?.address}
            </Text>

            <EventMapView
              coordinate={challengeObj?.venue?.coordinate}
              region={challengeObj?.venue?.region}
              style={styles.map}
            />
          </View>

          <TCThickDivider marginTop={10} />
        </View>

        <TCChallengeTitle
          title={'Type of Game'}
          value={challengeObj?.game_type}
          tooltipText={
          'The game result has an effect on TC points of the challengee and you.'
          }
          tooltipHeight={hp('6%')}
          tooltipWidth={wp('50%')}
          isEdit={false}

        />
        <TCThickDivider />

        <TCChallengeTitle
          title={'Game Fee'}
          value={challengeObj?.game_fee?.fee}
          staticValueText={`${challengeObj?.game_fee?.currency_type} /Game`}
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
          isEdit={false}

        />
        <TCThickDivider />

        <TCChallengeTitle
          title={'Game Rules'}
          isEdit={false}

        />
        <Text style={styles.rulesTitle}>General Rules</Text>
        <Text style={styles.rulesDetail}>{challengeObj?.general_rules}</Text>
        <View style={{ marginBottom: 10 }} />
        <Text style={styles.rulesTitle}>Special Rules</Text>
        <Text style={styles.rulesDetail}>{challengeObj?.special_rules}</Text>
        <TCThickDivider marginTop={20} />
      </View>

      <View>
        <TCChallengeTitle
          title={'Referees'}
          value={challengeObj?.responsible_for_referee?.who_secure?.length}
          staticValueText={'Referees'}
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
          isEdit={false}

        />

        <FlatList
          data={challengeObj?.responsible_for_referee?.who_secure}
          renderItem={renderReferees}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={{ margin: 5 }} />}
          style={{ marginBottom: 15 }}
        />

        <TCThickDivider />

        <TCChallengeTitle
          title={'Scorekeepers'}
          value={challengeObj?.responsible_for_scorekeeper?.who_secure?.length}
          staticValueText={'Scorekeepers'}
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
          isEdit={false}

        />
        <FlatList
          data={challengeObj?.responsible_for_scorekeeper?.who_secure}
          renderItem={renderScorekeepers}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={{ margin: 5 }} />}
          style={{ marginBottom: 15 }}
        />
        <TCThickDivider />

        <TCChallengeTitle
        title={'Refund Policy'}
        value={challengeObj?.refund_policy}
        tooltipText={
        '-Cancellation 24 hours in advance- Free cancellation until 24 hours before the game starting time.  -Cancellation less than 24 hours in advance-If the challenge sender cancels  less than 24 hours before the game starting time the game fee and service fee are not refunded.'
        }
        tooltipHeight={hp('18%')}
        tooltipWidth={wp('50%')}
        isEdit={false}

      />
        <TCThickDivider />
        <TCChallengeTitle
          title={
            challengeObj?.challenger === entity.uid ? 'Payment' : 'Earning'
          }
          isEdit={false}

        />
        <GameFeeCard
          feeObject={
             {
              total_game_fee: challengeObj?.total_game_fee,
              total_service_fee1: challengeObj?.total_service_fee1,
              total_service_fee2: challengeObj?.total_service_fee2,
              total_stripe_fee: challengeObj?.total_stripe_fee,
              total_payout: challengeObj?.total_payout,
              total_amount: challengeObj?.total_amount,
          }
          }
          currency={challengeObj?.game_fee?.currency_type}
          isChallenger={challengeObj?.challenger === entity.uid}
        />
        <TCThickDivider marginTop={20} />
      </View>

      {/* <TCGradientButton
         title={strings.sendAlterRequest}
         onPress={() => {
           // navigation.push('ChallengePaymentScreen');
           // navigation.push('InviteToChallengeSentScreen');
           sendChallengeInvitation();
         }}
         outerContainerStyle={{
           marginBottom: 45,
           width: '92%',
           alignSelf: 'center',
           marginTop: 15,
         }}
       /> */}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  teamContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  homeLableStyle: {
    flex: 0.14,
    margin: 15,
    marginRight: 20,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  teamViewStyle: {
    flex: 0.86,
    flexDirection: 'row',
    alignItems: 'center',
  },

  imageView: {
    height: 40,
    width: 40,
    resizeMode: 'cover',
    borderRadius: 20,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
  },

  teamNameLable: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  locationLable: {
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  teamTextContainer: {
    marginLeft: 20,
  },

  venueTitle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,

    marginBottom: 5,
  },
  rulesTitle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginBottom: 5,
  },
  dateTimeText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginBottom: 5,
  },
  timeZoneText: {
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  rulesDetail: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
  },

  normalTextStyle: {
    marginLeft: 25,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  dateTimeValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 25,
    marginBottom: 10,
    marginLeft: 15,
    marginTop: 0,
  },

  venueAddress: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  venueContainer: {
    marginLeft: 15,
    marginRight: 15,
  },

  challengerView: {
    marginRight: 15,
    flex: 0.5,
  },
  challengeeView: {
    flex: 0.5,
  },
  profileImage: {
    alignSelf: 'center',
    height: 38,
    width: 38,
    borderRadius: 76,
  },
  teamNameText: {
    marginLeft: 5,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
  width: '80%',
  },
  reqOutImage: {
    width: 20,
    height: 20,
    resizeMode: 'cover',
    marginRight: 5,
  },
  teamView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profileView: {
    backgroundColor: colors.whiteColor,
    height: 40,
    width: 40,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeNumberStyle: {
    fontSize: 12,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
    alignSelf: 'flex-end',
    margin: 15,
    marginBottom: 0,
  },
});
