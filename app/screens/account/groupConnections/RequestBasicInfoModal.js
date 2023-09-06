/* eslint-disable no-else-return */
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Image,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import React, {useState, useCallback, useEffect, useContext, memo} from 'react';
import {format} from 'react-string-format';
import Verbs from '../../../Constants/Verbs';
import GroupIcon from '../../../components/GroupIcon';
import TCThinDivider from '../../../components/TCThinDivider';
import images from '../../../Constants/ImagePath';
import AuthContext from '../../../auth/context';
import {getStorage, setStorage, showAlert} from '../../../utils';
import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import InviteListShimmer from './InviteListShimmer';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import {ModalTypes} from '../../../Constants/GeneralConstants';
import {strings} from '../../../../Localization/translation';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {getGroupMembers, sendBasicInfoRequest} from '../../../api/Groups';

function RequestBasicInfoModal({isVisible, closeModal = () => {}, groupID}) {
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);
  const [players, setPlayers] = useState([]);
  const [selectedList, setSelectedList] = useState([]);

  const [searchText, setSearchText] = useState('');

  const [filteredList, setFilteredList] = useState([]);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const getMembers = () => {
    setSelectedList([]);

    getGroupMembers(groupID, authContext)
      .then((response) => {
        setloading(false);

        setPlayers([...response.payload]);
        setFilteredList([...response.payload]);

        setTimeout(() => {
          getStorage('showPopup').then((isShow) => {
            if (isShow || isShow === null) {
              setIsInfoModalVisible(true);
            } else {
              setIsInfoModalVisible(false);
            }
          });
        }, 300);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const sendRequestForBasicInfo = () => {
    if (selectedList.length > 0) {
      setloading(true);

      sendBasicInfoRequest(groupID, selectedList, authContext)
        .then(() => {
          setloading(false);

          setTimeout(() => {
            showAlert(
              format(
                selectedList?.length > 1
                  ? strings.multipleRequestSent
                  : strings.requestforBasicInfoWasSent,
                selectedList?.length,
              ),
              () => {
                onCloseModal();
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

  const onCloseModal = () => {
    setSearchText('');
    setSelectedList([]);
    setPlayers([]);
    closeModal();
  };

  const renderPlayer = ({item}) => {
    const isChecked = selectedList.includes(item.user_id);
    return (
      <TouchableOpacity
        disabled={!item.connected}
        onPress={() => {
          selectPlayer(item);
        }}
        style={[styles.topViewContainer, {opacity: item.connected ? 1 : 0.6}]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <GroupIcon
              imageUrl={item.thumbnail}
              entityType={Verbs.entityTypePlayer}
              containerStyle={styles.playerProfile}
            />
          </View>

          <View style={styles.topTextContainer}>
            <Text style={styles.whiteNameText} numberOfLines={1}>
              {item.first_name} {item.last_name}
            </Text>
            <Text style={styles.whiteLocationText} numberOfLines={1}>
              {item.city}
            </Text>
          </View>
        </View>
        <Pressable
          disabled={!item.connected}
          onPress={() => {
            selectPlayer(item);
          }}
          style={{
            height: 22,
            width: 22,
            borderWidth: StyleSheet.hairlineWidth,
            borderRadius: 7,
            borderColor: colors.veryLightGray,

            alignSelf: 'center',
          }}>
          <Image
            source={isChecked ? images.orangeCheckBox : images.uncheckBox}
            style={styles.checkGreenImage}
          />
        </Pressable>
      </TouchableOpacity>
    );
  };

  const selectPlayer = (item) => {
    let newList = [...selectedList];

    const isChecked = newList.includes(item.user_id);

    if (isChecked) {
      newList = newList.filter((ele) => ele !== item.user_id);
    } else {
      newList.unshift(item.user_id);
    }

    setSelectedList(newList);
  };

  useEffect(() => {
    if (searchText) {
      const searchParts = searchText.toLowerCase().split(' ');
      const list = players.filter((item) =>
        searchParts.every(
          (part) =>
            item.first_name.toLowerCase().includes(part) ||
            item.last_name.toLowerCase().includes(part),
        ),
      );
      setFilteredList(list);
    } else {
      setFilteredList(players);
    }
  }, [players, searchText]);

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

  const listHeaderComponent = () => (
    <View
      style={{
        backgroundColor: colors.whiteColor,
      }}>
      <ScrollView
        horizontal
        contentContainerStyle={{
          marginLeft: 18,
          marginBottom: 5,
        }}
        showsHorizontalScrollIndicator={false}>
        {selectedList.length > 0 ? (
          <View style={[styles.row, {marginTop: 15, marginRight: 26}]}>
            {selectedList.map((item, index) => {
              const user = players.find((obj) => obj.user_id === item);
              return (
                <View style={{alignItems: 'center', marginLeft: 7}} key={index}>
                  <Pressable
                    onPress={() => {
                      selectPlayer(user);
                    }}
                    style={{
                      borderRadius: 100,

                      height: 40,
                      width: 40,
                    }}>
                    <GroupIcon
                      imageUrl={user.thumbnail}
                      entityType={Verbs.entityTypePlayer}
                      containerStyle={styles.playerProfile}
                    />
                  </Pressable>
                  <Pressable
                    style={styles.closeButton}
                    onPress={() => {
                      selectPlayer(user);
                    }}>
                    <Image
                      source={images.closeRound}
                      style={styles.closeIcon}
                    />
                  </Pressable>
                  <Text style={styles.tagTitleText} numberOfLines={1}>
                    {`${user.first_name} ${user.last_name}`}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );

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

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={onCloseModal}
      modalType={ModalTypes.style1}
      onModalShow={() => getMembers()}
      headerRightButtonText={strings.send}
      onRightButtonPress={() => sendRequestForBasicInfo()}
      title={strings.sendrequestForBaicInfoText}
      containerStyle={{padding: 0, flex: 1}}>
      <View style={styles.mainContainer}>
        <ActivityLoader visible={loading} />

        <View style={styles.floatingInput}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholderTextColor={colors.userPostTimeColor}
              style={styles.textInputStyle}
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
              }}
              placeholder={strings.searchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchText('');
                }}>
                <Image
                  source={images.closeRound}
                  style={{height: 15, width: 15}}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {players.length === 0 ? (
          <InviteListShimmer />
        ) : (
          <FlatList
            extraData={filteredList}
            ItemSeparatorComponent={ItemSeparatorComponent}
            ListHeaderComponent={listHeaderComponent}
            showsVerticalScrollIndicator={false}
            data={filteredList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderPlayer}
            stickyHeaderIndices={[0]}
            ListEmptyComponent={listEmptyComponent}
          />
        )}
      </View>

      <CustomModalWrapper
        isVisible={isInfoModalVisible}
        closeModal={() => setIsInfoModalVisible(false)}
        modalType={ModalTypes.style3}
        containerStyle={{padding: 0, flex: 1}}
        extraHeaderStyle={{borderBottomWidth: 0}}
        Top={340}>
        <View
          style={{
            flex: 1,
          }}>
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

          <View
            style={{flexDirection: 'row', marginLeft: 25, marginBottom: 20}}>
            <Pressable
              onPress={async () => {
                await setStorage('showPopup', showCheck);
                setShowCheck(!showCheck);
              }}>
              <Image
                source={showCheck ? images.orangeCheckBox : images.uncheckWhite}
                style={{height: 18, width: 18, resizeMode: 'contain'}}
              />
            </Pressable>
            <Text style={styles.checkBoxItemText}>{strings.showAgainText}</Text>
          </View>
        </View>
      </CustomModalWrapper>
    </CustomModalWrapper>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  closeButton: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    position: 'absolute',
    right: 2,
    top: 0,
    zIndex: 1,
  },
  closeIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  tagTitleText: {
    marginTop: 5,
    fontFamily: fonts.RRegular,
    fontSize: 12,
    color: colors.lightBlackColor,
    width: 50,
    textAlign: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  topViewContainer: {
    flexDirection: 'row',
    height: 50,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 10,
    marginBottom: 20,
    marginTop: 12,
    borderRadius: 10,
  },

  topTextContainer: {
    marginLeft: 10,
    marginTop: 10,
    alignSelf: 'center',
    width: 220,
  },

  whiteNameText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },

  whiteLocationText: {
    fontSize: 14,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
  },

  checkGreenImage: {
    height: 22,
    width: 22,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  playerProfile: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: colors.inputBgOpacityColor,
    height: 45,
  },
  textInputStyle: {
    flex: 1,
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    padding: 0,
  },
  floatingInput: {
    alignSelf: 'center',
    zIndex: 1,
    width: '90%',
    marginTop: 20,
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
});

export default memo(RequestBasicInfoModal);
