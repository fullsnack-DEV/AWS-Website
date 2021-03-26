/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Utility from '../../../utils/index';
import Header from '../../../components/Home/Header';
import EventColorItem from '../../../components/Schedule/EventColorItem';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import DefaultColorModal from '../../../components/Schedule/DefaultColor/DefaultColorModal';

export default function DefaultColorScreen({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);

  const [createdEventColors, setCreatedEventColors] = useState();
  const [importedEventColors, setImportedEventColors] = useState();
  const [gamesEventColors, setGamesEventColor] = useState();

  const [selectedEventColors, setSelectedEventColors] = useState();
  const [selectedImportedColors, setSelectedImportedColors] = useState();
  const [selectedmatchColors, setSelectedMatchColors] = useState();

  const [pressAddEventColor, setPressAddEventColor] = useState('');
  const [addColorDoneButton, setAddColorDoneButton] = useState(false);

const getStorageColors = async () => {
  const eventColorData = await Utility.getStorage('eventColors');
  const importedColorData = await Utility.getStorage('importedEventColor');
  const gamesColorData = await Utility.getStorage('gameEventColor');
  if (eventColorData) {
    setCreatedEventColors(eventColorData);
  } else {
    setCreatedEventColors([
      ...Utility.createdEventData,
      {
        id: 5,
        color: '0',
        isSelected: false,
        isNew: true,
      },
    ]);
  }
  if (importedColorData) {
    setImportedEventColors(importedColorData);
  } else {
    setImportedEventColors([
      ...Utility.importedEventData,
      {
        id: 5,
        color: '0',
        isSelected: false,
        isNew: true,
      },
    ]);
  }
  if (gamesColorData) {
    setGamesEventColor(gamesColorData);
  } else {
    setGamesEventColor([
      ...Utility.gamesEventData,
      {
        id: 5,
        color: '0',
        isSelected: false,
        isNew: true,
      },
    ])
  }
}

  useEffect(() => {
    getStorageColors()
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const onChangeColorPressed = (type) => {
    setAddColorDoneButton(false);
    toggleModal();
    if (type === 'Created Events') {
      setPressAddEventColor('Created Events');
    }
    if (type === 'Imported Events') {
      setPressAddEventColor('Imported Events');
    }
    if (type === 'Game Events') {
      setPressAddEventColor('Game Events');
    }
    if (pressAddEventColor === 'Created Events') {
      setSelectedEventColors();
    }
    if (pressAddEventColor === 'Imported Events') {
      setSelectedImportedColors();
    }
    if (pressAddEventColor === 'Game Events') {
      setSelectedMatchColors();
    }
  };
  const renderCreatedEventsColorItem = ({ item }) => {
    if (item.isNew) {
      return (
        <EventColorItem
          isNew={item.color !== '0'}
          onChangeColorPressed={() => onChangeColorPressed('Created Events')}
          imageStyle={{
            tintColor:
              item.color !== '0' ? colors.whiteColor : colors.lightBlackColor,
          }}
          onItemPress={() => {
            setPressAddEventColor('Created Events');
            if (item.color === '0') {
              setAddColorDoneButton(false);
              toggleModal();
              setSelectedEventColors();
            } else {
              createdEventColors.map((createEventItem) => {
                const createEventData = createEventItem;
                if (createEventData.id === item.id) {
                  createEventData.isSelected = true;
                  setSelectedEventColors(createEventData.color);
                } else {
                  createEventData.isSelected = false;
                }
                return null;
              });

              setCreatedEventColors([...createdEventColors]);
            }
          }}
          source={
            item.isNew && item.color === '0'
              ? images.plus
              : item.isSelected
              ? images.check
              : null
          }
          eventColorViewStyle={{
            backgroundColor:
              item.color === '0' ? colors.whiteColor : item.color,
            borderWidth: item.isSelected ? 2 : 0,
            borderColor: colors.whiteColor,
            marginRight: wp(3),
          }}
        />
      );
    }
    return (
      <EventColorItem
        source={item.isSelected ? images.check : null}
        imageStyle={{ tintColor: colors.whiteColor }}
        onItemPress={() => {
          createdEventColors.map(async (createEventItem) => {
            const createEventData = createEventItem;
            if (createEventData.id === item.id) {
              createEventData.isSelected = true;
              setSelectedEventColors(createEventData.color);
            } else {
              createEventData.isSelected = false;
            }
            return null;
          });

          setCreatedEventColors([...createdEventColors]);
        }}
        eventColorViewStyle={{
          backgroundColor: item.color,
          borderWidth: item.isSelected ? 2 : 0,
          borderColor: colors.whiteColor,
          marginRight: wp(3),
        }}
      />
    );
  };

  const renderImportedEventsColorItem = ({ item }) => {
    if (item.isNew) {
      return (
        <EventColorItem
          isNew={item.color !== '0'}
          onChangeColorPressed={() => onChangeColorPressed('Imported Events')}
          imageStyle={{
            tintColor:
              item.color !== '0' ? colors.whiteColor : colors.lightBlackColor,
          }}
          onItemPress={() => {
            setPressAddEventColor('Imported Events');
            if (item.color === '0') {
              setAddColorDoneButton(false);
              toggleModal();
              setSelectedImportedColors();
            } else {
              importedEventColors.map(async (importedEventItem) => {
                const importedEventData = importedEventItem;
                if (importedEventData.id === item.id) {
                  importedEventData.isSelected = true;
                  setSelectedImportedColors(importedEventData.color);
                } else {
                  importedEventData.isSelected = false;
                }
                return null;
              });

              setImportedEventColors([...importedEventColors]);
            }
          }}
          source={
            item.isNew && item.color === '0'
              ? images.plus
              : item.isSelected
              ? images.check
              : null
          }
          eventColorViewStyle={{
            backgroundColor:
              item.color === '0' ? colors.whiteColor : item.color,
            borderWidth: item.isSelected ? 2 : 0,
            borderColor: colors.whiteColor,
            marginRight: wp(3),
          }}
        />
      );
    }
    return (
      <EventColorItem
        source={item.isSelected ? images.check : null}
        imageStyle={{ tintColor: colors.whiteColor }}
        onItemPress={() => {
          importedEventColors.map(async (importedEventItem) => {
            const importedEventData = importedEventItem;
            if (importedEventData.id === item.id) {
              importedEventData.isSelected = true;
              setSelectedImportedColors(importedEventData.color);
            } else {
              importedEventData.isSelected = false;
            }
            return null;
          });

          setImportedEventColors([...importedEventColors]);
        }}
        eventColorViewStyle={{
          backgroundColor: item.color,
          borderWidth: item.isSelected ? 2 : 0,
          borderColor: colors.whiteColor,
          marginRight: wp(3),
        }}
      />
    );
  };

  const renderGamesEventsColorItem = ({ item }) => {
    if (item.isNew) {
      return (
        <EventColorItem
          isNew={item.color !== '0'}
          onChangeColorPressed={() => onChangeColorPressed('Game Events')}
          imageStyle={{
            tintColor:
              item.color !== '0' ? colors.whiteColor : colors.lightBlackColor,
          }}
          onItemPress={() => {
            setPressAddEventColor('Game Events');
            if (item.color === '0') {
              setAddColorDoneButton(false);
              toggleModal();
              setSelectedMatchColors();
            } else {
              gamesEventColors.map(async (gamesEventItem) => {
                const gamesEventData = gamesEventItem;
                if (gamesEventData.id === item.id) {
                  gamesEventData.isSelected = true;

                  setSelectedMatchColors(gamesEventData.color);
                } else {
                  gamesEventData.isSelected = false;
                }
                return null;
              });

              setGamesEventColor([...gamesEventColors]);
            }
          }}
          source={
            item.isNew && item.color === '0'
              ? images.plus
              : item.isSelected
              ? images.check
              : null
          }
          eventColorViewStyle={{
            backgroundColor:
              item.color === '0' ? colors.whiteColor : item.color,
            borderWidth: item.isSelected ? 2 : 0,
            borderColor: colors.whiteColor,
            marginRight: wp(3),
          }}
        />
      );
    }
    return (
      <EventColorItem
        source={item.isSelected ? images.check : null}
        imageStyle={{ tintColor: colors.whiteColor }}
        onItemPress={() => {
          gamesEventColors.map(async (gamesEventItem) => {
            const gamesEventData = gamesEventItem;
            if (gamesEventData.id === item.id) {
              gamesEventData.isSelected = true;
              setSelectedMatchColors(gamesEventData.color);
            } else {
              gamesEventData.isSelected = false;
            }
            return null;
          });
          setGamesEventColor([...gamesEventColors]);
        }}
        eventColorViewStyle={{
          backgroundColor: item.color,
          borderWidth: item.isSelected ? 2 : 0,
          borderColor: colors.whiteColor,
          marginRight: wp(3),
        }}
      />
    );
  };

  const onDonePress = () => {
    Utility.setStorage('eventColors', createdEventColors);
    Utility.setStorage('importedEventColor', importedEventColors);
    Utility.setStorage('gameEventColor', gamesEventColors);
    navigation.goBack()
  }
  return (
    <KeyboardAvoidingView
      style={styles.mainContainerStyle}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTextStyle}>Default Color Setting</Text>
        }
        rightComponent={
          <TouchableOpacity
            style={{ padding: 2 }}
            onPress={onDonePress}>
            <Text>Done</Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.sperateLine} />
      <SafeAreaView>
        <EventItemRender title={strings.eventCreatedTitle}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={createdEventColors}
            ItemSeparatorComponent={() => <View style={{ width: wp('1%') }} />}
            renderItem={renderCreatedEventsColorItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </EventItemRender>
        <EventItemRender title={strings.eventImportedTitle}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={importedEventColors}
            ItemSeparatorComponent={() => <View style={{ width: wp('1%') }} />}
            renderItem={renderImportedEventsColorItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </EventItemRender>
        <EventItemRender title={strings.scheduleMatchTitle}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={gamesEventColors}
            ItemSeparatorComponent={() => <View style={{ width: wp('1%') }} />}
            renderItem={renderGamesEventsColorItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </EventItemRender>
      </SafeAreaView>
      <DefaultColorModal
        isModalVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        cancelImageSource={images.cancelImage}
        onCancelImagePress={() => setModalVisible(false)}
        headerCenterText={'Add color'}
        onColorSelected={(selectColor) => {
          console.log('selected color: => ', selectColor);
          setAddColorDoneButton(true);
          //  setSelectedColor(selectColor);
          if (pressAddEventColor === 'Created Events') {
            setSelectedEventColors(selectColor);
          }
          if (pressAddEventColor === 'Imported Events') {
            setSelectedImportedColors(selectColor);
          }
          if (pressAddEventColor === 'Game Events') {
            setSelectedMatchColors(selectColor);
          }
        }}
        doneButtonDisplay={addColorDoneButton}
        onDonePress={ () => {
          setModalVisible(false);
          if (pressAddEventColor === 'Created Events') {
            const temp = [...createdEventColors]

              temp[5] = {
                id: 5,
                color: selectedEventColors,
                isSelected: temp[5].isSelected,
                isNew: true,
              };

            setCreatedEventColors(temp);
          }
          if (pressAddEventColor === 'Imported Events') {
            const temp = [...importedEventColors]
            temp[5] = {
              id: 5,
              color: selectedImportedColors,
              isSelected: temp[5].isSelected,
              isNew: true,
            };
            setImportedEventColors(temp);
          }
          if (pressAddEventColor === 'Game Events') {
            const temp = [...gamesEventColors]
            temp[5] = {
              id: 5,
              color: selectedmatchColors,
              isSelected: temp[5].isSelected,
              isNew: true,
            };
            setGamesEventColor(temp);
          }
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
  },
  sperateLine: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
    marginVertical: hp('0.5%'),
  },
  backImageStyle: {
    height: 20,
    width: 16,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  eventTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
});
