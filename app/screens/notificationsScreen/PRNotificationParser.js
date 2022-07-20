import moment from 'moment';
import strings from '../../Constants/String';
import {toShortTimeFromString} from '../../utils/Time';
import NotificationType from '../../Constants/NotificationType';

const offsetFrom = (expiryDate) => {
  const minute = moment(expiryDate).diff(new Date(), 'minute');
  const hour = moment(expiryDate).diff(new Date(), 'hour');
  const day = moment(expiryDate).diff(new Date(), 'day');

  let finalText;
  if (minute > 0) {
    if (!finalText) {
      finalText = `${minute % 60}m`;
    }
  }
  if (hour > 0) {
    if (!finalText) {
      finalText = `${hour % 24}h`;
    } else {
      finalText = `${hour % 24}h ${finalText}`;
    }
  }
  if (day > 0) {
    if (!finalText) {
      finalText = `${day}d`;
    } else {
      finalText = `${day}d ${finalText}`;
    }
  }

  if (!finalText) {
    finalText = '00:00';
  }
  return finalText;
};

const parseChallengeRequestNotification = async (
  data,
  selectedEntity,
  loggedInEntity,
) => {
  const activity = data.activities[0];
  let notificationObject;
  let challengeObject;

  const finalString = {};

  if (activity.object) {
    notificationObject = JSON.parse(activity.object);
  }

  if (notificationObject.challengeObject) {
    challengeObject = notificationObject.challengeObject;
  } else if (notificationObject.newChallengeObject) {
    challengeObject = notificationObject.newChallengeObject;
  }

  finalString.entityType = 'team';

  let team = challengeObject.away_team;

  if (team.group_id) {
    if (team.group_id === selectedEntity.group_id) {
      team = challengeObject.home_team;
    }
    finalString.entityId = team.group_id;
    finalString.firstTitle = team.group_name;
    finalString.expiryText = '00:00';
    if (challengeObject.status) {
      const status = challengeObject.status;
      if (
        status === 'offered' ||
        status === 'counterOffered' ||
        status === 'changeRequest'
      ) {
        if (challengeObject.offer_expiry) {
          const expDate = new Date(challengeObject.offer_expiry * 1000);
          finalString.expiryText = offsetFrom(expDate);
          if (moment(expDate).diff(new Date(), 'minute') <= 0) {
            finalString.isExpired = true;
          }
        }

        if (challengeObject.start_datetime) {
          const expDate = new Date(challengeObject.start_datetime * 1000);
          if (moment(expDate).diff(new Date(), 'minute') <= 0) {
            finalString.isGameTimePassed = true;
          }
        }
      }
    }
    finalString.doneByText = strings.doneByText;
    finalString.doneByTitle = activity?.actor?.data?.full_name || '';
  } else {
    finalString.entityType = 'user';
    if (team.user_id === loggedInEntity.auth.user_id) {
      team = challengeObject.home_team;
    }

    finalString.entityId = team.user_id;
    finalString.firstTitle = `${team.first_name} ${team.last_name}`;
    if (challengeObject.offer_expiry) {
      const expDate = new Date(challengeObject.offer_expiry * 1000);
      finalString.expiryText = offsetFrom(expDate);
      if (moment(expDate).diff(new Date(), 'minute') <= 0) {
        finalString.isExpired = true;
      }
    }

    if (challengeObject.start_datetime) {
      const expDate = new Date(challengeObject.start_datetime * 1000);
      if (moment(expDate).diff(new Date(), 'minute') <= 0) {
        finalString.isGameTimePassed = true;
      }
    }
  }

  finalString.text = notificationObject.text;
  finalString.imgName = team.thumbnail;

  if (data && data.created_at) {
    finalString.notificationTime = toShortTimeFromString(
      `${data.created_at}+0000`,
    );
  }

  return finalString;
};

