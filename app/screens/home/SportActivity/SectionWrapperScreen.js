// @flow
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, Text} from 'react-native';
import {strings} from '../../../../Localization/translation';
import InfoContentScreen from './contentScreens/InfoContentScreen';
import ScoreboardContentScreen from './contentScreens/ScoreboardContentScreen';
import AuthContext from '../../../auth/context';
import ReviewsContentScreen from './contentScreens/ReviewsContentScreen';
import {getGameHomeScreen} from '../../../utils/gameUtils';
import StatsContentScreen from './contentScreens/StatsContentScreen';
import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import BottomSheet from '../../../components/modals/BottomSheet';
import ScreenHeader from '../../../components/ScreenHeader';
import usePrivacySettings from '../../../hooks/usePrivacySettings';
import EditWrapperScreen from './EditWrapperScreen';
import SportActivityPrivacyModal from './SportActivityPrivacyModal';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import fonts from '../../../Constants/Fonts';
import {
  PersonalUserPrivacyEnum,
  PrivacyKeyEnum,
} from '../../../Constants/PrivacyOptionsConstant';
import {ModalTypes} from '../../../Constants/GeneralConstants';
import ChallengeAvailability from '../../account/schedule/ChallengeAvailability';
import AvailibilityScheduleScreen from '../../account/schedule/AvailibityScheduleScreen';
import {getEventsSlots} from '../../../utils';
import Verbs from '../../../Constants/Verbs';

const userPrivacyOptions = [
  PrivacyKeyEnum.Gender,
  PrivacyKeyEnum.YearOfBirth,
  PrivacyKeyEnum.Height,
  PrivacyKeyEnum.Weight,
  PrivacyKeyEnum.Langueages,
];

