// @flow
import React, {useCallback, useEffect, useState} from 'react';
import {Modal, Text, TouchableOpacity, Pressable, FlatList} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
import modalStyles from './ModalStyles';
import colors from '../../Constants/Colors';
import Verbs from '../../Constants/Verbs';
import {strings} from '../../../Localization/translation';

const CountModal = ({
  isVisible = false,
  closeModal = () => {},
  onSelect = () => {},
  label = '',
  maxCount = 0,
  selectedValue = 0,
  listItemType = '',
}) => {
  const [countList, setCountList] = useState([]);
  const isFocused = useIsFocused();

  const getPrefix = useCallback(
    (index) => {
      switch (listItemType) {
        case Verbs.countTypeSets:
          return format(
            strings.bestOfSets,
            index,
            index === 1 ? strings.set : strings.sets,
          );

        case Verbs.countTypeRatio:
          return `${index} : ${index}`;

        case Verbs.countTypeTime:
          return `${index}h 00m`;

        default:
          if (index === 0) {
            return `${index} ${label}(s)`;
          }
          if (index === 1) {
            return `${index} ${label}`;
          }
          return `${index} ${label}s`;
      }
    },
    [label, listItemType],
  );

  useEffect(() => {
    if (maxCount > 0 && isFocused && isVisible) {
      const list = [];
      for (let index = 0; index <= maxCount; index++) {
        const obj = {
          count: index,
          label: getPrefix(index),
        };
        list.push(obj);
      }
      setCountList(list);
    }
  }, [maxCount, isFocused, isVisible, label, getPrefix]);

  return (
    <Modal visible={isVisible} transparent>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'flex-end',
        }}
        onPress={closeModal}>
        <Pressable style={modalStyles.countModalCard} onPress={() => {}}>
          <FlatList
            data={countList}
            key={(item) => item}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  modalStyles.countItem,
                  selectedValue === item.count
                    ? {backgroundColor: colors.textFieldBackground}
                    : {},
                ]}
                onPress={() => {
                  onSelect(
                    listItemType === Verbs.countTypeTime
                      ? `${item.count}h 00m`
                      : item.count,
                  );
                  closeModal();
                }}>
                <Text
                  style={[
                    modalStyles.label,
                    selectedValue === item.count
                      ? {}
                      : {color: colors.lightGrey2},
                  ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default CountModal;
