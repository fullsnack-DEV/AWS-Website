import React, {useEffect, useState, useContext, useLayoutEffect} from 'react';
import TCButton from '../../../components/TCButton';
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

import constants from '../../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';

export default function GameRecording({navigation}) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback
          onPress={() => alert('This is a 3 dot button!')}>
          <Image source={PATH.vertical3Dot} style={styles.headerRightImg} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerView}>
        <View style={styles.leftView}>
          <View style={styles.profileShadow}>
            <Image source={PATH.team_ph} style={styles.profileImg} />
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
            <Image source={PATH.team_ph} style={styles.profileImg} />
          </View>
        </View>
      </View>

      <View style={styles.timeView}>
        <Text style={styles.timer}>90 : 00 : 00</Text>
        <View style={styles.curruentTimeView}>
          <Image source={PATH.curruentTime} style={styles.curruentTimeImg} />
        </View>
        <Text style={styles.startTime}>Game start at now</Text>
        <Image source={PATH.dropDownArrow} style={styles.downArrow} />
        <View style={styles.separatorLine}></View>
      </View>

      <View style={styles.entityView}>
        <LinearGradient
          colors={[colors.yellowColor, colors.themeColor]}
          style={styles.leftEntityView}></LinearGradient>

        <Text style={styles.vs}>VS</Text>
        <LinearGradient
          colors={[colors.yellowColor, colors.themeColor]}
          style={styles.rightEntityView}></LinearGradient>
      </View>

      <View style={styles.plusMinusView}>
        <LinearGradient
          colors={[colors.yellowColor, colors.themeColor]}
          style={styles.plusButton}>
          <Image source={PATH.gamePlus} style={styles.gamePlus} />
        </LinearGradient>
        <Image source={PATH.deleteRecentGoal} style={styles.gameMinus} />
      </View>

      <View style={styles.bottomView}>
        <View style={styles.bottomLine}></View>
        <View style={styles.gameRecordButtonView}>
          <TCGameButton
            title="Start"
            onPress={() => alert('Game Start Presses..')}
            buttonColor={colors.themeColor}
            imageName={PATH.gameStart}
            textColor={colors.themeColor}
            imageSize={15}
          />
          <TCGameButton
            title="Records"
            onPress={() => navigation.navigate('GameRecordList')}
            buttonColor={colors.darkGrayColor}
            imageName={PATH.gameRecord}
            textColor={colors.darkGrayColor}
            imageSize={25}
          />
          <TCGameButton
            title="Details"
            onPress={() => navigation.navigate('GameDetailRecord')}
            buttonColor={colors.gameDetailColor}
            imageName={PATH.gameDetail}
            textColor={colors.gameDetailColor}
            imageSize={25}
            // extraImageStyle={{tintColor: colors.whiteColor}}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerView: {
    backgroundColor: colors.whiteColor,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    height: 70,
    alignContent: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRightImg: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    marginRight: 20,
  },
  rightView: {
    //backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',

    width: wp('40%'),
  },
  leftView: {
    //backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',

    width: wp('40%'),
  },
  centerView: {
    //backgroundColor: 'blue',
    alignItems: 'center',
    width: wp('20%'),
  },
  profileImg: {
    height: 30,
    width: 30,
    resizeMode: 'contain',

    marginLeft: 15,
    marginRight: 15,
    borderRadius: 3,
  },
  curruentTimeImg: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
  },
  curruentTimeView: {
    height: 30,
    width: 30,
    backgroundColor: colors.whiteColor,
    borderRadius: 15,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,

    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  profileShadow: {
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 10,
  },
  leftText: {
    textAlign: 'left',
    flex: 1,
    flexWrap: 'wrap',
    // fontFamily: fonts.RMedium,
    fontSize: 16,
  },
  rightText: {
    textAlign: 'right',
    flex: 1,
    flexWrap: 'wrap',
    // fontFamily: fonts.RMedium,
    fontSize: 16,
  },
  centerText: {
    // fontFamily: fonts.RLight,
    fontSize: 30,
  },
  timeView: {
    flexDirection: 'row',
    //backgroundColor: 'green',
    height: 70,
    alignItems: 'center',
  },
  separatorLine: {
    position: 'absolute',
    backgroundColor: colors.grayColor,
    width: wp('100%'),
    height: 0.5,
    bottom: 0,
  },
  timer: {
    // fontFamily: fonts.RMedium,
    fontSize: 30,
    marginLeft: 15,
  },
  startTime: {
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'right',
    // fontFamily: fonts.RRegular,
    fontSize: 16,
  },
  downArrow: {
    height: 12,
    width: 12,
    resizeMode: 'contain',

    marginLeft: 10,
    marginRight: 15,
  },
  entityView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    marginTop: 30,
    // paddingBottom: hp('5%'),
    // paddingTop: hp('5%'),
  },
  leftEntityView: {
    width: wp('37%'),
    height: hp('35%'),
    marginLeft: wp('6%'),

    backgroundColor: colors.whiteColor,
    borderRadius: 10,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  rightEntityView: {
    width: wp('37%'),
    height: hp('35%'),
    marginRight: wp('6%'),

    backgroundColor: colors.whiteColor,
    borderRadius: 10,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  vs: {
    alignSelf: 'center',
    // fontFamily: fonts.RLight,
    fontSize: 20,
  },
  plusButton: {
    width: 80,
    height: 80,

    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: 60,
    marginRight: 30,
    borderRadius: hp('10%'),
    backgroundColor: colors.whiteColor,
    borderRadius: 40,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 20},
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  gamePlus: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },
  gameMinus: {
    height: 35,
    width: 35,
    resizeMode: 'contain',
  },
  plusMinusView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',

    marginTop: 10,
    marginBottom: 10,
    height: hp('14%'),
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,

    height: hp('15%'),
  },
  bottomLine: {
    //position: 'absolute',
    backgroundColor: colors.grayColor,
    width: wp('100%'),
    height: 0.5,
    bottom: 0,
  },
  gameRecordButtonView: {
    flexDirection: 'row',
    //backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
