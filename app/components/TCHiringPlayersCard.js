import React, { memo } from 'react';
import {
  View,
  Text,

  StyleSheet,
  ImageBackground,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import TCGradientButton from './TCGradientButton';
import TCRoundChart from './TCRoundChart';

const TCHiringPlayersCard = ({ cardWidth = '86%', gameStatsData }) => (
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
            width: wp('32%'),
            resizeMode: 'cover',
            overflow: 'hidden',
            borderBottomRightRadius: 6,
            borderTopRightRadius: 6,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
      <TCGradientButton
            title={'Join'}
            style={{
              height: 25,
              borderRadius: 6,
              width: 95,
              marginBottom: 15,
            }}
            onPress={() => console.log('Join Press')}
          />
    </ImageBackground>
  </View>

  )

const styles = StyleSheet.create({
  backgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 6,
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
    // marginTop: 15,
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
});

export default memo(TCHiringPlayersCard);
