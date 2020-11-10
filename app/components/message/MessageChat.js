import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Platform,
  StyleSheet,
  NativeEventEmitter,
  TouchableOpacity,
  Image, Text,
  SafeAreaView,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';

import QB from 'quickblox-react-native-sdk';
import LinearGradient from 'react-native-linear-gradient';
import { normalize } from 'react-native-elements';
import ActivityLoader from '../loader/ActivityLoader';
import Header from '../Home/Header';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCInputBox from '../TCInputBox';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../utils';
import TCMessage from '../TCMessage';
import * as Utility from '../../utils';
import {
  QB_DIALOG_TYPE, QBgetMessages, QBgetUserDetail, QBsendMessage,
} from '../../utils/QuickBlox';

const QbMessageEmitter = new NativeEventEmitter(QB.chat)

const GradiantContainer = ({ style, ...props }) => (
  <LinearGradient
    style={style}
    colors={ [colors.yellowColor, colors.themeColor] }>
    {props.children}
  </LinearGradient>
)

const MessageChat = ({
  route,
  navigation,
}) => {
  const {
    id: dialogId,
    name: headingTitle,
    occupantsIds,
  } = route.params.dialog
  const chatType = occupantsIds.length > 2 ? QB_DIALOG_TYPE.GROUP : QB_DIALOG_TYPE.SINGLE
  const [myUserId, setMyUserId] = useState();
  const [loading, setLoading] = useState(false);
  const [messageBody, setMessageBody] = useState('');
  const [savedMessagesData, setSavedMessagesData] = useState([]);
  const [occupantsData, setOccupantsData] = useState([]);
  const scrollRef = useRef(null);
  const refSavedMessagesData = useRef(savedMessagesData);

  const newMessageHandler = (event) => {
    const {
      type,
      payload,
    } = event
    if (type === QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE) {
      if (payload.dialogId === dialogId) {
        let messages = refSavedMessagesData.current || [];
        if (messages.filter((item) => item.id === payload.id).length === 0) {
          messages = [...messages, payload]
          refSavedMessagesData.current = messages
          setSavedMessagesData(messages);
        }
      }
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const entity = await Utility.getStorage('loggedInEntity');
      setMyUserId(entity.QB.id);
      await getMessages();
    }
    getUser();
    QBgetUserDetail(
      QB.users.USERS_FILTER.FIELD.ID,
      QB.users.USERS_FILTER.TYPE.NUMBER,
      occupantsIds.join(),
    ).then((res) => {
      setOccupantsData(res.users);
    }).catch((e) => {
      console.log(e);
    })
    if (chatType === QB_DIALOG_TYPE.GROUP) QB.chat.joinDialog({ dialogId });
    QbMessageEmitter.addListener(
      QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE,
      newMessageHandler,
    )

    return () => {
      QbMessageEmitter.removeListener(QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE)
    }
  }, [])

  const getMessages = async () => {
    try {
      setLoading(true);
      const response = await QBgetMessages(dialogId);
      if (response) {
        refSavedMessagesData.current = response.message
        setSavedMessagesData(response.message);
        // setHasMore(response.messages.length === response.limit);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const renderMessages = ({ item, index }) => {
    const type = item.senderId === myUserId ? 'sender' : 'receiver';
    const userData = occupantsData && occupantsData.filter((oItem) => oItem.id === item.senderId);
    let isReceiver = index === 0 && item.senderId !== myUserId;
    if (!isReceiver) isReceiver = index > 0 && savedMessagesData[index - 1].senderId !== item.senderId && item.senderId !== myUserId;
    return (
      <View key={index} style={{
        flex: 1,
        alignSelf: type === 'sender' ? 'flex-end' : 'flex-start',
      }}>
        {isReceiver && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp(1) }}>
            <View style={{ ...styles.avatarContainer }}>
              <Text style={styles.avatarContainerText}>
                {
                  userData
                  && userData[0]
                    ? userData[0].fullName[0].toUpperCase()
                    : headingTitle[0].toUpperCase()
                }
              </Text>
            </View>
            <Text style={{
              color: colors.userPostTimeColor,
              fontFamily: fonts.RRegular,
              fontSize: normalize(12),
              marginLeft: wp(1),
            }}>
              {/* eslint-disable-next-line no-mixed-operators */}
              {userData
              && userData[0]
                ? userData[0].fullName
                : headingTitle}
            </Text>
          </View>
        )}

        <TCMessage
          attachments={item.attachments}
          date={new Date(item.dateSent)}
          body={item.body}
          type={type}
          messageStyle={{ paddingLeft: type === 'receiver' ? wp(10) : 0 }}/>
      </View>
    )
  }

  const sendMessage = () => {
    QBsendMessage(dialogId, messageBody).then(() => {
      setMessageBody('');
    })
  }

  const onInputBoxFocus = () => {
    if (scrollRef && scrollRef.current) scrollRef.current.scrollToEnd({ animated: false });
  }
  return (
    <SafeAreaView style={ styles.mainContainer }>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack() }>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTextStyle}>{headingTitle}</Text>
        }
        rightComponent={
          <TouchableOpacity style={{ padding: 2 }} onPress={() => {
            navigation.openDrawer()
            navigation.setParams({ participants: [occupantsData] })
          }}>
            <Image source={images.threeDotIcon} style={styles.rightImageStyle} />
          </TouchableOpacity>
        }
      />
      <ActivityLoader visible={loading} />
      <View style={ styles.sperateLine } />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList
            onContentSizeChange={() => scrollRef && scrollRef.current && scrollRef.current.scrollToEnd()}
            ref={scrollRef}
            extraData={savedMessagesData}
            style={styles.messageViewContainer}
            contentContainerStyle={styles.messageContentView}
            data={savedMessagesData}
            renderItem={renderMessages}
            ListEmptyComponent={() => <Text style={styles.noMessagesText}>No Messages</Text>}
        />
        <View style={styles.bottomTextInputContainer}>
          <Image source={images.messageCamera} style={styles.sideButton} />
          <TCInputBox
            onFocus={onInputBoxFocus}
            value={messageBody}
            placeHolderText={'Type a message'}
            onChangeText={(text) => setMessageBody(text)}
            style={{ flex: 1 }}
          />
          <TouchableOpacity onPress={sendMessage}>
            <GradiantContainer style={styles.sendButtonContainer}>
              <Image source={images.sendButton} style={styles.sendButton} />
            </GradiantContainer>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  sperateLine: {
    borderColor: colors.grayColor,
    borderWidth: 0.5,
    width: wp(100),
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
  sideButton: {
    flex: 0.1,
    marginHorizontal: wp(2),
    resizeMode: 'contain',
  },
  sendButtonContainer: {
    height: wp(10),
    width: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    borderRadius: wp(5),
  },
  sendButton: {
    height: wp(5),
    width: wp(5),
    resizeMode: 'contain',
  },
  eventTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
  bottomTextInputContainer: {
    backgroundColor: colors.whiteColor,
    flexDirection: 'row',
    width: wp(100),
    height: hp(8),
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    left: 0,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
  },
  messageViewContainer: {
    paddingHorizontal: wp(3),
    backgroundColor: colors.whiteColor,
    width: wp(100),
    height: hp(70),
  },
  messageContentView: {
    marginBottom: hp(2),
  },
  avatarContainer: {
    width: wp(10),
    height: wp(10),
    padding: wp(1),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(5),
    backgroundColor: colors.writePostSepratorColor,
  },
  avatarContainerText: {
    color: colors.blackColor,
    fontSize: normalize(12),
    fontFamily: fonts.RBold,
    textAlign: 'center',
  },
  noMessagesText: {
    padding: wp(5),
    textAlign: 'center',
    fontFamily: fonts.RLight,
  },
});

export default MessageChat;
