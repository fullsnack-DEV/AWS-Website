import React from 'react';
import {
  StyleSheet,
  Text,
  SectionList,
  KeyboardAvoidingView,
} from 'react-native';
import moment from 'moment';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts';
import RecentMatchItems from '../../components/Home/RecentMatchItems';

export default function ScoreboardSportsScreen({
  sportsData,
}) {
  let filterData = [];
  if (sportsData) {
    const todayData = [];
    const yesterdayData = [];
    const pastData = [];
    sportsData.filter((item_filter) => {
      const startDate = new Date(item_filter.start_datetime * 1000);
      const dateFormat = moment(startDate).format('YYYY-MM-DD hh:mm:ss');
      const dateText = moment(dateFormat).calendar(null, {
        sameDay: '[Today]',
        lastDay: '[Yesterday]',
        lastWeek: '[Past]',
        sameElse: '[Past]',
      })
      if (dateText === 'Today') {
        todayData.push(item_filter);
      }
      if (dateText === 'Yesterday') {
        yesterdayData.push(item_filter);
      }
      if (dateText === 'Past') {
        pastData.push(item_filter);
      }
      return null;
    })
    filterData = [
      {
        title: 'Today',
        data: todayData,
      },
      {
        title: 'Yesterday',
        data: yesterdayData,
      },
      {
        title: 'Past',
        data: pastData,
      },
    ];
  }
  return (
    <KeyboardAvoidingView style={ styles.mainContainer }>
      <SectionList
        renderItem={ ({ item }) => (
          <RecentMatchItems
            data={item}
            onThreeDotPress={() => {}}
          />
        ) }
        renderSectionHeader={ ({ section: { title } }) => (
          <Text style={ styles.sectionHeader }>{title}</Text>
        ) }
        sections={filterData}
        keyExtractor={(item, index) => index.toString()}
        bounces={false}
      />
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
    paddingTop: 15,
    marginBottom: 10,
    paddingLeft: 12,
    backgroundColor: colors.whiteColor,
  },
});
