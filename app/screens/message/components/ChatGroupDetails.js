// @flow
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {FlatList} from 'react-native-gesture-handler';
import {strings} from '../../../../Localization/translation';
import GroupIcon from '../../../components/GroupIcon';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import Verbs from '../../../Constants/Verbs';
import {
  createStreamChatChannel,
  generateUUID,
  getChannelMembers,
  getChannelName,
} from '../../../utils/streamChat';
import CustomAvatar from './CustomAvatar';
import InviteModal from './InviteModal';
import UpdateChannelInfo from './UpdateChannelInfo';
import useStreamChatUtils from '../../../hooks/useStreamChatUtils';
import AuthContext from '../../../auth/context';

const ChatGroupDetails = ({
  // isVisible = false,
  closeModal = () => {},
  channel = {},
  streamUserId = '',
  leaveChannel = () => {},
  newChannelCreated = () => {},
  modalRef,
}) => {
  const [members, setMembers] = useState([]);
  const [showUpdateInfoModal, setShowUpdateInfoModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isChannelOwner, setIsChannelOwner] = useState(false);
  const {addMembersToChannel, isMemberAdding, fetchMembers} =
    useStreamChatUtils();
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if (isVisible) {
    const list = getChannelMembers(channel);
    setMembers(list);
    // }
  }, [channel]);

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

  const createNewChannel = async (memberList = []) => {
    setLoading(true);
    const newMembers = await fetchMembers(memberList, true);
    let oldMembers = [];
    members.forEach((item) => {
      const data = item.members.map((ele) => ({
        user_id: ele.user_id,
        channel_role: 'channel_moderator',
      }));
      oldMembers = [...oldMembers, ...data];
    });
    const channelMembers = [...newMembers, ...oldMembers];
    const channelId = generateUUID();
    const createdChannel = await createStreamChatChannel({
      authContext,
      channelId,
      members: channelMembers,
      groupType: Verbs.channelTypeGeneral,
    });

    setLoading(false);
    if (createdChannel !== null) {
      newChannelCreated(createdChannel);
    }
  };

  const handleAddMembers = (memberList = []) => {
    setShowInviteModal(false);

    if (members.length === 2) {
      createNewChannel(memberList);
    } else {
      addMembersToChannel({
        channel,
        newMembers: memberList,
        ownerName:
          authContext.entity.obj.group_name ?? authContext.entity.obj.full_name,
      })
        .then(() => {
          const list = getChannelMembers(channel);
          setMembers(list);
        })
        .catch((err) => {
          Alert.alert(strings.alertmessagetitle, err.message);
        });
    }
  };
  const layout = Dimensions.get('window');
  const snapPoints = useMemo(
    () => [layout.height - 40, layout.height - 40],
    [layout],
  );

  const renderBackdrop = (props) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={1}
      style={{
        backgroundColor: colors.modalBackgroundColor,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
      opacity={6}
    />
  );

  return (
    <>
      <BottomSheetModalProvider>
        <BottomSheetModal
          onDismiss={closeModal}
          ref={modalRef}
          backgroundStyle={{
            borderRadius: 10,
          }}
          index={1}
          handleIndicatorStyle={{
            backgroundColor: colors.modalHandleColor,
            width: 40,
            height: 5,
            marginTop: 5,
            alignSelf: 'center',
            borderRadius: 5,
          }}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          enableDismissOnClose
          backdropComponent={renderBackdrop}>
          <View style={{paddingHorizontal: 25, paddingTop: 25, flex: 1}}>
            <ActivityLoader visible={isMemberAdding || loading} />
            {Platform.OS === 'android' && (
              <StatusBar
                backgroundColor={colors.modalBackgroundColor}
                barStyle="light-content"
              />
            )}
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
            <View style={{flex: 1, marginBottom: 70}}>
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
                          source={images.invitePlusIcon}
                          style={styles.addIcon}
                        />
                      </View>
                      <Text
                        style={[styles.listText, {color: colors.tabFontColor}]}>
                        {strings.invite}
                      </Text>
                    </TouchableOpacity>
                  ) : null
                }
              />
            </View>
            {channel.data?.channel_type !== Verbs.channelTypeAuto ? (
              <TouchableOpacity
                style={styles.bottomContainer}
                onPress={handleLeaveChat}>
                <View
                  style={[
                    styles.iconContainer,
                    {marginLeft: 0, marginRight: 10},
                  ]}>
                  <Image source={images.leave_chat_room} style={styles.icon} />
                </View>
                <Text style={styles.buttonText}>{strings.leaveChatRoom}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
      <UpdateChannelInfo
        isVisible={showUpdateInfoModal}
        closeModal={() => setShowUpdateInfoModal(false)}
        channel={channel}
      />

      <InviteModal
        isVisible={showInviteModal}
        closeModal={() => setShowInviteModal(false)}
        members={members}
        addMembers={handleAddMembers}
      />
    </>
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
    resizeMode: 'contain',
  },
});
export default ChatGroupDetails;
