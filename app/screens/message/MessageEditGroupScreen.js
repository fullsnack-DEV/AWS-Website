import React, {
 useState, useEffect, useMemo, useCallback,
} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Header from '../../components/Home/Header';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils';
import { QBupdateDialog } from '../../utils/QuickBlox';
import TCInputBox from '../../components/TCInputBox';

const MessageEditGroupScreen = ({ route, navigation }) => {
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    if (route?.params?.dialog) {
      setGroupName(route?.params?.dialog?.name)
    }
  }, [])

  const onDonePress = useCallback(() => {
    if (groupName !== '') {
      if (route?.params?.dialog) {
        const dialogId = route?.params?.dialog?.id;

        QBupdateDialog(dialogId, [], [], groupName).then((res) => {
          route.params.onPressDone({ dialog: res });
          navigation.goBack();
        }).catch((error) => {
          console.log(error);
        })
      }
    } else {
      Alert.alert('Enter Chatroom Name')
    }
  }, [groupName, navigation, route?.params?.dialog])

  const renderHeader = useMemo(() => (
    <Header
          leftComponent={
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FastImage resizeMode={'contain'} source={images.backArrow} style={styles.backImageStyle}/>
            </TouchableOpacity>
          }
          centerComponent={
            <Text style={styles.eventTitleTextStyle}>Message</Text>
          }
          rightComponent={
            <TouchableOpacity style={{ padding: 2 }} onPress={onDonePress}>
              <Text style={styles.eventTextStyle}>Done</Text>
            </TouchableOpacity>
          }
      />
  ), [navigation, onDonePress])

  return (
    <SafeAreaView style={styles.mainContainer}>
      {renderHeader}
      <View style={styles.separateLine}/>
      <View style={styles.avatarContainer}>
        <TouchableOpacity>
          <FastImage
            resizeMode={'contain'}
            source={images.groupUsers}
            style={styles.imageContainer}
          />
          <FastImage
            resizeMode={'contain'}
            source={images.certificateUpload}
            style={styles.absoluteCameraIcon}
          />
        </TouchableOpacity>
        <View style={styles.inputBoxContainer}>
          <Text style={styles.chatRoomName}>Chatroom Name</Text>
          <TCInputBox placeHolderText={'New Group'} value={groupName} onChangeText={setGroupName}/>
        </View>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backImageStyle: {
    height: 20,
    width: 16,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  eventTitleTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
  eventTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    alignSelf: 'center',
  },

  imageContainer: {
    height: 80,
    width: 80,
    borderRadius: wp(6),
  },
  separateLine: {
    borderColor: colors.grayColor,
    borderWidth: 0.5,
    width: wp(100),
    marginBottom: hp(2),
  },
  avatarContainer: {
    // backgroundColor: 'red',
    height: hp(30),
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(100),
  },
  absoluteCameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 0,
    height: wp(5),
    width: wp(5),
  },
  inputBoxContainer: {
    marginTop: hp(5),
  },
  chatRoomName: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    marginBottom: 10,
  },
});
export default MessageEditGroupScreen;
