import React, {
  useEffect, useState, useContext, useCallback, useMemo,
} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet, Image, FlatList, Alert,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import QB from 'quickblox-react-native-sdk';
import FastImage from 'react-native-fast-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import AuthContext from '../../auth/context'
import { QBleaveDialog } from '../../utils/QuickBlox';

const MessageInviteeDrawerScreen = ({
  navigation,
  participants = [],
  dialog = null,
}) => {
  const authContext = useContext(AuthContext)
  const [myUserId, setMyUserId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      setMyUserId(authContext.entity.QB.id);
    }
    getUser();
  }, []);

  const inviteButton = useMemo(() => dialog?.type === QB.chat.DIALOG_TYPE.GROUP_CHAT && (
    <View>
      {dialog?.userId === myUserId && (
        <TouchableOpacity style={styles.rowContainer} onPress={() => navigation.replace('MessageInviteScreen', {
          dialog,
          isAdmin: dialog?.userId === myUserId,
          selectedInvitees: participants?.[0],
          participants: participants?.[0],
        })}>
          <Image style={ styles.inviteImage } source={ images.plus_round_orange } />
          <Text style={[styles.rowText, { color: colors.orangeColor }]}>Invite</Text>
        </TouchableOpacity>
       )}
    </View>
  ), [dialog, myUserId, navigation, participants])

  const onParticipantsPress = useCallback((userData) => {
    const uid = userData?.entity_type === 'player' ? userData?.user_id : userData?.group_id;
    if (uid && userData?.entity_type) {
      navigation.closeDrawer();
      navigation.push('HomeScreen', {
        uid,
        backButtonVisible: true,
        role: userData.entity_type === 'player' ? 'user' : userData?.entity_type,
        menuBtnVisible: false,
      })
    }
  }, [navigation])

  const renderRow = useCallback(({ item }) => {
    const customData = JSON.parse(item?.customData);
    const fullImage = customData?.full_image ?? '';
    const finalImage = fullImage ? { uri: fullImage } : images.profilePlaceHolder;
    return (
      <TouchableOpacity style={styles.rowContainer} onPress={() => onParticipantsPress(customData)}>
        <Image style={styles.inviteImage} source={finalImage}/>
        <Text style={styles.rowText}>{customData?.full_name}</Text>
      </TouchableOpacity>)
  }, [onParticipantsPress])

  const leaveRoom = () => {
    const okPress = () => {
      QBleaveDialog(dialog?.id).then(() => {
        navigation.closeDrawer();
        navigation.goBack();
      }).catch((error) => {
        console.log(error)
      })
    }
    Alert.alert(
      '',
      'Are you sure you want to \n'
        + 'Leave this chatroom?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Leave', onPress: () => okPress(), style: 'destructive' },
      ],
      { cancelable: false },
    );
  }
  let fullName = dialog?.name;
  if (dialog?.dialogType === QB.chat.DIALOG_TYPE.CHAT) {
    fullName = dialog?.name.slice(2, dialog?.name?.length)
  }

  const onPressDone = ({ dialog: newDialog }) => {
    navigation.setParams({ dialog: newDialog })
  }
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.viewContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.titleLabel}>
            {dialog?.type === QB.chat.DIALOG_TYPE.GROUP_CHAT && 'Chatroom Name'}
          </Text>
          <TouchableOpacity onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('MessageEditGroupScreen', { dialog, onPressDone })
          }} >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[styles.title, { marginLeft: wp(3) }]}>
                {fullName}
              </Text>
              {dialog?.type === QB.chat.DIALOG_TYPE.GROUP_CHAT && (
                <FastImage
                      resizeMode={'contain'}
                      source={images.arrowDown}
                      style={{
                        ...styles.downArrow,
                        transform: [{ rotateZ: '270deg' }],
                      }}
                />

            )}
            </View>
          </TouchableOpacity>
          <View style={styles.separator}/>
          <Text style={styles.titleLabel}>Participants</Text>
          {inviteButton}
          <FlatList
                data={participants[0]}
                renderItem={renderRow}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
            />
        </View>
        <TouchableOpacity style={styles.bottomView} onPress={leaveRoom}>
          <Image style={ styles.inviteImage } source={ images.leave_chat_room } />
          <Text style={styles.grayText}>LEAVE CHAT ROOM</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  viewContainer: {
    flex: 1,
    marginRight: wp(1),
    marginLeft: wp(7),
    marginVertical: hp(1),
  },
  titleLabel: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  downArrow: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
    tintColor: colors.grayColor,
  },
  title: {
    width: '80%',
    marginTop: hp(1),
    fontSize: 20,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(2),
    marginLeft: wp(3),
  },
  rowText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: wp(3),
  },
  inviteImage: {
    borderRadius: 25,
    height: wp(6),
    width: wp(6),
  },
  grayText: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    color: colors.userPostTimeColor,
  },
  bottomView: {
    flexDirection: 'row', alignItems: 'center',
  },
  separator: {
    backgroundColor: '#707070',
    height: 1,
    marginTop: hp(2),
    marginLeft: wp(2),
    marginBottom: hp(3),
  },
});

export default MessageInviteeDrawerScreen;
