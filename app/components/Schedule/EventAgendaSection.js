/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
} from 'react-native';
import { Calendar } from 'react-native-toggle-calendar';
import moment from 'moment';
import CalendarDayComponent from './CalendarDayComponent';
import CalendarHeaderComponent from './CalendarHeaderComponent';
import colors from '../../Constants/Colors';

const selectedCalendarDate = moment();
const minimumDate = moment().add(-1, 'day'); // one day before for midnight check-in usecase
const currentDate = moment();

class EventAgendaSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCalendarDateString: this.props.selectedCalendarDate,
      selectedCalendarMonthString: selectedCalendarDate.format('YYYY-MM-DD'),
      calendarHeaderData: {},
      calendarMarkedDates: this.props.calendarMarkedDates,

      ratesInventoryDataArray: [],
      saveButtonClicked: false,
      calendarLoading: true,
    };
    this.onPressArrowLeft = this.onPressArrowLeft.bind(this);
    this.onPressArrowRight = this.onPressArrowRight.bind(this);
  }

  updateSelectedCalendarMonth(selectedCalendarMonthString) {
    this.setState({
      selectedCalendarMonthString,
      calendarLoading: true,
    });
  }

  onPressArrowLeft(currentMonth, addMonthCallback) {
    const monthStartDate = moment(currentMonth.getTime()).startOf('month');

    // don't go back for past months
    if (monthStartDate > currentDate) {
      addMonthCallback(-1);
      const selectedCalendarMonthString = moment(currentMonth.getTime())
        .add(-1, 'month')
        .format('YYYY-MM-DD');
      this.updateSelectedCalendarMonth(selectedCalendarMonthString);
    }
  }

  onPressArrowRight(currentMonth, addMonthCallback) {
    addMonthCallback(1);
    const selectedCalendarMonthString = moment(currentMonth.getTime())
      .add(1, 'month')
      .format('YYYY-MM-DD');
    this.updateSelectedCalendarMonth(selectedCalendarMonthString);
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <Calendar
            current={this.state.selectedCalendarMonthString}
            minDate={minimumDate.format('YYYY-MM-DD')}
            dayComponent={CalendarDayComponent}
            calendarHeaderComponent={CalendarHeaderComponent}
            headerData={this.state.calendarHeaderData}
            style={ styles.calendar}
            onPressArrowLeft={this.onPressArrowLeft}
            onPressArrowRight={this.onPressArrowRight}
            markedDates={this.props.calendarMarkedDates}
            horizontal={this.props.horizontal}
            onPressListView={this.props.onPressListView}
            onPressGridView={ this.props.onPressGridView}
            onDayPress={this.props.onDayPress}
            showPastDatesInHorizontal={1}
            horizontalEndReachedThreshold={100}
            horizontalStartReachedThreshold={0}
            // loading={this.state.calendarLoading}
          />

          <View style={styles.knobContainer}>

          </View>

        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  knobContainer: {
    width: '100%',
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 20,
  },

});

export default EventAgendaSection;
