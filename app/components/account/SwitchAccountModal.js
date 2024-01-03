// @flow
import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Image,
  Text,
  Alert,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {strings} from '../../../Localization/translation';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {ModalTypes} from '../../Constants/GeneralConstants';
import images from '../../Constants/ImagePath';
import {getNotificationCount} from '../../utils/accountUtils';
import CustomModalWrapper from '../CustomModalWrapper';
import AccountCard from './AccountCard';
import useSwitchAccount from '../../hooks/useSwitchAccount';
import SwitchAccountLoader from './SwitchAccountLoader';
import BottomSheet from '../modals/BottomSheet';
import {
  actionOnGroupRequest,
  getTeamPendingRequest,
  groupValidate,
} from '../../api/Groups';
import Verbs from '../../Constants/Verbs';
import SwitchAccountShimmer from './SwitchAccountShimmer';

const SwitchAccountModal = ({
  isVisible = false,
  closeModal = () => {},
  onCreate = () => {},
}) => {
  const authContext = useContext(AuthContext);
  const [accountList, setAccountList] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [createOptions, setCreateOptions] = useState([
    strings.team,
    strings.club,
    strings.leaguesTitle,
  ]);
  const [showBottomSheet, setBottomSheet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFetchingList, setIsFetchingList] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const {onSwitchProfile} = useSwitchAccount();
  const [checkIndex, setcheckIndex] = useState(-1);

  useEffect(() => {
    if (isVisible) {
      setIsFetchingList(true);
      getTeamPendingRequest(authContext)
        .then((res) => {
          if (res.payload.length > 0) {
            setAccountList([...authContext.managedEntities, ...res.payload]);
          } else {
            setAccountList(authContext.managedEntities);
          }
          setIsFetchingList(false);
        })
        .catch((err) => {
          Alert.alert(strings.alertmessagetitle, err.message);
          setIsFetchingList(false);
        });

      if (authContext.entity.role === Verbs.entityTypeClub) {
        setCreateOptions([strings.team]);
      } else {
        setCreateOptions([strings.team, strings.club, strings.leaguesTitle]);
      }
    }
  }, [isVisible, authContext]);

  const handleSwitchAccount = async (entity) => {
    if (entity.request_id) {
      setIsPressed(false);
      Alert.alert(
        Platform.OS === 'android' ? '' : strings.requestSwitchModalAlertMessage,
        Platform.OS === 'android' ? strings.requestSwitchModalAlertMessage : '',
        [
          {
            text: strings.okTitleText,
          },
        ],
      );
    } else {
      try {
        setShowLoader(true);
        setIsPressed(false);
        setSelectedAccount(entity);

        await onSwitchProfile(entity);

        closeModal();
      } catch (error) {
        console.error('Error occurred:', error);
        closeModal();
      }
    }
    // closeModal();
  };

  const onResendRequest = (entity = {}) => {
    const obj = {
      player1: entity.player1,
      player2: entity.player2,
      sport: entity.sport,
      sport_type: entity.sport_type,
      entity_type: entity.entity_type,
      request_id: entity.request_id,
    };
    setLoading(true);

    groupValidate(obj, authContext)
      .then(() => {
        setLoading(false);

        Alert.alert(
          Platform.OS === 'android' ? '' : strings.requestSent,
          Platform.OS === 'android' ? strings.requestSent : '',

          [
            {
              text: strings.OkText,
              onPress: () => closeModal(),
            },
          ],
          {cancelable: false},
        );
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const actionOnTeamRequest = (type, requestID) => {
    setLoading(true);
    actionOnGroupRequest(type, requestID, authContext)
      .then(() => {
        setLoading(false);
        closeModal();
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const onWithdrawRequest = (item) => {
    Alert.alert(
      strings.areYouSureTouWantToWithdrawRequest,
      '',
      [
        {
          text: strings.cancel,
        },
        {
          text: strings.withDrawRequest,
          onPress: () => actionOnTeamRequest(Verbs.cancelVerb, item.request_id),
        },
      ],

      {cancelable: true},
    );
  };

  const handleCancelRequest = (item = {}) => {
    Alert.alert(
      Platform.OS === 'android' ? '' : strings.teamWillbeCreatedAcceptRequest,
      Platform.OS === 'android' ? strings.teamWillbeCreatedAcceptRequest : '',
      [
        {
          text: strings.resendRequest,
          onPress: () => onResendRequest(item),
        },
        {
          text: strings.withDrawRequest,
          onPress: () => onWithdrawRequest(item),
        },
        {
          text: strings.cancel,
          style: 'destructive',
        },
      ],

      {cancelable: true},
    );
  };

  const ListFooterComponent = () => (
    <>
      {(authContext.entity.role === Verbs.entityTypeUser ||
        authContext.entity.role === Verbs.entityTypeClub) && (
        <>
          <Pressable
            style={[
              styles.row,
              {
                justifyContent: 'flex-start',
                paddingVertical: 15,
                paddingHorizontal: 20,
              },
            ]}
            onPress={() => {
              setBottomSheet(true);
            }}>
            <View style={styles.iconContainer}>
              <Image
                source={images.newCreateGroupIcon}
                style={[styles.image, {borderRadius: 30}]}
              />
            </View>
            <View style={{marginLeft: 15}}>
              <Text style={styles.label}>{strings.createGroupAccount}</Text>
            </View>
          </Pressable>
          <View style={styles.dividor} />
        </>
      )}
    </>
  );

  useEffect(() => {
    if (isVisible) {
      const index = accountList.findIndex(
        (item) =>
          item.group_id === authContext.entity.uid ||
          item.user_id === authContext.entity.uid,
      );

      setcheckIndex(index);
    }
  }, [isVisible, accountList]);

  return (
    <CustomModalWrapper
      modalType={ModalTypes.default}
      isVisible={isVisible}
      closeModal={closeModal}
      title={strings.switchAccount}
      containerStyle={styles.modalContainer}>
      {isFetchingList ? (
        <SwitchAccountShimmer />
      ) : (
        <FlatList
          data={accountList}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => (
            <>
              <TouchableOpacity
                style={[
                  styles.row,
                  {
                    backgroundColor:
                      isPressed && index === checkIndex
                        ? 'rgba(255, 138, 1, 0.2)'
                        : 'transparent',
                    paddingHorizontal: 20,
                    paddingVertical: 15,
                  },
                ]}
                onPress={() => {
                  setcheckIndex(index);
                  if (
                    authContext.entity.uid === item.user_id ||
                    authContext.entity.uid === item.group_id
                  ) {
                    setIsPressed(false);
                    return;
                  }

                  setTimeout(() => {
                    handleSwitchAccount(item);
                  }, 100);
                }}>
                <AccountCard
                  entityData={item}
                  sportList={authContext.sports}
                  containerStyle={{
                    paddingHorizontal: 5,
                    flex: 1,
                  }}
                  notificationCount={getNotificationCount(
                    item.user_id ?? item.group_id,
                    authContext,
                  )}
                  onPress={() => {
                    setIsPressed(true);
                    setcheckIndex(index);
                    if (
                      authContext.entity.uid === item.user_id ||
                      authContext.entity.uid === item.group_id
                    ) {
                      setIsPressed(false);
                      return;
                    }

                    setTimeout(() => {
                      handleSwitchAccount(item);
                    }, 100);
                  }}
                  onPressCancelRequest={() => {
                    handleCancelRequest(item);
                  }}
                  loading={loading}
                />
                <Pressable
                  style={styles.radioIcon}
                  onPress={() => {
                    setIsPressed(true);
                    setcheckIndex(index);
                    if (
                      authContext.entity.uid === item.user_id ||
                      authContext.entity.uid === item.group_id
                    ) {
                      setIsPressed(false);
                      return;
                    }

                    setTimeout(() => {
                      handleSwitchAccount(item);
                    }, 100);
                  }}>
                  <Image
                    source={
                      index === checkIndex
                        ? images.radioSelectYellow
                        : images.radioUnselect
                    }
                    style={styles.image}
                  />
                </Pressable>
              </TouchableOpacity>
              <View style={styles.dividor} />
            </>
          )}
          ListFooterComponent={ListFooterComponent}
        />
      )}

      <BottomSheet
        optionList={createOptions}
        isVisible={showBottomSheet}
        closeModal={() => setBottomSheet(false)}
        onSelect={(option) => {
          setBottomSheet(false);

          onCreate(option);
        }}
        type="ios"
        title={strings.create}
      />

      <SwitchAccountLoader
        isVisible={showLoader}
        entityName={selectedAccount.full_name ?? selectedAccount.group_name}
        entityType={selectedAccount.entity_type}
        entityImage={selectedAccount.thumbnail}
        stopLoading={() => {
          closeModal({
            uid: selectedAccount.group_id ?? selectedAccount.user_id,
            role: selectedAccount.entity_type,
          });
          setShowLoader(false);
        }}
      />
    </CustomModalWrapper>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    height: '98%',
    padding: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radioIcon: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  dividor: {
    height: 1,

    backgroundColor: colors.grayBackgroundColor,
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
});
export default SwitchAccountModal;
