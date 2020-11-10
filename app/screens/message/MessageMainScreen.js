import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  NativeEventEmitter,
  TouchableOpacity,
  Text,
  SafeAreaView, ScrollView, Alert,
} from 'react-native';

import QB from 'quickblox-react-native-sdk';
import { useIsFocused } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import ActivityLoader from '../../components/loader/ActivityLoader';
import TCHorizontalMessageOverview from '../../components/TCHorizontalMessageOverview';
import Header from '../../components/Home/Header';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCSearchBox from '../../components/TCSearchBox';
import {
  QBChatConnected, QBgetDialogs, QBsetupSettings,
} from '../../utils/QuickBlox';
import * as Utility from '../../utils';
import { QB_Auth_Password } from '../../utils/constant';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../utils';

const QbMessageEmitter = new NativeEventEmitter(QB.chat)

const MessageMainScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [savedDialogsData, setSavedDialogsData] = useState({
    append: {},
    dialogs: [],
    limit: 30,
    skip: 0,
    total: 0,
  });
  const isFocused = useIsFocused();

  useEffect(() => {
    connectAndSubscribe();
    QbMessageEmitter.addListener(
      QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE,
      newDialogHandler,
    )
    return () => {
      QbMessageEmitter.removeListener(QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE);
    }
  }, [isFocused])

  const newDialogHandler = () => {
    getDialogs();
  }

  const getDialogs = async (request = {}) => {
    const savedDialog = await QBgetDialogs(request)
    setSavedDialogsData(savedDialog);
    setLoading(false);
  }

  const connectAndSubscribe = async () => {
    setLoading(true);
    const entity = await Utility.getStorage('loggedInEntity');
    const connected = await QBChatConnected();
    if (entity.QB) {
      const { id } = entity.QB
      if (!connected && !loading) {
        await QB.chat.connect({ userId: id, password: QB_Auth_Password })
          .then(async () => {
            setLoading(false);
          }).catch((error) => {
            console.log(error.message)
            setLoading(false);
          })
      }
      await QBsetupSettings();
      await getDialogs();
      setLoading(false);
    } else {
      Alert.alert('Quickblox Connection Error')
      setLoading(false);
    }
    setLoading(false);
  }
  const onDialogPress = (dialog) => {
    navigation.navigate('MessageChat', {
      screen: 'MessageChatRoom',
      params: { dialog },
    });
  }

  const renderAllMessages = () => (
    <ScrollView>
      {savedDialogsData
      && savedDialogsData.dialogs
      && savedDialogsData.dialogs.length > 0
      && savedDialogsData.dialogs.map((singleDialog) => (
        <TCHorizontalMessageOverview
            dialogType={singleDialog.type}
            onPress={() => onDialogPress(singleDialog)}
            key={singleDialog.id}
            title={singleDialog.name}
            subTitle={singleDialog.lastMessage}
            numberOfMembers={singleDialog.occupantsIds}
            lastMessageDate={new Date(singleDialog.lastMessageDateSent)}
            numberOfUnreadMessages={singleDialog.unreadMessagesCount}
          />
      ))}
    </ScrollView>
  )

  return (
    <SafeAreaView style={ styles.mainContainer }>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack() }>
            <FastImage source={images.backArrow} resizeMode={'contain'} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTextStyle}>Messages</Text>
        }
        rightComponent={
          <TouchableOpacity style={{ padding: 2 }} onPress={() => { navigation.navigate('MessageInviteScreen') }}>
            <FastImage source={images.plus} resizeMode={'contain'} style={styles.rightImageStyle} />
          </TouchableOpacity>
        }
      />
      <View style={styles.separateLine}/>
      <ActivityLoader visible={loading} />
      <TCSearchBox/>
      <View style={ styles.sperateLine } />
      {renderAllMessages()}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backImageStyle: {
    height: 20,
    width: 16,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  rightImageStyle: {
    height: 20,
    width: 16,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  eventTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
  separateLine: {
    borderColor: colors.grayColor,
    borderWidth: 0.5,
    width: wp(100),
    marginBottom: hp(2),
  },
});

export default MessageMainScreen;
