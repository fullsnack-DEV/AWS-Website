/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable consistent-return */
/* eslint-disable react/no-unescaped-entities */
import React, {useEffect, useState, useContext, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import {acceptDeclineReservation} from '../../api/Challenge';

import ActivityLoader from '../../components/loader/ActivityLoader';
import {strings} from '../../../Localization/translation';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import AuthContext from '../../auth/context';
import TCGradientButton from '../../components/TCGradientButton';
import TCKeyboardView from '../../components/TCKeyboardView';
import TCThickDivider from '../../components/TCThickDivider';
import images from '../../Constants/ImagePath';
import TCLabel from '../../components/TCLabel';
import TCInfoField from '../../components/TCInfoField';
import EventMapView from '../../components/Schedule/EventMapView';
import TCGameCard from '../../components/TCGameCard';
import {getGameHomeScreen} from '../../utils/gameUtils';
import TCChallengeTitle from '../../components/TCChallengeTitle';
import ScorekeeperReservationStatus from '../../Constants/ScorekeeperReservationStatus';

let entity = {};

export default function ScorekeeperApprovalScreen({navigation, route}) {
  const authContext = useContext(AuthContext);

  const isFocused = useIsFocused();
  const [loading, setloading] = useState(false);
  const [bodyParams, setbodyParams] = useState();
  const {reservationObj, type} = route.params ?? {};

  useEffect(() => {
    entity = authContext.entity;
    setbodyParams(reservationObj);
  }, [isFocused]);
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     title: getNavigationTitle(),
  //   });
  // }, [navigation, bodyParams]);

  // const getNavigationTitle = () => {
  //   if (
  //     bodyParams?.status === ScorekeeperReservationStatus.offered
  //     || bodyParams?.status === ScorekeeperReservationStatus.declined
  //   ) {
  //     return strings.scorekeeperRequestScreenTitle;
  //   }
  //   return strings.scorekeeperScreenTitle;
  // };

  const approveReservation = (reservationID) => {
    setloading(true);
    acceptDeclineReservation(
      'scorekeepers',
      reservationID,
      authContext.entity.uid,
      reservationObj.version,
      type,
      {},
      authContext,
    )
      .then((response) => {
        setloading(false);
        console.log('Scorekeeper approve request :=>', response);
        navigation.goBack();
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const disApproveReservation = (reservationID) => {
    setloading(true);
    acceptDeclineReservation(
      'scorekeepers',
      reservationID,
      authContext.entity.uid,
      reservationObj.version,
      'decline',
      {},
      authContext,
    )
      .then((response) => {
        setloading(false);
        console.log('Scorekeeper disapprove request :=>', response);
        navigation.goBack();
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

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

  const getRequester = useCallback((param) => {
    if (
      entity.uid === param?.game?.home_team?.group_id ||
      entity.uid === param?.game?.home_team?.user_id
    ) {
      return param?.game?.away_team;
    }
    return param?.game?.home_team;
  }, []);
  const approveDisapproveButton = () => (
    <View>
      <TCGradientButton
        title={strings.approveTitle}
        textColor={colors.grayColor}
        textStyle={{fontSize: 16}}
        startGradientColor={colors.yellowColor}
        endGradientColor={colors.themeColor}
        height={40}
        shadow={true}
        marginTop={15}
        onPress={() => {
          approveReservation(reservationObj.reservation_id);
          // Alert.alert(
          //   'Please modify atleast one field for alter request.',
          // );
        }}
      />
      <Text
        style={{
          margin: 15,
          fontSize: 16,
          fontFamily: fonts.RBold,
          color: colors.lightBlackColor,
          textAlign: 'center',
          textDecorationLine: 'underline',
        }}
        onPress={() => {
          disApproveReservation(reservationObj.reservation_id);
        }}>
        {'DISAPPROVE'}
      </Text>
    </View>
  );
  console.log('Scorekeeper bodyparams:', bodyParams);
  return (
    <TCKeyboardView>
      <ActivityLoader visible={loading} />
      <ScrollView style={{flex: 1}}>
        {bodyParams && (
          <View>
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.RRegular,
                color: colors.lightBlackColor,
                margin: 15,
              }}>
              {`${
                getRequester(bodyParams).group_id
                  ? `${getRequester(bodyParams).group_name}`
                  : `${getRequester(bodyParams).first_name} ${
                      getRequester(bodyParams).last_name
                    }`
              } wants to hire a scorekeeper for a game between you and them at their own cost. Would you like to approve this scorekeeper for the game?`}
            </Text>
            <View
              style={{
                flex: 1,
                // flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 15,
              }}>
              <View style={styles.challengerView}>
                <View style={styles.teamView}>
                  <Image source={images.reqIcon} style={styles.reqOutImage} />
                  <Text style={styles.challengerText}>Hiring Team</Text>
                </View>

                <View style={styles.teamView}>
                  <View style={styles.profileView}>
                    <Image
                      source={
                        getRequester(bodyParams).thumbnail
                          ? {uri: getRequester(bodyParams).thumbnail}
                          : images.teamPlaceholder
                      }
                      style={styles.profileImage}
                    />
                  </View>
                  <Text style={styles.teamNameText}>
                    {getRequester(bodyParams).group_id
                      ? `${getRequester(bodyParams).group_name}`
                      : `${getRequester(bodyParams).first_name} ${
                          getRequester(bodyParams).last_name
                        }`}
                  </Text>
                </View>
              </View>
              <View style={[styles.challengeeView, {marginTop: 10}]}>
                <View style={styles.teamView}>
                  <Image source={images.refIcon} style={styles.reqOutImage} />
                  <Text style={styles.challengeeText}>Scorekeeper</Text>
                </View>

                <View style={styles.teamView}>
                  {/* <Image
                       source={
                         bodyParams?.scorekeeper?.thumbnail
                           ? { uri: bodyParams?.scorekeeper?.thumbnail }
                           : images.teamPlaceholder
                       }
                       style={styles.teamImage}
                     /> */}
                  <View style={styles.profileView}>
                    <Image
                      source={
                        bodyParams?.scorekeeper?.full_image
                          ? {uri: bodyParams?.scorekeeper?.full_image}
                          : images.profilePlaceHolder
                      }
                      style={styles.profileImage}
                    />
                  </View>
                  <Text
                    style={{
                      marginLeft: 5,
                      fontFamily: fonts.RMedium,
                      fontSize: 16,
                      color: colors.lightBlackColor,
                      width: '80%',
                    }}>
                    {`${bodyParams?.scorekeeper?.first_name} ${bodyParams?.scorekeeper?.last_name}`}
                  </Text>
                </View>
              </View>
            </View>

            {type === ScorekeeperReservationStatus.accepted && (
              <Text
                style={{
                  marginLeft: 15,
                  marginBottom: 15,
                  fontFamily: fonts.RMedium,
                  fontSize: 16,
                  color: colors.greenColorCard,
                }}>
                {'Approved'}
              </Text>
            )}
            {type === ScorekeeperReservationStatus.declined && (
              <Text
                style={{
                  marginLeft: 15,
                  marginBottom: 15,
                  fontFamily: fonts.RMedium,
                  fontSize: 16,
                  color: colors.lightBlackColor,
                }}>
                {'Declined'}
              </Text>
            )}
            {type === 'expired' && (
              <Text
                style={{
                  marginLeft: 15,
                  marginBottom: 15,
                  fontFamily: fonts.RMedium,
                  fontSize: 16,
                  color: colors.greenColorCard,
                }}>
                {'Expired'}
              </Text>
            )}

            {type === 'accept' || type === 'approve'
              ? approveDisapproveButton()
              : null}
            <TCThickDivider />

            {bodyParams && (
              <View>
                <TCLabel
                  title={strings.match.toUpperCase()}
                  style={{marginLeft: 15, marginBottom: 15, marginTop: 25}}
                />
                {bodyParams?.game && (
                  <View
                    style={{
                      marginBottom: 10,
                    }}>
                    <TCGameCard
                      data={bodyParams?.game}
                      onPress={() => {
                        const routeName = getGameHomeScreen(
                          bodyParams?.game?.sport,
                        );
                        navigation.push(routeName, {
                          gameId: bodyParams?.game?.game_id,
                        });
                      }}
                      cardWidth={'92%'}
                    />
                  </View>
                )}
                <Seperator />
                {/* Date & Time */}
                {bodyParams?.game && (
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
                            {bodyParams?.start_datetime &&
                              moment(bodyParams?.start_datetime * 1000).format(
                                'MMM DD, YYYY\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0hh:mm a',
                              )}
                          </Text>
                        </View>
                        <View style={styles.dateTimeValue}>
                          <Text style={styles.dateTimeText}>
                            {strings.end.toUpperCase()}{' '}
                          </Text>
                          <Text style={styles.dateTimeText}>
                            {bodyParams?.end_datetime &&
                              moment(bodyParams?.end_datetime * 1000).format(
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
                            <Text style={{fontFamily: fonts.RRegular}}>
                              Vancouver
                            </Text>
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
                        value={bodyParams?.game?.venue?.name}
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
                        value={bodyParams?.game?.venue?.address}
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
                        coordinate={{
                          latitude:
                            bodyParams?.game?.venue?.coordinate?.latitude ??
                            0.0,
                          longitude:
                            bodyParams?.game?.venue?.coordinate?.longitude ??
                            0.0,
                        }}
                        region={{
                          latitude:
                            bodyParams?.game?.venue?.coordinate?.latitude ??
                            0.0,
                          longitude:
                            bodyParams?.game?.venue?.coordinate?.longitude ??
                            0.0,
                          latitudeDelta: 0.0922,
                          longitudeDelta: 0.0421,
                        }}
                        style={{marginBottom: 10}}
                      />
                    </View>
                    <Seperator />
                  </View>
                )}
              </View>
            )}
            <TCChallengeTitle
              title={strings.matchrules.toUpperCase()}
              titleStyle={{
                ...styles.titleText,
                marginTop: 10,
              }}
            />
            <Text style={styles.rulesTitle}>General Rules</Text>
            <Text style={styles.rulesDetail}>
              {bodyParams?.game?.general_rules}
            </Text>
            <View style={{marginBottom: 10}} />
            <Text style={styles.rulesTitle}>Special Rules</Text>
            <Text style={[styles.rulesDetail, {marginBottom: 25}]}>
              {bodyParams?.game?.special_rules}
            </Text>
            <TCThickDivider />

            <SafeAreaView>
              {type === 'accept' || type === 'approved'
                ? approveDisapproveButton()
                : null}
            </SafeAreaView>
          </View>
        )}
      </ScrollView>
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  teamView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  reqOutImage: {
    width: 20,
    height: 20,
    resizeMode: 'cover',
  },
  challengeeText: {
    marginLeft: 5,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  challengerText: {
    marginLeft: 5,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.lightBlackColor,
  },

  teamNameText: {
    marginLeft: 5,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
    width: '80%',
  },
  challengerView: {
    marginRight: 15,
    flex: 0.5,
  },
  challengeeView: {
    flex: 0.5,
  },

  contentContainer: {
    padding: 15,
    paddingTop: 25,
  },
  titleText: {
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RBold,
  },
  profileImage: {
    alignSelf: 'center',
    height: 23,
    width: 23,
    borderRadius: 46,
  },

  profileView: {
    backgroundColor: colors.whiteColor,
    height: 25,
    width: 25,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: colors.redcolor,
  },
});
