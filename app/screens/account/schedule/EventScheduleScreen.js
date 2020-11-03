import React, {
} from 'react';
import {
  StyleSheet,
  Text,
  SectionList,
  KeyboardAvoidingView,
} from 'react-native';
import TCEventView from '../../../components/TCEventView';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts';

const DATA = [
  {
    title: 'Today',
    data: [
      {
        id: '1',
        dateMonth: 'Aug ',
        date: '13 ',
        title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
        description: 'Event description for special event.',
        eventTime: '12:00 PM - 11:00 AM',
        eventLocation: 'Vancouver, BC, Canada',
        eventColor: colors.orangeColor,
      },
      {
        id: '2',
        dateMonth: 'Aug ',
        date: '13 ',
        title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
        description: 'Event description for special event.',
        eventTime: '12:00 PM - 11:00 AM',
        eventLocation: 'Vancouver, BC, Canada',
        eventColor: colors.yellowColor,
      },
      {
        id: '7',
        dateMonth: 'Aug ',
        date: '13 ',
        title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
        description: 'Event description for special event.',
        eventTime: '12:00 PM - 11:00 AM',
        eventLocation: 'Vancouver, BC, Canada',
        eventColor: colors.blueColor,
      },
      {
        id: '8',
        dateMonth: 'Aug ',
        date: '13 ',
        title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
        description: 'Event description for special event.',
        eventTime: '12:00 PM - 11:00 AM',
        eventLocation: 'Vancouver, BC, Canada',
        eventColor: colors.greeColor,
      },
    ],
  },
  {
    title: 'Tomorrow',
    data: [
      {
        id: '3',
        dateMonth: 'Aug ',
        date: '13 ',
        title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
        description: 'Event description for special event.',
        eventTime: '12:00 PM - 11:00 AM',
        eventLocation: 'Vancouver, BC, Canada',
        eventColor: colors.orangeColor,
      },
      {
        id: '4',
        dateMonth: 'Aug ',
        date: '13 ',
        title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
        description: 'Event description for special event.',
        eventTime: '12:00 PM - 11:00 AM',
        eventLocation: 'Vancouver, BC, Canada',
        eventColor: colors.yellowColor,
      },
      {
        id: '9',
        dateMonth: 'Aug ',
        date: '13 ',
        title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
        description: 'Event description for special event.',
        eventTime: '12:00 PM - 11:00 AM',
        eventLocation: 'Vancouver, BC, Canada',
        eventColor: colors.blueColor,
      },
      {
        id: '10',
        dateMonth: 'Aug ',
        date: '13 ',
        title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
        description: 'Event description for special event.',
        eventTime: '12:00 PM - 11:00 AM',
        eventLocation: 'Vancouver, BC, Canada',
        eventColor: colors.greeColor,
      },
      {
        id: '11',
        dateMonth: 'Aug ',
        date: '13 ',
        title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
        description: 'Event description for special event.',
        eventTime: '12:00 PM - 11:00 AM',
        eventLocation: 'Vancouver, BC, Canada',
        eventColor: colors.lightBlueColor,
      },
    ],
  },
  {
    title: 'Future',
    data: [
      {
        id: '5',
        dateMonth: 'Aug ',
        date: '13 ',
        title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
        description: 'Event description for special event.',
        eventTime: '12:00 PM - 11:00 AM',
        eventLocation: 'Vancouver, BC, Canada',
        eventColor: colors.orangeColor,
      },
      {
        id: '6',
        dateMonth: 'Aug ',
        date: '13 ',
        title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
        description: 'Event description for special event.',
        eventTime: '12:00 PM - 11:00 AM',
        eventLocation: 'Vancouver, BC, Canada',
        eventColor: colors.yellowColor,
      },
      {
        id: '12',
        dateMonth: 'Aug ',
        date: '13 ',
        title: 'Event 1 will come in Vancuver on special day dsfdsf dsf df adsfdsfsadfadsf',
        description: 'Event description for special event.',
        eventTime: '12:00 PM - 11:00 AM',
        eventLocation: 'Vancouver, BC, Canada',
        eventColor: colors.blueColor,
      },
    ],
  },
];

export default function EventScheduleScreen({ onItemPress }) {
  return (
    <KeyboardAvoidingView style={ styles.mainContainer } behavior={'padding'}>
      <SectionList
            renderItem={ ({ item }) => (
              <TCEventView onPress={onItemPress} data={item} />
            ) }
            renderSectionHeader={ ({ section: { title } }) => (
              <Text style={ styles.sectionHeader }>{title}</Text>
            ) }
            sections={DATA}
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
    // marginTop: 15,
    marginBottom: 10,
    paddingLeft: 12,
    backgroundColor: colors.whiteColor,
  },
});
