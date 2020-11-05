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

export default function DefaultColorScreen({ navigation }) {
  const [createdEventColors, setCreatedEventColors] = useState(createdEventData);
  const [importedEventColors, setImportedEventColors] = useState(importedEventData);
  console.log('Created Event Color :-', createdEventColors);
  console.log('Imported Event Color :-', importedEventColors);

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
            data={createdEventColors}
            horizontal={true}
            ItemSeparatorComponent={() => <View style={{ width: wp('3%') }} />}
            ListFooterComponent={() => <EventColorItem
            eventColorViewStyle={{ marginLeft: wp('3%') }}
            source={images.plus}
            />}
            renderItem={ ({ item, index }) => <EventColorItem
            source={item.isSelected ? images.check : null}
            imageStyle={{ tintColor: colors.whiteColor }}
            onItemPress={() => {
              createdEventColors[index].isSelected = !createdEventColors[index].isSelected;
              setCreatedEventColors([...createdEventColors]);
            }}
            eventColorViewStyle={{ backgroundColor: item.color, borderWidth: item.isSelected ? 2 : 0, borderColor: colors.whiteColor }}
            /> }
            keyExtractor={ (item, index) => index.toString() }
          />
        </EventItemRender>
        <EventItemRender
          title={strings.eventImportedTitle}
        >
          <FlatList
            data={importedEventColors}
            horizontal={true}
            ItemSeparatorComponent={() => <View style={{ width: wp('3%') }} />}
            ListFooterComponent={() => <EventColorItem
            eventColorViewStyle={{ marginLeft: wp('3%') }}
            source={images.plus}
            />}
            renderItem={ ({ item, index }) => <EventColorItem
            source={item.isSelected ? images.check : null}
            imageStyle={{ tintColor: colors.whiteColor }}
            onItemPress={() => {
              importedEventColors[index].isSelected = !importedEventColors[index].isSelected;
              setImportedEventColors([...importedEventColors]);
            }}
            eventColorViewStyle={{ backgroundColor: item.color, borderWidth: item.isSelected ? 2 : 0, borderColor: colors.whiteColor }}
            /> }
            keyExtractor={ (item, index) => index.toString() }
          />
        </EventItemRender>
      </SafeAreaView>
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
