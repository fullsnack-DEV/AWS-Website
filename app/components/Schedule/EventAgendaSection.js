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
 } from 'react-native';
 import { Calendar } from 'react-native-toggle-calendar';
 import moment from 'moment';
import CalendarDayComponent from './CalendarDayComponent';
import CalendarHeaderComponent from './CalendarHeaderComponent';

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
       calendarMarkedDates: {
         '2021-03-28': {
           fullySoldOut: false,
           partiallySoldOut: false,
           fullyBlocked: false,
           partiallyBlocked: true,
           inventory: 14,
           highDemand: false,
           selected: false,
         },
         '2021-03-29': {
           fullySoldOut: false,
           partiallySoldOut: false,
           fullyBlocked: false,
           partiallyBlocked: true,
           inventory: 14,
           highDemand: true,
           selected: false,
         },
         '2021-03-30': {
           fullySoldOut: false,
           partiallySoldOut: false,
           fullyBlocked: false,
           partiallyBlocked: true,
           inventory: 14,
           highDemand: false,
           selected: false,
         },
       },

       ratesInventoryDataArray: [],
       saveButtonClicked: false,
       calendarLoading: true,
     };

     this.onPressArrowLeft = this.onPressArrowLeft.bind(this);
     this.onPressArrowRight = this.onPressArrowRight.bind(this);
    //  this.onPressListView = () => this.props.onPressListView.bind(this);
    //  this.onPressGridView = this.props.onPressGridView.bind(this);
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

  //  onPressListView() {
  //    this.setState({ horizontal: true });
  //  }

  //  onPressGridView() {
  //    this.setState({ horizontal: false });
  //  }

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
             onPressListView={this.props.onPressListView}
             onPressGridView={this.props.onPressGridView}
             markedDates={this.props.calendarMarkedDates}
             horizontal={this.props.horizontal}
             onDayPress={this.props.onDayPress}
              showPastDatesInHorizontal={1}
              horizontalEndReachedThreshold={100}
              horizontalStartReachedThreshold={0}

             // loading={this.state.calendarLoading}
           />

         </SafeAreaView>
       </>
     );
   }
 }

 const styles = StyleSheet.create({

 });

 export default EventAgendaSection;
