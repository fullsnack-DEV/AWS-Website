import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {strings} from '../../../Localization/translation';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {
  searchLocationPlaceDetail,
  searchCityState,
  searchVenue,
} from '../../api/External';
import TCThinDivider from '../TCThinDivider';

export default function LocationSearchModal({
  visible,
  onSelect,
  onClose,
  addressType,
}) {
  const authContext = useContext(AuthContext);
  const [cityData, setCityData] = useState([]);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [isKeyboardVisible]);
  const getLocationData = (searchLocationText) => {
    if (addressType === 'short') {
      searchCityState(searchLocationText, authContext).then((response) => {
        setCityData(response.predictions);
      });
    } else {
      searchVenue(searchLocationText, authContext).then((response) => {
        setCityData(response.predictions);
      });
    }
  };

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        searchLocationPlaceDetail(item?.place_id, authContext)
          .then((response) => {
            const data = {
              ...item,
              longitude: response?.result?.geometry?.location?.lng,
              latitude: response?.result?.geometry?.location?.lat,
            };
            onClose();
            onSelect(data);
          })
          .catch(onClose);
      }}>
      <Text style={styles.cityList}>{cityData[index].description}</Text>
      <TCThinDivider />
    </TouchableOpacity>
  );

  return (
    <Modal
      onBackdropPress={onClose}
      backdropOpacity={0.2}
      animationType="slide"
      hasBackdrop
      style={{
        margin: 0,
        backgroundColor: colors.whiteOpacityColor,
      }}
      visible={visible}
      avoidKeyboard={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={{flex: 1}}
          bounces={false}
          keyboardShouldPersistTaps="always">
          <View style={styles.bottomPopupContainer}>
            <View style={styles.viewsContainer}>
              <Text onPress={onClose} style={styles.cancelText}>
                Cancel
              </Text>
              <Text style={styles.locationText}>Available Area</Text>
              <Text style={styles.cancelText}>{'       '}</Text>
            </View>
            <TCThinDivider width={'100%'} />

            <View style={{backgroundColor: colors.grayBackgroundColor}}>
              <View style={styles.sectionStyle}>
                <TextInput
                  style={styles.textInput}
                  placeholder={strings.searchByCityStateText}
                  clearButtonMode="always"
                  placeholderTextColor={colors.grayColor}
                  onChangeText={(text) => getLocationData(text)}
                />
              </View>
            </View>

            <FlatList
              data={cityData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              keyboardShouldPersistTaps="always"
              style={{flex: 1}}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  cityList: {
    color: colors.lightBlackColor,
    fontSize: wp('4%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,

    // paddingLeft: wp('1%'),
    width: wp('70%'),
    margin: wp('4%'),
    textAlignVertical: 'center',
  },
  listItem: {
    marginLeft: 30,
    // width: wp('80%'),
  },

  sectionStyle: {
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 25,

    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    margin: 15,
    paddingLeft: 17,
    paddingRight: 5,

    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textInput: {
    color: colors.blackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    paddingLeft: 10,
  },

  bottomPopupContainer: {
    // height: hp(94),
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 34 : 0,
    marginTop: Platform.OS === 'ios' ? 50 : 0,

    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // position: 'absolute',
    bottom: 0,
    width: '100%',

    ...Platform.select({
      ios: {
        shadowColor: colors.googleColor,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 15,
      },
    }),
  },

  locationText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.requestConfirmColor,
  },
  viewsContainer: {
    height: 60,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
});
