import React, { useState } from 'react';
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

const createdEventData = [
  {
    id: 0,
    color: colors.themeColor,
    isSelected: true,
  },
  {
    id: 1,
    color: colors.yellowColor,
    isSelected: false,
  },
  {
    id: 2,
    color: colors.greeColor,
    isSelected: false,
  },
  {
    id: 3,
    color: colors.eventBlueColor,
    isSelected: false,
  },
  {
    id: 4,
    color: colors.themeColor,
    isSelected: false,
  },
  {
    id: 5,
    color: colors.yellowColor,
    isSelected: false,
  },
  {
    id: 6,
    color: colors.greeColor,
    isSelected: false,
  },
];

const importedEventData = [
  {
    id: 0,
    color: colors.themeColor,
    isSelected: true,
  },
  {
    id: 1,
    color: colors.yellowColor,
    isSelected: false,
  },
  {
    id: 2,
    color: colors.greeColor,
    isSelected: false,
  },
  {
    id: 3,
    color: colors.eventBlueColor,
    isSelected: false,
  },
];

const gamesData = [
  {
    id: 0,
    color: colors.themeColor,
    isSelected: true,
  },
  {
    id: 1,
    color: colors.yellowColor,
    isSelected: false,
  },
  {
    id: 2,
    color: colors.greeColor,
    isSelected: false,
  },
  {
    id: 3,
    color: colors.eventBlueColor,
    isSelected: false,
  },
];

