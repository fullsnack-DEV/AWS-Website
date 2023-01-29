import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useContext,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
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

export default function EditMemberInfoScreen({navigation, route}) {
  const actionSheet = useRef();
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [editPhoto, setEditPhoto] = useState(false);

  const [memberInfo, setMemberInfo] = useState({});

  useEffect(() => {
    setMemberInfo(route.params.memberInfo);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.nextButtonStyle}
          onPress={() => {
            if (checkValidation()) {
              editInfo();
              // if (entity.role === 'team') {
              //   navigation.navigate('CreateMemberProfileTeamForm3', { form1: memberInfo })
              // } else if (entity.role === 'club') {
              //   navigation.navigate('CreateMemberProfileForm2', { form1: memberInfo })
              // }
            }
          }}>
          Done
        </Text>
      ),
    });
  }, [navigation, memberInfo]);

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
          };
          console.log('BODY PARAMS:', bodyParams);
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
        };
      } else {
        bodyParams = {
          first_name: memberInfo.first_name,
          last_name: memberInfo.last_name,
          use_profile_pic: false,
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
        navigation.goBack();
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
  // const deleteImage = () => {
  //   setEditPhoto(false);
  //   setMemberInfo({...memberInfo, full_image: undefined});
  // };

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

  return (
    <ScrollView style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
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

      {memberInfo?.connected ? (
        <Text
          style={
            styles.fixedNameText
          }>{`${memberInfo.first_name} ${memberInfo.last_name}`}</Text>
      ) : (
        <View>
          <TCLable title={strings.nameText} required={true} />
          <TCTextField
            value={memberInfo.first_name}
            onChangeText={(text) =>
              setMemberInfo({...memberInfo, first_name: text})
            }
            placeholder={strings.firstName}
          />
          <TCTextField
            value={memberInfo.last_name}
            onChangeText={(text) =>
              setMemberInfo({...memberInfo, last_name: text})
            }
            placeholder={strings.lastName}
            style={{marginTop: 12}}
          />
        </View>
      )}

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
  fixedNameText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
});
