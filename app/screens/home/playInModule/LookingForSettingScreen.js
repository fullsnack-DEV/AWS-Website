import React, {useState, useContext, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
  BackHandler,
} from 'react-native';

import {format} from 'react-string-format';
import {patchPlayer} from '../../../api/Users';
import AuthContext from '../../../auth/context';
import * as Utility from '../../../utils';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import images from '../../../Constants/ImagePath';
import Verbs from '../../../Constants/Verbs';
import {
  getEntitySport,
  getEntitySportList,
} from '../../../utils/sportsActivityUtils';
import ScreenHeader from '../../../components/ScreenHeader';

export default function LookingForSettingScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [lookingFor, setLookingFor] = useState(strings.yesDisplayItText);
  const [sportObj] = useState(route.params.sport);
  const lookingOpetions = [strings.yesDisplayItText, strings.noDisplayItText];
  const {entityType, comeFrom, routeParams} = route.params;

  const getHeaderTitle = useCallback(() => {
    if (entityType === Verbs.entityTypePlayer) {
      if (sportObj?.sport_type === Verbs.singleSport) {
        return strings.lookingForClubText;
      }
      return strings.lookingForTeamText;
    }
    return strings.lookingForClubText;
  }, [sportObj, entityType]);

  const updateProfile = useCallback(() => {
    setloading(true);
    const selectedSport = getEntitySport({
      user: authContext.entity.obj,
      role: entityType,
      sportType: sportObj?.sport_type,
      sport: sportObj?.sport,
    });
    const list = getEntitySportList(authContext.entity.obj, entityType);
    const sportList = list.map((item) => {
      if (item.sport === selectedSport.sport) {
        return {
          ...selectedSport,
          lookingForTeamClub: lookingFor === strings.yesDisplayItText,
        };
      }
      return item;
    });

    let body = {};
    if (entityType === Verbs.entityTypeReferee) {
      body = {
        referee_data: sportList,
      };
    }
    if (entityType === Verbs.entityTypeScorekeeper) {
      body = {
        scorekeeper_data: sportList,
      };
    }
    if (entityType === Verbs.entityTypePlayer) {
      body = {
        registered_sports: sportList,
      };
    }

    patchPlayer(body, authContext)
      .then(async (response) => {
        if (response.status === true) {
          setloading(false);
          await Utility.setAuthContextData(response.payload, authContext);
          if (comeFrom) {
            navigation.navigate(comeFrom, {...routeParams});
          } else {
            navigation.navigate('SportActivityScreen', {
              sport: {
                ...selectedSport,
                lookingForTeamClub: lookingFor === strings.yesDisplayItText,
              },
              type: entityType,
            });
          }
        } else {
          Alert.alert(strings.appName, response.messages);
        }
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [
    authContext,
    lookingFor,
    navigation,
    sportObj,
    entityType,
    comeFrom,
    routeParams,
  ]);

  useEffect(() => {
    const selectedSport = getEntitySport({
      user: authContext.entity.obj,
      role: entityType,
      sportType: sportObj?.sport_type,
      sport: sportObj?.sport,
    });

    setLookingFor(
      selectedSport?.lookingForTeamClub
        ? strings.yesDisplayItText
        : strings.noDisplayItText,
    );
  }, [authContext, sportObj, entityType]);

  const handleBackPress = useCallback(() => {
    if (comeFrom) {
      navigation.navigate('AccountStack', {
        screen: comeFrom,
        params: {...routeParams},
      });
    } else {
      navigation.goBack();
    }
  }, [navigation, comeFrom, routeParams]);

  useEffect(() => {
    const backAction = () => {
      handleBackPress();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [handleBackPress]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={getHeaderTitle()}
        leftIcon={images.backArrow}
        leftIconPress={handleBackPress}
        isRightIconText
        rightButtonText={strings.save}
        onRightButtonPress={updateProfile}
        loading={loading}
        containerStyle={styles.headerRow}
      />
      <View style={styles.container}>
        <View>
          <Text style={styles.screenTitle}>{strings.lookingNewClubTeam}</Text>
          <View style={styles.lookingContainer}>
            <Text style={styles.lookingContainerText}>
              {sportObj?.sport_type === Verbs.singleSport
                ? strings.lookingForClubOption
                : strings.lookingForTeamOption}
            </Text>
          </View>
          <View style={{marginTop: 25}}>
            {lookingOpetions.map((item, index) => (
              <TouchableWithoutFeedback
                onPress={() => setLookingFor(item)}
                key={index}>
                <View
                  style={[
                    styles.radioItem,
                    index === lookingOpetions.length - 1
                      ? {marginBottom: 0}
                      : {},
                  ]}>
                  <Text style={styles.languageList}>{item}</Text>
                  <View>
                    {item === lookingFor ? (
                      <Image
                        source={images.radioCheckYellow}
                        style={styles.checkboxImg}
                      />
                    ) : (
                      <Image
                        source={images.radioUnselect}
                        style={styles.checkboxImg}
                      />
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <View style={{width: 240, height: 230}}>
            <Image
              source={
                sportObj?.sport_type === Verbs.singleSport
                  ? images.lookingForClubImg
                  : images.lookingForImg
              }
              style={{width: '100%', height: '100%', resizeMode: 'cover'}}
            />
          </View>
        </View>
        <Text style={[styles.languageList, {marginBottom: 50}]}>
          {format(strings.lookingForBottomText, getHeaderTitle())}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 24,
    paddingBottom: 4,
    justifyContent: 'space-between',
  },
  headerRow: {
    paddingBottom: 14,
    paddingTop: 6,
    paddingLeft: 10,
    paddingRight: 15,
  },
  screenTitle: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginBottom: 8,
  },
  lookingContainer: {
    backgroundColor: colors.tabFontColor,
    borderRadius: 5,
    alignSelf: 'baseline',
    paddingHorizontal: 5,
  },
  lookingContainerText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.whiteColor,
    fontFamily: fonts.RMedium,
  },
  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  radioItem: {
    paddingHorizontal: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
