import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {format} from 'react-string-format';
import ReadMore from '@fawazahmed/react-native-read-more';
import moment from 'moment';
import {strings} from '../../../Localization/translation';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import * as Utility from '../../utils';
import images from '../../Constants/ImagePath';
import Verbs from '../../Constants/Verbs';
import MemberList from './MemberList';
import GroupBasicInfo from './Team/GroupBasicInfo';
import Venues from '../../screens/home/SportActivity/components/Venues';
import TeamCard from '../TeamCard';
import BottomSheet from '../modals/BottomSheet';

import {getGroupDetails} from '../../api/Groups';
import EditHomeFacilityScreen from '../../screens/home/SportActivity/contentScreens/EditHomeFacilityScreen';
import GroupIcon from '../GroupIcon';
import TCThinDivider from '../TCThinDivider';
import TCTextField from '../TCTextField';
import {JoinPrivacy} from '../../Constants/GeneralConstants';

export default function GroupInfo({
  groupDetails = {},
  isAdmin = false,
  onSeeAll = () => {},
  onPressMember = () => {},
  onPressGroup = () => {},
  onEdit = () => {},
  onClickPrivacy = () => {},
  onAddMember = () => {},
  authContext,
  forJoinButton = false,
  onJoinPress = () => {},
  onAcceptPress = () => {},
  isInvited = false,
  hideMessageBox = false,
  forUserRespond = false,
  onDecline = () => {},
  teamOptions = [],
  clubOptions = [],
  teamOptiosnForJoin = [],
  clubOptiosnForJoin = [],
}) {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalOptions, setModalOptions] = useState([]);
  const [clubTeams, setClubTeams] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (groupDetails.entity_type) {
      if (!forJoinButton) {
        setOptions(
          groupDetails.entity_type === Verbs.entityTypeClub
            ? clubOptions
            : teamOptions,
        );
      } else {
        setOptions(
          groupDetails.entity_type === Verbs.entityTypeClub
            ? clubOptiosnForJoin
            : teamOptiosnForJoin,
        );
      }
    }
  }, [forJoinButton, groupDetails]);

  useEffect(() => {
    const fetchClubTeams = async () => {
      const teams = await Promise.all(
        groupDetails.joined_clubs.map((club) =>
          getGroupDetails(club, authContext),
        ),
      );
      const payloadOnly = teams.map((team) => team.payload);

      setClubTeams(payloadOnly);
    };

    if (groupDetails.joined_clubs && groupDetails.joined_clubs.length > 0) {
      fetchClubTeams();
    }
  }, [groupDetails.joined_clubs, authContext]);

  const handleEdit = (option) => {
    let optionList = [];
    switch (option) {
      case strings.bio:
        optionList = [
          format(strings.editOption, strings.bio),
          strings.privacySettingText,
        ];
        break;

      case strings.basicInfoText:
        optionList = [
          format(strings.editOption, strings.basicInfoText),
          strings.privacySettingText,
        ];
        break;

      case strings.homeFacility:
        optionList = [
          format(strings.editOption, strings.homeFacility),
          strings.privacySettingText,
        ];
        break;

      case strings.membersTitle:
        optionList = [strings.privacySettingText];
        break;

      case strings.tcLevelPointsText:
        break;

      case strings.tcranking:
        break;

      case strings.matchVenues:
        optionList = [
          format(strings.editOption, strings.matchVenues),
          strings.privacySettingText,
        ];
        break;

      case strings.clubsTitleText:
        optionList = [strings.privacySettingText];
        break;

      case strings.membershipFee || strings.membershipFeesTitle:
        optionList = [
          format(strings.editOption, strings.membershipFee),
          strings.privacySettingText,
        ];
        break;

      case strings.teams:
        optionList = [strings.privacySettingText];
        break;

      case strings.bylaw:
        optionList = [
          format(strings.editOption, strings.bylaw),
          strings.privacySettingText,
        ];
        break;

      case strings.history:
        optionList = [
          format(strings.editOption, strings.history),
          strings.privacySettingText,
        ];
        break;

      default:
        break;
    }
    setSelectedOption(option);
    setModalOptions(optionList);
    setShowModal(true);
  };

  const renderSectionContent = (option) => {
    const teamList =
      groupDetails.joined_teams?.length > 0
        ? [...groupDetails.joined_teams]
        : [];
    switch (option) {
      case strings.bio:
        return (
          <View>
            <ReadMore
              numberOfLines={7}
              style={styles.longTextStyle}
              seeMoreText={strings.moreText}
              seeLessText={strings.lessText}
              seeLessStyle={styles.moreLessText}
              seeMoreStyle={styles.moreLessText}>
              {groupDetails.bio}
            </ReadMore>
            <Text style={[styles.moreLessText, {marginTop: 5}]}>
              {strings.signedupin}
              {moment(Utility.getJSDate(groupDetails.createdAt)).format('YYYY')}
            </Text>
          </View>
        );

      case strings.basicInfoText:
        return <GroupBasicInfo groupDetails={groupDetails} />;

      case strings.homeFacility:
        return <EditHomeFacilityScreen />;

      case strings.membersTitle:
        return (
          <MemberList
            list={groupDetails.joined_members}
            isAdmin={isAdmin}
            onPressMember={onPressMember}
            onPressMore={() => {
              onSeeAll(option);
            }}
            addMember={onAddMember}
          />
        );

      case strings.tcLevelPointsText:
        return (
          <>
            <View style={[styles.row, {marginBottom: 15}]}>
              <View style={styles.col}>
                <Text style={styles.label}>{strings.tcLevel}</Text>
              </View>
              <View style={styles.col}>
                <Text style={[styles.longTextStyle, {textAlign: 'right'}]}>
                  {groupDetails.level ?? '5'}
                </Text>
              </View>
            </View>

            <View style={[styles.row, {marginBottom: 15}]}>
              <View style={styles.col}>
                <Text style={styles.label}>{strings.tcpoint}</Text>
              </View>
              <View style={styles.col}>
                <Text style={[styles.longTextStyle, {textAlign: 'right'}]}>
                  {groupDetails.point ?? strings.NA}
                </Text>
              </View>
            </View>
          </>
        );

      case strings.tcranking:
        return (
          <>
            <View style={[styles.row, {marginBottom: 15}]}>
              <View style={styles.col}>
                <Text style={styles.label}>Vancouver</Text>
              </View>
              <View style={styles.col}>
                <Text style={[styles.longTextStyle, {textAlign: 'right'}]}>
                  {groupDetails.level ?? '7th'}
                </Text>
              </View>
            </View>

            <View style={[styles.row, {marginBottom: 15}]}>
              <View style={styles.col}>
                <Text style={styles.label}>Bc</Text>
              </View>
              <View style={styles.col}>
                <Text style={[styles.longTextStyle, {textAlign: 'right'}]}>
                  {groupDetails.level ?? '24th'}
                </Text>
              </View>
            </View>

            <View style={[styles.row, {marginBottom: 15}]}>
              <View style={styles.col}>
                <Text style={styles.label}>Canada</Text>
              </View>
              <View style={styles.col}>
                <Text style={[styles.longTextStyle, {textAlign: 'right'}]}>
                  {groupDetails.level ?? '100th'}
                </Text>
              </View>
            </View>

            <View style={[styles.row, {marginBottom: 15}]}>
              <View style={styles.col}>
                <Text style={styles.label}>World</Text>
              </View>
              <View style={styles.col}>
                <Text style={[styles.longTextStyle, {textAlign: 'right'}]}>
                  {groupDetails.level ?? '-'}
                </Text>
              </View>
            </View>
          </>
        );

      case strings.matchVenues:
        return <Venues list={groupDetails.setting?.venue ?? []} />;

      case strings.clubsTitleText:
        return (
          <View>
            {clubTeams.length > 0
              ? clubTeams.map((item, index) => {
                  if (authContext.entity.uid === item.group_id) {
                    return null;
                  }
                  if (index > 2) {
                    return null;
                  }
                  return (
                    <>
                      <TeamCard
                        item={item}
                        key={index}
                        onPress={() => onPressGroup(item)}
                      />
                      {index !== 2 && clubTeams.length !== 1 ? (
                        <View
                          style={{
                            height: 1,
                            backgroundColor: colors.grayBackgroundColor,
                            marginVertical: 15,
                          }}
                        />
                      ) : null}
                    </>
                  );
                })
              : null}
          </View>
        );

      case strings.membershipFee:
        return renderMatchFeeSection();

      case strings.membershipFeesTitle:
        return renderMatchFeeSection();

      case strings.teamsTiteInfo:
        return (
          <View>
            {teamList.length > 0 ? (
              teamList.map((item, index) => {
                if (index > 2) {
                  return null;
                }
                return (
                  <>
                    <TeamCard
                      item={item}
                      key={index}
                      onPress={() => onPressGroup(item)}
                    />
                    {index !== 2 && teamList.length !== 1 ? (
                      <View
                        style={{
                          height: 1,
                          backgroundColor: colors.grayBackgroundColor,
                          marginVertical: 15,
                        }}
                      />
                    ) : null}
                  </>
                );
              })
            ) : (
              <Text style={styles.longTextStyle}>{strings.NA}</Text>
            )}
          </View>
        );
      case strings.bylaw:
        return groupDetails.bylaw ? (
          <ReadMore
            numberOfLines={7}
            style={styles.longTextStyle}
            seeMoreText={strings.moreText}
            seeLessText={strings.lessText}
            seeLessStyle={styles.moreLessText}
            seeMoreStyle={styles.moreLessText}>
            {groupDetails.bylaw}
          </ReadMore>
        ) : (
          <Text style={styles.longTextStyle}>{strings.NA}</Text>
        );

      case strings.history:
        return null;

      default:
        return null;
    }
  };

  const RenderHeader = () => (
    <View>
      {!forUserRespond ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginHorizontal: 15,
          }}>
          <GroupIcon
            entityType={groupDetails.entity_type}
            groupName={groupDetails.group_name}
            imageUrl={groupDetails.full_image}
            containerStyle={{width: 40, height: 40}}
            textstyle={{fontSize: 14}}
          />
          <View style={{marginLeft: 15}}>
            <Text
              style={{
                fontFamily: fonts.RBold,
                fontSize: 16,
                lineHeight: 24,
              }}>
              {' '}
              {groupDetails.group_name}{' '}
            </Text>
            <Text
              style={{
                marginLeft: 5,
                fontFamily: fonts.RLight,
                fontSize: 14,
                lineHeight: 21,
              }}>
              {groupDetails.city} {groupDetails.state_abbr}
            </Text>
            <Text
              style={{
                marginLeft: 5,
                fontFamily: fonts.RLight,
                fontSize: 14,
                lineHeight: 21,
              }}>
              {strings.tcLevel} {groupDetails.level ?? '5'}
            </Text>
          </View>
        </View>
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 15,
          }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: fonts.RMedium,
              lineHeight: 30,
              textAlign: 'center',
              marginHorizontal: 35,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.RBold,
                lineHeight: 30,
                textAlign: 'center',
                marginHorizontal: 35,
              }}>
              {groupDetails.group_name}{' '}
            </Text>
            {format(strings.invitedYouToJoinGroup, groupDetails.entity_type)}
          </Text>
          <View style={styles.backgroundImage}>
            {groupDetails.background_full_image ? (
              <Image
                source={{uri: groupDetails.background_full_image}}
                style={[styles.image, {borderRadius: 5, resizeMode: 'cover'}]}
              />
            ) : null}
          </View>
          <View
            style={{
              position: 'absolute',
              top: 180,
            }}>
            <GroupIcon
              entityType={groupDetails.entity_type}
              groupName={groupDetails.group_name}
              imageUrl={groupDetails.full_image}
            />
          </View>
          <Text
            style={{
              fontFamily: fonts.RBold,
              fontSize: 16,
              lineHeight: 24,
              marginTop: 30,
            }}>
            {groupDetails.group_name}
          </Text>
          <Text
            style={{
              marginLeft: 5,
              fontFamily: fonts.RLight,
              fontSize: 14,
              lineHeight: 21,
            }}>
            {groupDetails.city} {groupDetails.state_abbr}
          </Text>
        </View>
      )}

      <TCThinDivider
        height={7}
        marginBottom={25}
        width={'100%'}
        marginTop={25}
      />
    </View>
  );

  const MeesageFiled = () => (
    <TCTextField
      style={{
        marginHorizontal: 15,
        backgroundColor: colors.textFieldBackground,
        height: 100,
        marginVertical: 15,
        borderRadius: 5,
        paddingHorizontal: 12,
      }}
      onChangeText={(text) => setMessage(text)}
      placeholder={strings.sendMessagePlaceHolder}
      height={100}
      multiline
    />
  );

  const RenderJoinRequestButton = () => {
    if (isInvited) {
      return (
        <>
          <TouchableOpacity
            onPress={() => onAcceptPress()}
            style={{
              marginHorizontal: 15,
              backgroundColor: colors.reservationAmountColor,
              borderRadius: 30,
              marginBottom: 25,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: fonts.RBold,
                fontSize: 16,
                lineHeight: 24,
                paddingVertical: 8,
                color: colors.whiteColor,
                textTransform: 'uppercase',
              }}>
              {strings.acceptTitle}
            </Text>
          </TouchableOpacity>
          {forUserRespond && (
            <TouchableOpacity onPress={() => onDecline()}>
              <Text
                style={{
                  textTransform: 'uppercase',
                  color: colors.googleColor,
                  marginBottom: 100,
                  textAlign: 'center',
                  fontFamily: fonts.RBold,
                  fontSize: 16,
                  textDecorationLine: 'underline',
                }}>
                {strings.decline}
              </Text>
            </TouchableOpacity>
          )}
        </>
      );
    }

    if (
      authContext.entity.role === Verbs.entityTypeTeam &&
      groupDetails.entity_type === Verbs.entityTypeClub &&
      groupDetails.who_can_join_for_team === JoinPrivacy.acceptedByMe
    ) {
      return (
        <TouchableOpacity
          onPress={() => onJoinPress(message)}
          style={{
            marginHorizontal: 15,
            backgroundColor: colors.reservationAmountColor,
            borderRadius: 30,
            marginBottom: 25,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: fonts.RBold,
              fontSize: 16,
              lineHeight: 24,
              paddingVertical: 8,
              color: colors.whiteColor,
              textTransform: 'uppercase',
            }}>
            {strings.sendJoinRequestText}
          </Text>
        </TouchableOpacity>
      );
    }

    if (
      authContext.entity.role === Verbs.entityTypeTeam &&
      groupDetails.entity_type === Verbs.entityTypeClub &&
      groupDetails.who_can_join_for_team === JoinPrivacy.everyone
    ) {
      return (
        <TouchableOpacity
          onPress={() => onJoinPress(message)}
          style={{
            marginHorizontal: 15,
            backgroundColor: colors.reservationAmountColor,
            borderRadius: 30,
            marginBottom: 25,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: fonts.RBold,
              fontSize: 16,
              lineHeight: 24,
              paddingVertical: 8,
              color: colors.whiteColor,
              textTransform: 'uppercase',
            }}>
            {strings.join}
          </Text>
        </TouchableOpacity>
      );
    }

    if (groupDetails.who_can_join_for_member === JoinPrivacy.everyone) {
      return (
        <TouchableOpacity
          onPress={() => onJoinPress()}
          style={{
            marginHorizontal: 15,
            backgroundColor: colors.reservationAmountColor,
            borderRadius: 30,
            marginBottom: 25,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: fonts.RBold,
              fontSize: 16,
              lineHeight: 24,
              paddingVertical: 8,
              color: colors.whiteColor,
              textTransform: 'uppercase',
            }}>
            {strings.join}
          </Text>
        </TouchableOpacity>
      );
    }
    if (groupDetails.who_can_join_for_member === JoinPrivacy.acceptedByMe) {
      return (
        <TouchableOpacity
          onPress={() => onJoinPress(message)}
          style={{
            marginHorizontal: 15,
            backgroundColor: colors.reservationAmountColor,
            borderRadius: 30,
            marginBottom: 25,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: fonts.RBold,
              fontSize: 16,
              lineHeight: 24,
              paddingVertical: 8,
              color: colors.whiteColor,
              textTransform: 'uppercase',
            }}>
            {strings.sendJoinRequestText}
          </Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  const RenderMessageBox = () => {
    if (hideMessageBox || isInvited) {
      return null;
    }

    if (
      authContext.entity.role === Verbs.entityTypeTeam &&
      groupDetails.entity_type === Verbs.entityTypeClub &&
      groupDetails.who_can_join_for_team === JoinPrivacy.acceptedByMe
    ) {
      return (
        <>
          <Text style={[styles.headingLabel, {marginHorizontal: 15}]}>
            {format(strings.messageToJoinTeam, groupDetails.group_name)}
          </Text>
          {MeesageFiled()}
          <TCThinDivider
            height={7}
            marginTop={20}
            marginBottom={25}
            width={'100%'}
          />
        </>
      );
    }

    if (
      authContext.entity.role === Verbs.entityTypeTeam &&
      groupDetails.entity_type === Verbs.entityTypeClub &&
      groupDetails.who_can_join_for_team === JoinPrivacy.everyone
    ) {
      return null;
    }

    if (groupDetails.who_can_join_for_member !== JoinPrivacy.everyone) {
      return (
        <>
          <Text style={[styles.headingLabel, {marginHorizontal: 15}]}>
            {format(strings.messageToJoinTeam, groupDetails.group_name)}
          </Text>
          {MeesageFiled()}
          <TCThinDivider
            height={7}
            marginTop={20}
            marginBottom={25}
            width={'100%'}
          />
        </>
      );
    }
    return null;
  };

  const renderFooterComponent = () => (
    <View>
      {RenderMessageBox()}

      {RenderJoinRequestButton()}
    </View>
  );

  const renderMatchFeeSection = () => (
    <View>
      {!forJoinButton ? (
        <>
          <View
            style={[styles.row, {marginBottom: 15, alignItems: 'flex-start'}]}>
            <View style={styles.col}>
              <Text style={styles.label}>{strings.membershipfee}</Text>
            </View>
            <View style={styles.col}>
              <Text style={[styles.longTextStyle, {textAlign: 'right'}]}>
                {groupDetails?.membership_fee
                  ? `${groupDetails.membership_fee} ${
                      groupDetails.currency_type ?? Verbs.cad
                    }/${groupDetails.membership_fee_type}`
                  : '--'}
              </Text>
            </View>
          </View>

          <View
            style={[styles.row, {marginBottom: 15, alignItems: 'flex-start'}]}>
            <View style={styles.col}>
              <Text style={styles.label}>{strings.membershipregfee}</Text>
            </View>
            <View style={styles.col}>
              <Text style={[styles.longTextStyle, {textAlign: 'right'}]}>
                {groupDetails?.registration_fee
                  ? `${groupDetails.registration_fee}/${
                      groupDetails.currency_type ?? Verbs.cad
                    }`
                  : '--'}
              </Text>
            </View>
          </View>
          <>
            {groupDetails.membership_fee_details && (
              <View style={{marginBottom: 15}}>
                <View style={[styles.col, {marginBottom: 10}]}>
                  <Text style={styles.label}>
                    {strings.venueDetailsPlaceholder}
                  </Text>
                </View>
                <View>
                  <ReadMore
                    numberOfLines={3}
                    style={styles.longTextStyle}
                    seeMoreText={strings.moreText}
                    seeLessText={strings.lessText}
                    seeLessStyle={styles.moreLessText}
                    seeMoreStyle={styles.moreLessText}>
                    {groupDetails.membership_fee_details}
                  </ReadMore>
                </View>
              </View>
            )}
          </>
        </>
      ) : (
        <>
          <View
            style={[styles.row, {marginBottom: 20, alignItems: 'flex-start'}]}>
            <View style={styles.col}>
              <Text style={styles.label}>{strings.registrationFeeJoin}</Text>
            </View>
            <View style={styles.col}>
              <Text style={[styles.longTextStyle, {textAlign: 'right'}]}>
                {groupDetails?.registration_fee
                  ? `${groupDetails.registration_fee}/${
                      groupDetails.currency_type ?? Verbs.cad
                    }`
                  : '--'}
              </Text>
            </View>
          </View>

          <View
            style={[styles.row, {marginBottom: 15, alignItems: 'flex-start'}]}>
            <View style={styles.col}>
              <Text style={styles.label}>{strings.membershipfee}</Text>
              <Text> {strings.basicBiweekley} </Text>
            </View>
            <View style={styles.col}>
              <Text style={[styles.longTextStyle, {textAlign: 'right'}]}>
                {groupDetails?.membership_fee
                  ? `${groupDetails.membership_fee} ${
                      groupDetails.currency_type ?? Verbs.cad
                    }/${groupDetails.membership_fee_type}`
                  : '--'}
              </Text>
            </View>
          </View>

          <Text
            style={{
              color: colors.darkThemeColor,
              fontFamily: fonts.RRegular,
              fontSize: 12,
              lineHeight: 18,
            }}>
            {format(strings.matchFeeJointext, groupDetails.entity_type)}
          </Text>

          <TCThinDivider height={1} marginTop={20} />
          <Text
            style={{
              fontFamily: fonts.RRegular,
              fontSize: 16,
              lineHeight: 24,
              marginTop: 20,
            }}>
            {strings.memberSheepFeestitle}
          </Text>
        </>
      )}
    </View>
  );

  const renderTitle = (item) => {
    if (
      (item === strings.matchVenues && forJoinButton) ||
      (item === strings.matchVenues && forUserRespond)
    ) {
      return <Text style={styles.headingLabel}>{strings.homeFacility}</Text>;
    }
    return <Text style={styles.headingLabel}>{item}</Text>;
  };

  return (
    <View style={{flex: 1, paddingTop: 20}}>
      <FlatList
        data={options}
        keyExtractor={(item) => item}
        renderItem={({item}) => (
          <>
            <View style={styles.container}>
              <View style={[styles.row, {marginBottom: 15}]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {renderTitle(item)}
                  {item === strings.matchVenues && !forJoinButton ? (
                    <TouchableOpacity
                      style={{width: 15, height: 15, marginLeft: 5}}>
                      <Image source={images.infoIcon} style={styles.image} />
                    </TouchableOpacity>
                  ) : null}
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {item === strings.membersTitle ||
                  item === strings.clubsTitleText ||
                  item === strings.teamsTiteInfo ? (
                    <TouchableOpacity
                      style={{marginRight: 10}}
                      onPress={() => onSeeAll(item, clubTeams)}>
                      <Text
                        style={[
                          styles.moreLessText,
                          {color: colors.themeColor},
                        ]}>
                        {strings.seeAllText}
                      </Text>
                    </TouchableOpacity>
                  ) : null}

                  {item === strings.matchVenues &&
                  !isAdmin &&
                  authContext.entity.role === Verbs.entityTypeTeam &&
                  authContext.entity.obj.sport === groupDetails.sport ? (
                    <TouchableOpacity style={styles.buttonContainer}>
                      <Text style={styles.buttonText}>{strings.challenge}</Text>
                    </TouchableOpacity>
                  ) : null}

                  {isAdmin &&
                  item !== strings.tcLevelPointsText &&
                  item !== strings.tcranking ? (
                    <TouchableOpacity
                      style={styles.editIcon}
                      onPress={() => handleEdit(item)}>
                      <Image source={images.editPencil} style={styles.image} />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
              {renderSectionContent(item)}
            </View>
            <View style={styles.divider} />
          </>
        )}
        ListHeaderComponent={forJoinButton ? RenderHeader : null}
        ListFooterComponent={forJoinButton ? renderFooterComponent() : null}
      />
      <BottomSheet
        isVisible={showModal}
        type="ios"
        closeModal={() => {
          setShowModal(false);
        }}
        optionList={modalOptions}
        onSelect={(option) => {
          setShowModal(false);
          if (option === strings.privacySettingText) {
            onClickPrivacy(selectedOption);
          } else {
            onEdit(selectedOption);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    paddingHorizontal: 15,
  },
  editIcon: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  divider: {
    height: 7,
    marginVertical: 25,
    backgroundColor: colors.grayBackgroundColor,
  },
  headingLabel: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  longTextStyle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  moreLessText: {
    fontSize: 12,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.veryLightBlack,
    fontFamily: fonts.RMedium,
  },
  col: {
    flex: 1,
  },
  buttonContainer: {
    padding: 7,
    backgroundColor: colors.themeColor,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 15,
    lineHeight: 15,
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
  },
  backgroundImage: {
    height: 137,
    width: '100%',
    borderRadius: 5,
    backgroundColor: colors.textFieldBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});
