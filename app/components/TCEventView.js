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

import constants from '../config/constants';
import PATH from '../Constants/ImagePath';

const { colors } = constants;

export default function TCEventView({ onPress }) {
  return (
      <TouchableWithoutFeedback style={ styles.backgroundView } onPress={ onPress }>
          <View style={ styles.backgroundView } onPress={ onPress }>
              <View style={ styles.colorView }>
                  <Text style={ styles.dateMonthText }>Aug </Text>
                  <Text style={ styles.dateText }>13 </Text>
              </View>
              <View style={ styles.eventText }>
                  <View style={ styles.eventTitlewithDot }>
                      <Text style={ styles.eventTitle } numberOfLines={ 1 }>
                          Event 1 will come in Vancuver on special day dsfdsf dsf df adsfds
                          fsadfadsf
                      </Text>
                      <Image source={ PATH.vertical3Dot } style={ styles.threedot } />
                  </View>
                  <View style={ styles.descriptionView }>
                      <Text style={ styles.eventDescription } numberOfLines={ 2 }>
                          Event description for special event.
                      </Text>
                  </View>
                  <View style={ styles.bottomView }>
                      <Text style={ styles.eventTime }>12:00 PM - 11:00 AM</Text>
                      <Text> | </Text>
                      <Text style={ styles.eventLocation }>Vancouver, BC, Canada</Text>
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
    backgroundColor: colors.lightBlueColor,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    height: 86,
    justifyContent: 'center',
    width: wp('10%'),
  },

  dateMonthText: {
    color: colors.blueColor,
    fontSize: wp('3%'),
    // fontFamily: fonts.RLight,
    marginBottom: 5,
  },
  dateText: {
    color: colors.blueColor,
    fontSize: wp('3%'),
    // fontFamily: fonts.RBold,
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
