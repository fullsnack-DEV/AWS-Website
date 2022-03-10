/* eslint-disable no-dupe-else-if */
/* eslint-disable brace-style */
/* eslint-disable no-lonely-if */
/* eslint-disable consistent-return */
import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AuthContext from '../../auth/context';

import colors from '../../Constants/Colors';

// import ScorekeeperReservationStatus from '../../Constants/ScorekeeperReservationStatus';
import fonts from '../../Constants/Fonts';
import ScorekeeperReservationStatus from '../../Constants/ScorekeeperReservationStatus';

let entity = {};

export default function ScorekeeperReservationTitle({
 reservationObject, fontSize = 18, showDesc = true, containerStyle,
 }) {
  console.log('reservationObject OHHHH:=>', reservationObject);

  const entityList = [
    { ...reservationObject?.game?.home_team },
    { ...reservationObject?.game?.away_team },
    { ...reservationObject?.scorekeeper },
  ];
  console.log('entityList:=>', entityList);

  const authContext = useContext(AuthContext);
  entity = authContext.entity;
  console.log(entity);

  const getDayTimeDifferent = (sDate, eDate) => {
    let delta = Math.abs(new Date(sDate).getTime() - new Date(eDate).getTime()) / 1000;

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
    if (reservationObject.status === ScorekeeperReservationStatus.offered) {
      if (reservationObject.is_offer) {
        // For team B
        if (entity.uid === reservationObject.initiated_by) {
          statusObject.title = 'Approval-Pending';
          statusObject.color = colors.themeColor;
          statusObject.desc = `You received scorekeeper approval request from ${getScorekeeper()}.`;
        } else if (entity.uid === reservationObject.approved_by) {
          // For team A
        } else {
          // For Scorekeeper
          statusObject.title = 'Approval-awaiting';
          statusObject.color = colors.themeColor;
          statusObject.desc = `You sent scorekeeper approval request to ${getTeamB()}.`;
        }
      } else {
        // For team B
        if (entity.uid === reservationObject.initiated_by) {
          statusObject.title = 'Approval-awaiting';
          statusObject.color = colors.themeColor;
          statusObject.desc = `You sent scorekeeper approval request to ${getTeamA()}.`;
        } else if (entity.uid === reservationObject.approved_by) {
          // For team A
        } else {
          // For Scorekeeper

        }
      }
    }

    // Approved Status
    else if (reservationObject.status === ScorekeeperReservationStatus.approved) {
      if (reservationObject.is_offer) {
        // For team B
        if (entity.uid === reservationObject.initiated_by) {
          statusObject.title = 'Pending';
          statusObject.color = colors.themeColor;
          statusObject.desc = `${getTeamA()} received scorekeeper approval request.`;
        } else if (entity.uid === reservationObject.approved_by) {
          // For team A
        } else {
          // For Scorekeeper
          statusObject.title = 'Awaiting';
          statusObject.color = colors.themeColor;
          statusObject.desc = `${getTeamA()} received scorekeeper approval request.`;
        }
      } else {
        // For team B
        if (entity.uid === reservationObject.initiated_by) {
          statusObject.title = 'Awaiting';
          statusObject.color = colors.themeColor;
          statusObject.desc = `${getScorekeeper()} received scorekeeper request sent by you.`;
        } else if (entity.uid === reservationObject.approved_by) {
          // For team A

        } else {
          // For Scorekeeper
          statusObject.title = 'Pending';
          statusObject.color = colors.themeColor;
          statusObject.desc = `You received scorekeeper request sent by ${getTeamB()}.`;
        }
      }
    }

    // Declined Status
    else if (reservationObject.status === ScorekeeperReservationStatus.declined) {
      if (reservationObject.scorekeeper_booked) {
        // Alter request

        if (entity.uid === reservationObject.initiated_by) {
          if (reservationObject.requested_by === reservationObject.scorekeeper_id) {
            statusObject.title = 'You-declined';
            statusObject.color = colors.googleColor;
            statusObject.desc = 'You declined  scorekeeper alter request sent by scorekeeper.';
          } else {
            statusObject.title = 'Scorekeeper-declined';
            statusObject.color = colors.googleColor;
            statusObject.desc = 'Scorekeeper declined  scorekeeper alter request sent by you.';
          }
        } else if (entity.uid === reservationObject.scorekeeper_id) {
          // For Scorekeeper
          if (reservationObject.requested_by === reservationObject.scorekeeper_id) {
            statusObject.title = `${getTeamB()}-declined`;
            statusObject.color = colors.googleColor;
            statusObject.desc = `${getTeamB()} declined  scorekeeper alter request sent by you.`;
          } else {
            statusObject.title = 'You -declined';
            statusObject.color = colors.googleColor;
            statusObject.desc = `You declined  scorekeeper alter request sent by ${getTeamA()}.`;
          }
        }
      } else {
        if (reservationObject.is_offer) {
          if (entity.uid === reservationObject.initiated_by) {
            if (reservationObject.version === 2) {
              // declined team B
              if (reservationObject.requested_by === reservationObject.scorekeeper_id) {
                statusObject.title = 'You-declined';
                statusObject.color = colors.googleColor;
                statusObject.desc = `You declined  scorekeeper reservation request sent by ${getScorekeeper()}.`;
              } else {
                statusObject.title = `${getTeamB()} -declined`;
                statusObject.color = colors.googleColor;
                statusObject.desc = `You declined  scorekeeper_id alter request sent by ${getTeamA()}.`;
              }
            } else {
              // declined team A
            }
          } else if (entity.uid === reservationObject.approved_by) {
            // For team A
            if (reservationObject.version === 2) {
              // declined team B
              if (reservationObject.requested_by === reservationObject.scorekeeper_id) {
                statusObject.title = 'You-declined';
                statusObject.color = colors.googleColor;
                statusObject.desc = `${getTeamB()} declined  scorekeeper_id alter request sent by you.`;
              } else {
                statusObject.title = `${getTeamB()} -declined`;
                statusObject.color = colors.googleColor;
                statusObject.desc = `You declined  scorekeeper_id alter request sent by ${getTeamA()}.`;
              }
            } else {
              // declined team A
            }
          } else {
            // For Scorekeeper
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
              statusObject.desc = `${getTeamA()} disapproved your scorekeeper request sent by you.`;
            } else {
              statusObject.title = 'Scorekeeper-declined';
              statusObject.color = colors.googleColor;
              statusObject.desc = `${getScorekeeper()} declined a scorekeeper request sent by you.`;
            }
          } else if (entity.uid === reservationObject.approved_by) {
            // For team A
            if (reservationObject.version === 2) {
              statusObject.title = 'You-disapproved';
              statusObject.color = colors.googleColor;
              statusObject.desc = `You disapproved scorekeeper request sent by ${getTeamB()}.`;
            } else {
              statusObject.title = 'Scorekeeper-declined';
              statusObject.color = colors.googleColor;
              statusObject.desc = `Scorekeeper declined scorekeeper request sent by ${getTeamB()}.`;
            }
          } else {
            statusObject.title = 'You-declined';
            statusObject.color = colors.googleColor;
            statusObject.desc = `You declined scorekeeper request sent by ${getTeamB()}.`;
          }
        }
      }
    } else if (
      reservationObject.status === ScorekeeperReservationStatus.pendingpayment
    ) {
      if (reservationObject?.requested_by === entity.uid) {
        statusObject.title = 'Awaiting Payment';
        statusObject.color = colors.themeColor;
        statusObject.desc = `${getScorekeeper()} has accepted your scorekeeper reservation, but your payment hasn't gone through yet.`;
      } else {
        statusObject.title = 'Pending Payment';
        statusObject.color = colors.themeColor;
        statusObject.desc = `You accepted a scorekeeper reservation from ${getTeamB()}, but the payment hasn't gone through yet.`;
      }
    } else if (
      reservationObject.status === ScorekeeperReservationStatus.accepted
      || reservationObject.status === ScorekeeperReservationStatus.restored
      || reservationObject.status === ScorekeeperReservationStatus.requestcancelled
    ) {
      if (entity.uid === reservationObject.initiated_by) {
        if (reservationObject?.requested_by === reservationObject.scorekeeper_id) {
          statusObject.title = reservationObject.automatic_request
            ? 'Confirmed - Rescheduled'
            : 'Confirmed';
          statusObject.color = colors.requestConfirmColor;
          statusObject.desc = `You have a confirmed scorekeeper reservation sent by ${getScorekeeper()}.`;
        } else {
          statusObject.title = reservationObject.automatic_request
            ? 'Confirmed - Rescheduled'
            : 'Confirmed';
          statusObject.color = colors.requestConfirmColor;
          statusObject.desc = `${getScorekeeper()} confirmed scorekeeper reservation sent by you.`;
        }
      } else {
        if (reservationObject?.requested_by === reservationObject.scorekeeper_id) {
          statusObject.title = reservationObject.automatic_request
            ? 'Confirmed - Rescheduled'
            : 'Confirmed';
          statusObject.color = colors.requestConfirmColor;
          statusObject.desc = `${getTeamB()} confirmed scorekeeper reservation sent by you.`;
        } else {
          statusObject.title = reservationObject.automatic_request
            ? 'Confirmed - Rescheduled'
            : 'Confirmed';
          statusObject.color = colors.requestConfirmColor;
          statusObject.desc = `You confirmed scorekeeper reservation sent by ${getTeamB()}.`;
        }
      }
    } else if (
      reservationObject.status === ScorekeeperReservationStatus.cancelled
    ) {
      if (reservationObject.is_offer) {
        if (entity.uid === reservationObject.initiated_by) {
          if (reservationObject.done_by === reservationObject.scorekeeper_id) {
            statusObject.title = 'Cancelled';
            statusObject.color = colors.googleColor;
            statusObject.desc = `This scorekeeper reservation is cancelled by ${getScorekeeper()}`;
          } else {
            statusObject.title = 'Cancelled';
            statusObject.color = colors.googleColor;
            statusObject.desc = 'This scorekeeper reservation is cancelled by you.';
          }
        } else if (entity.uid === reservationObject.approved_by) {
          if (reservationObject.done_by === reservationObject.scorekeeper_id) {
            statusObject.title = 'Cancelled';
            statusObject.color = colors.googleColor;
            statusObject.desc = `This scorekeeper reservation is cancelled by ${getScorekeeper()}`;
          } else {
            statusObject.title = 'Cancelled';
            statusObject.color = colors.googleColor;
            statusObject.desc = `This scorekeeper reservation is cancelled by ${getTeamB()}.`;
          }
        }
         else {
          // For Scorekeeper
          if (reservationObject.done_by === reservationObject.scorekeeper_id) {
            statusObject.title = 'Cancelled';
            statusObject.color = colors.googleColor;
            statusObject.desc = 'This scorekeeper reservation is cancelled by you.';
          } else {
            statusObject.title = 'Cancelled';
            statusObject.color = colors.googleColor;
            statusObject.desc = `This reservation is cancelled by ${getTeamB()}.`;
          }
        }
      } else {
        if (entity.uid === reservationObject.initiated_by) {
          if (reservationObject.done_by === reservationObject.scorekeeper_id) {
            statusObject.title = 'Cancelled';
            statusObject.color = colors.googleColor;
            statusObject.desc = `This scorekeeper reservation is cancelled by ${getScorekeeper()}`;
          } else {
            statusObject.title = 'Cancelled';
            statusObject.color = colors.googleColor;
            statusObject.desc = 'This scorekeeper reservation is cancelled by you.';
          }
        } else {
          // For Scorekeeper
          if (reservationObject.done_by === reservationObject.scorekeeper_id) {
            statusObject.title = 'Cancelled';
            statusObject.color = colors.googleColor;
            statusObject.desc = 'This scorekeeper reservation is cancelled by you.';
          } else {
            statusObject.title = 'Cancelled';
            statusObject.color = colors.googleColor;
            statusObject.desc = `This reservation is cancelled by ${getTeamB()}.`;
          }
        }
      }
    } else if (
      reservationObject.status === ScorekeeperReservationStatus.requestcancelled
    ) {
      if (entity.uid === reservationObject.initiated_by) {
        statusObject.title = 'Withdrawn';
        statusObject.color = colors.darkThemeColor;
        statusObject.desc = 'Scorekeeper reservation withdrawn by you.';
      } else {
        statusObject.title = 'Withdrawn';
        statusObject.color = colors.darkThemeColor;
        statusObject.desc = 'Scorekeeper reservation withdrawn by Team B.';
      }
    }
    else if (
      reservationObject.status === ScorekeeperReservationStatus.changeRequest
    ) {
      if (reservationObject.automatic_request) {
        if (entity.uid === reservationObject.initiated_by) {
          if (reservationObject.requested_by === reservationObject.scorekeeper_id) {
            statusObject.title = 'Alteration-pending automatic';
            statusObject.color = colors.darkThemeColor;
            statusObject.desc = `You received a scorekeeper reservation alteration request from ${getTeamB()} because the game had been rescheduled. Please, respond within 4d 23h 57m.`;
          } else {
            statusObject.title = 'Alteration-awaiting automatic';
            statusObject.color = colors.darkThemeColor;
            statusObject.desc = `An alteration request was sent to ${getScorekeeper()} because the game had been rescheduled.`;
          }
        } else {
          if (reservationObject.requested_by === reservationObject.scorekeeper_id) {
            statusObject.title = 'Alteration-awaiting automatic';
            statusObject.color = colors.darkThemeColor;
            statusObject.desc = 'An alteration request was sent to Team B because the game had been rescheduled.';
          } else {
            statusObject.title = 'Alteration-pending automatic';
            statusObject.color = colors.darkThemeColor;
            statusObject.desc = `You received a scorekeeper alteration request from ${getTeamB()} because the game had been rescheduled. Please, respond within 4d 23h 57m.`;
          }
        }
      } else {
        if (entity.uid === reservationObject.initiated_by) {
          if (reservationObject.requested_by === reservationObject.scorekeeper_id) {
            statusObject.title = 'Alteration Pending';
            statusObject.color = colors.darkThemeColor;
            statusObject.desc = <>You received a scorekeeper alteration request from {getScorekeeper()}. Please, respond within {<Text style={styles.timeColor}>{getDayTimeDifferent(
              reservationObject?.expiry_datetime * 1000,
              new Date().getTime(),
              )}</Text>}.</>;
          } else {
            statusObject.title = 'Alteration Awaiting';
            statusObject.color = colors.darkThemeColor;
            statusObject.desc = `You sent a scorekeeper alteration request to ${getScorekeeper()}.`;
          }
        } else {
          if (reservationObject.requested_by === reservationObject.scorekeeper_id) {
            statusObject.title = 'Alteration Awaiting';
            statusObject.color = colors.darkThemeColor;
            statusObject.desc = `You sent a scorekeeper alteration request to ${getTeamB()}.`;
          } else {
            statusObject.title = 'Alteration Pending';
            statusObject.color = colors.darkThemeColor;
            statusObject.desc = <>You received a scorekeeper alteration request from {getTeamB()}. Please, respond within {<Text style={styles.timeColor}>{getDayTimeDifferent(
              reservationObject?.expiry_datetime * 1000,
              new Date().getTime(),
              )}</Text>}.</>;
          }
        }
      }
    } else if (
      reservationObject.status
      === ScorekeeperReservationStatus.pendingrequestpayment
    ) {
      if (reservationObject?.scorekeeper?.user_id === entity.uid) {
        statusObject.title = 'Awaiting Payment';
        statusObject.color = colors.themeColor;
        statusObject.desc = `You has accepted a scorekeeper reservation alteration request from ${getTeamB()}, but the payment hasn't gone through yet.`;
      } else {
        statusObject.title = 'Pending Payment';
        statusObject.color = colors.themeColor;
        statusObject.desc = `${getScorekeeper()} has accepted your scorekeeper reservation alteration request, but your payment hasn't gone through yet.`;
      }
    }

    console.log('Status obj::=>', statusObject);
    return statusObject;
  };

  const getTeamB = () => {
    const obj = entityList.filter(
      (o) => o?.user_id === reservationObject?.initiated_by || o?.group_id === reservationObject?.initiated_by,
    );
    console.log('obj obj::=>', obj);

    if (obj[0]?.user_id) {
      return `${obj[0]?.full_name}`;
    }
    return `${obj[0]?.group_name}`;
  };

  const getTeamA = () => {
    const obj = entityList.filter(
      (o) => o?.user_id === reservationObject?.approved_by || o?.group_id === reservationObject?.approved_by,
    );
    if (obj[0]?.user_id) {
      return `${obj[0]?.full_name}`;
    }
    return `${obj[0]?.group_name}`;
  };
  const getScorekeeper = () => {
    const obj = entityList.filter(
      (o) => o?.user_id === reservationObject?.scorekeeper_id,
    );
    return `${obj[0]?.full_name}`;
  };
  return (
    <View
      style={containerStyle}>
      <Text
        style={[styles.challengeTitle, { color: getTitle()?.color, fontSize }]}>
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
  },
  timeColor: { color: colors.themeColor },
});

// export default memo(ScorekeeperReservationTitle);
