import moment from 'moment';
import images from '../Constants/ImagePath';

const gameStats = {
  start: 'started',
  end: 'ended',
  resume: 'resumed',
  pause: 'paused',
}

const gamePlayerStatusStats = {
  yc: 'received a yellow card',
  rc: 'received a red card',
  in: 'was in',
  out: 'was out',
}

const gamePlayStats = {
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

const gamePlayStatsImage = {
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
}

const getGameDateTimeInHMSformat = (date = new Date()) => moment(new Date(date * 1000)).format('hh:mm A')

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
  gameStats,
  gamePlayStats,
  gamePlayStatsImage,
  getGameDateTimeInHMSformat,
  getGameDateTimeInDHMformat,
  getGameTimeAgo,
  getGameConvertMinsToTime,
  gamePlayerStatusStats,
}
