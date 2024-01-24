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
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
import ScreenHeader from '../../../components/ScreenHeader';
import {strings} from '../../../../Localization/translation';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {
  PrivacyKeyEnum,
  UserPrivacySettingOptions,
  binaryPrivacyOptions,
  defaultOptions,
  followerFollowingOptions,
  inviteToEventOptions,
} from '../../../Constants/PrivacyOptionsConstant';
import AuthContext from '../../../auth/context';
import {
  getEntitySportList,
  getSportName,
} from '../../../utils/sportsActivityUtils';
import Verbs from '../../../Constants/Verbs';

const PersonalUserPrivacySettingsScreen = ({navigation}) => {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [menuOptions, setMenuOptions] = useState([]);

  const getSportActivityList = useCallback(() => {
    const playingSportsList = getEntitySportList(
      authContext.entity.obj,
      Verbs.entityTypePlayer,
    );
    const refereeingSportsList = getEntitySportList(
      authContext.entity.obj,
      Verbs.entityTypeReferee,
    );

    const scorekeepingSportsList = getEntitySportList(
      authContext.entity.obj,
      Verbs.entityTypeScorekeeper,
    );

    const finalList = [
      ...playingSportsList,
      ...refereeingSportsList,
      ...scorekeepingSportsList,
    ];

    const formattedSportsList = finalList.map((sport) => {
      const obj = {label: null, extraData: null};
      if (sport?.sport_name) {
        obj.extraData = {...sport};
      } else {
        const sportName = getSportName(
          sport.sport,
          sport.sport_type,
          authContext.sports,
        );
        obj.extraData = {...sport, sport_name: sportName};
      }
      if (sport.type === Verbs.entityTypeReferee) {
        obj.label = format(
          strings.refreeingSportText,
          obj.extraData.sport_name,
        );
      } else if (sport.type === Verbs.entityTypeScorekeeper) {
        obj.label = format(
          strings.scorekeepingSportText,
          obj.extraData.sport_name,
        );
      } else {
        obj.label = format(strings.playingSportText, obj.extraData.sport_name);
      }
      return obj;
    });
    return formattedSportsList;
  }, [authContext.entity.obj, authContext.sports]);

  useEffect(() => {
    if (isFocused) {
      if (
        authContext.entity.role === Verbs.entityTypePlayer ||
        authContext.entity.role === Verbs.entityTypeUser
      ) {
        const options = UserPrivacySettingOptions.map((item) => {
          const obj = {};
          obj.title = strings[item.title];
          if (item.data.length > 0) {
            const optionList = item.data.map((ele) => ({
              label: strings[ele.label],
              extraData: ele.extraData,
            }));
            obj.data = [...optionList];
          }
          return obj;
        });

        const formattedSportsList = getSportActivityList();

        const updatedOptionsList = options.map((option) => {
          const updatedOption = {...option};
          if (option.title === strings.sportsActivityPage) {
            updatedOption.data = [...formattedSportsList];
          }
          return updatedOption;
        });

        setMenuOptions(updatedOptionsList);
      }
    }
  }, [
    isFocused,
    authContext.entity.role,
    authContext.sports,
    getSportActivityList,
  ]);

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
            key: PrivacyKeyEnum.Slogan,
          },
        ];
      case strings.SportActivitiesList:
        return [
          {
            question: strings.whoCanSeeSportActivityList,
            options: defaultOptions,
            key: PrivacyKeyEnum.SportActivityList,
          },
        ];

      case strings.postTitle:
        return [
          {
            question: strings.whoCanViewYourPostsSection,
            options: defaultOptions,
            key: PrivacyKeyEnum.Posts,
          },
        ];

      case strings.event:
        return [
          {
            question: strings.whoCanViewYourEventsSection,
            subText: strings.eventsPrivacySubText,
            options: defaultOptions,
            key: PrivacyKeyEnum.Events,
          },
        ];

      case strings.galleryTitle:
        return [
          {
            question: strings.whoCanViewYourGallerySection,
            options: defaultOptions,
            key: PrivacyKeyEnum.Gallery,
          },
        ];

      case strings.chatsTitle:
        return [
          {
            question: strings.whocaninviteyoutochat,
            options: defaultOptions,
            key: PrivacyKeyEnum.Chats,
          },
        ];

      case strings.tag:
        return [
          {
            question: strings.whocantagpostcommentorreply,
            options: defaultOptions,
            key: PrivacyKeyEnum.Tag,
          },
        ];

      case strings.followingFollower:
        return [
          {
            question: strings.whocanfollowyou,
            options: followerFollowingOptions,
            key: PrivacyKeyEnum.Follow,
          },
          {
            question: strings.whoCanViewFollowingAndFollowers,
            options: defaultOptions,
            key: PrivacyKeyEnum.FollowingAndFollowers,
          },
        ];

      case strings.teamClubAndLeague:
        return [
          {
            question: strings.whocaninviteteamtogetherdoublesports,
            subText: strings.privacyDoubleSportSubText,
            options: defaultOptions,
            key: PrivacyKeyEnum.CreateTeamForDoubleSport,
          },
          {
            question: strings.whoCanInviteToJoinTeams,
            options: binaryPrivacyOptions,
            key: PrivacyKeyEnum.InviteForTeam,
          },
          {
            question: strings.whoCanInviteToJoinClubs,
            options: binaryPrivacyOptions,
            key: PrivacyKeyEnum.InviteForClub,
          },
          {
            question: strings.whoCanInviteToJoinLeaguesTournaments,
            options: binaryPrivacyOptions,
            key: PrivacyKeyEnum.InviteForLeague,
          },
        ];

      case strings.eventInvitation:
        return [
          {
            question: strings.whoCanInviteYouToJoinEvent,
            options: inviteToEventOptions,
            key: PrivacyKeyEnum.InviteToJoinEvent,
          },
        ];

      default:
        return [];
    }
  };

  const handleOptions = (options = '', extraData = null) => {
    if (options === strings.blocked) {
      return;
    }

    if (extraData) {
      if (extraData?.sport) {
        if (extraData.type === Verbs.entityTypePlayer) {
          navigation.navigate('SportActivityPrivacyOptionsScreen', {
            headerTitle: options,
            sportObject: {...extraData},
          });
        } else {
          const refereeScorekeeperQuestions = [
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
          navigation.navigate('PrivacyOptionsScreen', {
            headerTitle: options,
            privacyOptions: refereeScorekeeperQuestions,
            isFromSportActivitySettings: true,
            sportObject: extraData,
            entityType: authContext.entity.role,
          });
        }
      }
    } else {
      const routeParams = {
        headerTitle: options,
        privacyOptions: [],
        entityType: authContext.entity.role,
      };
      routeParams.privacyOptions = getQuestionAndOptions(options);
      navigation.navigate('PrivacyOptionsScreen', {...routeParams});
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.privacyText}
        leftIcon={images.backArrow}
        isFullTitle
        leftIconPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <SectionList
          extraData={menuOptions}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          sections={menuOptions}
          keyExtractor={(item, index) => item + index.toString()}
          renderSectionHeader={({section: {title}}) => (
            <Text style={styles.header}>{title}</Text>
          )}
          renderItem={({item}) => (
            <>
              <Pressable
                onPress={() => handleOptions(item.label, item.extraData)}
                style={styles.listContainer}>
                <View>
                  <Text style={styles.listItems}>{item.label}</Text>
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