const parseRefereeRequestNotification = async (data) => {
  const activity = data.activities[0];
  let notificationObject;
  const finalString = {};

  if (activity.object) {
    notificationObject = JSON.parse(activity.object);
  }

  const reservationObject = notificationObject.reservation;

  if (reservationObject.referee_id === reservationObject.requested_by) {
    finalString.firstTitle = `${reservationObject.updated_by.first_name} ${reservationObject.updated_by.last_name}`;
    finalString.entityType = 'user';
    finalString.entityId = reservationObject.referee_id;
    if (reservationObject.referee?.thumbnail) {
      finalString.imgName = reservationObject.referee.thumbnail;
    }
  } else if (reservationObject.game.user_challenge) {
    finalString.entityType = 'user';
    if (
      reservationObject.requested_by ===
      reservationObject.game.away_team.user_id
    ) {
      finalString.firstTitle = `${reservationObject.game.away_team.first_name} ${reservationObject.game.away_team.last_name}`;
      if (reservationObject.game.away_team.thumbnail) {
        finalString.imgName = reservationObject.game.away_team.thumbnail;
      }
      finalString.entityId = reservationObject.game.away_team.user_id;
    } else {
      finalString.firstTitle = `${reservationObject.game.home_team.first_name} ${reservationObject.game.home_team.last_name}`;
      if (reservationObject.game.home_team.thumbnail) {
        finalString.imgName = reservationObject.game.home_team.thumbnail;
      }
      finalString.entityId = reservationObject.game.home_team.user_id;
    }
  } else if (
    reservationObject.requested_by === reservationObject.game.away_team.group_id
  ) {
    finalString.entityType = 'team';
    finalString.entityId = reservationObject.game.away_team.group_id;
    finalString.firstTitle = reservationObject.game.away_team.group_name;
    if (reservationObject.game.away_team.thumbnail) {
      finalString.imgName = reservationObject.game.away_team.thumbnail;
    }
  } else {
    finalString.entityType = 'team';
    finalString.entityId = reservationObject.game.home_team.group_id;
    finalString.firstTitle = reservationObject.game.home_team.group_name;
    if (reservationObject.game.home_team.thumbnail) {
      finalString.imgName = reservationObject.game.home_team.thumbnail;
    }
  }

  finalString.isExpired = false;
  finalString.expiryText = '00:00';
  if (
    reservationObject.status === 'offered' ||
    reservationObject.status === 'changeRequest'
  ) {
    if (reservationObject.expiry_datetime) {
      const expDate = new Date(reservationObject.expiry_datetime * 1000);
      finalString.expiryText = offsetFrom(expDate);
      if (moment(expDate).diff(new Date(), 'minute') <= 0) {
        finalString.isExpired = true;
      }
    }
  }

  finalString.text = notificationObject.text;

  if (data && data.created_at) {
    finalString.notificationTime = toShortTimeFromString(
      `${data.created_at}+0000`,
    );
  }

  return finalString;
};
const parseScorekeeperRequestNotification = async (data) => {
  const activity = data.activities[0];
  let notificationObject;
  const finalString = {};

  if (activity.object) {
    notificationObject = JSON.parse(activity.object);
  }

  const reservationObject = notificationObject.reservation;

  if (reservationObject.scorekeeper_id === reservationObject.requested_by) {
    finalString.firstTitle = `${reservationObject.updated_by.first_name} ${reservationObject.updated_by.last_name}`;
    finalString.entityType = 'user';
    finalString.entityId = reservationObject.scorekeeper_id;
    if (reservationObject.scorekeeper?.thumbnail) {
      finalString.imgName = reservationObject.scorekeeper.thumbnail;
    }
  } else if (reservationObject.game.user_challenge) {
    finalString.entityType = 'user';
    if (
      reservationObject.requested_by ===
      reservationObject.game.away_team.user_id
    ) {
      finalString.firstTitle = `${reservationObject.game.away_team.first_name} ${reservationObject.game.away_team.last_name}`;
      if (reservationObject.game.away_team.thumbnail) {
        finalString.imgName = reservationObject.game.away_team.thumbnail;
      }
      finalString.entityId = reservationObject.game.away_team.user_id;
    } else {
      finalString.firstTitle = `${reservationObject.game.home_team.first_name} ${reservationObject.game.home_team.last_name}`;
      if (reservationObject.game.home_team.thumbnail) {
        finalString.imgName = reservationObject.game.home_team.thumbnail;
      }
      finalString.entityId = reservationObject.game.home_team.user_id;
    }
  } else if (
    reservationObject.requested_by === reservationObject.game.away_team.group_id
  ) {
    finalString.entityType = 'team';
    finalString.entityId = reservationObject.game.away_team.group_id;
    finalString.firstTitle = reservationObject.game.away_team.group_name;
    if (reservationObject.game.away_team.thumbnail) {
      finalString.imgName = reservationObject.game.away_team.thumbnail;
    }
  } else {
    finalString.entityType = 'team';
    finalString.entityId = reservationObject.game.home_team.group_id;
    finalString.firstTitle = reservationObject.game.home_team.group_name;
    if (reservationObject.game.home_team.thumbnail) {
      finalString.imgName = reservationObject.game.home_team.thumbnail;
    }
  }

  finalString.isExpired = false;
  finalString.expiryText = '00:00';
  if (
    reservationObject.status === 'offered' ||
    reservationObject.status === 'changeRequest'
  ) {
    if (reservationObject.expiry_datetime) {
      const expDate = new Date(reservationObject.expiry_datetime * 1000);
      finalString.expiryText = offsetFrom(expDate);
      if (moment(expDate).diff(new Date(), 'minute') <= 0) {
        finalString.isExpired = true;
      }
    }
  }

  finalString.text = notificationObject.text;

  if (data && data.created_at) {
    finalString.notificationTime = toShortTimeFromString(
      `${data.created_at}+0000`,
    );
  }

  return finalString;
};

