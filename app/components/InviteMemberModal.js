import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import React, {useState, useCallback, useEffect, useContext} from 'react';
import {format} from 'react-string-format';
import ClipboardToast from 'react-native-clipboard-toast';
import CustomModalWrapper from './CustomModalWrapper';
import {ModalTypes} from '../Constants/GeneralConstants';
import {strings} from '../../Localization/translation';
import TCSearchBox from './TCSearchBox';
import ActivityLoader from './loader/ActivityLoader';

import InviteListShimmer from '../screens/account/groupConnections/InviteListShimmer';
import colors from '../Constants/Colors';
import fonts from '../Constants/Fonts';
import ProfileCheckView from './groupConnections/ProfileCheckView';
import {showAlert} from '../utils';
import {sendInvitationInGroup} from '../api/Users';
import AuthContext from '../auth/context';
import {getUserIndex} from '../api/elasticSearch';
import TCProfileTag from './TCProfileTag';
import images from '../Constants/ImagePath';

import TCThinDivider from './TCThinDivider';
import InviteMemberbyEmailModal from './InviteMemberByEmail';

let stopFetchMore = true;

export default function InviteMemberModal({isVisible, closeModal = () => {}}) {
  const [loading, setloading] = useState(true);
  const authContext = useContext(AuthContext);
  const [players, setPlayers] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [pageSize] = useState(10);
  const [pageFrom, setPageFrom] = useState(0);
  const [filters, setFilters] = useState();
  const [searchText, setSearchText] = useState('');
  const [showInviteByEmail, setShowInvitwByEmail] = useState(false);

  const selectedPlayers = [];

  useEffect(() => {
    getUsers(filters);
    setPageFrom(10);
  }, [isVisible, filters]);

  const sendInvitation = () => {
    setloading(true);
    const entity = authContext.entity;
    const obj = {
      entity_type: entity.role,
      userIds: selectedList,
      uid: entity.uid,
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

  const onScrollHandler = () => {
    if (!stopFetchMore) {
      getUsers(filters);
      stopFetchMore = true;
    }
  };

  const onCloseModal = () => {
    setSelectedList([]);
    setPlayers([]);
    closeModal();
  };

  const getUsers = useCallback(
    (filterPlayer) => {
      const membersQuery = {
        size: pageSize,
        from: pageFrom,
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
          if (response.length > 0) {
            const result = response.map((obj) => {
              // eslint-disable-next-line no-param-reassign
              obj.isChecked = false;
              return obj;
            });
            setPlayers([...players, ...result]);
            setPageFrom(pageFrom + pageSize);
            stopFetchMore = true;
          }
        })
        .catch((error) => {
          setloading(false);
          console.log(error.message);
        });
    },
    [pageFrom, pageSize, players],
  );

  const selectPlayer = ({item, index}) => {
    players[index].isChecked = !item.isChecked;
    setPlayers([...players]);
    players.map((obj) => {
      if (obj.isChecked) {
        selectedPlayers.push(obj.user_id);
      }
      return obj;
    });
    setSelectedList(selectedPlayers);
  };

  const renderPlayer = ({item, index}) => (
    <ProfileCheckView
      playerDetail={item}
      isChecked={item.isChecked}
      onPress={() => {
        selectPlayer({item, index});
      }}
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

  const applyFilter = useCallback(
    (fil) => {
      getUsers(fil);
    },
    [getUsers],
  );
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

  const listHeaderComponent = useCallback(
    () => (
      <View
        style={{
          backgroundColor: colors.whiteColor,
        }}>
        {players.filter((obj) => obj.isChecked).length <= 0 &&
          searchText.length <= 0 && (
            <View
              style={{
                marginTop: 25,
              }}>
              <Pressable
                style={styles.inviteEmailStyle}
                onPress={() => {
                  setShowInvitwByEmail(true);
                }}>
                <Image source={images.inviteEmail} style={styles.imageIcon} />
                <Text style={styles.textTitle}>{strings.inviteByEmail}</Text>
              </Pressable>

              <TCThinDivider />
              <View style={styles.imageTextContainer}>
                <Image source={images.copyUrl} style={styles.imageIcon} />

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
                  toastOnShow={() => {
                    console.log('Is Copied');
                  }}
                />
              </View>
            </View>
          )}

        {selectedList.length > 0 && (
          <View
            style={{
              marginTop: 15,
            }}>
            <TCProfileTag
              dataSource={players}
              onTagCancelPress={handleTagPress}
              style={{
                marginLeft: 10,
                marginRight: 0,
              }}
            />
          </View>
        )}
        <TCThinDivider />
      </View>
    ),
    [players],
  );

  const ItemSeparatorComponent = useCallback(() => <TCThinDivider />, []);

  return (
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
        <TCSearchBox
          width={'90%'}
          placeholderText={strings.searchText}
          alignSelf="center"
          onChangeText={(text) => {
            const tempFilter = {...filters};

            if (text?.length > 0) {
              tempFilter.searchText = text;
            } else {
              delete tempFilter.searchText;
            }
            setFilters({
              ...tempFilter,
            });
            setPageFrom(0);
            setPlayers([]);
            applyFilter(tempFilter);
            setSearchText(text);
          }}
        />

        {players.length === 0 ? (
          <InviteListShimmer />
        ) : (
          <FlatList
            extraData={players}
            ListHeaderComponent={listHeaderComponent}
            showsVerticalScrollIndicator={false}
            data={players}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorComponent}
            renderItem={renderPlayer}
            onScroll={onScrollHandler}
            onEndReachedThreshold={0.01}
            onScrollBeginDrag={() => {
              stopFetchMore = false;
            }}
            stickyHeaderIndices={[0]}
            ListEmptyComponent={listEmptyComponent}
          />
        )}
      </View>

      <InviteMemberbyEmailModal
        isVisible={showInviteByEmail}
        closeModal={() => setShowInvitwByEmail(false)}
      />
    </CustomModalWrapper>
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
});
