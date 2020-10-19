/* eslint-disable react-native/no-raw-text */
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
import LinearGradient from 'react-native-linear-gradient';

import PATH from '../../Constants/ImagePath';
import constants from '../../config/constants';
import GameCard from './GameCard';

const { colors, fonts } = constants;

export default function MatchReservation() {
  return (
      <View>
          <Text style={ styles.reservationNumberText }>Reservation No: 1234567D1</Text>
          <View style={ styles.reservationTitleView }>
              <TouchableOpacity>
                  <LinearGradient
                colors={ [colors.yellowColor, colors.themeColor] }
                style={ styles.borderView }>
                      <View style={ styles.dateView }>
                          <Text style={ styles.dateText }>Feb{'\n'}15</Text>
                      </View>
                  </LinearGradient>
              </TouchableOpacity>
              <View style={ styles.reservationTypeView }>
                  <Text style={ [styles.reservationText, { color: '#FF4E00' }] }>RESERVATION REQUEST SENT</Text>
                  <Text style={ styles.matchText }>Match · Soccer</Text>
              </View>
              <View style={ styles.amountView }>
                  <Text style={ styles.amountText }>$35 CAD</Text>
                  <Text style={ styles.cancelAmountText }>$35 CAD</Text>
              </View>

          </View>
          <View style={ { flexDirection: 'row', marginLeft: 20, marginTop: 20 } }>
              <Image source={ PATH.requestIn } style={ styles.inOutImageView } />
              <View style={ styles.entityView }>
                  <Image source={ PATH.teamPlaceholder } style={ styles.profileImage } />
                  <Text style={ styles.entityName }>Vancouver Whitecaps <Text style={ [styles.requesterText, { color: colors.greeColor }] }>(requester) </Text></Text>
              </View>
          </View>
          <GameCard/>
          <TouchableOpacity>
              <LinearGradient
                    colors={ [colors.yellowColor, colors.themeColor] }
                    style={ styles.pendingButton }>

                  <Text style={ styles.pendingTimerText }>Respond within 1d 23h 59m</Text>

              </LinearGradient>
          </TouchableOpacity>
          <View style={ styles.bigDivider }></View>
      </View>
  );
}

const styles = StyleSheet.create({
  amountText: {
    color: colors.reservationAmountColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
    textAlign: 'right',
  },
  amountView: {
    marginTop: 10,
    position: 'absolute',
    right: 15,
  },
  bigDivider: {
    backgroundColor: colors.grayBackgroundColor,
    height: 7,
    width: wp('100%'),
  },
  borderView: {
    alignItems: 'center',
    borderRadius: 27,
    height: 54,
    justifyContent: 'center',
    marginLeft: 15,
    width: 54,
  },
  cancelAmountText: {
    color: colors.veryLightGray,
    fontFamily: fonts.RLight,
    fontSize: 14,
    textAlign: 'right',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  dateText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
    textAlign: 'center',
  },
  dateView: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  entityName: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
  entityView: {

    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 10,
  },
  inOutImageView: {
    alignSelf: 'center',
    height: 30,
    resizeMode: 'cover',
    width: 30,

  },
  matchText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 20,
  },
  pendingButton: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    height: 30,
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 30,
    width: wp('86%'),
  },
  pendingTimerText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 12,
    textAlign: 'center',

  },
  profileImage: {
    alignSelf: 'center',
    height: 30,
    resizeMode: 'cover',
    width: 30,
  },
  requesterText: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
  },
  reservationNumberText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    fontSize: 14,
    marginBottom: 10,
    marginRight: 15,
    marginTop: 15,
    textAlign: 'right',
  },
  reservationText: {
    fontFamily: fonts.RBold,
    fontSize: 14,
  },
  reservationTitleView: {
    flexDirection: 'row',

  },
  reservationTypeView: {
    alignContent: 'flex-start',
    alignSelf: 'center',
    marginLeft: 10,
  },
});
