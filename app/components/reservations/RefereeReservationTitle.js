/* eslint-disable brace-style */
/* eslint-disable no-lonely-if */
/* eslint-disable consistent-return */
import React, { memo, useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AuthContext from '../../auth/context';

import colors from '../../Constants/Colors';

// import ScorekeeperReservationStatus from '../../Constants/ScorekeeperReservationStatus';
import fonts from '../../Constants/Fonts';
import RefereeReservationStatus from '../../Constants/RefereeReservationStatus';

let entity = {};

function RefereeReservationTitle({ reservationObject }) {
  console.log('reservationObject OHHHH:=>', reservationObject);

  const authContext = useContext(AuthContext);
  entity = authContext.entity;
  console.log(entity);
  const getTitle = () => {
    const statusObject = {};
    // Offered Status
    if (reservationObject.status === RefereeReservationStatus.offered) {
      if (reservationObject.is_offer) {
        // For team B
        if (entity.uid === reservationObject.initiated_by) {
          statusObject.title = 'Approval-awaiting';
          statusObject.color = colors.themeColor;
        } else if (entity.uid === reservationObject.approved_by) {
          // For team A
        } else {
          // For Referee
        }
      } else {
        // For team B
        if (entity.uid === reservationObject.initiated_by) {
          statusObject.title = 'Approval-awaiting';
          statusObject.color = colors.themeColor;
        } else if (entity.uid === reservationObject.approved_by) {
          // For team A
        } else {
          // For Referee
        }
      }
    }

    // Approved Status
    else if (reservationObject.status === RefereeReservationStatus.approved) {
      if (reservationObject.is_offer) {
        // For team B
        if (entity.uid === reservationObject.initiated_by) {
          statusObject.title = 'Approval-awaiting';
          statusObject.color = colors.themeColor;
        } else if (entity.uid === reservationObject.approved_by) {
          // For team A
        } else {
          // For Referee
        }
      } else {
        // For team B
        if (entity.uid === reservationObject.initiated_by) {
          statusObject.title = 'Awaiting';
          statusObject.color = colors.themeColor;
        } else if (entity.uid === reservationObject.approved_by) {
          // For team A
        } else {
          // For Referee
          statusObject.title = 'Pending';
          statusObject.color = colors.themeColor;
        }
      }
    }

    // Declined Status
    else if (reservationObject.status === RefereeReservationStatus.declined) {
      if (reservationObject.referee_booked) {
        // Alter request

        if (entity.uid === reservationObject.initiated_by) {
          if (reservationObject.requested_by === reservationObject.referee_id) {
            // declined team B
          } else {
            // declined referee
          }
        } else if (entity.uid === reservationObject.referee_id) {
          // For Referee
          if (reservationObject.requested_by === reservationObject.referee_id) {
            // declined team B
          } else {
            // declined referee
          }
        }
      } else {
        if (reservationObject.is_offer) {
          if (entity.uid === reservationObject.initiated_by) {
            if (reservationObject.version === 2) {
              // declined team B
            } else {
              // declined team A
            }
          } else if (entity.uid === reservationObject.approved_by) {
            // For team A
            if (reservationObject.version === 2) {
              // declined team B
            } else {
              // declined team A
            }
          } else {
            // For Referee
            if (reservationObject.version === 2) {
              // declined team B
            } else {
              // declined team A
            }
          }
        } else {
          if (entity.uid === reservationObject.initiated_by) {
            if (reservationObject.version === 2) {
              // declined team A
            } else {
              // declined Referee
            }
          } else if (entity.uid === reservationObject.approved_by) {
            // For team A
            if (reservationObject.version === 2) {
              // declined team A
            } else {
              // declined referee
            }
          } else {
            // For Referee
            if (reservationObject.version === 2) {
              // declined team A
            } else {
              // declined team referee
            }
          }
        }
      }
    } else if (
      reservationObject.status === RefereeReservationStatus.pendingpayment
    ) {
      if (reservationObject?.requested_by === entity.uid) {
        statusObject.title = 'Awaiting Payment';
        statusObject.color = colors.themeColor;
      } else {
        statusObject.title = 'Pending Payment';
        statusObject.color = colors.themeColor;
      }
    } else if (
        reservationObject.status === RefereeReservationStatus.accepted
        || reservationObject.status === RefereeReservationStatus.restored
        || reservationObject.status === RefereeReservationStatus.requestcancelled
      ) {
        if (reservationObject?.requested_by === entity.uid) {
            statusObject.title = reservationObject.automatic_request
            ? 'Confirmed - Rescheduled'
            : 'Confirmed';
          statusObject.color = colors.requestConfirmColor;
        } else {
            statusObject.title = reservationObject.automatic_request
            ? 'Confirmed - Rescheduled'
            : 'Confirmed';
          statusObject.color = colors.requestConfirmColor;
        }
      } else if (reservationObject.status === RefereeReservationStatus.cancelled) {
        if (reservationObject?.requested_by === entity.uid) {
            statusObject.title = 'Withdrawn';
        statusObject.color = colors.themeColor;
        }
        else {
            statusObject.title = 'Withdrawn';
            statusObject.color = colors.themeColor;
        }
      }

    console.log('OHHHH:=>', statusObject);
    return statusObject;
  };

//   const checkSenderOrReceiver = () => {
//     if (reservationObject?.requested_by === entity.uid) {
//       return 'sender';
//     }
//     return 'receiver';
//   };

  return (
    <View>
      <Text style={[styles.challengeMessage, { color: getTitle()?.color }]}>
        {getTitle()?.title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  challengeMessage: {
    fontFamily: fonts.RBold,
    fontSize: 18,
    color: colors.themeColor,
    margin: 15,
    marginBottom: 5,
  },
});

export default memo(RefereeReservationTitle);