const parseChallengeAwaitingPaymentRequestNotification = async (
  data,
  selectedEntity,
  loggedInEntity,
) => {
  const activity = data.activities[0];
  let notificationObject;
  let challengeObject;

  const finalString = {};

  if (activity.object) {
    notificationObject = JSON.parse(activity.object);
  }

  if (notificationObject.challengeObject) {
    challengeObject = notificationObject.challengeObject;
  } else if (notificationObject.newChallengeObject) {
    challengeObject = notificationObject.newChallengeObject;
  }

  let team = challengeObject.away_team;

  if (team.group_id) {
    finalString.entityType = 'team';
    if (team.group_id === selectedEntity.group_id) {
      team = challengeObject.home_team;
    }
    finalString.entityId = team.group_id;
    finalString.firstTitle = team.group_name;
  } else {
    finalString.entityType = 'user';
    if (team.user_id === loggedInEntity.auth.user_id) {
      team = challengeObject.home_team;
    }

    finalString.entityId = team.user_id;

    finalString.firstTitle = `${team.first_name} ${team.last_name}`;
  }

  finalString.firstTitle = notificationObject.team_name;
  finalString.text = notificationObject.text;
  const parts = notificationObject.text.split(notificationObject.team_name);
  if (parts[0]) {
    finalString.preText = parts[0];
  }
  if (parts[1]) {
    finalString.text = parts[1];
  }

  finalString.imgName = team.thumbnail;

  if (data && data.created_at) {
    finalString.notificationTime = toShortTimeFromString(
      `${data.created_at}+0000`,
    );
  }

  return finalString;
};

const parseRefereeAwaitingPaymentRequestNotification = async (data) => {
  const activity = data.activities[0];
  let notificationObject;
  const finalString = {};

  if (activity.object) {
    notificationObject = JSON.parse(activity.object);
  }

  finalString.firstTitle = notificationObject.team_name;
  finalString.entityType = notificationObject.entity_type;
  finalString.entityId = notificationObject.team_id;
  finalString.text = notificationObject.text;

  const reservationObject = notificationObject.reservationObject;

  if (finalString.entityId === reservationObject.referee_id) {
    if (reservationObject.referee?.thumbnail) {
      finalString.imgName = reservationObject.referee.thumbnail;
    }
  } else if (reservationObject.game.user_challenge) {
    if (finalString.entityId === reservationObject.game.away_team.user_id) {
      if (reservationObject.game.away_team.thumbnail) {
        finalString.imgName = reservationObject.game.away_team.thumbnail;
      }
    } else if (reservationObject.game.home_team.thumbnail) {
      finalString.imgName = reservationObject.game.home_team.thumbnail;
    }
  } else if (
    finalString.entityId === reservationObject.game.away_team.group_id
  ) {
    if (reservationObject.game.away_team.thumbnail) {
      finalString.imgName = reservationObject.game.away_team.thumbnail;
    }
  } else if (reservationObject.game.home_team.thumbnail) {
    finalString.imgName = reservationObject.game.home_team.thumbnail;
  }

  const parts = notificationObject.text.split(notificationObject.team_name);
  if (parts[0]) {
    finalString.preText = parts[0];
  }
  if (parts[1]) {
    finalString.text = parts[1];
  }

  if (data && data.created_at) {
    finalString.notificationTime = toShortTimeFromString(
      `${data.created_at}+0000`,
    );
  }

  return finalString;
};

