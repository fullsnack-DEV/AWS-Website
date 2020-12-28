import React, {
  useState, useEffect, useLayoutEffect, useRef, useContext,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,

} from 'react-native';

import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';

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
import TCDateTimePicker from '../../../../components/TCDateTimePicker';
import TCKeyboardView from '../../../../components/TCKeyboardView';
import AuthContext from '../../../../auth/context'
import DataSource from '../../../../Constants/DataSource';

let entity = {};

export default function CreateMemberProfileForm1({ navigation }) {
  const authContext = useContext(AuthContext)
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const actionSheet = useRef();
  const [show, setShow] = useState(false);
  const [locationFieldVisible, setLocationFieldVisible] = useState(false);
  const [role, setRole] = useState('');

  const [phoneNumber, setPhoneNumber] = useState([{
    id: 0,
    phone_number: '',
    country_code: '',
  }]);

  const [memberInfo, setMemberInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
  })

  useEffect(() => {
    const getAuthEntity = async () => {
      entity = authContext.entity
      setRole(entity.role);
    }
    getAuthEntity();
  }, [])
  const addPhoneNumber = () => {
    const obj = {
      id: phoneNumber.length === 0 ? 0 : phoneNumber.length,
      code: '',
      number: '',
    }
    setPhoneNumber([...phoneNumber, obj]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => {
          if (checkValidation()) {
            if (entity.role === 'team') {
              navigation.navigate('CreateMemberProfileTeamForm2', { form1: memberInfo })
            } else if (entity.role === 'club') {
              navigation.navigate('CreateMemberProfileClubForm2', { form1: memberInfo })
            }
          }
        }}>Next</Text>
      ),
    });
  }, [navigation, memberInfo, role, phoneNumber, show]);

  const checkValidation = () => {
    if (memberInfo.first_name === '') {
      Alert.alert('Towns Cup', 'First name cannot be blank');
      return false
    }
    if (memberInfo.last_name === '') {
      Alert.alert('Towns Cup', 'Last name cannot be blank');
      return false
    }
    if (memberInfo.email === '') {
      Alert.alert('Towns Cup', 'Email cannot be blank');
      return false
    }
    if (ValidateEmail(memberInfo.email) === false) {
      Alert.alert('Towns Cup', 'You have entered an invalid email address!');
      return false
    }

    return true
  };
  // Email input format validation
  const ValidateEmail = (emailAddress) => {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailAddress)) {
      return (true)
    }

    return (false)
  }
  const deleteImage = () => {
    setMemberInfo({ ...memberInfo, full_image: undefined })
  }

  const onProfileImageClicked = () => {
    setTimeout(() => {
      actionSheet.current.show();
    }, 0)
  }
  const openCamera = (width = 400, height = 400) => {
    ImagePicker.openCamera({
      width,
      height,
      cropping: true,
    }).then((data) => {
      setMemberInfo({ ...memberInfo, full_image: data.path })
    });
  }
  const openImagePicker = (width = 400, height = 400) => {
    ImagePicker.openPicker({
      width,
      height,
      cropping: true,
      cropperCircleOverlay: true,
    }).then((data) => {
      setMemberInfo({ ...memberInfo, full_image: data.path })
    });
  }
  const handleDonePress = ({ date }) => {
    setShow(!show)
    setMemberInfo({ ...memberInfo, birthday: new Date(date).getTime() })
  }
  const handleCancelPress = () => {
    setShow(!show)
  }
  const renderPhoneNumber = ({ item, index }) => (
    <TCPhoneNumber
     marginBottom={2}
    placeholder={strings.selectCode}
    value={item.country_code}
    numberValue={item.phone_number}
    onValueChange={(value) => {
      const tempCode = [...phoneNumber];
      tempCode[index].country_code = value;
      setPhoneNumber(tempCode);
      const filteredNumber = phoneNumber.filter((obj) => ![null, undefined, ''].includes(obj.phone_number && obj.country_code))
      setMemberInfo({ ...memberInfo, phone_numbers: filteredNumber.map(({ country_code, phone_number }) => ({ country_code, phone_number })) })
    }} onChangeText={(text) => {
      const tempPhone = [...phoneNumber];
      tempPhone[index].phone_number = text;
      setPhoneNumber(tempPhone);
      const filteredNumber = phoneNumber.filter((obj) => ![null, undefined, ''].includes(obj.phone_number && obj.country_code))
      setMemberInfo({ ...memberInfo, phone_numbers: filteredNumber.map(({ country_code, phone_number }) => ({ country_code, phone_number })) })
    }} />
  );
  return (
    <TCKeyboardView>

      <View style={styles.formSteps}>
        <View style={styles.form1}></View>
        <View style={styles.form2}></View>
        {role === 'club' && <View style={styles.form3}></View>}
      </View>

      <View style={styles.profileView}>
        <Image source={memberInfo.full_image ? { uri: memberInfo.full_image } : images.profilePlaceHolder} style={styles.profileChoose}/>
        <TouchableOpacity style={styles.choosePhoto} onPress={() => onProfileImageClicked()}>
          <Image source={images.certificateUpload} style={styles.choosePhoto}/>
        </TouchableOpacity>
      </View>

      <View>
        <TCLable title={'Name'} required={true}/>
        <TCTextField value={memberInfo.first_name} onChangeText={(text) => setMemberInfo({ ...memberInfo, first_name: text })} placeholder={strings.firstName}/>
        <TCTextField value={memberInfo.last_name} onChangeText={(text) => setMemberInfo({ ...memberInfo, last_name: text })} placeholder={strings.lastName} style={{ marginTop: 12 }}/>
      </View>

      <View>
        <TCLable title={'E-Mail'} required={true}/>
        <TCTextField value={memberInfo.email} onChangeText={(text) => setMemberInfo({ ...memberInfo, email: text })} placeholder={strings.addressPlaceholder} keyboardType={'email-address'}/>
      </View>

      <View>
        <TCLable title={'Phone'}/>

        <FlatList
                data={phoneNumber}
                renderItem={renderPhoneNumber}
                keyExtractor={(item, index) => index.toString()}
                // style={styles.flateListStyle}
                >
        </FlatList>

      </View>
      <TCMessageButton title={strings.addPhone} width={85} alignSelf = 'center' marginTop={15} onPress={() => addPhoneNumber()}/>
      <View>
        <TCLable title={'Street Address'} />
        <TCTextField value={memberInfo.street_address}
        onChangeText={(text) => setMemberInfo({ ...memberInfo, street_address: text })}
        placeholder={strings.addressPlaceholder}
        keyboardType={'default'}
        onFocus={() => setLocationFieldVisible(true)}/>
      </View>
      {locationFieldVisible && <View>
        <TCLable title={'city'} />
        <TCTextField value={memberInfo.city} onChangeText={(text) => setMemberInfo({ ...memberInfo, city: text })} placeholder={strings.cityText} keyboardType={'default'}/>
      </View>}
      {locationFieldVisible && <View>
        <TCLable title={'State/Province/Region'} />
        <TCTextField value={memberInfo.state_abbr} onChangeText={(text) => setMemberInfo({ ...memberInfo, state_abbr: text })} placeholder={strings.stateText} keyboardType={'default'}/>
      </View>}
      {locationFieldVisible && <View>
        <TCLable title={'Country'} />
        <TCTextField value={memberInfo.country} onChangeText={(text) => setMemberInfo({ ...memberInfo, country: text })} placeholder={strings.countryText} keyboardType={'default'}/>
      </View>}
      {locationFieldVisible && <View>
        <TCLable title={'Postal Code/Zip'} />
        <TCTextField value={memberInfo.postal_code} onChangeText={(text) => setMemberInfo({ ...memberInfo, postal_code: text })} placeholder={strings.postalCodeText} keyboardType={'default'}/>
      </View>}
      <View>
        <TCLable title={'Birthday'} />
        {/* <TCTextField value={teamName} onChangeText={(text) => setTeamName(text)} placeholder={strings.addressPlaceholder} keyboardType={'default'}/> */}

        <TCTouchableLabel
        title={memberInfo.birthday && `${`${monthNames[new Date(memberInfo.birthday).getMonth()]} ${new Date(memberInfo.birthday).getDate()}`}, ${new Date(memberInfo.birthday).getFullYear()}`}
      placeholder={strings.birthDatePlaceholder}
      onPress={() => setShow(!show)} />
      </View>
      <View >
        <TCLable title={'Gender'}/>
        <TCPicker dataSource={DataSource.Gender}
          placeholder={strings.selectGenderPlaceholder}
          value={memberInfo.gender} onValueChange={(value) => {
            setMemberInfo({ ...memberInfo, gender: value })
          }}
          />
      </View>
      <View style={{ marginLeft: 15, marginTop: 15 }}>
        <Text style={styles.smallTxt}>
          (<Text style={styles.mendatory}>{strings.star} </Text>
          {strings.requiredText})
        </Text>
      </View>
      <View style={{ marginBottom: 20 }}/>
      <ActionSheet
                ref={actionSheet}
                options={memberInfo.full_image ? [strings.camera, strings.album, strings.deleteTitle, strings.cancelTitle] : [strings.camera, strings.album, strings.cancelTitle]}
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

      <TCDateTimePicker title={'Choose Birthday'} visible={show} onDone={handleDonePress} onCancel={handleCancelPress}/>
    </TCKeyboardView>

  );
}
const styles = StyleSheet.create({

  form1: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form2: {
    backgroundColor: colors.lightgrayColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form3: {
    backgroundColor: colors.lightgrayColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },

  formSteps: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginRight: 15,
    marginTop: 15,
  },
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
    shadowOffset: { width: 0, height: 3 },
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
});
