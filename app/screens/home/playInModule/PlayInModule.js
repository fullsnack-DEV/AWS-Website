import {
  Alert,
  SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import Modal from 'react-native-modal';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React, { useContext, useEffect, useState } from 'react';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import Header from '../../../components/Home/Header';
import PlayInProfileViewSection from './PlayInProfileViewSection';
import fonts from '../../../Constants/Fonts';
import PlayInInfoView from './info/PlayInInfoView';
import ScrollableTabs from '../../../components/ScrollableTabs';
import PlayInScoreboardView from './scoreboard/PlayInScoreboardView';
import PlayInStatsView from './stats/PlayInStatsView';
import { patchPlayer } from '../../../api/Users';
import strings from '../../../Constants/String';
import AuthContext from '../../../auth/context';
import * as Utility from '../../../utils';
import { getQBAccountType, QBcreateUser } from '../../../utils/QuickBlox';
import TCGradientDivider from '../../../components/TCThinGradientDivider';
import PlayInReviewsView from './stats/PlayInReviewsView';

let TAB_ITEMS = []
const PlayInModule = ({
  visible = false,
  onModalClose = () => {},
  userData,
  playInObject,
  isAdmin,
  navigation,
}) => {
  const [sportName, setSportName] = useState('');
  const [singlePlayerGame, setSinglePlayerGame] = useState(true);
  const [mainTitle, setMainTitle] = useState();
  const authContext = useContext(AuthContext);
  const [currentUserData, setCurrentUserData] = useState();
  const [currentTab, setCurrentTab] = useState(0);
  const onClose = () => {
    onModalClose();
    setCurrentTab(0);
  }
  useEffect(() => {
    if (userData) setCurrentUserData(userData);
  }, [userData]);

  useEffect(() => {
    console.log(playInObject);
    if (playInObject?.sport_name) setSportName(playInObject?.sport_name);
    console.log(playInObject?.sport_type);
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
  const onSave = (params) => new Promise((resolve, reject) => {
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
  })
  const renderTabs = () => {
    if (currentTab === 0) {
      return (
        <PlayInInfoView
            onSave={onSave}
            sportName={playInObject?.sport_name}
            closePlayInModal={onClose}
            currentUserData={currentUserData}
            isAdmin={isAdmin}
            navigation={navigation}
        />
      )
    } if (currentTab === 1) {
      return (
        <PlayInScoreboardView
            closePlayInModal={onClose}
            navigation={navigation}
            sportName={playInObject?.sport_name}
        />
      )
    } if (currentTab === 2) {
      return (
        <PlayInStatsView
            currentUserData={currentUserData}
            playInObject={playInObject}
            sportName={playInObject?.sport_name}
        />
      )
    }
    if (currentTab === 3) {
      return (
        <PlayInReviewsView
              currentUserData={currentUserData}
              playInObject={playInObject}
              sportName={playInObject?.sport_name}
          />
      )
    }
    return null;
  }
  return (
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

          {/* Challenge Button */}
          {currentTab === 0 && authContext?.entity?.uid !== currentUserData?.user_id && ['player', 'user']?.includes(authContext?.entity?.role) && (
            <TouchableOpacity
              onPress={() => {
                if (authContext?.user?.registered_sports?.some((item) => item?.sport_name?.toLowerCase() === sportName.toLowerCase())) {
                  onClose();
                  setTimeout(() => {
                    navigation.navigate('CreateChallengeForm1', { groupObj: { ...currentUserData, sport: sportName, game_fee: playInObject?.fee ?? 0 } })
                  }, 500)
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
          )}

          {/* Profile View Section */}
          <PlayInProfileViewSection
              onSettingPress={() => {}}
              onMessageButtonPress={() => {
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
              }}
            isAdmin={isAdmin}
            profileImage={currentUserData?.thumbnail ? { uri: currentUserData?.thumbnail } : images.profilePlaceHolder}
            userName={currentUserData?.full_name ?? ''}
            cityName={currentUserData?.city ?? ''}
          />

          {/* Tabs */}
          <ScrollableTabs
              tabs={TAB_ITEMS}
              currentTab={currentTab}
              onTabPress={(item) => setCurrentTab(item)}
          />
          <ScrollView>
            {renderTabs()}
          </ScrollView>

        </SafeAreaView>
      </View>
    </Modal>
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

export default PlayInModule;
