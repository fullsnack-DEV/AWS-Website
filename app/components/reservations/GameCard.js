import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

import {
  widthPercentageToDP as wp,

} from 'react-native-responsive-screen';

import constants from '../../config/constants';
import PATH from '../../Constants/ImagePath';

const { colors, fonts } = constants;

export default function GameCard({ onPress }) {
  return (
      <TouchableOpacity onPress={ onPress }>
          <View style={ styles.backgroundView }>
              <View style={ [styles.colorView, { backgroundColor: colors.yellowEventColor }] }>
                  <View style={ styles.dateView }>
                      <Text style={ styles.dateMonthText }>Aug </Text>
                      <Text style={ styles.dateText }>13 </Text>
                  </View>
              </View>
              <View style={ styles.eventText }>
                  <Text style={ styles.eventTitle }>Soccer</Text>
                  <View style={ styles.bottomView }>
                      <Text style={ styles.eventTimeLocation }>12:00 PM - 11:00 AM</Text>
                      <Text style={ styles.textSaperator }> | </Text>
                      <Text style={ styles.eventTimeLocation }>Vancouver, BC, Canada</Text>
                  </View>
                  <View style={ styles.gameVSView }>
                      <View style={ styles.leftGameView }>
                          <Image source={ PATH.teamPlaceholder } style={ styles.profileImage } />
                          <Text style={ styles.leftEntityText } numberOfLines={ 2 }>New york Football Team</Text>
                      </View>
                      <Text style={ styles.eventTimeLocation }>VS</Text>
                      <View style={ styles.rightGameView }>
                          <Text style={ styles.rightEntityText } numberOfLines={ 2 }>Vancuver New City Team</Text>
                          <Image source={ PATH.teamPlaceholder } style={ styles.profileImage } />
                      </View>
                  </View>
              </View>
          </View>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    height: 102,
    marginTop: 15,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: wp('86%'),

  },
  bottomView: {
    flexDirection: 'row',
  },
  colorView: {
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    height: 102,
    width: 42,
  },
  dateMonthText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RLight,
    fontSize: 12,
  },
  dateText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 12,
  },
  dateView: {
    marginTop: 15,
  },
  eventText: {
    flexDirection: 'column',
    padding: 10,
    width: wp('76%'),
  },
  eventTimeLocation: {
    color: colors.googleColor,
    fontFamily: fonts.RRegular,
    fontSize: 12,
  },
  eventTitle: {
    color: colors.googleColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginBottom: 1,
  },

  gameVSView: {
    alignItems: 'center',

    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 5,
  },
  leftEntityText: {
    color: colors.lightBlackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 11,
    marginLeft: 5,
    textAlign: 'left',
  },
  leftGameView: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 0.4,

    justifyContent: 'flex-start',
  },
  profileImage: {
    alignSelf: 'center',
    height: 35,
    resizeMode: 'cover',
    width: 35,
  },
  rightEntityText: {
    color: colors.lightBlackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 11,
    marginRight: 5,
    textAlign: 'right',
  },
  rightGameView: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 0.4,
    justifyContent: 'flex-end',

  },
  textSaperator: {
    color: colors.userPostTimeColor,
    marginLeft: 5,
    marginRight: 5,
    opacity: 0.4,
  },

});
