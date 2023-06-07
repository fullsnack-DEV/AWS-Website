// @flow
import moment from 'moment';
import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text} from 'react-native';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';

const AvailabilityHeader = ({
  startDate,
  endDate,
  selectedDate,
  isListView = false,
  onToggleView = () => {},
  containerStyle = {},
  onNext = () => {},
  onPrev = () => {},
}) => (
  <View style={[styles.parent, containerStyle]}>
    {!isListView ? (
      <View style={styles.calInnerWrapper}>
        <TouchableOpacity
          style={styles.arrowContainer}
          onPress={() => onPrev(startDate)}>
          <Image source={images.leftArrow} style={styles.arrowIcon} />
        </TouchableOpacity>

        <View style={{marginHorizontal: 10}}>
          <Text style={styles.monthLabel}>
            {moment(startDate).utc().format('MMMM') ===
            moment(endDate).utc().format('MMMM')
              ? `${moment(startDate).utc().format('MMMM')} ${moment(
                  selectedDate,
                )
                  .utc()
                  .format('YYYY')}`
              : `${moment(endDate).utc().format('MMMM')} ${moment(selectedDate)
                  .utc()
                  .format('YYYY')}`}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.arrowContainer}
          onPress={() => onNext(endDate)}>
          <Image
            source={images.leftArrow}
            style={[styles.arrowIcon, {transform: [{rotate: '180deg'}]}]}
          />
        </TouchableOpacity>
      </View>
    ) : (
      <View />
    )}

    <TouchableOpacity style={styles.buttonContainer} onPress={onToggleView}>
      <Image source={images.arrows} style={styles.buttonIcon} />
      <Text style={styles.buttonText}>
        {isListView ? strings.calender : strings.list}
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  parent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: colors.grayBackgroundColor,
  },
  buttonIcon: {
    width: 9,
    height: 10,
    resizeMode: 'cover',
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginLeft: 5,
  },
  calInnerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  arrowContainer: {
    width: 20,
    height: 25,
    backgroundColor: colors.lightGrey,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  arrowIcon: {
    width: 5,
    height: 10,
    resizeMode: 'cover',
  },
  monthLabel: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
});
export default AvailabilityHeader;
