import React, {
  useState,
  useLayoutEffect,
} from 'react';

import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';

import TCTouchableLabel from '../../components/TCTouchableLabel';
import TCTextField from '../../components/TCTextField';
import TCLabel from '../../components/TCLabel';
import TCPhoneNumber from '../../components/TCPhoneNumber';
import { updateUserProfile } from '../../api/Accountapi';
import ActivityLoader from '../../components/loader/ActivityLoader';
import strings from '../../Constants/String';
import * as Utility from '../../utils';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCDateTimePicker from '../../components/TCDateTimePicker';
import TCPicker from '../../components/TCPicker';

export default function UserBasicInfoScreen({ navigation, route }) {
  // For activity indicator
  const [loading, setloading] = useState(false);

  const [userData, setUserData] = useState(route.params.userDetails);
  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={ {
          marginEnd: 16,
          fontSize: 14,
          fontFamily: fonts.RRegular,
          color: colors.lightBlackColor,
        } } onPress={ () => {
          onSaveButtonClicked();
        } }>{strings.done}</Text>
      ),
    });
  }, [navigation, userData]);

  const onSaveButtonClicked = () => {
    setloading(true);
    const userProfile = {};
    userProfile.email = userData.email;
    userProfile.phone = userData.phone;
    userProfile.phone_country = userData.phone_country;
    userProfile.gender = userData.gender;
    userProfile.height = userData.height;
    userProfile.weight = userData.weight;
    userProfile.birthday = userData.birthday;
    updateUserProfile(userProfile).then(async (response) => {
      setloading(false);
      if (response && response.status === true) {
        // setTimeout(() => {
        //   Alert.alert('Towns Cup', 'Profile changed sucessfully');
        // }, 0.1)
        const entity = await Utility.getStorage('loggedInEntity')
        entity.obj = response.payload;
        entity.auth.user = response.payload;
        Utility.setStorage('loggedInEntity', entity);
        navigation.goBack();
      } else {
        setTimeout(() => {
          Alert.alert('Towns Cup', 'Something went wrong');
        }, 0.1)
      }
    })
  }

  const onBirthDayClicked = async () => {
    console.log('On BirthDay Clicked')
    setShow(!show)
  }

  // const onGenderClicked = async () => {
  //   console.log('On BirthDay Clicked')
  //   setShow(!show)
  // }

  // const onPhoneNumberCountryChanged = async (value, index) => {
  //   console.log('Value', value);
  //   console.log('Index', index);
  // }

  const handleDonePress = ({ date }) => {
    setShow(!show)
    setUserData({ ...userData, birthday: new Date(date).getTime() / 1000 })
  }
  const handleCancelPress = () => {
    setShow(!show)
  }

  const birthdayInString = (birthDate) => `${Utility.monthNames[new Date(birthDate * 1000).getMonth()]} ${new Date(birthDate * 1000).getDate()}, ${new Date(birthDate * 1000).getFullYear()}`

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <ActivityLoader visible={loading} />
        <View>
          <TCLabel title= {strings.emailPlaceHolder } style={{ marginTop: 37 }}/>
          <TCTextField
            placeholder={strings.enterEmailPlaceholder}
            onChangeText={(text) => setUserData({ ...userData, email: text })}
            value={userData.email}/>
        </View>

        <View>
          <TCLabel title= {strings.phone }/>
          <TCPhoneNumber
            marginBottom={2}
            placeholder={strings.selectCode}
            value={userData.phone_country}
            numberValue={userData.phone}
            onValueChange={(value) => {
              setUserData({ ...userData, phone_country: value })
            }} onChangeText={(text) => {
              setUserData({ ...userData, phone: text })
            }} />
        </View>

        <View>
          <TCLabel title= {strings.addressPlaceholder}/>
          {/* <TCTouchableLabel
           onPress = {() => onAddressClicked()}
           placeholder = {strings.addressPlaceholder}
           showNextArrow = {true}
          /> */}
          <TCTextField
            placeholder={strings.addressPlaceholder}
            />
        </View>

        <View>
          <TCLabel title= {strings.birth}/>
          <TCTouchableLabel
           onPress = {() => onBirthDayClicked()}
           placeholder = {strings.addBirthdayText}
           title={birthdayInString(userData.birthday)}
           showDownArrow = {true}
          />
        </View>

        <View>
          <TCLabel title= {strings.gender}/>
          <TCPicker dataSource={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
          ]}
          placeholder={strings.selectGenderPlaceholder}
          value={userData.gender} onValueChange={(value) => {
            setUserData({ ...userData, gender: value })
          }}
          />
        </View>

        <View>
          <TCLabel title= {strings.height } style={{ marginTop: 37 }}/>
          <TCTextField
            placeholder={strings.heightplaceholder}
            onChangeText={(text) => setUserData({ ...userData, height: text })}
            value={userData.height}/>
        </View>

        <View>
          <TCLabel title= {strings.weight } style={{ marginTop: 37 }}/>
          <TCTextField
            placeholder={strings.weightplaceholder}
            onChangeText={(text) => setUserData({ ...userData, weight: text })}
            value={userData.weight}/>
        </View>

        <View style={{ height: 50 }}/>

      </ScrollView>
      <TCDateTimePicker title={'Choose Birthday'} visible={show} onDone={handleDonePress} onCancel={handleCancelPress}/>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});
