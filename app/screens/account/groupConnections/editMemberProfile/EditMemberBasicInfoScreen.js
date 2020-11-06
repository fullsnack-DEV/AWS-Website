import React, {
  useState, useEffect, useLayoutEffect,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  FlatList,

} from 'react-native';

import ActivityLoader from '../../../../components/loader/ActivityLoader';
import { patchMember } from '../../../../api/Groups';
import * as Utility from '../../../../utils/index';
import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import TCPicker from '../../../../components/TCPicker';
import TCLable from '../../../../components/TCLabel';
import TCTextField from '../../../../components/TCTextField';
import TCPhoneNumber from '../../../../components/TCPhoneNumber';
import TCMessageButton from '../../../../components/TCMessageButton';
import TCTouchableLabel from '../../../../components/TCTouchableLabel';
import TCDateTimePicker from '../../../../components/TCDateTimePicker';
import TCKeyboardView from '../../../../components/TCKeyboardView';

let entity = {};

export default function EditMemberBasicInfoScreen({ navigation, route }) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const [loading, setloading] = useState(false);
  const [show, setShow] = useState(false);
  const [role, setRole] = useState('');
  const [phoneNumber, setPhoneNumber] = useState([{
    id: 0,
    phone_number: '',
    country_code: '',
  }]);

  const [memberInfo, setMemberInfo] = useState({})

  useEffect(() => {
    setPhoneNumber(route.params.memberInfo.phone_numbers || [{
      id: 0,
      phone_number: '',
      country_code: '',
    }])
    setMemberInfo(route.params.memberInfo)
    getAuthEntity();
  }, [])
  const addPhoneNumber = () => {
    const obj = {
      id: phoneNumber.length === 0 ? 0 : phoneNumber.length,
      country_code: '',
      phone_number: '',
    }
    setPhoneNumber([...phoneNumber, obj]);
  };

  const getAuthEntity = async () => {
    entity = await Utility.getStorage('loggedInEntity');
    setRole(entity.role);
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => {
          if (checkValidation()) {
            editMemberBasicInfo()
            // if (entity.role === 'team') {
            //   navigation.navigate('CreateMemberProfileTeamForm2', { form1: memberInfo })
            // } else if (entity.role === 'club') {
            //   navigation.navigate('CreateMemberProfileClubForm2', { form1: memberInfo })
            // }
          }
        }}>Done</Text>
      ),
    });
  }, [navigation, memberInfo, role, phoneNumber, show]);

  const checkValidation = () => {
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
  const editMemberBasicInfo = () => {
    setloading(true)
    const bodyParams = {};
    if (memberInfo.email && memberInfo.email !== '') {
      bodyParams.email = memberInfo.email;
    }
    if (memberInfo.phone_numbers.length) {
      bodyParams.phone_numbers = memberInfo.phone_numbers;
    } if (memberInfo.street_address && memberInfo.street_address !== '') {
      bodyParams.street_address = memberInfo.street_address;
    } if (memberInfo.city && memberInfo.city !== '') {
      bodyParams.city = memberInfo.city;
    } if (memberInfo.state_abbr && memberInfo.state_abbr !== '') {
      bodyParams.state_abbr = memberInfo.state_abbr;
    } if (memberInfo.country && memberInfo.country !== '') {
      bodyParams.country = memberInfo.country;
    } if (memberInfo.postal_code && memberInfo.postal_code !== '') {
      bodyParams.postal_code = memberInfo.postal_code;
    } if (memberInfo.birthday && memberInfo.birthday !== '') {
      bodyParams.birthday = memberInfo.birthday;
    } if (memberInfo.gender && memberInfo.gender !== '') {
      bodyParams.gender = memberInfo.gender;
    }

    console.log('BODY PARAMS::', bodyParams);
    patchMember(memberInfo.group.group_id, memberInfo.user_id, bodyParams).then((response) => {
      if (response.status) {
        console.log('EDIT INFO RESPONSE::', response);
        setloading(false)
        navigation.goBack()
      }
    })
      .catch((e) => {
        setloading(false)
        Alert.alert('', e.messages)
      });
  }
  const handleDonePress = ({ date }) => {
    setShow(!show)
    if (date !== '') {
      setMemberInfo({ ...memberInfo, birthday: new Date(date).getTime() })
    }
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
      <ActivityLoader visible={loading} />
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
        <TCTextField value={memberInfo.street_address} onChangeText={(text) => setMemberInfo({ ...memberInfo, street_address: text })} placeholder={strings.addressPlaceholder} keyboardType={'default'}/>
      </View>
      <View>
        <TCLable title={'city'} />
        <TCTextField value={memberInfo.city} onChangeText={(text) => setMemberInfo({ ...memberInfo, city: text })} placeholder={strings.cityText} keyboardType={'default'}/>
      </View>
      <View>
        <TCLable title={'State/Province/Region'} />
        <TCTextField value={memberInfo.state_abbr} onChangeText={(text) => setMemberInfo({ ...memberInfo, state_abbr: text })} placeholder={strings.stateText} keyboardType={'default'}/>
      </View>
      <View>
        <TCLable title={'Country'} />
        <TCTextField value={memberInfo.country} onChangeText={(text) => setMemberInfo({ ...memberInfo, country: text })} placeholder={strings.countryText} keyboardType={'default'}/>
      </View>
      <View>
        <TCLable title={'Postal Code/Zip'} />
        <TCTextField value={memberInfo.postal_code} onChangeText={(text) => setMemberInfo({ ...memberInfo, postal_code: text })} placeholder={strings.postalCodeText} keyboardType={'default'}/>
      </View>
      <View>
        <TCLable title={'Birthday'} />
        <TCTouchableLabel
          title={memberInfo.birthday && `${`${monthNames[new Date(memberInfo.birthday).getMonth()]} ${new Date(memberInfo.birthday).getDate()}`}, ${new Date(memberInfo.birthday).getFullYear()}`}
        placeholder={strings.birthDatePlaceholder}
        onPress={() => setShow(!show)} />
      </View>
      <View >
        <TCLable title={'Gender'}/>
        <TCPicker dataSource={[
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'Other', value: 'other' },
        ]}
            placeholder={strings.selectGenderPlaceholder}
            value={memberInfo.gender} onValueChange={(value) => value !== '' && setMemberInfo({ ...memberInfo, gender: value })}/>
      </View>
      <View style={{ marginBottom: 20 }}/>

      <TCDateTimePicker title={'Choose Birthday'} visible={show} onDone={handleDonePress} onCancel={handleCancelPress}/>
    </TCKeyboardView>

  );
}
const styles = StyleSheet.create({
  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
});
