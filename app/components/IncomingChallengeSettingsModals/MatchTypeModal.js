// @flow
import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {strings} from '../../../Localization/translation';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import styles from './ModalStyles';

const gameTypeList = [
  {label: strings.officialGameType, id: '1'},
  {label: strings.friendlyGameType, id: '2'},
  {label: strings.allType, id: '3'},
];

const MatchTypeModal = ({gameType = '', onChange = () => {}}) => {
  const getDescription = () => {
    switch (gameType) {
      case strings.officialGameType:
        return (
          <>
            <Text style={[styles.greyText, {fontFamily: fonts.RBold}]}>
              {gameType}
            </Text>
            <Text style={styles.greyText}>{strings.gameTypeOfficalInfo}</Text>
          </>
        );

      case strings.friendlyGameType:
        return (
          <>
            <Text style={[styles.greyText, {fontFamily: fonts.RBold}]}>
              {gameType}
            </Text>
            <Text style={styles.greyText}>{strings.gameTypeFriendlyInfo}</Text>
          </>
        );

      case strings.allType:
        return (
          <>
            <View style={{marginBottom: 25}}>
              <Text style={[styles.greyText, {fontFamily: fonts.RBold}]}>
                {strings.officialGameType}
              </Text>
              <Text style={styles.greyText}>{strings.gameTypeOfficalInfo}</Text>
            </View>
            <View>
              <Text style={[styles.greyText, {fontFamily: fonts.RBold}]}>
                {strings.friendlyGameType}
              </Text>
              <Text style={styles.greyText}>
                {strings.gameTypeFriendlyInfo}
              </Text>
            </View>
          </>
        );

      default:
        return null;
    }
  };
  return (
    <View>
      <Text style={styles.title}>{strings.chooseMatchType}</Text>
      {gameTypeList.map((item, index) => (
        <View
          style={[
            styles.row,
            {
              paddingHorizontal: 10,
              marginBottom: index === gameTypeList.length - 1 ? 0 : 13,
            },
          ]}
          key={item.id}>
          <Text style={styles.label}>{item.label}</Text>

          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => onChange(item.label)}>
            {gameType === item.label ? (
              <Image source={images.radioCheckYellow} style={styles.image} />
            ) : (
              <Image source={images.radioUnselect} style={styles.image} />
            )}
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.greyContainer}>{getDescription()}</View>
    </View>
  );
};

export default MatchTypeModal;
