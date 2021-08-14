/* eslint-disable no-console */
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash';
import AuthContext from '../../../../auth/context';
import EventMapView from '../../../../components/Schedule/EventMapView';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import images from '../../../../Constants/ImagePath';
import TCGradientButton from '../../../../components/TCGradientButton';
import TCGameCard from '../../../../components/TCGameCard';
import TCInfoField from '../../../../components/TCInfoField';
import {
  getGameFromToDateDiff,
  getGameHomeScreen,
} from '../../../../utils/gameUtils';
import { getRefereeGameFeeEstimation } from '../../../../api/Challenge';
import MatchFeesCard from '../../../../components/challenge/MatchFeesCard';
import { createUserReservation } from '../../../../api/Reservations';
import TCTouchableLabel from '../../../../components/TCTouchableLabel';
import * as Utility from '../../../../utils';
import strings from '../../../../Constants/String';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import TCChallengeTitle from '../../../../components/TCChallengeTitle';

let body = {};
const RefereeBookingDateAndTime = ({ navigation, route }) => {
  const sportName = route?.params?.sportName;
  const userData = route?.params?.userData;
  const [gameData, setGameData] = useState(route?.params?.gameData ?? null);
  const [chiefOrAssistant, setChiefOrAssistant] = useState('chief');
  const [challengeObject, setChallengeObject] = useState(null);
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log('route?.params?.gameData', route?.params?.gameData);
    setGameData(route?.params?.gameData);
    getFeeDetail();
  }, [route?.params?.gameData]);
  const getFeeDetail = () => {
    const gData = route?.params?.gameData;
    if (gData) {
      setLoading(true);
      body = {
        sport: gData?.sport,
        manual_fee: false,
        start_datetime: gData?.start_datetime,
        end_datetime: gData?.end_datetime,
      };
      getRefereeGameFeeEstimation(userData?.user_id, body, authContext)
        .then((response) => {
          body.hourly_game_fee = response?.payload?.hourly_game_fee ?? 0;
          body.currency_type = 'CAD';
          body.total_payout = response?.payload?.total_payout ?? 0;
          body.service_fee1_charges = response?.payload?.total_service_fee1 ?? 0;
          body.service_fee2_charges = response?.payload?.total_service_fee2 ?? 0;
          body.total_charges = response?.payload?.total_amount ?? 0;
          body.total_game_charges = response?.payload?.total_game_fee ?? 0;
          body.payment_method_type = 'card';
          // body = { ...body, hourly_game_fee: hFee, currency_type: cType };
          setChallengeObject(body);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  const Title = ({ text, required }) => (
    <Text style={styles.titleText}>
      {text}
      {required && <Text style={{ color: colors.redDelColor }}> * </Text>}
    </Text>
  );

  const Seperator = ({ height = 7 }) => (
    <View
      style={{
        width: '100%',
        height,
        marginVertical: 2,
        backgroundColor: colors.grayBackgroundColor,
      }}
    />
  );

  console.log('gameData:=>', gameData);
  const getDateDuration = (fromData, toDate) => {
    const startDate = moment(fromData * 1000).format('hh:mm a');
    const endDate = moment(toDate * 1000).format('hh:mm a');
    const duration = getGameFromToDateDiff(fromData, toDate);
    return `${startDate} - ${endDate} (${duration})`;
  };

  const handleOnNext = () => {
    if (!gameData?.game_id) {
      Alert.alert('Towns Cup', 'You don\'t have any selected match');
      return false;
    }

    // if (
    //   chiefOrAssistant === 'chief'
    //   && !gameData?.challenge_referee?.who_secure?.[0]?.is_chief
    // ) {
    //   Alert.alert(
    //     'Towns Cup',
    //     'You can’t book the chief referee for this match.',
    //   );
    //   return false;
    // }

    const bodyParams = {
      ...challengeObject,
      source: route?.params?.paymentMethod?.id,
      referee_id: userData?.user_id,
      game_id: gameData?.game_id,
      chief_referee: chiefOrAssistant === 'chief',
      total_game_fee: challengeObject?.total_game_charges,
      total_service_fee1: challengeObject?.service_fee1_charges,
      total_service_fee2: challengeObject?.service_fee2_charges,
      total_amount: challengeObject?.total_charges,
      // total_payout: challengeObject?.total_payout,
    };
    delete bodyParams.sport;
    delete bodyParams.start_datetime;
    delete bodyParams.end_datetime;
    delete bodyParams.total_game_charges;
    delete bodyParams.service_fee1_charges;
    delete bodyParams.total_charges;
    delete bodyParams.service_fee2_charges;
    // delete bodyParams.total_payout;

    if (Number(bodyParams.hourly_game_fee) > 0 && !bodyParams?.source) {
      Alert.alert('Towns Cup', 'Select Payment Method');
      return false;
    }
    if (Number(bodyParams.hourly_game_fee) === 0) delete bodyParams.source;

    delete bodyParams.hourly_game_fee;

    setLoading(true);
    createUserReservation('referees', bodyParams, authContext)
      .then(() => {
        const navigationName = route?.params?.navigationName ?? getGameHomeScreen(gameData?.sport);
        navigation.navigate('BookRefereeSuccess', {
          navigationScreenName: navigationName,
        });
      })
      .catch((error) => {
        setTimeout(() => Alert.alert('Towns Cup', error?.message), 200);
      })
      .finally(() => setLoading(false));
    return true;
  };
  console.log('GD : ', sportName);
  return (
    <>
      <ScrollView bounces={false} style={{ flex: 1 }}>
        {/*  Steps */}
        {/* <TCStep totalStep={2} currentStep={2} style={{
            margin: 0, padding: 0, paddingTop: 15, paddingRight: 15,
          }}/> */}
        <ActivityLoader visible={loading} />

        {/* Name and country */}
        <View style={styles.contentContainer}>
          <Title text={'Referee'} />
          <View style={{ marginVertical: 10 }}>
            <View style={styles.topViewContainer}>
              <View style={styles.profileView}>
                <Image
                  source={
                    userData?.full_image
                      ? { uri: userData?.full_image }
                      : images.profilePlaceHolder
                  }
                  style={styles.profileImage}
                />
              </View>
              <View style={styles.topTextContainer}>
                <Text style={styles.nameText} numberOfLines={1}>
                  {userData?.full_name}
                </Text>
                <Text
                  style={styles.locationText}
                  numberOfLines={
                  1
                  }>{`${userData?.city} , ${userData?.country}`}</Text>
              </View>
            </View>
          </View>
        </View>
        <Seperator />

        {/* Choose game */}
        <View style={styles.contentContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('RefereeSelectMatch', {
                userData,
                sport: sportName,
                comeFrom: 'RefereeBookingDateAndTime',
              });
            }}
            disabled={!route?.params?.showMatches}
            activeOpacity={!route?.params?.showMatches ? 1 : 0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Title text={'Choose a game'} required={true} />
            {route?.params?.showMatches && (
              <View
                onPress={() => {
                  navigation.navigate('RefereeSelectMatch', {
                    userData,
                    sport: sportName,
                    comeFrom: 'RefereeBookingDateAndTime',
                  });
                }}>
                <FastImage
                  source={images.arrowGT}
                  style={{ width: 8, height: 12 }}
                />
              </View>
            )}
          </TouchableOpacity>

          {gameData && (
            <TCGameCard
              data={gameData}
              onPress={() => {
                const routeName = getGameHomeScreen(gameData?.sport);
                navigation.push(routeName, { gameId: gameData?.game_id });
              }}
              cardWidth={'88%'}
            />
          )}
        </View>

        {/* Date & Time */}
        {gameData && (
          <View>
            <View style={styles.contentContainer}>
              <Title text={'Date & Time'} />
              <TCInfoField
                title={'Date'}
                value={
                  gameData?.start_datetime
                  && moment(gameData?.start_datetime * 1000).format('MMM DD, YYYY')
                }
                titleStyle={{
                  alignSelf: 'flex-start',
                  fontFamily: fonts.RRegular,
                }}
              />
              <Seperator height={2} />
              <TCInfoField
                title={'Time'}
                value={
                  gameData?.start_datetime && gameData?.end_datetime
                    ? getDateDuration(
                        gameData?.start_datetime,
                        gameData?.end_datetime,
                      )
                    : ''
                }
                titleStyle={{
                  alignSelf: 'flex-start',
                  fontFamily: fonts.RRegular,
                }}
              />
              <Seperator height={2} />
            </View>

            {/* Venue */}
            <View style={styles.contentContainer}>
              <Title text={'Venue'} />
              <TCInfoField
                title={'Venue'}
                value={gameData?.venue?.name}
                titleStyle={{
                  alignSelf: 'flex-start',
                  fontFamily: fonts.RRegular,
                }}
              />
              <TCInfoField
                title={'Address'}
                value={gameData?.venue?.address}
                titleStyle={{
                  alignSelf: 'flex-start',
                  fontFamily: fonts.RRegular,
                }}
              />
              <EventMapView
                region={{
                  latitude: gameData?.venue?.coordinate?.latitude ?? 0.0,
                  longitude: gameData?.venue?.coordinate?.longitude ?? 0.0,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                coordinate={{
                  latitude: gameData?.venue?.coordinate?.latitude ?? 0.0,
                  longitude: gameData?.venue?.coordinate?.longitude ?? 0.0,
                }}
              />
            </View>
          </View>
        )}

        <TCChallengeTitle title={'Game Rules'} />
        <Text style={styles.rulesTitle}>General Rules</Text>
        <Text style={styles.rulesDetail}>{'Dummy general rules text'}</Text>
        <View style={{ marginBottom: 10 }} />
        <Text style={styles.rulesTitle}>Special Rules</Text>
        <Text style={[styles.rulesDetail, { marginBottom: 10 }]}>{'Dummy special rules text'}</Text>
        <Seperator />

        {/* Chief or assistant */}
        <View style={styles.contentContainer}>
          <Title text={'Chief or assistant'} />
          {['chief', 'assistant'].map((item, index) => (
            <View
              key={index}
              style={{
                margin: 7,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontFamily: fonts.RRegular,
                  fontSize: 16,
                  color: colors.lightBlackColor,
                }}>
                {_.startCase(item)} Referee
              </Text>
              <TouchableOpacity
                style={{
                  borderColor: colors.magnifyIconColor,
                  height: 22,
                  width: 22,
                  borderWidth: 2,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => setChiefOrAssistant(item)}>
                {item === chiefOrAssistant && (
                  <LinearGradient
                    colors={[colors.orangeColor, colors.yellowColor]}
                    end={{ x: 0.0, y: 0.25 }}
                    start={{ x: 1, y: 0.5 }}
                    style={{
                      height: 13,
                      width: 13,
                      borderRadius: 50,
                    }}></LinearGradient>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <Seperator />

        {/* Payment */}
        {gameData && (
          <View style={styles.contentContainer}>
            <Title text={'Payment'} />
            <View style={{ marginTop: 10 }}>
              <MatchFeesCard
                challengeObj={challengeObject}
                senderOrReceiver={'sender'}
                type="referee"
              />
            </View>
          </View>
        )}

        {/* Payment Method */}
        {Number(challengeObject?.hourly_game_fee) > 0 && (
          <View style={styles.contentContainer}>
            <Title text={'Payment Method'} />
            <View style={{ marginTop: 10 }}>
              <TCTouchableLabel
                title={
                  route.params.paymentMethod
                    ? Utility.capitalize(route.params.paymentMethod.card.brand)
                    : strings.addOptionMessage
                }
                subTitle={route.params.paymentMethod?.card.last4}
                showNextArrow={true}
                onPress={() => {
                  navigation.navigate('PaymentMethodsScreen', {
                    comeFrom: 'RefereeBookingDateAndTime',
                  });
                }}
              />
            </View>
          </View>
        )}
      </ScrollView>

      <SafeAreaView>
        <TCGradientButton
          isDisabled={!gameData}// || (Number(hourly_game_fee) >= 0 && !route.params.paymentMethod)
          title={strings.doneTitle}
          style={{ marginBottom: 15 }}
          onPress={handleOnNext}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 15,
  },
  titleText: {
    color: colors.lightBlackColor,
    fontSize: 20,
    fontFamily: fonts.RRegular,
  },
  profileImage: {
    alignSelf: 'center',
    height: 40,
    width: 40,
    borderRadius: 80,
  },

  topViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  profileView: {
    backgroundColor: colors.whiteColor,
    height: 44,
    width: 44,
    borderRadius: 88,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  topTextContainer: {
    marginLeft: 10,
    alignSelf: 'center',
  },
  nameText: {
    fontSize: 20,
    fontFamily: fonts.RMedium,
    // width: 200,
  },

  locationText: {
    fontSize: 14,
    fontFamily: fonts.RLight,
  },
  rulesTitle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginBottom: 5,
  },
  rulesDetail: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
  },
});

export default RefereeBookingDateAndTime;
