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

export default function TCGameScoreRight({left, onPress, editor}) {
  return (
    <View>
      <View style={styles.headerView}>
        <View style={styles.leftBlankView}>
          <Text
            style={{fontFamily: fonts.RBold, fontSize: 12, textAlign: 'right'}}>
            4m
          </Text>
          <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 13,
              color: colors.darkGrayColor,
            }}>
            10:45 AM
          </Text>
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
        <View style={styles.rightView}>
          <View style={styles.gameRecordButton}>
            <Image
              source={PATH.gameOwnGoal}
              style={[styles.gameRecordImg, {height: 16, width: 16}]}
            />
          </View>
          <Text style={styles.rightPlayerText} numberOfLines={3}>
            Kishan Makani () received a yellow card
          </Text>
          <View>
            <Image
              source={PATH.profilePlaceHolder}
              style={styles.rightProfileImg}
            />
          </View>
        </View>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    //paddingTop: 10,
  },

  rightView: {
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

  rightProfileImg: {
    height: 25,
    width: 25,
    resizeMode: 'contain',

    marginLeft: 10,
    marginRight: 15,
    borderRadius: 3,
  },

  leftPlayerText: {
    textAlign: 'left',
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: fonts.RRegular,
    fontSize: 14,

    color: colors.darkGrayColor,
  },
  rightPlayerText: {
    textAlign: 'right',
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.darkGrayColor,
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
