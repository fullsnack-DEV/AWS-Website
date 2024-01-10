// @flow
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import ScreenHeader from '../../../components/ScreenHeader';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import Verbs from '../../../Constants/Verbs';
import {
  PrivacyKeyEnum,
  defaultOptions,
  scoreboardPeriodPrivacyOptions,
} from '../../../Constants/PrivacyOptionsConstant';

const SportActivityPrivacyOptionsScreen = ({navigation, route}) => {
  const [options, setOptions] = useState([]);
  const {headerTitle, sportObject} = route.params;

  useEffect(() => {
    if (sportObject?.type) {
      if (sportObject.type === Verbs.entityTypeReferee) {
        setOptions([strings.infoTitle]);
      } else {
        setOptions([strings.infoTitle, strings.scoreboard]);
      }
    }
  }, [sportObject?.type]);

  const getChildOptions = () => {
    if (sportObject.type === Verbs.entityTypePlayer) {
      if (sportObject.sport_type === Verbs.singleSport) {
        return [
          strings.basicinfotitle,
          strings.homeFacility,
          strings.clubsTitleText,
          strings.leaguesTitle,
        ];
      }
      return [
        strings.basicinfotitle,
        strings.teamsTitleText,
        strings.clubsTitleText,
        strings.leaguesTitle,
      ];
    }
    if (sportObject.type === Verbs.entityTypeReferee) {
      return [strings.basicinfotitle];
    }
    return [];
  };

  const onOptionPress = (option = '') => {
    if (option === strings.infoTitle) {
      navigation.navigate('SportActivityPrivacyChildOptions', {
        headerTitle: option,
        options: getChildOptions(),
        sportObject,
      });
    } else {
      const scoreboardOptions = [
        {
          question: strings.whoCanSeeYourScoreboard,
          options: defaultOptions,
          key: PrivacyKeyEnum.Scoreboard,
        },
        {
          question: strings.yourMatchesOfWhatPeriodCanOtherPeopleView,
          subText: strings.recentMatchResultText,
          options: scoreboardPeriodPrivacyOptions,
          key: PrivacyKeyEnum.ScoreboardTimePeriod,
        },
      ];

      navigation.navigate('PrivacyOptionsScreen', {
        headerTitle: options,
        privacyOptions: scoreboardOptions,
        isFromSportActivitySettings: true,
        sportObject,
      });
    }
  };

  return (
    <SafeAreaView style={styles.parent}>
      <ScreenHeader
        title={headerTitle}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        isRightIconText
      />
      <View style={styles.container}>
        {options.length > 0
          ? options.map((option, index) => (
              <View key={index}>
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={() => onOptionPress(option)}>
                  <View style={{flex: 1}}>
                    <Text style={styles.label}>{option}</Text>
                  </View>
                  <View style={styles.nextArrow}>
                    <Image source={images.nextArrow} style={styles.image} />
                  </View>
                </TouchableOpacity>
                <View style={styles.separatorLine} />
              </View>
            ))
          : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  nextArrow: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  separatorLine: {
    height: 1,
    backgroundColor: colors.buttonClickBgEffect,
    marginVertical: 15,
  },
});
export default SportActivityPrivacyOptionsScreen;
