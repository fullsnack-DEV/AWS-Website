/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
import React, {useState, useEffect} from 'react';
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
  Dimensions,
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
import {strings} from '../../../../Localization/translation';
import DefaultColorModal from '../../../components/Schedule/DefaultColor/DefaultColorModal';

export default function DefaultColorScreen({navigation}) {
  const [isModalVisible, setModalVisible] = useState(false);

  const [createdEventColors, setCreatedEventColors] = useState();
  const [importedEventColors, setImportedEventColors] = useState();
  const [gamesEventColors, setGamesEventColor] = useState();

  const [selectedEventColors, setSelectedEventColors] = useState();
  const [selectedImportedColors, setSelectedImportedColors] = useState();
  const [selectedmatchColors, setSelectedMatchColors] = useState();

  const [pressAddEventColor, setPressAddEventColor] = useState('');
  const [addColorDoneButton, setAddColorDoneButton] = useState(false);

  const TOTAL_COLOR = 10;
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
          id: TOTAL_COLOR,
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
          id: TOTAL_COLOR,
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
          id: TOTAL_COLOR,
          color: '0',
          isSelected: false,
          isNew: true,
        },
      ]);
    }
  };

  useEffect(() => {
    getStorageColors();
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

  const getImageOfColor = (data) => {
    if (data.isNew && data.isSelected) {
      return images.check;
    }
    if (data.isNew) {
      return images.plus;
    }
    if (data.isSelected) {
      return images.check;
    }
    return null;
  };

  const renderCreatedEventsColorItem = ({item}) => (
    <View style={{marginRight: Dimensions.get('window').width > 360 ? -1 : 5}}>
      <EventColorItem
        item={item}
        isNew={!!item?.isNew}
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
        source={getImageOfColor(item)}
        eventColorViewStyle={{
          backgroundColor: item.color === '0' ? colors.whiteColor : item.color,
          borderWidth: item.isSelected ? 2 : 0,
          borderColor: colors.whiteColor,
          marginRight: wp(3),
        }}
      />
    </View>
  );

  const renderImportedEventsColorItem = ({item}) => (
    <View style={{marginRight: Dimensions.get('window').width > 360 ? -1 : 5}}>
      <EventColorItem
        item={item}
        isNew={!!item?.isNew}
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
        source={getImageOfColor(item)}
        eventColorViewStyle={{
          backgroundColor: item.color === '0' ? colors.whiteColor : item.color,
          borderWidth: item.isSelected ? 2 : 0,
          borderColor: colors.whiteColor,
          marginRight: wp(3),
        }}
      />
    </View>
  );

  const renderGamesEventsColorItem = ({item}) => (
    <View style={{marginRight: Dimensions.get('window').width > 360 ? -1 : 5}}>
      <EventColorItem
        item={item}
        isNew={!!item?.isNew}
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
        source={getImageOfColor(item)}
        eventColorViewStyle={{
          backgroundColor: item.color === '0' ? colors.whiteColor : item.color,
          borderWidth: item.isSelected ? 2 : 0,
          borderColor: colors.whiteColor,
          marginRight: wp(3),
        }}
      />
    </View>
  );

  const onDonePress = () => {
    Utility.setStorage('eventColors', createdEventColors);
    Utility.setStorage('importedEventColor', importedEventColors);
    Utility.setStorage('gameEventColor', gamesEventColors);
    navigation.goBack();
  };
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
            style={{padding: 2, fontFamily: fonts.RMedium, fontSize: 10}}
            onPress={onDonePress}>
            <Text>{strings.save}</Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.sperateLine} />
      <SafeAreaView>
        <EventItemRender title={strings.eventCreatedTitle}>
          <FlatList
            numColumns={Dimensions.get('window').width > 360 ? 9 : 8}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={createdEventColors}
            renderItem={renderCreatedEventsColorItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </EventItemRender>
        <EventItemRender title={strings.eventImportedTitle}>
          <FlatList
            numColumns={Dimensions.get('window').width > 360 ? 9 : 8}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            data={importedEventColors}
            ItemSeparatorComponent={() => <View style={{width: 30}} />}
            renderItem={renderImportedEventsColorItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </EventItemRender>
        <EventItemRender title={strings.scheduleMatchTitle}>
          <FlatList
            numColumns={Dimensions.get('window').width > 360 ? 9 : 8}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            data={gamesEventColors}
            ItemSeparatorComponent={() => <View style={{width: 30}} />}
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
        headerCenterText={strings.addColor}
        onColorSelected={(selectColor) => {
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
        onDonePress={() => {
          setModalVisible(false);
          if (pressAddEventColor === 'Created Events') {
            const temp = [...createdEventColors];

            temp[TOTAL_COLOR] = {
              id: TOTAL_COLOR,
              color: selectedEventColors,
              isSelected: temp[TOTAL_COLOR].isSelected,
              isNew: true,
            };

            setCreatedEventColors(temp);
          }
          if (pressAddEventColor === 'Imported Events') {
            const temp = [...importedEventColors];
            temp[TOTAL_COLOR] = {
              id: TOTAL_COLOR,
              color: selectedImportedColors,
              isSelected: temp[TOTAL_COLOR].isSelected,
              isNew: true,
            };
            setImportedEventColors(temp);
          }
          if (pressAddEventColor === 'Game Events') {
            const temp = [...gamesEventColors];
            temp[TOTAL_COLOR] = {
              id: TOTAL_COLOR,
              color: selectedmatchColors,
              isSelected: temp[TOTAL_COLOR].isSelected,
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
