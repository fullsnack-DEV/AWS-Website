import React from 'react';
import {
 View, Text, StyleSheet, Image, TouchableOpacity,
 } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

const weekDaysNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const now = moment();

class CalendarHeaderComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onPressArrowLeft = this.onPressArrowLeft.bind(this);
    this.onPressArrowRight = this.onPressArrowRight.bind(this);
    this.shouldLeftArrowBeDisabled = this.shouldLeftArrowBeDisabled.bind(this);
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
          <Text style={styles.dateText}>
            {moment(this.props.month.getTime()).format('MMMM YYYY')}
          </Text>
          <View
            style={[
              styles.iconContainer,
              this.shouldLeftArrowBeDisabled() ? styles.disabled : {},
            ]}>
            <TouchableOpacity
              onPress={this.onPressArrowLeft}
              disabled={this.shouldLeftArrowBeDisabled()}>
              <Image
                style={[styles.icon, styles.leftIcon]}
                source={images.nextArrow}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={this.onPressArrowRight}>
            <Image style={styles.icon} source={images.nextArrow} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          {!this.props.horizontal ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.RLight,
                  color: colors.lightBlackColor,
                }}>
                Timetable
              </Text>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={this.props.onPressListView}>
                {/* <Image
                  style={styles.icon}
                   source={images.goalsImage}
                /> */}
                <Image
                  source={images.uncheckWhite}
                  style={{
                    resizeMode: 'contain',
                    height: 18,
                    width: 18,
                    marginLeft: 10,
                  }}
                />
              </TouchableOpacity>
            </View>
          ) : null}
          {this.props.horizontal ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.RLight,
                  color: colors.lightBlackColor,
                }}>
                Timetable
              </Text>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={this.props.onPressGridView}>
                {/* <Image
                style={styles.icon}
                 source={images.goalsImage}
              /> */}
                <Image
                  source={images.orangeCheckBox}
                  style={{
                    resizeMode: 'contain',
                    height: 18,
                    width: 18,
                    marginLeft: 10,
                  }}
                />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        {
          // not showing week day in case of horizontal calendar, this will be handled by day component
          this.props.horizontal ? null : (
            <View style={styles.week}>
              {weekDaysNames.map((day, index) => (
                <Text key={index} style={styles.weekName} numberOfLines={1}>
                  {day.toUpperCase()}
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
  onPressArrowRight: PropTypes.func.isRequired,
  onPressArrowLeft: PropTypes.func.isRequired,
  onPressListView: PropTypes.func.isRequired,
  onPressGridView: PropTypes.func.isRequired,
  addMonth: PropTypes.func,
  month: PropTypes.object,
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 12,
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
    marginLeft: 8,
    marginRight: 4,
    marginTop: -2,
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
