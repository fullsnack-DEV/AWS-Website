import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import React, {
  useContext,
  memo,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react';

import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actionsheet';
import {format} from 'react-string-format';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import Header from '../../../components/Home/Header';
import PlayInProfileViewSection from './PlayInProfileViewSection';
import fonts from '../../../Constants/Fonts';
import PlayInInfoView from './info/PlayInInfoView';
import PlayInScoreboardView from './scoreboard/PlayInScoreboardView';
import PlayInStatsView from './stats/PlayInStatsView';
import {patchPlayer} from '../../../api/Users';
import {strings} from '../../../../Localization/translation';
import AuthContext from '../../../auth/context';

import * as Utility from '../../../utils';
import {getQBAccountType, QBcreateUser} from '../../../utils/QuickBlox';
import TCGradientDivider from '../../../components/TCThinGradientDivider';
import PlayInReviewsView from './stats/PlayInReviewsView';
import TCScrollableTabs from '../../../components/TCScrollableTabs';
import * as Utils from '../../challenge/manageChallenge/settingUtility';
import Verbs from '../../../Constants/Verbs';

let TAB_ITEMS = [];

let oppSetting = {};
let mySetting = {};

const PlayInModule = ({
  visible = false,
  onModalClose = () => {},
  userData,
  playInObject,
  isAdmin,
  navigation,
  openPlayInModal,
}) => {
  const actionSheetRef = useRef();
  const actionSheetSettingRef = useRef();
  const [singlePlayerGame, setSinglePlayerGame] = useState(true);
  const [mainTitle, setMainTitle] = useState();
  const authContext = useContext(AuthContext);
  const [currentUserData, setCurrentUserData] = useState();
  const [currentTab, setCurrentTab] = useState(0);

  const [challengeType, setChallengeType] = useState();

  const [loading, setloading] = useState(false);

  const onClose = useCallback(() => {
    onModalClose();
    setTimeout(() => {
      setCurrentTab(0);
    }, 10);
  }, [onModalClose]);

  useEffect(() => {
    getSettingOfBoth();
    if (userData) setCurrentUserData(userData);
  }, [userData]);

  useEffect(() => {
    if (
      playInObject?.sport !== Verbs.tennisSport &&
      playInObject?.sport_type !== Verbs.singleSport
    ) {
      TAB_ITEMS = [strings.infoTitle, strings.scoreboard, strings.stats];
      setSinglePlayerGame(false);
    } else
      TAB_ITEMS = [
        strings.infoTitle,
        strings.scoreboard,
        strings.stats,
        strings.reviews,
      ];
  }, [playInObject]);

  useEffect(() => {
    if (playInObject.sport) {
      if (
        playInObject.sport === Verbs.tennisSport &&
        playInObject.sport_type === Verbs.singleSport
      ) {
        setMainTitle({
          title: format(
            strings.playerIn,
            Utility.getSportName(playInObject, authContext),
          ),
          titleIcon: images.tennisSingleHeaderIcon,
        });
      } else {
        setMainTitle({
          title: format(
            strings.playIn,
            Utility.getSportName(playInObject, authContext),
          ),
          titleIcon: images.soccerImage,
        });
      }
    }
  }, [singlePlayerGame, playInObject, authContext]);
  const onSave = useCallback(
    (params) =>
      new Promise((resolve, reject) => {
        patchPlayer(params, authContext)
          .then((res) => {
            const entity = authContext.entity;
            entity.auth.user = res.payload;
            entity.obj = res.payload;
            // authContext.setEntity({...entity});
            // await Utility.setStorage('authContextUser', res.payload);
            // authContext.setUser(res.payload);
            setCurrentUserData({...res?.payload});
            resolve(res);
          })
          .catch((error) => {
            reject(error);
            Alert.alert(strings.alertmessagetitle, error.message);
          });
      }),
    [authContext],
  );

  const renderHeader = useMemo(
    () => (
      <>
        <Header
          safeAreaStyle={{marginTop: 10}}
          mainContainerStyle={styles.headerMainContainerStyle}
          centerComponent={
            <View style={styles.headerCenterViewStyle}>
              <FastImage
                source={mainTitle?.titleIcon}
                style={styles.soccerImageStyle}
                resizeMode={'contain'}
              />
              <Text style={styles.playInTextStyle}>
                {mainTitle?.title ?? ''}
              </Text>
            </View>
          }
          rightComponent={
            <TouchableOpacity onPress={onClose}>
              <FastImage
                source={images.cancelWhite}
                tintColor={colors.lightBlackColor}
                style={styles.cancelImageStyle}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          }
        />
        <TCGradientDivider width={'100%'} height={3} />
      </>
    ),
    [mainTitle?.title, mainTitle?.titleIcon, onClose],
  );

  const renderPlayInInfoTab = useMemo(
    () => (
      <ScrollView style={{flex: 1}}>
        <PlayInInfoView
          openPlayInModal={openPlayInModal}
          onSave={onSave}
          sportName={playInObject?.sport}
          sportType={playInObject?.sport_type}
          closePlayInModal={onClose}
          currentUserData={currentUserData}
          isAdmin={isAdmin}
          navigation={navigation}
        />
      </ScrollView>
    ),
    [
      currentUserData,
      isAdmin,
      navigation,
      onClose,
      onSave,
      openPlayInModal,
      playInObject?.sport,
      playInObject?.sport_type,
    ],
  );

  const renderScoreboardTab = useMemo(
    () => (
      <PlayInScoreboardView
        openPlayInModal={openPlayInModal}
        closePlayInModal={onClose}
        navigation={navigation}
        sportName={playInObject?.sport}
      />
    ),
    [navigation, onClose, openPlayInModal, playInObject?.sport],
  );

  const renderStatsViewTab = useMemo(
    () => (
      <ScrollView style={{flex: 1}}>
        <PlayInStatsView
          currentUserData={currentUserData}
          playInObject={playInObject}
          sportName={playInObject?.sport}
        />
      </ScrollView>
    ),
    [currentUserData, playInObject],
  );

  const renderReviewTab = useMemo(
    () => (
      <PlayInReviewsView
        currentUserData={currentUserData}
        playInObject={playInObject}
        sportName={playInObject?.sport}
      />
    ),
    [currentUserData, playInObject],
  );

  const renderTabs = useCallback(
    (item, index) => (
      <View tabLabel={item} style={{flex: 1}}>
        {index === 0 ? renderPlayInInfoTab : null}
        {index === 1 ? renderScoreboardTab : null}
        {index === 2 ? renderStatsViewTab : null}
        {index === 3 ? renderReviewTab : null}
      </View>
    ),
    [
      renderPlayInInfoTab,
      renderReviewTab,
      renderScoreboardTab,
      renderStatsViewTab,
    ],
  );

  // eslint-disable-next-line consistent-return
  const renderChallengeButton = () => {
    const mySport = authContext?.entity?.obj?.registered_sports?.filter(
      (obj) =>
        obj?.sport === playInObject?.sport &&
        obj?.sport_type === playInObject?.sport_type,
    );
    if (
      currentTab === 0 &&
      authContext?.entity?.uid !== currentUserData?.user_id &&
      (authContext?.entity?.role === Verbs.entityTypeUser ||
        authContext?.entity?.role === Verbs.entityTypePlayer) &&
      mySport?.length > 0
    ) {
      return (
        playInObject?.sport_type !== 'double' &&
        playInObject?.sport !== 'soccer' && (
          <TouchableOpacity
            onPress={onChallengePress}
            style={styles.challengeButtonContainer}>
            <LinearGradient
              colors={[colors.themeColor, '#FF3B00']}
              style={styles.challengeLinearContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                {(challengeType === 'both' || challengeType === 'challenge') &&
                  (oppSetting?.game_fee?.fee ? (
                    <Text
                      accessibilityLabel={
                        challengeType === 'both'
                          ? 'both-button'
                          : 'challenge-button'
                      }
                      style={styles.challengeButtonTitle}>
                      {strings.challenge}
                      <Text>{` $${oppSetting?.game_fee?.fee} ${
                        currentUserData?.currency_type ??
                        strings.defaultCurrency
                      }${' / match'}`}</Text>
                    </Text>
                  ) : (
                    <Text
                      accessibilityLabel="challenge-button"
                      style={styles.challengeButtonTitle}>
                      {strings.challenge}
                    </Text>
                  ))}
                {challengeType === 'invite' && (
                  <Text
                    accessibilityLabel="invite-button"
                    style={styles.challengeButtonTitle}>
                    {'Invite to challenge'}
                  </Text>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )
      );

      // Alert.alert(`You have to registerd ${Utility.getSportName(playInObject)}, before make a challenge.`)
    }
  };
  const getSettingOfBoth = useCallback(() => {
    const filteredSport = userData.registered_sports.filter(
      (obj) =>
        obj.sport === playInObject.sport &&
        obj.sport_type === playInObject.sport_type,
    );

    if (filteredSport.length > 0) {
      oppSetting = filteredSport[0].setting ?? {};
    }

    mySetting =
      (authContext?.entity?.obj?.registered_sports ?? []).filter(
        (o) =>
          o.sport === playInObject?.sport &&
          o.sport_type === playInObject?.sport_type,
      )[0]?.setting ?? {};

    console.log('opp setting', oppSetting);
    console.log('My setting', mySetting);
    if (
      mySetting !== undefined &&
      oppSetting !== undefined &&
      oppSetting?.availibility === Verbs.on &&
      mySetting?.availibility === Verbs.on
    ) {
      console.log('===1====');
      console.log('both123:=>');
      setChallengeType('both');
    } else if (
      (oppSetting?.game_duration || oppSetting?.score_rules) &&
      oppSetting?.availibility &&
      oppSetting?.availibility === Verbs.on &&
      (mySetting?.availibility === undefined ||
        mySetting?.availibility === Verbs.off) &&
      oppSetting?.special_rules !== undefined &&
      oppSetting?.general_rules !== undefined &&
      oppSetting?.responsible_for_referee &&
      oppSetting?.responsible_for_scorekeeper &&
      oppSetting?.game_fee &&
      oppSetting?.venue &&
      oppSetting?.refund_policy &&
      oppSetting?.home_away &&
      oppSetting?.game_type
    ) {
      console.log('===2====');
      console.log('challenge123:=>');
      setChallengeType('challenge');
    } else if (
      mySetting !== undefined &&
      (oppSetting?.availibility === undefined ||
        oppSetting?.availibility === Verbs.off) &&
      (mySetting?.game_duration || mySetting?.score_rules) &&
      (mySetting?.availibility !== undefined ||
        mySetting?.availibility === Verbs.on) &&
      mySetting?.special_rules !== undefined &&
      mySetting?.general_rules !== undefined &&
      mySetting?.responsible_for_referee &&
      mySetting?.responsible_for_scorekeeper &&
      mySetting?.game_fee &&
      mySetting?.venue &&
      mySetting?.refund_policy &&
      mySetting?.home_away &&
      mySetting?.game_type
    ) {
      console.log('===3====');
      console.log('invite123:=>');
      setChallengeType('invite');
    } else if (oppSetting === undefined && mySetting === undefined) {
      console.log('===4====');
      console.log('invite123:=>');
      setChallengeType('invite');
    } else {
      setChallengeType('challenge');
    }
  }, [
    authContext?.entity?.obj?.registered_sports,
    playInObject.sport,
    playInObject.sport_type,
    userData.registered_sports,
  ]);

  const onMessageButtonPress = useCallback(() => {
    const navigateToMessage = (userId) => {
      navigation.push('MessageChat', {
        screen: 'MessageChat',
        params: {userId},
      });
    };
    const accountType = getQBAccountType(currentUserData?.entity_type);
    const entityId = ['user', 'player']?.includes(currentUserData?.entity_type)
      ? currentUserData?.user_id
      : currentUserData?.group_id;
    QBcreateUser(entityId, currentUserData, accountType).finally(() => {
      onClose();
      navigateToMessage(entityId);
    });
  }, [currentUserData, navigation, onClose]);

  const onChangeTab = useCallback((ChangeTab) => {
    setCurrentTab(ChangeTab.i);
  }, []);

  const onChallengePress = () => {
    console.log('--------', challengeType);
    if (challengeType === 'both') {
      actionSheetRef.current.show();
    } else if (challengeType === 'challenge') {
      actionSheetRef.current.show();
    } else if (challengeType === 'invite') {
      if (mySetting.availibility === Verbs.on) {
        onClose();
        console.log('currentUserDatacurrentUserData', playInObject);
        navigation.navigate('InviteChallengeScreen', {
          setting: mySetting,
          sportName: playInObject?.sport,
          sportType: playInObject?.sport_type,
          groupObj: currentUserData,
        });
      } else {
        onClose();
        navigation.navigate('ManageChallengeScreen', {
          groupObj: playInObject,
          sportName: playInObject?.sport,
          sportType: playInObject?.sport_type,
        });
      }
    }
  };

  return (
    <>
      <ActivityLoader visible={loading} />
      <Modal
        isVisible={visible}
        backdropColor="black"
        style={{
          margin: 0,
          justifyContent: 'flex-end',
          backgroundColor: colors.blackOpacityColor,
        }}
        hasBackdrop
        onBackdropPress={onClose}
        backdropOpacity={0}>
        <View style={styles.modalContainerViewStyle}>
          <SafeAreaView style={{flex: 1}}>
            {renderHeader}
            {/* Challenge Button */}

            {/* Profile View Section */}
            {useMemo(
              () => (
                <PlayInProfileViewSection
                  isPatch={!!playInObject?.lookingForTeamClub}
                  patchType={
                    playInObject?.sport === Verbs.tennisSport ? 'club' : 'team'
                  }
                  onSettingPress={() => {
                    actionSheetSettingRef.current.show();
                  }}
                  onMessageButtonPress={onMessageButtonPress}
                  isAdmin={isAdmin}
                  profileImage={
                    currentUserData?.thumbnail
                      ? {uri: currentUserData?.thumbnail}
                      : images.profilePlaceHolder
                  }
                  userName={currentUserData?.full_name ?? ''}
                  cityName={currentUserData?.city ?? ''}
                />
              ),
              [
                currentUserData?.city,
                currentUserData?.full_name,
                currentUserData?.thumbnail,
                isAdmin,
                onMessageButtonPress,
                playInObject?.lookingForTeamClub,
                playInObject?.sport,
              ],
            )}
            {renderChallengeButton()}
            {/* Tabs */}
            {useMemo(
              () => (
                <TCScrollableTabs locked={false} onChangeTab={onChangeTab}>
                  {TAB_ITEMS?.map(renderTabs)}
                </TCScrollableTabs>
              ),
              [renderTabs],
            )}
          </SafeAreaView>
        </View>
      </Modal>

      <ActionSheet
        ref={actionSheetRef}
        options={[
          'Continue to Challenge',
          'Invite to Challenge',
          strings.cancel,
        ]}
        cancelButtonIndex={2}
        // destructiveButtonIndex={3}
        onPress={(index) => {
          if (index === 0) {
            setTimeout(() => {
              setloading(true);
            }, 10);
            // navigation.navigate('ChallengeScreen', {
            //   sportName: playInObject?.sport,
            //   groupObj: currentUserData,
            // });

            Utils.getSetting(
              currentUserData?.user_id,
              'user',
              playInObject?.sport,
              authContext,
              playInObject?.sport_type,
            )
              .then((obj) => {
                setloading(false);
                console.log('challenge setting:::::=>', obj);

                if (obj?.availibility === Verbs.on) {
                  if (
                    (obj?.game_duration || obj?.score_rules) &&
                    obj?.availibility &&
                    obj?.special_rules !== undefined &&
                    obj?.general_rules !== undefined &&
                    obj?.responsible_for_referee &&
                    obj?.responsible_for_scorekeeper &&
                    obj?.game_fee &&
                    obj?.venue &&
                    obj?.refund_policy &&
                    obj?.home_away &&
                    obj?.game_type
                  ) {
                    onClose();
                    navigation.navigate('ChallengeScreen', {
                      setting: obj,
                      sportName: playInObject.sport,
                      sportType: playInObject.sport_type,
                      groupObj: currentUserData,
                    });
                  } else {
                    Alert.alert(
                      'Opponent player has no completed challenge setting.',
                    );
                  }
                } else {
                  Alert.alert(
                    'Opponent player or team not availble for challenge.',
                  );
                }
              })
              .catch((e) => {
                setloading(false);

                setTimeout(() => {
                  Alert.alert(strings.alertmessagetitle, e.message);
                }, 10);
              });
          }
          if (index === 1) {
            setloading(true);

            Utils.getSetting(
              authContext?.entity.uid,
              'user',
              playInObject?.sport,
              authContext,
              playInObject?.sport_type,
            )
              .then((obj) => {
                setloading(false);
                console.log('challenge setting:::::=>', obj);
                if (obj?.availibility === Verbs.on) {
                  if (
                    (obj?.game_duration || obj?.score_rules) &&
                    obj?.availibility &&
                    obj?.special_rules !== undefined &&
                    obj?.general_rules !== undefined &&
                    obj?.responsible_for_referee &&
                    obj?.responsible_for_scorekeeper &&
                    obj?.game_fee &&
                    obj?.venue &&
                    obj?.refund_policy &&
                    obj?.home_away &&
                    obj?.game_type
                  ) {
                    onClose();
                    console.log('currentUserData->', playInObject);
                    navigation.navigate('InviteChallengeScreen', {
                      setting: obj,
                      sportName: playInObject.sport,
                      sportType: playInObject.sport_type,
                      groupObj: currentUserData,
                    });
                  } else {
                    setTimeout(() => {
                      Alert.alert(
                        strings.completeSettingBeforeInvite,
                        '',
                        [
                          {
                            text: strings.cancel,
                            onPress: () => console.log('Cancel Pressed!'),
                          },
                          {
                            text: strings.okTitleText,
                            onPress: () => {
                              onClose();

                              navigation.navigate('ManageChallengeScreen', {
                                groupObj: playInObject,
                                sportName: playInObject.sport,
                                sportType: playInObject?.sport_type,
                              });
                            },
                          },
                        ],
                        {cancelable: false},
                      );
                    }, 1000);
                  }
                } else {
                  Alert.alert('Your availability for challenge is off.');
                }
              })
              .catch((e) => {
                setloading(false);

                setTimeout(() => {
                  Alert.alert(strings.alertmessagetitle, e.message);
                }, 10);
              });
          }
        }}
      />
      <ActionSheet
        ref={actionSheetSettingRef}
        options={[
          'Looking for club',
          'Deactivate This Activity',
          strings.cancel,
        ]}
        cancelButtonIndex={2}
        // destructiveButtonIndex={2}
        onPress={(index) => {
          if (index === 0) {
            onClose();
            navigation.navigate('LookingForSettingScreen', {
              sport: playInObject,
            });
          }
          if (index === 1) {
            onClose();
            navigation.navigate('DeactivateSportScreen', {
              sportObj: playInObject,
              type: 'player',
            });
          }
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalContainerViewStyle: {
    height: hp('94%'),
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  challengeLinearContainer: {
    height: 25,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    shadowColor: '#FF3B00',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 10,
  },
  headerMainContainerStyle: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 10,
  },
  cancelImageStyle: {
    height: 17,
    width: 17,
  },
  soccerImageStyle: {
    height: 23,
    width: 23,
    marginRight: 10,
  },
  headerCenterViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  playInTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  challengeButtonContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    height: 25,
    width: '92%',
    margin: 15,
  },
  challengeButtonTitle: {
    color: colors.whiteColor,
    fontSize: 14,
    fontFamily: fonts.RBold,
  },
});

export default memo(PlayInModule);
