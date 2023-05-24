import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
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

const teamOptions = [
  strings.bio,
  strings.basicInfoText,
  strings.homeFacility,
  strings.membersTitle,
  strings.tcLevelPointsText,
  strings.tcranking,
  strings.matchVenues,
  strings.clubsTitleText,
  strings.membershipFee,
  strings.bylaw,
];

const clubOptions = [
  strings.bio,
  strings.basicInfoText,
  strings.membersTitle,
  strings.teams,
  strings.membershipFee,
  strings.bylaw,
  strings.history,
];

export default function GroupInfo({
  groupDetails = {},
  isAdmin = false,
  onSeeAll = () => {},
  onPressMember = () => {},
  onPressGroup = () => {},
  onEdit = () => {},
  onClickPrivacy = () => {},
  onAddMember = () => {},
}) {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalOptions, setModalOptions] = useState([]);

  useEffect(() => {
    if (groupDetails.entity_type) {
      setOptions(
        groupDetails.entity_type === Verbs.entityTypeClub
          ? clubOptions
          : teamOptions,
      );
    }
  }, [groupDetails]);

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
        optionList = [strings.privacySettingText];
        break;

      case strings.membersTitle:
        optionList = [strings.privacySettingText];
        break;

      case strings.tcLevelPointsText:
        break;

      case strings.tcranking:
        break;

      case strings.matchVenues:
        optionList = [format(strings.editOption, strings.matchVenues)];
        break;

      case strings.clubsTitleText:
        optionList = [strings.privacySettingText];
        break;

      case strings.membershipFee:
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
    const clubList =
      groupDetails.joined_clubs?.length > 0
        ? [...groupDetails.joined_clubs]
        : [];

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
        return null;

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
            {clubList.length > 0
              ? clubList.map((item, index) => {
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
                      {index !== 2 && clubList.length !== 1 ? (
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
        return (
          <>
            <View
              style={[
                styles.row,
                {marginBottom: 15, alignItems: 'flex-start'},
              ]}>
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
              style={[
                styles.row,
                {marginBottom: 15, alignItems: 'flex-start'},
              ]}>
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
            {groupDetails.membership_fee_details && (
              <View style={{marginBottom: 15}}>
                <View style={[styles.col, {marginBottom: 10}]}>
                  <Text style={styles.label}>
                    {strings.venueDetailsPlaceholder}
                  </Text>
                </View>
                <View>
                  <Text style={styles.longTextStyle}>
                    {groupDetails.membership_fee_details}
                  </Text>
                </View>
              </View>
            )}
          </>
        );

      case strings.teams:
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
                  <Text style={styles.headingLabel}>{item.toUpperCase()}</Text>
                  {item === strings.matchVenues ? (
                    <TouchableOpacity
                      style={{width: 15, height: 15, marginLeft: 5}}>
                      <Image source={images.infoIcon} style={styles.image} />
                    </TouchableOpacity>
                  ) : null}
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {item === strings.membersTitle ||
                  item === strings.clubsTitleText ? (
                    <TouchableOpacity
                      style={{marginRight: 10}}
                      onPress={() => onSeeAll(item)}>
                      <Text
                        style={[
                          styles.moreLessText,
                          {color: colors.themeColor},
                        ]}>
                        {strings.seeAllText}
                      </Text>
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
      />
      <BottomSheet
        isVisible={showModal}
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
    lineHeight: 18,
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
});
