import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

import TCGameButton from '../../../components/TCGameButton';

import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors'

export default function GameRecording({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
          <TouchableWithoutFeedback
          onPress={ () => alert('This is a 3 dot button!') }>
              <Image source={ images.vertical3Dot } style={ styles.headerRightImg } />
          </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  return (
      <View style={ styles.mainContainer }>
          <View style={ styles.headerView }>
              <View style={ styles.leftView }>
                  <View style={ styles.profileShadow }>
                      <Image source={ images.team_ph } style={ styles.profileImg } />
                  </View>
                  <Text style={ styles.leftText } numberOfLines={ 2 }>
                      Kishan Makani
                  </Text>
              </View>
              <View style={ styles.centerView }>
                  <Text style={ styles.centerText }>0 : 0</Text>
              </View>
              <View style={ styles.rightView }>
                  <Text style={ styles.rightText } numberOfLines={ 2 }>
                      Kishan Makani
                  </Text>
                  <View style={ styles.profileShadow }>
                      <Image source={ images.team_ph } style={ styles.profileImg } />
                  </View>
              </View>
          </View>

          <View style={ styles.timeView }>
              <Text style={ styles.timer }>90 : 00 : 00</Text>
              <View style={ styles.curruentTimeView }>
                  <Image source={ images.curruentTime } style={ styles.curruentTimeImg } />
              </View>
              <Text style={ styles.startTime }>Game start at now</Text>
              <Image source={ images.dropDownArrow } style={ styles.downArrow } />
              <View style={ styles.separatorLine }></View>
          </View>

          <View style={ styles.entityView }>
              <LinearGradient
          colors={ [colors.yellowColor, colors.themeColor] }
          style={ styles.leftEntityView }></LinearGradient>

              <Text style={ styles.vs }>VS</Text>
              <LinearGradient
          colors={ [colors.yellowColor, colors.themeColor] }
          style={ styles.rightEntityView }></LinearGradient>
          </View>

          <View style={ styles.plusMinusView }>
              <LinearGradient
          colors={ [colors.yellowColor, colors.themeColor] }
          style={ styles.plusButton }>
                  <Image source={ images.gamePlus } style={ styles.gamePlus } />
              </LinearGradient>
              <Image source={ images.deleteRecentGoal } style={ styles.gameMinus } />
          </View>

          <View style={ styles.bottomView }>
              <View style={ styles.bottomLine }></View>
              <View style={ styles.gameRecordButtonView }>
                  <TCGameButton
            title="Start"
            onPress={ () => alert('Game Start Presses..') }
            buttonColor={ colors.themeColor }
            imageName={ images.gameStart }
            textColor={ colors.themeColor }
            imageSize={ 15 }
          />
                  <TCGameButton
            title="Records"
            onPress={ () => navigation.navigate('GameRecordList') }
            buttonColor={ colors.darkGrayColor }
            imageName={ images.gameRecord }
            textColor={ colors.darkGrayColor }
            imageSize={ 25 }
          />
                  <TCGameButton
            title="Details"
            onPress={ () => navigation.navigate('GameDetailRecord') }
            buttonColor={ colors.gameDetailColor }
            imageName={ images.gameDetail }
            textColor={ colors.gameDetailColor }
            imageSize={ 25 }
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
  bottomView: {
    bottom: 0,
    height: hp('15%'),

    position: 'absolute',
  },
  centerText: {
    // fontFamily: fonts.RLight,
    fontSize: 30,
  },
  centerView: {
    // backgroundColor: 'blue',
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
    marginTop: 30,
    // paddingBottom: hp('5%'),
    // paddingTop: hp('5%'),
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
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRightImg: {
    height: 15,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
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

    height: hp('35%'),
    marginLeft: wp('6%'),
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    width: wp('37%'),
  },
  leftText: {
    textAlign: 'left',
    flex: 1,
    flexWrap: 'wrap',
    // fontFamily: fonts.RMedium,
    fontSize: 16,
  },
  leftView: {
    // backgroundColor: 'green',
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
    height: hp('14%'),

    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  profileImg: {
    borderRadius: 3,
    height: 30,
    marginLeft: 15,

    marginRight: 15,
    resizeMode: 'contain',
    width: 30,
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
    elevation: 10,

    height: hp('35%'),
    marginRight: wp('6%'),
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    width: wp('37%'),
  },
  rightText: {
    textAlign: 'right',
    flex: 1,
    flexWrap: 'wrap',
    // fontFamily: fonts.RMedium,
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
    // fontFamily: fonts.RRegular,
    fontSize: 16,
  },
  timeView: {
    flexDirection: 'row',
    // backgroundColor: 'green',
    height: 70,
    alignItems: 'center',
  },
  timer: {
    // fontFamily: fonts.RMedium,
    fontSize: 30,
    marginLeft: 15,
  },
  vs: {
    alignSelf: 'center',
    // fontFamily: fonts.RLight,
    fontSize: 20,
  },
});
