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
  title = '',
}) => {
  const [selectedSport, setSelectedSport] = useState(null);

  useEffect(() => {
    setSelectedSport(sport);
  }, [sport]);

  const getQuestionAndDescription = () => {
    switch (title) {
      case strings.registerAsPlayerTitle:
        return {
          question: strings.sportQuestion,
          description: strings.sportQuestionDescription,
        };

      case strings.registerRefereeTitle:
        return {
          question: strings.sportRefereeQuestion,
          description: strings.sportRefereeQuestionDescription,
        };

      case strings.registerScorekeeperTitle:
        return {
          question: strings.scoreKeeperQuestion,
          description: strings.scoreKeeperQuestionDescription,
        };

      case strings.createTeamText:
        return {
          question: strings.createTeamModalTitle,
          description: '',
        };

      default:
        return {
          question: '',
          description: '',
        };
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.parent}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={{flex: 1}}>
              <Pressable style={{width: 26, height: 26}} onPress={closeList}>
                <Image source={images.crossImage} style={styles.image} />
              </Pressable>
            </View>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>
                {sport?.sport ? strings.sportTextTitle : title}
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
                {sport?.sport ? strings.apply : strings.next}
              </Text>
            </Pressable>
          </View>
          <View style={styles.divider} />
          <View style={styles.container}>
            <Text style={styles.title}>
              {getQuestionAndDescription().question}
            </Text>
            <Text style={styles.description}>
              {getQuestionAndDescription().description}
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
                    <Text style={styles.listLabel}>{item.sport_name}</Text>
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
