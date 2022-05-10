import React from 'react';
import {
 View, Text, StyleSheet, Image, TouchableOpacity,
 } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import { getHitSlop } from '../../utils';

const weekDaysNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const now = moment();

class CalendarHeaderComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      buttonIndex: 0,
      isListView: false,
      isTimetableView: false,
      isMenu: false,
    };

    this.onPressArrowLeft = this.onPressArrowLeft.bind(this);
    this.onPressArrowRight = this.onPressArrowRight.bind(this);
    this.shouldLeftArrowBeDisabled = this.shouldLeftArrowBeDisabled.bind(this);
    console.log('Function:', this.props);
    console.log('Function:', this.props.onKnobClick);
  }

  onKnobClick() {
    this.props.onKnobClick();
  }

  onPressArrowLeft() {
    this.props.onPressArrowLeft(this.props.month, this.props.addMonth);
  }

  onPressArrowRight() {
    this.props.onPressArrowRight(this.props.month, this.props.addMonth);
  }

  shouldLeftArrowBeDisabled() {
    const selectedDate = moment(this.props.month.getTime());
    return selectedDate.isSame(now, 'month');
  }

  render() {
    return (
      <View>
        <View style={styles.header}>

          <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
            <View
                style={[
                  styles.iconContainer,
                  this.shouldLeftArrowBeDisabled() ? styles.disabled : {},
                ]}>
              <TouchableOpacity
                  hitSlop={getHitSlop(15)}
                  onPress={this.onPressArrowLeft}
                  disabled={this.shouldLeftArrowBeDisabled()}>
                <Image
                    style={[styles.icon, styles.leftIcon]}
                    source={images.nextArrow}
                  />
              </TouchableOpacity>
            </View>
            <Text style={styles.dateText}>
              {moment(this.props.month.getTime()).format('MMMM YYYY')}
            </Text>
            <TouchableOpacity
                style={styles.iconContainer}
                hitSlop={getHitSlop(15)}
                onPress={this.onPressArrowRight}>
              <Image style={styles.icon} source={images.nextArrow} />
            </TouchableOpacity>
          </View>

        </View>
       
        {
          // not showing week day in case of horizontal calendar, this will be handled by day component
          this.props.horizontal ? null : (
            <View style={styles.week}>
              {weekDaysNames.map((day, index) => (
                <Text key={index} style={styles.weekName} numberOfLines={1}>
                  {day}
                </Text>
              ))}
            </View>
          )
        }
      </View>
    );
  }
}

CalendarHeaderComponent.propTypes = {
  headerData: PropTypes.object,
  horizontal: PropTypes.bool,
  onKnobClick: PropTypes.func.isRequired,
  listView: PropTypes.bool,
  onPressArrowRight: PropTypes.func.isRequired,
  onPressArrowLeft: PropTypes.func.isRequired,
  onPressListView: PropTypes.func.isRequired,
  onPressGridView: PropTypes.func.isRequired,
  addMonth: PropTypes.func,
  month: PropTypes.object,
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 12,
    justifyContent: 'center',
    backgroundColor: colors.whiteColor,
  },
  week: {
    marginTop: 7,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weekName: {
    marginTop: 2,
    marginBottom: 7,
    width: 32,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7c7c7c',
  },
  dateText: {
    fontSize: 15,
    fontFamily: fonts.RBold,
    color: colors.themeColor,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  leftIcon: {
    transform: [{ rotate: '180deg' }],
  },
  icon: {
    width: 12,
    height: 12,
    tintColor: colors.grayColor,
  },
  disabled: {
    opacity: 0.4,
  },
});

export default CalendarHeaderComponent;
