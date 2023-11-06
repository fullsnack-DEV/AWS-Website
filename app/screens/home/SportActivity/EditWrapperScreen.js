// @flow
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Alert, Dimensions, Platform, StatusBar} from 'react-native';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {strings} from '../../../../Localization/translation';
import {patchPlayer} from '../../../api/Users';
import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import {setAuthContextData} from '../../../utils';
import ScreenHeader from '../../../components/ScreenHeader';
import EditBasicInfoScreen from './contentScreens/EditBasicInfoScreen';
import EditBioScreen from './contentScreens/EditBioScreen';
import EditHomeFacilityScreen from './contentScreens/EditHomeFacilityScreen';
import EditNTRPScreen from './contentScreens/EditNTRPScreen';
import EditCertificateScreen from './contentScreens/EditCertificateScreen';
import {getEntitySportList} from '../../../utils/sportsActivityUtils';
import Verbs from '../../../Constants/Verbs';
import {DEFAULT_NTRP} from '../../../Constants/GeneralConstants';
import AvailableServiceAreas from './contentScreens/AvailableServiceAreas';
import ModalBackDrop from '../../../components/ModalBackDrop';
import colors from '../../../Constants/Colors';
import ActivityLoader from '../../../components/loader/ActivityLoader';

const layout = Dimensions.get('window');

const EditWrapperScreen = ({
  modalRef,
  closeModal = () => {},
  section,
  title,
  sportObj,
  sportIcon,
  entityType,
}) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedCertificates, setSelectedCertificates] = useState([]);
  const [updatedSportObj, setUpdatedSportObj] = useState({});
  const [isRightButtonDisabled, setIsRightButtonDisabled] = useState(false);
  // const {section, title, sportObj, sportIcon, entityType} = route.params;
  const authContext = useContext(AuthContext);

  useEffect(() => {
    setUserData(authContext.entity.obj);
  }, [authContext]);

  useEffect(() => {
    if (sportObj?.certificates?.length > 0) {
      setSelectedCertificates(sportObj.certificates);
    }
  }, [sportObj?.certificates]);

  useEffect(() => {
    if (sportObj) {
      setUpdatedSportObj(sportObj);
    }
  }, [sportObj]);

  const renderView = () => {
    switch (section) {
      case strings.bio:
        return (
          <EditBioScreen
            bio={updatedSportObj.descriptions}
            setData={(bio) => {
              const obj = {
                ...updatedSportObj,
                descriptions: bio,
              };
              setUpdatedSportObj(obj);
            }}
          />
        );

      case strings.basicInfoText:
        return (
          <EditBasicInfoScreen
            {...userData}
            setData={(data) => {
              setUserData({...userData, ...data});
            }}
          />
        );

      case strings.ntrpTitle:
        return (
          <EditNTRPScreen
            ntrp={updatedSportObj.ntrp ?? DEFAULT_NTRP}
            setData={(val) => {
              const obj = {
                ...updatedSportObj,
                ntrp: val,
              };
              setUpdatedSportObj(obj);
            }}
          />
        );

      case strings.clubstitle:
        return null;

      case strings.leagues:
        return null;

      case strings.homeFacility:
        return (
          <EditHomeFacilityScreen
            place={userData.homePlace}
            setData={(data) => {
              setUserData({...userData, ...data});
            }}
          />
        );

      case strings.matchVenues:
        return null;

      case strings.teamstitle:
        return null;

      case strings.certiTitle:
        return (
          <EditCertificateScreen
            list={selectedCertificates}
            setData={(list) => {
              setSelectedCertificates(list);
            }}
            setLoading={setIsRightButtonDisabled}
          />
        );

      case strings.servicableAreas:
        return (
          <AvailableServiceAreas
            areas={sportObj.setting?.available_area?.address_list}
            setData={(addresses) => {
              const obj = {
                ...updatedSportObj,
                setting: {
                  ...updatedSportObj.setting,
                  available_area: {
                    ...updatedSportObj.setting.available_area,
                    address_list: addresses,
                  },
                },
              };

              setUpdatedSportObj(obj);
            }}
          />
        );

      default:
        return null;
    }
  };

  const updateUser = (data = userData) => {
    setLoading(true);

    patchPlayer(data, authContext)
      .then(async (res) => {
        setLoading(false);
        await setAuthContextData(res.payload, authContext);
        // navigation.navigate('HomeStack', {
        //   screen: 'SportActivityHome',
        //   params: {
        //     sport: sportObj?.sport,
        //     sportType: sportObj?.sport_type,
        //     uid: userData.user_id,
        //     entityType,
        //   },
        // });
        closeModal();
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert(strings.alertmessagetitle, error.message);
      });
  };

  const checkValidation = () => {
    let isValid = true;
    if (selectedCertificates.length === 0) {
      return true;
    }
    selectedCertificates.forEach((item) => {
      if (item.title === '' && item.url === '') {
        isValid = isValid && true;
      } else if (item.url && !item.title) {
        isValid = false;
        Alert.alert(
          strings.warningCertificateTitleText,
          ''[{text: strings.okTitleText}],
        );
      } else if (item.title && !item.url) {
        isValid = false;
        Alert.alert(strings.warningCertificateImageText);
      }
    });
    return isValid;
  };

  const handleCertifcate = () => {
    const refereeData = userData.referee_data.map((item) => {
      if (sportObj?.sport === item.sport) {
        return {
          ...item,
          certificates: selectedCertificates,
        };
      }
      return item;
    });
    const updatedObj = {referee_data: refereeData};
    setUserData(updatedObj);

    if (checkValidation()) {
      setLoading(true);
      updateUser(updatedObj);
    }
  };

  const handleSave = () => {
    if (section === strings.certiTitle) {
      handleCertifcate();
    } else {
      const newList = getEntitySportList(userData, entityType).map((ele) => {
        if (ele.sport === sportObj?.sport) {
          return {...updatedSportObj};
        }
        return {...ele};
      });
      const data = {...userData};
      if (entityType === Verbs.entityTypePlayer) {
        data.registered_sports = newList;
      } else if (entityType === Verbs.entityTypeReferee) {
        data.referee_data = newList;
      } else if (entityType === Verbs.entityTypeScorekeeper) {
        data.scorekeeper_data = newList;
      }
      setUserData(data);
      updateUser(data);
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
            sportIcon={sportIcon}
            title={title}
            leftIcon={images.backArrow}
            leftIconPress={() => {
              setSelectedCertificates(sportObj?.certificates ?? []);
              closeModal();
            }}
            isRightIconText
            rightButtonText={strings.save}
            onRightButtonPress={handleSave}
            isRightButtonDisabled={isRightButtonDisabled}
          />
        )}>
        {Platform.OS === 'android' && (
          <StatusBar
            backgroundColor={colors.modalBackgroundColor}
            barStyle="light-content"
          />
        )}
        <ActivityLoader visible={loading} />
        {renderView()}
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default EditWrapperScreen;
