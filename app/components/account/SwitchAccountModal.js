// @flow
import React, {useContext, useEffect, useRef, useState} from 'react';
import {StyleSheet, FlatList, View, Pressable, Image, Text} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
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
    strings.cancel,
  ]);

  const authContext = useContext(AuthContext);
  const actionSheetRef = useRef();
  const {onSwitchProfile} = useSwitchAccount();

  useEffect(() => {
    if (isVisible && authContext.managedEntities?.length > 0) {
      setAccountList(authContext.managedEntities);
    }
  }, [isVisible, authContext.managedEntities]);

  const handleSwitchAccount = async (entity) => {
    setShowLoader(true);
    setSelectedAccount(entity);
    await onSwitchProfile(entity);
    // closeModal();
  };

  return (
    <CustomModalWrapper
      modalType={ModalTypes.style1}
      isVisible={isVisible}
      closeModal={closeModal}
      title={strings.switchAccount}
      containerStyle={styles.modalContainer}>
      <FlatList
        data={accountList}
        keyExtractor={(item) => item.user_id ?? item.group_id}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <>
            <Pressable
              style={styles.row}
              onPress={() => {
                handleSwitchAccount(item);
              }}>
              <AccountCard
                entityData={item}
                sportList={authContext.sports}
                containerStyle={{paddingHorizontal: 5}}
                notificationCount={getNotificationCount(
                  item.user_id ?? item.group_id,
                  authContext,
                )}
                onPress={() => {
                  handleSwitchAccount(item);
                }}
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
        ListFooterComponent={() => (
          <>
            <Pressable
              style={[styles.row, {justifyContent: 'flex-start'}]}
              onPress={() => {
                actionSheetRef.current.show();
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
      />

      <ActionSheet
        ref={actionSheetRef}
        title={strings.create}
        options={createOptions}
        cancelButtonIndex={3}
        onPress={(index) => {
          if (index === 3) {
            return;
          }
          closeModal();
          onCreate(createOptions[index]);
        }}
      />
      <SwitchAccountLoader
        isVisible={showLoader}
        entityName={selectedAccount.full_name ?? selectedAccount.group_name}
        entityType={selectedAccount.entity_type}
        entityImage={selectedAccount.thumbnail}
        stopLoading={() => {
          closeModal();
          setShowLoader(false);
        }}
      />
    </CustomModalWrapper>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    paddingHorizontal: 15,
    flex: 1,
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
