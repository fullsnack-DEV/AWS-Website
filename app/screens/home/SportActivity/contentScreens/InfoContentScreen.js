// @flow
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
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
import {DEFAULT_NTRP, privacyKey} from '../../../../Constants/GeneralConstants';
import {getJSDate} from '../../../../utils';
import CertificateList from '../components/CertificateList';
import ServicableArea from '../components/ServicableArea';
import {getTitleForRegister} from '../../../../utils/sportsActivityUtils';
import BottomSheet from '../../../../components/modals/BottomSheet';
import {PrivacyKeyEnum} from '../../../../Constants/PrivacyOptionsConstant';

const OptionList = [
  strings.abouttitle,
  strings.basicInfoText,
  strings.clubstitle,
  strings.leagues,
];

const OptionList1 = [
  strings.abouttitle,
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
  privacyStatus = {},
  setShowInfo = () => {},
  userPrivacyStatus = {},
}) => {
  const [options, setOptions] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editModalInfo, setEditModalInfo] = useState({
    section: '',
    privacyKey: '',
  });
  const [editButtonOptions, setEditButtonOptions] = useState([]);

  const [forHome] = useState(true);
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
        arr.splice(3, 0, strings.availableMatchVenues);
        arr.splice(4, 0, strings.ntrpTitle);

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
      case strings.abouttitle:
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
                  getTitleForRegister(entityType, forHome),
                  moment(
                    getJSDate(new Date(sportObj.created_at).getTime()),
                  ).format('YYYY'),
                )}
              </Text>
            ) : null}
          </>
        );

      case strings.basicInfoText:
        return <UserDetails user={user} privacyStatus={userPrivacyStatus} />;

      case strings.clubstitle:
        return privacyStatus[PrivacyKeyEnum.Clubs] ? (
          <ClubList list={user.joined_clubs ?? []} sport={sportObj?.sport} />
        ) : null;

      case strings.leagues:
        return privacyStatus[PrivacyKeyEnum.Leagues] ? (
          <Text style={styles.label}>{strings.noneText}</Text>
        ) : null;

      case strings.homeFacility:
        if (!privacyStatus[PrivacyKeyEnum.HomeFacility]) {
          return null;
        }
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
              style={{
                width: Dimensions.get('window').width,
                marginBottom: 15,
              }}
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
                {sportObj?.ntrp ?? DEFAULT_NTRP}
              </Text>
            </View>
          </View>
        );

      case strings.availableMatchVenues:
        return <Venues list={sportObj.setting?.venue ?? []} />;

      case strings.teamstitle:
        return privacyStatus[PrivacyKeyEnum.Teams] ? (
          <TeamsList
            list={user.joined_teams ?? []}
            sport={sportObj?.sport}
            sportType={sportObj?.sport_type}
          />
        ) : null;

      case strings.certiTitle:
        return isAdmin ? (
          <CertificateList
            list={sportObj?.certificates ?? []}
            onAdd={() =>
              handleEditOption(sectionName, strings.editCertificateText)
            }
            onPress={onPressCertificate}
          />
        ) : (
          <Text style={styles.label}>{strings.noneText}</Text>
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
      case strings.abouttitle:
        handleEditOption(sectionName, strings.editabouttitle);
        break;

      case strings.basicInfoText:
        setEditModalInfo({
          section: sectionName,
          privacyKey: privacyKey.basicInfo,
        });
        setEditButtonOptions([
          strings.editBasicInfoText,
          strings.privacySettingText,
        ]);
        setShowEditModal(true);
        break;

      case strings.clubstitle:
        setEditModalInfo({
          section: sectionName,
          privacyKey: privacyKey.club,
        });
        setEditButtonOptions([strings.privacySettingText]);
        setShowEditModal(true);
        break;

      case strings.leagues:
        setEditModalInfo({
          section: sectionName,
          privacyKey: privacyKey.leagues,
        });
        setEditButtonOptions([strings.privacySettingText]);
        setShowEditModal(true);
        break;

      case strings.homeFacility:
        setEditModalInfo({
          section: sectionName,
          privacyKey: privacyKey.homeFacility,
        });
        setEditButtonOptions([
          strings.editHomePlaceText,
          strings.privacySettingText,
        ]);
        setShowEditModal(true);
        break;

      case strings.ntrpTitle:
        handleEditOption(sectionName, strings.editNTRPText);
        break;

      case strings.availableMatchVenues:
        setEditModalInfo({
          section: sectionName,
          privacyKey: '',
        });
        setEditButtonOptions([strings.incomingChallengeSettingsTitle]);
        setShowEditModal(true);
        break;

      case strings.teamstitle:
        setEditModalInfo({
          section: sectionName,
          privacyKey: privacyKey.teams,
        });
        setEditButtonOptions([strings.privacySettingText]);
        setShowEditModal(true);
        break;

      case strings.certiTitle:
        handleEditOption(sectionName, strings.editCertificateText);
        break;

      case strings.servicableAreas:
        handleEditOption(sectionName, strings.editServicableAreasText);
        break;

      default:
        break;
    }
  };

  return (
    <>
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
                item === strings.availableMatchVenues ||
                item === strings.homeFacility
                  ? {paddingHorizontal: 0}
                  : {},
              ]}>
              <View
                style={[
                  styles.row,
                  {marginBottom: 15},
                  item === strings.availableMatchVenues ||
                  item === strings.homeFacility
                    ? {paddingHorizontal: 17}
                    : {},
                ]}>
                <View style={[styles.row, {justifyContent: 'center'}]}>
                  <Text style={styles.sectionTitle}>{item}</Text>
                  {item === strings.availableMatchVenues ? (
                    <TouchableOpacity
                      style={styles.infoButtonContainer}
                      onPress={() => setShowInfo()}>
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

      <BottomSheet
        isVisible={showEditModal}
        closeModal={() => setShowEditModal(false)}
        optionList={editButtonOptions}
        onSelect={(option, index) => {
          if (editButtonOptions.length > 1) {
            if (index === 0) {
              handleEditOption(editModalInfo.section, option);
            } else if (index === 1) {
              openPrivacySettings(
                editModalInfo.section,
                editModalInfo.privacyKey,
              );
            }
          } else if (editModalInfo.privacyKey) {
            openPrivacySettings(
              editModalInfo.section,
              editModalInfo.privacyKey,
            );
          } else {
            handleEditOption(editModalInfo.section, option);
          }
          setShowEditModal(false);
        }}
      />
    </>
  );
};

export default InfoContentScreen;
