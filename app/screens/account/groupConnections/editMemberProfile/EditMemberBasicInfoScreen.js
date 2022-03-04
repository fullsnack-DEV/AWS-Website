import React, {useState, useEffect, useLayoutEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  FlatList,
  TextInput,
  Image,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import RNPickerSelect from 'react-native-picker-select';
import {
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {useIsFocused} from '@react-navigation/native';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import {patchMember, sendBasicInfoRequest} from '../../../../api/Groups';
import strings from '../../../../Constants/String';
import images from '../../../../Constants/ImagePath';
import * as Utility from '../../../../utils/index';

import fonts from '../../../../Constants/Fonts';
import TCPicker from '../../../../components/TCPicker';
import TCLabel from '../../../../components/TCLabel';
import TCTextField from '../../../../components/TCTextField';
import TCPhoneNumber from '../../../../components/TCPhoneNumber';
import TCMessageButton from '../../../../components/TCMessageButton';
import TCThickDivider from '../../../../components/TCThickDivider';

import TCTouchableLabel from '../../../../components/TCTouchableLabel';
import TCDateTimePicker from '../../../../components/TCDateTimePicker';
import TCKeyboardView from '../../../../components/TCKeyboardView';
import AuthContext from '../../../../auth/context';
import DataSource from '../../../../Constants/DataSource';
import colors from '../../../../Constants/Colors';

let entity = {};

export default function EditMemberBasicInfoScreen({navigation, route}) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [loading, setloading] = useState(false);
  const [location, setLocation] = useState(
    route?.params?.memberInfo?.city
      ? `${route?.params?.memberInfo?.city}, ${route?.params?.memberInfo?.state_abbr}, ${route?.params?.memberInfo?.country}`
      : '',
  );

  const [show, setShow] = useState(false);
  const [role, setRole] = useState('');
  const [phoneNumber, setPhoneNumber] = useState([
    {
      id: 0,
      phone_number: '',
      country_code: '',
    },
  ]);

  const [memberInfo, setMemberInfo] = useState({});

  useEffect(() => {
    setPhoneNumber(
      route.params.memberInfo.phone_numbers || [
        {
          id: 0,
          phone_number: '',
          country_code: '',
        },
      ],
    );
    setMemberInfo(route.params.memberInfo);
    getAuthEntity();
  }, []);

  useEffect(() => {
    if (isFocused) {
      if (
        route?.params?.city &&
        route?.params?.state &&
        route?.params?.country
      ) {
        console.log('route?.params?.city', route?.params?.city);
        console.log('route?.params?.state', route?.params?.state);

        console.log('route?.params?.country', route?.params?.country);

        setMemberInfo({
          ...memberInfo,
          city: route?.params?.city,
          state_abbr: route?.params?.state,
          country: route?.params?.country,
        });

        setLocation(
          `${route?.params?.city}, ${route?.params?.state}, ${route?.params?.country}`,
        );
      }
    }
  }, [
    isFocused,
    route?.params?.city,
    route?.params?.country,
    route?.params?.state,
  ]);

  const addPhoneNumber = () => {
    const obj = {
      id: phoneNumber.length === 0 ? 0 : phoneNumber.length,
      country_code: '',
      phone_number: '',
    };
    setPhoneNumber([...phoneNumber, obj]);
  };

  const getAuthEntity = async () => {
    entity = authContext.entity;
    setRole(entity.role);
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.nextButtonStyle}
          onPress={() => {
            if (checkValidation()) {
              editMemberBasicInfo();
              // if (entity.role === 'team') {
              //   navigation.navigate('CreateMemberProfileTeamForm2', { form1: memberInfo })
              // } else if (entity.role === 'club') {
              //   navigation.navigate('CreateMemberProfileClubForm2', { form1: memberInfo })
              // }
            }
          }}>
          Done
        </Text>
      ),
    });
  }, [navigation, memberInfo, role, phoneNumber, show]);

  // Form Validation
  const checkValidation = () => {
    if (memberInfo.email) {
      if (!Utility.validateEmail(memberInfo.email)) {
        Alert.alert(strings.appName, 'Please enter valid email address.');
        return false;
      }
    }
    if (memberInfo.first_name === '') {
      Alert.alert(strings.appName, 'First name cannot be blank');
      return false;
    }
    if (memberInfo.last_name === '') {
      Alert.alert(strings.appName, 'Last name cannot be blank');
      return false;
    }
    if (memberInfo.city && memberInfo.state_abbr && memberInfo.country === '') {
      Alert.alert(strings.appName, 'Location cannot be blank');
      return false;
    }
    if (memberInfo.height) {
      if (!memberInfo.height.height_type) {
        Alert.alert(strings.appName, 'Please select height measurement');
        return false;
      }
      if (memberInfo.height.height <= 0 || memberInfo.height.height >= 1000) {
        Alert.alert(strings.appName, 'Please enter valid height.');
        return false;
      }
    }
    if (memberInfo.weight) {
      if (!memberInfo.weight.weight_type) {
        Alert.alert(strings.appName, 'Please select weight measurement');
        return false;
      }
      if (memberInfo.weight.weight <= 0 || memberInfo.weight.weight >= 1000) {
        Alert.alert(strings.appName, 'Please enter valid weight.');
        return false;
      }
    }

    return true;
  };

  const editMemberBasicInfo = () => {
    setloading(true);

    const bodyParams = {...memberInfo};
    delete bodyParams.group;
    // bodyParams.email = memberInfo?.email;
    // bodyParams.phone_numbers = memberInfo?.phone_numbers;
    // bodyParams.street_address = memberInfo?.street_address;
    // bodyParams.city = memberInfo?.city;
    // bodyParams.state_abbr = memberInfo?.state_abbr;
    // bodyParams.country = memberInfo?.country;
    // bodyParams.postal_code = memberInfo?.postal_code;
    // bodyParams.birthday = memberInfo?.birthday;
    // bodyParams.gender = memberInfo?.gender;

    console.log('BODY PARAMS::', bodyParams);
    patchMember(entity?.uid, memberInfo?.user_id, bodyParams, authContext)
      .then((response) => {
        if (response.status) {
          console.log('EDIT INFO RESPONSE::', response);
          setloading(false);
          navigation.goBack();
        }
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };
  const handleDonePress = ({date}) => {
    setShow(!show);
    if (date !== '') {
      setMemberInfo({...memberInfo, birthday: new Date(date).getTime()});
    }
  };
  const handleCancelPress = () => {
    setShow(!show);
  };
  const renderPhoneNumber = ({item, index}) => (
    <TCPhoneNumber
      marginBottom={2}
      placeholder={strings.selectCode}
      value={item.country_code}
      numberValue={item.phone_number}
      onValueChange={(value) => {
        const tempCode = [...phoneNumber];
        tempCode[index].country_code = value;
        setPhoneNumber(tempCode);
        const filteredNumber = phoneNumber.filter(
          (obj) =>
            ![null, undefined, ''].includes(
              obj.phone_number && obj.country_code,
            ),
        );
        setMemberInfo({
          ...memberInfo,
          phone_numbers: filteredNumber.map(({country_code, phone_number}) => ({
            country_code,
            phone_number,
          })),
        });
      }}
      onChangeText={(text) => {
        const tempPhone = [...phoneNumber];
        tempPhone[index].phone_number = text;
        setPhoneNumber(tempPhone);
        const filteredNumber = phoneNumber.filter(
          (obj) =>
            ![null, undefined, ''].includes(
              obj.phone_number && obj.country_code,
            ),
        );
        setMemberInfo({
          ...memberInfo,
          phone_numbers: filteredNumber.map(({country_code, phone_number}) => ({
            country_code,
            phone_number,
          })),
        });
      }}
    />
  );
  const shadowStyle = {
    elevation: 3,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.16,
    shadowRadius: 1,
  };
  const heightView = () => (
    <View style={styles.fieldView}>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 12,
          align: 'center',
          marginLeft: 15,
          marginRight: 15,
          justifyContent: 'space-between',
        }}>
        <View style={{...styles.halfMatchFeeView, shadowStyle}}>
          <TextInput
            placeholder={'Height'}
            style={{...styles.halffeeText, ...shadowStyle}}
            keyboardType={'phone-pad'}
            onChangeText={(text) => {
              setMemberInfo({
                ...memberInfo,
                height: {
                  height: text,
                },
              });
            }}
            value={memberInfo?.height?.height}
          />
        </View>
        <RNPickerSelect
          placeholder={{
            label: 'Height type',
            value: null,
          }}
          items={[
            {label: 'cm', value: 'cm'},
            {label: 'ft', value: 'ft'},
          ]}
          onValueChange={(value) => {
            setMemberInfo({
              ...memberInfo,
              height: {
                height: memberInfo?.height?.height,
                height_type: value,
              },
            });
          }}
          value={memberInfo?.height?.height_type}
          useNativeAndroidPickerStyle={false}
          style={{
            inputIOS: {
              fontSize: wp('3.5%'),
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: wp('45%'),
              color: 'black',
              paddingRight: 30,
              backgroundColor: colors.offwhite,
              borderRadius: 5,
              ...shadowStyle,
            },
            inputAndroid: {
              fontSize: wp('4%'),
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: wp('45%'),
              color: 'black',
              paddingRight: 30,
              backgroundColor: colors.offwhite,
              borderRadius: 5,
              ...shadowStyle,
            },
          }}
          Icon={() => (
            <Image source={images.dropDownArrow} style={styles.miniDownArrow} />
          )}
        />
      </View>
    </View>
  );

  const weightView = () => (
    <View style={styles.fieldView}>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 12,
          align: 'center',
          marginLeft: 15,
          marginRight: 15,
          justifyContent: 'space-between',
        }}>
        <View style={{...styles.halfMatchFeeView, ...shadowStyle}}>
          <TextInput
            placeholder={'Weight'}
            style={{...styles.halffeeText, ...shadowStyle}}
            keyboardType={'phone-pad'}
            onChangeText={(text) => {
              setMemberInfo({
                ...memberInfo,
                weight: {
                  weight: text,
                },
              });
            }}
            value={memberInfo?.weight?.weight}
          />
        </View>
        <RNPickerSelect
          placeholder={{
            label: 'Weight type',
            value: null,
          }}
          items={[
            {label: 'kg', value: 'kg'},
            {label: 'pound', value: 'pound'},
          ]}
          onValueChange={(value) => {
            setMemberInfo({
              ...memberInfo,
              weight: {
                weight: memberInfo?.weight?.weight,
                weight_type: value,
              },
            });
          }}
          value={memberInfo?.weight?.weight_type}
          useNativeAndroidPickerStyle={false}
          style={{
            inputIOS: {
              fontSize: wp('3.5%'),
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: wp('45%'),
              color: 'black',
              paddingRight: 30,
              backgroundColor: colors.offwhite,
              borderRadius: 5,
              ...shadowStyle,
            },
            inputAndroid: {
              fontSize: wp('4%'),
              paddingVertical: 12,
              paddingHorizontal: 15,
              width: wp('45%'),
              color: 'black',
              paddingRight: 30,
              backgroundColor: colors.offwhite,
              borderRadius: 5,
              ...shadowStyle,
            },
          }}
          Icon={() => (
            <Image source={images.dropDownArrow} style={styles.miniDownArrow} />
          )}
        />
      </View>
    </View>
  );

