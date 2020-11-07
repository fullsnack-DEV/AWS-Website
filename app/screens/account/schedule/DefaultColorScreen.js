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
import Modal from 'react-native-modal';
import { ColorPicker } from 'react-native-color-picker'
import Header from '../../../components/Home/Header';
import EventColorItem from '../../../components/Schedule/EventColorItem';
import EventItemRender from '../../../components/Schedule/EventItemRender';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';

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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  console.log('Selected Event Colors :-', selectedEventColors);

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
                    onItemPress={() => { toggleModal(); setSelectedEventColors([]) }}
                    source={images.plus}
                  />
                );
              }
              return (
                <EventColorItem
                  source={item.isSelected ? images.check : null}
                  imageStyle={{ tintColor: colors.whiteColor }}
                  onItemPress={() => {
                    createdEventColors.map((createEventItem) => {
                      const createEventData = createEventItem;
                      if (createEventData.id === item.id) {
                        createEventData.isSelected = true;
                      } else {
                        createEventData.isSelected = false;
                      }
                      return null;
                    })
                    setCreatedEventColors([...createdEventColors])
                  }}
                  eventColorViewStyle={{
                    backgroundColor: item.color, borderWidth: item.isSelected ? 2 : 0, borderColor: colors.whiteColor, marginRight: wp(3),
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
                    onItemPress={() => { toggleModal(); setSelectedEventColors([]) }}
                    source={images.plus}
                  />
                );
              }
              return (
                <EventColorItem
                  source={item.isSelected ? images.check : null}
                  imageStyle={{ tintColor: colors.whiteColor }}
                  onItemPress={() => {
                    importedEventColors.map((importedEventItem) => {
                      const importedEvent = importedEventItem;
                      if (importedEvent.id === item.id) {
                        importedEvent.isSelected = true;
                      } else {
                        importedEvent.isSelected = false;
                      }
                      return null;
                    })
                    setImportedEventColors([...importedEventColors])
                  }}
                  eventColorViewStyle={{
                    backgroundColor: item.color, borderWidth: item.isSelected ? 2 : 0, borderColor: colors.whiteColor, marginRight: wp(3),
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
                    onItemPress={() => { toggleModal(); setSelectedEventColors([]) }}
                    source={images.plus}
                  />
                );
              }
              return (
                <EventColorItem
                  source={item.isSelected ? images.check : null}
                  imageStyle={{ tintColor: colors.whiteColor }}
                  onItemPress={() => {
                    gamesEventColors.map((gamesEventItem) => {
                      const gamesEvent = gamesEventItem;
                      if (gamesEvent.id === item.id) {
                        gamesEvent.isSelected = true;
                      } else {
                        gamesEvent.isSelected = false;
                      }
                      return null;
                    })
                    setGamesEventColor([...gamesEventColors])
                  }}
                  eventColorViewStyle={{
                    backgroundColor: item.color, borderWidth: item.isSelected ? 2 : 0, borderColor: colors.whiteColor, marginRight: wp(3),
                  }}
                />
              );
            }}
            keyExtractor={ (item, index) => index.toString() }
          />
        </EventItemRender>
      </SafeAreaView>
      <Modal
        isVisible={isModalVisible}
        backdropColor="black"
        style={{ margin: 0, justifyContent: 'flex-end' }}
        hasBackdrop
        onBackdropPress={() => setModalVisible(false)}
        backdropOpacity={0}>
        <View style={{
          height: hp('70%'), shadowOpacity: 0.15, shadowOffset: { height: -10, width: 0 }, backgroundColor: colors.whiteColor, borderTopLeftRadius: 25, borderTopRightRadius: 25, alignItems: 'center',
        }}>
          <Header
            mainContainerStyle={{ borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingVertical: 20 }}
            leftComponent={
              <TouchableOpacity onPress={() => setModalVisible(false) }>
                <Image source={images.cancelImage} style={{ height: 15, width: 15, tintColor: colors.lightBlackColor }} resizeMode={'contain'} />
              </TouchableOpacity>
            }
            centerComponent={
              <Text style={{
                fontSize: 16, fontFamily: fonts.RBold, color: colors.lightBlackColor, alignSelf: 'center',
              }}>Add color</Text>
            }
            rightComponent={
              <TouchableOpacity style={{ padding: 2 }}>
                <Text style={{ fontSize: 14, fontFamily: fonts.RRegular, color: colors.lightBlackColor }}>Done</Text>
              </TouchableOpacity>
            }
          />
          <View style={{ height: 1, width: wp('100%'), backgroundColor: colors.writePostSepratorColor }} />
          <View style={{ flex: 1 }}>
            <ColorPicker
              onColorSelected={(selectColor) => {
                const data = [...selectedEventColors];
                const obj = {
                  id: counter,
                  color: selectColor,
                  isSelected: false,
                };
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
                // setSelectedEventColors(data);
                // data.filter((select_color_item) => {
                //   if (selectColor !== select_color_item.color) {
                //     setSelectedEventColors(data);
                //   }
                //   return null;
                // })
              }}
              defaultColor={colors.orangeColor}
              style={{ height: wp('80%'), width: wp('80%'), alignSelf: 'center' }}
            />
            <FlatList
              data={[...selectedEventColors, '0']}
              numColumns={5}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ width: wp('1.5%') }} />}
              renderItem={ ({ item, index }) => {
                if (index === selectedEventColors.length) {
                  return (
                    <EventColorItem
                      // onItemPress={() => { toggleModal(); }}
                      source={images.plus}
                    />
                  );
                }
                return (
                  <EventColorItem
                    source={item.isSelected ? images.check : null}
                    imageStyle={{ tintColor: colors.whiteColor }}
                    // onItemPress={() => {
                    //   createdEventColors[index].isSelected = !createdEventColors[index].isSelected;
                    //   setCreatedEventColors([...createdEventColors]);
                    // }}
                    eventColorViewStyle={{
                      backgroundColor: item.color, borderWidth: item.isSelected ? 2 : 0, borderColor: colors.whiteColor, marginRight: wp(3),
                    }}
                  />
                );
              }}
              keyExtractor={ (item, index) => index.toString() }
            />
          </View>
        </View>
      </Modal>
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
