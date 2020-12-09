import React from 'react';
import {
  StyleSheet,
  View,
  Text,

} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  widthPercentageToDP as wp,

} from 'react-native-responsive-screen';

import images from '../../../../../Constants/ImagePath';
import colors from '../../../../../Constants/Colors';
import fonts from '../../../../../Constants/Fonts';
import {
  tennisGamePlayStats,
  tennisGamePlayStatsImage,
  getGameConvertMinsToTime,
  getGameDateTimeInHMSformat,
  getGameTimeAgo,
} from '../../../../../utils/gameUtils';

export default function TennisGameScoreRight({
  gameData,
  backgroundColor = colors.offwhite,
  editor = false,
  recordData,
}) {
  return (
    <View>
      <View style={{ ...styles.headerView, backgroundColor }}>
        <View style={ styles.leftBlankView }>
          <Text
            style={ { fontFamily: fonts.RBold, fontSize: 12, textAlign: 'right' } }>
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
        <View style={ styles.rightView }>
          <View style={{
            width: '20%',
            alignItems: 'flex-start',
            left: 10,
          }}>
            <View style={styles.gameRecordButton}>
              <FastImage
              source={ tennisGamePlayStatsImage[recordData?.verb] }
              style={ [styles.gameRecordImg, { height: 16, width: 16 }] }
            />
            </View>
          </View>
          <Text style={ styles.rightPlayerText } numberOfLines={ 3 }>
            {gameData?.away_team?.group_name ?? ''}
            <Text style={{ fontFamily: fonts.RMedium }}>
              {' '}{tennisGamePlayStats[recordData?.verb]}
            </Text>
          </Text>
          <View style={{ width: '22%' }}>
            <FastImage
                source={gameData?.away_team?.background_thumbnail ? { uri: gameData?.away_team?.background_thumbnail } : images.profilePlaceHolder }
              style={ styles.rightProfileImg }
            />
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
              Recorded by {recordData?.recorded_by_team_name ?? ''} ({getGameTimeAgo(recordData?.timestamp)})
            </Text>
          </View>
        </View>
      )}
    </View>
  );
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
    justifyContent: 'center',
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    width: 20,
  },

  gameRecordImg: {
    resizeMode: 'contain',
  },

  headerView: {
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 15,
    justifyContent: 'flex-end',
    width: '100%',

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
    width: '55%',
    fontFamily: fonts.RBlack,
    fontSize: 14,
    textAlign: 'right',
  },
  rightProfileImg: {
    borderRadius: 20,
    height: 20,
    marginLeft: 10,
    marginRight: 15,
    resizeMode: 'contain',
    width: 20,
  },
  rightView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: wp('49%'),
  },
});
