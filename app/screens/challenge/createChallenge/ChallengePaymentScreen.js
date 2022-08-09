/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import Modal from 'react-native-modal';
import ActivityLoader from '../../../components/loader/ActivityLoader';

import AuthContext from '../../../auth/context';
import strings from '../../../Constants/String';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCGradientButton from '../../../components/TCGradientButton';
import TCThickDivider from '../../../components/TCThickDivider';
import TCLabel from '../../../components/TCLabel';
import TCThinDivider from '../../../components/TCThinDivider';
import TCInfoImageField from '../../../components/TCInfoImageField';
import TCInfoField from '../../../components/TCInfoField';
import EventMapView from '../../../components/Schedule/EventMapView';
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import * as Utility from '../../../utils';
import TCChallengeTitle from '../../../components/TCChallengeTitle';
import images from '../../../Constants/ImagePath';
import GameFeeCard from '../../../components/challenge/GameFeeCard';
import {
  acceptDeclineChallenge,
  createChallenge,
  getFeesEstimation,
} from '../../../api/Challenge';
import TCFormProgress from '../../../components/TCFormProgress';

let entity = {};
export default function ChallengePaymentScreen({route, navigation}) {
  const authContext = useContext(AuthContext);
  entity = authContext.entity;
  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [refundValue, setRefundValue] = useState();

  const [challengeData, setChallengeData] = useState(
    route?.params?.challengeObj,
  );
  console.log(' route?.params?.challengeObj,', route?.params?.challengeObj);
  const [groupObj] = useState(route?.params?.groupObj);
  const [defaultCard, setDefaultCard] = useState();

  const [type] = useState(route?.params?.type);

  const getChallenger = () => {
    if (
      challengeData?.challenger === challengeData?.home_team?.user_id ||
      challengeData?.challenger === challengeData?.home_team?.group_id
    ) {
      return challengeData?.home_team;
    }
    return challengeData?.away_team;
  };

  const getChallengee = () => {
    if (
      challengeData?.challengee === challengeData?.home_team?.user_id ||
      challengeData?.challengee === challengeData?.home_team?.group_id
    ) {
      return challengeData?.home_team;
    }
    return challengeData?.away_team;
  };

  useEffect(() => {
    Utility.getStorage('appSetting').then((setting) => {
      console.log('App setting for fee:=>', setting.refund_policy);
      const policytype = setting.refund_policy;
      const refund = policytype.filter(
        (obj) => obj.policy_type === challengeData?.refund_policy,
      )[0];
      const value = refund.values.filter((obj_1) => obj_1.after === 1)[0];
      console.log('refund obj', value.refund);
      setRefundValue(value.refund);
    });
  }, [challengeData?.refund_policy]);

  useEffect(() => {
    Utility.getStorage('paymentSetting').then((setting) => {
      setDefaultCard(setting);
    });
  }, []);

  useEffect(() => {
    if (isFocused) {
      if (route?.params?.paymentMethod) {
        console.log(
          'route?.params?.paymentMethod',
          route?.params?.paymentMethod,
        );
        getFeeDetail();
        setDefaultCard(route?.params?.paymentMethod);
      }
    }
  }, [isFocused, route?.params?.paymentMethod]);

  const getTimeDifferent = (sDate, eDate) => {
    let delta =
      Math.abs(new Date(sDate).getTime() - new Date(eDate).getTime()) / 1000;

    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    return `${hours}h ${minutes}m`;
  };

  const getFeeDetail = () => {
    const feeBody = {};
    console.log('challengeData check:=>', challengeData);

    feeBody.source = route?.params?.paymentMethod?.id;
    feeBody.challenge_id = challengeData?.challenge_id;
    feeBody.payment_method_type = 'card';
    feeBody.currency_type =
      challengeData?.game_fee?.currency_type?.toLowerCase();
    feeBody.total_game_fee = Number(
      parseFloat(challengeData?.game_fee?.fee).toFixed(2),
    );
    setloading(true);
    getFeesEstimation(feeBody, authContext)
      .then((response) => {
        setChallengeData({
          ...challengeData,
          total_game_fee: response.payload?.total_game_fee,
          total_service_fee1: response.payload?.total_service_fee1,
          total_service_fee2: response.payload?.total_service_fee2,
          total_stripe_fee: response.payload?.total_stripe_fee,
          total_payout: response.payload?.total_payout,
          total_amount: response.payload?.total_amount,
          international_card_fee: response.payload?.international_card_fee,
        });

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

  const sendChallenge = () => {
    entity = authContext.entity;
    console.log('Entity:=>', entity);
    const res_secure_referee =
      challengeData?.responsible_for_referee?.who_secure?.map((obj) => ({
        ...obj,
        responsible_team_id:
          obj.responsible_to_secure_referee === 'challengee'
            ? challengeData.challengee
            : challengeData.challenger,
      }));

    const res_secure_scorekeeper =
      challengeData?.responsible_for_scorekeeper?.who_secure?.map((obj) => ({
        ...obj,
        responsible_team_id:
          obj.responsible_to_secure_scorekeeper === 'challengee'
            ? challengeData.challengee
            : challengeData.challenger,
      }));

    const body = {
      ...challengeData,
      payment_method_type: 'card',
      start_datetime: Number(
        parseFloat(challengeData?.start_datetime).toFixed(0),
      ),
      end_datetime: Number(parseFloat(challengeData?.end_datetime).toFixed(0)),
    };
    console.log('res_secure_referee?.length', res_secure_referee?.length);
    if (res_secure_referee?.length > 0) {
      body.responsible_for_referee.who_secure = res_secure_referee;
    }
    if (res_secure_scorekeeper?.length > 0) {
      body.responsible_for_scorekeeper.who_secure = res_secure_scorekeeper;
    }
    console.log('body:=>', body);
    const homeID =
      challengeData?.sport_type === 'single'
        ? body.home_team.user_id
        : body.home_team.group_id;
    const awayID =
      challengeData?.sport_type === 'single'
        ? body.away_team.user_id
        : body.away_team.group_id;
    delete body.home_team;
    delete body.away_team;
    body.home_team = homeID;
    body.away_team = awayID;

    if (defaultCard) {
      body.source = defaultCard.id;
    }
    console.log('Challenge Object111:=>', body);

    setloading(true);
    createChallenge(body, authContext)
      .then((response) => {
        console.log(' challenge response:=>', response.payload);
        // navigation.navigate('ChallengeSentScreen', {
        //   groupObj,
        // });
        setModalVisible(true);
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const challengeOperation = (
    teamID,
    ChallengeId,
    versionNo,
    status,
    payment,
  ) => {
    console.log('payment:=>', payment);
    setloading(true);
    acceptDeclineChallenge(
      teamID,
      ChallengeId,
      versionNo,
      status,
      payment,
      authContext,
    )
      .then((response) => {
        setloading(false);
        let obj;
        if (challengeData?.home_team?.full_name) {
          if (challengeData?.home_team?.user_id === authContext?.entity?.uid) {
            obj = challengeData?.away_team;
          } else {
            obj = challengeData?.home_team;
          }
        } else if (
          challengeData?.home_team?.group_id === authContext?.entity?.uid
        ) {
          obj = challengeData?.away_team;
        } else {
          obj = challengeData?.home_team;
        }

        if (status === 'accept') {
          navigation.navigate('ChallengeAcceptedDeclinedScreen', {
            teamObj: {
              ...obj,
              game_id: response?.payload?.game_id,
              sport: challengeData?.sport,
            },
            status: 'accept',
          });
        }
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  return (
    <ScrollView testID="challenge-payment-scroll">
      <ActivityLoader visible={loading} />
      <TCFormProgress totalSteps={4} curruentStep={4} />

      {/* <ChallengeHeaderView
        challenger={
          challengeData?.challenger === challengeData?.home_team?.user_id
          || challengeData?.challenger === challengeData?.home_team?.group_id
            ? challengeData?.home_team
            : challengeData?.away_team
        }
        challengee={
          challengeData?.challengee === challengeData?.home_team?.user_id
          || challengeData?.challengee === challengeData?.home_team?.group_id
            ? challengeData?.home_team
            : challengeData?.away_team
        }
        role={challengeData?.home_team?.user_id ? 'user' : 'team'}
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
                  getChallenger()?.thumbnail
                    ? {uri: getChallenger()?.thumbnail}
                    : images.teamPlaceholder
                }
                style={styles.profileImage}
              />
            </View>
            <Text style={styles.teamNameText}>
              {getChallenger()?.user_id
                ? `${getChallenger()?.first_name} ${getChallenger()?.last_name}`
                : `${getChallenger()?.group_name}`}
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
              {getChallengee()?.user_id
                ? `${getChallengee()?.first_name} ${getChallengee()?.last_name}`
                : `${getChallengee()?.group_name}`}
            </Text>
          </View>
        </View>
      </View>
      <TCThinDivider />

      {type === 'challenge' && (
        <View>
          <TCLabel title={`Game · ${challengeData?.sport}`} />
          <TCInfoImageField
            title={'Home'}
            image={
              challengeData?.home_team?.thumbnail
                ? {uri: challengeData?.home_team?.thumbnail}
                : challengeData?.home_team?.full_name
                ? images.profilePlaceHolder
                : images.teamPlaceholder
            }
            name={
              challengeData?.home_team?.group_name ??
              challengeData?.home_team?.full_name
            }
            marginLeft={30}
          />
          <TCThinDivider />
          <TCInfoImageField
            title={'Away'}
            image={
              challengeData?.away_team?.thumbnail
                ? {uri: challengeData?.away_team?.thumbnail}
                : challengeData?.away_team?.full_name
                ? images.profilePlaceHolder
                : images.teamPlaceholder
            }
            name={
              challengeData?.away_team?.group_name ??
              challengeData?.away_team?.full_name
            }
            marginLeft={30}
          />
          <TCThinDivider />

          <TCInfoField
            title={'Time'}
            value={`${moment(
              new Date(challengeData?.start_datetime * 1000),
            ).format('MMM DD, YYYY  hh:mm a')} -\n${moment(
              new Date(challengeData?.end_datetime * 1000),
            ).format('MMM DD, YYYY  hh:mm a')}\n( ${getTimeDifferent(
              new Date(challengeData?.start_datetime * 1000),
              new Date(challengeData?.end_datetime * 1000),
            )} )   `}
            marginLeft={30}
            titleStyle={{fontSize: 16}}
          />
          <TCThinDivider />

          <TCInfoField
            title={'Venue'}
            value={challengeData?.venue?.name}
            marginLeft={30}
            titleStyle={{fontSize: 16}}
          />
          <TCThinDivider />
          <TCInfoField
            title={'Address'}
            value={challengeData?.venue?.address}
            marginLeft={30}
            titleStyle={{fontSize: 16}}
          />
          <EventMapView
            coordinate={challengeData?.venue?.coordinate}
            region={challengeData?.venue?.region}
            style={styles.map}
          />
          <TCThickDivider marginTop={20} />
        </View>
      )}

      <TCLabel title={'Payment details'} style={{marginBottom: 15}} />
      <GameFeeCard
        feeObject={{
          total_game_fee: challengeData?.total_game_fee,
          total_service_fee1: challengeData?.total_service_fee1,
          total_service_fee2: challengeData?.total_service_fee2,
          total_stripe_fee: challengeData?.total_stripe_fee,
          total_payout: challengeData?.total_payout,
          total_amount: challengeData?.total_amount,
          international_card_fee: challengeData?.international_card_fee,
        }}
        currency={challengeData?.game_fee?.currency_type}
        isChallenger={challengeData?.challenger === entity.uid}
      />
      <TCThickDivider marginTop={20} />

      {challengeData?.total_game_fee !== 0 && (
        <View>
          <View>
            <TCLabel title={'Payment Method'} />
            <View style={styles.viewMarginStyle}>
              <TCTouchableLabel
                title={
                  defaultCard &&
                  defaultCard?.card?.brand &&
                  defaultCard?.card?.last4
                    ? `${Utility.capitalize(defaultCard?.card?.brand)} ****${
                        defaultCard?.card?.last4
                      }`
                    : strings.addOptionMessage
                }
                showNextArrow={true}
                onPress={() => {
                  navigation.navigate('PaymentMethodsScreen', {
                    comeFrom: 'ChallengePaymentScreen',
                  });
                }}
              />
            </View>
          </View>
          <TCThickDivider marginTop={20} />
        </View>
      )}

      <TCChallengeTitle
        title={'Refund Policy'}
        value={challengeData?.refund_policy}
        tooltipText={
          '-Cancellation 24 hours in advance- Free cancellation until 24 hours before the game starting time.  -Cancellation less than 24 hours in advance-If the challenge sender cancels  less than 24 hours before the game starting time the match fee and service fee are not refunded.'
        }
        tooltipHeight={hp('18%')}
        tooltipWidth={wp('50%')}
      />
      <Text style={styles.normalTextStyle}>
        {challengeData?.refund_policy === 'Strict' &&
          `When you cancel this game reservation before ${moment(
            new Date(challengeData?.start_datetime * 1000),
          ).format('hh:mm a')} on ${moment(
            new Date(challengeData?.start_datetime * 1000),
          ).format(
            'MMMM DD',
          )}, you will get a ${refundValue}% refund, minus the service fee.`}
        {challengeData?.refund_policy === 'Flexible' &&
          `When you cancel this game reservation before ${moment(
            new Date(challengeData?.start_datetime * 1000),
          ).format('hh:mm a')} on ${moment(
            new Date(challengeData?.start_datetime * 1000),
          ).format(
            'MMMM DD',
          )}, you will get a ${refundValue}% refund, minus the service fee.`}
        {challengeData?.refund_policy === 'Moderate' &&
          `When you cancel this game reservation before ${moment(
            new Date(challengeData?.start_datetime * 1000),
          ).format('hh:mm a')} on ${moment(
            new Date(challengeData?.start_datetime * 1000),
          ).format(
            'MMMM DD',
          )}, you will get a ${refundValue}% refund, minus the service fee.`}
      </Text>
      <TCThickDivider />

      <Text style={styles.termsTextStyle}>
        By selecting the button below, I agree to the Game Rules cancellation
        policy and refund policy. I also agree to pay the total amount shown
        above.
      </Text>

      <TCGradientButton
        isDisabled={challengeData?.total_game_fee !== 0 ? !defaultCard : false}
        title={strings.confirmAndPayTitle}
        onPress={() => {
          // navigation.push('ChallengeSentScreen');

          if (type === 'challenge') {
            sendChallenge();
          } else {
            let challengeObj = {};
            if (challengeData?.total_game_fee !== 0) {
              challengeObj = {
                source: defaultCard?.id,
                payment_method_type: 'card',
                total_game_fee: challengeData?.total_game_fee,
                total_service_fee1: challengeData?.total_service_fee1,
                total_service_fee2: challengeData?.total_service_fee2,
                total_stripe_fee: challengeData?.total_stripe_fee,
                total_payout: challengeData?.total_payout,
                total_amount: challengeData?.total_amount,
                international_card_fee: challengeData?.international_card_fee,
              };
            }

            challengeObj.min_referee = challengeData.min_referee;
            challengeObj.min_scorekeeper = challengeData.min_scorekeeper;
            console.log('Payment obj:=>', challengeObj);

            challengeOperation(
              entity.uid,
              challengeData?.challenge_id,
              challengeData?.version,
              'accept',
              challengeObj,
            );
          }
        }}
        outerContainerStyle={{marginBottom: 45}}
      />
      {/* <ChallengeModalView
      navigation = {navigation}
      modalVisible = {modalVisible}
      backdropPress = {() => setModalVisible(false)}
      onClose = {() => setModalVisible(false)}
      groupObj = {groupObj}
      status = {'sent'}/> */}

      <Modal
        isVisible={modalVisible}
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
            <Text style={styles.invitationText}>Challenge sent</Text>
            <Text style={styles.infoText}>
              When{' '}
              {groupObj?.group_name ??
                `${groupObj?.first_name} ${groupObj?.last_name}`}{' '}
              accepts your match reservation request, you will be notified.
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
                setModalVisible(false);
                navigation.popToTop();
              }}>
              <Text style={styles.goToProfileTitle}>OK</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  map: {
    height: 150,
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 15,
  },
  viewMarginStyle: {
    marginTop: 10,
    marginBottom: 10,
  },
  normalTextStyle: {
    margin: 15,
    marginTop: 0,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  termsTextStyle: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    margin: 15,
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
  },
  infoText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.whiteColor,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 15,
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 25,
  },
  rotateImage: {
    resizeMode: 'contain',
    width: 230,
    height: 150,
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
