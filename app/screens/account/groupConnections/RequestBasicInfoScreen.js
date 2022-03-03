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
} from 'react-native';

import RNPickerSelect from 'react-native-picker-select';
import {
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useIsFocused} from '@react-navigation/native';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import {approveBasicInfoRequest, getGroupMembersInfo} from '../../../api/Groups';
import strings from '../../../Constants/String';
import images from '../../../Constants/ImagePath';

import fonts from '../../../Constants/Fonts';
import TCTextField from '../../../components/TCTextField';
import TCPhoneNumber from '../../../components/TCPhoneNumber';
import TCMessageButton from '../../../components/TCMessageButton';
import TCThickDivider from '../../../components/TCThickDivider';

import TCTouchableLabel from '../../../components/TCTouchableLabel';
import TCDateTimePicker from '../../../components/TCDateTimePicker';
import TCKeyboardView from '../../../components/TCKeyboardView';
import AuthContext from '../../../auth/context';
import colors from '../../../Constants/Colors';

let entity = {};

export default function RequestBasicInfoScreen({navigation, route}) {
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
  const [memberInfo, setMemberInfo] = useState();
  const [show, setShow] = useState(false);
  const [role, setRole] = useState('');
  const [phoneNumber, setPhoneNumber] = useState([
    {
      id: 0,
      phone_number: '',
      country_code: '',
    },
  ]);
  console.log('memberInfo11', memberInfo);

  const [location, setLocation] = useState(
    memberInfo?.city
      ? `${memberInfo?.city}, ${memberInfo?.state_abbr}, ${memberInfo?.country}`
      : '',
  );
  const [setting, setSetting] = useState();

  useEffect(() => {
    if (isFocused) {
      getMemberInfo();
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

  useEffect(() => {
    setPhoneNumber(
      memberInfo?.phone_numbers || [
        {
          id: 0,
          phone_number: '',
          country_code: '',
        },
      ],
    );
    setMemberInfo(memberInfo);
    getAuthEntity();
  }, []);

  const getMemberInfo = () => {
    setloading(true);
    getGroupMembersInfo(
      route?.params?.groupID,
      route?.params?.memberID,
      authContext,
    )
      .then((response) => {
        console.log('PROFILE RESPONSE11::', response.payload);
        setMemberInfo(response?.payload);
        setSetting({
          gender: !!response?.payload?.gender,
          birthday: !!response?.payload?.birthday,
          height: !!response?.payload?.height,
          weight: !!response?.payload?.weight,
          email: !!response?.payload?.email,
          phone: !!response?.payload?.phone_numbers,
          address:
            !!response?.payload?.street_address &&
            !!response?.payload?.city &&
            !!response?.payload?.state_abbr &&
            !!response?.payload?.country &&
            !!response?.payload?.postal_code,
        });
        if(response?.payload?.phone_numbers?.length > 0){
            setPhoneNumber(response?.payload?.phone_numbers)
        }
        if(response?.payload?.city){
            setLocation(memberInfo?.city && `${memberInfo?.city}, ${memberInfo?.state_abbr}, ${memberInfo?.country}`)
        }
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

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
  }, [navigation, memberInfo, role, phoneNumber, show,setting]);

  // Form Validation
  const checkValidation = () => {
    if (setting.birthday &&  memberInfo?.birthday === '') {
        Alert.alert('Towns Cup', 'Please fill birthday.');
        return false;
      }
   
   
    if (setting?.height && memberInfo.height) {
      if (!memberInfo.height.height_type) {
        Alert.alert('Towns Cup', 'Please select height measurement');
        return false;
      }
      if (memberInfo.height.height <= 0 || memberInfo.height.height >= 1000) {
        Alert.alert('Towns Cup', 'Please enter valid height.');
        return false;
      }
    }
    if (setting?.weight && memberInfo.weight) {
      if (!memberInfo.weight.weight_type) {
        Alert.alert('Towns Cup', 'Please select weight measurement');
        return false;
      }
      if (memberInfo.weight.weight <= 0 || memberInfo.weight.weight >= 1000) {
        Alert.alert('Towns Cup', 'Please enter valid weight.');
        return false;
      }
    }
    
    if (setting.phone){
        if(memberInfo?.phone_numbers?.length <= 0) {
            Alert.alert('Towns Cup', 'Please enter phone number.');
            return false;
        }
        const filteredNumber = memberInfo?.phone_numbers?.filter(
            (obj) =>
              ![null, undefined, ''].includes(
                obj.phone_number && obj.country_code,
              ),
          );
          console.log('filteredNumber',filteredNumber);
        if(filteredNumber?.length <= 0) {
            Alert.alert('Towns Cup', 'Please fill all phone number parameter.');
            return false;
        }
      }
    if (setting.address && !location && memberInfo?.street_address === '' && memberInfo?.postal_code === '') {
        Alert.alert('Towns Cup', 'Please enter all location parameter.');
        return false;
      }
    return true;
  };

  const editMemberBasicInfo = () => {
    // setloading(true);
    const bodyParams = {};
    console.log('SETTING PARAMS::', setting);
    bodyParams.gender = memberInfo?.gender;
    if(setting?.birthday === true){
        bodyParams.birthday = memberInfo?.birthday;
    }
    if(setting?.height === true){
        bodyParams.height = memberInfo?.height;
    }
    if(setting?.weight === true){
        bodyParams.weight = memberInfo?.weight;
    }
    if(setting?.phone === true){
        bodyParams.phone_numbers = memberInfo?.phone_numbers;
    }
    if(setting?.address === true){
        bodyParams.street_address = memberInfo?.street_address;
        bodyParams.city = memberInfo?.city;
        bodyParams.state_abbr = memberInfo?.state_abbr;
        bodyParams.country = memberInfo?.country;
        bodyParams.postal_code = memberInfo?.postal_code;
    }
    


    console.log('BODY PARAMS::', bodyParams);
    
    approveBasicInfoRequest(route?.params?.groupID, route?.params?.requestID, bodyParams, authContext)
      .then((response) => {
       
          console.log('BASIC INFO RESPONSE::', response);
          setloading(false);
          navigation.goBack();
        
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

  return (
    <TCKeyboardView>
      <ActivityLoader visible={loading} />
      <View>
        <Text style={styles.basicInfoText}>
          {entity?.obj?.group_name} wants to collect your basic info. You may
          choose the sections you want to send or edit each section befor you
          send the information.
        </Text>
        <TCThickDivider />
      </View>
      {/* <View>
        <View style={styles.checkBoxContainer}>
          <TouchableOpacity
            onPress={() => {
              setSetting({
                ...setting,
                gender: !setting?.gender,
              });
            }}>
            <Image
              source={
                setting?.gender === true  ? images.orangeCheckBox : images.uncheckWhite
              }
              style={{height: 22, width: 22, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
          <Text style={styles.checkBoxText}>Gender</Text>
        </View>
        <TCPicker
          dataSource={DataSource.Gender}
          placeholder={strings.selectGenderPlaceholder}
          value={memberInfo?.gender}
          onValueChange={(value) =>
            value !== '' && setMemberInfo({...memberInfo, gender: value})
          }
        />
      </View> */}
      <View>
        <View style={styles.checkBoxContainer}>
          <TouchableOpacity
            onPress={() => {
              setSetting({
                ...setting,
                birthday: !setting?.birthday,
              });
            }}>
            <Image
              source={
                setting?.birthday === true
                  ? images.orangeCheckBox
                  : images.uncheckWhite
              }
              style={{height: 22, width: 22, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
          <Text style={styles.checkBoxText}>Birthday</Text>
        </View>
        <TCTouchableLabel
          title={
            memberInfo?.birthday &&
            `${`${
              monthNames[new Date(memberInfo?.birthday).getMonth()]
            } ${new Date(memberInfo?.birthday).getDate()}`}, ${new Date(
              memberInfo?.birthday,
            ).getFullYear()}`
          }
          placeholder={strings.birthDatePlaceholder}
          onPress={() => setShow(!show)}
        />
      </View>

      <View style={styles.checkBoxContainer}>
        <TouchableOpacity
          onPress={() => {
            setSetting({
              ...setting,
              height: !setting?.height,
            });
          }}>
          <Image
            source={
              setting?.height === true
                ? images.orangeCheckBox
                : images.uncheckWhite
            }
            style={{height: 22, width: 22, resizeMode: 'contain'}}
          />
        </TouchableOpacity>
        <Text style={styles.checkBoxText}>Height</Text>
      </View>
      {heightView()}

      <View style={styles.checkBoxContainer}>
        <TouchableOpacity
          onPress={() => {
            setSetting({
              ...setting,
              weight: !setting?.weight,
            });
          }}>
          <Image
            source={
              setting?.weight ? images.orangeCheckBox : images.uncheckWhite
            }
            style={{height: 22, width: 22, resizeMode: 'contain'}}
          />
        </TouchableOpacity>
        <Text style={styles.checkBoxText}>Weight</Text>
      </View>
      {weightView()}

      {/* <View>
        <View style={styles.checkBoxContainer}>
          <TouchableOpacity
            onPress={() => {
              setSetting({
                ...setting,
                email: !setting?.email,
              });
            }}>
            <Image
              source={
                setting?.email ? images.orangeCheckBox : images.uncheckWhite
              }
              style={{height: 22, width: 22, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
          <Text style={styles.checkBoxText}>Email</Text>
        </View>
        <TCTextField
          value={memberInfo?.email}
          onChangeText={(text) => setMemberInfo({...memberInfo, email: text})}
          placeholder={strings.addressPlaceholder}
          keyboardType={'email-address'}
        />
      </View> */}
      <View>
        <View style={styles.checkBoxContainer}>
          <TouchableOpacity
            onPress={() => {
              setSetting({
                ...setting,
                phone: !setting?.phone,
              });
            }}>
            <Image
              source={
                setting?.phone ? images.orangeCheckBox : images.uncheckWhite
              }
              style={{height: 22, width: 22, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
          <Text style={styles.checkBoxText}>Phone</Text>
        </View>
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
      <View style={styles.checkBoxContainer}>
        <TouchableOpacity
          onPress={() => {
            setSetting({
              ...setting,
              address: !setting?.address,
            });
          }}>
          <Image
            source={
              setting?.address ? images.orangeCheckBox : images.uncheckWhite
            }
            style={{height: 22, width: 22, resizeMode: 'contain'}}
          />
        </TouchableOpacity>
        <Text style={styles.checkBoxText}>Address</Text>
      </View>
      <View>
        <View style={styles.checkBoxContainer}>
          <Text style={styles.checkBoxText}>Street Address</Text>
        </View>
        <TCTextField
          value={memberInfo?.street_address}
          onChangeText={(text) =>
            setMemberInfo({...memberInfo, street_address: text})
          }
          placeholder={strings.addressPlaceholder}
          keyboardType={'default'}
        />
      </View>

      <View style={styles.fieldView}>
        <View style={styles.checkBoxContainer}>
          <Text style={styles.checkBoxText}>State/Province/Region</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SearchLocationScreen', {
              comeFrom: 'RequestBasicInfoScreen',
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
        <View style={styles.checkBoxContainer}>
          <Text style={styles.checkBoxText}>Postal Code/Zip</Text>
        </View>
        <TCTextField
          value={memberInfo?.postal_code}
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

  checkBoxText: {
    marginLeft: 15,
    fontFamily: fonts.RRegular,
    fontSize: 20,
    color: colors.lightBlackColor,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
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
