import React from 'react';
import {
  StyleSheet,
  View,
  Text,

} from 'react-native';

import {
  widthPercentageToDP as wp,

} from 'react-native-responsive-screen';

import FastImage from 'react-native-fast-image';
import colors from '../../../../../Constants/Colors';
import fonts from '../../../../../Constants/Fonts';
import images from '../../../../../Constants/ImagePath';
import {
  tennisGamePlayStats,
  tennisGamePlayStatsImage,
  getGameConvertMinsToTime,
  getGameDateTimeInHMSformat,
} from '../../../../../utils/gameUtils';

export default function TennisGameScoreLeft(
  {
    gameData,
    editor = false,
    backgroundColor = colors.offwhite,
    recordData,
  },
) {
  return (
    <View>
      <View
            style={{
              backgroundColor,
            } }>
        <View
              style={ styles.headerView }>
          <View style={ styles.leftView }>
            <View style={{ width: '22%' }}>
              <FastImage
                  source={gameData?.home_team?.thumbnail ? { uri: gameData?.home_team?.thumbnail } : images.profilePlaceHolder }
                    style={ styles.leftProfileImg }
                />
            </View>
            <Text style={ styles.leftPlayerText } numberOfLines={ 3 }>
              {gameData?.home_team?.group_name ?? ''}
              <Text style={{ fontFamily: fonts.RMedium }}>
                {' '}{tennisGamePlayStats[recordData?.verb]}
              </Text>
            </Text>
            <View style={{ width: '25%', alignItems: 'flex-end', right: 10 }}>
              <View style={styles.gameRecordButton}>
                <FastImage
                    resizeMode={'contain'}
                      source={ tennisGamePlayStatsImage[recordData?.verb] }
                      style={ styles.gameRecordImg }
                  />
              </View>
            </View>
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

      </View>
      {editor && (
        <View style={ styles.editorView }>
          <View
                  style={ {
                    width: '100%',
                    justifyContent: 'space-around',
                    alignItems: 'space-around',
                  } }>
            <Text style={ styles.recordedBy }>
              Recorded by {`${recordData?.recorded_by?.first_name} ${recordData?.recorded_by?.last_name}` ?? ''}
            </Text>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
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
    marginVertical: 15,
    justifyContent: 'flex-start',
    width: '100%',
  },

  leftProfileImg: {
    borderRadius: 20,
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
});
