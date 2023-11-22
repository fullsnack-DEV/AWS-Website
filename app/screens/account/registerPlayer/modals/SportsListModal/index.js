// @flow
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useRef, useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {Image, Pressable, Text, View} from 'react-native';
import {strings} from '../../../../../../Localization/translation';
import images from '../../../../../Constants/ImagePath';
import Verbs from '../../../../../Constants/Verbs';
import styles from './styles';
import CustomModalWrapper from '../../../../../components/CustomModalWrapper';
import {ModalTypes} from '../../../../../Constants/GeneralConstants';
import fonts from '../../../../../Constants/Fonts';
import TCTextField from '../../../../../components/TCTextField';
import TCKeyboardView from '../../../../../components/TCKeyboardView';
import MemberListModal from '../../../../../components/MemberListModal/MemberListModal';

const SportsListModal = ({
  isVisible = false,
  closeList = () => {},
  sportsList = [],
  onNext = () => {},
  sport = null,
  title = '',
  forTeam = false,
  authContext,
  memberListModalvisible = false,

  playerList = [],
  rightButtonText = strings.next,
}) => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [visibleRoleModal, setVisibleRoleModal] = useState(false);
  const [memberListModal, setMemberListModal] = useState(
    memberListModalvisible,
  );
  const [doubleSport, setDoubleSport] = useState({});
  const [otherText, setOtherText] = useState('');
  const navigation = useNavigation();
  const scrollRef = useRef();
  const [rolesArray, setRoleArray] = useState([
    {name: 'en_Player', isChecked: false},
    {name: 'en_Coach ', isChecked: false},
    {name: 'en_Parent', isChecked: false},
    {name: 'en_Other', isChecked: false},
  ]);

  const onModalVisible = useCallback(() => {
    setSelectedSport(sport);
  }, [sport]);

  const isIconCheckedOrNot = ({item, index}) => {
    rolesArray[index].isChecked = !item.isChecked;
    setRoleArray([...rolesArray]);
  };

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
      (authContext?.entity?.role === Verbs.entityTypeUser ||
        authContext?.entity?.role === Verbs.entityTypePlayer)
    ) {
      setMemberListModal(true);

      setDoubleSport(sport_data);
    } else if (authContext.entity.role === Verbs.entityTypeClub) {
      closeList();

      const obj = {...sport_data};

      obj.grp_id = authContext.entity.obj.group_id;

      navigation.navigate('AccountStack', {
        screen: 'CreateTeamForm1',
        params: {
          sportData: {...sport_data},
        },
      });
    } else {
      closeList();

      setVisibleRoleModal(false);

      navigation.navigate('AccountStack', {
        screen: 'CreateTeamForm1',
        params: {
          sportData: {...sport_data},

          roleValues: {
            is_player: rolesArray[0].isChecked,
            is_coach: rolesArray[1].isChecked,
            is_parent: rolesArray[2].isChecked,
            is_other: rolesArray[3].isChecked,
            other_role: otherText,
          },
        },
      });

      setRoleArray([
        {name: 'en_Player', isChecked: false},
        {name: 'en_Coach ', isChecked: false},
        {name: 'en_Parent', isChecked: false},
        {name: 'en_Other', isChecked: false},
      ]);
      setOtherText('');
    }
  };

  return (
    <>
      <CustomModalWrapper
        isVisible={isVisible}
        closeModal={closeList}
        modalType={ModalTypes.style1}
        title={title}
        onModalShow={() => onModalVisible()}
        headerRightButtonText={rightButtonText}
        containerStyle={styles.parent}
        onRightButtonPress={() => {
          if (!selectedSport?.sport_name) {
            return;
          }

          if (forTeam) {
            if (
              selectedSport.sport_type === Verbs.doubleSport &&
              (authContext?.entity?.role === Verbs.entityTypeUser ||
                authContext?.entity?.role === Verbs.entityTypePlayer)
            ) {
              onNextPress(selectedSport);
            } else if (authContext.entity.role !== Verbs.entityTypeClub) {
              setVisibleRoleModal(true);
            } else {
              onNextPress(selectedSport);
            }
          } else {
            onNext(selectedSport);
          }
        }}
        isFullTitle={title === strings.registerScorekeeperTitle}
        headerLeftIconStyle={
          title === strings.registerScorekeeperTitle ? {width: 50} : {}
        }>
        <View style={{flex: 1}}>
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
      </CustomModalWrapper>
      <CustomModalWrapper
        isVisible={visibleRoleModal}
        title={strings.createTeamText}
        headerRightButtonText={strings.next}
        closeModal={async () => {
          setVisibleRoleModal(false);

          setRoleArray([
            {name: 'en_Player', isChecked: false},
            {name: 'en_Coach ', isChecked: false},
            {name: 'en_Parent', isChecked: false},
            {name: 'en_Other', isChecked: false},
          ]);
        }}
        onRightButtonPress={() => {
          if (!selectedSport?.sport_name) {
            return;
          }

          if (forTeam) {
            onNextPress(selectedSport);
          }
          setVisibleRoleModal(false);
          setRoleArray([
            {name: 'en_Player', isChecked: false},
            {name: 'en_Coach ', isChecked: false},
            {name: 'en_Parent', isChecked: false},
            {name: 'en_Other', isChecked: false},
          ]);
        }}
        modalType={ModalTypes.style6}>
        <TCKeyboardView
          enableOnAndroid
          scrollReference={scrollRef}
          extraHeight={150}
          containerStyle={{
            flexGrow: 1,
          }}>
          <Text style={styles.title}>{strings.whatRolePlayText}</Text>
          <Text
            style={{
              marginTop: 15,
              fontFamily: fonts.RRegular,
              fontSize: 16,
              lineHeight: 24,
              marginBottom: 15,
            }}>
            {strings.youCanChangetheRole}
          </Text>

          <FlatList
            ref={scrollRef}
            data={rolesArray}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <>
                <Pressable style={[styles.listItem, {opacity: 0.4}]}>
                  <Text style={styles.listLabel}>{strings.admin}</Text>
                  <View style={styles.listIconContainer}>
                    <Image
                      source={images.orangeCheckBox}
                      style={styles.image}
                    />
                  </View>
                </Pressable>
                <View style={styles.lineSeparator} />
              </>
            )}
            renderItem={({item, index}) => (
              <>
                <Pressable
                  style={styles.listItem}
                  onPress={() => {
                    isIconCheckedOrNot({item, index});
                  }}>
                  <Text style={styles.listLabel}>{item.name}</Text>
                  <View style={styles.listIconContainer}>
                    {rolesArray[index].isChecked ? (
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
                {rolesArray[3].isChecked && index === 3 ? (
                  <View style={{marginBottom: 15}}>
                    <TCTextField
                      height={40}
                      placeholder={strings.roleWritePlaceholder}
                      onChangeText={(text) => {
                        setOtherText(text);
                      }}
                    />
                  </View>
                ) : null}

                <View style={styles.lineSeparator} />
              </>
            )}
          />
        </TCKeyboardView>
      </CustomModalWrapper>

      <MemberListModal
        isVisible={memberListModal}
        title={strings.createTeamText}
        closeList={() => {
          setMemberListModal(false);
        }}
        doubleSport={doubleSport}
        sportsList={playerList}
      />
    </>
  );
};

export default SportsListModal;
