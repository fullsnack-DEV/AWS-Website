// @flow
import React, {useState} from 'react';
import {View, Pressable, Text, Image} from 'react-native';
import {format} from 'react-string-format';
import {strings} from '../../../Localization/translation';
import images from '../../Constants/ImagePath';
import Verbs from '../../Constants/Verbs';
import CountModal from './CountModal';
import styles from './ModalStyles';

const CustomDropDown = ({
  selectedValue = 0,
  prefix = '',
  onSelect = () => {},
  maxCount = 6,
  parentStyle = {},
  listItemType = '',
}) => {
  const [showModal, setShowModal] = useState(false);

  const getLabel = () => {
    switch (listItemType) {
      case Verbs.countTypeSets:
        return format(
          strings.bestOfSets,
          selectedValue,
          selectedValue === 1 ? strings.set : strings.sets,
        );

      case Verbs.countTypeRatio:
        return `${selectedValue} : ${selectedValue}`;

      case Verbs.countTypeTime:
        return selectedValue;

      default:
        return `${selectedValue} ${prefix}(s)`;
    }
  };

  return (
    <>
      <Pressable
        style={[
          styles.greyContainer,
          styles.row,
          {marginTop: 0, flex: 1, marginLeft: 15},
          parentStyle,
        ]}
        onPress={() => {
          setShowModal(true);
        }}>
        <View style={{alignItems: 'center', flex: 1}}>
          <Text style={styles.label}>{getLabel()}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Image source={images.dropDownArrow} style={styles.image} />
        </View>
      </Pressable>
      <CountModal
        isVisible={showModal}
        closeModal={() => setShowModal(false)}
        label={prefix}
        maxCount={maxCount}
        selectedValue={selectedValue}
        onSelect={onSelect}
        listItemType={listItemType}
      />
    </>
  );
};

export default CustomDropDown;
