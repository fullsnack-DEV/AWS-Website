/* eslint-disable no-nested-ternary */
import React, {useEffect, useState, useContext, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import moment from 'moment';

import {useIsFocused} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import GameFeeCard from '../../../components/challenge/GameFeeCard';
import {getFeesEstimation} from '../../../api/Challenge';

import ActivityLoader from '../../../components/loader/ActivityLoader';

import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCThickDivider from '../../../components/TCThickDivider';
import images from '../../../Constants/ImagePath';
import TCLabel from '../../../components/TCLabel';
import AuthContext from '../../../auth/context';
import TCChallengeTitle from '../../../components/TCChallengeTitle';
import {getNumberSuffix} from '../../../utils/gameUtils';
import EventMapView from '../../../components/Schedule/EventMapView';
import TCFormProgress from '../../../components/TCFormProgress';

let entity = {};
export default function InviteChallengeScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);
  const [totalZero, setTotalZero] = useState(false);
  const [feeObj, setFeeObj] = useState();
  const [venue, setVenue] = useState();

  const [sportName] = useState(route?.params?.sportName);
  const [sportType] = useState(route?.params?.sportType);
  const [setting] = useState(route?.params?.setting);
  const [groupObj] = useState(route?.params?.groupObj);

  // const [startDate, setStartDate] = useState(
  //   new Date().setHours(new Date().getHours() + 10),
  // );
  // const [endDate, setEndDate] = useState(
  //   new Date().setHours(new Date().getHours() + 14),
  // );

  const [settingObject, setSettingObject] = useState(setting);
  const [teams, setteams] = useState([]);

  useEffect(() => {
    if (route?.params?.selectedVenueObj) {
      setVenue(route?.params?.selectedVenueObj);
    }
    if (settingObject?.venue?.length === 1) {
      setVenue(settingObject?.venue?.[0]);
    }
  }, [route?.params?.selectedVenueObj, settingObject?.venue]);

  const getFeeDetail = useCallback(() => {
    const feeBody = {};
    feeBody.payment_method_type = 'card';
    feeBody.currency_type = settingObject?.game_fee?.currency_type?.toLowerCase();
    feeBody.total_game_fee = Number(settingObject?.game_fee?.fee?.toString());
    // setloading(true);

    console.log('Body estimate fee:=>', feeBody);
    getFeesEstimation(feeBody, authContext)
      .then((response) => {
        setloading(false);
        setFeeObj(response.payload);
        if (response.payload.total_game_fee === 0) {
          setTotalZero(true);
        } else {
          setTotalZero(false);
        }
        console.log('Body estimate fee:=>', response.payload);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [
    authContext,
    settingObject?.game_fee?.currency_type,
    settingObject?.game_fee?.fee,
  ]);

  useEffect(() => {
    entity = authContext.entity;
    if (groupObj) {
      setteams([{...entity.obj}, {...groupObj}]);
    }
    if (settingObject?.game_fee?.fee || settingObject?.game_fee?.fee >= 0) {
      getFeeDetail();
    }
  }, [
    authContext.entity,
    getFeeDetail,
    groupObj,
    settingObject?.game_fee?.fee,
  ]);

  useEffect(() => {
    if (isFocused) {
      const settings = {...settingObject};
      if (route?.params?.gameType) {
        settings.game_type = route?.params?.gameType;
      }
      if (route?.params?.gameFee) {
        settings.game_fee = route?.params?.gameFee ?? 0;
      }
      if (route?.params?.refundPolicy) {
        settings.refund_policy = route?.params?.refundPolicy;
      }
      if (route?.params?.homeAway) {
        settings.home_away = route?.params?.homeAway;
        settings.home_team = route?.params?.home_team;
        settings.away_team = route?.params?.away_team;
      }
      if (route?.params?.gameDuration) {
        settings.game_duration = route?.params?.gameDuration;
      }
      if (route?.params?.gameGeneralRules !== undefined) {
       
        settings.general_rules = route?.params?.gameGeneralRules;
        settings.special_rules = route?.params?.gameSpecialRules;
      }
      if (route?.params?.refereeSetting) {
        settings.responsible_for_referee = route?.params?.refereeSetting;
      }
      if (route?.params?.scorekeeperSetting) {
        settings.responsible_for_scorekeeper =
          route?.params?.scorekeeperSetting;
      }

      setSettingObject(settings);
    }
  }, [
    authContext.entity,
    groupObj,
    isFocused,
    route?.params?.gameDuration,
    route?.params?.gameFee,
    route?.params?.gameGeneralRules,
    route?.params?.gameSpecialRules,
    route?.params?.gameType,
    route?.params?.homeAway,
    route?.params?.refereeSetting,
    route?.params?.refundPolicy,
    route?.params?.scorekeeperSetting,
  ]);

  const renderPeriod = ({item, index}) => (
    <>
      <TCChallengeTitle
        containerStyle={{marginLeft: 25, marginTop: 5, marginBottom: 5}}
        title={'Interval'}
        titleStyle={{fontSize: 16, fontFamily: fonts.RRegular}}
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
        containerStyle={{marginLeft: 25, marginTop: 5, marginBottom: 5}}
        title={`${getNumberSuffix(index + 2)} Period`}
        titleStyle={{fontSize: 16, fontFamily: fonts.RRegular}}
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

  const renderOverTime = ({item, index}) => (
    <>
      <TCChallengeTitle
        containerStyle={{marginLeft: 25, marginTop: 5, marginBottom: 5}}
        title={'Interval'}
        titleStyle={{fontSize: 16, fontFamily: fonts.RRegular}}
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
        containerStyle={{marginLeft: 25, marginTop: 5, marginBottom: 5}}
        title={`${getNumberSuffix(index + 1)} Over time`}
        titleStyle={{fontSize: 16, fontFamily: fonts.RRegular}}
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

  const onNextPress = () => {
    entity = authContext.entity;
    console.log('Entity:=>', settingObject);

    // const res_secure_referee = body?.responsible_for_referee?.who_secure.map((obj) => ({
    //     ...obj,
    //   responsible_team_id:
    //     obj.responsible_to_secure_referee === 'challengee'
    //       ? teams?.[0]?.group_id || teams?.[0]?.user_id
    //       : teams?.[1]?.group_id || teams?.[1]?.user_id,
    //   }));

    // const res_secure_scorekeeper = body?.responsible_for_scorekeeper?.who_secure.map((obj) => ({
    //   ...obj,
    //   responsible_team_id:
    //     obj.responsible_to_secure_scorekeeper === 'challengee'
    //       ? teams?.[0]?.group_id || teams?.[0]?.user_id
    //       : teams?.[1]?.group_id || teams?.[1]?.user_id,
    // }));

    const res_secure_referee = [];
    const res_secure_scorekeeper = [];
    for (
      let i = 0;
      i < settingObject?.responsible_for_referee?.who_secure?.length;
      i++
    ) {
      res_secure_referee.push({
        ...settingObject?.responsible_for_referee?.who_secure[i],
        responsible_team_id: teams?.[0]?.group_id || teams?.[0]?.user_id,
      });
    }
    for (
      let i = 0;
      i < settingObject?.responsible_for_scorekeeper?.who_secure?.length;
      i++
    ) {
      res_secure_scorekeeper.push({
        ...settingObject?.responsible_for_scorekeeper?.who_secure[i],
        responsible_team_id: teams?.[0]?.group_id || teams?.[0]?.user_id,
      });
    }

    const body = {
      ...settingObject,
      ...feeObj,
      sport: sportName,
      sport_type: sportType,
      venue,
      start_datetime: route?.params?.startTime / 1000,
      end_datetime: route?.params?.endTime / 1000,
      challenger: teams?.[1]?.group_id || teams?.[1]?.user_id,
      challengee: teams?.[0]?.group_id || teams?.[0]?.user_id,
      home_team:
        settingObject?.home_away === 'Home'
          ? entity?.uid
          : groupObj?.group_id || groupObj?.user_id,
      away_team:
        settingObject?.home_away === 'Home'
          ? groupObj?.group_id || groupObj?.user_id
          : entity?.uid,
      user_challenge: !groupObj?.group_id,
    };
    if (res_secure_referee?.length > 0) {
      body.responsible_for_referee.who_secure = res_secure_referee;
    }
    if (res_secure_scorekeeper?.length > 0) {
      body.responsible_for_scorekeeper.who_secure = res_secure_scorekeeper;
    }

    console.log('Challenge sportName:=>', sportName);

    console.log('Challenge sportType:=>', sportType);

    console.log('Challenge Object:=>', body);

    navigation.navigate('RefereeInviteAgreementScreen', {
      challengeObj: body,
      groupObj,
      type: 'invite',
    });
  };

  return (
    <TCKeyboardView>
      <ActivityLoader visible={loading} />
      <TCFormProgress totalSteps={3} curruentStep={1} />

      <View>
        <View
          style={{
            backgroundColor: colors.grayBackgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: fonts.RRegular,
              color: colors.lightBlackColor,
              padding: 15,
            }}>
            {strings.inviteToChallengeText}
          </Text>
        </View>
        {/* <ChallengeHeaderView
          challenger={teams[1]}
          challengee={teams[0]}
          role={
            route?.params?.role === 'user' || route?.params?.role === 'player'
              ? 'user'
              : 'team'
          }
        /> */}

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
                    teams?.[1]?.thumbnail
                      ? {uri: teams?.[1]?.thumbnail}
                      : images.teamPlaceholder
                  }
                  style={styles.profileImage}
                />
              </View>
              <Text style={styles.teamNameText}>
                {teams?.[1]?.group_id
                  ? `${teams?.[1]?.group_name}`
                  : `${teams?.[1]?.first_name} ${teams?.[1]?.last_name}`}
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
                    teams?.[0]?.thumbnail
                      ? {uri: teams?.[0]?.thumbnail}
                      : images.teamPlaceholder
                  }
                  style={styles.profileImage}
                />
              </View>
              <Text style={styles.teamNameText}>
                {teams?.[0]?.group_id
                  ? `${teams?.[0]?.group_name}`
                  : `${teams?.[0]?.first_name} ${teams?.[0]?.last_name}`}
              </Text>
            </View>
          </View>
        </View>

        <TCThickDivider marginTop={15} />

        <TCChallengeTitle
          title={'Type of Game'}
          value={settingObject?.game_type}
          tooltipText={
          'The game result has an effect on TC points of the challengee and you.'
          }
          tooltipHeight={hp('6%')}
          tooltipWidth={wp('50%')}
          isEdit={true}
          onEditPress={() => {
            navigation.navigate('GameType', {
              settingObj: settingObject,
              comeFrom: 'InviteChallengeScreen',
              sportName,
              sportType,
            });
          }}
        />
        <TCThickDivider />

        <TCChallengeTitle
          title={'Game Fee'}
          value={settingObject?.game_fee?.fee}
          staticValueText={`${
            settingObject?.game_fee?.currency_type || ''
          } /Game`}
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
          isEdit={true}
          onEditPress={() => {
            navigation.navigate('GameFee', {
              settingObj: settingObject,
              comeFrom: 'InviteChallengeScreen',
              sportName,
              sportType,
            });
          }}
        />
        <TCThickDivider />

        <TCChallengeTitle
          title={'Refund Policy'}
          value={settingObject?.refund_policy}
          tooltipText={
          '-Cancellation 24 hours in advance- Free cancellation until 24 hours before the game starting time.  -Cancellation less than 24 hours in advance-If the challenge sender cancels  less than 24 hours before the game starting time the game fee and service fee are not refunded.'
          }
          tooltipHeight={hp('18%')}
          tooltipWidth={wp('50%')}
          isEdit={true}
          onEditPress={() => {
            navigation.navigate('RefundPolicy', {
              settingObj: settingObject,
              comeFrom: 'InviteChallengeScreen',
              sportName,
              sportType,
            });
          }}
        />
        <TCThickDivider />
      </View>
      <View>
        <TCChallengeTitle
          title={'Home & Away'}
          isEdit={true}
          onEditPress={() => {
            navigation.navigate('HomeAway', {
              settingObj: settingObject,
              comeFrom: 'InviteChallengeScreen',
              sportName,
            });
          }}
        />
        <View style={styles.teamContainer}>
          <Text style={styles.homeLableStyle}>Home</Text>
          <View style={styles.teamViewStyle}>
            <Image
              source={
                settingObject?.home_away === 'Home'
                  ? authContext?.entity?.obj?.thumbnail
                    ? {uri: authContext?.entity?.obj?.thumbnail}
                    : authContext?.entity?.obj?.full_name
                    ? images.profilePlaceHolder
                    : images.teamPlaceholder
                  : groupObj?.thumbnail
                  ? {uri: groupObj?.thumbnail}
                  : groupObj?.full_name
                  ? images.profilePlaceHolder
                  : images.teamPlaceholder
              }
              style={styles.imageView}
            />

            <View style={styles.teamTextContainer}>
              <Text style={styles.teamNameLable}>
                {settingObject?.home_away === 'Home'
                  ? authContext?.entity?.obj?.full_name ??
                    authContext?.entity?.obj?.group_name
                  : groupObj?.full_name ?? groupObj?.group_name}
              </Text>
              <Text style={styles.locationLable}>
                {settingObject?.home_away === 'Home'
                  ? `${authContext?.entity?.obj?.city}, ${authContext?.entity?.obj?.state_abbr}`
                  : `${groupObj?.city}, ${groupObj?.state_abbr}`}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.teamContainer}>
          <Text style={styles.homeLableStyle}>Away</Text>
          <View style={styles.teamViewStyle}>
            <Image
              source={
                settingObject?.home_away === 'Home'
                  ? groupObj?.thumbnail
                    ? {uri: groupObj?.thumbnail}
                    : groupObj?.full_name
                    ? images.profilePlaceHolder
                    : images.teamPlaceholder
                  : authContext?.entity?.obj?.thumbnail
                  ? {uri: authContext?.entity?.obj?.thumbnail}
                  : authContext?.entity?.obj?.full_name
                  ? images.profilePlaceHolder
                  : images.teamPlaceholder
              }
              style={styles.imageView}
            />

            <View style={styles.teamTextContainer}>
              <Text style={styles.teamNameLable}>
                {settingObject?.home_away === 'Home'
                  ? groupObj?.full_name ?? groupObj?.group_name
                  : authContext?.entity?.obj?.full_name ??
                    authContext?.entity?.obj?.group_name}
              </Text>
              <Text style={styles.locationLable}>
                {settingObject?.home_away === 'Home'
                  ? `${groupObj?.city}, ${groupObj?.state_abbr}`
                  : `${authContext?.entity?.obj?.city}, ${authContext?.entity?.obj?.state_abbr}`}
              </Text>
            </View>
          </View>
        </View>
        <TCThickDivider marginTop={20} />
      </View>
      <View>
        <TCChallengeTitle
          title={'Game Duration'}
          isEdit={true}
          onEditPress={() => {
            navigation.navigate('GameDuration', {
              settingObj: settingObject,
              comeFrom: 'InviteChallengeScreen',
              sportName,
              sportType,
            });
          }}
        />
        <TCChallengeTitle
          containerStyle={{marginLeft: 25, marginTop: 15, marginBottom: 5}}
          title={'1st period'}
          titleStyle={{fontSize: 16, fontFamily: fonts.RRegular}}
          value={settingObject?.game_duration?.first_period}
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
          staticValueText={'min.'}
        />

        <FlatList
          data={settingObject?.game_duration?.period}
          renderItem={renderPeriod}
          keyExtractor={(item, index) => index.toString()}
          style={{marginBottom: 15}}
        />
        {settingObject?.game_duration?.period?.length > 0 && (
          <Text style={styles.normalTextStyle}>
            {strings.gameDurationTitle2}
          </Text>
        )}

        <FlatList
          data={settingObject?.game_duration?.overtime}
          renderItem={renderOverTime}
          keyExtractor={(item, index) => index.toString()}
          style={{marginBottom: 15}}
        />
        <TCThickDivider marginTop={20} />

        <View>
          <TCChallengeTitle
            title={'Date & Time'}
            isEdit={!!route?.params?.endTime}
            onEditPress={() => {
              navigation.navigate('ChooseTimeSlotScreen', {
                settingObject,
                comeFrom: 'InviteChallengeScreen',
              });
            }}
          />

          {route?.params?.endTime ? (
            <View>
              <View style={styles.dateTimeValue}>
                <Text style={styles.dateTimeText}>Start </Text>
                <Text style={styles.dateTimeText}>
                  {moment(route?.params?.startTime).format(
                    'MMM DD, YYYY hh:mm a',
                  )}
                </Text>
              </View>
              <View style={styles.dateTimeValue}>
                <Text style={styles.dateTimeText}>End </Text>
                <Text style={styles.dateTimeText}>
                  {moment(route?.params?.endTime).format(
                    'MMM DD, YYYY hh:mm a',
                  )}
                </Text>
              </View>
              <View style={styles.dateTimeValue}>
                <Text style={styles.dateTimeText}> </Text>
                <Text style={styles.timeZoneText}>
                  Time zone{' '}
                  <Text style={{fontFamily: fonts.RRegular}}>Vancouver</Text>
                </Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ChooseTimeSlotScreen', {
                  settingObject,
                  comeFrom: 'InviteChallengeScreen',
                });
              }}>
              <View style={[styles.borderButtonView, styles.shadowView]}>
                <View />
                <Text style={styles.detailButtonText}>
                  {'CHOOSE DATE & TIME'}
                </Text>
                <Image
                  source={images.arrowGraterthan}
                  style={styles.arrowImage}
                />
              </View>
            </TouchableOpacity>
          )}
          <TCThickDivider marginTop={10} />
        </View>

        <View>
          <TCChallengeTitle
            title={'Venue'}
            isEdit={!!venue && settingObject?.venue?.length > 1}
            onEditPress={() => {
              navigation.navigate('ChooseVenueScreen', {
                venues: settingObject?.venue || [],
                comeFrom: 'InviteChallengeScreen',
              });
            }}
          />

          {venue || settingObject?.venue?.length === 1 ? (
            <View style={styles.venueContainer}>
              <Text style={styles.venueTitle}>{venue?.name}</Text>
              <Text style={styles.venueAddress}>{venue?.address}</Text>

              <EventMapView
                coordinate={venue?.coordinate}
                region={venue?.region}
                style={styles.map}
              />
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ChooseVenueScreen', {
                  venues: settingObject?.venue || [],
                  comeFrom: 'InviteChallengeScreen',
                });
              }}>
              <View style={[styles.borderButtonView, styles.shadowView]}>
                <View />
                <Text style={styles.detailButtonText}>CHOOSE A VENUE</Text>
                <Image
                  source={images.arrowGraterthan}
                  style={styles.arrowImage}
                />
              </View>
            </TouchableOpacity>
          )}

          <TCThickDivider marginTop={10} />
        </View>

        <TCChallengeTitle
          title={'Game Rules'}
          isEdit={true}
          onEditPress={() => {
            navigation.navigate('GameRules', {
              settingObj: settingObject,
              comeFrom: 'InviteChallengeScreen',
              sportName,
              sportType,
            });
          }}
        />
        <Text style={styles.rulesTitle}>General Rules</Text>
        <Text style={styles.rulesDetail}>{settingObject?.general_rules}</Text>
        <View style={{marginBottom: 10}} />
        <Text style={styles.rulesTitle}>Special Rules</Text>
        <Text style={styles.rulesDetail}>{settingObject?.special_rules}</Text>
        <TCThickDivider marginTop={20} />
        {/*
        <TCChallengeTitle
          title={'Referees'}
          value={
            settingObject?.responsible_for_referee?.who_secure !== 'None'
              ? settingObject?.responsible_for_referee?.who_secure?.length
              : ''
          }
          staticValueText={
            settingObject?.responsible_for_referee?.who_secure !== 'None'
              ? 'Referees'
              : ''
          }
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
          isEdit={true}
          onEditPress={() => {
            navigation.navigate('RefereesSetting', {
              settingObj: settingObject,
              comeFrom: 'InviteChallengeScreen',
              sportName,
            });
          }}
        />

        {settingObject?.responsible_for_referee?.who_secure !== 'None' ? (
          <FlatList
            data={settingObject?.responsible_for_referee?.who_secure}
            renderItem={renderReferees}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={{ margin: 5 }} />}
            style={{ marginBottom: 15 }}
          />
        ) : (
          <Text
            style={{
              color: colors.grayColor,
              fontFamily: fonts.RMedium,
              fontSize: 16,
              marginLeft: 15,
            }}>
            No Referees
          </Text>
        )}

        <TCThickDivider marginTop={20} />

        <TCChallengeTitle
          title={'Scorekeepers'}
          value={
            settingObject?.responsible_for_scorekeeper?.who_secure !== 'None'
              ? settingObject?.responsible_for_scorekeeper?.who_secure?.length
              : ''
          }
          staticValueText={
            settingObject?.responsible_for_scorekeeper?.who_secure !== 'None'
              ? 'Scorekeepers'
              : ''
          }
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
          isEdit={true}
          onEditPress={() => {
            navigation.navigate('ScorekeepersSetting', {
              settingObj: settingObject,
              comeFrom: 'InviteChallengeScreen',
              sportName,
            });
          }}
        />
        {settingObject?.responsible_for_scorekeeper?.who_secure !== 'None' ? (
          <FlatList
            data={settingObject?.responsible_for_scorekeeper?.who_secure}
            renderItem={renderScorekeepers}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={{ margin: 5 }} />}
            style={{ marginBottom: 15 }}
          />
        ) : (
          <Text
            style={{
              color: colors.grayColor,
              fontFamily: fonts.RMedium,
              fontSize: 16,
              marginLeft: 15,
            }}>
            No Scorekeepers
          </Text>
        )}
         <TCThickDivider marginTop={20} /> */}

        {!totalZero && (
          <View>
            <TCLabel title={'Income'} style={{marginBottom: 15}} />
            <GameFeeCard
              feeObject={feeObj}
              currency={settingObject?.game_fee?.currency_type}
              isChallenger={false}
            />
            <TCThickDivider marginTop={20} />
          </View>
        )}
      </View>

      <TCGradientButton
        isDisabled={
          !route?.params?.startTime || !route?.params?.endTime || !venue
        }
        title={strings.nextTitle} // sendInviteTitle
        onPress={() => {
          // navigation.push('ChallengePaymentScreen');
          // navigation.push('InviteToChallengeSentScreen');
          if (
            new Date(route?.params?.startTime).getTime() < new Date().getTime()
          ) {
            Alert.alert(
              strings.alertmessagetitle,
              'Please choose future time for challenge.',
            );
          } else {
            onNextPress();
          }
        }}
        outerContainerStyle={{
          marginBottom: 45,
          width: '92%',
          alignSelf: 'center',
          marginTop: 15,
        }}
      />
    </TCKeyboardView>
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
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 1,
  },
  arrowImage: {
    height: 12,
    width: 8,
    resizeMode: 'cover',
    tintColor: colors.themeColor,
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

  detailButtonText: {
    alignSelf: 'center',
    fontFamily: fonts.RBold,
    color: colors.themeColor,
    textAlign: 'center',
  },
  borderButtonView: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: colors.themeColor,
    borderWidth: 1,
    borderRadius: 5,
    height: 35,
    width: wp('86%'),
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingRight: 15,
    paddingLeft: 15,
  },
  shadowView: {
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
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
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
});
