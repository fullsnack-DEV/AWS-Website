/* eslint-disable consistent-return */
import React, { memo, useContext } from 'react';
import {
 StyleSheet, View, Text, Image, TouchableOpacity,
 } from 'react-native';
import moment from 'moment';
import AuthContext from '../../auth/context';

import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import ReservationStatus from '../../Constants/ReservationStatus';
import ChallengeStatusTitle from '../challenge/ChallengeStatusTitle';
import images from '../../Constants/ImagePath';
import RefereeReservationStatus from '../../Constants/RefereeReservationStatus';
import ScorekeeperReservationStatus from '../../Constants/ScorekeeperReservationStatus';
import RefereeReservationTitle from './RefereeReservationTitle';

let entity = {};
function ReservationStatusView({ data, onClick }) {
  const authContext = useContext(AuthContext);
  entity = authContext.entity;

  const getDate = () => data?.start_datetime * 1000;

  const checkSenderOrReceiver = (challengeObj) => {
    console.log('sender & receiver Obj', challengeObj);

    if (
      challengeObj?.status === ReservationStatus.pendingpayment
      || challengeObj?.status === ReservationStatus.pendingrequestpayment
    ) {
      if (challengeObj?.requested_by === entity.uid) {
        return 'sender';
      }
      return 'receiver';
    }
    if (
      challengeObj?.status === ReservationStatus.requestcancelled
      || challengeObj?.status === ReservationStatus.cancelled
    ) {
      if (challengeObj?.requested_by === entity.uid) {
        return 'sender';
      }
      return 'receiver';
    }
    if (challengeObj?.status === ReservationStatus.offered) {
      if (challengeObj?.requested_by === entity.uid) {
        return 'sender';
      }
      return 'receiver';
    }
    if (challengeObj?.status === ReservationStatus.changeRequest) {
      if (challengeObj?.requested_by === entity.uid) {
        console.log('status:=>', challengeObj?.requested_by + entity.uid);

        return 'sender';
      }
      return 'receiver';
    }
    if (challengeObj?.status === ReservationStatus.accepted) {
      if (challengeObj?.requested_by === entity.uid) {
        return 'sender';
      }
      return 'receiver';
    }
    if (challengeObj?.status === ReservationStatus.declined) {
      if (challengeObj?.requested_by === entity.uid) {
        return 'sender';
      }
      return 'receiver';
    }
    if (challengeObj?.status === ReservationStatus.restored) {
      if (challengeObj?.requested_to === entity.uid) {
        return 'sender';
      }
      return 'receiver';
    }
    if (challengeObj?.updated_by?.group_id === entity.uid) {
      return 'sender';
    }
    return 'receiver';
  };

  const checkSenderOrReceiverReferee = (reservationObj) => {
    console.log('checkSenderOrReceiverReferee', reservationObj);
    const teampObj = { ...reservationObj };
    if (
      teampObj?.status === RefereeReservationStatus.pendingpayment
      || teampObj?.status === RefereeReservationStatus.pendingrequestpayment
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
          teampObj?.automatic_request
          && teampObj?.status === RefereeReservationStatus.changeRequest
          && entity?.obj?.entity_type === 'team'
        ) {
          teampObj.requested_by = teampObj.initiated_by;
        } else {
          teampObj.requested_by = teampObj.updated_by.group_id;
        }
      } else if (
        teampObj?.automatic_request
        && teampObj?.status === RefereeReservationStatus.changeRequest
        && teampObj?.referee?.user_id !== entity.uid
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

  const checkSenderOrReceiverScorekeeper = (reservationObj) => {
    const teampObj = { ...reservationObj };
    if (
      teampObj?.status === ScorekeeperReservationStatus.pendingpayment
      || teampObj?.status === ScorekeeperReservationStatus.pendingrequestpayment
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
          teampObj?.automatic_request
          && teampObj?.status === ScorekeeperReservationStatus.changeRequest
          && entity?.obj?.entity_type === 'team'
        ) {
          teampObj.requested_by = teampObj.initiated_by;
        } else {
          teampObj.requested_by = teampObj.updated_by.group_id;
        }
      } else if (
        teampObj?.automatic_request
        && teampObj?.status === ScorekeeperReservationStatus.changeRequest
        && teampObj?.referee?.user_id !== entity.uid
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

  return (
    <View style={styles.reservationTitleView}>
      <View>
        <Text
          style={{
            fontFamily: fonts.RMedium,
            fontSize: 12,
            color: colors.lightBlackColor,
            textAlign: 'center',
          }}>
          {moment(getDate()).format('MMM')}
        </Text>
        <Text
          style={{
            fontFamily: fonts.RMedium,
            fontSize: 25,
            color: colors.lightBlackColor,
            textAlign: 'center',
          }}>
          {moment(getDate()).format('DD')}
        </Text>
      </View>

      <TouchableOpacity style={{ marginLeft: 15 }} onPress={onClick}>
        {/* <Text style={[styles.reservationText, { color: getReservationStatus().color }]}>
          {getReservationStatus().status}
        </Text> */}
        {data?.referee ? (
          <RefereeReservationTitle reservationObject={data} showDesc={false} fontSize={16} containerStyle={{ margin: 0 }}/>
        ) : (
          <ChallengeStatusTitle
            challengeObj={data}
            isSender={
              (data?.referee_id
                && checkSenderOrReceiverReferee(data) === 'sender')
              || (data?.scorekeeper_id
                && checkSenderOrReceiverScorekeeper(data) === 'sender')
              || (!data?.referee_id
                && !data?.scorekeeper_id
                && checkSenderOrReceiver(data) === 'sender')
            }
            // isTeam={!!data?.home_team?.group_name}
            teamName={data}
            // receiverName={challengee?.full_name ?? challengee?.group_name}
            offerExpiry={
              ReservationStatus.offered === 'offered'
              || ReservationStatus.offered === 'changeRequest'
                ? new Date().getTime()
                : ''
            } // only if status offered
            status={data?.status}
          />
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {!data?.referee_id && !data?.scorekeeper_id && (
            <Text style={styles.matchText}>Match · {data.sport}</Text>
          )}
          {data?.referee_id && (
            <Text style={styles.matchText}>Referee · {data.game.sport}</Text>
          )}
          {data?.scorekeeper_id && (
            <Text style={styles.matchText}>
              Scorekeeper · {data.game.sport}
            </Text>
          )}
          <Image
            source={images.nextArrow}
            style={{ height: 12, width: 8, marginLeft: 10 }}
          />
        </View>
      </TouchableOpacity>
      <View style={styles.amountView}>
        <Text style={styles.amountText}>${data.total_game_fee ?? 0} CAD</Text>
        {/* <Text style={styles.cancelAmountText}>$35 CAD</Text> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  amountText: {
    color: colors.reservationAmountColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
    textAlign: 'right',
  },
  amountView: {
    // marginTop: 10,
    position: 'absolute',
    right: 10,
  },

  matchText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 20,
  },

  reservationTitleView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
});
export default memo(ReservationStatusView);