const sendRequestForBasicInfo=()=>{
setloading(true)
const membersIds = []
membersIds.push(memberInfo.user_id)
sendBasicInfoRequest(entity.uid,membersIds ,authContext).then((response)=>{
  setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, 'Request sent successfully.');
        }, 10);
  console.log('sendBasicInfoRequest',response);

  }) .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
}

  return (
    <TCKeyboardView>
      <ActivityLoader visible={loading} />
      <ScrollView>
        {memberInfo.connected && (
          <View>
            <TouchableOpacity
            onPress={() => {
              console.log('OK');
              // navigation.navigate('RequestBasicInfoScreen', {memberInfo});
              sendRequestForBasicInfo()
            }}
            style={styles.outerContainerStyle}>
              <LinearGradient
              colors={[colors.whiteColor, colors.whiteColor]}
              style={styles.containerStyle}>
                <Text
                style={[styles.buttonText, {color: colors.lightBlackColor}]}>
                  {'Send request for basic info'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.basicInfoText}>
              You can send a request to collect a member’s basic info. When it is
              accepted, this basic info will be updated with the information
              provided by the member.
            </Text>
            <TCThickDivider />
          </View>
      )}

        <View>
          <TCLabel title={'Gender'} />
          <TCPicker
          disabled={true}
          dataSource={DataSource.Gender}
          placeholder={strings.selectGenderPlaceholder}
          value={memberInfo.gender}
          onValueChange={(value) =>
            value !== '' && setMemberInfo({...memberInfo, gender: value})
          }
        />
        </View>
        <View>
          <TCLabel title={'Birthday'} />
          <TCTouchableLabel
          title={
            memberInfo.birthday &&
            `${`${
              monthNames[new Date(memberInfo.birthday).getMonth()]
            } ${new Date(memberInfo.birthday).getDate()}`}, ${new Date(
              memberInfo.birthday,
            ).getFullYear()}`
          }
          placeholder={strings.birthDatePlaceholder}
          onPress={() => setShow(!show)}
        />
        </View>

        <TCLabel title={'Height'} />
        {heightView()}

        <TCLabel title={'Weight'} />
        {weightView()}

        <View>
          <TCLabel title={'E-Mail'} required={true} />
          <TCTextField
          editable={false}
          value={memberInfo.email}
          onChangeText={(text) => setMemberInfo({...memberInfo, email: text})}
          placeholder={strings.addressPlaceholder}
          keyboardType={'email-address'}
        />
        </View>
        <View>
          <TCLabel title={'Phone'} />
          <FlatList
          data={phoneNumber}
          renderItem={renderPhoneNumber}
          keyExtractor={(item, index) => index.toString()}
          // style={styles.flateListStyle}
        />
        </View>
        <TCMessageButton
        title={strings.addPhone}
        width={85}
        alignSelf="center"
        marginTop={15}
        onPress={() => addPhoneNumber()}
      />
        <View>
          <TCLabel title={'Street Address'} />
          <TCTextField
          value={memberInfo.street_address}
          onChangeText={(text) =>
            setMemberInfo({...memberInfo, street_address: text})
          }
          placeholder={strings.addressPlaceholder}
          keyboardType={'default'}
        />
        </View>
        <View style={styles.fieldView}>
          <TCLabel title={strings.locationTitle} required={false} />
          <TouchableOpacity
          onPress={() =>
            navigation.navigate('SearchLocationScreen', {
              comeFrom: 'EditMemberBasicInfoScreen',
            })
          }>
            <TextInput
            placeholder={strings.searchCityPlaceholder}
            style={[styles.matchFeeTxt, {marginBottom: 5}]}
            value={location}
            editable={false}
            pointerEvents="none"></TextInput>
          </TouchableOpacity>
        </View>

        <View>
          <TCLabel title={'Postal Code/Zip'} />
          <TCTextField
          value={memberInfo.postal_code}
          onChangeText={(text) =>
            setMemberInfo({...memberInfo, postal_code: text})
          }
          placeholder={strings.postalCodeText}
          keyboardType={'default'}
        />
        </View>

        <View style={{marginBottom: 20}} />

        <TCDateTimePicker
        title={'Choose Birthday'}
        visible={show}
        onDone={handleDonePress}
        onCancel={handleCancelPress}
      />
      </ScrollView>
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
  basicInfoText: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    margin: 15,
  },
  miniDownArrow: {
    alignSelf: 'center',
    height: 12,
    resizeMode: 'contain',

    right: 15,
    tintColor: colors.grayColor,

    top: 15,
    width: 12,
  },
  halfMatchFeeView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    flexDirection: 'row',
    fontSize: wp('3.5%'),
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
    width: wp('46%'),
  },
  halffeeText: {
    alignSelf: 'center',
    fontSize: wp('3.8%'),
    width: '90%',
  },

  outerContainerStyle: {
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 1.5,
    marginTop: 15,
  },
  containerStyle: {
    flexDirection: 'row',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    width: '100%',
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 12,
    fontFamily: fonts.RBold,
  },
  fieldView: {
    marginTop: 15,
  },
  matchFeeTxt: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: widthPercentageToDP('3.8%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,

    width: widthPercentageToDP('92%'),
  },
});
