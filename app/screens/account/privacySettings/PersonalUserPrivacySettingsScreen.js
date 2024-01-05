import {
  BackHandler,
  SectionList,
  StyleSheet,
  View,
  Pressable,
  Text,
  Image,
  SafeAreaView,
} from 'react-native';
import React, {useEffect} from 'react';
import ScreenHeader from '../../../components/ScreenHeader';
import {strings} from '../../../../Localization/translation';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {
  UserPrivacySettingOptions,
  defaultOptions,
} from '../../../Constants/PrivacyOptionsConstant';

const PersonalUserPrivacySettingsScreen = ({navigation}) => {
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

  const getQuestionAndOptions = (option) => {
    switch (option) {
      case strings.slogan:
        return [
          {
            question: strings.whoCanViewYourSlogan,
            options: defaultOptions,
          },
        ];
      case strings.SportActivitiesList:
        return [
          {
            question: strings.whoCanSeeSportActivityList,
            options: defaultOptions,
          },
        ];

      case strings.postTitle:
        return [
          {
            question: strings.whoCanViewYourPostsSection,
            options: defaultOptions,
          },
        ];

      case strings.event:
        return [
          {
            question: strings.whoCanViewYourEventsSection,
            options: defaultOptions,
          },
        ];

      case strings.galleryTitle:
        return [
          {
            question: strings.whoCanViewYourGallerySection,
            options: defaultOptions,
          },
        ];

      default:
        return [];
    }
  };

  const handleOptions = (options) => {
    const routeParams = {
      headerTitle: options,
      privacyOptions: [],
    };
    routeParams.privacyOptions = getQuestionAndOptions(options);
    navigation.navigate('PrivacyOptionsScreen', {...routeParams});
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.privacyText}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <SectionList
          showsVerticalScrollIndicator={false}
          sections={UserPrivacySettingOptions}
          keyExtractor={(item, index) => item + index.toString()}
          renderSectionHeader={({section: {title}}) => (
            <Text style={styles.header}>{title}</Text>
          )}
          renderItem={({item}) => (
            <>
              <Pressable
                onPress={() => handleOptions(item)}
                style={styles.listContainer}>
                <View>
                  <Text style={styles.listItems}>{item}</Text>
                </View>
                <View style={styles.nextArrow}>
                  <Image source={images.nextArrow} style={styles.image} />
                </View>
              </Pressable>
              <View style={styles.separatorLine} />
            </>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingLeft: 10,
    paddingRight: 5,
  },
  header: {
    fontFamily: fonts.RBold,
    marginTop: 20,
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
  },
  listItems: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
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
  },
});

export default PersonalUserPrivacySettingsScreen;
