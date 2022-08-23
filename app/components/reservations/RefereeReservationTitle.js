/* eslint-disable no-dupe-else-if */
/* eslint-disable brace-style */
/* eslint-disable no-lonely-if */
/* eslint-disable consistent-return */
import React, {useContext} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import AuthContext from '../../auth/context';

import colors from '../../Constants/Colors';

// import ScorekeeperReservationStatus from '../../Constants/ScorekeeperReservationStatus';
import fonts from '../../Constants/Fonts';
import RefereeReservationStatus from '../../Constants/RefereeReservationStatus';

let entity = {};

export default function RefereeReservationTitle({
  reservationObject,
  fontSize = 18,
  showDesc = true,
  containerStyle,
}) {
  console.log('reservationObject OHHHH:=>', reservationObject);

  const entityList = [
    {...reservationObject?.game?.home_team},
    {...reservationObject?.game?.away_team},
    {...reservationObject?.referee},
  ];
  console.log('entityList:=>', entityList);

  const authContext = useContext(AuthContext);
  entity = authContext.entity;
  console.log(entity);

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

  const getTitle = () => {
    const statusObject = {};
    // Offered Status
    if (reservationObject.status === RefereeReservationStatus.offered) {
      if (reservationObject.is_offer) {
        // For team B
        if (entity.uid === reservationObject.initiated_by) {
          statusObject.title = 'Approval-Pending';
          statusObject.color = colors.themeColor;
          statusObject.desc = `You received referee approval request from ${getReferee()}.`;
        } else if (entity.uid === reservationObject.approved_by) {
          // For team A
        } else {
          // For Referee
          statusObject.title = 'Approval-awaiting';
          statusObject.color = colors.themeColor;
          statusObject.desc = `You sent referee approval request to ${getTeamB()}.`;
        }
      } else {
        // For team B
        if (entity.uid === reservationObject.initiated_by) {
          statusObject.title = 'Approval-awaiting';
          statusObject.color = colors.themeColor;
          statusObject.desc = `You sent referee approval request to ${getTeamA()}.`;
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
          statusObject.title = 'Pending';
          statusObject.color = colors.themeColor;
          statusObject.desc = `${getTeamA()} received referee approval request.`;
        } else if (entity.uid === reservationObject.approved_by) {
          // For team A
        } else {
          // For Referee
          statusObject.title = 'Awaiting';
          statusObject.color = colors.themeColor;
          statusObject.desc = `${getTeamA()} received referee approval request.`;
        }
      } else {
        // For team B
        if (entity.uid === reservationObject.initiated_by) {
          statusObject.title = 'Awaiting';
          statusObject.color = colors.themeColor;
          statusObject.desc = `${getReferee()} received referee request sent by you.`;
        } else if (entity.uid === reservationObject.approved_by) {
          // For team A
        } else {
          // For Referee
          statusObject.title = 'PENDING';
          statusObject.color = colors.themeColor;
          statusObject.desc = `You received referee request sent by ${getTeamB()}.`;
        }
      }
    }

    // Declined Status
    else if (reservationObject.status === RefereeReservationStatus.declined) {
      if (reservationObject.referee_booked) {
        // Alter request

        if (entity.uid === reservationObject.initiated_by) {
          if (reservationObject.requested_by === reservationObject.referee_id) {
            statusObject.title = 'You-declined';
            statusObject.color = colors.googleColor;
            statusObject.desc =
              'You declined  referee alter request sent by referee.';
          } else {
            statusObject.title = 'Referee-declined';
            statusObject.color = colors.googleColor;
            statusObject.desc =
              'Referee declined  referee alter request sent by you.';
          }
        } else if (entity.uid === reservationObject.referee_id) {
          // For Referee
          if (reservationObject.requested_by === reservationObject.referee_id) {
            statusObject.title = `${getTeamB()}-declined`;
            statusObject.color = colors.googleColor;
            statusObject.desc = `${getTeamB()} declined  referee alter request sent by you.`;
          } else {
            statusObject.title = 'You -declined';
            statusObject.color = colors.googleColor;
            statusObject.desc = `You declined  referee alter request sent by ${getTeamA()}.`;
          }
        }
      } else {
        if (reservationObject.is_offer) {
          if (entity.uid === reservationObject.initiated_by) {
            if (reservationObject.version === 2) {
              // declined team B
              if (
                reservationObject.requested_by === reservationObject.referee_id
              ) {
                statusObject.title = 'You Declined';
                statusObject.color = colors.googleColor;
                statusObject.desc = `You declined  referee alter request sent by ${getReferee()}.`;
              } else {
                statusObject.title = `${getTeamB()} Declined`;
                statusObject.color = colors.googleColor;
                statusObject.desc = `${getTeamB()} declined  referee alter request sent by you.`;
              }
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
              statusObject.title = `${getTeamA()}-disapproved`;
              statusObject.color = colors.googleColor;
              statusObject.desc = `${getTeamA()} disapproved your referee request sent by you.`;
            } else {
              statusObject.title = 'Referee-declined';
              statusObject.color = colors.googleColor;
              statusObject.desc = `${getReferee()} declined a referee request sent by you.`;
            }
          } else if (entity.uid === reservationObject.approved_by) {
            // For team A
            if (reservationObject.version === 2) {
              statusObject.title = 'You-disapproved';
              statusObject.color = colors.googleColor;
              statusObject.desc = `You disapproved referee request sent by ${getTeamB()}.`;
            } else {
              statusObject.title = 'Referee-declined';
              statusObject.color = colors.googleColor;
              statusObject.desc = `Referee declined referee request sent by ${getTeamB()}.`;
            }
          } else {
            statusObject.title = 'YOU -DECLINED';
            statusObject.color = colors.googleColor;
            statusObject.desc = `You declined referee request sent by ${getTeamB()}.`;
          }
        }
      }
    } else if (
      reservationObject.status === RefereeReservationStatus.pendingpayment
    ) {
      if (reservationObject?.requested_by === entity.uid) {
        statusObject.title = 'Awaiting Payment';
        statusObject.color = colors.themeColor;
        statusObject.desc = `${getReferee()} has accepted your referee reservation, but your payment hasn't gone through yet.`;
      } else {
        statusObject.title = 'Pending Payment';
        statusObject.color = colors.themeColor;
        statusObject.desc = `You accepted a referee reservation from ${getTeamB()}, but the payment hasn't gone through yet.`;
      }
    } else if (
      reservationObject.status === RefereeReservationStatus.accepted ||
      reservationObject.status === RefereeReservationStatus.restored ||
      reservationObject.status === RefereeReservationStatus.requestcancelled
    ) {
      if (entity.uid === reservationObject.initiated_by) {
        if (reservationObject?.requested_by === reservationObject.referee_id) {
          statusObject.title = reservationObject.automatic_request
            ? 'Confirmed - Rescheduled'
            : 'Confirmed';
          statusObject.color = colors.requestConfirmColor;
          statusObject.desc = `You have a confirmed referee reservation sent by ${getReferee()}.`;
        } else {
          statusObject.title = reservationObject.automatic_request
            ? 'Confirmed - Rescheduled'
            : 'Confirmed';
          statusObject.color = colors.requestConfirmColor;
          statusObject.desc = `${getReferee()} confirmed referee reservation sent by you.`;
        }
      } else {
        if (reservationObject?.requested_by === reservationObject.referee_id) {
          statusObject.title = reservationObject.automatic_request
            ? 'Confirmed - Rescheduled'
            : 'Confirmed';
          statusObject.color = colors.requestConfirmColor;
          statusObject.desc = `${getTeamB()} confirmed referee reservation sent by you.`;
        } else {
          statusObject.title = reservationObject.automatic_request
            ? 'Confirmed - Rescheduled'
            : 'Confirmed';
          statusObject.color = colors.requestConfirmColor;
          statusObject.desc = `You confirmed referee reservation sent by ${getTeamB()}.`;
        }
      }
    } else if (
      reservationObject.status === RefereeReservationStatus.cancelled
    ) {
      if (reservationObject.is_offer) {
        if (entity.uid === reservationObject.initiated_by) {
          if (reservationObject.done_by === reservationObject.referee_id) {
            statusObject.title = 'Cancelled';
            statusObject.color = colors.googleColor;
            statusObject.desc = `This referee reservation is cancelled by ${getReferee()}`;
          } else {
            statusObject.title = 'Cancelled';
            statusObject.color = colors.googleColor;
            statusObject.desc = 'This referee reservation is cancelled by you.';
          }
        } else if (entity.uid === reservationObject.approved_by) {
          if (reservationObject.done_by === reservationObject.referee_id) {
            statusObject.title = 'Cancelled';
            statusObject.color = colors.googleColor;
            statusObject.desc = `This referee reservation is cancelled by ${getReferee()}`;
          } else {
            statusObject.title = 'Cancelled';
            statusObject.color = colors.googleColor;
            statusObject.desc = `This referee reservation is cancelled by ${getTeamB()}.`;
          }
        } else {
          // For Referee
          if (reservationObject.done_by === reservationObject.referee_id) {
            statusObject.title = 'Cancelled';
            statusObject.color = colors.googleColor;
            statusObject.desc = 'This referee reservation is cancelled by you.';
          } else {
            statusObject.title = 'Cancelled';
            statusObject.color = colors.googleColor;
            statusObject.desc = `This reservation is cancelled by ${getTeamB()}.`;
          }
        }
      } else {
        if (entity.uid === reservationObject.initiated_by) {
          if (reservationObject.done_by === reservationObject.referee_id) {
            statusObject.title = 'Cancelled';
            statusObject.color = colors.googleColor;
            statusObject.desc = `This referee reservation is cancelled by ${getReferee()}`;
          } else {
            statusObject.title = 'Cancelled';
            statusObject.color = colors.googleColor;
            statusObject.desc = 'This referee reservation is cancelled by you.';
          }
        } else {
          // For Referee
          if (reservationObject.done_by === reservationObject.referee_id) {
            statusObject.title = 'Cancelled';
            statusObject.color = colors.googleColor;
            statusObject.desc = 'This referee reservation is cancelled by you.';
          } else {
            statusObject.title = 'Cancelled';
            statusObject.color = colors.googleColor;
            statusObject.desc = `This reservation is cancelled by ${getTeamB()}.`;
          }
        }
      }
    } else if (
      reservationObject.status === RefereeReservationStatus.requestcancelled
    ) {
      if (entity.uid === reservationObject.initiated_by) {
        statusObject.title = 'Withdrawn';
        statusObject.color = colors.darkThemeColor;
        statusObject.desc = 'Referee reservation withdrawn by you.';
      } else {
        statusObject.title = 'Withdrawn';
        statusObject.color = colors.darkThemeColor;
        statusObject.desc = 'Referee reservation withdrawn by Team B.';
      }
    } else if (
      reservationObject.status === RefereeReservationStatus.changeRequest
    ) {
      if (reservationObject.automatic_request) {
        if (entity.uid === reservationObject.initiated_by) {
          if (reservationObject.requested_by === reservationObject.referee_id) {
            statusObject.title = 'Alteration-pending automatic';
            statusObject.color = colors.darkThemeColor;
            statusObject.desc = `You received a referee reservation alteration request from ${getTeamB()} because the game had been rescheduled. Please, respond within 4d 23h 57m.`;
          } else {
            statusObject.title = 'Alteration-awaiting automatic';
            statusObject.color = colors.darkThemeColor;
            statusObject.desc = `An alteration request was sent to ${getReferee()} because the game had been rescheduled.`;
          }
        } else {
          if (reservationObject.requested_by === reservationObject.referee_id) {
            statusObject.title = 'Alteration-awaiting automatic';
            statusObject.color = colors.darkThemeColor;
            statusObject.desc =
              'An alteration request was sent to Team B because the game had been rescheduled.';
          } else {
            statusObject.title = 'Alteration-pending automatic';
            statusObject.color = colors.darkThemeColor;
            statusObject.desc = `You received a referee alteration request from ${getTeamB()} because the game had been rescheduled. Please, respond within 4d 23h 57m.`;
          }
        }
      } else {
        if (entity.uid === reservationObject.initiated_by) {
          if (reservationObject.requested_by === reservationObject.referee_id) {
            statusObject.title = 'Alteration Pending';
            statusObject.color = colors.darkThemeColor;
            statusObject.desc = (
              <>
                You received a referee alteration request from {getReferee()}.
                Please, respond within{' '}
                {
                  <Text style={styles.timeColor}>
                    {getDayTimeDifferent(
                      reservationObject?.expiry_datetime * 1000,
                      new Date().getTime(),
                    )}
                  </Text>
                }
                .
              </>
            );
          } else {
            statusObject.title = 'Alteration Awaiting';
            statusObject.color = colors.darkThemeColor;
            statusObject.desc = `You sent a referee alteration request to ${getReferee()}.`;
          }
        } else {
          if (reservationObject.requested_by === reservationObject.referee_id) {
            statusObject.title = 'Alteration Awaiting';
            statusObject.color = colors.darkThemeColor;
            statusObject.desc = `You sent a referee alteration request to ${getTeamB()}.`;
          } else {
            statusObject.title = 'Alteration Pending';
            statusObject.color = colors.darkThemeColor;
            statusObject.desc = (
              <>
                You received a referee alteration request from {getTeamB()}.
                Please, respond within{' '}
                {
                  <Text style={styles.timeColor}>
                    {getDayTimeDifferent(
                      reservationObject?.expiry_datetime * 1000,
                      new Date().getTime(),
                    )}
                  </Text>
                }
                .
              </>
            );
          }
        }
      }
    } else if (
      reservationObject.status ===
      RefereeReservationStatus.pendingrequestpayment
    ) {
      if (reservationObject?.referee?.user_id === entity.uid) {
        statusObject.title = 'Awaiting Payment';
        statusObject.color = colors.themeColor;
        statusObject.desc = `You has accepted a referee reservation alteration request from ${getTeamB()}, but the payment hasn't gone through yet.`;
      } else {
        statusObject.title = 'Pending Payment';
        statusObject.color = colors.themeColor;
        statusObject.desc = `${getReferee()} has accepted your referee reservation alteration request, but your payment hasn't gone through yet.`;
      }
    }

    console.log('Status obj::=>', statusObject);
    return statusObject;
  };

  const getTeamB = () => {
    const obj = entityList.filter(
      (o) =>
        o?.user_id === reservationObject?.initiated_by ||
        o?.group_id === reservationObject?.initiated_by,
    );
    console.log('obj obj::=>', obj);

    if (obj[0]?.user_id) {
      return `${obj[0]?.full_name}`;
    }
    return `${obj[0]?.group_name}`;
  };

  const getTeamA = () => {
    const obj = entityList.filter(
      (o) =>
        o?.user_id === reservationObject?.approved_by ||
        o?.group_id === reservationObject?.approved_by,
    );
    if (obj[0]?.user_id) {
      return `${obj[0]?.full_name}`;
    }
    return `${obj[0]?.group_name}`;
  };
  const getReferee = () => {
    const obj = entityList.filter(
      (o) => o?.user_id === reservationObject?.referee_id,
    );
    return `${obj[0]?.full_name}`;
  };
  return (
    <View style={containerStyle}>
      <Text
        style={[styles.challengeTitle, {color: getTitle()?.color, fontSize}]}>
        {getTitle()?.title}
      </Text>

      {showDesc && <Text style={styles.challengeDesc}>{getTitle()?.desc}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  challengeTitle: {
    fontFamily: fonts.RBold,
    color: colors.themeColor,
  },
  challengeDesc: {
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    fontSize: 16,
    marginTop: 10,
  },
  timeColor: {color: colors.themeColor},
});

// export default memo(RefereeReservationTitle);
