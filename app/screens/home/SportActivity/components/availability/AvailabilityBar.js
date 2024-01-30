// @flow
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import colors from '../../../../../Constants/Colors';
import {getJSDate} from '../../../../../utils';

const AvailabilityBar = ({list = []}) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [barWidth, setBarWidth] = useState(0);

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
    const finalBarWidth = barWidth / 24;
    return finalBarWidth * hrs;
  };

  return timeSlots.length > 0 ? (
    <View
      style={styles.parent}
      onLayout={(event) => {
        const contentWidth = event.nativeEvent.layout.width;
        setBarWidth(contentWidth);
      }}>
      {timeSlots.map((slot, index) => (
        <View
          style={[
            styles.parent,
            {
              width: calculateBarWidth(slot.hrs),
              backgroundColor: slot.blocked
                ? colors.iosActionSheetBgColor
                : colors.availabilityBarColor,
            },
          ]}
          key={index}
        />
      ))}
    </View>
  ) : (
    <View
      onLayout={(event) => {
        const contentWidth = event.nativeEvent.layout.width;
        setBarWidth(contentWidth);
      }}
      style={styles.fullWidthBar}
    />
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    // width: totalBarWidth,
    height: 10,
    marginLeft: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.iosActionSheetBgColor,
  },
  fullWidthBar: {
    flex: 1,
    // width: totalBarWidth,
    height: 10,
    marginLeft: 10,
    borderRadius: 5,
    backgroundColor: colors.availabilityBarColor,
  },
});
export default AvailabilityBar;
