/* eslint-disable no-else-return */

import React, {useState, useEffect, useRef, useContext, memo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {format} from 'react-string-format';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import CustomModalWrapper from '../../../../components/CustomModalWrapper';
import {ModalTypes} from '../../../../Constants/GeneralConstants';
import AuthContext from '../../../../auth/context';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import {patchMember} from '../../../../api/Groups';
import uploadImages from '../../../../utils/imageAction';
import images from '../../../../Constants/ImagePath';
import {strings} from '../../../../../Localization/translation';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCLable from '../../../../components/TCLabel';
import TCTextField from '../../../../components/TCTextField';
import TCKeyboardView from '../../../../components/TCKeyboardView';
import LocationModal from '../../../../components/LocationModal/LocationModal';

function EditMemberModal({isVisible, closeModal = () => {}, Info}) {
  const actionSheet = useRef();
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [editPhoto, setEditPhoto] = useState(false);

  const [memberInfo, setMemberInfo] = useState({});

  const [visibleLocationModal, setVisibleLocationModal] = useState(false);

  const [homeCity, setHomeCity] = useState();

  const [city, setCity] = useState();

  useEffect(() => {
    setMemberInfo(Info);

    setHomeCity(Info?.home_city);
  }, [isVisible]);

  const editInfo = () => {
    setloading(true);

    let bodyParams = {};
    if (editPhoto) {
      const imageArray = [];

      imageArray.push({path: memberInfo.full_image});
      uploadImages(imageArray, authContext)
        .then((responses) => {
          const attachments = responses.map((item) => ({
            type: 'image',
            url: item.fullImage,
            thumbnail: item.thumbnail,
          }));

          bodyParams = {
            full_image: attachments[0].url,
            thumbnail: attachments[0].thumbnail,
            first_name: memberInfo.first_name,
            last_name: memberInfo.last_name,
            use_profile_pic: false,
            home_city: homeCity,
            city,

            last_updatedBy: `${authContext.user.full_name}`,
          };

          editMemberInfo(
            memberInfo?.group?.group_id,
            memberInfo?.user_id,
            bodyParams,
          );
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    } else {
      if (memberInfo.connected) {
        bodyParams = {
          first_name: memberInfo.first_name,
          last_name: memberInfo.last_name,
          use_profile_pic: true,
          home_city: homeCity,
          city,
        };
      } else {
        bodyParams = {
          first_name: memberInfo.first_name,
          last_name: memberInfo.last_name,
          use_profile_pic: false,
          city,
          home_city: homeCity,
          last_updatedBy: `${authContext.user.full_name}`,
        };
      }

      editMemberInfo(
        memberInfo?.group?.group_id,
        memberInfo?.user_id,
        bodyParams,
      );
    }
  };

  const editMemberInfo = (groupID, memberID, param) => {
    patchMember(groupID, memberID, param, authContext)
      .then(() => {
        setloading(false);
        closeModal();
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };
  const checkValidation = () => {
    if (memberInfo.first_name === '') {
      Alert.alert(strings.appName, strings.firstnamevalidation);
      return false;
    }
    if (memberInfo.last_name === '') {
      Alert.alert(strings.appName, strings.lastnamevalidation);
      return false;
    }
    return true;
  };
  const onProfileImageClicked = () => {
    setTimeout(() => {
      actionSheet.current.show();
    }, 0);
  };
  const openCamera = (width = 400, height = 400) => {
    ImagePicker.openCamera({
      width,
      height,
      cropping: true,
    }).then((data) => {
      setEditPhoto(true);
      setMemberInfo({...memberInfo, full_image: data.path});
    });
  };
  const openImagePicker = (width = 400, height = 400) => {
    ImagePicker.openPicker({
      width,
      height,
      cropping: true,
      cropperCircleOverlay: true,
    }).then((data) => {
      setEditPhoto(true);
      setMemberInfo({...memberInfo, full_image: data.path});
    });
  };

  const actionSheetOpetions = () => {
    if (memberInfo?.connected) {
      return [
        strings.camera,
        strings.album,
        strings.profilePhotoUser,
        strings.cancelTitle,
      ];
    }
    return [strings.camera, strings.album, strings.cancelTitle];
  };

  const handleSetLocationOptions = (location) => {
    setHomeCity(
      [location.city, location.state, location.country]
        .filter((v) => v)
        .join(', '),
    );

    setCity(location.city);

    setMemberInfo({
      ...memberInfo,
      city: location.city,
      state_abbr: location.state,
      country: location.country,
    });
  };

  return (
    <>
      <CustomModalWrapper
        isVisible={isVisible}
        closeModal={closeModal}
        modalType={ModalTypes.style1}
        headerRightButtonText={strings.save}
        onRightButtonPress={() => {
          if (checkValidation()) {
            editInfo();
          }
        }}
        title={strings.editprofiletitle}
        containerStyle={{padding: 0, flex: 1}}>
        <ScrollView style={styles.mainContainer}>
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

            <View
              style={{
                marginTop: 8,
                marginHorizontal: 5,
              }}>
              <TCLable title={strings.nameText.toUpperCase()} required={true} />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <TCTextField
                  style={{
                    flex: 1,
                    marginHorizontal: 8,
                  }}
                  value={memberInfo?.first_name}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(text) =>
                    setMemberInfo({...memberInfo, first_name: text})
                  }
                  placeholder={strings.firstName}
                />
                <TCTextField
                  style={{
                    flex: 1,
                    marginHorizontal: 8,
                  }}
                  value={memberInfo?.last_name}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(text) =>
                    setMemberInfo({...memberInfo, last_name: text})
                  }
                  placeholder={strings.lastName}
                />
              </View>
            </View>
            <View>
              <TCLable
                title={strings.homeCity.toUpperCase()}
                required={true}
                style={{marginBottom: 10, marginTop: 25}}
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
                style={{marginBottom: 10, marginTop: 25}}
              />
              <TCTextField
                value={memberInfo?.email}
                autoCapitalize="none"
                editable={false}
                autoCorrect={false}
                placeholder={strings.emailPlaceHolder}
                keyboardType={'email-address'}
              />
              <Text style={styles.notesStyle}>
                {format(strings.emailNotes, authContext.entity.role)}
              </Text>
            </View>
          </TCKeyboardView>

          <ActionSheet
            ref={actionSheet}
            options={actionSheetOpetions()}
            cancelButtonIndex={memberInfo.connected ? 3 : 2}
            onPress={(index) => {
              if (index === 0) {
                openCamera();
              } else if (index === 1) {
                openImagePicker();
              } else if (index === 2) {
                if (memberInfo.connected) {
                  if (checkValidation()) {
                    editInfo();
                  }
                }
              }
            }}
          />
        </ScrollView>
      </CustomModalWrapper>
      <LocationModal
        visibleLocationModal={visibleLocationModal}
        title={strings.homeCityTitleText}
        setVisibleLocationModalhandler={() => setVisibleLocationModal(false)}
        onLocationSelect={handleSetLocationOptions}
        placeholder={strings.searchByCity}
      />
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
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
    marginTop: 25,

    justifyContent: 'center',
    alignItems: 'center',

    alignSelf: 'center',
  },
  choosePhoto: {
    position: 'absolute',
    width: 22,
    height: 22,
    bottom: 0,
    right: 0,
  },

  notesStyle: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.userPostTimeColor,
    margin: 15,
  },
});

export default memo(EditMemberModal);
