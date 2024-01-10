// @flow
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import ScreenHeader from '../../../components/ScreenHeader';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import {
  PrivacyKeyEnum,
  defaultOptions,
} from '../../../Constants/PrivacyOptionsConstant';
import Verbs from '../../../Constants/Verbs';

const SportActivityPrivacyChildOptions = ({navigation, route}) => {
  const {headerTitle, options} = route.params;

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
        if (route.params.sportObject?.type === Verbs.entityTypeReferee) {
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
              question: strings.whoCanSeeYouLanguages,
              options: defaultOptions,
              key: PrivacyKeyEnum.Langueages,
            },
          ];
        }
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

  const handlePressOnOption = (option = '') => {
    const questioList = getQuestions(option);
    navigation.navigate('PrivacyOptionsScreen', {
      headerTitle: option,
      privacyOptions: questioList,
      isFromSportActivitySettings: true,
      sportObject: route.params.sportObject ?? {},
    });
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
        {options.length > 0 &&
          options.map((option, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => handlePressOnOption(option)}>
                <View style={{flex: 1}}>
                  <Text style={styles.label}>{option}</Text>
                </View>
                <View style={styles.nextArrow}>
                  <Image source={images.nextArrow} style={styles.image} />
                </View>
              </TouchableOpacity>
              <View style={styles.separatorLine} />
            </View>
          ))}
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
export default SportActivityPrivacyChildOptions;
