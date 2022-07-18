/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, {useEffect, useState, useContext} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import _ from 'lodash';

import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import AuthContext from '../../../auth/context';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCThickDivider from '../../../components/TCThickDivider';
import images from '../../../Constants/ImagePath';
import TCLabel from '../../../components/TCLabel';
import TCThinDivider from '../../../components/TCThinDivider';
import TCInfoField from '../../../components/TCInfoField';
import EventMapView from '../../../components/Schedule/EventMapView';

import MatchFeesCard from '../../../components/challenge/MatchFeesCard';
import ReservationNumber from '../../../components/reservations/ReservationNumber';
import TCGameCard from '../../../components/TCGameCard';
import {
  getGameFromToDateDiff,
  getGameHomeScreen,
} from '../../../utils/gameUtils';
import ScorekeeperReservationStatus from '../../../Constants/ScorekeeperReservationStatus';
import TCChallengeTitle from '../../../components/TCChallengeTitle';
import ScorekeeperReservationTitle from '../../../components/reservations/ScorekeeperReservationTitle';

let entity = {};

export default function CurruentScorekeeperReservationView({
  reservationObj,
  navigation,
}) {
  const authContext = useContext(AuthContext);

  const isFocused = useIsFocused();
  const [bodyParams, setbodyParams] = useState();

  useEffect(() => {
    entity = authContext.entity;
    setbodyParams(reservationObj);
    // requester = getRequester()
  }, [isFocused]);

  const getDayTimeDifferent = (sDate, eDate) => {
    let delta =
      Math.abs(new Date(sDate).getTime() - new Date(eDate).getTime()) / 1000;

    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    return `${days}d ${hours}h ${minutes}m`;
  };
  const checkSenderOrReceiver = (reservationObject) => {
    const teampObj = {...reservationObject};
    if (
      teampObj?.status === ScorekeeperReservationStatus.pendingpayment ||
      teampObj?.status === ScorekeeperReservationStatus.pendingrequestpayment
    ) {
      if (teampObj?.updated_by) {
        if (teampObj?.updated_by?.group_id) {
          teampObj.requested_by = teampObj.updated_by.group_id;
        } else {
          teampObj.requested_by = teampObj.updated_by.uid;
        }
      } else if (teampObj?.created_by?.group_id) {
        teampObj.requested_by = teampObj.created_by.group_id;
      } else {
        teampObj.requested_by = teampObj.created_by.uid;
      }
    } else if (teampObj?.updated_by) {
      if (teampObj?.updated_by?.group_id) {
        if (
          teampObj?.automatic_request &&
          teampObj?.status === ScorekeeperReservationStatus.changeRequest &&
          entity.obj.entity_type === 'team'
        ) {
          teampObj.requested_by = teampObj.initiated_by;
        } else {
          teampObj.requested_by = teampObj.updated_by.group_id;
        }
      } else if (
        teampObj?.automatic_request &&
        teampObj?.status === ScorekeeperReservationStatus.changeRequest &&
        teampObj?.scorekeeper?.user_id !== entity.uid
      ) {
        teampObj.requested_by = teampObj.initiated_by;
      } else {
        teampObj.requested_by = teampObj.updated_by.uid;
      }
    } else if (teampObj?.created_by?.group_id) {
      teampObj.requested_by = teampObj.created_by.group_id;
    } else {
      teampObj.requested_by = teampObj.created_by.uid;
    }

    console.log('Temp Object::', teampObj);
    console.log(`${teampObj?.requested_by}:::${entity.uid}`);
    if (teampObj?.requested_by === entity.uid) {
      return 'sender';
    }
    return 'receiver';
  };

  const checkScorekeeperOrTeam = (reservationObject) => {
    const teampObj = {...reservationObject};
    if (
      teampObj?.status === ScorekeeperReservationStatus.pendingpayment ||
      teampObj?.status === ScorekeeperReservationStatus.pendingrequestpayment
    ) {
      if (teampObj?.updated_by) {
        if (teampObj?.updated_by?.group_id) {
          teampObj.requested_by = teampObj.updated_by.group_id;
        } else {
          teampObj.requested_by = teampObj.updated_by.uid;
        }
      } else if (teampObj?.created_by?.group_id) {
        teampObj.requested_by = teampObj.created_by.group_id;
      } else {
        teampObj.requested_by = teampObj.created_by.uid;
      }
    } else if (teampObj?.updated_by) {
      if (teampObj?.updated_by?.group_id) {
        if (
          teampObj?.automatic_request &&
          teampObj?.status === ScorekeeperReservationStatus.changeRequest &&
          entity.obj.entity_type === 'team'
        ) {
          teampObj.requested_by = teampObj.initiated_by;
        } else {
          teampObj.requested_by = teampObj.updated_by.group_id;
        }
      } else if (
        teampObj?.automatic_request &&
        teampObj?.status === ScorekeeperReservationStatus.changeRequest &&
        teampObj?.scorekeeper?.user_id !== entity.uid
      ) {
        teampObj.requested_by = teampObj.initiated_by;
      } else {
        teampObj.requested_by = teampObj.updated_by.uid;
      }
    } else if (teampObj?.created_by?.group_id) {
      teampObj.requested_by = teampObj.created_by.group_id;
    } else {
      teampObj.requested_by = teampObj.created_by.uid;
    }

    console.log('Temp Object::', teampObj);
    console.log(`${teampObj?.requested_by}:::${entity.uid}`);
    if (entity.uid === teampObj?.scorekeeper?.user_id) {
      if (teampObj?.requested_by === entity.uid) {
        return 'scorekeeper';
      }
      return 'team';
    }
    if (teampObj?.requested_by === entity.uid) {
      return 'team';
    }
    return 'scorekeeper';
  };

  const getEntityName = (reservationObject) => {
    if (reservationObject?.initiated_by === entity.uid) {
      return `${reservationObject?.scorekeeper?.first_name} ${reservationObject?.scorekeeper?.last_name}`;
    }
    if (!reservationObject?.game?.user_challenge) {
      if (
        reservationObject?.initiated_by ===
        reservationObject?.game?.home_team?.group_id
      ) {
        return `${reservationObject?.game?.home_team.group_name}`;
      }
      return `${reservationObject?.game?.away_team.group_name}`;
    }
    console.log('user challenge');
    if (
      reservationObject?.initiated_by ===
      reservationObject?.game?.home_team?.user_id
    ) {
      return `${reservationObject?.game?.home_team.first_name} ${reservationObject?.game?.home_team.last_name}`;
    }
    return `${reservationObject?.game?.away_team.first_name} ${reservationObject?.game?.away_team.last_name}`;
  };

  const Title = ({text, required}) => (
    <Text style={styles.titleText}>
      {text}
      {required && <Text style={{color: colors.redDelColor}}> * </Text>}
    </Text>
  );

  const getDateDuration = (fromData, toDate) => {
    const startDate = moment(fromData * 1000).format('hh:mm a');
    const endDate = moment(toDate * 1000).format('hh:mm a');
    const duration = getGameFromToDateDiff(fromData, toDate);
    return `${startDate} - ${endDate} (${duration})`;
  };

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

  const getRequester = (param) => {
    if (entity.uid === param?.scorekeeper?.user_id) {
      if (
        param?.initiated_by ===
        (param?.game?.home_team?.group_id || param?.game?.home_team?.user_id)
      ) {
        return param?.game?.home_team;
      }
      return param?.game?.away_team;
    }
    if (
      entity.uid ===
      (param?.game?.home_team?.group_id || param?.game?.home_team?.user_id)
    ) {
      return param?.game?.home_team;
    }
    return param?.game?.away_team;
  };

  return (
    <TCKeyboardView>
      {bodyParams && (
        <View style={{marginBottom: 20}}>
          <ReservationNumber reservationNumber={bodyParams.reservation_id} />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 15,
            }}
          >
            <View style={styles.challengerView}>
              <View style={styles.teamView}>
                <Image source={images.reqIcon} style={styles.reqOutImage} />
                <Text style={styles.challengerText}>Requester</Text>
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
            <View style={styles.challengeeView}>
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
                  }}
                >
                  {`${bodyParams?.scorekeeper?.first_name} ${bodyParams?.scorekeeper?.last_name}`}
                </Text>
              </View>
            </View>
          </View>
          <TCThinDivider />

          <ScorekeeperReservationTitle
            reservationObject={bodyParams}
            showDesc={true}
            containerStyle={{margin: 15}}
          />

          <TCThickDivider marginTop={15} />

          {bodyParams && (
            <View>
              <TCLabel title="Game" />
              {bodyParams?.game && (
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
                  cardWidth={'96%'}
                />
              )}
              {/* Date & Time */}
              {bodyParams?.game && (
                <View>
                  <View style={styles.contentContainer}>
                    <Title text={'Date & Time'} />
                    <TCInfoField
                      title={'Date'}
                      value={
                        bodyParams?.start_datetime &&
                        moment(bodyParams?.start_datetime * 1000).format(
                          'MMM DD, YYYY',
                        )
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
                        bodyParams?.start_datetime && bodyParams?.end_datetime
                          ? getDateDuration(
                              bodyParams?.start_datetime,
                              bodyParams?.end_datetime,
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
                      value={bodyParams?.game?.venue?.name}
                      titleStyle={{
                        alignSelf: 'flex-start',
                        fontFamily: fonts.RRegular,
                      }}
                    />
                    <TCInfoField
                      title={'Address'}
                      value={bodyParams?.game?.venue?.address}
                      titleStyle={{
                        alignSelf: 'flex-start',
                        fontFamily: fonts.RRegular,
                      }}
                    />
                    <EventMapView
                      coordinate={{
                        latitude:
                          bodyParams?.game?.venue?.coordinate?.latitude ?? 0.0,
                        longitude:
                          bodyParams?.game?.venue?.coordinate?.longitude ?? 0.0,
                      }}
                      region={{
                        latitude:
                          bodyParams?.game?.venue?.coordinate?.latitude ?? 0.0,
                        longitude:
                          bodyParams?.game?.venue?.coordinate?.longitude ?? 0.0,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }}
                    />
                  </View>
                </View>
              )}
            </View>
          )}

          {bodyParams && (
            <View>
              <TCChallengeTitle title={'Game Rules'} />
              <Text style={styles.rulesTitle}>General Rules</Text>
              <Text style={styles.rulesDetail}>
                {bodyParams?.game?.general_rules}
              </Text>
              <View style={{marginBottom: 10}} />
              <Text style={styles.rulesTitle}>Special Rules</Text>
              <Text style={[styles.rulesDetail, {marginBottom: 10}]}>
                {bodyParams?.game?.special_rules}
              </Text>
            </View>
          )}
          <TCThickDivider marginTop={20} />

          <TCLabel
            title={
              checkSenderOrReceiver(bodyParams) === 'sender'
                ? 'Payment'
                : 'Earning'
            }
          />

          <MatchFeesCard
            challengeObj={{
              ...bodyParams,
              start_datetime: bodyParams.start_datetime * 1000,
              end_datetime: bodyParams.end_datetime * 1000,
            }}
            senderOrReceiver={
              checkSenderOrReceiver(bodyParams) === 'sender'
                ? 'sender'
                : 'receiver'
            }
          />
        </View>
      )}
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  teamView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  reqOutImage: {
    width: 25,
    height: 25,
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
