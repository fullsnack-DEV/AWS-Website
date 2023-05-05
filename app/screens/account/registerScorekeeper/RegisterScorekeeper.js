import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import colors from '../../../Constants/Colors';
import AuthContext from '../../../auth/context';
import TCKeyboardView from '../../../components/TCKeyboardView';
import {getSportName} from '../../../utils';
import TCFormProgress from '../../../components/TCFormProgress';
import TCLabel from '../../../components/TCLabel';
import ScreenHeader from '../../../components/ScreenHeader';
import Verbs from '../../../Constants/Verbs';
import SportsListModal from '../registerPlayer/modals/SportsListModal';
import fonts from '../../../Constants/Fonts';
import uploadImages from '../../../utils/imageAction';
import TCInnerLoader from '../../../components/TCInnerLoader';
import {getExcludedSportsList} from '../../../utils/sportsActivityUtils';

const MAX_CERTIFICATE_UPLOAD = 5;
const certificate = {title: '', url: '', thumbnail: '', isLoading: false};

const RegisterScorekeeper = ({navigation, route}) => {
  const [sportList, setSportList] = useState([]);
  const [selectedSport, setSelectedSport] = useState('');
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [bio, setBio] = useState('');
  const [certificateList, setCertificateList] = useState([certificate]);

  const authContext = useContext(AuthContext);
  const bioInputRef = useRef();

  useEffect(() => {
    const sportsArr = getExcludedSportsList(
      authContext,
      Verbs.entityTypeScorekeeper,
    );
    setSportList(sportsArr);
  }, [authContext]);

  useEffect(() => {
    if (route.params.sport_name) {
      setSelectedSport({...route.params});
    }
  }, [route.params]);

  const checkValidation = () => {
    let isValid = true;
    certificateList.forEach((item) => {
      if (item.title === '' && item.url === '') {
        isValid = isValid && true;
      } else if (item.url && !item.title) {
        isValid = false;
        Alert.alert(strings.warningCertificateTitleText);
      } else if (item.title && !item.url) {
        isValid = false;
        Alert.alert(strings.warningCertificateImageText);
      }
    });
    return isValid;
  };

  const onNextPress = () => {
    const isValid = checkValidation();
    if (isValid) {
      const bodyParams = {
        sport: selectedSport.sport,
        sport_name: selectedSport.sport_name,
        descriptions: bio,
        is_active: true,
        certificates: [],
        is_published: true,
        type: Verbs.entityTypeScorekeeper,
      };
      const refereeData = [
        ...(authContext.entity.obj.scorekeeper_data || []),
        bodyParams,
      ];
      navigation.navigate('IncomingReservationSettings', {
        bodyParams: refereeData,
        entityType: Verbs.entityTypeScorekeeper,
        settingObj: selectedSport?.setting
          ? selectedSport.setting
          : {
              available_area: {
                address_list: [
                  {
                    address: `${authContext.entity.obj?.city}, ${authContext.entity.obj?.country}`,
                  },
                ],
                is_specific_address: true,
              },
              entity_type: Verbs.entityTypeScorekeeper,
              game_fee: {
                currency_type: Verbs.cad,
                fee: 0,
              },
              scorekeeper_availibility: Verbs.on,
              refund_policy: Verbs.flexibleText,
              sport: selectedSport.sport,
            },
        sportName: selectedSport.sport_name,
        sport: selectedSport.sport,
        comeFrom: route.params?.comeFrom ?? '',
      });
    }
  };

  const handleCertification = async (index) => {
    const list = [...certificateList];

    const result = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      maxFiles: 1,
    });

    if (result?.path) {
      list[index] = {
        ...list[index],
        url: result.path,
        thumbnail: result.path,
        isLoading: true,
      };
      setCertificateList([...list]);
      uploadImages([result], authContext)
        .then((responses) => {
          list[index] = {
            ...list[index],
            url: responses?.[0].fullImage ?? '',
            thumbnail: responses?.[0].thumbnail ?? '',
            isLoading: false,
          };
          if (certificateList.length < MAX_CERTIFICATE_UPLOAD) {
            setCertificateList([...list, certificate]);
          } else {
            setCertificateList(list);
          }
        })
        .catch(() => {
          list[index] = {
            ...list[index],
            isLoading: false,
          };
        });
    }
  };

  return (
    <TCKeyboardView style={{flex: 1}}>
      <ScreenHeader
        title={strings.registerScorekeeperTitle}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          if (route.params?.comeFrom) {
            navigation.navigate(route.params.comeFrom, {
              ...route.params.routeParams,
            });
          } else {
            navigation.navigate('AccountScreen');
          }
        }}
        containerStyle={{paddingBottom: 14}}
        isRightIconText
        rightButtonText={strings.next}
        onRightButtonPress={onNextPress}
      />
      <TCFormProgress totalSteps={2} curruentStep={1} />
      <ScrollView
        contentContainerStyle={{paddingTop: 25, paddingHorizontal: 15}}>
        <View>
          <TCLabel
            title={strings.whichSport}
            required={true}
            style={{marginLeft: 0, marginTop: 0}}
          />
          <TouchableOpacity
            style={styles.searchView}
            onPress={() => setVisibleSportsModal(true)}>
            <TextInput
              style={styles.searchTextField}
              placeholder={strings.selectSportPlaceholderScorekeeper}
              value={getSportName(selectedSport, authContext)}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
        </View>

        <View>
          <TCLabel
            title={strings.bio.toUpperCase()}
            style={{marginLeft: 0, marginTop: 0}}
          />
          <TouchableOpacity
            style={[styles.searchView, {minHeight: 100}]}
            onPress={() => {
              bioInputRef.current?.focus();
            }}>
            <TextInput
              ref={bioInputRef}
              style={styles.searchTextField}
              onChangeText={(text) => setBio(text)}
              value={bio}
              multiline
              placeholder={strings.descriptionScorekeeperPlaceholder}
              maxLength={50}
            />
          </TouchableOpacity>
        </View>

        <View>
          <TCLabel
            title={strings.certiTitle}
            required={false}
            style={{marginLeft: 0, marginTop: 0}}
          />
          {certificateList.length > 0 &&
            certificateList.map((item, index) => (
              <View key={index} style={{marginBottom: 15}}>
                <View style={[styles.searchView, {marginBottom: 25}]}>
                  <TextInput
                    style={styles.searchTextField}
                    placeholder={strings.titleOrDescriptionText}
                    value={item.title}
                    onChangeText={(text) => {
                      const list = [...certificateList];
                      list[index] = {
                        ...list[index],
                        title: text,
                      };
                      setCertificateList(list);
                    }}
                  />
                </View>
                {item.url ? (
                  <View style={styles.certificateContainer}>
                    <Image source={{uri: item.url}} style={styles.image} />
                    <TouchableOpacity
                      style={styles.closeIcon}
                      onPress={() => {
                        const list = [...certificateList];
                        list.splice(index, 1);
                        if (list.length === 0) {
                          setCertificateList([certificate]);
                        } else {
                          setCertificateList(list);
                        }
                      }}>
                      <Image source={images.closeRound} style={styles.image} />
                    </TouchableOpacity>
                    {item.isLoading ? (
                      <View style={styles.maskView}>
                        <TCInnerLoader visible />
                        <Text style={styles.maskViewText}>
                          {strings.uploadingText}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.addCertificateButton}
                    onPress={() => handleCertification(index)}>
                    <FastImage
                      resizeMode={FastImage.resizeMode.cover}
                      source={images.messageCamera}
                      style={styles.imageStyle}
                    />
                    <Text style={styles.addCertificateText}>
                      {strings.addCertificateTitle}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          <Text style={styles.certificateDescription}>
            {strings.scorekeeperCertificationDescription}
          </Text>
        </View>
      </ScrollView>
      <SportsListModal
        isVisible={visibleSportsModal}
        closeList={() => setVisibleSportsModal(false)}
        title={strings.registerRefereeTitle}
        sportsList={sportList}
        onNext={(sport) => {
          setVisibleSportsModal(false);
          setSelectedSport({...sport});
        }}
        sport={selectedSport}
      />
    </TCKeyboardView>
  );
};
const styles = StyleSheet.create({
  searchView: {
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 35,
  },
  searchTextField: {
    fontSize: 16,
    color: colors.lightBlackColor,
    padding: 0,
  },
  addCertificateButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: 150,
    backgroundColor: colors.textFieldBackground,
  },
  addCertificateText: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    fontSize: 12,
    lineHeight: 18,
  },
  imageStyle: {
    width: 27,
    height: 20,
    marginBottom: 15,
  },
  certificateDescription: {
    fontSize: 12,
    lineHeight: 21,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  certificateContainer: {
    width: 150,
    height: 195,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeIcon: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 22,
    right: -10,
    top: -8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.whiteColor,
  },
  maskView: {
    position: 'absolute',
    width: 150,
    height: 195,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maskViewText: {
    fontFamily: fonts.RLight,
    fontSize: 20,
    lineHeight: 30,
    color: colors.whiteColor,
    marginLeft: 5,
  },
});

export default RegisterScorekeeper;
