// @flow
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import colors from '../../../../../Constants/Colors';
import {getJSDate} from '../../../../../utils';

const screenWidth = Dimensions.get('window').width;
const totalBarWidth = parseInt(screenWidth * 0.3, 10);

const AvailabilityBar = ({list = []}) => {
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    if (list.length > 0) {
      const newList = [];
      list.forEach((item, index) => {
        const startTime = getJSDate(item.start_datetime).getTime();
        const endTime = getJSDate(item.end_datetime).getTime();

        if (index === 0) {
          const todayTime = moment(
            `${moment(startTime).format('YYYY-MM-DD')} 00:00`,
          );
          newList.push({
            hrs: moment(startTime).diff(todayTime, 'minutes') / 60,
            blocked: !moment(startTime).diff(todayTime, 'minutes') / 60 > 0,
          });
        } else {
          const previousEventsEndTime = getJSDate(
            list[index - 1].end_datetime,
          ).getTime();
          newList.push({
            hrs:
              moment(startTime).diff(moment(previousEventsEndTime), 'minutes') /
              60,
            blocked:
              moment(endTime).diff(moment(startTime), 'minutes') / 60 > 0,
          });
        }

        newList.push({
          hrs: moment(endTime).diff(moment(startTime), 'minutes') / 60,
          blocked: moment(endTime).diff(moment(startTime), 'minutes') / 60 > 0,
        });

        if (index === list.length - 1) {
          const dayEndTime = moment(
            `${moment(endTime).format('YYYY-MM-DD')} 23:59`,
          );

          if (moment(endTime).diff(dayEndTime, 'minutes') / 60 > 0) {
            newList.push({
              hrs: moment(endTime).diff(dayEndTime, 'minutes') / 60,
              blocked: !moment(endTime).diff(dayEndTime, 'minutes') / 60 > 0,
            });
          }
        }
      });
      setTimeSlots([...newList]);
    }
  }, [list]);

  const calculateBarWidth = (hrs) => {
    const barWidth = totalBarWidth / 24;
    return barWidth * hrs;
  };

  return timeSlots.length > 0 ? (
    <View style={styles.parent}>
      {timeSlots.map((slot, index) => (
        <View
          style={[
            styles.parent,
            {
              width: calculateBarWidth(slot.hrs),
              backgroundColor: slot.blocked
                ? colors.grayBackgroundColor
                : colors.availabilityBarColor,
            },
          ]}
          key={index}
        />
      ))}
    </View>
  ) : (
    <View style={styles.fullWidthBar} />
  );
};

const styles = StyleSheet.create({
  parent: {
    width: totalBarWidth,
    height: 15,
    marginLeft: 10,
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayBackgroundColor,
  },
  fullWidthBar: {
    width: totalBarWidth,
    height: 15,
    marginLeft: 10,
    borderRadius: 3,
    backgroundColor: colors.availabilityBarColor,
  },
});
export default AvailabilityBar;
