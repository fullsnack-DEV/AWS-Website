import moment from 'moment';
import {getCalendarIndex} from '../api/elasticSearch';
import {getJSDate} from '.';

const calculateDifference = (startDate = '', endDate = '') => {
  const toDate = moment(getJSDate(endDate));
  const fromDate = moment(getJSDate(startDate));
  return toDate.diff(fromDate, 'minutes');
};

const getAvailableEntityIdList = async (filterObj = {}) => {
  const query = {
    query: {
      bool: {
        must: [
          {match: {blocked: true}},
          {range: {end_datetime: {gte: filterObj?.fromDate}}},
          {range: {start_datetime: {lte: filterObj?.toDate}}},
        ],
      },
    },
    _source: [
      'start_datetime',
      'owner_id',
      'participants',
      'end_datetime',
      'cal_type',
    ],
  };

  const calendarList = await getCalendarIndex(query);
  const finalList = [];

  if (calendarList?.length > 0) {
    const actualDuration = calculateDifference(
      filterObj.fromDate,
      filterObj.toDate,
    );

    const ownerHoursMap = {};
    calendarList.forEach((item) => {
      let start_date = item.start_datetime;
      let end_date = item.end_datetime;
      if (item.start_datetime < filterObj.fromDate) {
        start_date = filterObj.fromDate;
      }
      if (item.end_datetime > filterObj.toDate) {
        end_date = filterObj.toDate;
      }

      const diff = calculateDifference(start_date, end_date);

      item.participants.forEach((participant) => {
        if (ownerHoursMap[participant.entity_id]) {
          ownerHoursMap[participant.entity_id] += diff;
        } else {
          ownerHoursMap[participant.entity_id] = diff;
        }
      });
    });

    Object.keys(ownerHoursMap).forEach((item) => {
      if (actualDuration - ownerHoursMap[item] < 10) {
        finalList.push(item);
      }
    });
  }

  return finalList;
};

export {getAvailableEntityIdList, calculateDifference};
