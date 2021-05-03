/* eslint-disable react/no-unescaped-entities */
/* eslint-disable consistent-return */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import ReservationStatus from '../../Constants/ReservationStatus';

export default function ChallengeStatusView({
  isSender,
  isTeam = true,
  status,
  senderName,
  receiverName,
  offerExpiry,
}) {
  const isTeamText = () => {
    if (!isTeam) {
      return 'You';
    }

    return 'Your team';
  };
  const isOfferExpired = () => {
    if (status === ReservationStatus.offered) {
      if (offerExpiry < new Date().getTime()) {
        return true;
      }
      return false;
    }
    if (status === ReservationStatus.changeRequest) {
      if (offerExpiry < new Date().getTime()) {
        return true;
      }
      return false;
    }
  };
  return (
    <View style={styles.viewContainer}>
      {isSender && status === ReservationStatus.offered && (
        <View>
          {isOfferExpired() ? (
            <View>
              <Text
                style={[styles.statusTitleText, { color: colors.googleColor }]}>
                RESERVATION REQUEST EXPIRED
              </Text>
              <Text style={styles.statusDescription}>
                Your match reservation request has been expired
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.statusTitleText}>
                RESERVATION REQUEST SENT
              </Text>
              <Text style={styles.statusDescription}>
                {isTeamText()} sent a match reservation request to {receiverName}. This request will be expired in{'\n'}
                <Text style={{ color: colors.darkThemeColor }}>47h 59m.</Text>
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
                RESERVATION REQUEST EXPIRED
              </Text>
              <Text style={styles.statusDescription}>
                The match reservation request from {senderName} has been expired.
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.statusTitleText}>
                RESERVATION REQUEST PENDING
              </Text>
              <Text style={styles.statusDescription}>
                {isTeamText()} received a match reservation request from {senderName}. Please, respond within{'\n'}
                <Text style={{ color: colors.darkThemeColor }}>47h 59m.</Text>
              </Text>
            </View>
          )}
        </View>
      )}

      {isSender
        && (status === ReservationStatus.accepted
          || status === ReservationStatus.restored
          || status === ReservationStatus.requestcancelled) && (
            <View>
              <Text style={[styles.statusTitleText, { color: colors.greeColor }]}>
                RESERVATION CONFIRMED
              </Text>
              <Text
              style={
                styles.statusDescription
              }>{receiverName} confirmed your match reservation request.</Text>
            </View>
        )}
      {!isSender
        && (status === ReservationStatus.accepted
          || status === ReservationStatus.restored
          || status === ReservationStatus.requestcancelled) && (
            <View>
              <Text style={[styles.statusTitleText, { color: colors.greeColor }]}>
                RESERVATION CONFIRMED
              </Text>
              <Text
              style={
                styles.statusDescription
              }>{isTeamText()} has the confirmed match reservation request against {senderName}.</Text>
            </View>
        )}

      {isSender && status === ReservationStatus.declined && (
        <View>
          <Text style={[styles.statusTitleText, { color: colors.googleColor }]}>
            RESERVATION REQUEST DECLINED
          </Text>
          <Text
            style={
              styles.statusDescription
            }>{receiverName} declined your match reservation request.</Text>
        </View>
      )}
      {!isSender && status === ReservationStatus.declined && (
        <View>
          <Text style={[styles.statusTitleText, { color: colors.googleColor }]}>
            RESERVATION REQUEST DECLINED
          </Text>
          <Text
            style={
              styles.statusDescription
            }>{isTeamText()} declined the match reservation request from {senderName}.</Text>
        </View>
      )}

      {isSender && status === ReservationStatus.cancelled && (
        <View>
          <Text style={[styles.statusTitleText, { color: colors.googleColor }]}>
            RESERVATION CANCELLED
          </Text>
          <Text
            style={
              styles.statusDescription
            }>{isTeamText()} cancelled the match reservation.</Text>
        </View>
      )}
      {!isSender && status === ReservationStatus.cancelled && (
        <View>
          <Text style={[styles.statusTitleText, { color: colors.googleColor }]}>
            RESERVATION CANCELLED
          </Text>
          <Text
            style={
              styles.statusDescription
            }>{senderName} cancelled the match reservation.</Text>
        </View>
      )}

      {isSender && status === ReservationStatus.pendingpayment && (
        <View>
          <Text style={styles.statusTitleText}>AWAITING PAYMENT</Text>
          <Text
            style={
              styles.statusDescription
            }>{receiverName} has accepted your match reservation,but your payment hasn't gone through yet.</Text>
          <Text style={styles.pendingRequestText}>This reservation will be canceled unless the payment goes through within<Text style={{ color: colors.darkThemeColor }}> 4h 50m.</Text>
          </Text>
        </View>
      )}
      {!isSender && status === ReservationStatus.pendingpayment && (
        <View>
          <Text style={styles.statusTitleText}>AWAITING PAYMENT</Text>
          <Text
            style={
              styles.statusDescription
            }>{isTeamText()} has accepted a game reservation from {senderName}, but the payment hasn't gone through yet.</Text>
          <Text style={styles.pendingRequestText}>This reservation will be canceled unless the payment goes through within<Text style={{ color: colors.darkThemeColor }}>4h 50m.</Text>
          </Text>
        </View>
      )}

      {isSender && status === ReservationStatus.pendingrequestpayment && (
        <View>
          <Text style={styles.statusTitleText}>AWAITING PAYMENT</Text>
          <Text
            style={
              styles.statusDescription
            }>{receiverName} has accepted your match reservation alteration request, but your payment hasn't gone through yet.</Text>
          <Text style={styles.pendingRequestText}>
            The accepted alteration won't be applied to the current reservation unless the payment goes through within
            <Text style={{ color: colors.darkThemeColor }}> 4h 50m </Text>
            {'\n\n'}Meanwhile, {senderName} can cancel acceptance of the alteration request before the payment is completed.
          </Text>
        </View>
      )}
      {!isSender && status === ReservationStatus.pendingrequestpayment && (
        <View>
          <Text style={styles.statusTitleText}>AWAITING PAYMENT</Text>
          <Text
            style={
              styles.statusDescription
            }>{isTeamText()} has accepted a match reservation alteration request from {senderName}, but the payment hasn't gone through yet.</Text>
          <Text style={styles.pendingRequestText}>
            The accepted alteration won't be applied to the current reservation unless the payment goes through within
            <Text style={{ color: colors.darkThemeColor }}>4h 50m </Text>
            {'\n\n'}Meanwhile, you can cancel acceptance of the alteration request before the payment will go through.
          </Text>
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
              <Text style={styles.statusDescription}>Your match reservation alteration request has been expired</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.statusTitleText}>
                ALTERATION REQUEST SENT
              </Text>
              <Text style={styles.statusDescription}>
                {isTeamText()} sent a match reservation alteration request to {receiverName}. This request will be expired in{'\n'}
                <Text style={{ color: colors.darkThemeColor }}>47h 59m.</Text>
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
              <Text style={styles.statusDescription}>
                The match reservation request from {senderName} has been expired.
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.statusTitleText}>
                ALTERATION REQUEST PENDING
              </Text>
              <Text style={styles.statusDescription}>
                {isTeamText()} received a match reservation alteration request from {senderName}. Please, respond within{'\n'}
                <Text style={{ color: colors.darkThemeColor }}>47h 59m.</Text>
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  statusDescription: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,

    marginRight: 15,
  },
  statusTitleText: {
    fontSize: 16,
    color: colors.darkThemeColor,
    fontFamily: fonts.RBold,
  },
  viewContainer: {
    margin: 15,
    marginBottom: 25,
  },
  pendingRequestText: {
    marginTop: 10,
    color: colors.userPostTimeColor,
    fontSize: 14,
    fontFamily: fonts.RRegular,
  },
});
