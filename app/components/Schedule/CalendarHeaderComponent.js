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
import TCThinDivider from '../TCThinDivider';

const weekDaysNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const now = moment();

class CalendarHeaderComponent extends React.PureComponent {
  onKnobClick;

  constructor(props) {
    super(props);
    this.onKnobClick = this.onKnobClick.bind(this);
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <TouchableOpacity onPress={this.props.onKnobClick}>
              <Image
                  source={
                    this.props.showTimeTable
                      ? images.menuGray
                      : images.menuOrange
                  }
                  style={styles.knobImage}
                />
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', marginLeft: 35 }}>
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

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

              {!this.props.horizontal ? (
                <TouchableOpacity
                  hitSlop={getHitSlop(15)}
                  style={{ marginRight: 15 }}
                  onPress={this.props.onPressListView}>

                  <Image
                    source={this.props.horizontal ? images.scheduleOrange : images.scheduleGray}
                    style={{
                      resizeMode: 'contain',
                      height: 25,
                      width: 25,

                    }}
                  />
                </TouchableOpacity>
              ) : <TouchableOpacity
              hitSlop={getHitSlop(15)}
              style={{ marginRight: 15 }}
              onPress={this.props.onPressGridView}>

                <Image
                source={this.props.horizontal ? images.scheduleOrange : images.scheduleGray}
                style={{
                  resizeMode: 'contain',
                  height: 25,
                  width: 25,

                }}
              />
              </TouchableOpacity>}

              <TouchableOpacity
                  hitSlop={getHitSlop(15)}
                  style={{ marginRight: 15 }}
                  onPress={this.props.onPressListView}>
                {/* <Image
                  style={styles.icon}
                   source={images.goalsImage}
                /> */}
                <Image
                    source={images.grayListIcon}
                    style={{
                      resizeMode: 'contain',
                      height: 18,
                      width: 18,
                    }}
                  />
              </TouchableOpacity>

            </View>

          </View>

          <View style={{ flex: 1 }} />

        </View>
        <TCThinDivider height={1} width={'100%'} marginBottom={10}/>
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
  isListView: PropTypes.bool,
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
     paddingBottom: 12,
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
  knobImage: {
    resizeMode: 'contain',
    alignSelf: 'center',
    height: 25,
    width: 25,
  },
});

export default CalendarHeaderComponent;
