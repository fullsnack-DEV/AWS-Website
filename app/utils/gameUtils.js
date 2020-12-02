import moment from 'moment';
import images from '../Constants/ImagePath';

const REVIEW_EXPIRY_DAYS = 5;

// Soccer
const soccerGameStats = {
  start: 'started',
  end: 'ended',
  resume: 'resumed',
  pause: 'paused',
}

const soccerGamePlayerStatusStats = {
  yc: 'received a yellow card',
  rc: 'received a red card',
  in: 'was in',
  out: 'was out',
}

const soccerGamePlayStats = {
  goal: 'scored a goal',
  ownGoal: 'scored a own goal',
  yc: 'received a yellow card',
  rc: 'received a red card',
  in: 'was in',
  out: 'was out',
  score: 'was scored',
  setStart: 'was started',
  setEnd: 'was ended',
  gameStart: 'was started',
  gameEnd: 'was ended',
  ace: 'was ace',
  fault: 'was ace',
  let: 'was let',
  unforcedError: 'was unforced error',
  footFault: 'was foot fault',
  winner: 'was winner',
}

const soccerGamePlayStatsImage = {
  goal: images.gameGoal,
  yc: images.gameYC,
  rc: images.gameRC,
  in: images.gameIn,
  out: images.gameOut,
  score: images.gameGoal,
  setStart: images.gameGoal,
  setEnd: images.gameGoal,
  gameStart: images.gameStart,
  gameEnd: images.gameGoal,
  ace: images.gameGoal,
  fault: images.gameGoal,
  let: images.gameGoal,
  unforcedError: images.gameGoal,
  footFault: images.gameGoal,
  winner: images.gameGoal,
  assist: images.assistBy,
}

const getGameDateTimeInHMSformat = (date = new Date()) => moment(new Date(date * 1000)).format('hh:mm A')

const checkReviewExpired = (date) => {
  const expiryDate = moment(date * 1000).add(REVIEW_EXPIRY_DAYS, 'days');
  const diff = getDiffDays(expiryDate);
  if (diff >= 0 && diff <= REVIEW_EXPIRY_DAYS) return false;
  return true;
}

const getDiffDays = (date) => {
  const thenDate = moment(date);
  const currentDate = moment(new Date());
  const diff = moment.duration(thenDate.diff(currentDate));
  return diff.days();
}
const getGameDateTimeInDHMformat = (date) => {
  const thenDate = moment(date * 1000);
  const currentDate = moment(new Date());
  const diff = moment.duration(thenDate.diff(currentDate));
  return `${diff.days()}d ${diff.hours()}h ${diff.minutes()}m`;
}

const getGameTimeAgo = (date) => moment
  .utc(new Date(date * 1000))
  .local()
  .startOf('seconds')
  .fromNow()

const getGameConvertMinsToTime = (mins = 101) => {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  let hrMin = `${hours}h ${minutes}m`;
  if (hours === 0) hrMin = `${minutes}m`;
  return hrMin
}
export {
  REVIEW_EXPIRY_DAYS,
  checkReviewExpired,
  getDiffDays,
  soccerGameStats,
  soccerGamePlayStats,
  soccerGamePlayStatsImage,
  soccerGamePlayerStatusStats,
  getGameDateTimeInHMSformat,
  getGameDateTimeInDHMformat,
  getGameTimeAgo,
  getGameConvertMinsToTime,

}
