// @flow
import {useIsFocused} from '@react-navigation/native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {strings} from '../../../Localization/translation';
import {patchGroup} from '../../api/Groups';
import AuthContext from '../../auth/context';
import CurrencyModal from '../../components/CurrencyModal/CurrencyModal';
import ActivityLoader from '../../components/loader/ActivityLoader';
import ScreenHeader from '../../components/ScreenHeader';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import Verbs from '../../Constants/Verbs';
import {groupMembershipFeeTypes, setAuthContextData} from '../../utils';

const MembershipFeeScreen = ({navigation, route}) => {
  const [registerationFee, setRegisterationFee] = useState();
  const [membershipFeeType, setMembershipFeeType] = useState(null);
  const [details, setDetails] = useState('');
  const [currencyType, setCurrencyType] = useState(Verbs.cad);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const {groupDetails} = route.params;
  const inputRef = useRef();
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setRegisterationFee(groupDetails.registration_fee);
      setMembershipFeeType(groupDetails.membership_fee_type ?? null);
      setCurrencyType(groupDetails.currency_type ?? Verbs.cad);
      setDetails(groupDetails.membership_fee_details);
    }
  }, [isFocused, groupDetails]);

  const updateGroup = () => {
    const data = {
      membership_fee: registerationFee,
      membership_fee_type: membershipFeeType,
      currency_type: currencyType,
      registration_fee: registerationFee,
      membership_fee_details: details,
    };
    setLoading(true);
    patchGroup(groupDetails.group_id, data, authContext)
      .then(async (response) => {
        console.log({response});
        setLoading(false);
        if (response && response.status === true) {
          await setAuthContextData(response.payload, authContext);
          navigation.goBack();
        } else {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, strings.defaultError);
          }, 0.1);
        }
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  return (
    <SafeAreaView style={styles.parent}>
      <ActivityLoader visible={loading} />
      <ScreenHeader
        title={strings.membershipFeeTitle}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        isRightIconText
        rightButtonText={strings.save}
        onRightButtonPress={updateGroup}
      />
      <View style={{paddingTop: 20, paddingHorizontal: 15}}>
        <View style={{marginBottom: 35}}>
          <Text style={[styles.label, {marginBottom: 10}]}>
            {strings.membershipregfee.toUpperCase()}
          </Text>
          <Pressable
            style={[
              styles.inputContainer,
              {
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 6,
              },
            ]}>
            <View style={{flex: 1, marginRight: 5}}>
              <TextInput
                style={styles.input}
                value={registerationFee}
                onChangeText={(value) => setRegisterationFee(value)}
              />
            </View>
            <View>
              <Text style={[styles.label, {fontFamily: fonts.RRegular}]}>
                {currencyType}
              </Text>
            </View>
          </Pressable>
        </View>

        <View style={{marginBottom: 35}}>
          <Text style={[styles.label, {marginBottom: 10}]}>
            {strings.membershipFee.toUpperCase()}
          </Text>

          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, marginRight: 15}}>
              <RNPickerSelect
                placeholder={{
                  label: strings.membershipFee,
                  value: null,
                }}
                items={groupMembershipFeeTypes}
                onValueChange={(value) => {
                  setMembershipFeeType(value);
                }}
                value={membershipFeeType}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: {
                    fontSize: 16,
                    paddingVertical: 12,
                    paddingHorizontal: 15,
                    color: colors.lightBlackColor,
                    paddingRight: 30,
                    backgroundColor: colors.textFieldBackground,
                    borderRadius: 5,
                    textAlign: 'center',
                  },
                  inputAndroid: {
                    fontSize: 16,
                    paddingVertical: 12,
                    paddingHorizontal: 15,
                    color: colors.lightBlackColor,
                    paddingRight: 30,
                    backgroundColor: colors.textFieldBackground,
                    borderRadius: 5,
                    height: 40,
                    textAlign: 'center',
                  },
                }}
                Icon={() => (
                  <Image source={images.dropDownArrow} style={styles.image} />
                )}
              />
            </View>
            <Pressable
              style={[styles.inputContainer, {flex: 1, alignItems: 'flex-end'}]}
              onPress={() => setShowModal(true)}>
              <Text style={[styles.label, {fontFamily: fonts.RRegular}]}>
                {currencyType}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={{marginBottom: 35}}>
          <Text style={[styles.label, {marginBottom: 10}]}>
            {strings.detailText.toUpperCase()}
          </Text>
          <Pressable
            style={[styles.inputContainer, {height: 193}]}
            onPress={() => {
              inputRef.current.focus();
            }}>
            <TextInput
              ref={inputRef}
              multiline
              style={styles.input}
              value={details}
              onChangeText={(value) => setDetails(value)}
            />
          </Pressable>
        </View>
      </View>

      <CurrencyModal
        isVisible={showModal}
        closeList={() => setShowModal(false)}
        onNext={(currency) => {
          setCurrencyType(currency);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  inputContainer: {
    backgroundColor: colors.textFieldBackground,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
  },
  input: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    padding: 0,
  },
  image: {
    alignSelf: 'center',
    height: 15,
    resizeMode: 'contain',
    right: 10,
    top: 13,
    width: 15,
  },
});
export default MembershipFeeScreen;
