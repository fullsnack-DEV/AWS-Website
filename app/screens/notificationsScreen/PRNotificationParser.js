import moment from 'moment';
import strings from '../../Constants/String'
import { toShortTimeFromString } from '../../utils/Time';
import NotificationType from '../../Constants/NotificationType';

const offsetFrom = (expiryDate) => {
  const minute = moment(expiryDate).diff(new Date(), 'minute');
  const hour = moment(expiryDate).diff(new Date(), 'hour');
  const day = moment(expiryDate).diff(new Date(), 'day');

  let finalText
  if (minute > 0) {
    if (!finalText) {
      finalText = `${minute % 60}m`
    }
  }
  if (hour > 0) {
    if (!finalText) {
      finalText = `${hour % 24}h`
    } else {
      finalText = `${hour % 24}h ${finalText}`
    }
  }
  if (day > 0) {
    if (!finalText) {
      finalText = `${day}d`
    } else {
      finalText = `${day}d ${finalText}`
    }
  }

  if (!finalText) {
    finalText = '00:00'
  }
  return finalText
}

const parseChallengeRequestNotification = async (data, selectedEntity, loggedInEntity) => {
  const activity = data.activities[0]
  let notificationObject
  let challengeObject

  const finalString = {}

  if (activity.object) {
    notificationObject = JSON.parse(activity.object);
  }

  if (notificationObject.challengeObject) {
    challengeObject = notificationObject.challengeObject
  } else if (notificationObject.newChallengeObject) {
    challengeObject = notificationObject.newChallengeObject
  }

  let team = challengeObject.away_team

  if (team.group_id) {
    if (team.group_id === selectedEntity.group_id) {
      team = challengeObject.home_team;
    }

    finalString.firstTitle = team.group_name
    finalString.expiryText = '00:00'
    if (challengeObject.status) {
      const status = challengeObject.status
      if (status === 'offered' || status === 'counterOffered' || status === 'changeRequest') {
        if (challengeObject.offer_expiry) {
          const expDate = new Date(challengeObject.offer_expiry * 1000)
          finalString.expiryText = offsetFrom(expDate)
          if (moment(expDate).diff(new Date(), 'minute') <= 0) {
            finalString.isExpired = true
          }
        }

        if (challengeObject.start_datetime) {
          const expDate = new Date(challengeObject.start_datetime * 1000)
          if (moment(expDate).diff(new Date(), 'minute') <= 0) {
            finalString.isGameTimePassed = true
          }
        }
      }
    }
    finalString.doneByText = strings.doneByText
    finalString.doneByTitle = activity.actor.data.full_name || ''
  } else {
    if (team.user_id === loggedInEntity.auth.user_id) {
      team = challengeObject.home_team;
    }
    finalString.firstTitle = `${team.first_name} ${team.last_name}`
    if (challengeObject.offer_expiry) {
      const expDate = new Date(challengeObject.offer_expiry * 1000)
      finalString.expiryText = offsetFrom(expDate)
      if (moment(expDate).diff(new Date(), 'minute') <= 0) {
        finalString.isExpired = true
      }
    }

    if (challengeObject.start_datetime) {
      const expDate = new Date(challengeObject.start_datetime * 1000)
      if (moment(expDate).diff(new Date(), 'minute') <= 0) {
        finalString.isGameTimePassed = true
      }
    }
  }

  finalString.text = notificationObject.text
  finalString.entityType = 'team'
  finalString.imgName = team.thumbnail

  if (data && data.created_at) {
    finalString.notificationTime = toShortTimeFromString(`${data.created_at}+0000`)
  }

  return finalString
}

