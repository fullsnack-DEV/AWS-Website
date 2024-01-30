// @flow
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {ModalTypes} from '../../../Constants/GeneralConstants';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import {
  PrivacyKeyEnum,
  defaultOptions,
} from '../../../Constants/PrivacyOptionsConstant';
import QuestionAndOptionsComponent from '../../account/privacySettings/QuestionAndOptionsComponent';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import Verbs from '../../../Constants/Verbs';
import {patchPlayer} from '../../../api/Users';
import {setAuthContextData} from '../../../utils';
import fonts from '../../../Constants/Fonts';

const SportActivityPrivacyModal = ({
  isVisible = false,
  closeModal = () => {},
  sportIcon = null,
  sectionName,
  sportObj = {},
  onSave = () => {},
  entityType = Verbs.entityTypePlayer,
}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [privacyOptions, setPrivacyOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const authContext = useContext(AuthContext);

  const getQuestionAndOptions = useCallback(() => {
    if (!sectionName) {
      return [];
    }

    switch (sectionName) {
      case strings.basicInfoText:
        if (entityType === Verbs.entityTypePlayer) {
          return [
            {
              question: strings.gender.toUpperCase(),
              options: defaultOptions,
              key: PrivacyKeyEnum.Gender,
            },
            {
              question: strings.yearOfBirth.toUpperCase(),
              options: defaultOptions,
              key: PrivacyKeyEnum.YearOfBirth,
            },
            {
              question: strings.height.toUpperCase(),
              options: defaultOptions,
              key: PrivacyKeyEnum.Height,
            },
            {
              question: strings.weight.toUpperCase(),
              options: defaultOptions,
              key: PrivacyKeyEnum.Weight,
            },
            {
              question: strings.language.toUpperCase(),
              options: defaultOptions,
              key: PrivacyKeyEnum.Langueages,
            },
          ];
        }
        return [
          {
            question: strings.gender.toUpperCase(),
            options: defaultOptions,
            key: PrivacyKeyEnum.Gender,
          },
          {
            question: strings.yearOfBirth.toUpperCase(),
            options: defaultOptions,
            key: PrivacyKeyEnum.YearOfBirth,
          },
          {
            question: strings.language.toUpperCase(),
            options: defaultOptions,
            key: PrivacyKeyEnum.Langueages,
          },
        ];

      case strings.homeFacility:
        return [
          {
            question: strings.whoCanSeeHomeFacility,
            options: defaultOptions,
            key: PrivacyKeyEnum.HomeFacility,
          },
        ];

      case strings.clubstitle:
        return [
          {
            question: strings.whoCanSeeYourClubs,
            options: defaultOptions,
            key: PrivacyKeyEnum.Clubs,
          },
        ];

      case strings.leagues:
        return [
          {
            question: strings.whoCanSeeYourLeagues,
            options: defaultOptions,
            key: PrivacyKeyEnum.Leagues,
          },
        ];

      case strings.teamstitle:
        return [
          {
            question: strings.whoCanSeeYourTeams,
            options: defaultOptions,
            key: PrivacyKeyEnum.Teams,
          },
        ];

      default:
        return [];
    }
  }, [sectionName]);

  useEffect(() => {
    if (isVisible) {
      const options = getQuestionAndOptions();
      setPrivacyOptions(options);
    }
  }, [isVisible, getQuestionAndOptions]);

  useEffect(() => {
    if (isVisible && privacyOptions.length > 0) {
      const options = [];
      if (sectionName === strings.basicInfoText) {
        privacyOptions.forEach((item) => {
          const option = item.options.find((ele) => {
            let privacyVal = 0;
            if (authContext.entity.obj[item.key] >= 0) {
              privacyVal = authContext.entity.obj[item.key];
            } else {
              privacyVal = item.key === PrivacyKeyEnum.Langueages ? 1 : 0;
            }
            return privacyVal === ele.value;
          });
          if (option) {
            options.push({...option, key: item.key});
          }
        });
      } else {
        const obj = {...(sportObj?.privacy_settings ?? {})};
        privacyOptions.forEach((item) => {
          const option = item.options.find(
            (ele) => (obj[item.key]?.value ?? 1) === ele.value,
          );
          if (option) {
            options.push({...option, key: item.key});
          }
        });
      }

      setSelectedOptions([...options]);
    }
  }, [isVisible, privacyOptions, sportObj?.privacy_settings, sectionName]);

  const handleSave = () => {
    const entity = {...authContext.entity.obj};

    let payload = {};
    let selectedSport = {};
    const privacyKeyValues = {};

    selectedOptions.forEach((item) => {
      privacyKeyValues[item.key] = item.value;
    });

    if (sectionName === strings.basicInfoText) {
      payload = {...privacyKeyValues};
    } else if (sportObj.type === Verbs.entityTypePlayer) {
      const updatedSports = (entity.registered_sports ?? []).map((item) => {
        if (
          item.sport === sportObj.sport &&
          sportObj.sport_type === item.sport_type
        ) {
          selectedSport = {
            ...item,
            privacy_settings: {
              ...(item?.privacy_settings ?? {}),
              ...privacyKeyValues,
            },
          };
          return selectedSport;
        }
        return item;
      });
      payload.registered_sports = [...updatedSports];
    } else if (sportObj.type === Verbs.entityTypeReferee) {
      const updatedSports = (entity.referee_data ?? []).map((item) => {
        if (item.sport === sportObj.sport) {
          selectedSport = {
            ...item,
            privacy_settings: {
              ...(item?.privacy_settings ?? {}),
              ...privacyKeyValues,
            },
          };
          return selectedSport;
        }
        return item;
      });
      payload.referee_data = [...updatedSports];
    }

    setLoading(true);
    patchPlayer(payload, authContext)
      .then(async (response) => {
        await setAuthContextData(response.payload, authContext);
        setLoading(false);
        onSave(selectedSport);
      })
      .catch((err) => {
        console.log('error ==>', err);
        setLoading(false);
      });
  };

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={closeModal}
      modalType={ModalTypes.style1}
      isRightIconText
      headerRightButtonText={strings.save}
      onRightButtonPress={() => {
        handleSave();
      }}
      showSportIcon
      sportIcon={sportIcon}
      title={strings.privacySettings}
      headerStyle={styles.headerStyle}
      containerStyle={styles.containerStyle}>
      <View style={{flex: 1}}>
        <ActivityLoader visible={loading} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {sectionName === strings.basicInfoText ? (
            <View>
              <Text style={styles.titleQuestion}>
                {strings.whoCanSeeItemsOfBasicInfo}
              </Text>
              <Text style={styles.titleSubText}>
                {strings.theseSettingsWillBeAppliedForBasicInfo}
              </Text>
            </View>
          ) : null}
          {privacyOptions.map((item, index) => {
            const selectedOption =
              selectedOptions.find((ele) => item.key === ele.key) ?? {};

            return (
              <View key={index}>
                <QuestionAndOptionsComponent
                  title={item.question}
                  subText={item?.subText}
                  options={item.options}
                  privacyKey={item.key}
                  onSelect={(option) => {
                    const updatedList =
                      selectedOptions.length > 0
                        ? selectedOptions.map((ele) => {
                            if (ele.key === option.key) {
                              return {...option};
                            }
                            return ele;
                          })
                        : [option];

                    setSelectedOptions(updatedList);
                  }}
                  selectedOption={selectedOption}
                />
                {privacyOptions.length - 1 !== index && (
                  <View style={styles.separatorLine} />
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </CustomModalWrapper>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    paddingBottom: 7,
    borderBottomWidth: 3,
    borderBottomColor: colors.tabFontColor,
  },
  containerStyle: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    flex: 1,
  },
  separatorLine: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 25,
  },
  titleQuestion: {
    fontSize: 20,
    lineHeight: 30,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
    marginBottom: 15,
  },
  titleSubText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    marginBottom: 25,
  },
});
export default SportActivityPrivacyModal;
