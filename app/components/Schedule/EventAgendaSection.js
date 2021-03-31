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
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import { Calendar } from 'react-native-toggle-calendar';
import moment from 'moment';
import CalendarDayComponent from './CalendarDayComponent';
import CalendarHeaderComponent from './CalendarHeaderComponent';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';

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
            style={styles.calendar}
            onPressArrowLeft={this.onPressArrowLeft}
            onPressArrowRight={this.onPressArrowRight}
            isListView={this.props.isListView}
            markedDates={this.props.calendarMarkedDates}
            horizontal={this.props.horizontal}
            onDayPress={this.props.onDayPress}
            showPastDatesInHorizontal={1}
            horizontalEndReachedThreshold={100}
            horizontalStartReachedThreshold={0}
            // loading={this.state.calendarLoading}
          />
          <View style={styles.knobContainer}>
            <View style={styles.knobView}>
              <TouchableWithoutFeedback
                onPress={this.props.onKnobPress}>
                <Image source={this.props.showTimeTable ? images.timeKnobOrange : images.timeKnobGray} style={styles.knobImage} />
              </TouchableWithoutFeedback>
            </View>
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
    elevation: 15,
    marginBottom: 20,
  },
  knobView: {
    alignSelf: 'center',
    // hight: 35,
    width: 54,
    backgroundColor: colors.whiteColor,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 15,
    marginTop: -8,
    borderRadius: 200,
  },
  knobImage: {
    resizeMode: 'contain',
    alignSelf: 'center',
    height: 22,
    width: 22,
  },
});

export default EventAgendaSection;
