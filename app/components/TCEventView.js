import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedbackComponent,
  SafeAreaView,
  TextInput,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import constants from '../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../Constants/ImagePath';
import strings from '../Constants/String';

export default function TCEventView({onPress}) {
  return (
    <TouchableWithoutFeedback style={styles.backgroundView} onPress={onPress}>
      <View style={styles.backgroundView} onPress={onPress}>
        <View style={styles.colorView}>
          <Text style={styles.dateMonthText}>Aug </Text>
          <Text style={styles.dateText}>13 </Text>
        </View>
        <View style={styles.eventText}>
          <View style={styles.eventTitlewithDot}>
            <Text style={styles.eventTitle} numberOfLines={1}>
              Event 1 will come in Vancuver on special day dsfdsf dsf df adsfds
              fsadfadsf
            </Text>
            <Image source={PATH.vertical3Dot} style={styles.threedot} />
          </View>
          <View style={styles.descriptionView}>
            <Text style={styles.eventDescription} numberOfLines={2}>
              Event description for special event.
            </Text>
          </View>
          <View style={styles.bottomView}>
            <Text style={styles.eventTime}>12:00 PM - 11:00 AM</Text>
            <Text> | </Text>
            <Text style={styles.eventLocation}>Vancouver, BC, Canada</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  backgroundView: {
    backgroundColor: colors.whiteColor,
    flexDirection: 'row',
    borderRadius: 10,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    height: 86,
    alignSelf: 'center',
    width: wp('94%'),
    marginBottom: 15,
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

  colorView: {
    height: 86,
    width: wp('10%'),
    backgroundColor: colors.lightBlueColor,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventText: {
    flexDirection: 'column',
    width: wp('76%'),
    padding: 10,
  },
  eventTitlewithDot: {
    flexDirection: 'row',
  },
  eventTitle: {
    fontSize: wp('3.4%'),
    // fontFamily: fonts.RBold,
    //marginLeft: 15,
    //marginRight: 5,
    color: colors.googleColor,
    //marginTop: 8,
    marginBottom: 1,
  },
  descriptionView: {
    justifyContent: 'center',
    alignItems: 'flex-start',

    height: 30,
  },
  eventDescription: {
    fontSize: wp('3%'),
    // fontFamily: fonts.RRegular,

    color: colors.googleColor,
    lineHeight: 15,

    flexWrap: 'wrap',
  },

  bottomView: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 8,

    marginLeft: 10,
  },
  eventTime: {
    fontSize: wp('3%'),
    // fontFamily: fonts.RRegular,

    color: colors.googleColor,
  },
  eventLocation: {
    fontSize: wp('3%'),
    // fontFamily: fonts.RRegular,
    color: colors.googleColor,
  },
  threedot: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
    marginTop: 2,
    marginLeft: 20,
  },
});
