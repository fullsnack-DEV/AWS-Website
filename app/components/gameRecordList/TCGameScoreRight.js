import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,

} from 'react-native';

import {
  widthPercentageToDP as wp,

} from 'react-native-responsive-screen';
import Dash from 'react-native-dash';

import constants from '../../config/constants';
import PATH from '../../Constants/ImagePath';

const { colors, fonts } = constants;

export default function TCGameScoreRight({ editor }) {
  return (
      <View>
          <View style={ styles.headerView }>
              <View style={ styles.leftBlankView }>
                  <Text
            style={ { fontFamily: fonts.RBold, fontSize: 12, textAlign: 'right' } }>
                      4m
                  </Text>
                  <Text
            style={ {
              fontFamily: fonts.RRegular,
              fontSize: 13,
              color: colors.darkGrayColor,
            } }>
                      10:45 AM
                  </Text>
              </View>
              <View style={ styles.centerView }>
                  <Dash
            style={ {
              width: 1,
              height: 70,
              flexDirection: 'column',
            } }
            dashColor={ colors.lightgrayColor }
          />
              </View>
              <View style={ styles.rightView }>
                  <View style={ styles.gameRecordButton }>
                      <Image
              source={ PATH.gameOwnGoal }
              style={ [styles.gameRecordImg, { height: 16, width: 16 }] }
            />
                  </View>
                  <Text style={ styles.rightPlayerText } numberOfLines={ 3 }>
                      Kishan Makani () received a yellow card
                  </Text>
                  <View>
                      <Image
              source={ PATH.profilePlaceHolder }
              style={ styles.rightProfileImg }
            />
                  </View>
              </View>
          </View>
          {editor && (
          <View style={ styles.editorView }>
              <Dash
            style={ {
              width: 1,
              height: 30,
              flexDirection: 'column',
            } }
            dashColor={ colors.lightgrayColor }
          />
              <View
            style={ {
              width: '100%',
              justifyContent: 'space-around',
              alignItems: 'space-around',
              position: 'absolute',
            } }>
                  <Text style={ styles.recordedBy }>
                      Recorded by Kishan Makani makani (50s ago)
                  </Text>
              </View>
          </View>
          )}
      </View>
  );
}

const styles = StyleSheet.create({

  centerView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: wp('2%'),
  },

  editorView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  gameRecordButton: {
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 15,

    elevation: 10,
    height: 30,
    justifyContent: 'center',
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,

    shadowRadius: 3,
    width: 30,
  },

  gameRecordImg: {
    resizeMode: 'contain',
  },

  headerView: {
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 70,
    justifyContent: 'flex-end',
    width: '100%',
    // paddingTop: 10,
  },
  leftBlankView: {
    marginRight: 10,
  },

  recordedBy: {
    color: colors.gameDetailColor,
    fontFamily: fonts.RLight,
    fontSize: 12,
    marginBottom: 6,
    marginRight: 10,
    marginTop: 6,
  },
  rightPlayerText: {
    color: colors.darkGrayColor,
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: fonts.RRegular,
    fontSize: 14,
    textAlign: 'right',
  },
  rightProfileImg: {
    borderRadius: 3,
    height: 25,
    marginLeft: 10,

    marginRight: 15,
    resizeMode: 'contain',
    width: 25,
  },
  rightView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',

    width: wp('49%'),
  },
});
