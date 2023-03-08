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

const EditWrapperScreen = ({navigation, route}) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

  const {section, title, sportObj, sportIcon} = route.params;
  const authContext = useContext(AuthContext);

  useEffect(() => {
    setUserData(authContext.entity.obj);
  }, [authContext]);

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

      default:
        return null;
    }
  };

  const handleSave = () => {
    setLoading(true);
    patchPlayer(userData, authContext)
      .then(async (res) => {
        setLoading(false);
        await setAuthContextData(res.payload, authContext);
        navigation.navigate('SportActivityHome', {
          sport: sportObj?.sport,
          sportType: sportObj?.sport_type,
          uid: userData.user_id,
        });
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert(strings.alertmessagetitle, error.message);
      });
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
