import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';
import * as Utility from '../../../utils';

import AuthContext from '../../../auth/context';
import images from '../../../Constants/ImagePath';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import strings from '../../../Constants/String';
import uploadImages from '../../../utils/imageAction';

import {
  getUserDetails,
  patchRegisterScorekeeperDetails,
} from '../../../api/Users';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import TCKeyboardView from '../../../components/TCKeyboardView';
import TCFormProgress from '../../../components/TCFormProgress';
import TCInnerLoader from '../../../components/TCInnerLoader';
import TCGradientButton from '../../../components/TCGradientButton';
import TCLabel from '../../../components/TCLabel';

const MAX_CERTIFICATE_UPLOAD = 5;

export default function RegisterScorekeeperForm2({navigation, route}) {
  const [loading, setloading] = useState(false);
  const authContext = useContext(AuthContext);

  const [certificate, setCertificate] = useState([{title: ''}]);
  const [validationError, setError] = useState(null);

  const [imageUploadingLoader, setImageUploadingLoader] = useState(null);
  const [currentScorekeeperData, setCurrentScorekeeperData] = useState([]);
  useEffect(() => {
    getUserDetails(authContext?.entity?.uid, authContext)
      .then((res) => {
        setCurrentScorekeeperData(res?.payload?.scorekeeper_data ?? []);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const checkValidation = () => {
    const findCertiTitleIndex = certificate?.findIndex(
      (item) => item?.title && (!item?.thumbnail || !item?.url),
    );
    if (findCertiTitleIndex !== -1) {
      setError({certificate: findCertiTitleIndex});
      Alert.alert(strings.appName, 'Add certificate');
      return false;
    }

    const findIndex = certificate?.findIndex(
      (item) => !item?.title && (item?.thumbnail || item?.url),
    );
    if (findIndex !== -1) {
      setError({certificate: findIndex});
      Alert.alert(strings.appName, 'Add title for certificate');
      return false;
    }
    setError(null);

    return true;
  };

  const registerScorekeeperCall = () => {
    const isValid = checkValidation();
    if (isValid) {
      setloading(true);
      if (route?.params?.bodyParams) {
        const bodyParams = {
          ...route?.params?.bodyParams,
          certificates: certificate,
          is_published: true,
          type: 'scorekeeper',
        };
        bodyParams.certificates.pop();

        const scorekeeperData = currentScorekeeperData;
        scorekeeperData.push(bodyParams);

        const auth = {
          ...authContext?.entity?.obj,
          sport_setting: {},
        };

        let registerdScorekeeperData =
          authContext?.entity?.obj?.scorekeeper_data || [];

        if (
          authContext?.entity?.obj?.scorekeeper_data?.some(
            (obj) =>
              obj.sport === bodyParams.sport &&
              obj.sport_type === bodyParams.sport_type,
          )
        ) {
          registerdScorekeeperData =
            authContext?.entity?.obj?.scorekeeper_data.map((item) => {
              return item.sport === bodyParams.sport &&
                item.sport_type === bodyParams.sport_type
                ? {
                    ...item,
                    is_published: true,
                  }
                : item;
            });
        } else {
          registerdScorekeeperData.push(bodyParams);
        }

        const body = {
          ...auth,
          scorekeeper_data: registerdScorekeeperData,
        };

        console.log('All data:=>', body);

        patchRegisterScorekeeperDetails(body, authContext)
          .then(async (res) => {
            console.log('scorekeeper Data:=>', res.payload);
            setloading(false);
            const entity = authContext.entity;
            entity.auth.user = res.payload;
            entity.obj = res.payload;
            authContext.setEntity({...entity});
            await Utility.setStorage('authContextUser', res.payload);
            await Utility.setStorage('authContextEntity', {...entity});

            Alert.alert(
              strings.scorekeeperRegisteredSuccess,
              '',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    navigation.pop(2);
                  },
                },
              ],
              {cancelable: false},
            );
          })
          .catch((error) => {
            Alert.alert(error);
          })
          .finally(() => setloading(false));
      }
    }
  };

  const addMore = () => {
    setCertificate([...certificate, {}]);
  };
  const renderItem = ({item, index}) => (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <View style={{flexDirection: 'column'}}>
        <View style={styles.addCertificateView}>
          <TextInput
            placeholder={strings.titleOrDescriptionText}
            style={{
              ...styles.certificateDescription,
              borderWidth: validationError?.certificate === index ? 1 : 0,
              borderColor:
                validationError?.certificate === index
                  ? colors.redDelColor
                  : colors.whiteColor,
            }}
            onChangeText={(text) => {
              const certi = certificate;
              certi[index] = {
                ...certi[index],
                title: text,
              };
              setCertificate([...certi]);
            }}
            value={certificate?.[index]?.title}
          />
        </View>
        {/* eslint-disable-next-line no-mixed-operators */}
        {/* {(item?.url || item?.title) ? ( */}
        <TouchableOpacity
          onPress={() => {
            if (certificate?.length === 1) {
              setCertificate([{}]);
            } else if (index !== certificate?.length - 1) {
              const certiUrl = certificate;
              certiUrl.splice(index, 1);
              setCertificate([...certiUrl]);
            }
          }}></TouchableOpacity>
        {/* ) : null} */}
        {!item?.url && (
          <TouchableWithoutFeedback
            onPress={() => {
              ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
                maxFiles: 10,
              }).then((pickImages) => {
                setImageUploadingLoader(index);
                const certiUrl = certificate;
                certiUrl[index] = {
                  ...certiUrl[index],
                  url: pickImages?.path,
                };
                setCertificate([...certiUrl]);
                uploadImages([pickImages], authContext)
                  .then((responses) => {
                    certiUrl[index] = {
                      ...certiUrl[index],
                      url: responses?.[0].fullImage ?? '',
                      thumbnail: responses?.[0].thumbnail ?? '',
                    };
                    setCertificate([...certiUrl]);
                  })
                  .catch(() => {
                    certiUrl.splice(index, 1);
                    setCertificate([...certiUrl]);
                  })
                  .finally(() => {
                    setTimeout(() => setImageUploadingLoader(null), 1500);
                    if (certificate?.length < MAX_CERTIFICATE_UPLOAD) {
                      addMore();
                    }
                  });
              });
            }}>
            <View style={styles.addCertificateButton}>
              <Text style={styles.addCertificateText} numberOfLines={1}>
                {strings.addCertificateTitle}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
      {item?.url && (
        <View
          style={{
            padding: 15,
            alignSelf: 'flex-start',
          }}>
          <View>
            <FastImage
              resizeMode={FastImage.resizeMode.cover}
              source={{uri: certificate?.[index]?.url}}
              style={{width: 195, height: 150, borderRadius: 10}}
            />

            <TouchableOpacity
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                position: 'absolute',
                height: 22,
                width: 22,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
                right: -10,
                top: -5,
              }}
              onPress={() => {
                certificate.splice(index, 1);
                setCertificate([...certificate]);
              }}>
              <Image
                source={images.menuClose}
                style={{
                  zIndex: 100,
                  tintColor: colors.whiteColor,
                  height: 15,
                  width: 15,
                }}
              />
            </TouchableOpacity>

            {index === imageUploadingLoader && (
              <View
                style={{
                  alignSelf: 'center',
                  position: 'absolute',
                  height: 150,
                  width: 195,
                  borderRadius: 10,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <TCInnerLoader visible={index === imageUploadingLoader} />
                <Text
                  style={{
                    fontFamily: fonts.RLight,
                    fontSize: 20,
                    color: colors.yellowColor,
                    marginLeft: 5,
                  }}>
                  Uploading...
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );

  return (
    <>
      <TCKeyboardView>
        <ScrollView style={styles.mainContainer}>
          <ActivityLoader visible={loading} />
          <TCFormProgress totalSteps={2} curruentStep={2} />

          <TCLabel title={strings.certiTitle} required={false} />
          <FlatList
            scrollEnabled={false}
            data={certificate}
            renderItem={renderItem}
          />
        </ScrollView>
      </TCKeyboardView>

      <SafeAreaView>
        <TCGradientButton
          isDisabled={false}
          title={strings.doneTitle}
          style={{marginBottom: 5}}
          onPress={() => registerScorekeeperCall()}
        />
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  addCertificateView: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    marginTop: 12,
    marginBottom: 12,
    width: wp('92%'),
    alignSelf: 'center',
  },
  addCertificateButton: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    height: 25,
    justifyContent: 'center',
    backgroundColor: colors.whiteColor,
    paddingHorizontal: 5,
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    width: 120,
    marginBottom: 15,
  },
  addCertificateText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,

    fontSize: 12,
  },

  certificateDescription: {
    paddingVertical: 10,
    width: '100%',
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: fonts.RRegular,
    paddingHorizontal: 15,
    color: colors.lightBlackColor,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },
});
