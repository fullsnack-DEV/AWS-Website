// @flow
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {strings} from '../../../../../../Localization/translation';
import colors from '../../../../../Constants/Colors';
import fonts from '../../../../../Constants/Fonts';
import {getJSDate} from '../../../../../utils';
import AvailabilityBar from './AvailabilityBar';

const AvailabilitySection = ({list = [], loading = false}) => {
  const [leftColumn, setLeftColumn] = useState([]);
  const [rightColumn, setRightColumn] = useState([]);
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    const leftList = [];
    const rightList = [];
    for (let index = 0; index <= 7; index++) {
      const date = new Date();
      date.setDate(new Date().getDate() + index);
      const key = moment(date).format('YYYY-MM-DD');
      if (index <= 3) {
        leftList.push(key);
      } else {
        rightList.push(key);
      }
    }
    setLeftColumn(leftList);
    setRightColumn(rightList);
  }, []);

  useEffect(() => {
    const data = {};

    function compare(a, b) {
      if (a.start_datetime < b.start_datetime) {
        return -1;
      }
      if (a.start_datetime > b.start_datetime) {
        return 1;
      }
      return 0;
    }

    if (list.length > 0) {
      const sortedList = list.sort(compare);
      sortedList.forEach((item) => {
        const key = moment(getJSDate(item.start_datetime)).format('YYYY-MM-DD');
        if (Object.keys(data).includes(key)) {
          data[key].push(item);
        } else {
          data[key] = [item];
        }
      });
      setAvailability(data);
    }
  }, [list]);

  const getList = (item) => {
    let selectedList = [];
    Object.keys(availability).forEach((ele) => {
      if (moment(ele).isSame(item, 'day')) {
        selectedList = availability[ele];
      }
    });
    return selectedList;
  };

  return (
    <View style={styles.parent}>
      <View style={styles.row}>
        <Text style={styles.title}>{strings.availability}</Text>
        <TouchableOpacity>
          <Text style={styles.buttonText}>{strings.seeAllText}</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loaderView}>
          <ActivityIndicator size={'small'} />
        </View>
      ) : (
        <View style={[styles.row, {marginBottom: 0}]}>
          <View>
            {leftColumn.map((item, index) => {
              const slots = getList(item);
              return (
                <View style={[styles.row, styles.barContainer]} key={index}>
                  <Text style={styles.label}>{moment(item).format('M/D')}</Text>
                  <AvailabilityBar list={slots} />
                </View>
              );
            })}
          </View>
          <View>
            {rightColumn.map((item, index) => {
              const slots = getList(item);
              return (
                <View style={[styles.row, styles.barContainer]} key={index}>
                  <Text style={styles.label}>{moment(item).format('M/D')}</Text>
                  <AvailabilityBar list={slots} />
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    marginTop: 25,
  },
  title: {
    fontSize: 20,
    lineHeight: 25,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.themeColor,
    fontFamily: fonts.RRegular,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  barContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  loaderView: {
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default AvailabilitySection;
