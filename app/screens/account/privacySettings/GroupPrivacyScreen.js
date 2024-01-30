import {useContext, useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  BackHandler,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import ScreenHeader from '../../../components/ScreenHeader';
import {strings} from '../../../../Localization/translation';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {
  TeamPrivacySettingsOptions,
  PrivacyKeyEnum,
  binaryPrivacyOptions,
  followerFollowingOptions,
  teamChatPrivacyOptions,
  groupDefaultPrivacyOptionsForDoubleTeam,
  groupInviteToJoinForTeamSportOptions,
  groupInviteToJoinOptions,
  groupJoinOptions,
  groupPrivacyDefalutOptions,
  defaultClubPrivacyOptions,
  ClubPrivacySettingsOptions,
  inviteToJoinClubOptions,
  teamJoinClubOptions,
  clubChatPrivacyOptions,
} from '../../../Constants/PrivacyOptionsConstant';

import Verbs from '../../../Constants/Verbs';
import AuthContext from '../../../auth/context';

const GroupPrivacyScreen = ({navigation}) => {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [menuOptions, setMenuOptions] = useState([]);

  useEffect(() => {
    if (isFocused) {
      const list =
        authContext.entity.role === Verbs.entityTypeTeam
          ? TeamPrivacySettingsOptions
          : ClubPrivacySettingsOptions;
      const options = list.map((item) => strings[item]);
      setMenuOptions(options);
    }
  }, [isFocused, authContext.entity.role]);

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
    const entity = {...authContext.entity.obj};

    if (entity.entity_type === Verbs.entityTypeTeam) {
      switch (option) {
        case strings.postTitle:
          return [
            {
              question: strings.whoCanViewPostSection,
              options:
                entity.sport_type === Verbs.doubleSport
                  ? groupDefaultPrivacyOptionsForDoubleTeam
                  : groupPrivacyDefalutOptions,
              key: PrivacyKeyEnum.Posts,
            },
            {
              question: strings.whoCanWritePostTeamsPostsSection,
              options:
                entity.sport_type === Verbs.doubleSport
                  ? groupDefaultPrivacyOptionsForDoubleTeam
                  : groupPrivacyDefalutOptions,
              key: PrivacyKeyEnum.PostWrite,
            },
          ];

        case strings.events:
          return [
            {
              question: strings.whoCanViewEventSection,
              options:
                entity.sport_type === Verbs.doubleSport
                  ? groupDefaultPrivacyOptionsForDoubleTeam
                  : groupPrivacyDefalutOptions,
              key: PrivacyKeyEnum.Events,
              subText: strings.whoCanViewClubEventSectionSubText,
            },
          ];

        case strings.galleryTitle:
          return [
            {
              question: strings.whoCanViewGallerySection,
              options:
                entity.sport_type === Verbs.doubleSport
                  ? groupDefaultPrivacyOptionsForDoubleTeam
                  : groupPrivacyDefalutOptions,
              key: PrivacyKeyEnum.Gallery,
            },
          ];

        case strings.membersTitle:
          return [
            {
              question: strings.whoCanJoinYourTeam,
              options: groupJoinOptions,
              key: PrivacyKeyEnum.JoinAsMember,
            },
            {
              question: strings.whoCanInvitePersonToJoinYourTeam,
              options:
                entity.sport_type === Verbs.doubleSport
                  ? groupInviteToJoinOptions
                  : groupInviteToJoinForTeamSportOptions,

              key: PrivacyKeyEnum.InvitePersonToJoinGroup,
            },
            {
              question: strings.whoCanViewYourTeamMembers,
              options: groupDefaultPrivacyOptionsForDoubleTeam,
              key: PrivacyKeyEnum.ViewYourGroupMembers,
            },
          ];

        case strings.clubAndLeague:
          return [
            {
              question: strings.doYouAllowClubToInviteYouToJoinClub,
              options: binaryPrivacyOptions,
              key: PrivacyKeyEnum.InviteForClub,
            },
            {
              question: strings.doYouAllLeaguesToInviteYouToJoinLeagues,
              options: binaryPrivacyOptions,
              key: PrivacyKeyEnum.InviteForLeague,
            },
          ];

        case strings.followerText:
          return [
            {
              question: strings.whoCanFollowYourTeam,
              options: followerFollowingOptions,
              key: PrivacyKeyEnum.Follow,
            },
            {
              question: strings.whoCanSeeTeamFollowers,
              options:
                entity.sport_type === Verbs.doubleSport
                  ? groupDefaultPrivacyOptionsForDoubleTeam
                  : groupPrivacyDefalutOptions,
              key: PrivacyKeyEnum.Followers,
            },
          ];

        case strings.chatsTitle:
          return [
            {
              question: strings.whoCanInviteYourTeamToChat,
              options: teamChatPrivacyOptions,
              key: PrivacyKeyEnum.Chats,
            },
          ];

        case strings.tag:
          return [
            {
              question: strings.whocantagpostcommentorreply,
              options:
                entity.sport_type === Verbs.doubleSport
                  ? groupDefaultPrivacyOptionsForDoubleTeam
                  : groupPrivacyDefalutOptions,
              key: PrivacyKeyEnum.Tag,
            },
          ];

        default:
          return [];
      }
    }

    if (entity.entity_type === Verbs.entityTypeClub) {
      switch (option) {
        case strings.postTitle:
          return [
            {
              question: strings.whoCanViewPostsInClubProfile,
              options: defaultClubPrivacyOptions,
              key: PrivacyKeyEnum.Posts,
            },
            {
              question: strings.whoCanWritePostsInClubProfile,
              options: defaultClubPrivacyOptions,
              key: PrivacyKeyEnum.PostWrite,
              subText: strings.writePostInClubProfileSubText,
            },
          ];

        case strings.events:
          return [
            {
              question: strings.whoCanViewClubEventSection,
              options: defaultClubPrivacyOptions,
              key: PrivacyKeyEnum.Events,
              subText: strings.whoCanViewClubEventSectionSubText,
            },
          ];

        case strings.galleryTitle:
          return [
            {
              question: strings.whoCanViewClubGallerySection,
              options: defaultClubPrivacyOptions,
              key: PrivacyKeyEnum.Gallery,
            },
          ];

        case strings.membersTitle:
          return [
            {
              question: strings.whoCanJoinYourClub,
              options: groupJoinOptions,
              key: PrivacyKeyEnum.JoinAsMember,
            },
            {
              question: strings.whoCanInviteToJoinClub,
              options: inviteToJoinClubOptions,
              key: PrivacyKeyEnum.InvitePersonToJoinGroup,
            },
            {
              question: strings.whoCanViewClubMembers,
              options: defaultClubPrivacyOptions,
              key: PrivacyKeyEnum.ViewYourGroupMembers,
            },
          ];

        case strings.team:
          return [
            {
              question: strings.whatTeamCanJoinClub,
              options: teamJoinClubOptions,
              key: PrivacyKeyEnum.TeamJoinClub,
            },
          ];

        case strings.followerText:
          return [
            {
              question: strings.whoCanFollowYourClub,
              options: followerFollowingOptions,
              key: PrivacyKeyEnum.Follow,
            },
            {
              question: strings.whoCanViewClubFollowers,
              options: defaultClubPrivacyOptions,
              key: PrivacyKeyEnum.Followers,
            },
          ];

        case strings.chatsTitle:
          return [
            {
              question: strings.whoCanInviteClubToChat,
              options: clubChatPrivacyOptions,
              key: PrivacyKeyEnum.Chats,
            },
          ];

        case strings.tag:
          return [
            {
              question: strings.whoCanTagClub,
              options: defaultClubPrivacyOptions,
              key: PrivacyKeyEnum.Tag,
            },
          ];

        default:
          return [];
      }
    }

    return [];
  };

  const handleOptions = (option = '') => {
    if (option === strings.blocked) {
      return;
    }

    const routeParams = {
      headerTitle: option,
      privacyOptions: [],
      entityType: authContext.entity.role,
    };
    routeParams.privacyOptions = getQuestionAndOptions(option);
    navigation.navigate('PrivacyOptionsScreen', {...routeParams});
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.privacyText}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
      />
      <View style={{paddingTop: 20, paddingHorizontal: 15}}>
        <FlatList
          data={menuOptions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <>
              <TouchableOpacity
                style={styles.listContainer}
                onPress={() => {
                  handleOptions(item);
                }}>
                <View style={{flex: 1}}>
                  <Text style={styles.listItems}>{item}</Text>
                </View>

                <Image source={images.nextArrow} style={styles.nextArrow} />
              </TouchableOpacity>
              <View style={styles.separatorLine} />
            </>
          )}
        />
      </View>
    </SafeAreaView>
  );
};
export default GroupPrivacyScreen;

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
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
    resizeMode: 'contain',
  },
  separatorLine: {
    height: 1,
    marginVertical: 15,
    backgroundColor: colors.grayBackgroundColor,
  },
});
