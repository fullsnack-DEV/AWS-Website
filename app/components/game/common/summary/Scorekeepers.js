/* eslint-disable consistent-return */
import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';

// import { useIsFocused } from '@react-navigation/native';
import ActionSheet from 'react-native-actionsheet';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import LinearGradient from 'react-native-linear-gradient';

import {getSetting} from '../../../../screens/challenge/manageChallenge/settingUtility';

import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../../../utils';
import TCUserFollowUnfollowList from '../../../TCUserFollowUnfollowList';
import TCGradientButton from '../../../TCGradientButton';
import AuthContext from '../../../../auth/context';
import ActivityLoader from '../../../loader/ActivityLoader';
import GameStatus from '../../../../Constants/GameStatus';
import * as ScorekeeperUtils from '../../../../screens/scorekeeper/ScorekeeperUtility';
import {
  checkReviewExpired,
  getGameHomeScreen,
} from '../../../../utils/gameUtils';

import ScorekeeperReservationStatus from '../../../../Constants/ScorekeeperReservationStatus';
import strings from '../../../../Constants/String';
import images from '../../../../Constants/ImagePath';

let selectedScorekeeperData;
const Scorekeepers = ({
  isAdmin,
  isRefereeAdmin,
  isScorekeeperAdmin,
  userRole,
  gameData,
  followUser,
  unFollowUser,
  navigation,
  onReviewPress,
  getScorekeeperReservation,
}) => {
  const actionSheet = useRef();
  const teamListModalRef = useRef(null);

  // const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [myUserId, setMyUserId] = useState(null);
  const [scorekeeper, setScorekeeper] = useState([]);
  const [scorekeeperSetting, setScorekeeperSetting] = useState();
  const [selectedTeam, setSelectedTeam] = useState();

  const [teamModalVisible, setTeamModalVisible] = useState(false);

  useEffect(() => {
    setMyUserId(authContext.entity.uid);
  }, [authContext.entity.uid]);
  useEffect(() => {
    getScorekeeperReservation(gameData?.game_id).then((res) => {
      console.log('Scorekeeper reservation::=>', res);
      const refData = res?.payload?.filter(
        (item) =>
          ![
            ScorekeeperReservationStatus.cancelled,
            ScorekeeperReservationStatus.declined,
          ].includes(item?.status),
      );
      const cloneRefData = [];
      refData.map((item) => {
        const isExpired =
          new Date(item?.expiry_datetime * 1000).getTime() <
          new Date().getTime();
        if (
          item?.status === ScorekeeperReservationStatus.offered &&
          !isExpired &&
          item?.initiated_by === authContext?.entity?.uid
        ) {
          cloneRefData.push(item);
        } else if (item?.status !== ScorekeeperReservationStatus.offered) {
          cloneRefData.push(item);
        }
        return false;
      });
      setScorekeeper([...cloneRefData]);
    });
  }, [authContext?.entity?.uid, gameData, getScorekeeperReservation]);

  const goToScorekeeperReservationDetail = useCallback(
    (data) => {
      setloading(true);
      ScorekeeperUtils.getScorekeeperReservationDetail(
        data?.reservation_id,
        authContext.entity.uid,
        authContext,
      )
        .then((obj) => {
          setloading(false);
          navigation.navigate(obj.screenName, {
            reservationObj: obj.reservationObj || obj.reservationObj[0],
          });
          setloading(false);
        })
        .catch(() => setloading(false));
    },
    [authContext, navigation],
  );

  const onFollowPress = useCallback(
    (userID, status) => {
      const index = scorekeeper.findIndex(
        (item) => item?.scorekeeper?.user_id === userID,
      );
      if (index > -1) scorekeeper[index].scorekeeper.is_following = status;
      setScorekeeper([...scorekeeper]);
    },
    [scorekeeper],
  );

  const getScorekeeperStatusMessage = useCallback((item, type) => {
    const status = item?.status;
    let statusData = '';
    const isExpired =
      new Date(item?.expiry_datetime * 1000).getTime() < new Date().getTime();
    switch (status) {
      case ScorekeeperReservationStatus.accepted:
        statusData = {status: 'Confirmed', color: colors.greeColor};
        break;
      case ScorekeeperReservationStatus.restored:
        statusData = {status: 'Restored', color: colors.greeColor};
        break;
      case ScorekeeperReservationStatus.cancelled:
        statusData = {status: 'Cancelled', color: colors.greeColor};
        break;
      case ScorekeeperReservationStatus.declined:
        statusData = {status: 'Declined', color: colors.grayColor};
        break;
      case ScorekeeperReservationStatus.pendingpayment:
        statusData = {status: 'Pending payment', color: colors.yellowColor};
        break;
      case ScorekeeperReservationStatus.offered:
        if (isExpired) {
          statusData = {status: 'Expired', color: colors.userPostTimeColor};
        } else statusData = {status: 'Sent', color: colors.yellowColor};
        break;
      case ScorekeeperReservationStatus.changeRequest:
        statusData = {status: 'Change requested', color: colors.yellowColor};
        break;
      default:
        statusData = {status: ''};
    }
    return statusData[type];
  }, []);

  const renderScorekeepers = useCallback(
    ({item}) => {
      const entity = authContext?.entity;
      const reservationDetail = item;

      return (
        <TCUserFollowUnfollowList
          statusColor={getScorekeeperStatusMessage(reservationDetail, 'color')}
          statusTitle={getScorekeeperStatusMessage(reservationDetail, 'status')}
          myUserId={myUserId}
          isShowReviewButton={
            gameData?.status === 'ended' &&
            ![
              ScorekeeperReservationStatus.offered,
              ScorekeeperReservationStatus.cancelled,
              ScorekeeperReservationStatus.declined,
            ].includes(reservationDetail?.status) &&
            !checkReviewExpired(gameData?.actual_enddatetime) &&
            (isAdmin || isRefereeAdmin || isScorekeeperAdmin)
          }
          isReviewed={!!item?.scorekeeper?.review_id}
          followUser={followUser}
          unFollowUser={unFollowUser}
          userID={reservationDetail?.scorekeeper?.user_id}
          title={reservationDetail?.scorekeeper?.full_name}
          is_following={reservationDetail?.scorekeeper?.is_following}
          onFollowUnfollowPress={onFollowPress}
          profileImage={reservationDetail?.scorekeeper?.thumbnail}
          isShowThreeDots={item?.initiated_by === entity?.uid && !isAdmin}
          onThreeDotPress={() => {
            selectedScorekeeperData = item;
            actionSheet.current.show();
          }}
          userRole={userRole}
          onReviewPress={() => onReviewPress(item?.scorekeeper)}
        />
      );
    },
    [
      authContext?.entity,
      followUser,
      gameData?.actual_enddatetime,
      gameData?.status,
      getScorekeeperStatusMessage,
      isAdmin,
      isRefereeAdmin,
      isScorekeeperAdmin,
      myUserId,
      onFollowPress,
      onReviewPress,
      unFollowUser,
      userRole,
    ],
  );

  const handleBookScorekeeper = useCallback(() => {
    navigation.navigate('BookScorekeeper', {
      filters: {
        location: gameData.city,
      },
      sport: gameData.sport,
      gameData,
    });
  }, [gameData, navigation]);

  const handleSendOfferScorekeeper = useCallback(() => {
    setloading(true);
    getSetting(
      authContext.entity.uid,
      'scorekeeper',
      gameData?.sport,
      authContext,
    )
      .then((response) => {
        setloading(false);
        console.log('Scorekeeper setting:=>', response);

        setScorekeeperSetting(response);

        if (
          response?.scorekeeper_availibility &&
          response?.game_fee &&
          response?.refund_policy &&
          response?.available_area
        ) {
          teamListModalRef.current.open();

          // Alert('setting availble');
          // navigation.navigate('ScorekeeperBookingDateAndTime', {
          //   gameData,
          //   settingObj: scorekeeperSettingObject,
          //   userData: currentUserData,
          //   isHirer: true,
          //   navigationName: 'HomeScreen',
          //   sportName,
          // });
        } else {
          Alert.alert(
            "You can't send offer, please configure your scorekeeper setting first.",
          );
        }
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.messages);
        }, 10);
      });
  }, [authContext, gameData?.sport]);

  const ListEmptyComponent = useMemo(
    () => (
      <View>
        <Text style={styles.notAvailableTextStyle}>No booked scorekeepers</Text>
      </View>
    ),
    [],
  );

  const scorekeeperOfferValidation = useCallback(() => {
    if (
      authContext.entity.role === 'user' &&
      authContext?.entity?.auth?.user?.scorekeeper_data?.filter(
        (obj) => obj?.sport === gameData?.sport,
      ).length > 0 &&
      scorekeeper?.filter(
        (obj) => obj?.scorekeeper_id === authContext?.entity?.uid,
      ).length > 0 &&
      gameData?.status !== GameStatus.ended
    ) {
      return true;
    }
    return false;
  }, [
    authContext.entity?.auth?.user?.scorekeeper_data,
    authContext.entity.role,
    authContext.entity?.uid,
    gameData?.sport,
    gameData?.status,
    scorekeeper,
  ]);

  const renderBookScorekeepersButton = useMemo(() => {
    console.log('Book scorekeeper');

    if (
      // isAdmin
      gameData?.challenge_scorekeepers?.who_secure?.[0]?.responsible_team_id ===
        authContext.entity.uid &&
      [GameStatus.accepted, GameStatus.reset].includes(gameData?.status)
    ) {
      return (
        <TCGradientButton
          onPress={handleBookScorekeeper}
          startGradientColor={colors.whiteColor}
          endGradientColor={colors.whiteColor}
          title={'BOOK SCOREKEEPERS'}
          style={{
            borderRadius: 5,
            borderWidth: 1,
            borderColor: colors.greeColor,
            height: 28.5,
          }}
          textStyle={{color: colors.greeColor, fontSize: 12}}
          outerContainerStyle={{
            marginHorizontal: 5,
            marginTop: 5,
            marginBottom: 0,
          }}
        />
      );
    }
    if (scorekeeperOfferValidation()) {
      return (
        <TCGradientButton
          onPress={handleSendOfferScorekeeper}
          startGradientColor={colors.darkThemeColor}
          endGradientColor={colors.themeColor}
          title={'SEND SCOREKEEPER OFFER'}
          style={{
            borderRadius: 5,
            borderWidth: 0,
            height: 35,
          }}
          textStyle={{
            color: colors.whiteColor,
            fontSize: 14,
            fontFamily: fonts.RBold,
          }}
          outerContainerStyle={{
            marginHorizontal: 5,
            marginTop: 5,
            marginBottom: 0,
          }}
        />
      );
    }
    return <View />;
  }, [
    gameData?.status,
    handleBookScorekeeper,
    handleSendOfferScorekeeper,
    isAdmin,
    scorekeeperOfferValidation,
  ]);

  const ModalHeader = () => (
    <View style={styles.headerStyle}>
      <View style={styles.handleStyle} />
      <Text
        style={{
          fontFamily: fonts.RBold,
          fontSize: 16,
          color: colors.lightBlackColor,
          marginLeft: 15,
        }}>
        Which team do you want to send a scorekeeper offer to?
      </Text>
    </View>
  );

  const renderTeams = useCallback(
    ({item}) =>
      selectedTeam === item ? (
        <TouchableOpacity
          style={styles.teamMainContainer}
          onPress={() => {
            setSelectedTeam(item);
            setTimeout(() => {
              teamListModalRef.current.close();
              navigation.navigate('ScorekeeperBookingDateAndTime', {
                gameData,
                settingObj: scorekeeperSetting,
                userData: item,
                isHirer: true,
                navigationName: getGameHomeScreen(gameData?.sport),
                sportName: gameData?.sport,
              });
            }, 500);
          }}>
          <LinearGradient
            colors={[colors.yellowColor, colors.orangeColor]}
            style={styles.teamContainer}>
            <View style={styles.profileView}>
              <Image
                source={
                  item?.thumbnail
                    ? {uri: item?.thumbnail}
                    : images.teamPlaceholder
                }
                style={styles.profileImage}
              />
            </View>
            <View style={styles.topTextContainer}>
              <Text
                style={[styles.nameText, {color: colors.whiteColor}]}
                numberOfLines={1}>
                {item?.group_name}
              </Text>
              <Text
                style={[styles.locationText, {color: colors.whiteColor}]}
                numberOfLines={1}>
                {item?.city}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.teamMainContainer}
          onPress={() => {
            setSelectedTeam(item);
            setTimeout(() => {
              teamListModalRef.current.close();
              navigation.navigate('ScorekeeperBookingDateAndTime', {
                gameData,
                settingObj: scorekeeperSetting,
                userData: item,
                isHirer: true,
                navigationName: getGameHomeScreen(gameData?.sport),
                sportName: gameData?.sport,
              });
            }, 500);
          }}>
          <View
            colors={[colors.whiteColor, colors.whiteColor]}
            style={styles.teamContainer}>
            <View style={styles.profileView}>
              <Image
                source={
                  item?.thumbnail
                    ? {uri: item?.thumbnail}
                    : images.teamPlaceholder
                }
                style={styles.profileImage}
              />
            </View>
            <View style={styles.topTextContainer}>
              <Text style={styles.nameText} numberOfLines={1}>
                {item?.group_name}
              </Text>
              <Text style={styles.locationText} numberOfLines={1}>
                {item?.city}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ),
    [gameData, navigation, scorekeeperSetting, selectedTeam],
  );
  const listEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No Teams Yet</Text>
    </View>
  );

  const flatListProps = {
    showsVerticalScrollIndicator: false,
    showsHorizontalScrollIndicator: false,
    keyboardShouldPersistTaps: 'never',
    bounces: false,
    data: [gameData?.home_team, gameData?.away_team],
    renderItem: renderTeams,
    keyExtractor: (index) => index.toString(),
    ListEmptyComponent: listEmptyComponent,
    style: {marginTop: 15},
  };

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Scorekeepers</Text>
        <FlatList
          keyExtractor={(item) => item?.user_id}
          bounces={false}
          data={scorekeeper}
          renderItem={renderScorekeepers}
          ListEmptyComponent={ListEmptyComponent}
        />

        {renderBookScorekeepersButton}
        <ActionSheet
          ref={actionSheet}
          options={['Scorekeeper Reservation Details', 'Cancel']}
          cancelButtonIndex={1}
          onPress={(index) => {
            if (index === 0) {
              goToScorekeeperReservationDetail(selectedScorekeeperData);
            }
          }}
        />
      </View>
      <Portal>
        <Modalize
          visible={teamModalVisible}
          onOpen={() => setTeamModalVisible(true)}
          snapPoint={hp(50)}
          withHandle={false}
          overlayStyle={{backgroundColor: 'rgba(255,255,255,0.2)'}}
          modalStyle={{
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            shadowColor: colors.blackColor,
            shadowOffset: {width: 0, height: -2},
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 10,
          }}
          onPositionChange={(position) => {
            if (position === 'top') {
              setTeamModalVisible(false);
            }
          }}
          ref={teamListModalRef}
          HeaderComponent={ModalHeader}
          flatListProps={flatListProps}
        />
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.whiteColor,
    marginBottom: hp(1),
  },
  contentContainer: {},
  title: {
    fontFamily: fonts.RRegular,
    fontSize: 20,
    color: colors.lightBlackColor,
  },
  notAvailableTextStyle: {
    margin: wp(4),
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },

  headerStyle: {
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    backgroundColor: colors.whiteColor,
  },
  handleStyle: {
    marginVertical: 15,
    alignSelf: 'center',
    height: 5,
    width: 40,
    borderRadius: 15,
    backgroundColor: '#DADBDA',
  },
  emptyText: {
    fontSize: 18,
    fontFamily: fonts.RMedium,
    color: colors.grayColor,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: '20%',
  },
  profileImage: {
    alignSelf: 'center',
    height: 40,
    width: 40,
    borderRadius: 80,
  },

  profileView: {
    backgroundColor: colors.whiteColor,
    height: 44,
    width: 44,
    borderRadius: 88,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
    marginLeft: 15,
  },
  topTextContainer: {
    marginLeft: 10,
    alignSelf: 'center',
  },
  nameText: {
    fontSize: 20,
    fontFamily: fonts.RMedium,
    // width: 200,
  },
  teamContainer: {
    height: 70,
    width: '90%',
    backgroundColor: colors.whiteColor,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderRadius: 8,
    elevation: 5,
    marginBottom: 15,
    marginTop: 5,
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
  },

  locationText: {
    fontSize: 14,
    fontFamily: fonts.RLight,
  },
});
export default Scorekeepers;
