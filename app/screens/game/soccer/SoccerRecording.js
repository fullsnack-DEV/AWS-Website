import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableWithoutFeedback,
  Platform,
  TouchableOpacity,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import RNDateTimePicker from '@react-native-community/datetimepicker';

import TCGameButton from '../../../components/TCGameButton';

import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';

export default function SoccerRecording({ navigation }) {
  const [pickerShow, setPickerShow] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback
          onPress={() => Alert.alert('This is a 3 dot button!')}>
          <Image source={images.vertical3Dot} style={styles.headerRightImg} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  // const resizeLeftTeamView = () => {
  //   if (Platform.OS === 'ios') {
  //     if (!pickerShow) {
  //       return ([styles.leftEntityView, { height: hp('30%') }])
  //     }
  //     return ([styles.leftEntityView, { height: hp('15%') }])
  //   }
  //   return (styles.leftEntityView)
  // }
  // const resizerightTeamView = () => {
  //   if (Platform.OS === 'ios') {
  //     if (!pickerShow) {
  //       return ([styles.rightEntityView, { height: hp('30%') }])
  //     }
  //     return ([styles.rightEntityView, { height: hp('15%') }])
  //   }
  //   return (styles.rightEntityView)
  // }
  return (
    <View style={styles.mainContainer}>
      <View>
        <View style={styles.headerView}>
          <View style={styles.leftView}>
            <View style={styles.profileShadow}>
              <Image
                source={images.teamPlaceholder}
                style={styles.profileImg}
              />
            </View>
            <Text style={styles.leftText} numberOfLines={2}>
              Kishan Makani
            </Text>
          </View>
          <View style={styles.centerView}>
            <Text style={styles.centerText}>0 : 0</Text>
          </View>
          <View style={styles.rightView}>
            <Text style={styles.rightText} numberOfLines={2}>
              Kishan Makani
            </Text>
            <View style={styles.profileShadow}>
              <Image
                source={images.teamPlaceholder}
                style={styles.profileImg}
              />
            </View>
          </View>
        </View>

        <View style={styles.timeView}>
          <Text style={styles.timer}>90 : 00 : 00</Text>
          {pickerShow && (
            <View style={styles.curruentTimeView}>
              <Image
                source={images.curruentTime}
                style={styles.curruentTimeImg}
              />
            </View>
          )}

          <Text
            style={styles.startTime}
            onPress={() => {
              setPickerShow(!pickerShow);
            }}>
            Game start at now
          </Text>
          <Image source={images.dropDownArrow} style={styles.downArrow} />

          <View style={styles.separatorLine}></View>
        </View>
        {pickerShow && (
          <View>
            <RNDateTimePicker value={new Date()} mode={'datetime'} />
            <View style={styles.separatorLine} />
          </View>
        )}
      </View>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={styles.entityView}>
          <TouchableOpacity onPress={() => setSelectedTeam(1)}>
            {selectedTeam === 1 ? (
              <LinearGradient
                colors={
                  selectedTeam === 1
                    ? [colors.yellowColor, colors.themeColor]
                    : [colors.whiteColor, colors.whiteColor]
                }
                style={
                  // eslint-disable-next-line no-nested-ternary
                  Platform.OS === 'ios'
                    ? !pickerShow
                      ? [styles.leftEntityView, { height: hp('30%') }]
                      : [styles.leftEntityView, { height: hp('15%') }]
                    : styles.leftEntityView
                }>
                <Image
                  source={images.teamPlaceholder}
                  style={styles.teamProfileView}
                />
                <Text style={styles.teamNameText} numberOfLines={2}>
                  Kishan Makaniiiiiiiiiiiiiii
                </Text>
              </LinearGradient>
            ) : (
              <View style={
                // eslint-disable-next-line no-nested-ternary
                Platform.OS === 'ios'
                  ? !pickerShow
                    ? [styles.leftEntityView, { height: hp('30%') }]
                    : [styles.leftEntityView, { height: hp('15%') }]
                  : styles.leftEntityView
              }>
                <Image
                  source={images.teamPlaceholder}
                  style={styles.teamProfileView}
                />
                <Text style={styles.teamNameTextBlack} numberOfLines={2}>
                  Kishan Makaniiiiiiiiiiiiiii
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.vs}>VS</Text>

          <TouchableOpacity onPress={() => setSelectedTeam(2)}>
            {selectedTeam === 2 ? <LinearGradient
              colors={
                selectedTeam === 2
                  ? [colors.yellowColor, colors.themeColor]
                  : [colors.whiteColor, colors.whiteColor]
              }
              style={
                // eslint-disable-next-line no-nested-ternary
                Platform.OS === 'ios'
                  ? !pickerShow
                    ? [styles.rightEntityView, { height: hp('30%') }]
                    : [styles.rightEntityView, { height: hp('15%') }]
                  : styles.rightEntityView
              }>
              <Image
                source={images.teamPlaceholder}
                style={styles.teamProfileView}
              />
              <Text style={styles.teamNameText} numberOfLines={2}>
                Kishan Makani
              </Text>
            </LinearGradient> : <View style={
                // eslint-disable-next-line no-nested-ternary
                Platform.OS === 'ios'
                  ? !pickerShow
                    ? [styles.rightEntityView, { height: hp('30%') }]
                    : [styles.rightEntityView, { height: hp('15%') }]
                  : styles.rightEntityView
              }>
              <Image
                  source={images.teamPlaceholder}
                  style={styles.teamProfileView}
                />
              <Text style={styles.teamNameTextBlack} numberOfLines={2}>
                Kishan Makani
              </Text>
            </View>}

          </TouchableOpacity>
        </View>
        {!pickerShow && (
          <View style={styles.plusMinusView}>
            <LinearGradient
              colors={[colors.yellowColor, colors.themeColor]}
              style={styles.plusButton}>
              <Image source={images.gamePlus} style={styles.gamePlus} />
            </LinearGradient>
            <Image source={images.deleteRecentGoal} style={styles.gameMinus} />
          </View>
        )}
      </View>
      <View>
        <View style={{ flex: 1 }} />
        <View style={styles.bottomLine}></View>
        <View style={styles.gameRecordButtonView}>
          <TCGameButton
            title="Start"
            onPress={() => alert('Game Start Presses..')}
            gradientColor={[colors.yellowColor, colors.themeColor]}
            imageName={images.gameStart}
            textColor={colors.themeColor}
            imageSize={15}
          />
          <TCGameButton
            title="Records"
            onPress={() => navigation.navigate('SoccerRecordList')}
            gradientColor={[colors.veryLightBlack, colors.veryLightBlack]}
            imageName={images.gameRecord}
            textColor={colors.darkGrayColor}
            imageSize={25}
          />
          <TCGameButton
            title="Details"
            onPress={() => navigation.navigate('GameDetailRecord')}
            gradientColor={[colors.greenGradientStart, colors.greenGradientEnd]}
            imageName={images.gameDetail}
            textColor={colors.gameDetailColor}
            imageSize={30}
            // extraImageStyle={{tintColor: colors.whiteColor}}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomLine: {
    // position: 'absolute',
    backgroundColor: colors.grayColor,
    width: wp('100%'),
    height: 0.5,
    bottom: 0,
  },

  centerText: {
    fontFamily: fonts.RLight,
    fontSize: 30,
  },
  centerView: {
    alignItems: 'center',
    width: wp('20%'),
  },
  curruentTimeImg: {
    height: 15,
    resizeMode: 'contain',
    width: 15,
  },
  curruentTimeView: {
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 15,
    elevation: 10,
    height: 30,
    justifyContent: 'center',
    marginLeft: 15,
    marginRight: 15,
    shadowColor: colors.googleColor,

    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    width: 30,
  },
  downArrow: {
    height: 12,
    marginLeft: 10,
    marginRight: 15,

    resizeMode: 'contain',
    width: 12,
  },
  entityView: {
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '10%',
  },
  gameMinus: {
    height: 35,
    resizeMode: 'contain',
    width: 35,
  },
  gamePlus: {
    height: 24,
    resizeMode: 'contain',
    width: 24,
  },
  gameRecordButtonView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerRightImg: {
    height: 15,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.lightblackColor,
    width: 15,
  },
  headerView: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
    elevation: 10,
    flexDirection: 'row',
    height: 70,
    justifyContent: 'space-between',
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    width: '100%',
  },
  leftEntityView: {
    backgroundColor: colors.whiteColor,
    borderRadius: 10,
    elevation: 10,
    height: '30%',
    marginLeft: wp('6%'),
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('37%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftText: {
    textAlign: 'left',
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: fonts.RMedium,
    fontSize: 16,
  },
  leftView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',

    width: wp('40%'),
  },
  mainContainer: {
    flex: 1,
  },
  plusButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 40,

    elevation: 10,
    height: 80,
    justifyContent: 'center',
    marginLeft: 60,
    marginRight: 30,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    width: 80,
  },
  plusMinusView: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  profileImg: {
    borderRadius: 3,
    height: 30,
    marginLeft: 15,

    marginRight: 15,
    resizeMode: 'contain',
    width: 30,
  },
  teamProfileView: {
    borderRadius: 30,
    height: 60,
    width: 60,
    resizeMode: 'contain',
  },
  profileShadow: {
    elevation: 10,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  rightEntityView: {
    backgroundColor: colors.whiteColor,
    borderRadius: 10,
    elevation: 5,
    height: '30%',
    marginRight: wp('6%'),
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('37%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightText: {
    textAlign: 'right',
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: fonts.RMedium,
    fontSize: 16,
  },
  rightView: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',

    width: wp('40%'),
  },
  separatorLine: {
    backgroundColor: colors.grayColor,
    bottom: 0,
    height: 0.5,
    position: 'absolute',
    width: wp('100%'),
  },
  startTime: {
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'right',
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },
  timeView: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
  },
  timer: {
    fontFamily: fonts.RMedium,
    fontSize: 30,
    marginLeft: 15,
    color: colors.lightBlackColor,
  },
  vs: {
    alignSelf: 'center',
    fontFamily: fonts.RLight,
    fontSize: 20,
    color: colors.lightBlackColor,
  },
  teamNameText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.whiteColor,
    textAlign: 'center',
  },
  teamNameTextBlack: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    textAlign: 'center',
  },
});
