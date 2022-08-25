/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-continue */
/* eslint-disable no-nested-ternary */
import React, {useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
  SafeAreaView,
} from 'react-native';
import moment from 'moment';
import _ from 'lodash';

import {useIsFocused} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import * as Utility from '../../../utils';
import {paymentMethods} from '../../../api/Users';
import GameFeeCard from '../../../components/challenge/GameFeeCard';
import {getFeesEstimation, updateChallenge} from '../../../api/Challenge';

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
import TCSmallButton from '../../../components/TCSmallButton';
import {widthPercentageToDP} from '../../../utils';
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import {getSetting} from '../manageChallenge/settingUtility';
import TCTabView from '../../../components/TCTabView';
import CurruentReservationView from './CurrentReservationView';
import RefereeAgreementView from '../../../components/challenge/RefereeAgreementView';
import ScorekeeperAgreementView from '../../../components/challenge/ScorekeeperAgreementView';
import TCGameDetailRules from '../../../components/TCGameDetailRules';

let entity = {};
export default function EditChallenge({navigation, route}) {
  const [sportName] = useState(route?.params?.sportName);
  const [groupObj] = useState(route?.params?.groupObj);

  console.log('settingObjsettingObj:=>', route?.params?.settingObj);

  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);
  const [feeObj, setFeeObj] = useState();
  const [venueList, setVenueList] = useState();
  const [venue, setVenue] = useState();
  const [alterModalVisible, setAlterModalVisible] = useState(false);
  const [defaultCard, setDefaultCard] = useState();
  const [maintabNumber, setMaintabNumber] = useState(0);
  const [oldVersion, setOldVersion] = useState();
  const [challengeObj, setChallengeObj] = useState(route?.params?.challengeObj);
  const [teams, setteams] = useState([]);

  const [moreButtonReferee, setMoreButtonReferee] = useState();
  const [moreButtonScorekeeper, setMoreButtonScorekeeper] = useState();

  const [isMore, setIsMore] = useState(false);

  useEffect(() => {
    if (isFocused) {
      if (route?.params?.paymentMethod) {
        setDefaultCard(route?.params?.paymentMethod);
      }
      if (!defaultCard && challengeObj?.source) {
        getPaymentMethods(challengeObj?.source);
      }
      if (route?.params?.lastConfirmVersion) {
        setOldVersion(route?.params?.lastConfirmVersion);
      }
    }
  }, [
    challengeObj?.source,
    defaultCard,
    isFocused,
    route?.params?.paymentMethod,
  ]);

  useEffect(() => {
    if (route?.params?.selectedVenueObj) {
      setVenue(route?.params?.selectedVenueObj);
    }
    if (challengeObj?.venue?.length === 1) {
      setVenue(challengeObj?.venue?.[0]);
    }
    setChallengeObj({
      ...challengeObj,
      venue: route?.params?.selectedVenueObj ?? challengeObj?.venue?.[0],
    });
  }, [route?.params?.selectedVenueObj, challengeObj?.venue, venue]);

  useEffect(() => {
    entity = authContext.entity;
    if (groupObj) {
      if (challengeObj?.challenger === entity.uid) {
        setteams([{...entity.obj}, {...groupObj}]);
      } else {
        setteams([{...groupObj}, {...entity.obj}]);
      }
    }
    if (challengeObj?.game_fee?.fee || challengeObj?.game_fee?.fee === 0) {
      console.log('challengeObj check 1:=>', challengeObj);

      getFeeDetail();
    }
  }, [authContext.entity, challengeObj, groupObj]);

  useEffect(() => {
    console.log('authContext.entitity', authContext.entity);
    setloading(true);
    getSetting(
      challengeObj?.challengee,
      authContext.entity.role === 'user' ? 'player' : 'team',
      sportName,
      authContext,
    )
      .then((response) => {
        setloading(false);
        console.log('manage challenge response:=>', response);
        if (challengeObj?.venue?.isCustom) {
          response.venue.push(challengeObj?.venue);
          setVenueList(response.venue);
        } else {
          setVenueList(response.venue);
        }
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [authContext, challengeObj?.challengee, challengeObj?.venue, sportName]);

  useEffect(() => {
    console.log('useEffect Called');
    if (isFocused) {
      const settings = {...challengeObj};
      if (route?.params?.gameType) {
        settings.game_type = route?.params?.gameType;
      }
      if (route?.params?.gameFee) {
        settings.game_fee = route?.params?.gameFee;
      }
      if (route?.params?.refundPolicy) {
        settings.refund_policy = route?.params?.refundPolicy;
      }
      if (route?.params?.homeAway) {
        settings.home_away = route?.params?.homeAway;

        if (route?.params?.home_team?.name) {
          settings.home_team = groupObj;
          settings.away_team = route?.params?.away_team;
        } else {
          settings.away_team = groupObj;
          settings.home_team = route?.params?.home_team;
        }

        //  settings.home_team = route?.params?.home_team;
        //  settings.away_team = route?.params?.away_team;
      }
      if (route?.params?.gameDuration) {
        settings.game_duration = route?.params?.gameDuration;
      }
      if (route?.params?.tennisMatchDuration) {
        settings.score_rules = route?.params?.tennisMatchDuration;
      }
      if (route?.params?.gameGeneralRules) {
        settings.general_rules = route?.params?.gameGeneralRules;
        settings.special_rules = route?.params?.gameSpecialRules;
      }
      if (route?.params?.refereeSetting) {
        console.log(
          'route?.params?.refereeSetting',
          route?.params?.refereeSetting,
        );
        settings.responsible_for_referee = route?.params?.refereeSetting;
        settings.min_referee =
          route?.params?.refereeSetting?.who_secure?.length;
      }
      if (route?.params?.scorekeeperSetting) {
        settings.responsible_for_scorekeeper =
          route?.params?.scorekeeperSetting;
        settings.min_scorekeeper =
          route?.params?.scorekeeperSetting?.who_secure?.length;
      }

      setChallengeObj(settings);
    }
  }, [
    authContext.entity,
    groupObj,
    isFocused,
    route?.params?.gameDuration,
    route?.params?.tennisMatchDuration,
    route?.params?.gameFee,
    route?.params?.gameGeneralRules,
    route?.params?.gameSpecialRules,
    route?.params?.gameType,
    route?.params?.homeAway,
    route?.params?.refereeSetting,
    route?.params?.refundPolicy,
    route?.params?.scorekeeperSetting,
  ]);

  const getPaymentMethods = () => {
    setloading(true);
    paymentMethods(authContext)
      .then((response) => {
        setloading(false);
        console.log('source ID:', challengeObj?.source);
        console.log('payment method', response.payload);
        for (const tempCard of response?.payload) {
          if (tempCard?.id === challengeObj?.source) {
            setDefaultCard(tempCard);
            console.log('default card:', tempCard);
            break;
          }
        }
      })
      .catch((e) => {
        console.log('error in payment method', e);
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const getChallenger = () => {
    if (
      challengeObj?.challenger === challengeObj?.home_team?.user_id ||
      challengeObj?.challenger === challengeObj?.home_team?.group_id
    ) {
      return challengeObj?.home_team;
    }
    return challengeObj?.away_team;
  };

  const getChallengee = () => {
    if (
      challengeObj?.challengee === challengeObj?.home_team?.user_id ||
      challengeObj?.challengee === challengeObj?.home_team?.group_id
    ) {
      return challengeObj?.home_team;
    }
    return challengeObj?.away_team;
  };

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

  const getFeeDetail = () => {
    const feeBody = {};
    console.log('challengeObj check:=>', challengeObj);

    feeBody.source = challengeObj?.source;
    feeBody.challenge_id = challengeObj?.challenge_id;
    feeBody.payment_method_type = 'card';
    feeBody.currency_type =
      challengeObj?.game_fee?.currency_type?.toLowerCase();
    feeBody.total_game_fee = Number(
      parseFloat(challengeObj?.game_fee?.fee).toFixed(2),
    );
    setloading(true);
    getFeesEstimation(feeBody, authContext)
      .then((response) => {
        setFeeObj(response.payload);
        // setChallengeObj({
        //   ...challengeObj,
        //   total_game_fee: response.payload?.total_game_fee,
        //   total_service_fee1: response.payload?.total_service_fee1,
        //   total_service_fee2: response.payload?.total_service_fee2,
        //   total_stripe_fee: response.payload?.total_stripe_fee,
        //   total_payout: response.payload?.total_payout,
        //   total_amount: response.payload?.total_amount,
        // });

        // if (response.payload.total_game_fee === 0) {
        //   setTotalZero(true);
        // }
        console.log('Body estimate fee:=>', response.payload);

        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const updateChallengeDetail = () => {
    setloading(true);
    const body = {
      ...challengeObj,
      total_game_fee: feeObj?.total_game_fee,
      total_service_fee1: feeObj?.total_service_fee1,
      total_service_fee2: feeObj?.total_service_fee2,
      international_card_fee: feeObj?.international_card_fee,
      total_stripe_fee: feeObj?.total_stripe_fee,
      total_payout: feeObj?.total_payout,
      total_amount: feeObj?.total_amount,
    };
    const challengeID = body.challenge_id;
    // if (route?.params?.paymentMethod) {
    //   setDefaultCard(route?.params?.paymentMethod)
    // }

    if (route?.params?.startTime) {
      body.start_datetime = route?.params?.startTime / 1000;
    }
    if (route?.params?.endTime) {
      body.end_datetime = route?.params?.endTime / 1000;
    }

    const res_secure_referee =
      challengeObj?.responsible_for_referee?.who_secure?.map((obj) => ({
        ...obj,
        responsible_team_id:
          obj.responsible_to_secure_referee === 'challengee'
            ? body.challengee
            : body.challenger,
      }));

    const res_secure_scorekeeper =
      challengeObj?.responsible_for_scorekeeper?.who_secure?.map((obj) => ({
        ...obj,
        responsible_team_id:
          obj.responsible_to_secure_scorekeeper === 'challengee'
            ? body.challengee
            : body.challenger,
      }));

    body.manual_fee = true;

    delete body.created_at;
    delete body.created_by;
    delete body.entity_id;
    delete body.entity_type;
    delete body.offer_expiry;
    delete body.status;
    delete body.challenge_id;
    delete body.game_id;
    delete body.updated_by;
    delete body.updated_at;
    delete body.version;
    delete body.reservations;

    // if(body?.home_away === 'Home'){
    //   const home_id =
    // }else{

    // }
    const home_id = body?.home_team?.group_id ?? body.home_team.user_id;
    const away_id = body?.away_team?.group_id ?? body.away_team.user_id;
    delete body.home_team;
    delete body.away_team;
    body.home_team = home_id;
    body.away_team = away_id;

    body.responsible_for_referee.who_secure = res_secure_referee;
    body.responsible_for_scorekeeper.who_secure = res_secure_scorekeeper;

    if (defaultCard) {
      body.source = defaultCard.id;
    }

    console.log('FINAL BODY PARAMS::', body);

    updateChallenge(challengeID, body, authContext)
      .then(() => {
        setloading(false);
        // navigation.navigate('AlterRequestSent');
        setAlterModalVisible(true);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  console.log('challengeObj ::::=>', challengeObj);

  return (
    <TCKeyboardView>
      <ActivityLoader visible={loading} />
      <TCTabView
        totalTabs={2}
        firstTabTitle={'ALTERATION REQUEST'}
        secondTabTitle={'CURRENT RESERVATION'}
        indexCounter={maintabNumber}
        eventPrivacyContianer={{width: 100}}
        onFirstTabPress={() => setMaintabNumber(0)}
        onSecondTabPress={() => setMaintabNumber(1)}
        activeHeight={36}
        inactiveHeight={40}
      />
      {teams && challengeObj && maintabNumber === 0 && (
        <View style={{marginBottom: 15}}>
          <View>
            <Text style={styles.buttonText}>
              Please edit the reservation details below before you send the
              alteration request.
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
                          ? {uri: getChallenger()?.thumbnail}
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
                          ? {uri: getChallengee()?.thumbnail}
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
                isNew={
                  challengeObj?.home_team?.group_id !==
                    oldVersion?.home_team?.group_id ||
                  challengeObj?.home_team?.user_id !==
                    oldVersion?.home_team?.user_id
                }
                isEdit={true}
                onEditPress={() => {
                  navigation.navigate('HomeAway', {
                    settingObj: challengeObj,
                    comeFrom: 'EditChallenge',
                    sportName,
                  });
                }}
              />
              <View style={styles.teamContainer}>
                <Text style={styles.homeLableStyle}>Home</Text>
                <View style={styles.teamViewStyle}>
                  <Image
                    source={
                      challengeObj?.home_team?.thumbnail
                        ? {uri: challengeObj?.home_team?.thumbnail}
                        : challengeObj?.home_team?.user_challenge === true
                        ? images.profilePlaceHolder
                        : images.teamPlaceholder
                    }
                    style={styles.imageView}
                  />

                  <View style={styles.teamTextContainer}>
                    <Text style={styles.teamNameLable}>
                      {challengeObj?.home_team?.full_name ||
                        challengeObj?.home_team?.group_name}
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
                        ? {uri: challengeObj?.away_team?.thumbnail}
                        : challengeObj?.away_team?.user_challenge === true
                        ? images.profilePlaceHolder
                        : images.teamPlaceholder
                    }
                    style={styles.imageView}
                  />

                  <View style={styles.teamTextContainer}>
                    <Text style={styles.teamNameLable}>
                      {challengeObj?.away_team?.full_name ??
                        challengeObj?.away_team?.group_name}
                    </Text>
                    <Text style={styles.locationLable}>
                      {`${challengeObj?.away_team?.city}, ${challengeObj?.away_team?.state_abbr}`}
                    </Text>
                  </View>
                </View>
              </View>
              <TCThickDivider marginTop={20} />
            </View>
            {challengeObj?.sport?.toLowerCase() === 'tennis' ? (
              <View>
                <TCChallengeTitle
                  title={'Sets, Games & Duration'}
                  isEdit={true}
                  isNew={
                    !_.isEqual(
                      challengeObj?.score_rules,
                      oldVersion?.score_rules,
                    )
                  }
                  onEditPress={() => {
                    navigation.navigate('GameTennisDuration', {
                      settingObj: challengeObj,
                      comeFrom: 'EditChallenge',
                      sportName,
                    });
                  }}
                />
                <TCGameDetailRules
                  gameRules={challengeObj?.score_rules}
                  isShowTitle={false}
                  isMore={isMore}
                  onPressMoreLess={() => {
                    setIsMore(!isMore);
                  }}
                />
                <TCThickDivider marginTop={20} />
              </View>
            ) : (
              <View>
                <TCChallengeTitle
                  title={'Game Duration'}
                  isEdit={true}
                  isNew={
                    !_.isEqual(
                      challengeObj?.game_duration,
                      oldVersion?.game_duration,
                    )
                  }
                  onEditPress={() => {
                    navigation.navigate('GameDuration', {
                      settingObj: challengeObj,
                      comeFrom: 'EditChallenge',
                      sportName,
                    });
                  }}
                />
                <TCChallengeTitle
                  containerStyle={{
                    marginLeft: 25,
                    marginTop: 15,
                    marginBottom: 5,
                  }}
                  title={'1st period'}
                  titleStyle={{fontSize: 16, fontFamily: fonts.RRegular}}
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
                  style={{marginBottom: 15}}
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
                  style={{marginBottom: 15}}
                />
                <TCThickDivider marginTop={20} />
              </View>
            )}
            <View>
              <TCChallengeTitle
                title={'Date & Time'}
                isEdit={true}
                isNew={
                  challengeObj?.start_datetime !== oldVersion?.start_datetime ||
                  challengeObj?.end_datetime !== oldVersion?.end_datetime
                }
                onEditPress={() => {
                  navigation.navigate('ChooseTimeSlotScreen', {
                    settingObject: challengeObj,
                    comeFrom: 'EditChallenge',
                  });
                }}
              />

              <View>
                <View style={styles.dateTimeValue}>
                  <Text style={styles.dateTimeText}>Start </Text>
                  <Text style={styles.dateTimeText}>
                    {moment(
                      new Date(
                        route?.params?.startTime ??
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
                        route?.params?.endTime ??
                          challengeObj?.end_datetime * 1000,
                      ),
                    ).format('MMM DD, YYYY hh:mm a')}
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

              <TCThickDivider marginTop={10} />
            </View>

            <View>
              <TCChallengeTitle
                title={'Venue'}
                isEdit={true}
                isNew={!_.isEqual(challengeObj?.venue, oldVersion?.venue)}
                onEditPress={() => {
                  navigation.navigate('ChooseVenueScreen', {
                    venues: venueList || [],
                    comeFrom: 'EditChallenge',
                    groupObj: route?.params?.groupObj,
                    sportName: route?.params?.challengeObj?.sport,
                    challengeObj: route?.params?.challengeObj,
                    lastConfirmVersion: route?.params?.challengeObj,
                    settingObj: route?.params?.settingObj,
                  });
                }}
              />

              <View style={styles.venueContainer}>
                <Text style={styles.venueTitle}>
                  {challengeObj?.venue?.name}
                </Text>
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
              title={'Game Type'}
              value={challengeObj?.game_type}
              tooltipText={
                'The game result has an effect on TC points of the challengee and you.'
              }
              tooltipHeight={hp('6%')}
              tooltipWidth={wp('50%')}
              isEdit={true}
              isNew={challengeObj?.game_type !== oldVersion?.game_type}
              onEditPress={() => {
                navigation.navigate('GameType', {
                  settingObj: challengeObj,
                  comeFrom: 'EditChallenge',
                  sportName,
                });
              }}
            />
            <TCThickDivider />

            <TCChallengeTitle
              title={'Match Fee'}
              value={challengeObj?.game_fee?.fee}
              staticValueText={`${challengeObj?.game_fee?.currency_type} /Game`}
              valueStyle={{
                fontFamily: fonts.RBold,
                fontSize: 16,
                color: colors.greenColorCard,
                marginRight: 2,
              }}
              isEdit={true}
              isNew={!_.isEqual(challengeObj?.game_fee, oldVersion?.game_fee)}
              onEditPress={() => {
                navigation.navigate('GameFee', {
                  settingObj: challengeObj,
                  comeFrom: 'EditChallenge',
                  sportName,
                });
              }}
            />

            <TCThickDivider />
            {Number(challengeObj?.game_fee?.fee) !== 0 &&
              challengeObj?.challenger === authContext.entity.uid && (
                <View>
                  <View>
                    <TCLabel
                      title={'Payment Method'}
                      style={{marginBottom: 10}}
                    />
                    <View style={styles.viewMarginStyle}>
                      <TCTouchableLabel
                        title={
                          defaultCard &&
                          defaultCard?.card?.brand &&
                          defaultCard?.card?.last4
                            ? `${Utility.capitalize(
                                defaultCard?.card?.brand,
                              )} ****${defaultCard?.card?.last4}`
                            : strings.addOptionMessage
                        }
                        showNextArrow={true}
                        onPress={() => {
                          navigation.navigate('PaymentMethodsScreen', {
                            comeFrom: 'EditChallenge',
                          });
                        }}
                      />
                    </View>
                  </View>
                  <TCThickDivider marginTop={20} />
                </View>
              )}

            <TCChallengeTitle
              title={'Game Rules'}
              isEdit={true}
              isNew={
                !!(
                  challengeObj?.general_rules !== oldVersion?.general_rules ||
                  challengeObj?.special_rules !== oldVersion?.special_rules
                )
              }
              onEditPress={() => {
                navigation.navigate('GameRules', {
                  settingObj: challengeObj,
                  comeFrom: 'EditChallenge',
                  sportName,
                });
              }}
            />
            <Text style={styles.rulesTitle}>General Rules</Text>
            <Text style={styles.rulesDetail}>
              {challengeObj?.general_rules}
            </Text>
            <View style={{marginBottom: 10}} />
            <Text style={styles.rulesTitle}>Special Rules</Text>
            <Text style={styles.rulesDetail}>
              {challengeObj?.special_rules}
            </Text>
            <TCThickDivider marginTop={20} />
          </View>

          <View>
            {/* <TCChallengeTitle
          title={'Referees'}
          value={challengeObj?.responsible_for_referee?.who_secure?.length}
          staticValueText={'Referees'}
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
          isEdit={true}
          isNew={!_.isEqual(challengeObj?.responsible_for_referee, oldVersion?.responsible_for_referee)}
          onEditPress={() => {
            navigation.navigate('RefereesSetting', {
              settingObj: challengeObj,
              comeFrom: 'EditChallenge',
              sportName,
            });
          }}
        />

            <FlatList
          data={challengeObj?.responsible_for_referee?.who_secure}
          renderItem={renderReferees}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={{ margin: 5 }} />}
          style={{ marginBottom: 15 }}
        /> */}

            <RefereeAgreementView
              teamA={getChallenger()?.group_name ?? getChallenger()?.full_name}
              teamB={getChallengee()?.group_name ?? getChallengee()?.full_name}
              numberOfReferee={
                challengeObj?.responsible_for_referee?.who_secure?.length ?? 0
              }
              agreementOpetion={challengeObj?.min_referee === 0 ? 1 : 2}
              moreButtonVisible={true}
              morePressed={(value) => {
                setMoreButtonReferee(value);
              }}
              isMore={moreButtonReferee}
              isNew={
                !_.isEqual(
                  challengeObj?.responsible_for_referee,
                  oldVersion?.responsible_for_referee,
                )
              }
              isEdit={true}
              onEditPress={() => {
                navigation.navigate('RefereesSetting', {
                  settingObj: challengeObj,
                  comeFrom: 'EditChallenge',
                  sportName,
                });
              }}
            />
            <TCThickDivider />

            {/* <TCChallengeTitle
          title={'Scorekeepers'}
          value={challengeObj?.responsible_for_scorekeeper?.who_secure?.length}
          staticValueText={'Scorekeepers'}
          valueStyle={{
            fontFamily: fonts.RBold,
            fontSize: 16,
            color: colors.greenColorCard,
            marginRight: 2,
          }}
          isEdit={true}
          isNew={!_.isEqual(challengeObj?.responsible_for_scorekeeper, oldVersion?.responsible_for_scorekeeper)}

          onEditPress={() => {
            navigation.navigate('ScorekeepersSetting', {
              settingObj: challengeObj,
              comeFrom: 'EditChallenge',
              sportName,
            });
          }}
        />
            <FlatList
          data={challengeObj?.responsible_for_scorekeeper?.who_secure}
          renderItem={renderScorekeepers}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={{ margin: 5 }} />}
          style={{ marginBottom: 15 }}
        /> */}

            <ScorekeeperAgreementView
              teamA={getChallenger()?.group_name ?? getChallenger()?.full_name}
              teamB={getChallengee()?.group_name ?? getChallengee()?.full_name}
              numberOfScorekeeper={
                challengeObj?.responsible_for_scorekeeper?.who_secure?.length ??
                0
              }
              agreementOpetion={challengeObj?.min_scorekeeper === 0 ? 1 : 2}
              moreButtonVisible={true}
              morePressed={(value) => {
                setMoreButtonScorekeeper(value);
              }}
              isMore={moreButtonScorekeeper}
              isNew={
                !_.isEqual(
                  challengeObj?.responsible_for_scorekeeper,
                  oldVersion?.responsible_for_scorekeeper,
                )
              }
              isEdit={true}
              onEditPress={() => {
                navigation.navigate('ScorekeepersSetting', {
                  settingObj: challengeObj,
                  comeFrom: 'EditChallenge',
                  sportName,
                });
              }}
            />
            <TCThickDivider />
            <TCChallengeTitle
              title={
                challengeObj?.challenger === entity.uid ? 'Payment' : 'Earning'
              }
              isEdit={false}
              onEditPress={() => {
                navigation.navigate('EditFeeScreen', {
                  editableAlter: true,
                  body: challengeObj,
                });
              }}
            />
            <GameFeeCard
              feeObject={
                feeObj ?? {
                  total_game_fee: challengeObj?.total_game_fee,
                  total_service_fee1: challengeObj?.total_service_fee1,
                  total_service_fee2: challengeObj?.total_service_fee2,
                  international_card_fee: challengeObj?.international_card_fee,
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
          <TCChallengeTitle
            title={'Refund Policy'}
            value={challengeObj?.refund_policy}
            tooltipText={
              '-Cancellation 24 hours in advance- Free cancellation until 24 hours before the game starting time.  -Cancellation less than 24 hours in advance-If the challenge sender cancels  less than 24 hours before the game starting time the match fee and service fee are not refunded.'
            }
            tooltipHeight={hp('18%')}
            tooltipWidth={wp('50%')}
            isEdit={false}
            onEditPress={() => {
              navigation.navigate('RefundPolicy', {
                settingObj: challengeObj,
                comeFrom: 'EditChallenge',
                sportName,
              });
            }}
          />

          <TCThickDivider />
          <SafeAreaView>
            <View style={styles.bottomButtonView}>
              <TCGradientButton
                title={strings.sendAlterRequest}
                onPress={() => {
                  // navigation.push('ChallengePaymentScreen');
                  // navigation.push('InviteToChallengeSentScreen');
                  updateChallengeDetail();
                }}
                outerContainerStyle={{
                  width: '92%',
                  alignSelf: 'center',
                }}
              />
              <TCSmallButton
                isBorderButton={true}
                borderstyle={{
                  borderColor: colors.themeColor,
                  borderWidth: 1,
                  borderRadious: 80,
                }}
                textStyle={{color: colors.themeColor}}
                title={strings.cancelTitle}
                onPress={() => {
                  navigation.popToTop();
                }}
                style={{
                  width: widthPercentageToDP('92%'),
                  alignSelf: 'center',
                }}
              />
            </View>
          </SafeAreaView>
        </View>
      )}

      <SafeAreaView>
        {maintabNumber === 1 && (
          <CurruentReservationView reservationObj={oldVersion} />
        )}
      </SafeAreaView>

      <Modal
        isVisible={alterModalVisible}
        backdropColor="black"
        //   onBackdropPress={backdropPress}
        //   onRequestClose={onClose}
        backdropOpacity={0.5}
        style={{
          margin: 0,
          marginTop: 50,
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}>
        <View style={styles.mainContainer}>
          <Image style={styles.background} source={images.orangeLayer} />
          <Image style={styles.background} source={images.entityCreatedBG} />

          <View style={styles.mailContainer}>
            <Text style={styles.invitationText}>
              {'Alteration request\nsent'}
            </Text>
            <View style={styles.imageContainer}>
              <Image
                source={images.challengeSentPlane}
                style={styles.rotateImage}
              />
            </View>
          </View>

          <SafeAreaView>
            <TouchableOpacity
              style={styles.goToProfileButton}
              onPress={() => {
                setAlterModalVisible(false);
                navigation.popToTop();
              }}>
              <Text style={styles.goToProfileTitle}>OK</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>
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

  buttonText: {
    justifyContent: 'center',
    alignSelf: 'center',
    color: colors.darkThemeColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginLeft: 15,
    marginRight: 15,
  },
  bottomButtonView: {
    marginTop: 15,
    marginBottom: 15,
    height: 95,
    justifyContent: 'space-between',
  },

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    resizeMode: 'stretch',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  goToProfileButton: {
    alignSelf: 'center',
    borderColor: colors.whiteColor,
    borderRadius: 40,
    borderWidth: 1,
    height: 45,

    width: '92%',
  },
  goToProfileTitle: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 15,
    height: 50,
    padding: 12,
    textAlign: 'center',
  },
  mailContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  invitationText: {
    fontSize: 25,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
    textAlign: 'center',
    marginBottom: 20,
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotateImage: {
    width: 230,
    height: 150,
    resizeMode: 'contain',
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
