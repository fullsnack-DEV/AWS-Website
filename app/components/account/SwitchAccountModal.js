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
import ScreenHeader from '../ScreenHeader';

const SwitchAccountModal = ({
  isVisible = false,
  closeModal = () => {},
  onCreate = () => {},
}) => {
  const [accountList, setAccountList] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [createOptions] = useState([
    strings.team,
    strings.club,
    strings.leaguesTitle,
  ]);
  const [showBottomSheet, setBottomSheet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFetchingList, setIsFetchingList] = useState(false);

  const authContext = useContext(AuthContext);
  const {onSwitchProfile} = useSwitchAccount();

  useEffect(() => {
    if (isVisible && authContext.managedEntities?.length > 0) {
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
    }
  }, [isVisible, authContext]);

  const handleSwitchAccount = async (entity) => {
    if (entity.request_id) {
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
      setShowLoader(true);
      setSelectedAccount(entity);
      await onSwitchProfile(entity);
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
      {authContext.entity.role === Verbs.entityTypeUser && (
        <>
          <Pressable
            style={[styles.row, {justifyContent: 'flex-start'}]}
            onPress={() => {
              setBottomSheet(true);
            }}>
            <View style={styles.iconContainer}>
              <Image
                source={images.createGroupIcon}
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

  return (
    <CustomModalWrapper
      modalType={ModalTypes.default}
      isVisible={isVisible}
      closeModal={closeModal}
      title={strings.switchAccount}
      containerStyle={styles.modalContainer}>
      <ScreenHeader title={strings.switchAccount} />

      {isFetchingList ? (
        <SwitchAccountShimmer />
      ) : (
        <FlatList
          data={accountList}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{padding: 20}}
          renderItem={({item}) => (
            <>
              <Pressable
                style={styles.row}
                onPress={() => {
                  if (
                    authContext.entity.uid === item.user_id ||
                    authContext.entity.uid === item.group_id
                  ) {
                    return;
                  }
                  handleSwitchAccount(item);
                }}>
                <AccountCard
                  entityData={item}
                  sportList={authContext.sports}
                  containerStyle={{paddingHorizontal: 5, flex: 1}}
                  notificationCount={getNotificationCount(
                    item.user_id ?? item.group_id,
                    authContext,
                  )}
                  onPress={() => {
                    if (
                      authContext.entity.uid === item.user_id ||
                      authContext.entity.uid === item.group_id
                    ) {
                      return;
                    }
                    //
                    handleSwitchAccount(item);
                  }}
                  onPressCancelRequest={() => {
                    handleCancelRequest(item);
                  }}
                  loading={loading}
                />
                <View style={styles.radioIcon}>
                  <Image
                    source={
                      authContext.entity.uid === item.user_id ||
                      authContext.entity.uid === item.group_id
                        ? images.radioSelectYellow
                        : images.radioUnselect
                    }
                    style={styles.image}
                  />
                </View>
              </Pressable>
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
    marginVertical: 15,
    backgroundColor: colors.grayBackgroundColor,

  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.thinDividerColor,
    borderRadius: 30,
    padding: 5,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
  },
});
export default SwitchAccountModal;
