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
import images from '../Constants/ImagePath';
import colors from '../Constants/Colors'
import fonts from '../Constants/Fonts';
import EventOfItem from './Schedule/EventOfItem';
import EventBetweenUserItem from './Schedule/EventBetweenUserItem';

export default function TCEventView({
  onPress,
  data,
  onThreeDotPress,
  eventBetweenSection,
  eventOfSection,
}) {
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
    <TouchableWithoutFeedback style={ styles.backgroundView } onPress={ onPress }>
      <View style={ styles.backgroundView } onPress={ onPress }>
        <View style={ [styles.colorView, { backgroundColor: eventColor[0] !== '#' ? `#${eventColor}` : eventColor }] }>
          <Text style={ styles.dateMonthText }>{moment(startDate).format('MMM')}</Text>
          <Text style={ styles.dateText }>{moment(startDate).format('DD')}</Text>
        </View>
        <View style={ styles.eventText }>
          <View style={ styles.eventTitlewithDot }>
            <Text style={ [styles.eventTitle, { color: eventColor[0] !== '#' ? `#${eventColor}` : eventColor }] } numberOfLines={ 1 }>
              {title}
            </Text>
            <TouchableOpacity onPress={onThreeDotPress}>
              <Image source={ images.vertical3Dot } style={ styles.threedot } />
            </TouchableOpacity>
          </View>
          <Text style={ styles.eventDescription } numberOfLines={ 2 }>
            {description}
          </Text>
          <View style={ styles.bottomView }>
            <Text style={ styles.eventTime }>{`${moment(startDate).format('LT')} - `}</Text>
            <Text style={ styles.eventTime }>{moment(endDate).format('LT')}</Text>
            <Text style={ [styles.eventTime, { marginHorizontal: 5 }] }> | </Text>
            <Text style={ styles.eventTime }>{location}</Text>
          </View>
          {eventBetweenSection && <EventBetweenUserItem
            firstUserImage={images.commentReport}
            firstText={'Vancouver Whitecaps'}
            secondUserImage={images.usaImage}
            secondText={'Newyork City FC'}
          />}
          {eventOfSection && <EventOfItem
            eventOfText={'Event of'}
            countryIcon={images.commentReport}
            cityName={'Vancouver League'}
            leagueIcon={images.myTeams}
            eventTextStyle={{ color: eventColor[0] !== '#' ? `#${eventColor}` : eventColor }}
          />}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  backgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'row',
    marginBottom: 15,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    width: wp('94%'),
  },
  bottomView: {
    flexDirection: 'row',
    marginTop: 10,
  },
  colorView: {
    alignItems: 'center',
    backgroundColor: colors.orangeColor,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    paddingTop: 10,
    paddingLeft: 5,
    width: wp('12%'),
  },
  dateMonthText: {
    color: colors.whiteColor,
    fontSize: 16,
    fontFamily: fonts.RLight,
  },
  dateText: {
    color: colors.whiteColor,
    fontSize: 20,
    fontFamily: fonts.RBold,
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    lineHeight: 15,
  },
  eventText: {
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
