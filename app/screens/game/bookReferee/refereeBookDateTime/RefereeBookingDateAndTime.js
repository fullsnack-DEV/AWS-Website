/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
import React, {useEffect, useState, useContext, useCallback} from 'react';
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
import {getGameHomeScreen} from '../../../../utils/gameUtils';

import {getRefereeGameFeeEstimation} from '../../../../api/Challenge';
import MatchFeesCard from '../../../../components/challenge/MatchFeesCard';
import {createUserReservation} from '../../../../api/Reservations';
import TCTouchableLabel from '../../../../components/TCTouchableLabel';
import * as Utility from '../../../../utils';
import strings from '../../../../Constants/String';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import TCChallengeTitle from '../../../../components/TCChallengeTitle';
import TCThickDivider from '../../../../components/TCThickDivider';
import {getGameRefereeReservation} from '../../../../api/Games';
import TCFormProgress from '../../../../components/TCFormProgress';

let body = {};
const RefereeBookingDateAndTime = ({navigation, route}) => {
  const [sportName] = useState(route?.params?.sportName);
  const [userData] = useState(route?.params?.userData);
  const [gameData] = useState(route?.params?.gameData ?? null);
  const [chiefOrAssistant, setChiefOrAssistant] = useState('chief');
  const [challengeObject, setChallengeObject] = useState(null);
  const [refereeReservationList, setRefereeReservationList] = useState();
  const [defaultCard, setDefaultCard] = useState();

  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route?.params?.paymentMethod) {
      setDefaultCard(route?.params?.paymentMethod);
      console.log('route?.params?.paymentMethod', route?.params?.paymentMethod);
    }
    getFeeDetail(route?.params?.paymentMethod ?? defaultCard);
  }, [route?.params?.paymentMethod]);

  useEffect(() => {
    Utility.getStorage('paymentSetting').then((setting) => {
      setDefaultCard(setting);
    });
  }, []);

  useEffect(() => {
    if (gameData) {
      getGameRefereeReservation(gameData?.game_id, false, true, authContext)
        .then((response) => {
          console.log('resp:=>', response);
          setRefereeReservationList(response.payload);
        })
        .catch((e) => {
          setLoading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  }, [authContext, gameData, gameData?.game_id]);

  const getFeeDetail = useCallback(
    (paymentObj) => {
      const gData = gameData;
      if (gData) {
        setLoading(true);
        body = {
          sport: gData?.sport,
          sport_type: gData?.sport_type,
          manual_fee: false,
          start_datetime: gData?.start_datetime,
          end_datetime: gData?.end_datetime,
          source: paymentObj?.id,
        };

        console.log('Body', body);
        getRefereeGameFeeEstimation(
          route?.params?.isHirer ? authContext.entity.uid : userData?.user_id,
          body,
          authContext,
        )
          .then((response) => {
            console.log('Estimate referee::=>', response.payload);

            body.hourly_game_fee = response?.payload?.hourly_game_fee ?? 0;
            body.currency_type =
              response?.payload?.currency_type ?? strings.defaultCurrency;
            body.total_payout = response?.payload?.total_payout ?? 0;
            body.total_service_fee1 =
              response?.payload?.total_service_fee1 ?? 0;
            body.total_service_fee2 =
              response?.payload?.total_service_fee2 ?? 0;
            body.total_amount = response?.payload?.total_amount ?? 0;
            body.total_game_fee = response?.payload?.total_game_fee ?? 0;
            body.international_card_fee =
              response?.payload?.international_card_fee ?? 0;
            body.payment_method_type = 'card';
            // body = { ...body, hourly_game_fee: hFee, currency_type: cType };
            setChallengeObject(body);
            setLoading(false);
          })
          .catch((error) => {
            console.log('Estimate Error::=>', error);
            setLoading(false);
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, error);
            }, 10);
          });
      } else {
        setLoading(false);
      }
    },
    [authContext, gameData, route?.params?.isHirer, userData?.user_id],
  );

  const Title = ({text, required}) => (
    <Text style={styles.titleText}>
      {text}
      {required && <Text style={{color: colors.redDelColor}}> * </Text>}
    </Text>
  );

  const Seperator = ({height = 7}) => (
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

  const handleOnNext = () => {
    if (!gameData?.game_id) {
      Alert.alert(strings.appName, "You don't have any selected match");
      return false;
    }

    // if (
    //   chiefOrAssistant === 'chief'
    //   && !gameData?.challenge_referee?.who_secure?.[0]?.is_chief
    // ) {
    //   Alert.alert(
    //     strings.appName,
    //     'You can’t book the chief referee for this match.',
    //   );
    //   return false;
    // }

    const bodyParams = {
      ...challengeObject,
      // source: route?.params?.paymentMethod?.id,
      referee_id: route?.params?.isHirer
        ? authContext.entity.uid
        : userData?.user_id,
      game_id: gameData?.game_id,
      refund_policy: route?.params?.settingObj?.refund_policy,
      chief_referee: chiefOrAssistant === 'chief',
      total_game_fee: challengeObject?.total_game_fee,
      total_service_fee1: challengeObject?.total_service_fee1,
      total_service_fee2: challengeObject?.total_service_fee2,
      international_card_fee: challengeObject?.international_card_fee,
      total_amount: challengeObject?.total_amount,
      // total_payout: challengeObject?.total_payout,
    };

    if (route?.params?.isHirer) {
      bodyParams.team_id = userData?.user_id ?? userData?.group_id;
      bodyParams.is_offer = true;
    } else {
      bodyParams.source = route?.params?.paymentMethod?.id;
      bodyParams.is_offer = false;
    }
    delete bodyParams.sport;
    delete bodyParams.start_datetime;
    delete bodyParams.end_datetime;
    delete bodyParams.total_game_charges;
    delete bodyParams.service_fee1_charges;
    delete bodyParams.total_charges;
    delete bodyParams.service_fee2_charges;
    // delete bodyParams.total_payout;

    if (
      Number(bodyParams.hourly_game_fee) > 0 &&
      !bodyParams?.source &&
      !route?.params?.isHirer
    ) {
      Alert.alert(strings.appName, 'Select Payment Method');
      return false;
    }
    if (Number(bodyParams.hourly_game_fee) === 0) delete bodyParams.source;

    delete bodyParams.hourly_game_fee;

    console.log('bodyParams', bodyParams);

    setLoading(true);
    createUserReservation('referees', bodyParams, authContext)
      .then(() => {
        // const navigationName =
        //   route?.params?.navigationName ?? getGameHomeScreen(gameData?.sport);
        // navigation.navigate('BookRefereeSuccess', {
        //   navigationScreenName: navigationName,
        // });
        Alert.alert(
          'Referee approval request sent.',
          '',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.pop(2);
              },
            },
          ],
          {cancelable: false},
        );
      })
      .catch((error) => {
        setTimeout(() => Alert.alert(strings.appName, error?.message), 200);
      })
      .finally(() => setLoading(false));
    return true;
  };
  console.log('GD : ', sportName);
  return (
    <>
      <ScrollView bounces={false} style={{flex: 1}}>
        {/*  Steps */}
        <TCFormProgress totalSteps={2} curruentStep={2} />
        <ActivityLoader visible={loading} />

        {/* Name and country */}
        <View style={styles.contentContainer}>
          <Title
            text={
              route?.params?.isHirer
                ? strings.hirer.toUpperCase()
                : strings.referee.toUpperCase()
            }
          />
          <View style={{marginVertical: 16}}>
            <View style={styles.topViewContainer}>
              <View style={styles.profileView}>
                <Image
                  source={
                    userData?.full_image
                      ? {uri: userData?.full_image}
                      : images.profilePlaceHolder
                  }
                  style={styles.profileImage}
                />
              </View>
              <View style={styles.topTextContainer}>
                <Text style={styles.nameText} numberOfLines={1}>
                  {userData?.full_name ?? userData?.group_name}
                </Text>
                <Text
                  style={styles.locationText}
                  numberOfLines={
                    1
                  }>{`${userData?.city}, ${userData?.country}`}</Text>
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
            <View style={{marginBottom: 15}}>
              <Title
                text={
                  route?.params?.showMatches
                    ? strings.chooseagame.toUpperCase()
                    : strings.match.toUpperCase()
                }
                required={!!route?.params?.showMatches}
              />
            </View>

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
                  style={{width: 8, height: 12}}
                />
              </View>
            )}
          </TouchableOpacity>

          {gameData && (
            <View
              style={{
                marginRight: 0,
              }}>
              <TCGameCard
                data={gameData}
                onPress={() => {
                  const routeName = getGameHomeScreen(gameData?.sport);
                  navigation.push(routeName, {gameId: gameData?.game_id});
                }}
                cardWidth={'92%'}
              />
            </View>
          )}
        </View>
        <Seperator />
        {/* Date & Time */}
        {gameData && (
          <View>
            <View style={styles.contentContainer}>
              <Title text={strings.dateAndTime.toUpperCase()} />
              <View
                style={{
                  marginTop: 20,
                  marginLeft: 0,
                  marginRight: 15,
                }}>
                <View style={styles.dateTimeValue}>
                  <Text style={styles.dateTimeText}>
                    {strings.start.toUpperCase()}{' '}
                  </Text>
                  <Text style={styles.dateTimeText}>
                    {gameData?.start_datetime &&
                      moment(gameData?.start_datetime * 1000).format(
                        'MMM DD, YYYY\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0hh:mm a',
                      )}
                  </Text>
                </View>
                <View style={styles.dateTimeValue}>
                  <Text style={styles.dateTimeText}>
                    {strings.end.toUpperCase()}{' '}
                  </Text>
                  <Text style={styles.dateTimeText}>
                    {gameData?.end_datetime &&
                      moment(gameData?.end_datetime * 1000).format(
                        'MMM DD, YYYY\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0hh:mm a',
                      )}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}>
                  {/* <Text style={styles.dateTimeText}> </Text> */}
                  <Text style={styles.timeZoneText}>
                    {strings.timezone}{' '}
                    <Text style={{fontFamily: fonts.RRegular}}>Vancouver</Text>
                  </Text>
                </View>
              </View>
            </View>
            <Seperator />
            {/* Venue */}
            <View style={styles.contentContainer}>
              <Title text={strings.venue.toUpperCase()} />
              <TCInfoField
                title={strings.venue.toUpperCase()}
                value={gameData?.venue?.name}
                marginTop={20}
                marginLeft={0}
                marginRight={0}
                marginBottom={15}
                titleStyle={{
                  alignSelf: 'flex-start',
                  fontFamily: fonts.RRegular,
                }}
                valueStyle={{
                  flex: 0.72,
                }}
              />
              <Seperator height={1} />
              <TCInfoField
                title={strings.address.toUpperCase()}
                value={gameData?.venue?.address}
                marginTop={0}
                marginBottom={15}
                marginLeft={0}
                marginRight={0}
                titleStyle={{
                  fontFamily: fonts.RRegular,
                  color: colors.lightBlackColor,
                  fontSize: 16,
                }}
                valueStyle={{
                  flex: 0.72,
                  marginTop: 15,
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
                style={{marginBottom: 10}}
              />
            </View>
            <Seperator />
          </View>
        )}

        <TCChallengeTitle
          titleStyle={{
            ...styles.titleText,
            marginTop: 10,
          }}
          title={strings.matchrules.toUpperCase()}
        />
        <Text style={styles.rulesTitle}>General Rules</Text>
        <Text style={styles.rulesDetail}>{gameData?.general_rules}</Text>
        <View style={{marginBottom: 10}} />
        <Text style={styles.rulesTitle}>Special Rules</Text>
        <Text style={[styles.rulesDetail, {marginBottom: 25}]}>
          {gameData?.special_rules}
        </Text>
        <Seperator />

        {/* Chief or assistant */}
        <View style={styles.contentContainer}>
          <Title text={strings.chieforassistant.toUpperCase()} />
          {['chief', 'assistant'].map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 10,
                marginRight: 15,
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
                onPress={() => {
                  console.log('gameData', gameData);
                  if (item === 'chief') {
                    if (
                      refereeReservationList.filter((obj) => obj.chief_referee)
                        .length > 0
                    ) {
                      Alert.alert(
                        'You can’t book the chief referee for this game.',
                      );
                    } else {
                      setChiefOrAssistant(item);
                    }
                  } else if (
                    gameData?.challenge_referee?.who_secure?.length - 1 ===
                    refereeReservationList.filter((obj) => !obj.chief_referee)
                      .length
                  ) {
                    Alert.alert(
                      `You can’t book more than ${
                        refereeReservationList.filter(
                          (obj) => !obj.chief_referee,
                        ).length
                      } assistant referees for this game. You can change the number of referees in the reservation details.`,
                    );
                  } else {
                    setChiefOrAssistant(item);
                  }
                }}>
                {item === chiefOrAssistant && (
                  <LinearGradient
                    colors={[colors.orangeColor, colors.yellowColor]}
                    end={{x: 0.0, y: 0.25}}
                    start={{x: 1, y: 0.5}}
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
        <View>
          <TCChallengeTitle
            titleStyle={{
              ...styles.titleText,
              marginTop: 10,
              marginBottom: 10,
            }}
            valueStyle={{marginTop: 10, marginBottom: 10}}
            title={strings.refundpolicy.toUpperCase()}
            value={route?.params?.settingObj?.refund_policy}
            tooltipText={
              '-Cancellation 24 hours in advance- Free cancellation until 24 hours before the game starting time.  -Cancellation less than 24 hours in advance-If the challenge sender cancels  less than 24 hours before the game starting time the match fee and service fee are not refunded.'
            }
            tooltipHeight={Utility.heightPercentageToDP('18%')}
            tooltipWidth={Utility.widthPercentageToDP('50%')}
            isEdit={false}
          />
          <TCThickDivider />
        </View>

        {/* Payment */}
        {gameData && (
          <View style={styles.contentContainer}>
            <Title
              text={
                route?.params?.isHirer
                  ? strings.earning.toUpperCase()
                  : strings.payment.toUpperCase()
              }
            />
            <View
              style={{
                marginTop: 20,
                marginBottom: 25,
              }}>
              <MatchFeesCard
                challengeObj={challengeObject}
                senderOrReceiver={
                  route?.params?.isHirer ? 'receiver' : 'sender'
                }
                type="referee"
              />
            </View>
          </View>
        )}
        <Seperator />
        {/* Payment Method */}
        {Number(challengeObject?.hourly_game_fee) > 0 &&
          !route?.params?.isHirer && (
            <View style={styles.contentContainer}>
              <Title text={strings.paymentMethod.toUpperCase()} />
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 15,
                }}>
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
                      comeFrom: 'RefereeBookingDateAndTime',
                    });
                  }}
                />
              </View>
            </View>
          )}
        <Seperator />
        <View style={styles.contentContainer}>
          <Text style={styles.note}>{strings.refereebookingnote}</Text>
        </View>
      </ScrollView>

      <SafeAreaView>
        <TCGradientButton
          isDisabled={!gameData} // || (Number(hourly_game_fee) >= 0 && !route.params.paymentMethod)
          title={strings.doneTitle}
          style={{marginBottom: 15}}
          onPress={handleOnNext}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 25,
    padding: 15,
  },
  titleText: {
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RBold,
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
    marginBottom: 10,

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
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  topTextContainer: {
    marginLeft: 15,
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
  dateTimeValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginLeft: 0,
    marginTop: 0,
  },
  dateTimeText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginBottom: 15,
  },
  timeZoneText: {
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
    marginBottom: 10,
  },
  note: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    // margin: 15,
  },
});

export default RefereeBookingDateAndTime;
