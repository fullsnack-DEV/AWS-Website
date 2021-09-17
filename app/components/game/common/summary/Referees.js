/* eslint-disable no-undef */
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
  Image,
  TouchableOpacity,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../../../utils';
import TCUserFollowUnfollowList from '../../../TCUserFollowUnfollowList';
import TCGradientButton from '../../../TCGradientButton';
import AuthContext from '../../../../auth/context';
import * as RefereeUtils from '../../../../screens/referee/RefereeUtility';
import ActivityLoader from '../../../loader/ActivityLoader';
import GameStatus from '../../../../Constants/GameStatus';
import RefereeReservationStatus from '../../../../Constants/RefereeReservationStatus';

import {
  checkReviewExpired,
  getGameHomeScreen,
} from '../../../../utils/gameUtils';
import strings from '../../../../Constants/String';
import images from '../../../../Constants/ImagePath';
import { getSetting } from '../../../../screens/challenge/manageChallenge/settingUtility';

let selectedRefereeData;
const Referees = ({
  gameData,
  isAdmin,
  userRole,
  followUser,
  unFollowUser,
  navigation,
  getRefereeReservation,
  onReviewPress,
}) => {
  const actionSheet = useRef();
  const teamListModalRef = useRef(null);

  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [refree, setRefree] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState();
  const [refereeSetting, setRefereeSetting] = useState();
  const [myUserId, setMyUserId] = useState(null);
  const [teamModalVisible, setTeamModalVisible] = useState(false);

  useEffect(() => {
    setMyUserId(authContext.entity.uid);
  }, [authContext.entity.uid]);
  useEffect(() => {
    if (isFocused) {
      getRefereeReservation(gameData?.game_id).then((res) => {
        const refData = res?.payload?.filter(
          (item) => ![RefereeReservationStatus.cancelled].includes(item?.status),
        );
        const cloneRefData = [];
        refData.map((item) => {
          const isExpired = new Date(item?.expiry_datetime * 1000).getTime()
            < new Date().getTime();
          if (
            item?.status === RefereeReservationStatus.offered
            && !isExpired
            && item?.initiated_by === authContext?.entity?.uid
          ) {
            cloneRefData.push(item);
          } else if (item?.status !== RefereeReservationStatus.offered) {
            cloneRefData.push(item);
          }
          return false;
        });
        console.log('referee reservation:=>', cloneRefData);
        setRefree([...cloneRefData]);
      });
    }
  }, [authContext?.entity?.uid, gameData, getRefereeReservation, isFocused]);

  const goToRefereReservationDetail = useCallback(
    (data) => {
      setloading(true);
      RefereeUtils.getRefereeReservationDetail(
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
      const refre = _.cloneDeep(refree);
      const index = refre.findIndex(
        (item) => item?.referee?.user_id === userID,
      );
      if (index > -1) refre[index].referee.is_following = status;
      setRefree(refre);
    },
    [refree],
  );

  const getRefereeStatusMessage = useCallback((item, type) => {
    console.log('Referee status::=>', item);
    const status = item?.status;
    let statusData = '';
    const isExpired = new Date(item?.expiry_datetime * 1000).getTime() < new Date().getTime();
    switch (status) {
      case RefereeReservationStatus.accepted:
        statusData = { status: 'Confirmed', color: colors.greeColor };
        break;
      case RefereeReservationStatus.restored:
        statusData = { status: 'Restored', color: colors.greeColor };
        break;
      case RefereeReservationStatus.cancelled:
        statusData = { status: 'Cancelled', color: colors.greeColor };
        break;
      case RefereeReservationStatus.declined:
        statusData = { status: 'Declined', color: colors.grayColor };
        break;
      case RefereeReservationStatus.pendingpayment:
        statusData = { status: 'Pending payment', color: colors.yellowColor };
        break;
      case RefereeReservationStatus.offered:
        if (isExpired) {
          statusData = { status: 'Expired', color: colors.userPostTimeColor };
        } else statusData = { status: 'Sent', color: colors.yellowColor };
        break;
      case RefereeReservationStatus.changeRequest:
        statusData = { status: 'Change requested', color: colors.yellowColor };
        break;
      default:
        statusData = { status: '' };
    }
    return statusData[type];
  }, []);

  const isCheckReviewButton = useCallback(
    (reservationDetail) => {
      if (
        gameData?.status === GameStatus.ended
        && ![
          RefereeReservationStatus.offered,
          RefereeReservationStatus.cancelled,
          RefereeReservationStatus.declined,
        ].includes(reservationDetail?.status)
        && !checkReviewExpired(gameData?.actual_enddatetime)
        && isAdmin
      ) {
        return true;
      }

      return false;
    },
    [gameData?.actual_enddatetime, gameData?.status, isAdmin],
  );

  const isCheckThreeDotButtonShown = useCallback(
    (item) => {
      // if (isCheckReviewButton(reservationDetail)) {
      //   return false;
      // }
      const entity = authContext?.entity;
      if (item?.initiated_by === entity?.uid) {
        return true;
      }

      return false;
    },
    [authContext?.entity],
  );
  const renderReferees = useCallback(
    ({ item }) => {
      const reservationDetail = item; // item?.reservation
      return (
        <TCUserFollowUnfollowList
          statusColor={getRefereeStatusMessage(reservationDetail, 'color')}
          statusTitle={getRefereeStatusMessage(reservationDetail, 'status')}
          myUserId={myUserId}
          isShowReviewButton={isCheckReviewButton(reservationDetail)}
          isReviewed={!!item?.referee?.review_id} // we have to change this condition if both player can give review to referee
          followUser={followUser}
          unFollowUser={unFollowUser}
          userID={reservationDetail?.referee?.user_id}
          title={reservationDetail?.referee?.full_name}
          subTitle={item?.chief_referee ? 'Chief' : 'Assistant'}
          is_following={reservationDetail?.referee?.is_following}
          onFollowUnfollowPress={onFollowPress}
          profileImage={reservationDetail?.referee?.thumbnail}
          isShowThreeDots={isCheckThreeDotButtonShown(item)}
          onThreeDotPress={() => {
            selectedRefereeData = item;
            actionSheet.current.show();
          }}
          userRole={userRole}
          onReviewPress={() => onReviewPress(item?.referee)}
        />
      );
    },
    [
      followUser,
      getRefereeStatusMessage,
      isCheckReviewButton,
      isCheckThreeDotButtonShown,
      myUserId,
      onFollowPress,
      onReviewPress,
      unFollowUser,
      userRole,
    ],
  );

  const handleBookReferee = useCallback(() => {
    navigation.navigate('BookReferee', { gameData });
  }, [gameData, navigation]);

  const handleSendOfferReferee = useCallback(() => {
    setloading(true);
    getSetting(
      authContext.entity.uid,
      'referee',
      gameData?.sport,
      authContext,
    )
      .then((response) => {
        setloading(false);

        setRefereeSetting(response);

        if (
          response?.refereeAvailibility
          && response?.game_fee
          && response?.refund_policy
          && response?.available_area
        ) {
          teamListModalRef.current.open();

          // Alert('setting availble');
          // navigation.navigate('RefereeBookingDateAndTime', {
          //   gameData,
          //   settingObj: refereeSettingObject,
          //   userData: currentUserData,
          //   isHirer: true,
          //   navigationName: 'HomeScreen',
          //   sportName,
          // });
        } else {
          Alert.alert(
            'You can\'t send offer, please configure your referee setting first.',
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
        <Text style={styles.notAvailableTextStyle}>No booked referee</Text>
      </View>
    ),
    [],
  );

  const refereeOfferValidation = useCallback(
    () => {
      if (
        authContext.entity.role === 'user'
        && authContext?.entity?.auth?.user?.referee_data.filter(
          (obj) => obj?.sport_name?.toLowerCase() === gameData?.sport?.toLowerCase(),
        ).length > 0
        && refree.filter((obj) => obj.referee_id === authContext.entity.uid)
          .length === 0
      ) {
        return true;
      }
      return false;
    },
    [authContext.entity?.auth?.user?.referee_data, authContext.entity.role, authContext.entity.uid, gameData?.sport, refree],
  );

  const renderBookRefereeButton = useMemo(() => {
    console.log('Book referee,', gameData);
    if (
        gameData.invited_to === authContext.entity.uid
       // isAdmin
      && [GameStatus.accepted, GameStatus.reset].includes(gameData?.status)
    ) {
      return (
        <TCGradientButton
          onPress={handleBookReferee}
          startGradientColor={colors.whiteColor}
          endGradientColor={colors.whiteColor}
          title={'BOOK REFEREE'}
          style={{
            borderRadius: 5,
            borderWidth: 1,
            borderColor: colors.greeColor,
            height: 28.5,
          }}
          textStyle={{ color: colors.greeColor, fontSize: 12 }}
          outerContainerStyle={{
            marginHorizontal: 5,
            marginTop: 5,
            marginBottom: 0,
          }}
        />
      );
    }
    if (refereeOfferValidation()) {
      return (
        <TCGradientButton
          onPress={handleSendOfferReferee}
          startGradientColor={colors.darkThemeColor}
          endGradientColor={colors.themeColor}
          title={'SEND REFEREE OFFER'}
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
    handleBookReferee,
    handleSendOfferReferee,
    isAdmin,
    refereeOfferValidation,
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
        Which team do you want to send a referee offer to?
      </Text>
    </View>
  );

  const renderTeams = useCallback(
    ({ item }) => (selectedTeam === item ? (
      <TouchableOpacity
          style={styles.teamMainContainer}
          onPress={() => {
            setSelectedTeam(item);
            setTimeout(() => {
              teamListModalRef.current.close();
              navigation.navigate('RefereeBookingDateAndTime', {
                gameData,
                settingObj: refereeSetting,
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
                    ? { uri: item?.thumbnail }
                    : images.teamPlaceholder
                }
                style={styles.profileImage}
              />
          </View>
          <View style={styles.topTextContainer}>
            <Text
                style={[styles.nameText, { color: colors.whiteColor }]}
                numberOfLines={1}>
              {item?.group_name}
            </Text>
            <Text
                style={[styles.locationText, { color: colors.whiteColor }]}
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
              navigation.navigate('RefereeBookingDateAndTime', {
                gameData,
                settingObj: refereeSetting,
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
                    ? { uri: item?.thumbnail }
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
      )),
    [gameData, navigation, refereeSetting, selectedTeam],
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
    style: { marginTop: 15 },
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <ActivityLoader visible={loading} />
        <Text style={styles.title}>Referees</Text>
        <FlatList
          keyExtractor={(item) => item?.user_id}
          bounces={false}
          data={refree} // gameData?.referees
          renderItem={renderReferees}
          ListEmptyComponent={ListEmptyComponent}
        />
        {renderBookRefereeButton}
        <ActionSheet
          ref={actionSheet}
          options={['Referee Reservation Details', 'Cancel']}
          cancelButtonIndex={1}
          onPress={(index) => {
            if (index === 0) {
              goToRefereReservationDetail(selectedRefereeData);
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
          overlayStyle={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          modalStyle={{
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            shadowColor: colors.blackColor,
            shadowOffset: { width: 0, height: -2 },
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
    shadowOffset: { width: 0, height: 3 },
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
    shadowOffset: { width: 0, height: 2 },
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
export default Referees;
