import React from 'react';
import {
  StyleSheet,
  View,
  Text,

  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';

import {
  widthPercentageToDP as wp,

} from 'react-native-responsive-screen';
import moment from 'moment';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts';

export default function EventInCalender({ onPress, data, onThreeDotPress }) {
  let startDate = '';
  if (data && data.start_datetime) {
    startDate = new Date(data.start_datetime * 1000);
  }
  let endDate = '';
  if (data && data.end_datetime) {
    endDate = new Date(data.end_datetime * 1000);
  }
  let eventColor = '';
  if (data && data.color) {
    eventColor = data.color;
  }
  let location = '';
  if (data && data.location) {
    location = data.location;
  }
  let description = '';
  if (data && data.descriptions) {
    description = data.descriptions;
  }
  let title = '';
  if (data && data.title) {
    title = data.title;
  }

  return (
    <TouchableWithoutFeedback style={ styles.backgroundView } onPress={onPress}>
      <View style={ styles.backgroundView } onPress={ onPress }>
        <View style={ [styles.colorView, { backgroundColor: eventColor }] }>
          <Text style={ styles.hourTextStyle }>{moment(startDate).format('h')}
            <Text style={ styles.minuteTextStyle }>{moment(startDate).format(':mm')}</Text>
          </Text>
          <Text style={ styles.dateText }>{moment(startDate).format('a')}</Text>
        </View>
        <View style={ styles.eventText }>
          <View style={ styles.eventTitlewithDot }>
            <Text style={ [styles.eventTitle, { color: eventColor }] } numberOfLines={ 1 }>
              {title}
            </Text>
            <TouchableOpacity onPress={onThreeDotPress}>
              <Image source={ images.vertical3Dot } style={ styles.threedot } />
            </TouchableOpacity>
          </View>
          <View style={ styles.descriptionView }>
            <Text style={ styles.eventDescription } numberOfLines={ 2 }>
              {description}
            </Text>
          </View>
          <View style={ styles.bottomView }>
            <Text style={ styles.eventTime }>{`${moment(startDate).format('LT')} - `}</Text>
            <Text style={ styles.eventTime }>{`${moment(endDate).format('LT')} - `}</Text>
            <Text style={ [styles.eventTime, { marginHorizontal: 5 }] }> | </Text>
            <Text style={ styles.eventTime }>{location}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  backgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    elevation: 5,
    flexDirection: 'row',
    height: 86,
    marginBottom: 15,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    width: wp('94%'),
  },
  bottomView: {
    bottom: 5,
    flexDirection: 'row',
    marginLeft: 10,
    position: 'absolute',
  },
  colorView: {
    alignItems: 'center',
    backgroundColor: colors.orangeColor,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    height: 86,
    paddingTop: 10,
    width: wp('12%'),
  },
  hourTextStyle: {
    color: colors.whiteColor,
    fontSize: 20,
    fontFamily: fonts.RBold,
  },
  minuteTextStyle: {
    color: colors.whiteColor,
    fontSize: 13,
    fontFamily: fonts.RBold,
  },
  dateText: {
    color: colors.whiteColor,
    fontSize: 16,
    fontFamily: fonts.RLight,
    marginBottom: 5,
  },
  descriptionView: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    lineHeight: 15,
    flexWrap: 'wrap',
    top: 3,
  },
  eventText: {
    flexDirection: 'column',
    padding: 10,
    width: wp('83%'),
  },
  eventTime: {
    fontSize: 12,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    width: wp('70%'),
    color: colors.googleColor,
  },
  eventTitlewithDot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  threedot: {
    height: 12,
    right: 6,
    marginTop: 5,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    width: 12,
  },
});
