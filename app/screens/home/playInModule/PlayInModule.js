import {
  Alert,
  SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import Modal from 'react-native-modal';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React, { useContext, useEffect, useState } from 'react';
import FastImage from 'react-native-fast-image';
import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import Header from '../../../components/Home/Header';
import PlayInProfileViewSection from './PlayInProfileViewSection';
import fonts from '../../../Constants/Fonts';
import TCThinDivider from '../../../components/TCThinDivider';
import PlayInInfoView from './info/PlayInInfoView';
import ScrollableTabs from '../../../components/ScrollableTabs';
import PlayInScoreboardView from './scoreboard/PlayInScoreboardView';
import PlayInStatsView from './stats/PlayInStatsView';
import { patchPlayer } from '../../../api/Users';
import strings from '../../../Constants/String';
import AuthContext from '../../../auth/context';
import * as Utility from '../../../utils';

const TAB_ITEMS = ['Info', 'Scoreboard', 'Stats']
const PlayInModule = ({
  visible = false,
  onModalClose = () => {},
  userData,
  playInObject,
  isAdmin,
  navigation,
}) => {
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
                            <FastImage source={images.soccerImage} style={styles.soccerImageStyle} resizeMode={'contain'} />
                            <Text style={styles.playInTextStyle}>{`Plays in ${playInObject?.sport_name || ''}`}</Text>
                          </View>
                        }
                        rightComponent={
                          <TouchableOpacity onPress={onClose}>
                            <FastImage source={images.cancelWhite} tintColor={colors.lightBlackColor} style={styles.cancelImageStyle} resizeMode={'contain'} />
                          </TouchableOpacity>
                        }
                    />
          <TCThinDivider backgroundColor={colors.refereeHomeDividerColor} width={'100%'} height={2}/>

          {/* Profile View Section */}
          <PlayInProfileViewSection
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
  headerMainContainerStyle: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 15,
  },
  cancelImageStyle: {
    height: 17,
    width: 17,
  },
  soccerImageStyle: {
    height: 20,
    width: 20,
    marginHorizontal: 10,
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
});

export default PlayInModule;