const SectionWrapperScreen = ({navigation, route}) => {
  const authContext = useContext(AuthContext);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [infoContentPrivacyStatus, setInfoContentPrivacyStatus] = useState({});
  const [userPrivacyStatus, setUserPrivacyStatus] = useState({});

  const {
    selectedOption,
    userObj,
    isAdmin,
    sportObject,
    sport,
    sportType,
    sportIcon,
    entityType,
  } = route.params;

  const [sportObj, setSportObj] = useState({...sportObject});
  const [userData, setUserData] = useState({...userObj});
  const {getPrivacyStatusForSportActivity, getPrivacyStatus} =
    usePrivacySettings();
  const [showWrapperModal, setShowWrapperModal] = useState(false);
  const [showPrivacySettingsModal, setShowPrivacySettingsModal] =
    useState(false);
  const [settingModalObj, setSettingModalObj] = useState({
    option: '',
    title: '',
  });
  const [showInfo, setShowInfo] = useState(false);
  const [snapPoints, setSnapPoints] = useState([]);
  const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
  const [isFromSlots, setIsFromSlots] = useState(false);
  const [visibleAvailabilityModal, setVisibleAvailabilityModal] =
    useState(false);
  const [editableSlots, setEditableSlots] = useState([]);
  const [slotLevel, setSlotLevel] = useState(false);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (sportObj?.sport) {
      const privacySetting = getPrivacyStatusForSportActivity(
        sportObj,
        userData,
      );
      setInfoContentPrivacyStatus(privacySetting);
    }
  }, [sportObj, userData]);

  useEffect(() => {
    if (userData?.user_id) {
      const obj = {};
      userPrivacyOptions.forEach((key) => {
        let privacyVal = 1;
        if (userData[key] >= 0) {
          privacyVal = userData[key];
        } else {
          privacyVal = key === PrivacyKeyEnum.Langueages ? 1 : 0;
        }
        const setting = getPrivacyStatus(
          PersonalUserPrivacyEnum[privacyVal],
          userData,
        );
        obj[key] = setting;
      });
      setUserPrivacyStatus(obj);
    }
  }, [userData, getPrivacyStatus]);

  const handleEditNavigation = (sectionName, title) => {
    if (sectionName === strings.availableMatchVenues) {
      // navigation.navigate('AccountStack', {
      //   screen: 'ManageChallengeScreen',
      //   params: {
      //     groupObj: userData,
      //     sportName: sportObj?.sport,
      //     sportType: sportObj?.sport_type,
      //   },
      // });
    } else {
      setSettingModalObj({option: sectionName, title});
      setShowWrapperModal(true);
    }
  };

  const handlePrivacySettings = (sectionName, privacyKey) => {
    setSettingModalObj({option: sectionName, privacyKey});
    setShowPrivacySettingsModal(true);
  };

  const getSlotData = useCallback(() => {
    const entityId = userData.user_id ?? userData.group_id;
    getEventsSlots([entityId]).then((response) => {
      setSlots(response);
    });
  }, [userData.user_id, userData.group_id]);

  useEffect(() => {
    getSlotData();
  }, [getSlotData]);

  const generateTimestampRanges = (startTimestamp, endTimestamp) => {
    const startDate = startTimestamp * Verbs.THOUSAND_SECOND;
    const endDate = endTimestamp * Verbs.THOUSAND_SECOND;
    const ranges = [];
    let startOfCurrentRange = startDate;

    while (startOfCurrentRange < endDate) {
      const startDateFullDate = new Date(startOfCurrentRange);
      let endOfCurrentDay = new Date(
        startDateFullDate.getFullYear(),
        startDateFullDate.getMonth(),
        startDateFullDate.getDate() + 1,
      ).getTime();

      if (endOfCurrentDay > endDate) {
        endOfCurrentDay = endDate;
      }

      ranges.push({start: startOfCurrentRange, end: endOfCurrentDay});

      startOfCurrentRange = endOfCurrentDay;
    }

    return ranges;
  };

  const addToSlotData = (data) => {
    const tempData = [...slots];
    data.forEach((item1) => {
      slots.forEach((item2, key) => {
        if (
          item1.start_datetime <= item2.end_datetime &&
          item1.end_datetime > item2.end_datetime
        ) {
          tempData[key].end_datetime = item1.end_datetime;
        } else if (
          item1.end_datetime >= item2.start_datetime &&
          item1.start_datetime < item2.end_datetime
        ) {
          tempData[key].start_datetime = item1.start_datetime;
        }
      });
      tempData.push(item1);
    });
    // tempData = newBlockedSlots(tempData);
    const newPlans = tempData.flatMap((plan) => {
      const {start_datetime, end_datetime} = plan;
      const timestampRange = generateTimestampRanges(
        start_datetime,
        end_datetime,
      );
      if (timestampRange.length > 1) {
        return timestampRange.map(({start, end}) => ({
          ...plan,
          start_datetime: start / Verbs.THOUSAND_SECOND,
          end_datetime: end / Verbs.THOUSAND_SECOND,
          actual_enddatetime: end / Verbs.THOUSAND_SECOND,
        }));
      }
      return plan;
    });
    setSlots(newPlans);
  };

  const deleteFromSlotData = async (delArr) => {
    const tempSlot = [...slots];
    delArr.forEach((cal_id) => {
      const index = tempSlot.findIndex((item) => item.cal_id === cal_id);
      slots.splice(index, 1);
    });
    setSlots([...slots]);
    return slots;
  };

  const deleteOrCreateSlotData = async (payload) => {
    let tempSlot = [...slots];

    tempSlot = tempSlot.filter(
      (item) => !payload.deleteSlotsIds.includes(item.cal_id),
    );

    const slotMap = new Map(slots.map((item) => [item.cal_id, item]));
    payload.deleteSlotsIds.forEach((cal_id) => slotMap.delete(cal_id));
    tempSlot = Array.from(slotMap.values());

    tempSlot = tempSlot.concat(payload.newSlots);

    setSlots(tempSlot);
  };

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
            setShowInfo={() => setShowInfo(true)}
            userPrivacyStatus={userPrivacyStatus}
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
            viewPrivacyStatus={
              infoContentPrivacyStatus[PrivacyKeyEnum.Scoreboard]
            }
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
        return (
          <AvailibilityScheduleScreen
            allSlots={slots}
            isAdmin={userData.user_id === authContext.entity.uid}
            setIsFromSlots={setIsFromSlots}
            setSlotLevel={setSlotLevel}
            onDayPress={() => getSlotData()}
            setVisibleAvailabilityModal={(val) => {
              setVisibleAvailabilityModal(val);
            }}
            setEditableSlots={setEditableSlots}
          />
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={selectedOption}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        rightIcon1={
          selectedOption === strings.availability ? images.chat3Dot : null
        }
        rightIcon1Press={() => setShowBottomSheet(true)}
        showSportIcon
        sportIcon={sportIcon}
        containerStyle={styles.headerContainer}
      />
      <View style={styles.parent}>{renderContent()}</View>

      <BottomSheet
        optionList={[strings.editAvailability]}
        isVisible={showBottomSheet}
        closeModal={() => setShowBottomSheet(false)}
        onSelect={(option) => {
          if (option === strings.editAvailability) {
            setShowBottomSheet(false);
          }
        }}
      />

      <EditWrapperScreen
        isVisible={showWrapperModal}
        closeModal={() => {
          setShowWrapperModal(false);
        }}
        entityType={entityType}
        section={settingModalObj.option}
        title={settingModalObj.title}
        sportIcon={sportIcon}
        sportObj={sportObj}
        updateSportObj={(obj) => {
          setSportObj(obj);
        }}
        updateUserObj={(obj) => setUserData({...obj})}
        openBasicInfoModal={() => setShowBasicInfoModal(true)}
      />

      <SportActivityPrivacyModal
        isVisible={showPrivacySettingsModal}
        closeModal={() => {
          setShowPrivacySettingsModal(false);
        }}
        sectionName={settingModalObj.option}
        sportIcon={sportIcon}
        sportObj={sportObj}
        onSave={(obj) => {
          setSportObj({...obj});
          const privacySetting = getPrivacyStatusForSportActivity(
            obj,
            userData,
          );
          setInfoContentPrivacyStatus(privacySetting);
          setShowPrivacySettingsModal(false);
        }}
        entityType={entityType}
      />

      <CustomModalWrapper
        isVisible={showInfo}
        closeModal={() => setShowInfo(false)}
        externalSnapPoints={snapPoints}>
        <View
          onLayout={(event) => {
            const contentHeight = event.nativeEvent.layout.height + 80;
            setSnapPoints([contentHeight, contentHeight]);
          }}>
          <Text style={styles.label}>{strings.matchVenueInfo}</Text>
        </View>
      </CustomModalWrapper>

      <CustomModalWrapper
        isVisible={showBasicInfoModal}
        closeModal={() => setShowBasicInfoModal(false)}
        modalType={ModalTypes.style2}>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 24,
            color: colors.lightBlackColor,
            fontFamily: fonts.RRegular,
          }}>
          {strings.basicInfoModalText}
        </Text>
      </CustomModalWrapper>

      <ChallengeAvailability
        isVisible={visibleAvailabilityModal}
        closeModal={() => {
          setVisibleAvailabilityModal(false);
          setIsFromSlots(false);
        }}
        slots={editableSlots}
        addToSlotData={addToSlotData}
        showAddMore={true}
        slotLevel={slotLevel}
        deleteFromSlotData={deleteFromSlotData}
        deleteOrCreateSlotData={deleteOrCreateSlotData}
        isFromSlot={isFromSlots}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 3,
    paddingBottom: 5,
    borderBottomWidth: 3,
    borderBottomColor: colors.tabFontColor,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
});
export default SectionWrapperScreen;
