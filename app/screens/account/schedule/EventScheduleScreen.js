/* eslint-disable guard-for-in */
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, SectionList, View} from 'react-native';
import moment from 'moment';
import _ from 'lodash';
import TCEventView from '../../../components/TCEventView';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
// const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July','Aug','Sep','Oct','Nov','Dec'];

export default function EventScheduleScreen({
  onItemPress,
  eventData,
  onThreeDotPress,
  entity,
  profileID,
  screenUserId,
}) {
  const [filterData, setFilterData] = useState(null);

  useEffect(() => {
    // const d = new Date(dateString);
    // var dayName = days[d.getDay()];

    if (eventData) {
      const result = _(eventData)
        .groupBy((v) =>
          moment(new Date(v.start_datetime * 1000)).format('MMM DD, YYYY'),
        )
        .value();

      const filData = [];
      for (const property in result) {
        let temp = {};
        const value = result[property];
        temp = {
          title: property,
          data: result[property].length > 0 ? value : [],
        };
        filData.push(temp);
      }
      setFilterData([...filData]);
      console.log('resultresult', filData);
      // const todayData = [];
      // const tomorrowData = [];
      // const futureData = [];
      // eventData.map((item_filter) => {
      //   const startDate = new Date(item_filter.start_datetime * 1000);
      //   const dateFormat = moment(startDate).format('YYYY-MM-DD hh:mm:ss');
      //   const dateText = moment(dateFormat).calendar(null, {
      //     lastDay: '[Yesterday]',
      //     sameDay: '[Today]',
      //     nextDay: '[Tomorrow]',
      //     nextWeek: '[Future]',
      //     sameElse: '[Future]',
      //   });
      //   if (dateText === 'Today') {
      //     todayData.push(item_filter);
      //   }
      //   if (dateText === 'Tomorrow') {
      //     tomorrowData.push(item_filter);
      //   }
      //   if (dateText === 'Future') {
      //     futureData.push(item_filter);
      //   }
      //   return null;
      // });
      // // let filData = [];
      // if (todayData && tomorrowData && futureData) {
      //   if (
      //     todayData?.length > 0 ||
      //     tomorrowData?.length > 0 ||
      //     futureData?.length > 0
      //   ) {
      //     const filData = [
      //       {
      //         title: 'Today',
      //         data: todayData,
      //       },
      //       {
      //         title: 'Tomorrow',
      //         data: tomorrowData,
      //       },
      //       {
      //         title: 'Future',
      //         data: futureData,
      //       },
      //     ];
      //     setFilterData([...filData]);
      //   } else {
      //     setFilterData([]);
      //   }
      // }
    } else {
      setFilterData([]);
    }
  }, [eventData]);

  return (
    <View style={styles.mainContainer}>
      {filterData && (
        <SectionList
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{marginTop: 15}}>
              <Text style={styles.noEventText}>No Events</Text>
              <Text style={styles.dataNotFoundText}>
                New events will appear here.
              </Text>
            </View>
          }
          renderItem={({item}) => {
            console.log('render event item:=>', item);
            if (item.cal_type === 'event') {
              return (
                <TCEventView
                  onPress={() => onItemPress(item)}
                  data={item}
                  profileID={profileID}
                  screenUserId={screenUserId}
                  onThreeDotPress={() => onThreeDotPress(item)}
                  eventBetweenSection={item.game}
                  eventOfSection={
                    item.game &&
                    item.game.referees &&
                    item.game.referees.length > 0
                  }
                  entity={entity}
                />
              );
            }
            return null;
          }}
          renderSectionHeader={({section}) =>
            (section?.data || [])?.filter((obj) => obj.cal_type === 'event')
              .length > 0 && (
                <Text style={styles.sectionHeader}>
                  {days[new Date(section.title).getDay()]}, {section.title}
                </Text>
          )
          }
          sections={filterData}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.lightGrayBackground,
  },
  sectionHeader: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginBottom: 10,
    paddingLeft: 12,
    backgroundColor: colors.lightGrayBackground,
    paddingTop: 10,
    paddingBottom: 10,
  },
  dataNotFoundText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.veryLightBlack,
    alignSelf: 'center',
  },
  noEventText: {
    fontSize: 20,
    fontFamily: fonts.RBold,
    color: colors.veryLightBlack,
    alignSelf: 'center',
  },
});
