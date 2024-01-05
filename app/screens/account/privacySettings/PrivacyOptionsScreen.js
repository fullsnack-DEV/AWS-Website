import {StyleSheet, SafeAreaView, View, BackHandler} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import ScreenHeader from '../../../components/ScreenHeader';
import {strings} from '../../../../Localization/translation';
import images from '../../../Constants/ImagePath';
import QuestionAndOptionsComponent from './QuestionAndOptionsComponent';
import AuthContext from '../../../auth/context';
import {
  PersonUserPrivacyEnum,
  PrivacyKeyEnum,
} from '../../../Constants/PrivacyOptionsConstant';
import {patchPlayer} from '../../../api/Users';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {setAuthContextData} from '../../../utils';

const PrivacyOptionsScreen = ({navigation, route}) => {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const {headerTitle, privacyOptions} = route.params;

  const [selectedOption, setSelectedOption] = useState({});
  const [sectionKey, setSectionKey] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  const getKeyForSection = useCallback(() => {
    switch (headerTitle) {
      case strings.slogan:
        return PrivacyKeyEnum.Slogan;

      case strings.SportActivitiesList:
        return PrivacyKeyEnum.SportActivityList;

      case strings.postTitle:
        return PrivacyKeyEnum.Posts;

      case strings.event:
        return PrivacyKeyEnum.Events;

      case strings.galleryTitle:
        return PrivacyKeyEnum.Gallery;

      default:
        return '';
    }
  }, [headerTitle]);

  useEffect(() => {
    if (isFocused) {
      const entity = {...authContext.entity.obj};
      const key = getKeyForSection();
      setSectionKey(key);

      const privacyVal = entity[key] ?? 1;

      setSelectedOption({
        label: PersonUserPrivacyEnum[privacyVal],
        value: privacyVal,
      });
    }
  }, [isFocused, authContext.entity.obj, getKeyForSection]);

  const handleSave = () => {
    const payload = {};
    if (sectionKey) {
      payload[sectionKey] = selectedOption.value;

      setLoading(true);
      patchPlayer(payload, authContext)
        .then(async (response) => {
          await setAuthContextData(response.payload, authContext);
          navigation.goBack();
          setLoading(false);
        })
        .catch((err) => {
          console.log('error ==>', err);
          setLoading(false);
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
        rightButtonText={strings.save}
        onRightButtonPress={handleSave}
      />

      <ActivityLoader visible={loading} />

      <View style={styles.container}>
        {(privacyOptions ?? []).map((item, index) => (
          <QuestionAndOptionsComponent
            key={index}
            title={item.question}
            options={item.options}
            onSelect={(option) => setSelectedOption(option)}
            selectedOption={selectedOption}
          />
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
});

export default PrivacyOptionsScreen;
