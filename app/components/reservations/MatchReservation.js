import React, { useEffect } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Image,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

import PATH from '../../Constants/ImagePath';
import constants from '../../config/constants';
import * as Utility from '../../utility/index';
import GameCard from './GameCard';

const { colors, fonts } = constants;
let switchEntity = '';
let myID = '';
let user = {};
let team = {};
export default function MatchReservation({ data, onPressButon }) {
  useEffect(() => {
    userDetailFromStorage();
  }, []);

  // const checkStatus = (invited_by, invited_to, myid) => {
  //   if (data.responsible_to_secure_venue) {
  //     if (data.invited_by == myID) {
  //       if (data.userChallenge) {
  //         if (data.home_team.user_id == myID) {
  //           console.log('not usefull');
  //           return true;
  //         }

  //         console.log('pick data from away team');
  //         return false;
  //       }

  //       console.log('Team to team challenge');

  //       console.log('i am requester');
  //     } else {
  //       if (data.userChallenge) {
  //         if (data.home_team.user_id == myID) {
  //           console.log('not usefull');
  //           return true;
  //         }

  //         console.log('pick data from away team');
  //         return false;
  //       }

  //       console.log('Team to team challenge');

  //       console.log('i am requstee');
  //     }
  //   } else {
  //     console.log('Referee or Scorekeeper');
  //   }
  // };

  const userDetailFromStorage = async () => {
    switchEntity = await Utility.getStorage('switchBy');
    if (switchEntity === 'user') {
      user = await Utility.getStorage('user');
      myID = user.user_id;
    } else if (switchEntity === 'team') {
      team = await Utility.getStorage('team');
      myID = team.group_id;
    }
  };
  return (
      <View>
          {data.reservation_id ? (
              <Text style={styles.reservationNumberText}>
                  Reservation No: {data.reservation_id}
              </Text>
          ) : (
              <Text style={styles.reservationNumberText}>
                  Reservation No: {data.challenge_id}
              </Text>
          )}

          <View style={styles.reservationTitleView}>
              <TouchableOpacity>
                  <LinearGradient
            colors={[colors.yellowColor, colors.themeColor]}
            style={styles.borderView}>
                      <View style={styles.dateView}>
                          <Text style={styles.dateText}>Feb{'\n'}15</Text>
                      </View>
                  </LinearGradient>
              </TouchableOpacity>
              <View style={styles.reservationTypeView}>
                  <Text style={[styles.reservationText, { color: '#FF4E00' }]}>
                      RESERVATION REQUEST SENT
                  </Text>

                  {data.responsible_to_secure_venue && (
                  <Text style={styles.matchText}>Match · {data.sport}</Text>
                  )}
                  {data.referee && data.game && (
                  <Text style={styles.matchText}>Referee · {data.game.sport}</Text>
                  )}
                  {data.scorekeeper && data.game && (
                  <Text style={styles.matchText}>
                      Scorekeeper · {data.game.sport}
                  </Text>
                  )}
              </View>
              <View style={styles.amountView}>
                  <Text style={styles.amountText}>${data.amount} CAD</Text>
                  <Text style={styles.cancelAmountText}>$35 CAD</Text>
              </View>
          </View>

          {data.responsible_to_secure_venue
      && data.invited_by === myID
      && data.invited_to === data.home_team.user_id ? (
          <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 20 }}>
              <Image source={PATH.requestOut} style={styles.inOutImageView} />
              <View style={styles.entityView}>
                  {data.home_team.thumbnail && (
                  <Image
                source={{ uri: data.home_team.thumbnail }}
                style={styles.profileImage}
              />
                  )}
                  {data.home_team && (
                  <Text style={styles.entityName}>
                      {data.home_team.full_name}
                      <Text style={[styles.requesterText, { color: colors.greeColor }]}>
                          {' '}
                          (challenger){' '}
                      </Text>
                  </Text>
                  )}
              </View>
          </View>
            ) : (
                <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 20 }}>
                    <Image source={PATH.requestIn} style={styles.inOutImageView} />
                    <View style={styles.entityView}>
                        <Image source={PATH.teamPlaceholder} style={styles.profileImage} />
                        {/* {data.away_team.thumbnail && <Image source={{uri: data.away_team.thumbnail}} style={styles.profileImage} />} */}
                        {data.away_team && (
                        <Text style={styles.entityName}>
                            {data.away_team.full_name}
                            <Text style={[styles.requesterText, { color: colors.greeColor }]}>
                                {' '}
                                (challengee){' '}
                            </Text>
                        </Text>
                        )}
                    </View>
                </View>
            )}

          {data.game ? <GameCard data={data.game} /> : <GameCard data={data} />}

          {data.status === 'pending' ? <TouchableOpacity>
              <LinearGradient
          colors={[colors.yellowColor, colors.themeColor]}
          style={styles.pendingButton}>
                  <Text style={styles.pendingTimerText}>Respond within 1d 23h 59m</Text>
              </LinearGradient>
          </TouchableOpacity> : <TouchableOpacity onPress={onPressButon}>
              <LinearGradient
            colors={[colors.yellowColor, colors.themeColor]}
            style={styles.borderButtonView}>
                  <View style={styles.borderButtonWhiteView}>
                      <Text style={styles.detailButtonText}>DETAILS</Text>
                  </View>
              </LinearGradient>
          </TouchableOpacity>}

          <View style={styles.bigDivider}></View>
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
  borderButtonView: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    height: 30,
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 30,
    width: wp('86%'),
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
  borderButtonWhiteView: {
    backgroundColor: 'white',
    borderRadius: 5,
    height: 27.5,
    width: wp('85.5%'),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailButtonText: {
    alignSelf: 'center',
    color: colors.themeColor,
    fontFamily: fonts.RBold,
    fontSize: 12,
    textAlign: 'center',

  },
  entityName: {
    marginLeft: 5,
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
    borderRadius: 15,
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
