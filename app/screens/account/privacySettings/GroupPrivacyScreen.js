import {useContext, useEffect} from 'react';
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
import ScreenHeader from '../../../components/ScreenHeader';
import {strings} from '../../../../Localization/translation';
import images from '../../../Constants/ImagePath';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import {
  GroupPrivacySettingsOptions,
  PrivacyKeyEnum,
  groupDefaultPrivacyOptionsForDoubleTeam,
  groupMemberInvitePersonJoinTeam,
  groupMemberJoinTeam,
  groupMembersSportdefaultOptions,
  groupPrivacyDefalutOptions,
  inviteToEventOptions,
  inviteToGroupOptions,
} from '../../../Constants/PrivacyOptionsConstant';

import Verbs from '../../../Constants/Verbs';
import AuthContext from '../../../auth/context';

const GroupPrivacyScreen = ({navigation}) => {
  const authContext = useContext(AuthContext);

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
            subText: strings.eventsPrivacySubText,
            options:
              entity.sport_type === Verbs.doubleSport
                ? groupDefaultPrivacyOptionsForDoubleTeam
                : groupPrivacyDefalutOptions,
            key: PrivacyKeyEnum.Events,
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
            question: strings.whoCanJoinTeam,
            options: groupMemberJoinTeam,
            key: PrivacyKeyEnum.MemberToJoinTeam,
          },
          {
            question: strings.whoCanInvitePersonToJoinYourTeam,
            options: groupMemberInvitePersonJoinTeam,
            key: PrivacyKeyEnum.InvitePersonToJoinTeam,
          },
          {
            question: strings.whoCanViewYourTeamMembers,
            options: groupMembersSportdefaultOptions,
            key: PrivacyKeyEnum.ViewYourTeamMembers,
          },
        ];

      case strings.followerTitleText:
        return [
          {
            question: strings.whoCanFollowYourTeam,
            options: groupPrivacyDefalutOptions,
            key: PrivacyKeyEnum.Followers,
          },
        ];

      case strings.chatsTitle:
        return [
          {
            question: strings.whoCanInviteYourTeamToChat,
            options: groupPrivacyDefalutOptions,
            key: PrivacyKeyEnum.Chats,
          },
        ];

      case strings.tag:
        return [
          {
            question: strings.whoCanTagYourTeamOnPostCommentOrReply,
            options: groupPrivacyDefalutOptions,
            key: PrivacyKeyEnum.Tag,
          },
        ];
      case strings.invite:
        return [
          {
            question: strings.whoCanInviteYouToJoinGroup,
            options: inviteToGroupOptions,
            key: PrivacyKeyEnum.InviteToJoinGroup,
          },
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

  const handleOptions = (option = '') => {
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
          data={GroupPrivacySettingsOptions}
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
