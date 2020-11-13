import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet, Image, FlatList, TouchableOpacity, Alert,
} from 'react-native';

import QB from 'quickblox-react-native-sdk';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import { QBleaveDialog } from '../../utils/QuickBlox';
import * as Utility from '../../utils';

const MessageInviteeDrawerScreen = ({
  navigation,
  participants = [],
  dialog = null,
}) => {
  const [myUserId, setMyUserId] = useState(null);
  useEffect(() => {
    const getUser = async () => {
      const entity = await Utility.getStorage('loggedInEntity');
      setMyUserId(entity.QB.id);
    }
    getUser();
  }, []);

  const inviteButton = () => (
    <View>
      {dialog?.userId === myUserId && (
        <TouchableOpacity style={styles.rowContainer} onPress={() => navigation.replace('MessageInviteScreen', {
          dialog,
          selectedInvitees: participants?.[0],
          participants: participants?.[0],
        })}>
          <Image style={ styles.inviteImage } source={ images.plus_round_orange } />
          <Text style={[styles.rowText, { color: colors.orangeColor }]}>Invite</Text>
        </TouchableOpacity>
      )}
    </View>
  )

  const renderRow = ({ item }) => {
    const customData = JSON.parse(item?.customData);
    const fullImage = customData?.full_image ?? '';
    const finalImage = fullImage ? { uri: fullImage } : images.profilePlaceHolder;
    return (
      <View style={styles.rowContainer}>
        <Image style={styles.inviteImage} source={finalImage}/>
        <Text style={styles.rowText}>{customData?.full_name}</Text>
      </View>)
  }
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
  if (dialog?.type === QB.chat.DIALOG_TYPE.CHAT) {
    fullName = dialog?.name.slice(2, dialog?.name?.length)
  }
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.viewContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.titleLabel}>
            {dialog?.type === QB.chat.DIALOG_TYPE.GROUP_CHAT && 'Chatroom Name'}
          </Text>
          <Text style={[styles.title, { marginLeft: wp(3) }]}>
            {fullName}
          </Text>
          <View style={styles.separator}/>
          <Text style={styles.titleLabel}>Participants</Text>
          {dialog?.type === QB.chat.DIALOG_TYPE.GROUP_CHAT && inviteButton()}
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
    fontFamily: fonts.LRegular,
    color: colors.lightBlackColor,
  },
  title: {
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
