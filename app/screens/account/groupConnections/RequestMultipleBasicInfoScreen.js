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
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
import {useIsFocused} from '@react-navigation/native';
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
  const [searchText, setSearchText] = useState('');
  const isFocused = useIsFocused();
  const selectedPlayers = [];

  useEffect(() => {
    setloading(true);
    setSelectedList([]);

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
  }, [isFocused]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.sendButtonStyle}
          onPress={() => sendRequestForBasicInfo()}>
          {strings.send}
        </Text>
      ),

      headerLeft: () => (
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={images.backArrow} style={styles.backArrowStyle} />
        </TouchableWithoutFeedback>
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

    console.log(selectedList.length, 'from arragy');

    setSelectedList(selectedPlayers);
  };

  const infoList = [
    {
      title: strings.gender,
    },
    {
      title: strings.birthdayAgeText,
    },
    {
      title: strings.height,
    },
    {
      title: strings.weight,
    },
    {
      title: strings.phoneNumber,
    },
    {
      title: strings.emailPlaceHolder,
    },
  ];

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
                navigation.navigate('GroupMembersScreen');
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

  const RenderInfoDetail = ({item}) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: 5,
          height: 5,
          backgroundColor: colors.blackColor,
          borderRadius: 50,
        }}
      />
      <Text style={styles.basicInfoList}>{item?.title}</Text>
    </View>
  );

  const ListHeaderComponent = useCallback(
    () => (
      <>
        {selectedList.length > 0 && (
          <View
            style={{
              backgroundColor: colors.whiteColor,
              display: selectedList.length > 0 ? 'flex' : 'none',
            }}>
            <TCProfileTag
              dataSource={players}
              onTagCancelPress={handleTagPress}
              style={{
                marginLeft: 10,
                marginRight: 0,
                marginTop: selectedList.length > 0 ? 15 : 0,
              }}
            />
          </View>
        )}
      </>
    ),
    [selectedList],
  );

  return (
    <View style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <View style={{marginTop: 15}}>
        <TCSearchBox
          width={'90%'}
          placeholderText={strings.searchText}
          alignSelf="center"
          onChangeText={(text) => {
            setSearchText(text);
            searchFilterFunction(searchText);
          }}
          value={searchText}
          onPressClear={() => {
            setSearchText('');
            searchFilterFunction('');
          }}
        />
      </View>

      <View style={{marginTop: 5}}>
        <FlatList
          extraData={players}
          showsVerticalScrollIndicator={false}
          data={players}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorComponent}
          ListHeaderComponent={ListHeaderComponent()}
          renderItem={renderPlayer}
          ListEmptyComponent={listEmptyComponent}
          stickyHeaderIndices={[0]}
          ListFooterComponent={() => <View style={{marginBottom: 180}} />}
        />
      </View>

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
              fontFamily: fonts.RMedium,
              fontSize: 20,
              marginLeft: 30,
              marginRight: 44,
              marginBottom: 15,
              color: colors.lightBlackColor,
            }}>
            {strings.sentBasicInfoText}
          </Text>
          <View
            style={{
              marginLeft: 30,
            }}>
            <FlatList
              data={infoList}
              renderItem={({item}) => <RenderInfoDetail item={item} />}
            />
          </View>

          <Text style={styles.basicInfoRequestText}>
            {strings.requestInfoAcceptedText}
          </Text>

          <SafeAreaView>
            <View
              style={{flexDirection: 'row', marginLeft: 25, marginBottom: 5}}>
              <Pressable
                onPress={async () => {
                  await setStorage('showPopup', showCheck);
                  setShowCheck(!showCheck);
                }}>
                <Image
                  source={
                    showCheck ? images.orangeCheckBox : images.uncheckWhite
                  }
                  style={{height: 18, width: 18, resizeMode: 'contain'}}
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
    fontFamily: fonts.RMedium,
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

  basicInfoList: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 10,
    marginBottom: 5,
  },
  basicInfoRequestText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 30,
    marginRight: 26,
    lineHeight: 24,
    marginTop: 15,
    marginBottom: 30,
  },

  checkBoxItemText: {
    fontFamily: fonts.RRegular,
    fontSize: 14,
    color: colors.veryLightBlack,
    marginLeft: 7,
  },
  backArrowStyle: {
    height: 22,
    marginLeft: 10,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
  },
});
