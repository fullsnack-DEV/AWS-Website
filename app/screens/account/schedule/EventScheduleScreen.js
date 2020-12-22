import React from 'react';
import {
  StyleSheet,
  Text,
  SectionList,
  KeyboardAvoidingView,
} from 'react-native';
import moment from 'moment';
import TCEventView from '../../../components/TCEventView';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts';

export default function EventScheduleScreen({ onItemPress, eventData, onThreeDotPress }) {
  let filterData = [];
  let dataNotFound = true;
  if (eventData) {
    const todayData = [];
    const tomorrowData = [];
    const futureData = [];
    eventData.filter((item_filter) => {
      const startDate = new Date(item_filter.start_datetime * 1000);
      const dateFormat = moment(startDate).format('YYYY-MM-DD hh:mm:ss');
      const dateText = moment(dateFormat).calendar(null, {
        lastDay: '[Yesterday]',
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: '[Future]',
        sameElse: '[Future]',
      })
      if (dateText === 'Today') {
        todayData.push(item_filter);
        dataNotFound = false;
      }
      if (dateText === 'Tomorrow') {
        tomorrowData.push(item_filter);
        dataNotFound = false;
      }
      if (dateText === 'Future') {
        futureData.push(item_filter);
        dataNotFound = false;
      }
      return null;
    })
    filterData = [
      {
        title: 'Today',
        data: todayData,
      },
      {
        title: 'Tomorrow',
        data: tomorrowData,
      },
      {
        title: 'Future',
        data: futureData,
      },
    ];
  }
  return (
    <KeyboardAvoidingView style={ styles.mainContainer } behavior={'padding'}>
      {dataNotFound
        ? <Text style={styles.dataNotFoundText}>Data Not Found!</Text>
        : <SectionList
          renderItem={ ({ item }) => {
            if (item.cal_type === 'event') {
              return (
                <TCEventView
                  onPress={() => onItemPress(item)}
                  data={item}
                  onThreeDotPress={() => onThreeDotPress(item)}
                  eventBetweenSection={item.game}
                  eventOfSection={item.game && item.game.referees}
                />
              );
            }
            return null;
          }}
          renderSectionHeader={ ({ section }) => (
            section.data.length > 0 && <Text style={ styles.sectionHeader }>{section.title}</Text>
          )}
          sections={filterData}
          keyExtractor={(item, index) => index.toString()}
          bounces={false}
        />
      }
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginBottom: 10,
    paddingLeft: 12,
    backgroundColor: colors.whiteColor,
  },
  dataNotFoundText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    alignSelf: 'center',
  },
});
