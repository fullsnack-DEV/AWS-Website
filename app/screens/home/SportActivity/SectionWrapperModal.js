// @flow
import React, {useContext, useState} from 'react';
import {View, StyleSheet} from 'react-native';
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
import images from '../../../Constants/ImagePath';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {ModalTypes} from '../../../Constants/GeneralConstants';
import BottomSheet from '../../../components/modals/BottomSheet';

const SectionWrapperModal = ({
  isVisible,
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
  infoContentPrivacyStatus = {},
}) => {
  const authContext = useContext(AuthContext);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

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
            privacyStatus={infoContentPrivacyStatus}
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

  return (
    <>
      <CustomModalWrapper
        isVisible={isVisible}
        closeModal={closeModal}
        modalType={ModalTypes.style1}
        backIcon={images.backArrow}
        title={selectedOption}
        showSportIcon
        sportIcon={sportIcon}
        headerBottomBorderColor={colors.tabFontColor}
        containerStyle={{padding: 0, flex: 1}}
        headerStyle={{
          paddingTop: 3,
          paddingBottom: 5,
          borderBottomWidth: 3,
          borderBottomColor: colors.tabFontColor,
        }}
        isRightIconText={false}
        rightIcon1={
          selectedOption === strings.availability ? images.chat3Dot : null
        }
        rightIcon1Press={() => setShowBottomSheet(true)}>
        <View style={styles.parent}>{renderContent()}</View>
      </CustomModalWrapper>
      <BottomSheet
        optionList={[strings.editAvailability]}
        isVisible={showBottomSheet}
        closeModal={() => setShowBottomSheet(false)}
        onSelect={(option) => {
          if (option === strings.editAvailability) {
            setShowBottomSheet(false);
            // closeModal();
          }
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
});
export default SectionWrapperModal;
