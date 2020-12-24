import React, { useContext, useEffect } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment'
import AuthContext from '../../auth/context';

import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'
import RefereeReservationStatus from '../../Constants/RefereeReservationStatus';
import ReservationStatus from '../../Constants/ReservationStatus';
import strings from '../../Constants/String';

let entity = {};
export default function ReservationStatusView({ data }) {
  const authContext = useContext(AuthContext);
  useEffect(() => {
    entity = authContext.entity;
  }, [])
  const getReservationStatus = () => {
    if (data.responsible_to_secure_venue) {
      if (data.status === ReservationStatus.offered) {
        if ((data.offer_expiry < new Date().getTime() / 1000) || (data.start_datetime < new Date().getTime() / 1000)) {
          return { status: strings.responsetimeexpired, color: colors.userPostTimeColor }
        }
        if (data.invited_by === entity.uid) {
          return { status: strings.reservationRequestSent, color: colors.darkOrangColor }
        }
        return { status: strings.reservationRequestPending, color: colors.darkOrangColor }
      }
      if (data.status === ReservationStatus.accepted) {
        return { status: strings.reservationConfirmed, color: colors.requestConfirmColor }
      }
      if (data.status === ReservationStatus.declined) {
        return { status: strings.reservationDeclined, color: colors.googleColor }
      }
      if (data.status === ReservationStatus.changeRequest) {
        if ((data.offer_expiry < new Date().getTime() / 1000) || (data.start_datetime < new Date().getTime() / 1000)) {
          return { status: strings.responsetimeexpired, color: colors.userPostTimeColor }
        }
        if (data.userChallenge) {
          if (data.updated_by.uid === entity.uid) {
            return { status: strings.alterationRequestSent, color: colors.darkOrangColor }
          }
          return { status: strings.alterationRequestPending, color: colors.darkOrangColor }
        }

        if (data.updated_by.group_id === entity.uid) {
          return { status: strings.alterationRequestSent, color: colors.darkOrangColor }
        }
        return { status: strings.alterationRequestPending, color: colors.darkOrangColor }
      }
      if (data.status === ReservationStatus.cancelled) {
        return { status: strings.reservationCancelled, color: colors.userPostTimeColor }
      }
      if (data.status === ReservationStatus.restored) {
        return { status: strings.reservationRestored, color: colors.darkOrangColor }
      }
      if (data.status === ReservationStatus.pendingpayment || data.status === ReservationStatus.pendingrequestpayment) {
        return { status: strings.reservationAwaitingPayment, color: colors.darkOrangColor }
      }
    } else if (data.referee) {
      if (data.status === RefereeReservationStatus.offered) {
        if ((data.expiry_datetime < new Date().getTime() / 1000) || (data.game.start_datetime < new Date().getTime() / 1000)) {
          return { status: strings.responsetimeexpired, color: colors.userPostTimeColor }
        }
        if (data.initiated_by === entity.uid) {
          return { status: strings.reservationRequestSent, color: colors.darkOrangColor }
        }
        return { status: strings.reservationRequestPending, color: colors.darkOrangColor }
      }
      if (data.status === RefereeReservationStatus.accepted || data.status === RefereeReservationStatus.confirmed) {
        return { status: strings.reservationConfirmed, color: colors.requestConfirmColor }
      }
      if (data.status === RefereeReservationStatus.declined) {
        return { status: strings.reservationDeclined, color: colors.googleColor }
      }
      if (data.status === RefereeReservationStatus.changeRequest) {
        if ((data.expiry_datetime < new Date().getTime() / 1000) || (data.game.start_datetime < new Date().getTime() / 1000)) {
          return { status: strings.responsetimeexpired, color: colors.userPostTimeColor }
        }
        if (data.referee.user_id === entity.uid) {
          if (data?.updated_by?.uid === entity.uid) {
            return { status: strings.alterationRequestSent, color: colors.darkOrangColor }
          }
          return { status: strings.alterationRequestPending, color: colors.darkOrangColor }
        }

        if (data.game.singlePlayerGame) {
          if (data?.updated_by?.uid === entity.uid) {
            return { status: strings.alterationRequestSent, color: colors.darkOrangColor }
          }
          return { status: strings.alterationRequestPending, color: colors.darkOrangColor }
        }

        if (data.updated_by.group_id === entity.uid) {
          return { status: strings.alterationRequestSent, color: colors.darkOrangColor }
        }
        return { status: strings.alterationRequestPending, color: colors.darkOrangColor }
      }
      if (data.status === RefereeReservationStatus.cancelled) {
        return { status: strings.reservationCancelled, color: colors.userPostTimeColor }
      }
      if (data.status === RefereeReservationStatus.restored) {
        return { status: strings.reservationRestored, color: colors.darkOrangColor }
      }
      if (data.status === RefereeReservationStatus.pendingpayment || data.status === RefereeReservationStatus.pendingrequestpayment) {
        return { status: strings.reservationAwaitingPayment, color: colors.darkOrangColor }
      }
      if (data.status === RefereeReservationStatus.requestcancelled) {
        return { status: strings.alterationRequestCancelled, color: colors.userPostTimeColor }
      }
    } else if (data.scorekeeper) {
      if (data.status === RefereeReservationStatus.offered) {
        if ((data.expiry_datetime < new Date().getTime() / 1000) || (data.game.start_datetime < new Date().getTime() / 1000)) {
          return { status: strings.responsetimeexpired, color: colors.userPostTimeColor }
        }
        if (data.initiated_by === entity.uid) {
          return { status: strings.reservationRequestSent, color: colors.darkOrangColor }
        }
        return { status: strings.reservationRequestPending, color: colors.darkOrangColor }
      }
      if (data.status === RefereeReservationStatus.accepted || data.status === RefereeReservationStatus.confirmed) {
        return { status: strings.reservationConfirmed, color: colors.requestConfirmColor }
      }
      if (data.status === RefereeReservationStatus.declined) {
        return { status: strings.reservationDeclined, color: colors.googleColor }
      }
      if (data.status === RefereeReservationStatus.changeRequest) {
        if ((data.expiry_datetime < new Date().getTime() / 1000) || (data.game.start_datetime < new Date().getTime() / 1000)) {
          return { status: strings.responsetimeexpired, color: colors.userPostTimeColor }
        }
        if (data.scorekeeper.user_id === entity.uid) {
          if (data?.updated_by?.uid === entity.uid) {
            return { status: strings.alterationRequestSent, color: colors.darkOrangColor }
          }
          return { status: strings.alterationRequestPending, color: colors.darkOrangColor }
        }

        if (data.game.singlePlayerGame) {
          if (data?.updated_by?.uid === entity.uid) {
            return { status: strings.alterationRequestSent, color: colors.darkOrangColor }
          }
          return { status: strings.alterationRequestPending, color: colors.darkOrangColor }
        }

        if (data.updated_by.group_id === entity.uid) {
          return { status: strings.alterationRequestSent, color: colors.darkOrangColor }
        }
        return { status: strings.alterationRequestPending, color: colors.darkOrangColor }
      }
      if (data.status === RefereeReservationStatus.cancelled) {
        return { status: strings.reservationCancelled, color: colors.userPostTimeColor }
      }
      if (data.status === RefereeReservationStatus.restored) {
        return { status: strings.reservationRestored, color: colors.darkOrangColor }
      }
      if (data.status === RefereeReservationStatus.pendingpayment || data.status === RefereeReservationStatus.pendingrequestpayment) {
        return { status: strings.reservationAwaitingPayment, color: colors.darkOrangColor }
      }
      if (data.status === RefereeReservationStatus.requestcancelled) {
        return { status: strings.alterationRequestCancelled, color: colors.userPostTimeColor }
      }
    }
    return ''
  }
  const getDate = () => {
    if (data.game) {
      return `${moment(data.game.start_datetime).format('MMM')}\n${moment(data.game.start_datetime).format('DD')}`
    }
    return `${moment(data.start_datetime).format('MMM')}\n${moment(data.start_datetime).format('DD')}`
  }
  return (

    <View style={styles.reservationTitleView}>
      <TouchableOpacity>
        <LinearGradient
            colors={[colors.yellowColor, colors.themeColor]}
            style={styles.borderView}>
          <View style={styles.dateView}>
            <Text style={styles.dateText}>{getDate()}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
      <View style={styles.reservationTypeView}>
        <Text style={[styles.reservationText, { color: getReservationStatus().color }]}>
          {getReservationStatus().status}
        </Text>

        {data.responsible_to_secure_venue && (
          <Text style={styles.matchText}>Match · {data.sport}</Text>
        )}
        {data.referee && data.game && (
          <Text style={styles.matchText}>Referee · {data.game.sport}</Text>
        )}
        {data.scorekeeper && data.game && (
          <Text style={styles.matchText}>
            Scorekeeper · {data.game.sport}
          </Text>
        )}
      </View>
      <View style={styles.amountView}>
        <Text style={styles.amountText}>${data.total_game_charges} CAD</Text>
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
    marginTop: 10,
    position: 'absolute',
    right: 15,
  },

  borderView: {
    alignItems: 'center',
    borderRadius: 27,
    height: 54,
    justifyContent: 'center',
    marginLeft: 15,
    width: 54,
  },

  // cancelAmountText: {
  //   color: colors.veryLightGray,
  //   fontFamily: fonts.RLight,
  //   fontSize: 14,
  //   textAlign: 'right',
  //   textDecorationLine: 'line-through',
  //   textDecorationStyle: 'solid',
  // },
  dateText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
    textAlign: 'center',
  },
  dateView: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },

  matchText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 20,
  },

  reservationText: {
    fontFamily: fonts.RBold,
    fontSize: 14,
  },
  reservationTitleView: {
    flexDirection: 'row',

  },
  reservationTypeView: {
    alignContent: 'flex-start',
    alignSelf: 'center',
    marginLeft: 10,
  },
});
