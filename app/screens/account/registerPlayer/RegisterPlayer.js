import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Modal from 'react-native-modal';

import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import { getSportsList } from '../../../api/Games';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import TCThinDivider from '../../../components/TCThinDivider';
import TCFormProgress from '../../../components/TCFormProgress';
import TCGradientButton from '../../../components/TCGradientButton';

export default function RegisterPlayer({ navigation }) {
  const authContext = useContext(AuthContext);
  const [sportsSelection, setSportsSelection] = useState();
  const [sports, setSports] = useState('');
  const [loading, setloading] = useState(false);
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [sportsData, setSportsData] = useState([]);

  useEffect(() => {
    setloading(true);

    getSportsList(authContext)
      .then((res) => {
        const sportArr = [];
        res.payload.map((item) => {
          sportArr.push({ label: item?.sport_name, value: item?.sport_name });
          return null;
        });
        setSportsData([...sportArr]);
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      })
      .finally(() => {
        setloading(false);
      });
  }, []);

  const renderSports = ({ item }) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        setSportsSelection(item?.value)
        setTimeout(() => {
          setSports(item?.value);
          setVisibleSportsModal(false);
        }, 300)
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>{item.value}</Text>
        <View style={styles.checkbox}>
          {sportsSelection === item?.value ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const nextOnPress = () => {
    if (sports !== '') {
      if (
        authContext?.entity?.auth?.user?.registered_sports?.some(
          (e) => e.sport_name?.toLowerCase() === sports?.toLowerCase(),
        )
      ) {
        Alert.alert(
          strings.alertmessagetitle,
          strings.sportAlreadyRegisterd,
        );
      } else {
        const bodyParams = {};
        bodyParams.sport_name = sports;
        navigation.navigate('RegisterPlayerForm2', {
          bodyParams,
        });
        // const registerdPlayerData = authContext?.user?.registered_sports || []
        // registerdPlayerData.push(bodyParams);
        // const body = {
        //   registered_sports: registerdPlayerData,
        // }
      }
    }
  }
  return (
    <View style={{ flex: 1 }}>
      <TCFormProgress totalSteps={2} curruentStep={1} />

      <ActivityLoader visible={loading} />
      <Text style={styles.LocationText}>{strings.sportsText}</Text>

      <TouchableOpacity onPress={() => setVisibleSportsModal(true)}>
        <View style={styles.searchView}>
          <TextInput
            style={styles.searchTextField}
            placeholder={strings.selectSportPlaceholder}
            value={sports}
            editable={false}
            pointerEvents="none"
          />
        </View>
      </TouchableOpacity>
      <View style={{ flex: 1 }} />
      <Modal
        isVisible={visibleSportsModal}
        backdropColor="black"
        onBackdropPress={() => setVisibleSportsModal(false)}
        onRequestClose={() => setVisibleSportsModal(false)}
        backdropOpacity={0}
        style={{
          margin: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 1.3,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            left: 0,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setVisibleSportsModal(false)}>
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
              }}>
              Sports
            </Text>

            <Text
                style={{
                  alignSelf: 'center',
                  marginVertical: 20,
                  fontSize: 16,
                  fontFamily: fonts.RRegular,
                  color: colors.themeColor,
                }}>

            </Text>

          </View>
          <View style={styles.separatorLine} />
          <FlatList
            ItemSeparatorComponent={() => <TCThinDivider />}
            data={sportsData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderSports}
          />
        </View>
      </Modal>
      <TCGradientButton
        isDisabled={!sports}
        title={strings.nextTitle}
        style={{ marginBottom: 30 }}
        onPress={nextOnPress}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  LocationText: {
    marginTop: hp('3%'),
    color: colors.lightBlackColor,
    fontSize: 20,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    paddingLeft: 15,
  },
  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginLeft: 5,
    resizeMode: 'contain',
  },

  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    marginTop: 14,
    width: wp('92%'),
  },

  searchView: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    marginTop: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
    paddingLeft: 15,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),
  },
  searchTextField: {
    alignSelf: 'center',
    color: colors.blackColor,
    flex: 1,
    fontSize: wp('3.8%'),
    width: wp('80%'),
  },
  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  checkbox: {},
});