const parseScorekeeperAwaitingPaymentRequestNotification = async (data) => {
  const activity = data.activities[0];
  let notificationObject;
  const finalString = {};

  if (activity.object) {
    notificationObject = JSON.parse(activity.object);
  }

  finalString.firstTitle = notificationObject.team_name;
  finalString.entityType = notificationObject.entity_type;
  finalString.entityId = notificationObject.team_id;
  finalString.text = notificationObject.text;

  const reservationObject = notificationObject.reservationObject;

  if (finalString.entityId === reservationObject.scorekeeper_id) {
    if (reservationObject.scorekeeper?.thumbnail) {
      finalString.imgName = reservationObject.scorekeeper.thumbnail;
    }
  } else if (reservationObject.game.user_challenge) {
    if (finalString.entityId === reservationObject.game.away_team.user_id) {
      if (reservationObject.game.away_team.thumbnail) {
        finalString.imgName = reservationObject.game.away_team.thumbnail;
      }
    } else if (reservationObject.game.home_team.thumbnail) {
      finalString.imgName = reservationObject.game.home_team.thumbnail;
    }
  } else if (
    finalString.entityId === reservationObject.game.away_team.group_id
  ) {
    if (reservationObject.game.away_team.thumbnail) {
      finalString.imgName = reservationObject.game.away_team.thumbnail;
    }
  } else if (reservationObject.game.home_team.thumbnail) {
    finalString.imgName = reservationObject.game.home_team.thumbnail;
  }

  const parts = notificationObject.text.split(notificationObject.team_name);
  if (parts[0]) {
    finalString.preText = parts[0];
  }
  if (parts[1]) {
    finalString.text = parts[1];
  }

  if (data && data.created_at) {
    finalString.notificationTime = toShortTimeFromString(
      `${data.created_at}+0000`,
    );
  }

  return finalString;
};

export const parseRequest = async (data, selectedEntity, loggedInEntity) => {
  if (
    data.activities[0].verb.includes(NotificationType.challengeOffered) ||
    data.activities[0].verb.includes(NotificationType.challengeAltered)
  ) {
    return parseChallengeRequestNotification(
      data,
      selectedEntity,
      loggedInEntity,
    );
  }
  if (
    data.activities[0].verb.includes(
      NotificationType.initialChallengePaymentFail,
    ) ||
    data.activities[0].verb.includes(
      NotificationType.alterChallengePaymentFail,
    ) ||
    data.activities[0].verb.includes(
      NotificationType.challengeAwaitingPaymentPaid,
    ) ||
    data.activities[0].verb.includes(
      NotificationType.gameAutoCanceledDueToInitialPaymentFailed,
    ) ||
    data.activities[0].verb.includes(
      NotificationType.gameAutoRestoredDueToAlterPaymentFailed,
    ) ||
    data.activities[0].verb.includes(
      NotificationType.gameCanceledDuringAwaitingPayment,
    ) ||
    data.activities[0].verb.includes(
      NotificationType.gameRestoredDuringAwaitingPayment,
    )
  ) {
    return parseChallengeAwaitingPaymentRequestNotification(
      data,
      selectedEntity,
      loggedInEntity,
    );
  }
  if (
    data.activities[0].verb.includes(NotificationType.refereeRequest) ||
    data.activities[0].verb.includes(NotificationType.changeRefereeRequest)
  ) {
    return parseRefereeRequestNotification(data);
  }
  if (
    data.activities[0].verb.includes(
      NotificationType.refereeReservationInitialPaymentFail,
    ) ||
    data.activities[0].verb.includes(
      NotificationType.refereeReservationAlterPaymentFail,
    ) ||
    data.activities[0].verb.includes(
      NotificationType.refereeReservationAwaitingPaymentPaid,
    ) ||
    data.activities[0].verb.includes(
      NotificationType.refereeReservationAutoCanceledDueToInitialPaymentFailed,
    ) ||
    data.activities[0].verb.includes(
      NotificationType.refereeReservationAutoRestoredDueToAlterPaymentFailed,
    ) ||
    data.activities[0].verb.includes(
      NotificationType.refereeReservationCanceledDuringAwaitingPayment,
    ) ||
    data.activities[0].verb.includes(
      NotificationType.refereeReservationRestoredDuringAwaitingPayment,
    )
  ) {
    return parseRefereeAwaitingPaymentRequestNotification(data);
  }
  if (
    data.activities[0].verb.includes(NotificationType.scorekeeperRequest) ||
    data.activities[0].verb.includes(NotificationType.changeScorekeeperRequest)
  ) {
    return parseScorekeeperRequestNotification(data);
  }
  if (
    data.activities[0].verb.includes(
      NotificationType.scorekeeperReservationInitialPaymentFail,
    ) ||
    data.activities[0].verb.includes(
      NotificationType.scorekeeperReservationAlterPaymentFail,
    ) ||
    data.activities[0].verb.includes(
      NotificationType.scorekeeperReservationAwaitingPaymentPaid,
    ) ||
    data.activities[0].verb.includes(
      NotificationType.scorekeeperReservationAutoCanceledDueToInitialPaymentFailed,
    ) ||
    data.activities[0].verb.includes(
      NotificationType.scorekeeperReservationAutoRestoredDueToAlterPaymentFailed,
    ) ||
    data.activities[0].verb.includes(
      NotificationType.scorekeeperReservationCanceledDuringAwaitingPayment,
    ) ||
    data.activities[0].verb.includes(
      NotificationType.scorekeeperReservationRestoredDuringAwaitingPayment,
    )
  ) {
    return parseScorekeeperAwaitingPaymentRequestNotification(data);
  }

  return {};
};

