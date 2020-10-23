import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
} from 'react';

import {
  View,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import TCGradientButton from '../../components/TCGradientButton';
import TCTouchableLabel from '../../components/TCTouchableLabel';
import TCTextField from '../../components/TCTextField';
import TCLabel from '../../components/TCLabel';
import TCProfileImageControl from '../../components/TCProfileImageControl'

import { updateUserProfile } from '../../api/Accountapi';
import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';
import strings from '../../Constants/String';
import * as Utility from '../../utils';
import colors from '../../Constants/Colors';

export default function EditPersonalProfileScreen({ navigation, route }) {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  // For activity indigator
  const [loading, setloading] = useState(false);

  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');

  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  const [description, setDescription] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Edit Personal Information',
    });
  }, [navigation]);

  useEffect(() => {
    if (route.params && route.params.city) {
      const newLocation = `${route.params.city}, ${route.params.state}, ${route.params.country}`;
      setLocation(newLocation);
      setCity(route.params.city);
      setState(route.params.state);
      setCountry(route.params.country);
    } else {
      getUserInformation();

      setCity('');
      setState('');
      setCountry('');
      setLocation('');
    }
  }, [isFocused]);

  // Form Validation
  const checkValidation = () => {
    if (fName === '') {
      Alert.alert('Towns Cup', 'First name cannot be blank');
      return false
    } if (lName === '') {
      Alert.alert('Towns Cup', 'Last name cannot be blank');
      return false
    } if (location === '') {
      Alert.alert('Towns Cup', 'Location cannot be blank');
      return false
    }

    return true
  };

  // Get user information from async store
  const getUserInformation = async () => {
    const userDetails = await Utility.getStorage('user')
    setFName(userDetails.first_name);
    setLName(userDetails.last_name);
    setCity(userDetails.city);
    setState(userDetails.state_abbr);
    setCountry(userDetails.country);
    setDescription(userDetails.description);
    setLocation(
      `${userDetails.city}, ${
        userDetails.state_abbr}, ${
        userDetails.country}`,
    );
  }

  const onSaveButtonClicked = () => {
    if (checkValidation()) {
      const bodyParams = {};
      bodyParams.first_name = fName;
      bodyParams.last_name = lName;
      bodyParams.full_name = `${fName} ${lName}`;
      bodyParams.city = city;
      bodyParams.state_abbr = state;
      bodyParams.country = country;
      bodyParams.description = description;
      setloading(true);
      updateUserProfile(bodyParams).then((response) => {
        console.log('response', response)

        setloading(false);
        if (response && response.status === true) {
          Alert.alert('Towns Cup', 'Profile changed sucessfully');
          Utility.setStorage('user', response.payload);
          authContext.setUser(response.payload);
        } else {
          Alert.alert('Towns Cup', 'Something went wrong');
        }
      })
    }
  }

  const onLocationClicked = async () => {
    navigation.navigate('SearchLocationScreen', {
      comeFrom: 'EditPersonalProfileScreen',
    })
  }

  const onBGImageClicked = () => {
    console.log('onBGImageClicked');
  }

  const onProfileImageClicked = () => {
    console.log('onProfileImageClicked');
  }

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <ActivityLoader visible={loading} />
        <TCProfileImageControl
        onPressBGImage={() => onBGImageClicked()}
        onPressProfileImage={() => onProfileImageClicked()} />

        <View>
          <TCLabel title= {strings.fnameText.toUpperCase() }/>
          <TCTextField
            placeholder={strings.enterFirstNamePlaceholder}
            onChangeText={(text) => setFName(text)}
            value={fName}/>
        </View>

        <View>
          <TCLabel title= {strings.lnameText.toUpperCase()}/>
          <TCTextField
            placeholder={strings.enterLastNamePlaceholder}
            onChangeText={(text) => setLName(text)}
            value={lName}/>
        </View>

        <View>
          <TCLabel title= {strings.locationTitle.toUpperCase()}/>
          <TCTouchableLabel
           title = {location}
           onPress = {() => onLocationClicked()}
           placeholder = {strings.searchCityPlaceholder}
           showDownArrow = {true}
          />
        </View>

        <View>
          <TCLabel title= {strings.descriptionText.toUpperCase()}/>
          <TCTextField
            placeholder={strings.enterBioPlaceholder}
            onChangeText={(text) => setDescription(text)}
            multiline
            value={description}
            style={ styles.descriptionTxt }
            />
        </View>

        <TCGradientButton
          title={strings.saveTitle}
          onPress = {() => onSaveButtonClicked()}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  bgImageStyle: {
    flex: 1,
    aspectRatio: 375 / 173,
    backgroundColor: colors.grayBackgroundColor,
  },
  profileImageStyle: {
    height: 82,
    width: 82,
    marginTop: -26,
    marginLeft: 15,
    borderRadius: 41,
  },
  bgCameraButtonStyle: {
    height: 22,
    width: 22,
    alignSelf: 'flex-end',
    marginEnd: 15,
    marginTop: -37,
  },
  profileCameraButtonStyle: {
    height: 22,
    width: 22,
    marginTop: -22,
    marginLeft: 72,
  },
  descriptionTxt: {
    height: 120,
  },
});
