// @flow
import React, {useCallback, useContext, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Dimensions,
  Pressable,
  Image,
  TextInput,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {strings} from '../../../Localization/translation';
import {getLatLong, searchVenue} from '../../api/External';
import AuthContext from '../../auth/context';

import colors from '../../Constants/Colors';

import images from '../../Constants/ImagePath';

const ChooseAddressModal = ({
  isVisible = false,
  closeModal = () => {},
  onChange = () => {},
}) => {
  const [locationList, setLocationList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchRef = useRef();

  const authContext = useContext(AuthContext);
  const getLocationData = useCallback(
    (searchLocationText) => {
      searchVenue(searchLocationText, authContext).then((response) => {
        console.log({response});
        setLocationList([...response.predictions]);
        setLoading(false);
      });
    },
    [authContext],
  );

  const handleSearch = (text) => {
    setSearchText(text);
    clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      setLoading(true);
      getLocationData(text);
    }, 800);
  };

  const getLatLongData = (addressDescription) => {
    getLatLong(addressDescription, authContext).then((response) => {
      console.log('Lat/Long response::=>', response);
      const coordinate = {
        latitude: response.results[0].geometry.location.lat,
        longitude: response.results[0].geometry.location.lng,
      };

      const region = {
        latitude: response.results[0].geometry.location.lat,
        longitude: response.results[0].geometry.location.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      const address = addressDescription;
      closeModal();
      onChange({coordinate, region, address});
    });
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.parent}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Pressable style={{width: 26, height: 26}} onPress={closeModal}>
              <Image source={images.crossImage} style={styles.image} />
            </Pressable>
          </View>
          <View style={styles.divider} />
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <View style={{width: 25, height: 25, marginRight: 10}}>
                <Image source={images.searchUser} style={styles.image} />
              </View>
              <TextInput
                placeholder={strings.searchHereText}
                style={{flex: 1, padding: 8, fontSize: 16}}
                onChangeText={handleSearch}
                value={searchText}
              />
            </View>

            {loading ? (
              <ActivityIndicator size={'large'} />
            ) : (
              <FlatList
                data={locationList}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={{
                      padding: 15,
                      justifyContent: 'center',
                      borderBottomWidth: 1,
                      borderBottomColor: colors.grayColor,
                    }}
                    onPress={() => {
                      getLatLongData(item.description);
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        lineHeight: 24,
                        color: colors.lightBlackColor,
                      }}
                      numberOfLines={2}>
                      {item.description}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: colors.whiteColor,
    height: Dimensions.get('window').height - 50,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 15,
  },
  headerRow: {
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  container: {
    paddingHorizontal: 15,
    paddingVertical: 19,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
  },
});
export default ChooseAddressModal;
