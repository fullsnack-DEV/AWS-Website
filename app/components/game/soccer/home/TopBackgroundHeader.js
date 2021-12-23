import React, {
  useCallback,
  useContext, useMemo, useRef, useState,
} from 'react';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {
  Image, StyleSheet, Text, TouchableOpacity, View, Alert,SafeAreaView,Platform
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import ActionSheet from 'react-native-actionsheet';
import Header from '../../../Home/Header';
import images from '../../../../Constants/ImagePath';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import { widthPercentageToDP as wp } from '../../../../utils';
import GameStatus from '../../../../Constants/GameStatus';
import { getChallengeDetail } from '../../../../screens/challenge/ChallengeUtility';
import AuthContext from '../../../../auth/context';
import ActivityLoader from '../../../loader/ActivityLoader';

import strings from '../../../../Constants/String';

const bgImage = images.soccerBackground;

const updating = false;
let lastDistance = null;

const TopBackgroundHeader = ({
  gameData, navigation, children, isAdmin, onBackPress, onEndReached, onResetGame,
}) => {
  const threeDotActionSheet = useRef();
  const [headerTitleShown, setHeaderTitleShown] = useState(true);
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);

  const onReachedEnd = useCallback(({ nativeEvent: e }) => {
    const offset = e?.contentOffset?.y;
    const height = e?.layoutMeasurement?.height;
    const total = offset + height;
    const theEnd = e?.contentSize.height;
    const distance = theEnd - total;
    if (distance < lastDistance) {
      if (!updating && (total >= theEnd)) {
        if (onEndReached) onEndReached();
      }
    }
    lastDistance = distance;
  }, [onEndReached])

  const renderForeground = () => (
    <LinearGradient
      colors={ ['transparent', 'rgba(0,0,0,0.4)'] }
      style={styles.topImageInnerContainer}>
      {renderTopHeader}
      <Text style={styles.vsTextStyle}>VS</Text>
      <View style={styles.topHeaderAbsoluteContainer}>
        <View style={styles.teamVsSContainer}>
          <View style={styles.leftTeamContainer}>
            <View style={{ ...styles.teamLogoContainer, marginRight: wp(2) }}>
              <FastImage
                resizeMode={'cover'}
                source={gameData?.home_team?.thumbnail ? { uri: gameData?.home_team?.thumbnail } : images.teamPlaceholder }
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
                    source={gameData?.away_team?.thumbnail ? { uri: gameData?.away_team?.thumbnail } : images.teamPlaceholder }
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

  const onThreeDorPress = () => {
    threeDotActionSheet.current.show();
  }
  // const resetGameDetail = useCallback((gameId) => {
  //   setloading(true);
  //   resetGame(gameId, authContext)
  //     .then((response) => {
  //       setloading(false);
  //       console.log('RESET GAME RESPONSE::', response.payload);
  //     })
  //     .catch((e) => {
  //       setloading(false);
  //       setTimeout(() => {
  //         Alert.alert(strings.alertmessagetitle, e.message);
  //       }, 10);
  //     });
  // }, [authContext])
  const goToChallengeDetail = useCallback((data) => {
    if (data?.responsible_to_secure_venue) {
      setloading(true);
      getChallengeDetail(data?.challenge_id, authContext).then((obj) => {
        console.log('Challenge Object:', JSON.stringify(obj.challengeObj));
        console.log('Screen name of challenge:', obj.screenName);
        setloading(false);
        navigation.navigate(obj.screenName, {
          challengeObj: obj.challengeObj || obj.challengeObj[0],
        });
      }).catch(() => setloading(false));
    }
  }, [authContext, navigation])

  const handleGoBack = useCallback(() => {
    // navigation.goBack();
    navigation.popToTop();
    if (onBackPress) onBackPress();
  }, [navigation, onBackPress])

  const renderBackground = useCallback(() => (
    <FastImage
          source={bgImage}
          resizeMode={'cover'}
          style={styles.topBackgroundImage} />
  ), [bgImage])

  const renderStickyHeader = useCallback(() => (
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
                      resizeMode={'cover'}
                      source={gameData?.home_team?.thumbnail ? { uri: gameData?.home_team?.thumbnail } : images.teamPlaceholder }
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
                      resizeMode={'cover'}
                      source={gameData?.away_team?.thumbnail ? { uri: gameData?.away_team?.thumbnail } : images.teamPlaceholder }
                      style={{ height: 17.5, width: 17.5, borderRadius: 50 }}
                  />
                </View>
              </View>
            }
        />
    </View>
  ), [gameData?.away_team?.thumbnail, gameData?.away_team_goal, gameData?.home_team?.thumbnail, gameData?.home_team_goal])

  const renderFixedHeader = useCallback(() => (
    <Header
          barStyle={'light-content'}
          safeAreaStyle={{ position: 'absolute' }}
          leftComponent={
            <TouchableOpacity onPress={handleGoBack}>
              <Image source={images.backArrow} style={{ height: 22, width: 16, tintColor: colors.whiteColor }} />
            </TouchableOpacity>
          }
          centerComponent={
            <View style={styles.headerCenterStyle}>
              {headerTitleShown && <Text style={styles.headerCenterTextStyle}>Match</Text>}
            </View>
          }
          rightComponent={isAdmin
          && <TouchableOpacity onPress={onThreeDorPress}>
            <Image source={images.threeDotIcon} style={{
              height: 22, width: 16, tintColor: colors.lightBlackColor, resizeMode: 'contain',
            }} />
          </TouchableOpacity>
          }
      />
  ), [handleGoBack, headerTitleShown, isAdmin])

  const onScroll = useCallback((e) => (onEndReached ? onReachedEnd(e) : null), [onEndReached, onReachedEnd])

  

  const renderTopHeader = useMemo(
    () => (
      <SafeAreaView>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <TouchableOpacity onPress={handleGoBack}>
            <Image
              source={images.backArrow}
              style={{ height: 22, width: 16, tintColor: colors.whiteColor }}
            />
          </TouchableOpacity>
          <View style={styles.headerCenterStyle}>
            {headerTitleShown && (
              <Text style={styles.headerCenterTextStyle}>Match</Text>
            )}
          </View>
          {isAdmin && <TouchableOpacity onPress={onThreeDorPress}>
            <Image
                source={images.threeDotIcon}
                style={{
                  height: 22,
                  width: 16,
                  tintColor: colors.whiteColor,
                  resizeMode: 'contain',
                }}
              />
          </TouchableOpacity>}
        </View>
      </SafeAreaView>
    ),
    [handleGoBack, headerTitleShown, isAdmin, onThreeDorPress],
  );

  return (
    <View style={{ flex: 1 }}>
      <ActivityLoader visible={loading}/>
      {/* {renderTopHeader} */}

      <ParallaxScrollView
          onScroll={onScroll}
          bounces={false}
          scrollEventThrottle={100}
            backgroundColor="transparent"
             contentBackgroundColor="white"
            parallaxHeaderHeight={200}
            stickyHeaderHeight={Platform.OS === 'ios' ? 0 : 0}
            fadeOutForeground={false}
            onChangeHeaderVisibility={(isShown) => isShown !== headerTitleShown && setHeaderTitleShown(isShown)}
            renderFixedHeader={renderFixedHeader}
            renderStickyHeader={renderStickyHeader}
            renderForeground={renderForeground}
            renderBackground={renderBackground}
        >

        {useMemo(() => {
          let destructiveButtonIndex = null;
          const options = [];
          if (gameData?.status === GameStatus?.accepted) {
            options.push('Game Reservation Details');
          }
          options.push('Winner & Stats');
          if (gameData?.status !== GameStatus?.accepted) {
            options.push('Reset Match');
            destructiveButtonIndex = options?.length - 1;
          }
          options.push('Cancel');
          const cancelButtonIndex = options?.length - 1;
          const onItemPress = (index) => {
            const item = options[index];
            if (item === 'Game Reservation Details') {
              goToChallengeDetail(gameData);
            } else if (item === 'Winner & Stats') {
              alert('Winner & Stats')
            } else if (item === 'Reset Match') {
              Alert.alert(
                strings.resetMatchRecord,
                '',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => { onResetGame() },
                  },
                ],
                { cancelable: false },
              );
            }
          }
          return (
            <ActionSheet
                  ref={threeDotActionSheet}
                  options={options}
                  cancelButtonIndex={cancelButtonIndex}
                  destructiveButtonIndex={destructiveButtonIndex}
                  onPress={onItemPress}
              />
          )
        }, [gameData, goToChallengeDetail, onResetGame])}
        {children}
      </ParallaxScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  topImageInnerContainer: {
    height: 200,
    padding: 10,
  },
  headerCenterStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
    color: colors.lightBlackColor,
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
    textAlign:'center',
    fontSize: 24,
    fontFamily: fonts.RMedium,
    color: colors.whiteColor,
  },
  topHeaderAbsoluteContainer: {
    
    right:15,
    left:15,
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
