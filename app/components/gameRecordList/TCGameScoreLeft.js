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
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Dash from 'react-native-dash';

import constants from '../../config/constants';
const {colors, fonts, urls} = constants;
import PATH from '../../Constants/ImagePath';
import strings from '../../Constants/String';

export default function TCGameScoreLeft({left, onPress, editor}) {
  return (
    <View>
      <View
        style={{
          backgroundColor: colors.lightYellowColor,
        }}>
        <View
          style={[
            styles.headerView,
            {backgroundColor: colors.lightYellowColor},
          ]}>
          <View style={styles.leftView}>
            <View>
              <Image
                source={PATH.profilePlaceHolder}
                style={styles.leftProfileImg}
              />
            </View>
            <Text style={styles.leftPlayerText} numberOfLines={3}>
              Kishan Makani () received a yellow card
            </Text>
            <View style={styles.gameRecordButton}>
              <Image
                source={PATH.gameOwnGoal}
                style={[styles.gameRecordImg, {height: 16, width: 16}]}
              />
            </View>
          </View>
          <View style={styles.centerView}>
            <Dash
              style={{
                width: 1,
                height: 70,
                flexDirection: 'column',
              }}
              dashColor={colors.lightgrayColor}
            />
          </View>
          <View style={styles.rightBlankView}>
            <Text style={{fontFamily: fonts.RBold, fontSize: 12}}>4m</Text>
            <Text
              style={{
                fontFamily: fonts.RRegular,
                fontSize: 13,
                color: colors.darkGrayColor,
              }}>
              10:45 AM
            </Text>
          </View>
        </View>

        <Dash
          style={{
            width: 1,
            height: 20,
            flexDirection: 'column',
            alignSelf: 'center',
          }}
          dashColor={colors.lightgrayColor}
        />
        <Text
          style={{
            textAlign: 'center',
            fontFamily: fonts.RLight,
            fontSize: 20,
            color: colors.darkGrayColor,
            backgroundColor: 'transparent',
            position: 'absolute',
            alignSelf: 'center',
            bottom: 0,
          }}>
          <Text>0</Text> : <Text>0</Text>
        </Text>
      </View>
      {editor && (
        <View style={styles.editorView}>
          <Dash
            style={{
              width: 1,
              height: 30,
              flexDirection: 'column',
            }}
            dashColor={colors.lightgrayColor}
          />
          <View
            style={{
              width: '100%',
              justifyContent: 'space-around',
              alignItems: 'space-around',
              position: 'absolute',
            }}>
            <Text style={styles.recordedBy}>
              Recorded by Kishan Makani makani (50s ago)
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerView: {
    height: 70,
    alignContent: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    //paddingTop: 10,
  },

  rightView: {
    flexDirection: 'row',
    width: wp('49%'),
  },
  leftView: {
    //backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',

    width: wp('49%'),
  },
  centerView: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('2%'),
  },
  leftProfileImg: {
    height: 25,
    width: 25,
    resizeMode: 'contain',

    marginLeft: 15,
    marginRight: 10,
    borderRadius: 3,
  },
  rightProfileImg: {
    height: 25,
    width: 25,
    resizeMode: 'contain',

    marginLeft: 10,
    marginRight: 15,
    borderRadius: 3,
  },
  curruentTimeImg: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
  },

  leftPlayerText: {
    textAlign: 'left',
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: fonts.RRegular,
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.darkGrayColor,
  },
  rightPlayerText: {
    textAlign: 'right',
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: fonts.RRegular,
    fontSize: 14,
  },
  centerText: {
    fontFamily: fonts.RLight,
    fontSize: 30,
  },
  goalImage: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  gameRecordButton: {
    height: 30,
    width: 30,
    borderRadius: 15,

    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 10,
    backgroundColor: colors.whiteColor,

    justifyContent: 'center',
    alignItems: 'center',
  },
  rightBlankView: {
    marginLeft: 10,
  },
  leftBlankView: {
    marginRight: 10,
  },
  gameRecordImg: {
    resizeMode: 'contain',
  },
  editorView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordedBy: {
    fontFamily: fonts.RLight,
    fontSize: 12,
    color: colors.gameDetailColor,
    marginRight: 10,
    marginTop: 6,
    marginBottom: 6,
  },
});

{
}
