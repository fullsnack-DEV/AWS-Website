// @flow
import React, {useContext, useMemo} from 'react';
import {View, StyleSheet, Dimensions, Platform, StatusBar} from 'react-native';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {strings} from '../../../../Localization/translation';
import InfoContentScreen from './contentScreens/InfoContentScreen';
import Verbs from '../../../Constants/Verbs';
import ScoreboardContentScreen from './contentScreens/ScoreboardContentScreen';
import AuthContext from '../../../auth/context';
import ReviewsContentScreen from './contentScreens/ReviewsContentScreen';
import {getGameHomeScreen} from '../../../utils/gameUtils';
import StatsContentScreen from './contentScreens/StatsContentScreen';
import AvailabilityScreen from './contentScreens/AvailabilityContentScreen';
import colors from '../../../Constants/Colors';
import ScreenHeader from '../../../components/ScreenHeader';
import images from '../../../Constants/ImagePath';
import ModalBackDrop from '../../../components/ModalBackDrop';

const layout = Dimensions.get('window');

const SectionWrapperModal = ({
  modalRef,
  closeModal = () => {},
  handleEditNavigation = () => {},
  handlePrivacySettings = () => {},
  selectedOption = strings.infoTitle,
  userData = {},
  isAdmin = false,
  sportObj = {},
  entityType = Verbs.entityTypePlayer,
  navigation,
  sport,
  sportType,
  sportIcon,
}) => {
  const authContext = useContext(AuthContext);

  const renderContent = () => {
    if (!selectedOption) return null;
    switch (selectedOption) {
      case strings.infoTitle:
        return (
          <InfoContentScreen
            user={userData}
            sportObj={sportObj}
            isAdmin={isAdmin}
            handleEditOption={handleEditNavigation}
            openPrivacySettings={handlePrivacySettings}
            entityType={entityType}
            onPressCertificate={(certificate, count) => {
              navigation.navigate('LoneStack', {
                screen: 'CertificateDisplayScreen',
                params: {
                  user: userData,
                  certificate,
                  count,
                  sport,
                  entityType,
                },
              });
            }}
          />
        );

      case strings.scoreboard:
      case strings.matchesTitleText:
        return (
          <ScoreboardContentScreen
            userData={userData}
            sport={sportObj?.sport}
            entityType={entityType}
            onCardPress={(item = {}) => {
              navigation.navigate('ScheduleStack', {
                screen: 'EventScreen',
                params: {
                  data: item,
                  gameData: item,
                },
              });
            }}
          />
        );

      case strings.reviews:
        return (
          <ReviewsContentScreen
            userId={userData.user_id}
            sportObj={sportObj}
            entityType={entityType}
            onPressMore={(review, dateTime) => {
              navigation.navigate('ReviewDetailsScreen', {
                review,
                dateTime,
                sport,
                sportType,
              });
            }}
            isAdmin={isAdmin}
            onReply={(activityId) => {
              navigation.navigate('ReplyScreen', {
                sport,
                sportType,
                activityId,
              });
            }}
            onPressMedia={(list, user, date) => {
              navigation.navigate('LoneStack', {
                screen: 'MediaScreen',
                params: {
                  mediaList: list,
                  user,
                  sport,
                  sportType,
                  userId: user.id,
                  createDate: date,
                },
              });
            }}
            onPressGame={(review) => {
              if (review.game.id && review.game.data.sport) {
                const gameHome = getGameHomeScreen(
                  review.game.data.sport.replace(' ', '_'),
                );

                navigation.navigate(gameHome, {
                  gameId: review.game.id,
                });
              }
            }}
          />
        );

      case strings.stats:
        return (
          <StatsContentScreen
            sportType={sportObj?.sport_type}
            sport={sportObj?.sport}
            authContext={authContext}
            userId={userData?.user_id}
          />
        );

      case strings.availability:
        return <AvailabilityScreen userData={userData} />;

      default:
        return null;
    }
  };

  const snapPoints = useMemo(
    () => [layout.height - 40, layout.height - 40],
    [],
  );

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        onDismiss={closeModal}
        ref={modalRef}
        backgroundStyle={{
          borderRadius: 10,
          paddingTop: 0,
        }}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDismissOnClose
        backdropComponent={ModalBackDrop}
        handleComponent={() => (
          <ScreenHeader
            leftIcon={images.backArrow}
            title={selectedOption}
            showSportIcon
            sportIcon={sportIcon}
            containerStyle={{
              paddingTop: 3,
              paddingBottom: 5,
              borderBottomWidth: 3,
              borderBottomColor: colors.tabFontColor,
            }}
            leftIconPress={() => closeModal()}
          />
        )}>
        {Platform.OS === 'android' && (
          <StatusBar
            backgroundColor={colors.modalBackgroundColor}
            barStyle="light-content"
          />
        )}
        <View style={styles.parent}>{renderContent()}</View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
});
export default SectionWrapperModal;
