// @flow
import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, Alert} from 'react-native';
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

const EditWrapperScreen = ({navigation, route}) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedCertificates, setSelectedCertificates] = useState([]);

  const {section, title, sportObj, sportIcon, entityType} = route.params;
  const authContext = useContext(AuthContext);

  useEffect(() => {
    setUserData(authContext.entity.obj);
  }, [authContext]);

  useEffect(() => {
    if (sportObj?.certificates?.length > 0) {
      setSelectedCertificates(sportObj.certificates);
    }
  }, [sportObj?.certificates]);

  const renderView = () => {
    switch (section) {
      case strings.bio:
        return (
          <EditBioScreen
            bio={userData.description}
            setData={(bio) => setUserData({...userData, description: bio})}
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
            sportsList={userData.registered_sports ?? []}
            setData={(data) => {
              setUserData({...userData, registered_sports: [...data]});
            }}
            sport={sportObj?.sport}
            sportType={sportObj?.sport_type}
          />
        );

      case strings.clubstitle:
        return null;

      case strings.leagues:
        return null;

      case strings.homeFacility:
        return (
          <EditHomeFacilityScreen
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
          />
        );

      case strings.servicableAreas:
        return null;

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
        navigation.navigate('SportActivityHome', {
          sport: sportObj?.sport,
          sportType: sportObj?.sport_type,
          uid: userData.user_id,
          entityType,
        });
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
        Alert.alert(strings.warningCertificateTitleText);
      } else if (item.title && !item.url) {
        isValid = false;
        Alert.alert(strings.warningCertificateImageText);
      }
    });
    return isValid;
  };

  const handleCertifcate = () => {
    setLoading(true);

    const refereeData = userData.referee_data.map((item) => {
      if (sportObj?.sport === item.sport) {
        return {
          ...item,
          certificates: selectedCertificates,
        };
      }
      return item;
    });
    const updatedObj = {...userData, referee_data: refereeData};
    setUserData(updatedObj);

    if (checkValidation()) {
      updateUser(updatedObj);
    }
  };

  const handleSave = () => {
    if (section === strings.certiTitle) {
      handleCertifcate();
    } else {
      updateUser(userData);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        sportIcon={sportIcon}
        title={title}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.goBack();
        }}
        isRightIconText
        rightButtonText={strings.save}
        onRightButtonPress={handleSave}
        loading={loading}
      />

      {renderView()}
    </SafeAreaView>
  );
};

export default EditWrapperScreen;
