/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
import React, {
  useState,
} from 'react';
import {
  Text, View, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView,
} from 'react-native';

import images from '../../../Constants/ImagePath';
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts'
import strings from '../../../Constants/String';
import TCGradientButton from '../../../components/TCGradientButton';

const privacyArray = [
  {
    id: 1,
    privacyName: 'Who can see members in team connections?',
    privacyOptions: [
      {
        name: 'Everyone',
        isSelected: true,
      },
      {
        name: 'Followers',
        isSelected: false,
      },
      {
        name: 'Club & Team Members',
        isSelected: false,
      },
      {
        name: 'Only Club & Team Admins',
        isSelected: false,
      },
    ],
  },
  {
    id: 2,
    privacyName: 'Who can see followers in team connections?',
    privacyOptions: [
      {
        name: 'Everyone',
        isSelected: true,
      },
      {
        name: 'Followers',
        isSelected: false,
      },
      {
        name: 'Club & Team Members',
        isSelected: false,
      },
      {
        name: 'Only Club & Team Admins',
        isSelected: false,
      },
    ],
  },
  {
    id: 3,
    privacyName: 'Who can see a member profile?',
    privacyOptions: [
      {
        name: 'Club Members',
        isSelected: false,
      },
      {
        name: 'Only Club & Team Admins',
        isSelected: true,
      },
    ],
  },
]

export default function MembersViewPrivacyScreen() {
  const [privacy, setPrivacy] = useState([privacyArray]);

  const isIconCheckedOrNot = ({ item, index }) => {
    // eslint-disable-next-line no-param-reassign
    const filter = privacyArray[index].privacyOptions.map((el) => { el.isSelected = false; })
    setPrivacy(filter);
    // eslint-disable-next-line no-param-reassign
    item.isSelected = !item.isSelected;
    setPrivacy([...privacy]);

    // eslint-disable-next-line no-restricted-syntax
    for (const temp of privacy) {
      if (temp.isSelected) {
        setPrivacy.push(temp.privacyOption);
      }
    }
  };

  const renderItemPrivacy = ({ item, index }) => (
    <View style={styles.privacyCell}>
      <Text style={styles.privacyNameStyle}>{item.privacyName}</Text>
      <View style={styles.radioMainView}>
        {privacyArray[index].privacyOptions.map((item) => (
          // eslint-disable-next-line react/jsx-key
          <TouchableOpacity style={styles.radioButtonView} onPress={() => isIconCheckedOrNot({ item, index })}>
            <Image source={item.isSelected ? images.radioSelect : images.radioUnselect} style={styles.radioImage} />
            <Text style={styles.radioText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>

  );

  return (
    <View style={styles.mainContainer}>
      <ScrollView>
        <Text style={styles.titleStyle}>Connections</Text>
        <FlatList
          data={privacyArray}
          renderItem={renderItemPrivacy}
          keyExtractor={(index) => index.toString()}
          scrollEnabled={false}
          />
        <TCGradientButton title={strings.saveTitle} />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  titleStyle: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    padding: 15,
    color: colors.lightBlackColor,
  },
  privacyCell: {
    flexDirection: 'column',
    margin: 15,
  },
  privacyNameStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  radioButtonView: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 10,
    marginRight: 15,
  },
  radioMainView: {
    flexDirection: 'column',
  },
  radioText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginLeft: 15,
    alignSelf: 'center',
    marginRight: 15,
    color: colors.lightBlackColor,
  },
  radioImage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },

})
