// @flow
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import {strings} from '../../../../Localization/translation';
import {patchPlayer} from '../../../api/Users';
import AuthContext from '../../../auth/context';
import ScreenHeader from '../../../components/ScreenHeader';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {privacySettingEnum} from '../../../Constants/GeneralConstants';
import images from '../../../Constants/ImagePath';
import {setAuthContextData} from '../../../utils';

const settingsOption = [0, 3, 2, 1];

const PrivacySettingsScreen = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [sportObj, setSportObj] = useState({});

  const {sportIcon, section, sport, sportType, privacyKey} = route.params;
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const user = authContext.entity.obj ?? {};

    if (user.user_id && user.registered_sports?.length > 0) {
      const obj = user.registered_sports.find(
        (item) => item.sport === sport && item.sport_type === sportType,
      );
      setSportObj(obj);
    }
  }, [authContext, sport, sportType]);

  const handleSave = () => {
    const user = authContext.entity.obj ?? {};
    const sportsList = user.registered_sports.map((item) => {
      if (
        item.sport === sportObj.sport &&
        item.sport_type === sportObj.sport_type
      ) {
        return {
          ...sportObj,
        };
      }
      return {...item};
    });

    const userData = {
      ...user,
      registered_sports: [...sportsList],
    };

    setLoading(true);
    patchPlayer(userData, authContext)
      .then(async (res) => {
        setLoading(false);
        await setAuthContextData(res.payload, authContext);
        navigation.navigate('SportActivityHome', {
          sport,
          sportType,
          uid: userData.user_id,
        });
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert(strings.alertmessagetitle, error.message);
      });
  };

  const renderTitle = () => {
    switch (section) {
      case strings.bio:
        return strings.bioPrivacyTitle;

      case strings.basicInfoText:
        return strings.basicInfoSportsPrivacyTitle;

      case strings.clubstitle:
        return strings.clubPrivacyTitle;

      case strings.leagues:
        return strings.leaguePrivacyTitle;

      case strings.homeFacility:
        return strings.homePlacePrivacyTitle;

      case strings.ntrpTitle:
        return strings.ntrpPrivacyTitle;

      default:
        return null;
    }
  };

  const renderContent = () => {
    if (section !== strings.basicInfoText) {
      return settingsOption.map((item, index) => (
        <Pressable
          style={styles.listItem}
          key={index}
          onPress={() => {
            const newObj = {...sportObj};
            newObj[privacyKey] = item;
            setSportObj({...newObj});
          }}>
          <Text style={styles.listLabel}>{privacySettingEnum[item]}</Text>
          <View style={styles.listIconContainer}>
            {sportObj[privacyKey] === item ? (
              <Image source={images.radioCheckYellow} style={styles.image} />
            ) : (
              <Image source={images.radioUnselect} style={styles.image} />
            )}
          </View>
        </Pressable>
      ));
    }

    return (
      <View style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Text style={styles.label}>{strings.gender.toUpperCase()}</Text>
            {settingsOption.map((item, index) => (
              <Pressable
                style={styles.listItem}
                key={index}
                onPress={() => {
                  const newObj = {...sportObj};
                  newObj[privacyKey.gender] = item;
                  setSportObj({...newObj});
                }}>
                <Text style={styles.listLabel}>{privacySettingEnum[item]}</Text>
                <View style={styles.listIconContainer}>
                  {sportObj[privacyKey.gender] === item ? (
                    <Image
                      source={images.radioCheckYellow}
                      style={styles.image}
                    />
                  ) : (
                    <Image source={images.radioUnselect} style={styles.image} />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
          <View style={styles.dividor} />

          <View>
            <Text style={styles.label}>
              {strings.yearOfBirth.toUpperCase()}
            </Text>
            {settingsOption.map((item, index) => (
              <Pressable
                style={styles.listItem}
                key={index}
                onPress={() => {
                  const newObj = {...sportObj};
                  newObj[privacyKey.yearOfBirth] = item;
                  setSportObj({...newObj});
                }}>
                <Text style={styles.listLabel}>{privacySettingEnum[item]}</Text>
                <View style={styles.listIconContainer}>
                  {sportObj[privacyKey.yearOfBirth] === item ? (
                    <Image
                      source={images.radioCheckYellow}
                      style={styles.image}
                    />
                  ) : (
                    <Image source={images.radioUnselect} style={styles.image} />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
          <View style={styles.dividor} />

          <View>
            <Text style={styles.label}>{strings.height.toUpperCase()}</Text>
            {settingsOption.map((item, index) => (
              <Pressable
                style={styles.listItem}
                key={index}
                onPress={() => {
                  const newObj = {...sportObj};
                  newObj[privacyKey.height] = item;
                  setSportObj({...newObj});
                }}>
                <Text style={styles.listLabel}>{privacySettingEnum[item]}</Text>
                <View style={styles.listIconContainer}>
                  {sportObj[privacyKey.height] === item ? (
                    <Image
                      source={images.radioCheckYellow}
                      style={styles.image}
                    />
                  ) : (
                    <Image source={images.radioUnselect} style={styles.image} />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
          <View style={styles.dividor} />

          <View>
            <Text style={styles.label}>{strings.weight.toUpperCase()}</Text>
            {settingsOption.map((item, index) => (
              <Pressable
                style={styles.listItem}
                key={index}
                onPress={() => {
                  const newObj = {...sportObj};
                  newObj[privacyKey.weight] = item;
                  setSportObj({...newObj});
                }}>
                <Text style={styles.listLabel}>{privacySettingEnum[item]}</Text>
                <View style={styles.listIconContainer}>
                  {sportObj[privacyKey.weight] === item ? (
                    <Image
                      source={images.radioCheckYellow}
                      style={styles.image}
                    />
                  ) : (
                    <Image source={images.radioUnselect} style={styles.image} />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
          <View style={styles.dividor} />

          <View>
            <Text style={styles.label}>{strings.language.toUpperCase()}</Text>
            {settingsOption.map((item, index) => (
              <Pressable
                style={styles.listItem}
                key={index}
                onPress={() => {
                  const newObj = {...sportObj};
                  newObj[privacyKey.language] = item;
                  setSportObj({...newObj});
                }}>
                <Text style={styles.listLabel}>{privacySettingEnum[item]}</Text>
                <View style={styles.listIconContainer}>
                  {sportObj[privacyKey.language] === item ? (
                    <Image
                      source={images.radioCheckYellow}
                      style={styles.image}
                    />
                  ) : (
                    <Image source={images.radioUnselect} style={styles.image} />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
          <View style={styles.dividor} />
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeader
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.goBack();
        }}
        sportIcon={sportIcon}
        title={strings.privacySettings}
        isRightIconText
        rightButtonText={strings.save}
        onRightButtonPress={handleSave}
        loading={loading}
      />

      <View style={styles.container}>
        <Text style={styles.title}>{renderTitle()}</Text>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    marginBottom: 15,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  listLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  listIconContainer: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    marginBottom: 15,
  },
  dividor: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 25,
  },
});
export default PrivacySettingsScreen;
