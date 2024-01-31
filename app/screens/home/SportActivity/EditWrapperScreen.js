// @flow
import React, {useContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {strings} from '../../../../Localization/translation';
import {patchPlayer} from '../../../api/Users';
import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import {setAuthContextData} from '../../../utils';
// import EditBasicInfoScreen from './contentScreens/EditBasicInfoScreen';
import EditBioScreen from './contentScreens/EditBioScreen';
import EditHomeFacilityScreen from './contentScreens/EditHomeFacilityScreen';
import EditNTRPScreen from './contentScreens/EditNTRPScreen';
import EditCertificateScreen from './contentScreens/EditCertificateScreen';
import {getEntitySportList} from '../../../utils/sportsActivityUtils';
import Verbs from '../../../Constants/Verbs';
import {DEFAULT_NTRP, ModalTypes} from '../../../Constants/GeneralConstants';
import AvailableServiceAreas from './contentScreens/AvailableServiceAreas';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import EditBasicInfoComponent from '../../../components/EditBasicInfoComponent';
import TCKeyboardView from '../../../components/TCKeyboardView';

const EditWrapperScreen = ({
  isVisible = false,
  closeModal = () => {},
  section,
  title,
  sportObj,
  sportIcon,
  entityType,
  updateSportObj = () => {},
  updateUserObj = () => {},
  openBasicInfoModal = () => {},
}) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedCertificates, setSelectedCertificates] = useState([]);
  const [updatedSportObj, setUpdatedSportObj] = useState({});
  const [isRightButtonDisabled, setIsRightButtonDisabled] = useState(false);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (isVisible && authContext.entity.uid) {
      setUserData(authContext.entity.obj);
    }
  }, [isVisible, authContext.entity.uid, authContext.entity.obj]);

  useEffect(() => {
    if (isVisible && sportObj?.certificates?.length > 0) {
      setSelectedCertificates(sportObj.certificates);
    }
  }, [isVisible, sportObj?.certificates]);

  useEffect(() => {
    if (isVisible && sportObj?.sport) {
      setUpdatedSportObj(sportObj);
    }
  }, [isVisible, sportObj]);

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
          // <EditBasicInfoScreen
          //   {...userData}
          //   setData={(data) => {
          //     setUserData({...userData, ...data});
          //   }}
          // />
          <ScrollView showsVerticalScrollIndicator={false}>
            <TCKeyboardView>
              <EditBasicInfoComponent
                userInfo={userData}
                containerStyle={{paddingHorizontal: 15, paddingVertical: 20}}
                setUserInfo={(obj) => {
                  setUserData({...userData, ...obj});
                }}
                onPressInfoButton={openBasicInfoModal}
              />
            </TCKeyboardView>
          </ScrollView>
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

  const updateUser = (data = {}) => {
    setLoading(true);
    patchPlayer(data, authContext)
      .then(async (res) => {
        updateSportObj({...updatedSportObj});
        updateUserObj(res.payload);
        await setAuthContextData(res.payload, authContext);
        setLoading(false);
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
      setUserData({...data});
      updateUser(data);
    }
  };

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={closeModal}
      containerStyle={{padding: 0}}
      modalType={ModalTypes.style1}
      sportIcon={sportIcon}
      title={title}
      backIcon={images.backArrow}
      leftIconPress={() => {
        setSelectedCertificates(sportObj?.certificates ?? []);
        closeModal();
      }}
      isRightIconText
      headerRightButtonText={strings.save}
      onRightButtonPress={handleSave}
      isRightButtonDisabled={isRightButtonDisabled}>
      <ActivityLoader visible={loading} />
      {renderView()}
    </CustomModalWrapper>
  );
};

export default EditWrapperScreen;
