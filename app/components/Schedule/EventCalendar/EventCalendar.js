/* eslint-disable global-require */
// @flow
import {
  VirtualizedList,
} from 'react-native'
import _ from 'lodash'
import moment from 'moment'
import React from 'react'

import styleConstructor from './style'

import DayView from './DayView'

export default class EventCalendar extends React.Component {
  constructor(props) {
    super(props)
    this.styles = styleConstructor(props.styles)
    this.state = {
      date: moment(this.props.initDate),
      index: this.props.size,
    }
  }

  static defaultProps = {
    size: 30,
    initDate: new Date(),
    formatHeader: 'DD MMMM YYYY',
  }

  getItemLayout(data, index) {
    const { width } = this.props
    return { length: width, offset: width * index, index }
  }

  getItem(events, index) {
    const date = moment(this.props.initDate).add(index - this.props.size, 'days')
    return _.filter(events, (event) => {
      const eventStartTime = moment(event.start)
      return eventStartTime >= date.clone().startOf('day')
        && eventStartTime <= date.clone().endOf('day')
    })
  }

  renderItem({ index, item }) {
    const {
      width, initDate, scrollToFirst,
    } = this.props
    const date = moment(initDate).add(index - this.props.size, 'days')
    return (

      <DayView
        date={date}
        index={index}
        format24h={false}
        formatHeader={this.props.formatHeader}
        headerStyle={this.props.headerStyle}
        renderEvent={this.props.renderEvent}
        eventTapped={this.props.eventTapped}
        events={item}
        width={width}
        styles={this.styles}
        scrollToFirst={scrollToFirst}
      />

    )
  }

  goToPage(index) {
    if (index <= 0 || index >= this.props.size) {
      return
    }
    const date = moment(this.props.initDate).add(index - this.props.size, 'days')
    // eslint-disable-next-line react/no-string-refs
    this.refs.calendar.scrollToIndex({ index, animated: false })
    this.setState({ index, date })
  }

  render() {
    const {
      width,
      virtualizedListProps,
      events,

    } = this.props
    return (

      <VirtualizedList
          // eslint-disable-next-line react/no-string-refs
          ref='calendar'
          scrollEnabled={false}
          nestedScrollEnabled
          windowSize={2}
          initialNumToRender={2}
          initialScrollIndex={this.props.size}
          data={events}
          getItemCount={() => this.props.size * 2}
          getItem={this.getItem.bind(this)}
          keyExtractor={(item, index) => index}
          getItemLayout={this.getItemLayout.bind(this)}
           horizontal
          showsVerticalScrollIndicator={false}
          pagingEnabled
          renderItem={this.renderItem.bind(this)}
          style={{ width }}
          // onMomentumScrollEnd={(event) => {
          //   // eslint-disable-next-line radix
          //   const index = parseInt(event.nativeEvent.contentOffset.x / width)
          //   const date = moment(this.props.initDate).add(index - this.props.size, 'days')
          //   this.setState({ index, date })
          // }}
          {...virtualizedListProps}
        />

    )
  }
}
