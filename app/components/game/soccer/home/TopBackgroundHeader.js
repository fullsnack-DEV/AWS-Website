import React, { useState } from 'react';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {
  Image, Platform, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import Header from '../../../Home/Header';
import images from '../../../../Constants/ImagePath';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import { widthPercentageToDP as wp } from '../../../../utils';

const bgImage = images.soccerBackground;
const TopBackgroundHeader = ({ gameData, navigation, children }) => {
  const [headerTitleShown, setHeaderTitleShown] = useState(true);
  const renderForeground = () => (
    <LinearGradient
      colors={ ['transparent', 'rgba(0,0,0,0.4)'] }
      style={styles.topImageInnerContainer}>
      <Text style={styles.vsTextStyle}>VS</Text>
      <View style={styles.topHeaderAbsoluteContainer}>
        <View style={styles.teamVsSContainer}>
          <View style={styles.leftTeamContainer}>
            <View style={{ ...styles.teamLogoContainer, marginRight: wp(2) }}>
              <FastImage
                resizeMode={'cover'}
                source={gameData?.home_team?.background_thumbnail ? { uri: gameData?.home_team?.background_thumbnail } : images.teamPlaceholder }
              style={{ height: 22, width: 22, borderRadius: 50 }}
            />
            </View>
            <Text style={{ ...styles.teamTextContainer }}>
              {gameData?.home_team?.group_name ?? ''}
            </Text>
          </View>
          <View style={styles.rightTeamContainer}>
            <Text style={{ ...styles.teamTextContainer, textAlign: 'right' }}>
              {gameData?.away_team?.group_name ?? ''}
            </Text>
            <View style={{ ...styles.teamLogoContainer, marginLeft: wp(2) }}>
              <FastImage
                resizeMode={'cover'}
                    source={gameData?.away_team?.background_thumbnail ? { uri: gameData?.away_team?.background_thumbnail } : images.teamPlaceholder }
                    style={{ height: 22, width: 22, borderRadius: 50 }}
                />
            </View>
          </View>
        </View>
        {/* <View style={styles.championLeagueButtonContainer}> */}
        {/*  <Text style={styles.championLeagueButtonText}>Champion league</Text> */}
        {/* </View> */}
        <View style={styles.bottomInfoContainer}>
          <Text style={styles.bottomInfoText} numberOfLines={1}>{gameData?.venue?.address ?? ''}{'  '}</Text>
          <View style={{
            alignItems: 'center',
            borderLeftColor: colors.whiteColor,
            marginHorizontal: 5,
            paddingRight: 5,
            borderLeftWidth: 1,
          }}><Text style={styles.bottomInfoText}>{moment(new Date(gameData?.start_datetime * 1000 ?? '')).format('MMM DD , hh:mm a')}</Text></View>
        </View>
      </View>

    </LinearGradient>
  )

  const getScoreText = (firstTeamScore = 0, secondTeamScore = 0, teamNumber = 1) => {
    const isGreterTeam = firstTeamScore > secondTeamScore ? 1 : 2;
    let color = colors.whiteColor
    if (firstTeamScore !== secondTeamScore) {
      if (teamNumber === isGreterTeam) color = colors.yellowColor
      else color = colors.whiteColor
    }
    return (
      <Text style={{
        ...styles.topCloseHeaderText,
        fontFamily: fonts.RMedium,
        color,
      }}>
        {teamNumber === 1 ? firstTeamScore : secondTeamScore ?? 0}
      </Text>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <Header
          barStyle={'light-content'}
            safeAreaStyle={{ position: 'absolute' }}
            leftComponent={
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={images.backArrow} style={{ height: 22, width: 16, tintColor: colors.whiteColor }} />
              </TouchableOpacity>
            }
            centerComponent={
              <View style={styles.headerCenterStyle}>
                {headerTitleShown && <Text style={styles.headerCenterTextStyle}>Match</Text>}
              </View>
            }
        />
      <ParallaxScrollView
            backgroundColor="transparent"
            contentBackgroundColor="white"
            parallaxHeaderHeight={200}
            stickyHeaderHeight={Platform.OS === 'ios' ? 90 : 50}
            fadeOutForeground={false}
            onChangeHeaderVisibility={(isShown) => isShown !== headerTitleShown && setHeaderTitleShown(isShown)}
            renderFixedHeader={() => (
              <Header
                  barStyle={'light-content'}
                safeAreaStyle={{ position: 'absolute' }}
                leftComponent={
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={images.backArrow} style={{ height: 22, width: 16, tintColor: colors.whiteColor }} />
                  </TouchableOpacity>
                }
                centerComponent={
                  <View style={styles.headerCenterStyle}>
                    {headerTitleShown && <Text style={styles.headerCenterTextStyle}>Match</Text>}
                  </View>
                }
              />
            )}
            renderStickyHeader={() => (
              <View style={{ backgroundColor: colors.blackColor }}>
                <FastImage
                    source={bgImage}
                    resizeMode={'cover'}
                    blurRadius={1.5}
                    style={styles.stickyImageStyle} />
                <Header
                    barStyle={'light-content'}
                        safeAreaStyle={{ position: 'absolute' }}
                        centerComponent={
                          <View style={styles.closeHeaderCenterStyle}>
                            <View style={{
                              ...styles.teamLogoContainer,
                              height: 25,
                              width: 25,
                            }}>
                              <FastImage
                                  resizeMode={'contain'}
                                  source={gameData?.home_team?.background_thumbnail ? { uri: gameData?.home_team?.background_thumbnail } : images.teamPlaceholder }
                                  style={{ height: 17.5, width: 17.5, borderRadius: 50 }}
                              />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                              {getScoreText(gameData?.home_team_goal, gameData?.away_team_goal ?? 0, 1)}
                              <Text style={styles.topCloseHeaderText}>:</Text>
                              {getScoreText(gameData?.home_team_goal, gameData?.away_team_goal ?? 0, 2)}
                            </View>
                            <View style={{
                              ...styles.teamLogoContainer, height: 25, width: 25, marginRight: wp(2),
                            }}>
                              <FastImage
                                  resizeMode={'contain'}
                                  source={gameData?.away_team?.background_thumbnail ? { uri: gameData?.away_team?.background_thumbnail } : images.teamPlaceholder }
                                  style={{ height: 17.5, width: 17.5, borderRadius: 50 }}
                              />
                            </View>
                          </View>
                        }
                    />
              </View>
            )}
            renderForeground={renderForeground}
            renderBackground={() => (
              <FastImage
                  source={bgImage}
                  resizeMode={'cover'}
                  style={styles.topBackgroundImage} />
            )}
        >
        {children}
      </ParallaxScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  topImageInnerContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  headerCenterStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
  closeHeaderCenterStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headerCenterTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
  },
  topBackgroundImage: {
    height: 200,
    width: wp(100),
  },
  vsTextStyle: {
    fontSize: 24,
    fontFamily: fonts.RMedium,
    color: colors.whiteColor,
  },
  topHeaderAbsoluteContainer: {
    position: 'absolute',
    bottom: 10,
    alignItems: 'center',
  },
  stickyImageStyle: {
    opacity: 0.5,
    width: wp('100%'),
    height: 90,
  },
  teamVsSContainer: {
    width: wp(95),
    flexDirection: 'row',
    bottom: 20,

  },
  leftTeamContainer: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  rightTeamContainer: {
    justifyContent: 'flex-end',
    flex: 1,
    flexDirection: 'row',
  },
  teamLogoContainer: {
    overflow: 'hidden',
    height: 35,
    width: 35,
    borderRadius: 50,
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamTextContainer: {
    alignSelf: 'center',
    width: '50%',
    fontSize: 14,
    fontFamily: fonts.RMedium,
    color: colors.whiteColor,
  },
  // championLeagueButtonContainer: {
  //   width: wp(100),
  //   height: 26.5,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginVertical: hp(1),
  //   backgroundColor: 'rgba(255,174,1,0.5)',
  // },
  // championLeagueButtonText: {
  //   fontFamily: fonts.RBold,
  //   fontSize: 12,
  //   textTransform: 'uppercase',
  //   color: colors.whiteColor,
  //
  // },
  bottomInfoContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  bottomInfoText: {
    width: wp(45),
    fontFamily: fonts.RRegular,
    fontSize: 12,
    color: colors.whiteColor,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  topCloseHeaderText: {
    fontSize: 25,
    fontFamily: fonts.RLight,
    color: colors.whiteColor,
    marginHorizontal: 5,
  },

})

export default TopBackgroundHeader;
