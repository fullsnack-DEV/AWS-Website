import {
  Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React, { useContext, useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import strings from '../../Constants/String';
import uploadImages from '../../utils/imageAction';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import images from '../../Constants/ImagePath';
import EventItemRender from '../Schedule/EventItemRender';
import Header from './Header';
import TCInnerLoader from '../TCInnerLoader';
import AuthContext from '../../auth/context';

const EditRefereeCertificate = ({
  visible,
  onClose,
  certifiData,
  onSavePress,
}) => {
  const authContext = useContext(AuthContext);
  const [certificatesData, setCertificatesData] = useState([]);
  const [imageUploadingLoader, setImageUploadingLoader] = useState(null);
  const [validationError, setError] = useState(null);

  useEffect(() => {
    setCertificatesData([...certifiData, {}]);
  }, [certifiData]);

  const checkValidation = () => {
    const findCertiTitleIndex = certificatesData?.findIndex((item) => item?.title && (!item?.thumbnail || !item?.url))
    if (findCertiTitleIndex !== -1) {
      setError({ certificate: findCertiTitleIndex })
      Alert.alert('Towns Cup', 'Add certificate')
      return false;
    }

    const findIndex = certificatesData?.findIndex((item) => !item?.title && (item?.thumbnail || item?.url))
    if (findIndex !== -1) {
      setError({ certificate: findIndex })
      Alert.alert('Towns Cup', 'Add title for certificate')
      return false;
    }
    setError(null);
    return true
  };

  const addMore = () => {
    setCertificatesData([...certificatesData, {}]);
  };

  const renderCertificates = ({ item, index }) => (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ flexDirection: 'column' }}>
        <View style={styles.addCertificateView}>
          <TextInput
                  placeholder={strings.titleOrDescriptionText}
                  style={{
                    ...styles.certificateDescription,
                    borderWidth: validationError?.certificate === index ? 1 : 0,
                    borderColor: colors.redDelColor,
                  }}
                  onChangeText={(text) => {
                    const certi = certificatesData;
                    certi[index] = {
                      ...certi[index],
                      title: text,
                    }
                    setCertificatesData([...certi])
                  }}
                  value={certificatesData?.[index]?.title}/>
        </View>
        <TouchableOpacity onPress={() => {
          if (certificatesData?.length === 1) {
            setCertificatesData([{}]);
          } else if (index !== (certificatesData?.length - 1)) {
            const certiUrl = certificatesData;
            certiUrl.splice(index, 1);
            setCertificatesData([...certiUrl]);
          }
        }}>
          <Text style={styles.delete}>{strings.deleteTitle}</Text>
        </TouchableOpacity>
        {!item?.url && (
          <TouchableOpacity onPress={() => {
            ImagePicker.openPicker({
              width: 300,
              height: 400,
              cropping: true,
              maxFiles: 10,
            }).then((pickImages) => {
              setImageUploadingLoader(index);
              const certiUrl = certificatesData;
              certiUrl[index] = { ...certiUrl[index], url: pickImages?.sourceURL };
              setCertificatesData([...certiUrl])
              uploadImages([pickImages], authContext).then((responses) => {
                certiUrl[index] = {
                  ...certiUrl[index],
                  url: responses?.[0].fullImage ?? '',
                  thumbnail: responses?.[0].thumbnail ?? '',
                };
                setCertificatesData([...certiUrl])
              }).catch(() => {
                certiUrl.splice(index, 1);
                setCertificatesData([...certiUrl]);
              }).finally(() => {
                setTimeout(() => setImageUploadingLoader(null), 1500);
                addMore();
              })
            });
          }} style={styles.addCertificateButton}>
            <Text style={styles.addCertificateText}>
              {strings.addCertificateTitle}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {item?.url && (
        <View style={{
          padding: 15, alignSelf: 'flex-start',
        }}>
          <View>
            <FastImage
                      resizeMode={FastImage.resizeMode.cover}
                      source={{ uri: certificatesData?.[index]?.url }}
                      style={{ width: 195, height: 150, borderRadius: 10 }}
                  />
            <TouchableOpacity style={{
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
                                      const certi = certificatesData;
                                      delete certi[index].url;
                                      delete certi[index].thumbnail;
                                      setCertificatesData([...certi]);
                                    }}
                  >
              <Image
                        source={images.menuClose}
                        style={{
                          zIndex: 100, tintColor: colors.whiteColor, height: 15, width: 15,
                        }}
                    />
            </TouchableOpacity>
            {index === imageUploadingLoader && (
              <View style={{
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
                <Text style={{
                  fontFamily: fonts.RLight, fontSize: 20, color: colors.yellowColor, marginLeft: 5,
                }}>Uploading...</Text>
              </View>
            )}

          </View>
        </View>
      )}
    </View>
  )

  return (
    <Modal
            isVisible={visible}
            backdropColor="black"
            style={{
              margin: 0, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0)',
            }}
            hasBackdrop
            onBackdropPress={onClose}
            backdropOpacity={0}
        >
      <SafeAreaView style={[styles.modalContainerViewStyle, { backgroundColor: colors.whiteColor }]}>
        <LinearGradient
                    colors={[colors.orangeColor, colors.yellowColor]}
                    end={{ x: 0.0, y: 0.25 }}
                    start={{ x: 1, y: 0.5 }}
                    style={styles.gradiantHeaderViewStyle}>
        </LinearGradient>
        <Header
                    mainContainerStyle={styles.headerMainContainerStyle}
                    leftComponent={
                      <TouchableOpacity onPress={onClose}>
                        <Image source={images.backArrow} style={styles.cancelImageStyle} resizeMode={'contain'} />
                      </TouchableOpacity>
                    }
                    centerComponent={
                      <View style={styles.headerCenterViewStyle}>
                        <Image source={images.refereesInImage} style={styles.soccerImageStyle} resizeMode={'contain'} />
                        <Text style={styles.playInTextStyle}>Edit {strings.certificateTitle}</Text>
                      </View>
                    }
                    rightComponent={
                      <TouchableOpacity
                          onPress={() => {
                            if (checkValidation()) {
                              const certiData = certificatesData;
                              const finalCerti = JSON.parse(JSON.stringify(certificatesData));
                              if (certiData?.length > 0) {
                                certiData.map((item, index) => {
                                  if (!item?.title) {
                                    finalCerti.splice(index, 1);
                                  }
                                  return true;
                                })
                              }
                              onSavePress(finalCerti);
                            }
                          }}>
                        <Text style={{ fontSize: 16, fontFamily: fonts.RLight, color: colors.whiteColor }}>{'Save'}</Text>
                      </TouchableOpacity>
                    }
                />

        <KeyboardAwareScrollView enableOnAndroid={false}>
          <EventItemRender
                        title={strings.addCertiMainTitle}
                        headerTextStyle={{ fontSize: 16 }}
                    >
            <FlatList
                scrollEnabled={false}
                data={certificatesData}
                renderItem={renderCertificates}
             />
          </EventItemRender>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  addCertificateButton: {
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: colors.userPostTimeColor,
    borderRadius: 6,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    marginTop: '5%',
    paddingHorizontal: 5,
    width: '35%',
  },
  addCertificateText: {
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,

    fontSize: 12,
  },
  delete: {
    alignSelf: 'flex-end',
    color: colors.fbTextColor,
    marginRight: 15,
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },
  modalContainerViewStyle: {
    height: hp('94%'),
    backgroundColor: colors.themeColor,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerMainContainerStyle: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 15,
  },
  cancelImageStyle: {
    height: 17,
    width: 17,
    tintColor: colors.whiteColor,
  },
  soccerImageStyle: {
    height: 30,
    width: 30,
    marginHorizontal: 10,
  },
  headerCenterViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  playInTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
  },
  gradiantHeaderViewStyle: {
    position: 'absolute',
    width: '100%',
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});
export default EditRefereeCertificate;
