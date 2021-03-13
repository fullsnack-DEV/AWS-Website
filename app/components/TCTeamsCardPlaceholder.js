import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import TCGradientButton from './TCGradientButton';
import TCRoundChart from './TCRoundChart';
import useRenderCount from '../hooks/useRenderCount'
import { widthPercentageToDP } from '../utils';

const TCTeamsCardPlaceholder = ({
  cardWidth = '86%', gameStatsData, placeholderText = '',
}) => {
  useRenderCount('TCHiringPlayersCard')
  return (

    <View style={[styles.backgroundView, { width: wp(cardWidth) }]}>
      <View style={styles.eventText}>
        <View
            style={{
              width: wp('20%'),
              height: 102,
              // backgroundColor: 'green',
              borderBottomLeftRadius: 8,
              borderTopLeftRadius: 8,
            }}>
          <TCRoundChart gameStatsData ={gameStatsData}/>
        </View>
        <View style={{ width: wp('40%'), marginLeft: 10 }}>
          <View style={styles.bottomView}>
            <Text style={styles.levelText}>Lv.0</Text>
            <Text style={styles.textSaperator}> | </Text>
            <Text style={styles.pointView} numberOfLines={1}>
              0 points
            </Text>
          </View>
          <Text style={styles.eventTitle} numberOfLines={3}>
            United States women’s soccer team sdafs dsfafdsa fas fdsfa fdsaf
            fadfasf df dsfads fs
          </Text>
        </View>
      </View>
      <ImageBackground
          source={images.soccerBackground}
          style={{
            height: 102,
            width: wp('33%'),
            resizeMode: 'cover',
            overflow: 'hidden',
            borderBottomRightRadius: 8,
            borderTopRightRadius: 8,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
        <TCGradientButton
          startGradientColor = {colors.kHexColorFF8A01}
          endGradientColor = {colors.darkThemeColor}
            title={'$9999+ CAD'}
            style={{
              height: 25,
              borderRadius: 6,
              width: 95,
            }}
            onPress={() => console.log('Amount Pressed')}
          />
      </ImageBackground>
      <LinearGradient
        colors={[colors.yellowColor, colors.assistTextColor]}
          style={styles.overlayStyle}>
        <Text style={styles.placeholderTextStyle}>{placeholderText}</Text>
        <TouchableOpacity
              style={styles.startButton}
              onPress={() => {
              }}>
          <Text style={styles.startTitle}>Start</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>

  )
}

const styles = StyleSheet.create({
  backgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    height: 102,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: wp('86%'),
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 10,
  },
  bottomView: {
    flexDirection: 'row',
  },
  eventText: {
    flexDirection: 'row',
    width: wp('60%'),
  },
  levelText: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.userPostTimeColor,
  },
  eventTitle: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginBottom: 1,
    width: wp('25%'),
  },

  pointView: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.userPostTimeColor,

    flex: 1,
  },
  textSaperator: {
    color: colors.userPostTimeColor,
    marginLeft: 5,
    marginRight: 5,
    opacity: 0.4,
  },
  overlayStyle: {
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    height: 102,
    width: '100%',
    position: 'absolute',
    opacity: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderTextStyle: {
      fontSize: 16,
      fontFamily: fonts.RMedium,
      color: colors.whiteColor,
      textAlign: 'center',
  },
  startButton: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    elevation: 5,
    flexDirection: 'row',
    height: 25,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: widthPercentageToDP('20%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  startTitle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.themeColor,
    alignSelf: 'center',
  },
});

export default memo(TCTeamsCardPlaceholder);
