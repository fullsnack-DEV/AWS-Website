/* eslint-disable react/no-unescaped-entities */
/* eslint-disable consistent-return */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import ReservationStatus from '../../Constants/ReservationStatus';
import RefereeReservationStatus from '../../Constants/RefereeReservationStatus';

export default function ChallengeStatusTitle({
  isSender,
  status,
  // receiverName,
  offerExpiry,
  challengeObj,
}) {
  //   const [countDown, setCountDown] = useState();

  //   useEffect(() => {
  //     if (!isOfferExpired()) {
  //       const timeStamp = moment(new Date(challengeObj?.timestamp * 1000))
  //         .add(24, 'h')
  //         .toDate()
  //         .getTime();
  //       const startDateTime = challengeObj?.start_datetime * 1000;
  //       let finalDate;
  //       if (timeStamp < startDateTime) {
  //         finalDate = timeStamp;
  //       } else {
  //         finalDate = startDateTime;
  //       }
  //       if (finalDate > new Date().getTime()) {
  //         timer = setInterval(() => {
  //           if (
  //             status === ReservationStatus.offered
  //             || status === ReservationStatus.changeRequest
  //             || status === ReservationStatus.pendingpayment
  //             || status === ReservationStatus.pendingrequestpayment
  //           ) {
  //             getTwoDateDifference(finalDate, new Date().getTime());
  //           }
  //         }, 1000);
  //       } else {
  //         setCountDown();
  //       }

  //       return () => {
  //         clearInterval(timer);
  //       };
  //     }
  //   }, [challengeObj?.start_datetime, challengeObj?.timestamp, status]);

  const isOfferExpired = () => {
    if (status === ReservationStatus.offered) {
      if (offerExpiry > new Date().getTime()) {
        return true;
      }
      return false;
    }
    if (status === ReservationStatus.changeRequest) {
      if (offerExpiry > new Date().getTime()) {
        return true;
      }
      return false;
    }
  };

  //   const getTwoDateDifference = (sDate, eDate) => {
  //     let delta = Math.abs(new Date(sDate).getTime() - new Date(eDate).getTime()) / 1000;

  //     const days = Math.floor(delta / 86400);
  //     delta -= days * 86400;

  //     const hours = Math.floor(delta / 3600) % 24;
  //     delta -= hours * 3600;

  //     const minutes = Math.floor(delta / 60) % 60;
  //     delta -= minutes * 60;

  //     const seconds = delta % 60;

  //     setCountDown(`${hours}h ${minutes}m ${seconds.toFixed(0)}s`);
  //   };
  return (
    <View style={styles.viewContainer}>
      {isSender && status === ReservationStatus.offered && (
        <View>
          {isOfferExpired() ? (
            <View>
              <Text
                style={[styles.statusTitleText, { color: colors.googleColor }]}>
                {challengeObj?.challenger === challengeObj?.invited_by
                  ? 'EXPIRED'
                  : 'INVITE TO CHALLENGE EXPIRED'}
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.statusTitleText}>
                {challengeObj?.challenger === challengeObj?.invited_by
                  ? 'SENT'
                  : 'INVITE TO CHALLENGE SENT'}
              </Text>
            </View>
          )}
        </View>
      )}
      {!isSender && status === ReservationStatus.offered && (
        <View>
          {isOfferExpired() ? (
            <View>
              <Text
                style={[styles.statusTitleText, { color: colors.googleColor }]}>
                {challengeObj?.challenger === challengeObj?.invited_by
                  ? 'EXPIRED'
                  : 'INVITE TO CHALLENGE EXPIRED'}
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.statusTitleText}>
                {challengeObj?.challenger === challengeObj?.invited_by
                  ? 'PENDING'
                  : 'INVITE TO CHALLENGE RECEIVED'}
              </Text>
            </View>
          )}
        </View>
      )}
      {isSender
        && (status === RefereeReservationStatus.approved) && (
          <View>
            <Text style={[styles.statusTitleText, { color: colors.greeColor }]}>
              APPROVED
            </Text>
          </View>
        )}
      {!isSender
        && (status === RefereeReservationStatus.approved) && (
          <View>
            <Text style={[styles.statusTitleText, { color: colors.greeColor }]}>
              APPROVED
            </Text>
          </View>
        )}
      {isSender
        && (status === ReservationStatus.accepted
          || status === ReservationStatus.restored
          || status === ReservationStatus.requestcancelled) && (
            <View>
              <Text style={[styles.statusTitleText, { color: colors.greeColor }]}>
                CONFIRMED
              </Text>
            </View>
        )}
      {!isSender
        && (status === ReservationStatus.accepted
          || status === ReservationStatus.restored
          || status === ReservationStatus.requestcancelled) && (
            <View>
              <Text style={[styles.statusTitleText, { color: colors.greeColor }]}>
                CONFIRMED
              </Text>
            </View>
        )}
      {status === ReservationStatus.completed && (
        <View>
          <Text style={[styles.statusTitleText, { color: colors.blueColorCard }]}>
            COMPLETED
          </Text>
        </View>
      )}

      {isSender && status === ReservationStatus.declined && (
        <View>
          <Text style={[styles.statusTitleText, { color: colors.googleColor }]}>
            {challengeObj?.challenger === challengeObj?.invited_by
              ? 'DECLINED'
              : 'INVITE TO CHALLENGE DECLINED'}
          </Text>
        </View>
      )}
      {!isSender && status === ReservationStatus.declined && (
        <View>
          <Text style={[styles.statusTitleText, { color: colors.googleColor }]}>
            {challengeObj?.challenger === challengeObj?.invited_by
              ? 'DECLINED'
              : 'INVITE TO CHALLENGE DECLINED'}
          </Text>
        </View>
      )}

      {isSender && status === ReservationStatus.cancelled && (
        <View>
          <Text style={[styles.statusTitleText, { color: colors.googleColor }]}>
            {challengeObj?.challenger === challengeObj?.invited_by
              ? 'CANCELLED'
              : 'INVITE TO CHALLENGE CANCELLED'}
          </Text>
        </View>
      )}
      {!isSender && status === ReservationStatus.cancelled && (
        <View>
          <Text style={[styles.statusTitleText, { color: colors.googleColor }]}>
            {challengeObj?.challenger === challengeObj?.invited_by
              ? 'CANCELLED'
              : 'INVITE TO CHALLENGE CANCELLED'}
          </Text>
        </View>
      )}

      {isSender && status === ReservationStatus.pendingpayment && (
        <View>
          <Text style={styles.statusTitleText}>AWAITING PAYMENT</Text>
        </View>
      )}
      {!isSender && status === ReservationStatus.pendingpayment && (
        <View>
          <Text style={styles.statusTitleText}>AWAITING PAYMENT</Text>
        </View>
      )}

      {isSender && status === ReservationStatus.pendingrequestpayment && (
        <View>
          <Text style={styles.statusTitleText}>AWAITING PAYMENT</Text>
        </View>
      )}
      {!isSender && status === ReservationStatus.pendingrequestpayment && (
        <View>
          <Text style={styles.statusTitleText}>AWAITING PAYMENT</Text>
        </View>
      )}

      {isSender && status === ReservationStatus.changeRequest && (
        <View>
          {isOfferExpired() ? (
            <View>
              <Text
                style={[styles.statusTitleText, { color: colors.googleColor }]}>
                ALTERATION REQUEST EXPIRED
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.statusTitleText}>
                ALTERATION · AWAITING
              </Text>
            </View>
          )}
        </View>
      )}
      {!isSender && status === ReservationStatus.changeRequest && (
        <View>
          {isOfferExpired() ? (
            <View>
              <Text
                style={[styles.statusTitleText, { color: colors.googleColor }]}>
                ALTERATION REQUEST EXPIRED
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.statusTitleText}>
                ALTERATION REQUEST PENDING
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  statusTitleText: {
    fontSize: 12,
    color: colors.darkThemeColor,
    fontFamily: fonts.RBold,
  },
  viewContainer: {
    marginTop: 0,
    marginBottom: 0,
  },
});
