/* eslint-disable no-else-return */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import React, {useState, useCallback, useEffect, useContext, memo} from 'react';
import {format} from 'react-string-format';
import ClipboardToast from 'react-native-clipboard-toast';
import CustomModalWrapper from './CustomModalWrapper';
import {ModalTypes} from '../Constants/GeneralConstants';
import {strings} from '../../Localization/translation';
import ActivityLoader from './loader/ActivityLoader';

import InviteListShimmer from '../screens/account/groupConnections/InviteListShimmer';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import {showAlert} from '../utils';
import {sendInvitationInGroup} from '../api/Users';
import AuthContext from '../auth/context';
import {getUserIndex} from '../api/elasticSearch';
import images from '../Constants/ImagePath';
import TCThinDivider from './TCThinDivider';
import InviteMemberbyEmailModal from './InviteMemberByEmail';
import GroupIcon from './GroupIcon';
import Verbs from '../Constants/Verbs';

function InviteMemberModal({
  isVisible,
  closeModal = () => {},
  forUser = false,
  currentUserData = {},
  members = [],
}) {
  const [loading, setloading] = useState(true);
  const authContext = useContext(AuthContext);
  const [players, setPlayers] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [pageSize] = useState(10000);
  const [pageFrom, setPageFrom] = useState(0);
  const [filters, setFilters] = useState();
  const [searchText, setSearchText] = useState('');
  const [showInviteByEmail, setShowInvitwByEmail] = useState(false);
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    getUsers(filters);
    setPageFrom(10);
  }, [isVisible, filters]);

  const getUsers = useCallback(
    (filterPlayer) => {
      const membersQuery = {
        size: pageSize,

        query: {
          bool: {
            must: [],
          },
        },
      };
      if (filterPlayer?.searchText?.length > 0) {
        membersQuery.query.bool.must.push({
          query_string: {
            query: `*${filterPlayer?.searchText}*`,
            fields: ['full_name'],
          },
        });
      }

      getUserIndex(membersQuery)
        .then((response) => {
          setloading(false);

          if (members.length > 0) {
            const filteredResponse = response.filter(
              (respUser) =>
                !members.some((member) => member.user_id === respUser.user_id),
            );

            setPlayers([...filteredResponse]);
            setFilteredList([...filteredResponse]);
          } else {
            setPlayers([...response]);
            setFilteredList([...response]);
          }
        })
        .catch((error) => {
          setloading(false);
          console.log(error.message);
        });
    },
    [pageFrom, pageSize, players],
  );

  const sendInvitation = () => {
    setloading(true);
    const entity = authContext.entity;

    const obj = {
      entity_type: forUser ? currentUserData.entity_type : entity.role,
      userIds: selectedList,
      uid: forUser ? currentUserData.group_id : entity.uid,
    };

    sendInvitationInGroup(obj, authContext)
      .then(() => {
        setloading(false);

        setTimeout(() => {
          showAlert(
            format(
              selectedList?.length > 1
                ? strings.emailInvitationSent
                : strings.oneemailInvitationSent,
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
  };

  const onCloseModal = () => {
    setSearchText('');
    setSelectedList([]);
    setPlayers([]);
    closeModal();
    setFilters();
  };

  const RenderSportDetail = (item) => {
    const sportname = item.registered_sports?.[0]?.sport;
    const numOfSports = item.registered_sports?.length - 1;
    const emptyString = '';

    const capitalizeLetter =
      sportname?.charAt(0).toUpperCase() + sportname?.slice(1);

    if (sportname === undefined || !numOfSports === 0) {
      return `${emptyString}`;
    } else if (numOfSports === 0) {
      return `${capitalizeLetter}`;
    } else {
      return `${capitalizeLetter} and ${numOfSports} more`;
    }
  };

  const renderPlayer = ({item}) => {
    const isChecked = selectedList.includes(item.user_id);
    return (
      <Pressable
        onPress={() => selectPlayer(item)}
        style={styles.topViewContainer}>
        <View style={{flexDirection: 'row'}}>
          <View style={{marginTop: 15}}>
            <GroupIcon
              imageUrl={item.thumbnail}
              entityType={Verbs.entityTypePlayer}
              containerStyle={styles.playerProfile}
            />
          </View>

          <View style={styles.topTextContainer}>
            <Text style={styles.whiteNameText} numberOfLines={1}>
              {item.full_name}
            </Text>
            <Text style={styles.whiteLocationText} numberOfLines={1}>
              {item.city}
            </Text>
            <Text
              style={[styles.locationText, {textTransform: 'capitalize'}]}
              numberOfLines={1}>
              {RenderSportDetail(item)}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => selectPlayer(item)}
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
      </Pressable>
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
      const list = players.filter((item) =>
        item.full_name.toLowerCase().includes(searchText.toLowerCase()),
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
      {!selectedList.length > 0 && (
        <View
          style={{
            marginTop: 25,
          }}>
          <Pressable
            style={styles.inviteEmailStyle}
            onPress={() => {
              setShowInvitwByEmail(true);
            }}>
            <FastImage source={images.inviteEmail} style={styles.imageIcon} />

            <Text style={styles.textTitle}>{strings.inviteByEmail}</Text>
          </Pressable>

          <TCThinDivider />
          <View style={styles.imageTextContainer}>
            <FastImage source={images.copyUrl} style={styles.imageIcon} />

            <ClipboardToast
              textToShow={strings.copyInviteUrl}
              textToCopy={'Hello is underdevelopment'}
              toastText={'Text copied to clipboard!'}
              containerStyle={styles.textTitle}
              textStyle={{
                fontSize: 16,
                fontFamily: fonts.RRegular,
                color: colors.lightBlackColor,
              }}
              toastDuration={2000}
              toastPosition={'bottom'}
              toastDelay={1000}
            />
          </View>
          <TCThinDivider />
        </View>
      )}

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
                      overflow: 'hidden',
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

  return (
    <>
      <CustomModalWrapper
        isVisible={isVisible}
        closeModal={onCloseModal}
        modalType={ModalTypes.style1}
        headerRightButtonText={strings.send}
        onRightButtonPress={() => sendInvitation()}
        title={strings.inviteMemberText}
        containerStyle={{padding: 0, flex: 1}}>
        <View style={styles.mainContainer}>
          <ActivityLoader visible={loading} />
          <Text style={styles.infoTextStyle}>
            {format(strings.inviteSearchText, authContext.entity.role)}
          </Text>

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
      </CustomModalWrapper>
      <InviteMemberbyEmailModal
        isVisible={showInviteByEmail}
        closeModal={() => setShowInvitwByEmail(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  infoTextStyle: {
    marginTop: 20,
    marginLeft: 15,
    marginBottom: 10,
    fontFamily: fonts.RMedium,
    fontSize: 20,
    color: colors.lightBlackColor,
    lineHeight: 30,
  },

  imageIcon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  textTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 10,
  },
  imageTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 25,
    marginBottom: 15,
    marginTop: 15,
  },
  inviteEmailStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 25,
    marginBottom: 15,
    marginTop: 0,
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
    height: 60,
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
    marginTop: 20,
    alignSelf: 'center',
    width: 220,
  },

  whiteNameText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
  locationText: {
    fontSize: 14,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
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
    marginRight: 5,
    borderRadius: 100,
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
  },
});

export default memo(InviteMemberModal);
