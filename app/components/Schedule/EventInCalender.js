import React from 'react';
import {
  StyleSheet,
  View,
  Text,

  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  widthPercentageToDP as wp,

} from 'react-native-responsive-screen';
import moment from 'moment';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts';

export default function EventInCalender({ onPress, data }) {
  return (
    <TouchableWithoutFeedback style={ styles.backgroundView } onPress={ onPress }>
      <View style={ styles.backgroundView } onPress={ onPress }>
        <View style={ [styles.colorView, { backgroundColor: data.eventColor }] }>
          <Text style={ styles.dateMonthText }>{moment(data.date).format('MMM')}</Text>
          <Text style={ styles.dateText }>{moment(data.date).format('DD')}</Text>
        </View>
        <View style={ styles.eventText }>
          <View style={ styles.eventTitlewithDot }>
            <Text style={ [styles.eventTitle, { color: data.eventColor }] } numberOfLines={ 1 }>
              {data.title}
            </Text>
            <Image source={ images.vertical3Dot } style={ styles.threedot } />
          </View>
          <View style={ styles.descriptionView }>
            <Text style={ styles.eventDescription } numberOfLines={ 2 }>
              {data.description}
            </Text>
          </View>
          <View style={ styles.bottomView }>
            <Text style={ styles.eventTime }>{data.eventTime}</Text>
            <Text> | </Text>
            <Text style={ styles.eventLocation }>{data.eventLocation}</Text>
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
    borderRadius: 10,
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
    bottom: 8,
    flexDirection: 'row',
    marginLeft: 10,

    position: 'absolute',
  },
  colorView: {
    alignItems: 'center',
    backgroundColor: colors.orangeColor,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    height: 86,
    paddingTop: 10,
    paddingLeft: 5,
    width: wp('10%'),
  },

  dateMonthText: {
    color: colors.whiteColor,
    fontSize: 16,
    fontFamily: fonts.RLight,
    // marginBottom: 3,
  },
  dateText: {
    color: colors.whiteColor,
    fontSize: 20,
    fontFamily: fonts.RBold,
    marginBottom: 5,
  },
  descriptionView: {
    alignItems: 'flex-start',
    height: 30,

    justifyContent: 'center',
  },
  eventDescription: {
    fontSize: wp('3%'),
    // fontFamily: fonts.RRegular,

    color: colors.googleColor,
    lineHeight: 15,

    flexWrap: 'wrap',
  },
  eventLocation: {
    fontSize: wp('3%'),
    // fontFamily: fonts.RRegular,
    color: colors.googleColor,
  },
  eventText: {
    flexDirection: 'column',
    padding: 10,
    width: wp('76%'),
  },

  eventTime: {
    fontSize: wp('3%'),
    // fontFamily: fonts.RRegular,

    color: colors.googleColor,
  },
  eventTitle: {
    fontSize: wp('3.4%'),
    // fontFamily: fonts.RBold,
    // marginLeft: 15,
    // marginRight: 5,
    color: colors.googleColor,
    // marginTop: 8,
    marginBottom: 1,
  },
  eventTitlewithDot: {
    flexDirection: 'row',
  },
  threedot: {
    height: 12,
    marginLeft: 20,
    marginTop: 2,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    width: 12,
  },
});
