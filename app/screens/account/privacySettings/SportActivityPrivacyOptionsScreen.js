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
      if (sportObject.type === Verbs.entityTypePlayer) {
        setOptions([strings.infoTitle, strings.scoreboard]);
      }
    }
  }, [sportObject?.type]);

  const getChildOptions = () => {
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
  };

  const getQuestions = (option) => {
    switch (option) {
      case strings.homeFacility:
        return [
          {
            question: strings.whoCanSeeHomeFacility,
            options: defaultOptions,
            key: PrivacyKeyEnum.HomeFacility,
          },
        ];

      case strings.clubsTitleText:
        return [
          {
            question: strings.whoCanSeeYourClubs,
            options: defaultOptions,
            key: PrivacyKeyEnum.Clubs,
          },
        ];

      case strings.teamsTitleText:
        return [
          {
            question: strings.whoCanSeeYourTeams,
            options: defaultOptions,
            key: PrivacyKeyEnum.Teams,
          },
        ];

      case strings.leaguesTitle:
        return [
          {
            question: strings.whoCanSeeYourLeagues,
            options: defaultOptions,
            key: PrivacyKeyEnum.Leagues,
          },
        ];

      case strings.basicinfotitle:
        return [
          {
            question: strings.whoCanSeeYourYearOfBirth,
            options: defaultOptions,
            key: PrivacyKeyEnum.YearOfBirth,
          },
          {
            question: strings.whoCanSeeYourGender,
            options: defaultOptions,
            key: PrivacyKeyEnum.Gender,
          },
          {
            question: strings.whoCanSeeYourHeight,
            options: defaultOptions,
            key: PrivacyKeyEnum.Height,
          },
          {
            question: strings.whoCanSeeYourWeight,
            options: defaultOptions,
            key: PrivacyKeyEnum.Weight,
          },
          {
            question: strings.whoCanSeeYouLanguages,
            options: defaultOptions,
            key: PrivacyKeyEnum.Langueages,
          },
        ];

      default:
        return [];
    }
  };

  const onOptionPress = (option = '') => {
    if (option === strings.scoreboard) {
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
        headerTitle: option,
        privacyOptions: scoreboardOptions,
        isFromSportActivitySettings: true,
        sportObject,
      });
    } else {
      navigation.navigate('PrivacyOptionsScreen', {
        headerTitle: option,
        privacyOptions: getQuestions(option),
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
                  disabled={option === strings.infoTitle}
                  style={styles.buttonContainer}
                  onPress={() => onOptionPress(option)}>
                  <View style={{flex: 1}}>
                    <Text style={styles.label}>{option}</Text>
                  </View>
                  {option !== strings.infoTitle && (
                    <View style={styles.nextArrow}>
                      <Image source={images.nextArrow} style={styles.image} />
                    </View>
                  )}
                </TouchableOpacity>
                <View style={styles.separatorLine} />
                {option === strings.infoTitle &&
                  getChildOptions().map((item, idx) => (
                    <View key={item + idx} style={{paddingLeft: 35}}>
                      <TouchableOpacity
                        style={styles.buttonContainer}
                        onPress={() => onOptionPress(item)}>
                        <View style={{flex: 1}}>
                          <Text style={styles.label}>{item}</Text>
                        </View>

                        <View style={styles.nextArrow}>
                          <Image
                            source={images.nextArrow}
                            style={styles.image}
                          />
                        </View>
                      </TouchableOpacity>
                      <View style={styles.separatorLine} />
                    </View>
                  ))}
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