const parseRefereeRequestNotification = async (data, loggedInEntity) => {
  const activity = data.activities[0]
  let notificationObject
  const finalString = {}

  if (activity.object) {
    notificationObject = JSON.parse(activity.object);
  }

  const reservationObject = notificationObject.reservationObject

  if (loggedInEntity.uid === reservationObject.initiated_by
    || loggedInEntity.auth.user_id === reservationObject.initiated_by) {
    finalString.firstTitle = `${reservationObject.updated_by.first_name} ${reservationObject.updated_by.last_name}`
    if (reservationObject.referee.thumbnail) {
      finalString.entityType = 'user'
      finalString.imgName = reservationObject.referee.thumbnail
    }
  } else if (reservationObject.game.singlePlayerGame) {
    finalString.entityType = 'team'
    if (reservationObject.initiated_by === reservationObject.game.away_team.user_id) {
      finalString.firstTitle = `${reservationObject.game.away_team.first_name} ${reservationObject.game.away_team.last_name}`
      if (reservationObject.game.away_team.thumbnail) {
        finalString.imgName = reservationObject.game.away_team.thumbnail
      }
    } else {
      finalString.firstTitle = `${reservationObject.game.home_team.first_name} ${reservationObject.game.home_team.last_name}`
      if (reservationObject.game.home_team.thumbnail) {
        finalString.imgName = reservationObject.game.home_team.thumbnail
      }
    }
  } else if (reservationObject.initiated_by === reservationObject.game.away_team.group_id) {
    finalString.entityType = 'team'
    finalString.firstTitle = reservationObject.game.away_team.group_name
    if (reservationObject.game.away_team.thumbnail) {
      finalString.imgName = reservationObject.game.away_team.thumbnail
    }
  } else {
    finalString.entityType = 'team'
    finalString.firstTitle = reservationObject.game.home_team.group_name
    if (reservationObject.game.home_team.thumbnail) {
      finalString.imgName = reservationObject.game.home_team.thumbnail
    }
  }

  finalString.isExpired = false
  finalString.expiryText = '00:00'
  if (reservationObject.status === 'offered' || reservationObject.status === 'changeRequest') {
    if (reservationObject.expiry_datetime) {
      const expDate = new Date(reservationObject.expiry_datetime * 1000)
      finalString.expiryText = offsetFrom(expDate)
      if (moment(expDate).diff(new Date(), 'minute') <= 0) {
        finalString.isExpired = true
      }
    }
  }

  finalString.text = notificationObject.text

  if (data && data.created_at) {
    finalString.notificationTime = toShortTimeFromString(`${data.created_at}+0000`)
  }

  return finalString
}

const parseChallengeAwaitingPaymentRequestNotification = async (data, selectedEntity, loggedInEntity) => {
  const activity = data.activities[0]
  let notificationObject
  let challengeObject

  const finalString = {}

  if (activity.object) {
    notificationObject = JSON.parse(activity.object);
  }

  if (notificationObject.challengeObject) {
    challengeObject = notificationObject.challengeObject
  } else if (notificationObject.newChallengeObject) {
    challengeObject = notificationObject.newChallengeObject
  }

  let team = challengeObject.away_team

  if (team.group_id) {
    if (team.group_id === selectedEntity.group_id) {
      team = challengeObject.home_team;
    }
    finalString.firstTitle = team.group_name
  } else {
    if (team.user_id === loggedInEntity.auth.user_id) {
      team = challengeObject.home_team;
    }
    finalString.firstTitle = `${team.first_name} ${team.last_name}`
  }

  finalString.firstTitle = notificationObject.team_name
  finalString.text = notificationObject.text
  const parts = notificationObject.text.split(notificationObject.team_name)
  if (parts[0]) {
    finalString.preText = parts[0]
  }
  if (parts[1]) {
    finalString.text = parts[1]
  }

  finalString.entityType = 'team'
  finalString.imgName = team.thumbnail

  if (data && data.created_at) {
    finalString.notificationTime = toShortTimeFromString(`${data.created_at}+0000`)
  }

  return finalString
}

