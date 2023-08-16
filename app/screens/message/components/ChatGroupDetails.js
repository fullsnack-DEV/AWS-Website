// @flow
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {strings} from '../../../../Localization/translation';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import GroupIcon from '../../../components/GroupIcon';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {ModalTypes} from '../../../Constants/GeneralConstants';
import images from '../../../Constants/ImagePath';
import Verbs from '../../../Constants/Verbs';
import {getChannelMembers, getChannelName} from '../../../utils/streamChat';
import CustomAvatar from './CustomAvatar';
import InviteModal from './InviteModal';
import UpdateChannelInfo from './UpdateChannelInfo';
import useStreamChatUtils from '../../../hooks/useStreamChatUtils';

const ChatGroupDetails = ({
  isVisible = false,
  closeModal = () => {},
  channel = {},
  streamUserId = '',
  leaveChannel = () => {},
}) => {
  const [members, setMembers] = useState([]);
  const [showUpdateInfoModal, setShowUpdateInfoModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isChannelOwner, setIsChannelOwner] = useState(false);
  const {addMembersToChannel, isMemberAdding} = useStreamChatUtils();

  useEffect(() => {
    if (isVisible) {
      const list = getChannelMembers(channel);
      setMembers(list);
    }
  }, [isVisible, channel]);

  useEffect(() => {
    if (channel.state.members) {
      const userData = channel.state.members[streamUserId];

      if (userData) {
        setIsChannelOwner(userData.role === 'owner');
      }
    }
  }, [channel.state.members, streamUserId]);

  const getIconUrl = (item) => {
    if (item.members?.length === 1) {
      return {
        url: item.members[0].user.image ?? '',
        entityType: item.members[0].user.entityType,
      };
    }
    return {url: '', entityType: Verbs.entityTypeTeam};
  };

  const handleLeaveChat = () => {
    Alert.alert(
      Platform.OS === 'android' ? '' : strings.leaveChatAlertText,
      Platform.OS === 'android' ? strings.leaveChatAlertText : '',
      [
        {
          text: strings.cancel,
          style: 'cancel',
        },
        {
          text: strings.leave,
          style: 'destructive',
          onPress: leaveChannel,
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={closeModal}
      modalType={ModalTypes.style2}
      containerStyle={{height: '98%'}}>
      <ActivityLoader visible={isMemberAdding} />

      {channel.data?.group_type === Verbs.channelTypeGeneral ||
      channel.data?.channel_type === Verbs.channelTypeAuto ? (
        <>
          <Text style={[styles.sectionTitle, {marginBottom: 10}]}>
            {strings.chatroomName.toUpperCase()}
          </Text>
          <TouchableOpacity
            style={[styles.row, {justifyContent: 'space-between'}]}
            onPress={() =>
              isChannelOwner ? setShowUpdateInfoModal(true) : {}
            }>
            <View style={[styles.row, {flex: 1}]}>
              <View style={{marginRight: 10}}>
                <CustomAvatar
                  channel={channel}
                  imageStyle={{width: 30, height: 30}}
                  placeHolderStyle={{width: 8, height: 8}}
                  iconTextStyle={{fontSize: 10, marginTop: 1}}
                />
              </View>

              <View style={{flex: 1}}>
                <Text style={styles.channelName} numberOfLines={1}>
                  {getChannelName(channel, streamUserId)}
                </Text>
              </View>
            </View>
            {channel.data?.channel_type !== Verbs.channelTypeAuto &&
            isChannelOwner ? (
              <View style={styles.iconContainer}>
                <Image source={images.nextArrow} style={styles.icon} />
              </View>
            ) : null}
          </TouchableOpacity>
          <View style={styles.separator} />
        </>
      ) : null}

      <Text style={[styles.sectionTitle, {marginBottom: 15}]}>
        {strings.participants}
      </Text>
      <FlatList
        data={members}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => {
          const obj = getIconUrl(item);

          return (
            <View style={styles.listItem}>
              <GroupIcon
                imageUrl={obj.url}
                groupName={item.memberName}
                entityType={obj.entityType}
                containerStyle={styles.listIcon}
                showPlaceholder={false}
                textstyle={{fontSize: 10, marginTop: 2}}
              />
              <Text style={styles.listText}>{item.memberName}</Text>
            </View>
          );
        }}
        ListHeaderComponent={() =>
          channel.data?.channel_type !== Verbs.channelTypeAuto &&
          members.length !== 1 ? (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => setShowInviteModal(true)}>
              <View style={styles.addIconContainer}>
                <Image
                  source={images.plus_round_orange}
                  style={styles.addIcon}
                />
              </View>
              <Text style={[styles.listText, {color: colors.tabFontColor}]}>
                {strings.invite}
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />
      {channel.data?.channel_type !== Verbs.channelTypeAuto ? (
        <TouchableOpacity
          style={styles.bottomContainer}
          onPress={handleLeaveChat}>
          <View
            style={[styles.iconContainer, {marginLeft: 0, marginRight: 10}]}>
            <Image source={images.leave_chat_room} style={styles.icon} />
          </View>
          <Text style={styles.buttonText}>{strings.leaveChatRoom}</Text>
        </TouchableOpacity>
      ) : null}

      <UpdateChannelInfo
        isVisible={showUpdateInfoModal}
        closeModal={() => setShowUpdateInfoModal(false)}
        channel={channel}
      />

      <InviteModal
        isVisible={showInviteModal}
        closeModal={() => setShowInviteModal(false)}
        members={members}
        addMembers={(memberList) => {
          setShowInviteModal(false);

          addMembersToChannel({channel, newMembers: memberList})
            .then(() => {
              const list = getChannelMembers(channel);
              setMembers(list);
            })
            .catch((err) => {
              Alert.alert(strings.alertmessagetitle, err.message);
            });
        }}
      />
    </CustomModalWrapper>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelName: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  iconContainer: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  separator: {
    height: 1,
    marginVertical: 25,
    backgroundColor: colors.writePostSepratorColor,
  },
  bottomContainer: {
    width: Dimensions.get('window').width,
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    padding: 25,
    backgroundColor: colors.lightGrayBackground,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  listItem: {
    paddingHorizontal: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  listIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  addIconContainer: {
    width: 25,
    height: 25,
    marginRight: 10,
    alignItems: 'center',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.tabFontColor,
  },
  addIcon: {
    width: '100%',
    height: '100%',
    tintColor: colors.tabFontColor,
    resizeMode: 'contain',
  },
});
export default ChatGroupDetails;