export const parseInviteRequest = async (data) => {
  const activity = data.activities[0];
  let notificationObject;

  const finalString = {};

  if (activity.object) {
    notificationObject = JSON.parse(activity.object);
  }

  finalString.firstTitle = activity?.actor?.data?.full_name;

  finalString.text = notificationObject.text;
  finalString.entityType =
    activity?.actor?.data?.entity_type === 'player'
      ? 'user'
      : activity?.actor?.data?.entity_type;
  if (activity?.actor?.data?.thumbnail) {
    finalString.imgName = activity?.actor?.data?.thumbnail;
  }

  if (data && data.created_at) {
    finalString.notificationTime = toShortTimeFromString(
      `${data.created_at}+0000`,
    );
  }

  return finalString;
};

const parseNormalNotification = async (data) => {
  console.log('ALL DATA:=>', data);
  const activity = data.activities[0];
  let activity2;

  let notificationObject;

  const finalString = {};

  if (activity.object) {
    notificationObject = JSON.parse(activity.object);
  }
  console.log('Activity data:=>', activity);
  finalString.text = notificationObject.text;
  finalString.entityType =
    activity?.actor?.data?.entity_type === 'player'
      ? 'user'
      : activity?.actor?.data?.entity_type;
  finalString.entityId = activity?.actor?.id;
  finalString.firstTitle = activity?.actor?.data?.full_name;

  if (data.activities.length > 1) {
    activity2 = data.activities[1];
    finalString.entityType1 =
      activity2?.actor?.data?.entity_type === 'player'
        ? 'user'
        : activity2?.actor?.data?.entity_type;
    finalString.entityId1 = activity2?.actor?.id;
    finalString.firstTitle1 = activity2?.actor?.data?.full_name;
  }

  if (data.actor_count > 2) {
    finalString.firstTitle = `${finalString.firstTitle}, ${data?.activities?.[1]?.actor?.data?.full_name}`;
    const count = data.actor_count - 2;
    finalString.secondTitle =
      count > 1 ? `${count} ${strings.others}` : `${count} ${strings.other}`;
  } else if (data.actor_count > 1) {
    finalString.secondTitle = data?.activities?.[1]?.actor?.data?.full_name;
  }

  if (activity?.actor?.data?.thumbnail) {
    finalString.imgName = activity?.actor?.data?.thumbnail;
  }

  if (data && data.created_at) {
    finalString.notificationTime = toShortTimeFromString(
      `${data.created_at}+0000`,
    );
  }

  return finalString;
};

export const parseNotification = async (data) => parseNormalNotification(data);

export default parseRequest;
