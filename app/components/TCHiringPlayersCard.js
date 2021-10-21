import React, { memo } from 'react';
import {
 View, Text, StyleSheet, Image,
 } from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';

const TCHiringPlayersCard = ({ data, entityType }) => (
  <LinearGradient
    colors={(entityType === 'team' && [colors.localHomeGradientStart, colors.localHomeGradientEnd]) || (entityType === 'club' && [colors.localHomeGreenGradientStart, colors.localHomeGreenGradientEnd]) || (entityType === 'league' && [colors.localHomeBlueGradientStart, colors.localHomeBlueGradientEnd])}
    style={styles.gradientContainer}>
    <Image
      source={
        data?.background_thumbnail ? { uri: data?.background_thumbnail } : null
      }
      style={styles.backgroundView}
    />
    <Image source={images.localhomeOverlay} style={styles.overlayView} />
    <View
      style={{
        width: wp('40%'),
        marginLeft: 10,
        marginTop: 10,
        position: 'absolute',
      }}>
      {/* <View style={styles.bottomView}>
        <Text style={styles.levelText}>Lv.0</Text>
        <Text style={styles.textSaperator}> | </Text>
        <Text style={styles.pointView} numberOfLines={1}>
          {data?.point} points
        </Text>
      </View> */}

      <View style={{ flexDirection: 'row' }}>
        <Image source={data?.thumbnail ? { uri: data?.thumbnail } : images.profilePlaceHolder} style={styles.profileImage} />
        <View style={{ flexDirection: 'column', marginLeft: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.entityTitle} numberOfLines={2}>
              {data?.group_name}
            </Text>
            <Image source={
              (entityType === 'team' && images.teamT) || (entityType === 'club' && images.clubC) || (entityType === 'league' && images.leagueL)} style={styles.teamTImage} />
          </View>
          <View>
            <Text style={styles.smallTitle} numberOfLines={2}>
              {data?.city} · {data?.sport}
            </Text>
          </View>
          <View>
            <Text style={styles.amountTitle} numberOfLines={2}>
              LV 13{data?.setting?.game_fee && ` · ${data?.setting?.game_fee?.fee} ${data?.setting?.game_fee?.currency_type}`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  gradientContainer: {
    alignSelf: 'center',
    width: '98%',
    borderRadius: 6,
    elevation: 5,
    flexDirection: 'row',
    height: 105,

    // marginTop: 15,
  },
  backgroundView: {
    height: 105,
    width: '100%',
  },
  overlayView: {
    position: 'absolute',
    height: 105,
    width: '100%',
  },
  profileImage: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
    borderRadius: 80,
  },

  entityTitle: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
  smallTitle: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 12,
  },
  amountTitle: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 12,
  },

  teamTImage: {
    resizeMode: 'contain',
    marginLeft: 5,
    // alignSelf: 'center',
    height: 15,
    width: 15,
  },
});

export default memo(TCHiringPlayersCard);
