const NotificationType = {
  // Invite Notification
  inviteToJoinClub: 'inviteToJoinClub',
  invitePlayerToJoinTeam: 'inviteUserToJointeam',
  invitePlayerToJoinClub: 'inviteUserToJoinclub',
  inviteToConnectProfile: 'inviteToConnectProfile',
  invitePlayerToJoingame: 'inviteUserToJoingame',
  inviteToDoubleTeam: 'inviteToDoubleTeam',
  inviteToEvent: 'inviteToEvent',
  teamRequestedToJoinGroup: 'teamRequestedJoingroup',
  // Challenge notificaton
  challengeOffered: 'challengeOffered',
  challengeAltered: 'challengeAltered',
  // Referee request
  refereeRequest: 'refereeRequest',
  changeRefereeRequest: 'changeRefereeRequest',
  scorekeeperRequest: 'scorekeeperRequest',
  changeScorekeeperRequest: 'changeScorekeeperRequest',

  gameCancelled: 'gameCancelled',
  gameAccepted: 'gameAccepted',
  initialChallengePaymentFail: 'initialChallengePaymentFail',
  alterChallengePaymentFail: 'alterChallengePaymentFail',
  challengeAwaitingPaymentPaid: 'challengeAwaitingPaymentPaid',
  gameAutoCanceledDueToInitialPaymentFailed:
    'gameAutoCanceledDueToInitialPaymentFailed',
  gameAutoRestoredDueToAlterPaymentFailed:
    'gameAutoRestoredDueToAlterPaymentFailed',
  gameCanceledDuringAwaitingPayment: 'gameCanceledDuringAwaitingPayment',
  gameRestoredDuringAwaitingPayment: 'gameRestoredDuringAwaitingPayment',

  refereeReservationApproved: 'refereeReservationApproved',
  refereeReservationCancelled: 'refereeReservationCancelled',
  refereeReservationAccepted: 'refereeReservationAccepted',
  refereeReservationInitialPaymentFail: 'refereeReservationInitialPaymentFail',
  refereeReservationAlterPaymentFail: 'refereeReservationAlterPaymentFail',
  refereeReservationAwaitingPaymentPaid:
    'refereeReservationAwaitingPaymentPaid',
  refereeReservationAutoCanceledDueToInitialPaymentFailed:
    'refereeReservationAutoCanceledDueToInitialPaymentFailed',
  refereeReservationAutoRestoredDueToAlterPaymentFailed:
    'refereeReservationAutoRestoredDueToAlterPaymentFailed',
  refereeReservationCanceledDuringAwaitingPayment:
    'refereeReservationCanceledDuringAwaitingPayment',
  refereeReservationRestoredDuringAwaitingPayment:
    'refereeReservationRestoredDuringAwaitingPayment',

  scorekeeperReservationApproved: 'scorekeeperReservationApproved',
  scorekeeperReservationCancelled: 'scorekeeperReservationCancelled',
  scorekeeperReservationAccepted: 'scorekeeperReservationAccepted',
  scorekeeperReservationInitialPaymentFail:
    'scorekeeperReservationInitialPaymentFail',
  scorekeeperReservationAlterPaymentFail:
    'scorekeeperReservationAlterPaymentFail',
  scorekeeperReservationAwaitingPaymentPaid:
    'scorekeeperReservationAwaitingPaymentPaid',
  scorekeeperReservationAutoCanceledDueToInitialPaymentFailed:
    'scorekeeperReservationAutoCanceledDueToInitialPaymentFailed',
  scorekeeperReservationAutoRestoredDueToAlterPaymentFailed:
    'scorekeeperReservationAutoRestoredDueToAlterPaymentFailed',
  scorekeeperReservationCanceledDuringAwaitingPayment:
    'scorekeeperReservationCanceledDuringAwaitingPayment',
  scorekeeperReservationRestoredDuringAwaitingPayment:
    'scorekeeperReservationRestoredDuringAwaitingPayment',
  clap: 'clap',
  tagged: 'tagged',
  comment: 'comment',

  inviteToConnectMember: 'inviteToConnectMember',

  // request for basic info

  sendBasicInfoToMember: 'sendBasicInfoToMember',
  deleted: 'deleted',
  accepted: 'accepted',
  declined: 'declined',
  cancelled: 'cancelled',

  // join group new verbs
  userRequestedJoingroup: 'userRequestedJoingroup',

  // follow Request
  followRequest: 'followRequest',
  // member profile change
  memberProfileChanged: 'memberProfileChanged',
  userAddedProfile: 'userAddedSportProfile',
};

export default NotificationType;
