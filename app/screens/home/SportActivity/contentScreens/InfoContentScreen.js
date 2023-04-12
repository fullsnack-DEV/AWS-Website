// @flow
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'react-string-format';
import ReadMore from '@fawazahmed/react-native-read-more';
import {strings} from '../../../../../Localization/translation';
import EventMapView from '../../../../components/Schedule/EventMapView';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';
import images from '../../../../Constants/ImagePath';
import Verbs from '../../../../Constants/Verbs';
import ClubList from '../components/ClubList';
import styles from './InfoContentScreenStyles';
import TeamsList from '../components/TeamsList';
import UserDetails from '../components/UserDetails';
import Venues from '../components/Venues';
import {privacyKey} from '../../../../Constants/GeneralConstants';
import {getJSDate} from '../../../../utils';
import CertificateList from '../components/CertificateList';
import ServicableArea from '../components/ServicableArea';
import {getTitleForRegister} from '../../../../utils/sportsActivityUtils';

const OptionList = [
  strings.bio,
  strings.basicInfoText,
  strings.clubstitle,
  strings.leagues,
];

const OptionList1 = [
  strings.bio,
  strings.basicInfoText,
  strings.certiTitle,
  strings.servicableAreas,
];

const InfoContentScreen = ({
  user = {},
  sportObj = {},
  isAdmin = false,
  handleEditOption = () => {},
  openPrivacySettings = () => {},
  entityType = Verbs.entityTypePlayer,
  onPressCertificate = () => {},
}) => {
  const [options, setOptions] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editModalInfo, setEditModalInfo] = useState({
    section: '',
    buttonText: '',
    showPrivacy: false,
  });

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      if (entityType !== Verbs.entityTypePlayer) {
        setOptions(OptionList1);
      } else if (
        (user.entity_type === Verbs.entityTypePlayer ||
          user.entity_type === Verbs.entityTypeUser) &&
        sportObj.sport_type === Verbs.singleSport
      ) {
        const arr = [...OptionList];
        arr.splice(2, 0, strings.homeFacility);
        arr.splice(3, 0, strings.matchVenues);
        if (sportObj.sport === Verbs.tennisSport) {
          arr.splice(4, 0, strings.ntrpTitle);
        }

        setOptions([...arr]);
      } else {
        const arr = [...OptionList];
        arr.splice(2, 0, strings.teamstitle);
        setOptions([...arr]);
      }
    }
  }, [user, sportObj, entityType, isFocused]);

  const renderSectionContent = (sectionName) => {
    switch (sectionName) {
      case strings.bio:
        return (
          <>
            <ReadMore
              style={styles.label}
              numberOfLines={7}
              seeMoreText={strings.moreText}
              seeLessText={strings.lessText}
              seeLessStyle={styles.moreTextStyle}
              seeMoreStyle={styles.moreTextStyle}>
              {sportObj.descriptions}
            </ReadMore>
            {sportObj?.created_at ? (
              <Text style={[styles.smallText, {marginTop: 5}]}>
                {format(
                  strings.registerDate,
                  getTitleForRegister(entityType),
                  moment(
                    getJSDate(new Date(sportObj.created_at).getTime()),
                  ).format('YYYY'),
                )}
              </Text>
            ) : null}
          </>
        );

      case strings.basicInfoText:
        return <UserDetails user={user} />;

      case strings.clubstitle:
        return (
          <ClubList list={user.joined_clubs ?? []} sport={sportObj?.sport} />
        );

      case strings.leagues:
        return <Text style={styles.label}>{strings.noneText}</Text>;

      case strings.homeFacility:
        return user?.homePlace ? (
          <View style={{width: Dimensions.get('window').width}}>
            <View style={{paddingHorizontal: 17}}>
              <Text
                style={[
                  styles.label,
                  {fontFamily: fonts.RMedium, marginBottom: 5},
                ]}>
                {user.homePlace.name}
              </Text>
              <Text style={styles.label}>{user.homePlace.address}</Text>
            </View>
            <EventMapView
              coordinate={user.homePlace.coordinate}
              region={user.homePlace.region}
              style={{width: Dimensions.get('window').width, marginBottom: 15}}
            />
          </View>
        ) : (
          <Text style={[styles.label, {paddingHorizontal: 17}]}>
            {strings.noneText}
          </Text>
        );

      case strings.ntrpTitle:
        return (
          <View style={styles.row}>
            <View style={{alignItems: 'flex-start'}}>
              <Text
                style={[
                  styles.label,
                  {fontFamily: fonts.RMedium, color: colors.googleColor},
                ]}>
                {strings.levelText}
              </Text>
            </View>
            <View style={{alignItems: 'flex-start'}}>
              <Text style={[styles.label, {textAlign: 'right'}]}>
                {sportObj?.ntrp ?? '5.0'}
              </Text>
            </View>
          </View>
        );

      case strings.matchVenues:
        return <Venues list={sportObj.setting?.venue ?? []} />;

      case strings.teamstitle:
        return (
          <TeamsList
            list={user.joined_teams ?? []}
            sport={sportObj?.sport}
            sportType={sportObj?.sport_type}
          />
        );

      case strings.certiTitle:
        return (
          <CertificateList
            list={sportObj?.certificates ?? []}
            onAdd={() =>
              handleEditOption(sectionName, strings.editCertificateText)
            }
            onPress={onPressCertificate}
          />
        );

      case strings.servicableAreas:
        return (
          <ServicableArea avialableArea={sportObj.setting?.available_area} />
        );

      default:
        return null;
    }
  };

  const editOptions = (sectionName) => {
    switch (sectionName) {
      case strings.bio:
        setEditModalInfo({
          section: sectionName,
          buttonText: strings.editbio,
          showPrivacy: true,
          privacyKey: privacyKey.bio,
        });
        setShowEditModal(true);
        break;

      case strings.basicInfoText:
        setEditModalInfo({
          section: sectionName,
          // buttonText: strings.editBasicInfoText,
          buttonText: '',
          showPrivacy: true,
          privacyKey: privacyKey.basicInfo,
        });
        setShowEditModal(true);
        break;

      case strings.clubstitle:
        setEditModalInfo({
          section: sectionName,
          buttonText: '',
          showPrivacy: true,
          privacyKey: privacyKey.club,
        });
        setShowEditModal(true);
        break;

      case strings.leagues:
        setEditModalInfo({
          section: sectionName,
          buttonText: '',
          showPrivacy: true,
          privacyKey: privacyKey.leagues,
        });
        setShowEditModal(true);
        break;

      case strings.homeFacility:
        setEditModalInfo({
          section: sectionName,
          buttonText: strings.editHomePlaceText,
          showPrivacy: true,
          privacyKey: privacyKey.homeFacility,
        });
        setShowEditModal(true);
        break;

      case strings.ntrpTitle:
        setEditModalInfo({
          section: sectionName,
          buttonText: strings.editNTRPText,
          showPrivacy: true,
          privacyKey: privacyKey.ntrp,
        });
        setShowEditModal(true);
        break;

      case strings.matchVenues:
        setEditModalInfo({
          section: sectionName,
          buttonText: strings.challengeSettingText,
          showPrivacy: false,
          privacyKey: '',
        });
        setShowEditModal(true);
        break;

      case strings.teamstitle:
        break;

      case strings.certiTitle:
        setEditModalInfo({
          section: sectionName,
          buttonText: strings.editCertificateText,
          showPrivacy: false,
          privacyKey: '',
        });
        setShowEditModal(true);
        break;

      case strings.servicableAreas:
        setEditModalInfo({
          section: sectionName,
          buttonText: strings.editServicableAreasText,
          showPrivacy: false,
          privacyKey: '',
        });
        setShowEditModal(true);
        break;

      default:
        break;
    }
  };

  return (
    <View style={styles.parent}>
      <FlatList
        data={options}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => (
          <View>
            <View
              style={[
                styles.sectionContainer,
                item === strings.basicInfoText
                  ? {paddingVertical: 0, paddingTop: 25, paddingBottom: 10}
                  : {},
                item === strings.matchVenues || item === strings.homeFacility
                  ? {paddingHorizontal: 0}
                  : {},
              ]}>
              <View
                style={[
                  styles.row,
                  {marginBottom: 15},
                  item === strings.matchVenues || item === strings.homeFacility
                    ? {paddingHorizontal: 17}
                    : {},
                ]}>
                <View style={[styles.row, {justifyContent: 'center'}]}>
                  <Text style={styles.sectionTitle}>{item.toUpperCase()}</Text>
                  {item === strings.matchVenues ? (
                    <TouchableOpacity
                      style={styles.infoButtonContainer}
                      onPress={() => setShowInfo(true)}>
                      <Image source={images.infoIcon} style={styles.icon} />
                    </TouchableOpacity>
                  ) : null}
                </View>
                {isAdmin ? (
                  <TouchableOpacity
                    style={styles.editButtonContainer}
                    onPress={() => editOptions(item)}>
                    <Image source={images.editPencil} style={styles.icon} />
                  </TouchableOpacity>
                ) : null}
              </View>
              {renderSectionContent(item)}
            </View>
            {index !== options.length - 1 ? (
              <View style={styles.separator} />
            ) : null}
          </View>
        )}
      />
      <Modal visible={showInfo} transparent animationType="slide">
        <Pressable
          style={styles.modalParent}
          onPress={() => setShowInfo(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={styles.handle} />
            <Text style={styles.label}>{strings.matchVenueInfo}</Text>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={showEditModal} transparent animationType="slide">
        <View style={styles.modalParent}>
          <View style={styles.card}>
            {editModalInfo.buttonText ? (
              <>
                <Pressable
                  style={styles.modalButtonContainer}
                  onPress={() => {
                    handleEditOption(
                      editModalInfo.section,
                      editModalInfo.buttonText,
                    );
                    setShowEditModal(false);
                  }}>
                  <Text style={styles.modalButtonText}>
                    {editModalInfo.buttonText}
                  </Text>
                </Pressable>
                <View style={styles.modalLineSeparator} />
              </>
            ) : null}
            {editModalInfo.showPrivacy ? (
              <Pressable
                style={styles.modalButtonContainer}
                onPress={() => {
                  openPrivacySettings(
                    editModalInfo.section,
                    editModalInfo.privacyKey,
                  );
                  setShowEditModal(false);
                }}>
                <Text style={styles.modalButtonText}>
                  {strings.privacySettingText}
                </Text>
              </Pressable>
            ) : null}
          </View>
          <Pressable
            style={styles.modalCancelButton}
            onPress={() => setShowEditModal(false)}>
            <Text style={styles.modalButtonText}>{strings.cancel}</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

export default InfoContentScreen;
