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

import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'
import images from '../../Constants/ImagePath';

export default function TCGameScoreLeft({ editor }) {
  return (
      <View>
          <View
        style={ {
          backgroundColor: colors.lightYellowColor,
        } }>
              <View
          style={ [
            styles.headerView,
            { backgroundColor: colors.lightYellowColor },
          ] }>
                  <View style={ styles.leftView }>
                      <View>
                          <Image
                source={ images.profilePlaceHolder }
                style={ styles.leftProfileImg }
              />
                      </View>
                      <Text style={ styles.leftPlayerText } numberOfLines={ 3 }>
                          Kishan Makani () received a yellow card
                      </Text>
                      <View style={ styles.gameRecordButton }>
                          <Image
                source={ images.gameOwnGoal }
                style={ [styles.gameRecordImg, { height: 16, width: 16 }] }
              />
                      </View>
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
                  <View style={ styles.rightBlankView }>
                      <Text style={ { fontFamily: fonts.RBold, fontSize: 12 } }>4m</Text>
                      <Text
              style={ {
                fontFamily: fonts.RRegular,
                fontSize: 13,
                color: colors.darkGrayColor,
              } }>
                          10:45 AM
                      </Text>
                  </View>
              </View>

              <Dash
          style={ {
            width: 1,
            height: 20,
            flexDirection: 'column',
            alignSelf: 'center',
          } }
          dashColor={ colors.lightgrayColor }
        />
              <Text
          style={ {
            textAlign: 'center',
            fontFamily: fonts.RLight,
            fontSize: 20,
            color: colors.darkGrayColor,
            backgroundColor: 'transparent',
            position: 'absolute',
            alignSelf: 'center',
            bottom: 0,
          } }>
                  <Text>0</Text> : <Text>0</Text>
              </Text>
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
    justifyContent: 'flex-start',
    width: '100%',
    // paddingTop: 10,
  },

  leftProfileImg: {
    borderRadius: 3,
    height: 25,
    marginLeft: 15,

    marginRight: 10,
    resizeMode: 'contain',
    width: 25,
  },
  leftView: {
    // backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',

    width: wp('49%'),
  },
  recordedBy: {
    color: colors.gameDetailColor,
    fontFamily: fonts.RLight,
    fontSize: 12,
    marginBottom: 6,
    marginRight: 10,
    marginTop: 6,
  },
  rightBlankView: {
    marginLeft: 10,
  },
});