const parseRefereeAwaitingPaymentRequestNotification = async (data, loggedInEntity) => {
  const activity = data.activities[0]
  let notificationObject
  const finalString = {}

  if (activity.object) {
    notificationObject = JSON.parse(activity.object);
  }

  const reservationObject = notificationObject.reservationObject

  if (loggedInEntity.uid === reservationObject.initiated_by
      || loggedInEntity.auth.user_id === reservationObject.initiated_by) {
    if (reservationObject.referee.thumbnail) {
      finalString.entityType = 'user'
      finalString.imgName = reservationObject.referee.thumbnail
    }
  } else if (reservationObject.game.singlePlayerGame) {
    finalString.entityType = 'team'
    if (reservationObject.initiated_by === reservationObject.game.away_team.user_id) {
      if (reservationObject.game.away_team.thumbnail) {
        finalString.imgName = reservationObject.game.away_team.thumbnail
      }
    } else if (reservationObject.game.home_team.thumbnail) {
      finalString.imgName = reservationObject.game.home_team.thumbnail
    }
  } else if (reservationObject.initiated_by === reservationObject.game.away_team.group_id) {
    finalString.entityType = 'team'
    if (reservationObject.game.away_team.thumbnail) {
      finalString.imgName = reservationObject.game.away_team.thumbnail
    }
  } else if (reservationObject.game.home_team.thumbnail) {
    finalString.entityType = 'team'
    finalString.imgName = reservationObject.game.home_team.thumbnail
  }

  finalString.firstTitle = notificationObject.team_name
  finalString.text = notificationObject.text
  const parts = notificationObject.text.split(notificationObject.team_name)
  if (parts[0]) {
    finalString.preText = parts[0]
  }
  if (parts[1]) {
    finalString.text = parts[1]
  }

  if (data && data.created_at) {
    finalString.notificationTime = toShortTimeFromString(`${data.created_at}+0000`)
  }

  return finalString
}
export const parseRequest = async (data, selectedEntity, loggedInEntity) => {
  if (data.activities[0].verb.includes(NotificationType.challengeOffered)
    || data.activities[0].verb.includes(NotificationType.challengeAltered)) {
    return parseChallengeRequestNotification(data, selectedEntity, loggedInEntity)
  }
  if (data.activities[0].verb.includes(NotificationType.initialChallengePaymentFail)
    || data.activities[0].verb.includes(NotificationType.alterChallengePaymentFail)
    || data.activities[0].verb.includes(NotificationType.challengeAwaitingPaymentPaid)
    || data.activities[0].verb.includes(NotificationType.gameAutoCanceledDueToInitialPaymentFailed)
    || data.activities[0].verb.includes(NotificationType.gameAutoRestoredDueToAlterPaymentFailed)
    || data.activities[0].verb.includes(NotificationType.gameCanceledDuringAwaitingPayment)
    || data.activities[0].verb.includes(NotificationType.gameRestoredDuringAwaitingPayment)) {
    return parseChallengeAwaitingPaymentRequestNotification(data, selectedEntity, loggedInEntity)
  } if (data.activities[0].verb.includes(NotificationType.refereeRequest)
    || data.activities[0].verb.includes(NotificationType.changeRefereeRequest)
    || data.activities[0].verb.includes(NotificationType.scorekeeperRequest)) {
    return parseRefereeRequestNotification(data, loggedInEntity)
  } if (data.activities[0].verb.includes(NotificationType.refereeReservationInitialPaymentFail)
    || data.activities[0].verb.includes(NotificationType.refereeReservationAlterPaymentFail)
    || data.activities[0].verb.includes(NotificationType.refereeReservationAwaitingPaymentPaid)
    || data.activities[0].verb.includes(NotificationType.refereeReservationAutoCanceledDueToInitialPaymentFailed)
    || data.activities[0].verb.includes(NotificationType.refereeReservationAutoRestoredDueToAlterPaymentFailed)
    || data.activities[0].verb.includes(NotificationType.refereeReservationCanceledDuringAwaitingPayment)
    || data.activities[0].verb.includes(NotificationType.refereeReservationRestoredDuringAwaitingPayment)) {
    return parseRefereeAwaitingPaymentRequestNotification(data, loggedInEntity)
  }
  return {}
}

export const parseInviteRequest = async (data) => {
  const activity = data.activities[0]
  let notificationObject

  const finalString = {}

  if (activity.object) {
    notificationObject = JSON.parse(activity.object);
  }

  finalString.firstTitle = activity.actor.data.full_name

  finalString.text = notificationObject.text
  finalString.entityType = activity.actor.data.entity_type === 'player' ? 'user' : activity.actor.data.entity_type
  if (activity.actor.data.thumbnail) {
    finalString.imgName = activity.actor.data.thumbnail
  }

  if (data && data.created_at) {
    finalString.notificationTime = toShortTimeFromString(`${data.created_at}+0000`)
  }

  return finalString
}

const parseNormalNotification = async (data) => {
  const activity = data.activities[0]
  let notificationObject

  const finalString = {}

  if (activity.object) {
    notificationObject = JSON.parse(activity.object);
  }

  finalString.firstTitle = activity.actor.data.full_name

  // if (data.data.actor_count > 2) {
  //   firstTitle = `${firstTitle}, ${data.data.activities[1].actor.data.full_name}`
  //   const count = data.data.actor_count - 2
  //   secondTitle = count > 1 ? `${count} ${strings.others}` : `${count} ${strings.other}`
  // } else if (data.data.actor_count > 1) {
  //   secondTitle = data.data.activities[1].actor.data.full_name
  // }

  finalString.text = notificationObject.text
  finalString.entityType = activity.actor.data.entity_type === 'player' ? 'user' : activity.actor.data.entity_type
  if (activity.actor.data.thumbnail) {
    finalString.imgName = activity.actor.data.thumbnail
  }

  if (data && data.created_at) {
    finalString.notificationTime = toShortTimeFromString(`${data.created_at}+0000`)
  }

  return finalString
}

export const parseNotification = async (data) => parseNormalNotification(data)

export default parseRequest
