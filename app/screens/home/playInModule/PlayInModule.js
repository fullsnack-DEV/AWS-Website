import {
  Alert,
  SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import Modal from 'react-native-modal';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React, {
  useContext, memo, useEffect, useState, useMemo, useCallback, useRef,
} from 'react';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actionsheet';
import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import Header from '../../../components/Home/Header';
import PlayInProfileViewSection from './PlayInProfileViewSection';
import fonts from '../../../Constants/Fonts';
import PlayInInfoView from './info/PlayInInfoView';
import PlayInScoreboardView from './scoreboard/PlayInScoreboardView';
import PlayInStatsView from './stats/PlayInStatsView';
import { patchPlayer } from '../../../api/Users';
import strings from '../../../Constants/String';
import AuthContext from '../../../auth/context';

import * as Utility from '../../../utils';
import { getQBAccountType, QBcreateUser } from '../../../utils/QuickBlox';
import TCGradientDivider from '../../../components/TCThinGradientDivider';
import PlayInReviewsView from './stats/PlayInReviewsView';
import TCScrollableTabs from '../../../components/TCScrollableTabs';

let TAB_ITEMS = []
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
  const [sportName, setSportName] = useState('');
  const [singlePlayerGame, setSinglePlayerGame] = useState(true);
  const [mainTitle, setMainTitle] = useState();
  const authContext = useContext(AuthContext);
  const [currentUserData, setCurrentUserData] = useState();
  const [currentTab, setCurrentTab] = useState(0);

  const onClose = useCallback(() => {
    setTimeout(() => {
      setCurrentTab(0);
    }, 1000);
    setTimeout(() => onModalClose(), 0);
  }, [onModalClose])

  useEffect(() => {
    if (userData) setCurrentUserData(userData);
  }, [userData]);

  useEffect(() => {
    if (playInObject?.sport_name) setSportName(playInObject?.sport_name);
    if (playInObject?.sport_type !== 'single') {
      TAB_ITEMS = ['Info', 'Scoreboard', 'Stats'];
      setSinglePlayerGame(false);
    } else TAB_ITEMS = ['Info', 'Scoreboard', 'Stats', 'Reviews']
  }, [playInObject])

  useEffect(() => {
    if (sportName) {
      if (sportName.toLowerCase() === 'tennis') {
        setMainTitle({ title: `Player in ${sportName}`, titleIcon: images.tennisSingleHeaderIcon })
      } else {
        setMainTitle({ title: `Play in ${sportName}`, titleIcon: images.soccerImage })
      }
    }
  }, [sportName, singlePlayerGame])
  const onSave = useCallback((params) => new Promise((resolve, reject) => {
    patchPlayer(params, authContext).then(async (res) => {
      const entity = authContext.entity
      entity.auth.user = res.payload;
      entity.obj = res.payload;
      authContext.setEntity({ ...entity })
      await Utility.setStorage('authContextUser', res.payload);
      authContext.setUser(res.payload)
      setCurrentUserData({ ...res?.payload });
      resolve(res);
    }).catch((error) => {
      reject(error);
      Alert.alert(strings.alertmessagetitle, error.message)
    })
  }), [authContext])

  const renderHeader = useMemo(() => (
    <>
      <Header
            safeAreaStyle={{ marginTop: 10 }}
            mainContainerStyle={styles.headerMainContainerStyle}
            centerComponent={
              <View style={styles.headerCenterViewStyle}>
                <FastImage source={mainTitle?.titleIcon} style={styles.soccerImageStyle} resizeMode={'contain'} />
                <Text style={styles.playInTextStyle}>{mainTitle?.title ?? ''}</Text>
              </View>
            }
            rightComponent={
              <TouchableOpacity onPress={onClose}>
                <FastImage source={images.cancelWhite} tintColor={colors.lightBlackColor} style={styles.cancelImageStyle} resizeMode={'contain'} />
              </TouchableOpacity>
            }
        />
      <TCGradientDivider width={'100%'} height={3}/>
    </>
  ), [mainTitle?.title, mainTitle?.titleIcon, onClose])

  const renderPlayInInfoTab = useMemo(() => (
    <ScrollView style={{ flex: 1 }}>
      <PlayInInfoView
          openPlayInModal={openPlayInModal}
          onSave={onSave}
          sportName={playInObject?.sport_name}
          closePlayInModal={onClose}
          currentUserData={currentUserData}
          isAdmin={isAdmin}
          navigation={navigation}
      />
    </ScrollView>
  ), [currentUserData, isAdmin, navigation, onClose, onSave, openPlayInModal, playInObject?.sport_name]);

  const renderScoreboardTab = useMemo(() => (
    <PlayInScoreboardView
          openPlayInModal={openPlayInModal}
          closePlayInModal={onClose}
          navigation={navigation}
          sportName={playInObject?.sport_name}
      />
  ), [navigation, onClose, openPlayInModal, playInObject?.sport_name])

  const renderStatsViewTab = useMemo(() => (
    <ScrollView style={{ flex: 1 }}>
      <PlayInStatsView
          currentUserData={currentUserData}
          playInObject={playInObject}
          sportName={playInObject?.sport_name}
      />
    </ScrollView>
  ), [currentUserData, playInObject])

  const renderReviewTab = useMemo(() => (
    <PlayInReviewsView
          currentUserData={currentUserData}
          playInObject={playInObject}
          sportName={playInObject?.sport_name}
      />
  ), [currentUserData, playInObject])

  const renderTabs = useCallback((item, index) => (
    <View tabLabel={item} style={{ flex: 1 }}>
      {index === 0 ? renderPlayInInfoTab : null}
      {index === 1 ? renderScoreboardTab : null}
      {index === 2 ? renderStatsViewTab : null}
      {index === 3 ? renderReviewTab : null}
    </View>
    ), [renderPlayInInfoTab, renderReviewTab, renderScoreboardTab, renderStatsViewTab])

  const renderChallengeButton = useMemo(() => currentTab === 0 && authContext?.entity?.uid !== currentUserData?.user_id && ['player', 'user']?.includes(authContext?.entity?.role) && (
    <TouchableOpacity
              onPress={() => {
                console.log('auth123:=>', authContext);
                if (authContext?.entity?.obj?.registered_sports?.some((item) => item?.sport_name?.toLowerCase() === sportName.toLowerCase())) {
                  actionSheetRef.current.show();
                } else {
                  Alert.alert('Towns Cup', 'Both Player have a different sports')
                }
              }}
              style={styles.challengeButtonContainer}>
      <LinearGradient
                colors={[colors.themeColor, '#FF3B00']}
                style={styles.challengeLinearContainer}>
        <View style={{
                width: '100%', paddingHorizontal: 25, flexDirection: 'row', justifyContent: 'space-between',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.challengeTextStyle}>{`$${playInObject?.fee ?? 0}`}</Text>
            <Text style={{ ...styles.challengeTextStyle, fontSize: 13, fontFamily: fonts.RRegular }}> (per hours)</Text>
          </View>
          <Text style={styles.challengeTextStyle}>CHALLENGE</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
      ), [authContext?.entity?.role, authContext?.entity?.uid, authContext?.user?.registered_sports, currentTab, currentUserData, navigation, onClose, playInObject?.fee, sportName])

  const onMessageButtonPress = useCallback(() => {
    const navigateToMessage = (userId) => {
      navigation.push('MessageChat', {
        screen: 'MessageChatRoom',
        params: { userId },
      })
    }
    const accountType = getQBAccountType(currentUserData?.entity_type);
    const entityId = ['user', 'player']?.includes(currentUserData?.entity_type) ? currentUserData?.user_id : currentUserData?.group_id
    QBcreateUser(entityId, currentUserData, accountType)
        .finally(() => {
          onClose();
          navigateToMessage(entityId);
        })
  }, [currentUserData, navigation, onClose])

  const onChangeTab = useCallback((ChangeTab) => {
    setCurrentTab(ChangeTab.i)
  }, [])
  return (
    <>
      <Modal
            isVisible={visible}
            backdropColor="black"
            style={{
              margin: 0, justifyContent: 'flex-end', backgroundColor: colors.blackOpacityColor,
            }}
            hasBackdrop
            onBackdropPress={onClose}
            backdropOpacity={0}
        >
        <View style={styles.modalContainerViewStyle}>
          <SafeAreaView style={{ flex: 1 }}>
            {renderHeader}

            {/* Challenge Button */}
            {renderChallengeButton}

            {/* Profile View Section */}
            {useMemo(() => <PlayInProfileViewSection
              onSettingPress={() => {
                onClose()
                navigation.navigate('ManageChallengeScreen')
              }
            }
              onMessageButtonPress={onMessageButtonPress}
              isAdmin={isAdmin}
              profileImage={currentUserData?.thumbnail ? { uri: currentUserData?.thumbnail } : images.profilePlaceHolder}
              userName={currentUserData?.full_name ?? ''}
              cityName={currentUserData?.city ?? ''}
          />, [currentUserData?.city, currentUserData?.full_name, currentUserData?.thumbnail, isAdmin, onMessageButtonPress])}

            {/* Tabs */}
            {useMemo(() => (
              <TCScrollableTabs
                locked={false}
                onChangeTab={onChangeTab}
              >
                {TAB_ITEMS?.map(renderTabs)}
              </TCScrollableTabs>
          ), [renderTabs])}

          </SafeAreaView>
        </View>
      </Modal>

      <ActionSheet
          ref={actionSheetRef}
          options={['Continue to Challenge', 'Invite to Challenge', 'Cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          onPress={(index) => {
            if (index === 0) {
              onClose()
              navigation.navigate('ChallengeScreen', {
                sportName: playInObject?.sport_name,
                groupObj: currentUserData,
              });
            }
            if (index === 1) {
              onClose()
              navigation.navigate('InviteChallengeScreen', {
                sportName: playInObject?.sport_name,
                groupObj: currentUserData,
              });
            }
          }}
        />

    </>
  )
}

const styles = StyleSheet.create({
  modalContainerViewStyle: {
    height: hp('94%'),
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  challengeLinearContainer: {
    flex: 1,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#FF3B00',
    shadowOffset: { width: 0, height: 2 },
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
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    right: 0,
    left: 0,
    bottom: 0,
    marginBottom: 15,
    zIndex: 10,
  },
  challengeTextStyle: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
});

export default memo(PlayInModule);
