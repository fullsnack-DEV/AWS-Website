/* eslint-disable consistent-return */
/* eslint-disable default-case */
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useContext,
  useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
  TextInput,
} from 'react-native';

import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {useIsFocused} from '@react-navigation/native';

import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCPicker from '../../../../components/TCPicker';
import TCLable from '../../../../components/TCLabel';
import TCTextField from '../../../../components/TCTextField';
import TCPhoneNumber from '../../../../components/TCPhoneNumber';
import TCMessageButton from '../../../../components/TCMessageButton';
import TCTouchableLabel from '../../../../components/TCTouchableLabel';
import AuthContext from '../../../../auth/context';
import DataSource from '../../../../Constants/DataSource';
import {monthNames, widthPercentageToDP} from '../../../../utils';
import TCFormProgress from '../../../../components/TCFormProgress';
import TCKeyboardView from '../../../../components/TCKeyboardView';
import DateTimePickerView from '../../../../components/Schedule/DateTimePickerModal';

let entity = {};

export default function CreateMemberProfileForm1({navigation, route}) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();

  const actionSheet = useRef();
  const [showDate, setShowDate] = useState(false);
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');

  const [phoneNumber, setPhoneNumber] = useState([
    {
      id: 0,
      phone_number: '',
      country_code: '',
    },
  ]);

  const [minDateValue, setMinDateValue] = useState(new Date());
  const [maxDateValue, setMaxDateValue] = useState(new Date());
  const [memberInfo, setMemberInfo] = useState({});
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [gender, setGender] = useState();
  const [streetAddress, setStreetAddress] = useState();
  const [city, setCity] = useState();
  const [state, setState] = useState();
  const [country, setCountry] = useState();
  const [postalCode, setPostalCode] = useState();
  const [birthday, setBirthday] = useState();

  console.log('this value form1');

  useEffect(() => {
    const mindate = new Date();
    const maxdate = new Date();
    mindate.setFullYear(mindate.getFullYear() - 13);
    maxdate.setFullYear(maxdate.getFullYear() - 123);
    // setDateValue(mindate);
    setMinDateValue(mindate);
    setMaxDateValue(maxdate);

    console.log('Min date', mindate);
    console.log('Max date', maxdate);
  }, []);

  useEffect(() => {
    const getAuthEntity = async () => {
      entity = authContext.entity;
      setRole(entity.role);
    };
    getAuthEntity();
  }, []);

  useEffect(() => {
    if (isFocused) {
      if (route?.params?.city) {
        setCity(route?.params?.city);
        setState(route?.params?.state);
        setCountry(route?.params?.country);
        setLocation(
          `${route?.params?.city}, ${route?.params?.state}, ${route?.params?.country}`,
        );
      } else {
        setCity('');
        setState('');
        setCountry('');
        setLocation('');
      }
    }
  }, [isFocused]);

  const addPhoneNumber = () => {
    const obj = {
      id: phoneNumber.length === 0 ? 0 : phoneNumber.length,
      code: '',
      number: '',
    };
    setPhoneNumber([...phoneNumber, obj]);
  };

  const checkValidation = useCallback(() => {
    if (firstName === '') {
      Alert.alert(strings.appName, 'First name cannot be blank');
      return false;
    }
    if (lastName === '') {
      Alert.alert(strings.appName, 'Last name cannot be blank');
      return false;
    }
    if (email === '') {
      Alert.alert(strings.appName, 'Email cannot be blank');
      return false;
    }
    if (ValidateEmail(email) === false) {
      Alert.alert('', strings.validEmailMessage);
      return false;
    }

    return true;
  }, [email, firstName, lastName]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.nextButtonStyle}
          onPress={() => {
            if (checkValidation()) {
              if (entity.role === 'team') {
                navigation.navigate('CreateMemberProfileTeamForm2', {
                  form1: {
                    ...memberInfo,
                    is_member: true,
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    street_address: streetAddress,
                    city,
                    state_abbr: state,
                    country,
                    postal_code: postalCode,
                    birthday,
                    gender,
                  },
                });
              } else if (entity.role === 'club') {
                navigation.navigate('CreateMemberProfileClubForm2', {
                  form1: {
                    ...memberInfo,
                    is_member: true,
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    gender,
                    street_address: streetAddress,
                    city,
                    state_abbr: state,
                    country,
                    postal_code: postalCode,
                    birthday,
                  },
                });
              }
            }
          }}>
          Next
        </Text>
      ),
    });
  }, [
    navigation,
    memberInfo,
    role,
    showDate,
    firstName,
    lastName,
    email,
    streetAddress,
    city,
    state,
    country,
    postalCode,
    checkValidation,
    birthday,
    gender,
  ]);

  // Email input format validation
  const ValidateEmail = (emailAddress) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailAddress).toLowerCase());
  };

  const deleteImage = () => {
    setMemberInfo({...memberInfo, full_image: undefined});
  };

  const onProfileImageClicked = () => {
    setTimeout(() => {
      actionSheet.current.show();
    }, 0);
  };
  // const openCamera = (width = 400, height = 400) => {
  //   ImagePicker.openCamera({
  //     width,
  //     height,
  //     cropping: true,
  //   }).then((data) => {
  //     setMemberInfo({ ...memberInfo, full_image: data.path })
  //   });
  // }

  const openCamera = (width = 400, height = 400) => {
    check(PERMISSIONS.IOS.CAMERA)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            Alert.alert(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            request(PERMISSIONS.IOS.CAMERA).then(() => {
              ImagePicker.openCamera({
                width,
                height,
                cropping: true,
              })
                .then((data) => {
                  setMemberInfo({...memberInfo, full_image: data.path});
                })
                .catch((e) => {
                  Alert.alert(e);
                });
            });
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            ImagePicker.openCamera({
              width,
              height,
              cropping: true,
            })
              .then((data) => {
                setMemberInfo({...memberInfo, full_image: data.path});
              })
              .catch((e) => {
                Alert.alert(e);
              });
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch((error) => {
        Alert.alert(error);
      });
  };
  const openImagePicker = (width = 400, height = 400) => {
    ImagePicker.openPicker({
      width,
      height,
      cropping: true,
      cropperCircleOverlay: true,
    }).then((data) => {
      setMemberInfo({...memberInfo, full_image: data.path});
    });
  };
  const handleDonePress = (date) => {
    console.log('seleccccc', date);
    setBirthday(new Date(date).getTime());
    setShowDate(!showDate);
  };
  const handleCancelPress = () => {
    setShowDate(!showDate);
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

  return (
    <TCKeyboardView>
      <TCFormProgress totalSteps={role === 'club' ? 3 : 2} curruentStep={1} />

      <View style={styles.profileView}>
        <Image
          source={
            memberInfo.full_image
              ? {uri: memberInfo.full_image}
              : images.profilePlaceHolder
          }
          style={styles.profileChoose}
        />
        <TouchableOpacity
          style={styles.choosePhoto}
          onPress={() => onProfileImageClicked()}>
          <Image source={images.certificateUpload} style={styles.choosePhoto} />
        </TouchableOpacity>
      </View>

      <View>
        <TCLable title={'Name'} required={true} />
        <TCTextField
          value={firstName}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(text) => setFirstName(text)}
          placeholder={strings.firstName}
        />
        <TCTextField
          value={lastName}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(text) => setLastName(text)}
          placeholder={strings.lastName}
          style={{marginTop: 12}}
        />
      </View>

      <View>
        <TCLable title={'E-Mail'} required={true} />
        <TCTextField
          value={email}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(text) => setEmail(text)}
          placeholder={strings.addressPlaceholder}
          keyboardType={'email-address'}
        />
      </View>
      <View>
        <TCLable title={'Phone'} />
        <FlatList
          data={phoneNumber}
          renderItem={renderPhoneNumber}
          keyExtractor={(item, index) => index.toString()}></FlatList>
      </View>
      {phoneNumber?.length < 5 && (
        <TCMessageButton
          title={strings.addPhone}
          width={85}
          alignSelf="center"
          marginTop={15}
          onPress={() => addPhoneNumber()}
        />
      )}

      <View>
        <TCLable title={'Address'} />
        <TCTextField
          value={streetAddress}
          onChangeText={(text) => setStreetAddress(text)}
          placeholder={strings.addressPlaceholder}
          keyboardType={'default'}
          autoCapitalize="none"
          autoCorrect={false}
          // onFocus={() => setLocationFieldVisible(true)}
        />
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('SearchLocationScreen', {
            comeFrom: 'CreateMemberProfileForm1',
          })
        }>
        <TextInput
          placeholder={strings.searchCityPlaceholder}
          placeholderTextColor={colors.userPostTimeColor}
          style={[styles.matchFeeTxt, {marginBottom: 5}]}
          value={location}
          editable={false}
          pointerEvents="none"></TextInput>
      </TouchableOpacity>

      <View>
        <TCTextField
          value={postalCode}
          onChangeText={(text) => {
            const regex = /^[0-9a-zA-Z]+$/;
            if (text.match(regex) || text === '') {
              setPostalCode(text);
            }
          }}
          placeholder={strings.postalCodeText}
          keyboardType={'default'}
        />
      </View>

      <View>
        <TCLable title={'Birthday'} />
        {/* <TCTextField value={teamName} onChangeText={(text) => setTeamName(text)} placeholder={strings.addressPlaceholder} keyboardType={'default'}/> */}

        <TCTouchableLabel
          title={
            birthday &&
            `${`${monthNames[new Date(birthday).getMonth()]} ${new Date(
              birthday,
            ).getDate()}`}, ${new Date(birthday).getFullYear()}`
          }
          placeholder={strings.birthDatePlaceholder}
          onPress={() => setShowDate(!showDate)}
        />
      </View>
      <View>
        <TCLable title={'Gender'} />
        <TCPicker
          dataSource={DataSource.Gender}
          placeholder={strings.selectGenderPlaceholder}
          value={gender}
          onValueChange={(value) => {
            setGender(value);
          }}
        />
      </View>
      <View style={{marginLeft: 15, marginTop: 15}}>
        <Text style={styles.smallTxt}>
          (<Text style={styles.mendatory}>{strings.star} </Text>
          {strings.requiredText})
        </Text>
      </View>
      <View style={{marginBottom: 20}} />

      <ActionSheet
        ref={actionSheet}
        options={
          memberInfo.full_image
            ? [
                strings.camera,
                strings.album,
                strings.deleteTitle,
                strings.cancelTitle,
              ]
            : [strings.camera, strings.album, strings.cancelTitle]
        }
        destructiveButtonIndex={memberInfo.full_image && 2}
        cancelButtonIndex={memberInfo.full_image ? 3 : 2}
        onPress={(index) => {
          if (index === 0) {
            openCamera();
          } else if (index === 1) {
            openImagePicker();
          } else if (index === 2) {
            deleteImage();
          }
        }}
      />

      {showDate && (
        <View>
          <DateTimePickerView
            visible={showDate}
            date={birthday}
            onDone={handleDonePress}
            onCancel={handleCancelPress}
            onHide={handleCancelPress}
            minimumDate={maxDateValue}
            maximumDate={minDateValue}
            mode={'date'}
          />
        </View>
      )}
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  profileChoose: {
    height: 70,
    width: 70,
    borderRadius: 140,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  profileView: {
    backgroundColor: colors.whiteColor,
    height: 72,
    width: 72,
    borderRadius: 36,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center',
  },
  choosePhoto: {
    position: 'absolute',
    width: 22,
    height: 22,
    bottom: 0,
    right: 0,
  },
  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
  smallTxt: {
    color: colors.grayColor,
    fontSize: 12,
    fontFamily: fonts.RLight,
    textAlign: 'left',
  },
  mendatory: {
    color: 'red',
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
    shadowOpacity: 0.3,
    shadowRadius: 1,

    width: widthPercentageToDP('92%'),
  },
});
