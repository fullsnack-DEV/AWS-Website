// @flow
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import images from '../../../../Constants/ImagePath';

const EditNTRPScreen = ({
  sportsList = [],
  sport = '',
  sportType = '',
  setData = () => {},
}) => {
  const [list, setList] = useState([]);
  const [selectedSport, setSelectedSport] = useState({});
  const [showModal, setShowModal] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && sportsList.length > 0) {
      const obj = sportsList.find(
        (item) => item.sport === sport && item.sport_type === sportType,
      );
      setSelectedSport(obj);

      const arr = [];
      for (let index = 1; index <= 7; index += 0.5) {
        arr.push(`${parseFloat(index).toFixed(1)}`);
      }
      setList(arr);
    }
  }, [isFocused, sportsList, sport, sportType]);

  const handleSelect = (value) => {
    const newList = sportsList.map((ele) => {
      if (ele.sport === sport && ele.sport_type === sportType) {
        return {
          ...ele,
          ntrp: value,
        };
      }
      return {...ele};
    });
    setData(newList);
    setShowModal(false);
  };

  return (
    <View style={styles.parent}>
      <TouchableOpacity
        style={styles.dropDown}
        onPress={() => setShowModal(true)}>
        <View />
        <View>
          <Text style={styles.label}>{selectedSport?.ntrp ?? '1.0'}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Image source={images.dropDownArrow} style={styles.image} />
        </View>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalParent}>
          <View style={styles.modalCard}>
            <View style={styles.handle} />
            <FlatList
              data={list}
              keyExtractor={(item) => item.toString()}
              renderItem={({item}) => (
                <>
                  <Pressable
                    style={styles.row}
                    onPress={() => handleSelect(item)}>
                    <Text style={styles.label}>{item}</Text>
                    <View style={styles.listIconContainer}>
                      {selectedSport?.ntrp === item ? (
                        <Image
                          source={images.radioCheckYellow}
                          style={styles.image}
                        />
                      ) : (
                        <Image
                          source={images.radioUnselect}
                          style={styles.image}
                        />
                      )}
                    </View>
                  </Pressable>
                  <View style={styles.lineSeparator} />
                </>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  dropDown: {
    padding: 15,
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  modalParent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.whiteColor,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    paddingHorizontal: 30,
    paddingTop: 45,
    paddingBottom: 25,
  },
  handle: {
    backgroundColor: colors.modalHandleColor,
    width: 40,
    height: 5,
    borderRadius: 5,
    position: 'absolute',
    alignSelf: 'center',
    top: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  listIconContainer: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineSeparator: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
});
export default EditNTRPScreen;
