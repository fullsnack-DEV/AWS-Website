// @flow
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, Image, Modal, Pressable, Text, View} from 'react-native';
import {strings} from '../../../../../../Localization/translation';
import images from '../../../../../Constants/ImagePath';
import Verbs from '../../../../../Constants/Verbs';
import styles from './styles';
import ScreenHeader from '../../../../../components/ScreenHeader';

const SportsListModal = ({
  isVisible = false,
  closeList = () => {},
  sportsList = [],
  onNext = () => {},
  sport = null,
  title = '',
  forTeam = false,
  authContext,
  setdoubleSportHandler = () => {},
  setMemberListModalHandler = () => {},
}) => {
  const [selectedSport, setSelectedSport] = useState(null);
  const navigation = useNavigation();

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

  // only for Create Team Call

  const onNextPress = (sport_data) => {
    if (
      sport_data.sport_type === Verbs.doubleSport &&
      authContext?.entity?.role ===
        (Verbs.entityTypeUser || Verbs.entityTypePlayer)
    ) {
      closeList();
      setdoubleSportHandler(sport_data);

      setMemberListModalHandler(true);
    } else if (authContext.entity.role !== Verbs.entityTypeUser) {
      closeList();

      const obj = {...sport_data};
      obj.grp_id = authContext.entity.obj.group_id;

      navigation.navigate('Account', {
        screen: 'CreateTeamForm1',
        params: sport_data,
      });
    } else {
      closeList();
      navigation.navigate('Account', {
        screen: 'CreateTeamForm1',
        params: sport_data,
      });
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.parent}>
        <View style={styles.card}>
          {/* <View style={styles.headerRow}>
            <View style={{flex: 1}}>
              <Pressable style={{width: 26, height: 26}} onPress={closeList}>
                <Image source={images.crossImage} style={styles.image} />
              </Pressable>
            </View>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>{sport?.sport ? strings.sportTextTitle : title}</Text>
            </View>
            <Pressable
              style={styles.buttonContainer}
              onPress={() => {
                if (!selectedSport?.sport_name) {
                  return;
                }
                if (forTeam) {
                  onNextPress(selectedSport);
                } else {
                  onNext(selectedSport);
                }
              }}>
              <Text style={[styles.buttonText, selectedSport?.sport_name ? {} : {opacity: 0.5}]}>{sport?.sport ? strings.next : strings.apply}</Text>
            </Pressable>
          </View> */}
          <ScreenHeader
            title={sport?.sport ? strings.sportTextTitle : title}
            leftIcon={images.crossImage}
            leftIconPress={closeList}
            containerStyle={{paddingBottom: 14}}
            isRightIconText
            rightButtonTextStyle={[
              styles.buttonText,
              selectedSport?.sport_name ? {} : {opacity: 0.5},
            ]}
            rightButtonText={sport?.sport ? strings.apply : strings.next}
            onRightButtonPress={() => {
              if (!selectedSport?.sport_name) {
                return;
              }

              if (forTeam) {
                onNextPress(selectedSport);
              } else {
                onNext(selectedSport);
              }
            }}
          />
          <View style={styles.divider} />
          <View style={styles.container}>
            {getQuestionAndDescription().question ? (
              <Text style={styles.title}>
                {getQuestionAndDescription().question}
              </Text>
            ) : null}
            {getQuestionAndDescription().description ? (
              <Text style={styles.description}>
                {getQuestionAndDescription().description}
              </Text>
            ) : null}

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