export default function DefaultColorScreen({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [createdEventColors, setCreatedEventColors] = useState(createdEventData);
  const [importedEventColors, setImportedEventColors] = useState(importedEventData);
  const [gamesEventColors, setGamesEventColor] = useState(gamesData);
  const [selectedEventColors, setSelectedEventColors] = useState([]);
  const [counter, setcounter] = useState(0);
  const [pressAddEventColor, setPressAddEventColor] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <KeyboardAvoidingView style={styles.mainContainerStyle} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack() }>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTextStyle}>Default Color Setting</Text>
        }
        rightComponent={
          <TouchableOpacity style={{ padding: 2 }}>
            <Text>Done</Text>
          </TouchableOpacity>
        }
      />
      <View style={ styles.sperateLine } />
      <SafeAreaView>
        <EventItemRender
          title={strings.eventCreatedTitle}
        >
          <FlatList
            data={[...createdEventColors, '0']}
            numColumns={5}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ width: wp('1.5%') }} />}
            renderItem={ ({ item, index }) => {
              if (index === createdEventColors.length) {
                return (
                  <EventColorItem
                    onItemPress={() => {
                      toggleModal();
                      setSelectedEventColors([])
                      setPressAddEventColor('Created Events');
                    }}
                    source={images.plus}
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
                        await Utility.setStorage('createdEventColor', item);
                      } else {
                        createEventData.isSelected = false;
                      }
                      return null;
                    })
                    setCreatedEventColors([...createdEventColors])
                  }}
                  eventColorViewStyle={{
                    backgroundColor: item.color,
                    borderWidth: item.isSelected ? 2 : 0,
                    borderColor: colors.whiteColor,
                    marginRight: wp(3),
                  }}
                />
              );
            }}
            keyExtractor={ (item, index) => index.toString() }
          />
        </EventItemRender>
        <EventItemRender
          title={strings.eventImportedTitle}
        >
          <FlatList
            data={[...importedEventColors, '0']}
            numColumns={5}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ width: wp('1.5%') }} />}
            renderItem={ ({ item, index }) => {
              if (index === importedEventColors.length) {
                return (
                  <EventColorItem
                    onItemPress={() => {
                      toggleModal();
                      setSelectedEventColors([])
                      setPressAddEventColor('Imported Events');
                    }}
                    source={images.plus}
                  />
                );
              }
              return (
                <EventColorItem
                  source={item.isSelected ? images.check : null}
                  imageStyle={{ tintColor: colors.whiteColor }}
                  onItemPress={() => {
                    importedEventColors.map(async (importedEventItem) => {
                      const importedEvent = importedEventItem;
                      if (importedEvent.id === item.id) {
                        importedEvent.isSelected = true;
                        await Utility.setStorage('importedEventColor', item);
                      } else {
                        importedEvent.isSelected = false;
                      }
                      return null;
                    })
                    setImportedEventColors([...importedEventColors])
                  }}
                  eventColorViewStyle={{
                    backgroundColor: item.color,
                    borderWidth: item.isSelected ? 2 : 0,
                    borderColor: colors.whiteColor,
                    marginRight: wp(3),
                  }}
                />
              );
            }}
            keyExtractor={ (item, index) => index.toString() }
          />
        </EventItemRender>
        <EventItemRender
          title={strings.games}
        >
          <FlatList
            data={[...gamesEventColors, '0']}
            numColumns={5}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ width: wp('1.5%') }} />}
            renderItem={ ({ item, index }) => {
              if (index === gamesEventColors.length) {
                return (
                  <EventColorItem
                    onItemPress={() => {
                      toggleModal();
                      setSelectedEventColors([])
                      setPressAddEventColor('Game Events');
                    }}
                    source={images.plus}
                  />
                );
              }
              return (
                <EventColorItem
                  source={item.isSelected ? images.check : null}
                  imageStyle={{ tintColor: colors.whiteColor }}
                  onItemPress={() => {
                    gamesEventColors.map(async (gamesEventItem) => {
                      const gamesEvent = gamesEventItem;
                      if (gamesEvent.id === item.id) {
                        gamesEvent.isSelected = true;
                        await Utility.setStorage('gameEventColor', item);
                      } else {
                        gamesEvent.isSelected = false;
                      }
                      return null;
                    })
                    setGamesEventColor([...gamesEventColors])
                  }}
                  eventColorViewStyle={{
                    backgroundColor: item.color,
                    borderWidth: item.isSelected ? 2 : 0,
                    borderColor: colors.whiteColor,
                    marginRight: wp(3),
                  }}
                />
              );
            }}
            keyExtractor={ (item, index) => index.toString() }
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
          const data = [...selectedEventColors];
          let obj = {};
          if (pressAddEventColor === 'Created Events') {
            obj = {
              id: createdEventColors.length + data.length,
              color: selectColor,
              isSelected: false,
            };
          }
          if (pressAddEventColor === 'Imported Events') {
            obj = {
              id: importedEventColors.length + data.length,
              color: selectColor,
              isSelected: false,
            };
          }
          if (pressAddEventColor === 'Game Events') {
            obj = {
              id: gamesEventColors.length + data.length,
              color: selectColor,
              isSelected: false,
            };
          }
          if (selectedEventColors.length === 0) {
            setcounter(counter + 1);
            data.push(obj);
            setSelectedEventColors(data);
          } else {
            const filterColor = selectedEventColors.filter((select_color_item) => selectColor === select_color_item.color);
            if (filterColor.length === 0) {
              setcounter(counter + 1);
              data.push(obj);
              setSelectedEventColors(data);
            }
          }
        }}
        onDonePress={() => {
          if (pressAddEventColor === 'Created Events') {
            const createdEventAddData = [...createdEventColors, ...selectedEventColors];
            setCreatedEventColors(createdEventAddData);
            setModalVisible(false);
          }
          if (pressAddEventColor === 'Imported Events') {
            const importedEventAddData = [...importedEventColors, ...selectedEventColors];
            setImportedEventColors(importedEventAddData);
            setModalVisible(false);
          }
          if (pressAddEventColor === 'Game Events') {
            const gamesEventAddData = [...gamesEventColors, ...selectedEventColors];
            setGamesEventColor(gamesEventAddData);
            setModalVisible(false);
          }
        }}
        flatListData={[...selectedEventColors, '0']}
        renderItem={({ item, index }) => {
          if (index === selectedEventColors.length) {
            return (
              <EventColorItem
                source={images.plus}
              />
            );
          }
          return (
            <EventColorItem
              source={item.isSelected ? images.check : null}
              imageStyle={{ tintColor: colors.whiteColor }}
              eventColorViewStyle={{
                backgroundColor: item.color,
                borderWidth: item.isSelected ? 2 : 0,
                borderColor: colors.whiteColor,
                marginRight: wp(3),
              }}
            />
          );
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
