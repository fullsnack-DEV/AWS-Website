// @flow
import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {strings} from '../../../Localization/translation';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import Verbs from '../../Constants/Verbs';

import styles from './ModalStyles';

const RadioButtonList = [
  {
    id: '1',
    label: strings.yes,
    value: Verbs.on,
  },
  {
    id: '2',
    label: strings.no,
    value: Verbs.off,
  },
];

const AvailabilityModal = ({
  availability = Verbs.on,
  onChange = () => {},
  sportName,
}) => (
  <View style={{flex: 1, justifyContent: 'space-between'}}>
    <View>
      <Text style={styles.title}>{strings.availabilityModalTitle}</Text>
      {RadioButtonList.map((item, index) => (
        <View
          style={[
            styles.row,
            {
              paddingHorizontal: 10,
              marginBottom: index === RadioButtonList.length - 1 ? 0 : 13,
            },
          ]}
          key={item.id}>
          <Text style={styles.label}>{item.label}</Text>

          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => onChange(item.value)}>
            {availability === item.value ? (
              <Image source={images.radioCheckYellow} style={styles.image} />
            ) : (
              <Image source={images.radioUnselect} style={styles.image} />
            )}
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.greyContainer}>
        <Text style={[styles.greyText, {fontFamily: fonts.RBold}]}>
          {availability === Verbs.on ? strings.yes : strings.no}
        </Text>
        <Text style={styles.greyText}>
          {`${
            availability === Verbs.on
              ? strings.availabilityInfoForYes
              : strings.availabilityInfoForNo
          }${sportName}`}
        </Text>
      </View>
    </View>
    <View style={styles.bottomContainer}>
      <Text style={styles.smallText}>{strings.changeAvailabilityText}</Text>
    </View>
  </View>
);

export default AvailabilityModal;
