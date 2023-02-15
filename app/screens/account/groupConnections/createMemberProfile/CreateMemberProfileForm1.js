/* eslint-disable array-callback-return */
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
  Platform,
} from 'react-native';

import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import images from '../../../../Constants/ImagePath';
import {strings} from '../../../../../Localization/translation';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCLable from '../../../../components/TCLabel';
import TCTextField from '../../../../components/TCTextField';
import AuthContext from '../../../../auth/context';
import {
  deleteConfirmation,
  showAlert,
  showAlertWithoutTitle,
} from '../../../../utils';
import TCFormProgress from '../../../../components/TCFormProgress';
import TCKeyboardView from '../../../../components/TCKeyboardView';
import DateTimePickerView from '../../../../components/Schedule/DateTimePickerModal';
import {checkTownscupEmail} from '../../../../api/Users';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import LocationModal from '../../../../components/LocationModal/LocationModal';

let entity = {};

export default function CreateMemberProfileForm1({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const actionSheet = useRef();
  const [showDate, setShowDate] = useState(false);
  const [role, setRole] = useState('');
  const [minDateValue, setMinDateValue] = useState(new Date());
  const [maxDateValue, setMaxDateValue] = useState(new Date());
  const [memberInfo, setMemberInfo] = useState({});
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [homeCity, setHomeCity] = useState();
  const [birthday, setBirthday] = useState();
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);

  useEffect(() => {
    const mindate = new Date();
    const maxdate = new Date();
    mindate.setFullYear(mindate.getFullYear() - 13);
    maxdate.setFullYear(maxdate.getFullYear() - 123);
    // setDateValue(mindate);
    setMinDateValue(mindate);
    setMaxDateValue(maxdate);
  }, []);

  useEffect(() => {
    const getAuthEntity = async () => {
      entity = authContext.entity;
      setRole(entity.role);
    };
    getAuthEntity();
  }, []);

  useEffect(() => {
    if (route?.params?.city) {
      setHomeCity(route?.params?.city);
    } else {
      setHomeCity('');
    }
  }, []);

  const checkValidation = useCallback(() => {
    if (!firstName) {
      showAlertWithoutTitle(strings.nameCanNotBlankText);
      return false;
    }
    if (!lastName) {
      showAlertWithoutTitle(strings.lastNameCanNotBlankText);
      return false;
    }
    if (!homeCity) {
      showAlertWithoutTitle(strings.homeCityCannotBlack);
      return false;
    }
    if (!email) {
      showAlertWithoutTitle(strings.emailNotBlankText);
      return false;
    }
    if (ValidateEmail(email) === false) {
      showAlertWithoutTitle(strings.validEmailMessage);
      return false;
    }

    return true;
  }, [email, firstName, lastName, homeCity]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.nextButtonStyle}
          onPress={() => {
            if (checkValidation()) {
              setLoading(true);
              checkUserIsRegistratedOrNotWithTownscup(email)
                .then((userExist) => {
                  if (!userExist) {
                    setLoading(false);

                    const form1Object = {
                      ...memberInfo,
                      is_member: true,
                      first_name: firstName,
                      last_name: lastName,
                      email,
                      home_city: homeCity,
                    };
                    // if (entity.role === Verbs.entityTypeTeam) {
                    //   navigation.navigate('CreateMemberProfileTeamForm3', {
                    //     form1: form1Object,
                    //   });
                    // } else if (entity.role === Verbs.entityTypeClub) {
                    //   navigation.navigate('CreateMemberProfileForm2', {
                    //     form1: form1Object,
                    //   });
                    // }
                    navigation.navigate('CreateMemberProfileForm2', {
                      form1: form1Object,
                    });
                  } else {
                    setTimeout(() => {
                      showAlert(strings.emailExistInTC);
                    });
                    setLoading(false);
                  }
                })
                .catch((error) => {
                  setTimeout(() => {
                    showAlert(error);
                  });
                  setLoading(false);
                });
            }
          }}>
          {strings.next}
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

    checkValidation,
    birthday,
    homeCity,
  ]);

  // Email input format validation
  const ValidateEmail = (emailAddress) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

  const openCamera = (width = 400, height = 400) => {
    check(
      Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
      }),
    )
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            showAlert(strings.thisFeaturesNotAvailableText);
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
                .catch(() => {});
            });
            break;
          case RESULTS.LIMITED:
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
              .catch(() => {});
            break;
          case RESULTS.BLOCKED:
            break;
        }
      })
      .catch((error) => {
        showAlert(error);
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
    setBirthday(new Date(date).getTime());
    setShowDate(!showDate);
  };
  const handleCancelPress = () => {
    setShowDate(!showDate);
  };

  const checkUserIsRegistratedOrNotWithTownscup = (emailID) =>
    new Promise((resolve) => {
      checkTownscupEmail(encodeURIComponent(emailID))
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    });

  const handleSetLocationOptions = (location) => {
    setHomeCity(
      [location.city, location.state, location.country]
        .filter((v) => v)
        .join(', '),
    );
  };

  return (
    <>
      <TCFormProgress totalSteps={3} curruentStep={1} />
      <ActivityLoader visible={loading} />
      <TCKeyboardView>
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
            <Image
              source={images.certificateUpload}
              style={styles.choosePhoto}
            />
          </TouchableOpacity>
        </View>

        <View>
          <TCLable title={strings.nameText.toUpperCase()} required={true} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 12,
            }}>
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
            />
          </View>
        </View>
        <View>
          <TCLable
            title={strings.homeCity.toUpperCase()}
            required={true}
            style={{marginBottom: 12}}
          />
          <TouchableOpacity onPress={() => setVisibleLocationModal(true)}>
            <TCTextField
              value={homeCity}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder={strings.homeCity}
              pointerEvents="none"
              editable={false}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TCLable
            title={strings.emailtitle.toUpperCase()}
            required={true}
            style={{marginBottom: 12}}
          />
          <TCTextField
            value={email}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(text) => setEmail(text)}
            placeholder={strings.emailPlaceHolder}
            keyboardType={'email-address'}
          />
          <Text style={styles.notesStyle}>{strings.emailNotes}</Text>
        </View>

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
              deleteConfirmation(
                strings.appName,
                strings.deleteConfirmationText,
                () => deleteImage(),
              );
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

      <LocationModal
        visibleLocationModal={visibleLocationModal}
        title={strings.homeCityTitleText}
        setVisibleLocationModalhandler={() => setVisibleLocationModal(false)}
        onLocationSelect={handleSetLocationOptions}
      />
    </>
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
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  choosePhoto: {
    position: 'absolute',
    width: 22,
    height: 22,
    bottom: 2,
    right: 0,
  },
  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },

  notesStyle: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.userPostTimeColor,
    margin: 15,
  },
});
