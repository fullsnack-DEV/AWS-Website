import React, {
  useLayoutEffect,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Alert,
  Pressable,
  Image,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';

import {format} from 'react-string-format';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCSearchBox from '../../../components/TCSearchBox';
import AuthContext from '../../../auth/context';
import TCThinDivider from '../../../components/TCThinDivider';
import {getGroupMembers, sendBasicInfoRequest} from '../../../api/Groups';
import MemberProfile from '../../../components/groupConnections/MemberProfile';
import {getHitSlop, getStorage, setStorage, showAlert} from '../../../utils';
import TCProfileTag from '../../../components/TCProfileTag';
import images from '../../../Constants/ImagePath';

export default function RequestMultipleBasicInfoScreen({navigation, route}) {
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);
  const [players, setPlayers] = useState([]);
  const [searchPlayers, setSearchPlayers] = useState([]);

  const [selectedList, setSelectedList] = useState([]);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const selectedPlayers = [];
  useEffect(() => {
    setloading(true);

    getGroupMembers(route.params?.groupID, authContext)
      .then((response) => {
        setloading(false);
        const result = response.payload.map((obj) => {
          // eslint-disable-next-line no-param-reassign
          obj.isChecked = false;
          return obj;
        });
        setPlayers(result);
        setSearchPlayers(result);
        setTimeout(() => {
          getStorage('showPopup').then((isShow) => {
            if (isShow || isShow === null) {
              setIsInfoModalVisible(true);
            } else {
              setIsInfoModalVisible(false);
            }
          });
        }, 1000);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.sendButtonStyle}
          onPress={() => sendRequestForBasicInfo()}>
          {strings.send}
        </Text>
      ),
    });
  }, [navigation, selectedList, searchPlayers, isInfoModalVisible, showCheck]);

  const selectPlayer = ({item, index}) => {
    players[index].isChecked = !item.isChecked;
    players.map((obj) => {
      if (obj.isChecked) {
        selectedPlayers.push(obj.user_id);
      }
      return obj;
    });
    setSelectedList(selectedPlayers);
  };

  const renderPlayer = ({item, index}) => (
    <MemberProfile
      playerDetail={item}
      isChecked={item.isChecked}
      onPress={() => selectPlayer({item, index})}
    />
  );
  const handleTagPress = ({index}) => {
    players[index].isChecked = false;
    setPlayers([...players]);
    players.map((obj) => {
      if (obj.isChecked) {
        selectedPlayers.push(obj.user_id);
      }
      return obj;
    });
  };

  const listEmptyComponent = () => (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text
        style={{
          fontFamily: fonts.RRegular,
          color: colors.grayColor,
          fontSize: 26,
        }}>
        {strings.noPlayer}
      </Text>
    </View>
  );

  const ItemSeparatorComponent = useCallback(() => <TCThinDivider />, []);
  const searchFilterFunction = (text) => {
    const result = players.filter(
      (x) =>
        x?.first_name?.toLowerCase().includes(text.toLowerCase()) ||
        x?.last_name?.toLowerCase().includes(text.toLowerCase()),
    );
    if (text.length > 0) {
      setPlayers(result);
    } else {
      setPlayers(searchPlayers);
    }
  };

  const sendRequestForBasicInfo = () => {
    if (selectedList.length > 0) {
      setloading(true);

      sendBasicInfoRequest(route?.params?.groupID, selectedList, authContext)
        .then(() => {
          setloading(false);

          setTimeout(() => {
            showAlert(
              format(strings.multipleRequestSent, selectedList?.length),
              () => {
                navigation.goBack();
              },
            );
          }, 10);
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    } else {
      Alert.alert(strings.alertmessagetitle, strings.selectmemberValidation);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <View style={{marginTop: 10}}>
        <TCSearchBox
          width={'90%'}
          alignSelf="center"
          onChangeText={(text) => {
            searchFilterFunction(text);
          }}
        />
      </View>
      <TCProfileTag dataSource={players} onTagCancelPress={handleTagPress} />
      <FlatList
        extraData={players}
        showsVerticalScrollIndicator={false}
        data={players}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ItemSeparatorComponent}
        renderItem={renderPlayer}
        ListEmptyComponent={listEmptyComponent}
      />
      <Modal
        isVisible={isInfoModalVisible}
        onBackdropPress={() => setIsInfoModalVisible(false)}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={50}
        backdropTransitionOutTiming={50}
        style={{
          margin: 0,
          top: 0,
        }}>
        <View
          style={{
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,

            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}>
          <View style={styles.titlePopup}>
            <Text style={styles.doneText}></Text>

            <Text style={styles.startTime}></Text>
            <Pressable
              hitSlop={getHitSlop(15)}
              onPress={() => {
                setIsInfoModalVisible(false);
              }}>
              <Image source={images.cancelImage} style={styles.closeButton} />
            </Pressable>
          </View>
          <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 20,
              margin: 15,
              color: colors.lightBlackColor,
            }}>
            {strings.sentBasicInfoText}
          </Text>
          <Text style={styles.basicInfoList}>• {strings.gender}</Text>
          <Text style={styles.basicInfoList}>• {strings.birthdayAgeText}</Text>
          <Text style={styles.basicInfoList}>• {strings.height}</Text>
          <Text style={styles.basicInfoList}>• {strings.weight}</Text>
          <Text style={styles.basicInfoList}>• {strings.phoneNumber}</Text>
          <Text style={styles.basicInfoList}>• {strings.emailPlaceHolder}</Text>
          <Text style={styles.basicInfoList}>• {strings.address}</Text>

          <Text style={styles.basicInfoRequestText}>
            {strings.requestInfoAcceptedText}
          </Text>

          <SafeAreaView>
            <View style={{flexDirection: 'row', margin: 15}}>
              <Pressable
                onPress={async () => {
                  await setStorage('showPopup', showCheck);
                  setShowCheck(!showCheck);
                }}>
                <Image
                  source={
                    showCheck ? images.orangeCheckBox : images.uncheckWhite
                  }
                  style={{height: 22, width: 22, resizeMode: 'contain'}}
                />
              </Pressable>
              <Text style={styles.checkBoxItemText}>
                {strings.showAgainText}
              </Text>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  sendButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },

  titlePopup: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  closeButton: {
    marginLeft: 20,
    height: 15,
    width: 15,
    resizeMode: 'cover',
    marginRight: 25,
    marginTop: 15,
  },

  startTime: {
    alignSelf: 'center',
    textAlignVertical: 'center',
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },
  doneText: {
    alignSelf: 'center',
    textAlignVertical: 'center',
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.lightBlackColor,
    marginRight: 15,
  },
  basicInfoList: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginBottom: 5,
  },
  basicInfoRequestText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    margin: 15,
  },

  checkBoxItemText: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.veryLightBlack,
    marginLeft: 15,
  },
});
