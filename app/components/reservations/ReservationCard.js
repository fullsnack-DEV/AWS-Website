import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import moment from 'moment';

import ReservationNumber from './ReservationNumber';
import ReservationStatusView from './ReservationStatusView';
import RefereeReservationStatus from '../../Constants/RefereeReservationStatus';
// import AuthContext from '../../auth/context';
import ReservationStatus from '../../Constants/ReservationStatus';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import RefereeEntityView from './RefereeEntityView';
import ScorekeeperEntityView from './ScorekeeperEntityView';
import TeamEntityView from './TeamEntityView';

export default function ReservationCard({
  data,
  onPressButon = () => {},
  // onPressGameCard = () => {},
}) {
  console.log('reservation data:=>', data);
  //  const authContext = useContext(AuthContext);

  //   const isPendingButtonOrDetailButton = () => {
  //     if (data.game) {
  //       if (data.status === RefereeReservationStatus.offered) {
  //         if (data.expiry_datetime < new Date().getTime() / 1000) {
  //           return false;
  //         }
  //         if (data.initiated_by === authContext.entity.uid) {
  //           return false;
  //         }
  //         return true;
  //       }
  //       if (data.status === RefereeReservationStatus.changeRequest) {
  //         if (data.expiry_datetime < new Date().getTime() / 1000) {
  //           return false;
  //         }
  //         if (data.requested_by === authContext.entity.uid) {
  //           return false;
  //         }
  //         return true;
  //       }
  //       return false;
  //     }
  //     if (data.status === ReservationStatus.offered) {
  //       if (data.offer_expiry < new Date().getTime() / 1000) {
  //         return false;
  //       }
  //       if (data.invited_by === authContext.entity.uid) {
  //         return false;
  //       }
  //       return true;
  //     }
  //     if (data.status === ReservationStatus.changeRequest) {
  //       if (data.offer_expiry < new Date().getTime() / 1000) {
  //         return false;
  //       }
  //       if (data.change_requested_by === authContext.entity.uid) {
  //         return false;
  //       }
  //       return true;
  //     }
  //     return false;
  //   };
  const isOfferExpired = () => {
    if (data.game) {
      if (data.status === RefereeReservationStatus.offered) {
        if (data.expiry_datetime < new Date().getTime() / 1000) {
          return false;
        }
        return true;
      }
      if (data.status === RefereeReservationStatus.changeRequest) {
        if (data.expiry_datetime < new Date().getTime() / 1000) {
          return false;
        }
        return true;
      }
      return false;
    }
    if (data.status === ReservationStatus.offered) {
      if (data.offer_expiry < new Date().getTime() / 1000) {
        return false;
      }
      return true;
    }
    if (data.status === ReservationStatus.changeRequest) {
      if (data.offer_expiry < new Date().getTime() / 1000) {
        return false;
      }
      return true;
    }
    return false;
  };
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

  return (
    <View style={styles.mainViewContainer}>
      <ReservationNumber
        reservationNumber={data?.reservation_id || data?.challenge_id}
      />
      <ReservationStatusView data={data} onClick={onPressButon} />

      {data?.referee_id && <RefereeEntityView data={data} />}
      {data?.scorekeeper_id && <ScorekeeperEntityView data={data} />}
      {!data?.referee_id && !data?.scorekeeper_id && (
        <TeamEntityView data={data} />
      )}

      <View style={styles.timeView}>
        <Text style={[styles.timeLocationText, {marginLeft: 10, flex: 0.5}]}>
          {moment(new Date(data?.start_datetime * 1000)).format('hh:mm a')} -{' '}
          {moment(new Date(data?.end_datetime * 1000)).format('hh:mm a')}
        </Text>
        <Text
          style={[
            styles.timeLocationText,
            {marginRight: 5, marginLeft: 5, color: colors.lightgrayColor},
          ]}>
          |
        </Text>
        <Text
          style={[styles.timeLocationText, {marginRight: 0, flex: 0.5}]}
          numberOfLines={1}>
          {data?.game?.city ?? data?.city}
        </Text>
      </View>
      {/* {isPendingButtonOrDetailButton() ? (
        <ReservationPendingButton onPressButon={onPressButon} />
      ) : (
        <ReservationDetailButton onPressButon={onPressButon} />
      )} */}
      {isOfferExpired() && (
        <Text style={styles.expiryText}>
          Respond within{' '}
          {getDayTimeDifferent(
            (data.offer_expiry || data.expiry_datetime) * 1000,
            new Date().getTime(),
          )}
        </Text>
      )}
      {/* <TCThickDivider height={7} marginTop={isOfferExpired() ? 0 : 25}/> */}
    </View>
  );
}

const styles = StyleSheet.create({
  expiryText: {
    textAlign: 'center',
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.darkOrangColor,
    marginTop: 10,
    textDecorationLine: 'underline',
  },

  timeLocationText: {
    fontFamily: fonts.RLight,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  timeView: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.creamColor,
    width: '92%',
    height: 25,
    borderRadius: 5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  mainViewContainer: {
    backgroundColor: colors.whiteColor,
    width: '92%',
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderRadius: 5,
    elevation: 5,
    alignSelf: 'center',
    marginBottom: 15,
    paddingBottom: 15,
  },
});
