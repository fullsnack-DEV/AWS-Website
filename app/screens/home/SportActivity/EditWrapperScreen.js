// @flow
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {strings} from '../../../../Localization/translation';
import {patchPlayer} from '../../../api/Users';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {setStorage} from '../../../utils';
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
        const entity = authContext.entity;
        entity.auth.user = res.payload;
        entity.obj = res.payload;
        authContext.setEntity({...entity});
        authContext.setUser(res.payload);
        await setStorage('authContextUser', res.payload);
        await setStorage('authContextEntity', {...entity});
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
    <SafeAreaView style={styles.parent}>
      <View style={styles.headerRow}>
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image source={images.backArrow} style={styles.image} />
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 2}}>
          <View style={[styles.iconContainer, {width: 40, height: 40}]}>
            <Image
              source={sportIcon ? {uri: sportIcon} : images.accountMySports}
              style={styles.image}
            />
          </View>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
          {loading ? (
            <ActivityIndicator size={'small'} />
          ) : (
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.buttonText}>{strings.save}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {renderView()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 16,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.writePostSepratorColor,
  },
  headerTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  iconContainer: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 19,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
});
export default EditWrapperScreen;
