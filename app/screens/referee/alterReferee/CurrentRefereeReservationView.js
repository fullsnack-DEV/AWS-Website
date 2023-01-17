/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unescaped-entities */
import React, {useEffect, useState, useContext} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import _ from 'lodash';

import { format } from 'react-string-format';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
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
import {getGameHomeScreen} from '../../../utils/gameUtils';
import RefereeReservationStatus from '../../../Constants/RefereeReservationStatus';
import TCChallengeTitle from '../../../components/TCChallengeTitle';

let entity = {};

export default function CurruentRefereeReservationView({
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
      teampObj?.status === RefereeReservationStatus.pendingpayment ||
      teampObj?.status === RefereeReservationStatus.pendingrequestpayment
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
          teampObj?.status === RefereeReservationStatus.changeRequest &&
          entity.obj.entity_type === 'team'
        ) {
          teampObj.requested_by = teampObj.initiated_by;
        } else {
          teampObj.requested_by = teampObj.updated_by.group_id;
        }
      } else if (
        teampObj?.automatic_request &&
        teampObj?.status === RefereeReservationStatus.changeRequest &&
        teampObj?.referee?.user_id !== entity.uid
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

    if (teampObj?.requested_by === entity.uid) {
      return 'sender';
    }
    return 'receiver';
  };

  const checkRefereeOrTeam = (reservationObject) => {
    const teampObj = {...reservationObject};
    if (
      teampObj?.status === RefereeReservationStatus.pendingpayment ||
      teampObj?.status === RefereeReservationStatus.pendingrequestpayment
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
          teampObj?.status === RefereeReservationStatus.changeRequest &&
          entity.obj.entity_type === 'team'
        ) {
          teampObj.requested_by = teampObj.initiated_by;
        } else {
          teampObj.requested_by = teampObj.updated_by.group_id;
        }
      } else if (
        teampObj?.automatic_request &&
        teampObj?.status === RefereeReservationStatus.changeRequest &&
        teampObj?.referee?.user_id !== entity.uid
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

    if (entity.uid === teampObj?.referee?.user_id) {
      if (teampObj?.requested_by === entity.uid) {
        return 'referee';
      }
      return 'team';
    }
    if (teampObj?.requested_by === entity.uid) {
      return 'team';
    }
    return 'referee';
  };

  const getEntityName = (reservationObject) => {
    if (reservationObject?.initiated_by === entity.uid) {
      return `${reservationObject?.referee?.first_name} ${reservationObject?.referee?.last_name}`;
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
    if (entity.uid === param?.referee?.user_id) {
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
            }}>
            <View style={styles.challengerView}>
              <View style={styles.teamView}>
                <Image source={images.reqIcon} style={styles.reqOutImage} />
                <Text style={styles.challengerText}>{strings.requester}</Text>
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
                <Text style={styles.challengeeText}>{strings.Referee}</Text>
              </View>

              <View style={styles.teamView}>
                {/* <Image
                    source={
                      bodyParams?.referee?.thumbnail
                        ? { uri: bodyParams?.referee?.thumbnail }
                        : images.teamPlaceholder
                    }
                    style={styles.teamImage}
                  /> */}
                <View style={styles.profileView}>
                  <Image
                    source={
                      bodyParams?.referee?.full_image
                        ? {uri: bodyParams?.referee?.full_image}
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
                  {`${bodyParams?.referee?.first_name} ${bodyParams?.referee?.last_name}`}
                </Text>
              </View>
            </View>
          </View>
          <TCThinDivider />

          {/* status offered */}
          {checkSenderOrReceiver(bodyParams) === 'sender' &&
            bodyParams.status === RefereeReservationStatus.offered && (
              <View>
                {bodyParams.expiry_datetime > new Date().getTime() ? (
                  <Text
                    style={[
                      styles.challengeMessage,
                      {color: colors.googleColor},
                    ]}>
                    {strings.expired}
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.challengeMessage,
                      {color: colors.requestSentColor},
                    ]}>
                    {strings.reservationRequestSent}
                  </Text>
                )}
                {bodyParams.expiry_datetime > new Date().getTime() ? (
                  <Text style={styles.challengeText}>
                    {strings.refReservationReqExpired}
                  </Text>
                ) : (
                  <Text style={styles.challengeText}>
                    {format(strings.teamSentMatchReservation,getEntityName(bodyParams))}
                    <Text style={styles.timeText}>
                      {getDayTimeDifferent(
                        bodyParams?.expiry_datetime * 1000,
                        new Date().getTime(),
                      )}
                      .
                    </Text>
                  </Text>
                )}
              </View>
            )}
          {checkSenderOrReceiver(bodyParams) === 'receiver' &&
            bodyParams.status === RefereeReservationStatus.offered && (
              <View>
                {bodyParams.expiry_datetime > new Date().getTime() ? (
                  <Text
                    style={[
                      styles.challengeMessage,
                      {color: colors.googleColor},
                    ]}>
                    {strings.expired}
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.challengeMessage,
                      {color: colors.requestSentColor},
                    ]}>
                    {strings.reservationRequestPending}
                  </Text>
                )}
                {bodyParams.expiry_datetime > new Date().getTime() ? (
                  <Text style={styles.challengeText}>
                    {format(strings.refereeReservationSentExpired,getEntityName(bodyParams))}
                  </Text>
                ) : (
                  <Text style={styles.challengeText}>
                    {format(strings.refereeReservationRequestResond,getEntityName(bodyParams))}
                    <Text style={styles.timeText}>
                      {getDayTimeDifferent(
                        bodyParams.expiry_datetime * 1000,
                        new Date().getTime(),
                      )}
                      .
                    </Text>
                  </Text>
                )}
              </View>
            )}
          {/* status pending payment */}
          {checkSenderOrReceiver(bodyParams) === 'sender' &&
            bodyParams.status === RefereeReservationStatus.pendingpayment && (
              <View>
                <Text style={styles.challengeMessage}>{strings.reservationAwaitingPayment}</Text>
                <Text style={styles.challengeText}>
                  {format(strings.acceptRefereeReservationPaymentFail,getEntityName(bodyParams))}
                </Text>
                <Text style={styles.pendingRequestText}>
                  {format(strings.refResCancelPaymentNotMade, getDayTimeDifferent(
                    bodyParams.expiry_datetime * 1000,
                    new Date().getTime(),
                  ))}
                </Text>
              </View>
            )}
          {checkSenderOrReceiver(bodyParams) === 'receiver' &&
            bodyParams.status === RefereeReservationStatus.pendingpayment && (
              <View>
                <Text style={styles.challengeMessage}>{strings.reservationAwaitingPayment}</Text>
                <Text style={styles.challengeText}>
                  {format(strings.acceptRefereeReservationPaymentNotGone,getEntityName(bodyParams))}
                </Text>
                <Text style={styles.awatingNotesText}>
                  {format(strings.reservationCancelPaymentNotMade2,getDayTimeDifferent(
                    bodyParams.expiry_datetime * 1000,
                    new Date().getTime(),
                  ))}
                </Text>
              </View>
            )}
          {/* status pending payment */}
          {/* Status accepted */}
          {checkSenderOrReceiver(bodyParams) === 'sender' &&
            (bodyParams.status === RefereeReservationStatus.accepted ||
              bodyParams.status === RefereeReservationStatus.restored ||
              bodyParams.status ===
                RefereeReservationStatus.requestcancelled) && (
                <View>
                  <Text
                  style={[
                    styles.challengeMessage,
                    {color: colors.requestConfirmColor},
                  ]}>
                    {strings.reservationConfirmed}
                  </Text>
                  <Text style={styles.challengeText}>
                    {checkRefereeOrTeam(bodyParams) === 'referee'
                      ? format(strings.confirmRefereeReservation,getEntityName(
                      bodyParams,
                      ))
                      : format(strings.teamConfirmRefereeReservation,getEntityName(
                      bodyParams,
                    ))}
                  </Text>
                </View>
            )}
          {checkSenderOrReceiver(bodyParams) === 'receiver' &&
            (bodyParams.status === RefereeReservationStatus.accepted ||
              bodyParams.status === RefereeReservationStatus.restored ||
              bodyParams.status ===
                RefereeReservationStatus.requestcancelled) && (
                <View>
                  <Text
                  style={[
                    styles.challengeMessage,
                    {color: colors.requestConfirmColor},
                  ]}>
                    {strings.reservationConfirmed}
                  </Text>
                  <Text style={styles.challengeText}>
                    {format(strings.confirmRefereeReservationSent,getEntityName(
                      bodyParams,
                    ))}
                  </Text>
                </View>
            )}
          {/* Status accepted */}
          {/* Status declined */}
          {checkSenderOrReceiver(bodyParams) === 'sender' &&
            bodyParams.status === RefereeReservationStatus.declined && (
              <View>
                <Text
                  style={[
                    styles.challengeMessage,
                    {color: colors.googleColor},
                  ]}>
                  {strings.reservationDeclined}
                </Text>
                <Text style={styles.challengeText}>
                  {checkRefereeOrTeam(bodyParams) === 'referee'
                    ? format(strings.declineRefereeRequest,getEntityName(
                      bodyParams,
                    ))
                    : format(strings.teamDeclineRefereeRequest,getEntityName(
                      bodyParams,
                    ))}
                </Text>
              </View>
            )}
          {checkSenderOrReceiver(bodyParams) === 'receiver' &&
            bodyParams.status === RefereeReservationStatus.declined && (
              <View>
                <Text
                  style={[
                    styles.challengeMessage,
                    {color: colors.googleColor},
                  ]}>
                  {strings.reservationDeclined}
                </Text>
                <Text style={styles.challengeText}>
                  {checkRefereeOrTeam(bodyParams) === 'referee'
                    ? format(strings.declineRefereeRequestTeam,getEntityName(
                        bodyParams,
                      ))
                    : format(strings.declineRefereeRequestYou,getEntityName(
                      bodyParams,
                    ))}
                </Text>
              </View>
            )}
          {/* Status declined */}
          {/* Status cancelled */}
          {checkSenderOrReceiver(bodyParams) === 'sender' &&
            bodyParams.status === RefereeReservationStatus.cancelled && (
              <View>
                <Text
                  style={[
                    styles.challengeMessage,
                    {color: colors.googleColor},
                  ]}>
                  {strings.reservationCancelled2}
                </Text>
                <Text style={styles.challengeText}>              
                  {checkRefereeOrTeam(bodyParams) === 'referee'
                    ? format(strings.cancelledRefereeReservation,getEntityName(
                        bodyParams,
                      ))
                    : format(strings.teamCancelledRefereeReservation,getEntityName(
                      bodyParams,
                    ))}
                </Text>
              </View>
            )}
          {checkSenderOrReceiver(bodyParams) === 'receiver' &&
            bodyParams.status === RefereeReservationStatus.cancelled && (
              <View>
                <Text
                  style={[
                    styles.challengeMessage,
                    {color: colors.googleColor},
                  ]}>
                  {strings.reservationCancelled2}
                </Text>
                <Text style={styles.challengeText}>
                  {checkRefereeOrTeam(bodyParams) === 'referee'
                    ? format(strings.cancelledRefereeReservationTeam,getEntityName(
                      bodyParams,
                    ))
                  : format(strings.cancelledRefereeReservationYou,getEntityName(
                    bodyParams,
                  ))}
                </Text>
              </View>
            )}

          <TCThickDivider marginTop={15} />

          {bodyParams && (
            <View style={{marginBottom: 10}}>
              <TCLabel
                title={strings.match.toUpperCase()}
                style={{marginLeft: 15, marginBottom: 15, marginTop: 25}}
              />
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
                  cardWidth={'92%'}
                />
              )}
              <TCThickDivider marginTop={10} />
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
                            {strings.vancouver}
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
                      style={{marginBottom: 10}}
                    />
                  </View>
                  <Seperator />
                </View>
              )}
            </View>
          )}

          {bodyParams && (
            <View>
              <TCChallengeTitle
                title={strings.matchrules.toUpperCase()}
                titleStyle={{
                  ...styles.titleText,
                }}
              />
              <Text style={styles.rulesTitle}>{strings.gameRulesSubTitle1}</Text>
              <Text style={styles.rulesDetail}>
                {bodyParams?.game?.general_rules}
              </Text>
              <View style={{marginBottom: 10}} />
              <Text style={styles.rulesTitle}>{strings.gameRulesSubTitle2}</Text>
              <Text style={[styles.rulesDetail, {marginBottom: 0}]}>
                {bodyParams?.game?.special_rules}
              </Text>
            </View>
          )}
          <TCThickDivider marginTop={25} />

          {/* Chief or assistant */}
          <View style={styles.contentContainer}>
            <Title text={strings.chieforassistant.toUpperCase()} />
            <View
              style={{
                marginTop: 15,
                marginBottom: 10,
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
                {_.startCase(bodyParams?.chief_referee ? strings.chief : strings.assistant)}{' '}
                {strings.Referee}
              </Text>
            </View>
          </View>
          <TCThickDivider />
          <TCLabel
            title={
              checkSenderOrReceiver(bodyParams) === 'sender'
                ? strings.payment.toUpperCase()
                : strings.earning.toUpperCase()
            }
            style={{
              marginTop: 25,
              marginBottom: 20,
            }}
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
  challengeMessage: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.themeColor,
    margin: 15,
    marginBottom: 10,
  },
  challengeText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
  },
  // challengeText: {
  //   fontFamily: fonts.RMedium,
  //   fontSize: 23,
  //   color: colors.lightBlackColor,
  //   marginLeft: 15,
  //   marginRight: 15,
  //   marginBottom: 15,
  // },
  timeText: {
    color: colors.themeColor,
  },
  awatingNotesText: {
    color: colors.userPostTimeColor,
    marginRight: 15,
    marginLeft: 15,
    marginBottom: 15,
  },
  pendingRequestText: {
    color: colors.userPostTimeColor,
    marginLeft: 15,
    marginRight: 15,
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
});
