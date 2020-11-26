import { Text, View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import React from 'react';
import colors from '../Constants/Colors';
import { widthPercentageToDP as wp } from '../utils';
import images from '../Constants/ImagePath';
import fonts from '../Constants/Fonts';

const TCTeamVS = ({
  firstTeamName,
  secondTeamName,
  firstTeamProfilePic,
  secondTeamProfilePic,
}) => (
  <View style={{ ...styles.teamVsSContainer }}>
    <View style={styles.leftTeamContainer}>
      <LinearGradient
                    colors={[colors.themeColor, colors.yellowColor]}
                    style={{ ...styles.teamLogoContainer, marginRight: wp(2) }}
                >
        <View style={styles.teamInnerLogoContainer}>
          <FastImage
                            resizeMode={'cover'}
                            source={firstTeamProfilePic ? { uri: firstTeamProfilePic } : images.teamPlaceholder }
                            style={{ height: 18, width: 18, borderRadius: 50 }}
                        />
        </View>
      </LinearGradient>
      <Text style={{ ...styles.teamTextContainer }}>
        {firstTeamName ?? ''}
      </Text>
    </View>
    <Text style={styles.vsText}>VS</Text>
    <View style={styles.rightTeamContainer}>
      <Text style={{ ...styles.teamTextContainer, textAlign: 'right' }}>
        {secondTeamName ?? ''}
      </Text>
      <LinearGradient
                    colors={[colors.blueGradiantStart, colors.blueGradiantEnd]}
                    style={{ ...styles.teamLogoContainer, marginLeft: wp(2) }}
                >
        <View style={{ ...styles.teamInnerLogoContainer }}>
          <FastImage
                            resizeMode={'cover'}
                            source={secondTeamProfilePic ? { uri: secondTeamProfilePic } : images.teamPlaceholder }
                            style={{ height: 18, width: 18, borderRadius: 50 }}
                        />
        </View>
      </LinearGradient>
    </View>
  </View>
)
const styles = StyleSheet.create({
  teamVsSContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginVertical: 5,
  },
  teamLogoContainer: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
    height: 30,
    width: 30,
    borderRadius: 50,
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamInnerLogoContainer: {
    overflow: 'hidden',
    height: 25,
    width: 25,
    borderRadius: 50,
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftTeamContainer: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    flex: 0.45,
    flexDirection: 'row',
  },
  rightTeamContainer: {
    justifyContent: 'flex-end',
    flex: 0.45,
    flexDirection: 'row',
  },
  teamTextContainer: {
    alignSelf: 'center',
    width: '70%',
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  vsText: {
    flex: 0.1,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
  },
})

export default TCTeamVS;
