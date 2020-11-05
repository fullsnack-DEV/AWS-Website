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

import images from '../Constants/ImagePath';
import colors from '../Constants/Colors'
import fonts from '../Constants/Fonts';

export default function TCEventView({ onPress, data }) {
  return (
    <TouchableWithoutFeedback style={ styles.backgroundView } onPress={ onPress }>
      <View style={ styles.backgroundView } onPress={ onPress }>
        <View style={ [styles.colorView, { backgroundColor: data.eventColor }] }>
          <Text style={ styles.dateMonthText }>{data.dateMonth}</Text>
          <Text style={ styles.dateText }>{data.date}</Text>
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
            <Text style={ [styles.eventTime, { marginHorizontal: 5 }] }> | </Text>
            <Text style={ styles.eventTime }>{data.eventLocation}</Text>
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
