import React from 'react';
import {
  StyleSheet,
  View,
  Text,

} from 'react-native';

import {
  widthPercentageToDP as wp,

} from 'react-native-responsive-screen';
import Dash from 'react-native-dash';

import FastImage from 'react-native-fast-image';
import colors from '../../Constants/Colors'
import fonts from '../../Constants/Fonts'
import images from '../../Constants/ImagePath';
import {
  soccerGamePlayerStatusStats, soccerGamePlayStats, soccerGamePlayStatsImage,
  getGameConvertMinsToTime,
  getGameDateTimeInHMSformat,
  getGameTimeAgo,
} from '../../utils/gameUtils';

export default function TCGameScoreLeft(
  {
    gameData,
    editor = false,
    backgroundColor = colors.offwhite,
    recordData,
    style,
  },
) {
  const getScoreText = (homeTeamScore = recordData?.scoreboard?.home_team, awayTeamScore = recordData?.scoreboard?.away_team) => (
    <View style={{ width: wp(100), backgroundColor: colors.whiteColor }}>
      <Text
        style={ {
          textAlign: 'center',
          fontFamily: fonts.RLight,
          fontSize: 20,
          color: colors.lightBlackColor,
          backgroundColor: 'transparent',
          alignSelf: 'center',
          position: 'absolute',
          bottom: 0,
        } }>
        <Text
            style={[styles.scoreText, {
              color:
                homeTeamScore > awayTeamScore
                  ? colors.themeColor
                  : colors.lightBlackColor,
            }]}>
          {recordData?.scoreboard?.home_team ?? 0}
        </Text>
        {' : '}
        <Text
            style={[styles.scoreText, {
              color:
                homeTeamScore < awayTeamScore
                  ? colors.themeColor
                  : colors.lightBlackColor,
            }]}>
          {recordData?.scoreboard?.away_team ?? 0}
        </Text>
      </Text>
    </View>
    )
  return (
    <View style={style}>
      <View
            style={{
              backgroundColor,
            } }>
        <View
              style={ styles.headerView }>
          <View style={ styles.leftView }>
            <View style={{ width: '22%' }}>
              <FastImage
                    resizeMode={'cover'}
                    source={gameData?.home_team?.thumbnail ? { uri: gameData?.home_team?.thumbnail } : images.profilePlaceHolder }
                    style={ styles.leftProfileImg }
                />
            </View>
            <Text style={ styles.leftPlayerText } numberOfLines={ 3 }>
              {gameData?.home_team?.group_name ?? ''}
              <Text style={{ fontFamily: fonts.RMedium }}>
                {' '}{soccerGamePlayStats[recordData?.verb]}
              </Text>
            </Text>
            <View style={{ width: '25%', alignItems: 'flex-end', right: 10 }}>
              <View style={styles.gameRecordButton}>
                <FastImage
                      resizeMode={'contain'}
                      source={ soccerGamePlayStatsImage[recordData?.verb] }
                      style={ styles.gameRecordImg }
                  />
              </View>
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
            <Text style={ { fontFamily: fonts.RBold, fontSize: 12 } }>
              {getGameConvertMinsToTime(recordData?.minutes ?? 0)}
            </Text>
            <Text
                  style={ {
                    fontFamily: fonts.RLight,
                    fontSize: 12,
                    color: colors.darkGrayColor,
                  } }>
              {getGameDateTimeInHMSformat(recordData?.timestamp)}
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
        {!(recordData?.verb in soccerGamePlayerStatusStats) && getScoreText()}
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
              Recorded by {`${recordData?.recorded_by?.first_name } ${ recordData?.recorded_by?.last_name}` ?? ''} ({getGameTimeAgo(recordData?.timestamp)})
            </Text>
          </View>
        </View>
      )}
    </View>
  )
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
    backgroundColor: colors.whiteColor,
  },
  gameRecordButton: {
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 15,
    elevation: 10,
    height: 20,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    width: 20,
  },
  gameRecordImg: {
    height: 16,
    width: 16,
  },
  leftPlayerText: {
    width: '55%',
    fontFamily: fonts.RBlack,
    fontSize: 14,
  },
  headerView: {
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 70,
    justifyContent: 'flex-start',
    width: '100%',
  },

  leftProfileImg: {
    borderRadius: 15,
    height: 20,
    marginLeft: 15,
    marginRight: 10,
    resizeMode: 'contain',
    width: 20,
  },
  leftView: {
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
  scoreText: {
    color: colors.lightBlackColor,
  },
});
