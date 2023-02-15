// @flow
import React from 'react';
import {View, Modal, Pressable, Image, Text, FlatList} from 'react-native';
import {strings} from '../../../../../../Localization/translation';
import images from '../../../../../Constants/ImagePath';
import styles from './styles';

const LanguagesListModal = ({
  isVisible,
  closeList = () => {},
  onSelect = () => {},
  languageList = [],
  onApply = () => {},
}) => (
  <Modal visible={isVisible} transparent animationType="slide">
    <View style={styles.parent}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Pressable style={{width: 26, height: 26}} onPress={closeList}>
            <Image source={images.crossImage} style={styles.image} />
          </Pressable>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={styles.headerTitle}>{strings.languages}</Text>
          </View>
          <Pressable style={styles.buttonContainer} onPress={onApply}>
            <Text style={styles.buttonText}>{strings.apply}</Text>
          </Pressable>
        </View>
        <View style={styles.divider} />
        <View style={styles.container}>
          <FlatList
            data={languageList}
            keyExtractor={(item) => `${item.id}`}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => (
              <>
                <Pressable
                  style={styles.listItem}
                  onPress={() => {
                    onSelect(item);
                  }}>
                  <Text style={styles.listLabel}>{item.language}</Text>
                  <View style={styles.listIconContainer}>
                    {languageList[index].isChecked ? (
                      <Image
                        source={images.orangeCheckBox}
                        style={styles.image}
                      />
                    ) : (
                      <Image
                        source={images.uncheckWhite}
                        style={styles.image}
                      />
                    )}
                  </View>
                </Pressable>
                <View style={styles.lineSeparator} />
              </>
            )}
          />
        </View>
      </View>
    </View>
  </Modal>
);

export default LanguagesListModal;
