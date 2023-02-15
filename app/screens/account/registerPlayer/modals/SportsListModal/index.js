// @flow
import React, {useEffect, useState} from 'react';
import {FlatList, Image, Modal, Pressable, Text, View} from 'react-native';
import {strings} from '../../../../../../Localization/translation';
import images from '../../../../../Constants/ImagePath';
import styles from './styles';

const SportsListModal = ({
  isVisible,
  closeList = () => {},
  sportsList = [],
  onNext = () => {},
  sport = null,
}) => {
  const [selectedSport, setSelectedSport] = useState(null);

  useEffect(() => {
    if (sport?.sport_type) {
      setSelectedSport(sport);
    }
  }, [sport]);

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.parent}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Pressable style={{width: 26, height: 26}} onPress={closeList}>
              <Image source={images.crossImage} style={styles.image} />
            </Pressable>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={styles.headerTitle}>
                {sport?.sport_type
                  ? strings.sportTextTitle
                  : strings.registerAsPlayerTitle}
              </Text>
            </View>
            <Pressable
              style={styles.buttonContainer}
              onPress={() => {
                if (!selectedSport?.sport_name) {
                  return;
                }
                onNext(selectedSport);
              }}>
              <Text
                style={[
                  styles.buttonText,
                  selectedSport?.sport_name ? {} : {opacity: 0.5},
                ]}>
                {sport?.sport_type ? strings.apply : strings.next}
              </Text>
            </Pressable>
          </View>
          <View style={styles.divider} />
          <View style={styles.container}>
            <Text style={styles.title}>{strings.sportQuestion}</Text>
            <Text style={styles.description}>
              {strings.sportQuestionDescription}
            </Text>
            <FlatList
              data={sportsList}
              keyExtractor={(item, index) => `${item?.sport_type}/${index}`}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <>
                  <Pressable
                    style={styles.listItem}
                    onPress={() => setSelectedSport(item)}>
                    <Text style={styles.listLabel}>{item?.sport_name}</Text>
                    <View style={styles.listIconContainer}>
                      {selectedSport?.sport_name === item?.sport_name &&
                      selectedSport?.sport_type === item?.sport_type ? (
                        <Image
                          source={images.radioCheckYellow}
                          style={styles.image}
                        />
                      ) : (
                        <Image
                          source={images.radioUnselect}
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
};

export default SportsListModal;
