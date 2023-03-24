// @flow
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
  Image,
  Animated,
  Pressable,
  Alert,
  Modal,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {strings} from '../../../../../Localization/translation';
import {patchPlayer} from '../../../../api/Users';
import AuthContext from '../../../../auth/context';
import BottomSheet from '../../../../components/modals/BottomSheet';
import TCInnerLoader from '../../../../components/TCInnerLoader';
import colors from '../../../../Constants/Colors';
import images from '../../../../Constants/ImagePath';
import Verbs from '../../../../Constants/Verbs';
import {setAuthContextData} from '../../../../utils';
import uploadImages from '../../../../utils/imageAction';
import styles from './CertificateDisplayStyles';

const CertificateDisplayScreen = ({navigation, route}) => {
  const [showActions, setShowActions] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatedCertificate, setUpdatedCertificate] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const animationRef = useRef(new Animated.Value(1)).current;
  const timeoutRef = useRef();

  const {user, certificate, count, sport, entityType} = route.params;
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (certificate) {
      setUpdatedCertificate({...certificate});
    }
  }, [certificate]);

  const handleActions = (option) => {
    setShowActions(false);
    switch (option) {
      case strings.edit:
        setShowEditModal(true);
        break;

      case strings.delete:
        handleDelete();
        break;

      case strings.reportCertificate:
        break;

      case strings.reportUser:
        break;

      default:
        break;
    }
  };

  const startAnimation = useCallback(() => {
    setIsVisible(!isVisible);
    Animated.timing(animationRef, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [isVisible, animationRef]);

  const resetAnimation = () => {
    setIsVisible(!isVisible);
    Animated.timing(animationRef, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        startAnimation();
      }, 5000);
    } else {
      clearTimeout(timeoutRef.current);
    }
  }, [isVisible, startAnimation]);

  const getSportObj = async () => {
    const userData = authContext.entity.obj;
    let sportObj = {};
    if (entityType === Verbs.entityTypeReferee) {
      sportObj = (userData?.referee_data ?? []).find(
        (item) => item.sport === sport,
      );
    }
    if (entityType === Verbs.entityTypeScorekeeper) {
      sportObj = (userData?.scorekeeper_data ?? []).find(
        (item) => item.sport === sport,
      );
    }
    return {...sportObj};
  };

  const getUpdatedData = async (list = []) => {
    const userData = authContext.entity.obj;
    const data = {...userData};
    if (entityType === Verbs.entityTypeReferee) {
      data.referee_data = (userData?.referee_data ?? []).map((item) => {
        if (item.sport === sport) {
          return {
            ...item,
            certificates: [...list],
          };
        }
        return item;
      });
    }
    if (entityType === Verbs.entityTypeScorekeeper) {
      data.scorekeeper_data = (userData?.scorekeeper_data ?? []).map((item) => {
        if (item.sport === sport) {
          return {
            ...item,
            certificates: [...list],
          };
        }
        return item;
      });
    }
    return {...data};
  };

  const updateUser = (data = {}, sportObj = {}, userData = {}) => {
    patchPlayer(data, authContext)
      .then(async (res) => {
        setLoading(false);
        setIsUpdating(false);
        await setAuthContextData(res.payload, authContext);
        navigation.navigate('SportActivityHome', {
          sport: sportObj?.sport,
          sportType: sportObj?.sport_type,
          uid: userData.user_id,
          entityType,
        });
      })
      .catch((error) => {
        setLoading(false);
        setIsUpdating(false);
        Alert.alert(strings.alertmessagetitle, error.message);
      });
  };

  const handleDelete = async () => {
    setLoading(true);
    const userData = authContext.entity.obj;
    const sportObj = await getSportObj();
    const list = sportObj.certificates.filter(
      (item) =>
        certificate.url !== item.url && certificate.title !== item.title,
    );
    const data = await getUpdatedData(list);
    updateUser(data, sportObj, userData);
  };

  const checkValidation = () => {
    let isValid = true;
    if (updatedCertificate?.title === '' && updatedCertificate?.url === '') {
      isValid = isValid && true;
    } else if (updatedCertificate?.url && !updatedCertificate?.title) {
      isValid = false;
      Alert.alert(strings.warningCertificateTitleText);
    } else if (updatedCertificate?.title && !updatedCertificate?.url) {
      isValid = false;
      Alert.alert(strings.warningCertificateImageText);
    }
    return isValid;
  };

  const handleCertification = async () => {
    const result = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      maxFiles: 1,
    });

    if (result?.path) {
      const obj = {
        ...updatedCertificate,
        url: result.path,
        thumbnail: result.path,
        isLoading: true,
      };
      setUpdatedCertificate(obj);
      uploadImages([result], authContext)
        .then((responses) => {
          const img = {
            ...updatedCertificate,
            url: responses?.[0].fullImage ?? '',
            thumbnail: responses?.[0].thumbnail ?? '',
            isLoading: false,
          };
          setUpdatedCertificate(img);
        })
        .catch(() => {
          const image = {
            ...updatedCertificate,
            url: result.path,
            thumbnail: result.path,
            isLoading: false,
          };
          setUpdatedCertificate(image);
        });
    }
  };

  const onSave = async () => {
    if (checkValidation()) {
      setIsUpdating(true);
      const userData = authContext.entity.obj;
      const sportObj = await getSportObj();
      const list = sportObj.certificates.map((item) => {
        if (certificate.url === item.url) {
          return {...updatedCertificate};
        }
        return item;
      });
      const data = await getUpdatedData(list);
      updateUser(data, sportObj, userData);
    }
  };

  return (
    <SafeAreaView style={styles.parent}>
      <StatusBar backgroundColor={colors.blackColor} barStyle="light-content" />
      <Animated.View
        style={[
          styles.row,
          {justifyContent: 'space-between', paddingHorizontal: 10},
          Platform.OS === 'android' ? {paddingTop: 10} : {},
          {opacity: animationRef},
        ]}>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, {width: 25, height: 25, marginRight: 10}]}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image source={images.whiteBackArrow} style={styles.image} />
          </TouchableOpacity>
          <View style={styles.profile}>
            <Image
              source={
                user?.full_image
                  ? {uri: user.full_image}
                  : images.profilePlaceHolder
              }
              style={styles.image}
            />
          </View>
          <View>
            <Text style={styles.userName}>{user?.full_name}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.countContainer}>
            <Text style={styles.countText}>{count}</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowActions(true)}>
            <Image source={images.white3Dots} style={styles.image} />
          </TouchableOpacity>
        </View>
      </Animated.View>
      <Pressable
        style={{
          justifyContent: 'center',
          marginBottom: Platform.OS === 'ios' ? 50 : 0,
        }}
        onPress={() => (isVisible ? startAnimation() : resetAnimation())}>
        <Image
          source={{uri: certificate.url}}
          style={styles.aspectRatioVertical}
        />
        <Animated.Text style={[styles.title, {opacity: animationRef}]}>
          {certificate.title}
        </Animated.Text>
      </Pressable>
      <BottomSheet
        optionList={
          user?.user_id === authContext.entity.obj.user_id
            ? [strings.edit, strings.delete]
            : [strings.reportCertificate, strings.reportUser]
        }
        isVisible={showActions}
        closeModal={() => setShowActions(false)}
        onSelect={handleActions}
      />
      <Modal visible={loading} transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.7)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size={'large'} color={colors.whiteColor} />
        </View>
      </Modal>

      <Modal visible={showEditModal} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <View style={{flex: 1}}>
                <Pressable
                  style={{width: 26, height: 26}}
                  onPress={() => setShowEditModal(false)}>
                  <Image source={images.crossImage} style={styles.image} />
                </Pressable>
              </View>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>
                  {strings.editCertificateText}
                </Text>
              </View>
              <Pressable
                style={styles.buttonContainer}
                onPress={() => (isUpdating ? {} : onSave())}>
                {isUpdating ? (
                  <ActivityIndicator size={'small'} />
                ) : (
                  <Text style={styles.buttonText}>{strings.save}</Text>
                )}
              </Pressable>
            </View>
            <View style={styles.divider} />
            <View style={{paddingHorizontal: 15, paddingTop: 20}}>
              <Text style={styles.modalTitle}>{strings.addCertiMainTitle}</Text>
              <View>
                <View style={{...styles.row, marginBottom: 15}}>
                  <View style={styles.searchView}>
                    <TextInput
                      style={styles.searchTextField}
                      placeholder={strings.titleOrDescriptionText}
                      value={updatedCertificate.title}
                      onChangeText={(text) => {
                        const obj = {...updatedCertificate, title: text};
                        setUpdatedCertificate(obj);
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.modalButtonContainer}
                    onPress={handleCertification}>
                    <Image
                      source={images.certificateCamera}
                      style={[styles.image, {borderRadius: 0}]}
                    />
                  </TouchableOpacity>
                </View>
                <View style={[styles.row, {justifyContent: 'space-between'}]}>
                  {updatedCertificate.url ? (
                    <View style={styles.certificateContainer}>
                      <Image
                        source={{uri: updatedCertificate.url}}
                        style={[styles.image, {borderRadius: 0}]}
                      />
                      <TouchableOpacity
                        style={styles.closeIcon}
                        onPress={handleCertification}>
                        <Image
                          source={images.refreshIcon}
                          style={styles.image}
                        />
                      </TouchableOpacity>
                      {updatedCertificate.isLoading ? (
                        <View style={styles.maskView}>
                          <TCInnerLoader visible />
                          <Text style={styles.maskViewText}>
                            {strings.uploadingText}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  ) : (
                    <View />
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CertificateDisplayScreen;
