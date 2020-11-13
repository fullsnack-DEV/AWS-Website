const NotificationType = {
  // Invite Notification
  inviteToJoinClub: 'inviteToJoinClub',
  invitePlayerToJoinTeam: 'inviteUserToJointeam',
  invitePlayerToJoinClub: 'inviteUserToJoinclub',
  inviteToConnectProfile: 'inviteToConnectProfile',
  invitePlayerToJoingame: 'inviteUserToJoingame',
  // Challenge notificaton
  challengeOffered: 'challengeOffered',
  challengeAltered: 'challengeAltered',
  // Referee request
  refereeRequest: 'refereeRequest',
  changeRefereeRequest: 'changeRefereeRequest',
  scorekeeperRequest: 'scorekeeperRequest',

  initialChallengePaymentFail: 'initialChallengePaymentFail',
  alterChallengePaymentFail: 'alterChallengePaymentFail',
  challengeAwaitingPaymentPaid: 'challengeAwaitingPaymentPaid',
  gameAutoCanceledDueToInitialPaymentFailed: 'gameAutoCanceledDueToInitialPaymentFailed',
  gameAutoRestoredDueToAlterPaymentFailed: 'gameAutoRestoredDueToAlterPaymentFailed',
  gameCanceledDuringAwaitingPayment: 'gameCanceledDuringAwaitingPayment',
  gameRestoredDuringAwaitingPayment: 'gameRestoredDuringAwaitingPayment',

  refereeReservationInitialPaymentFail: 'refereeReservationInitialPaymentFail',
  refereeReservationAlterPaymentFail: 'refereeReservationAlterPaymentFail',
  refereeReservationAwaitingPaymentPaid: 'refereeReservationAwaitingPaymentPaid',
  refereeReservationAutoCanceledDueToInitialPaymentFailed: 'refereeReservationAutoCanceledDueToInitialPaymentFailed',
  refereeReservationAutoRestoredDueToAlterPaymentFailed: 'refereeReservationAutoRestoredDueToAlterPaymentFailed',
  refereeReservationCanceledDuringAwaitingPayment: 'refereeReservationCanceledDuringAwaitingPayment',
  refereeReservationRestoredDuringAwaitingPayment: 'refereeReservationRestoredDuringAwaitingPayment',
};

export default NotificationType
