import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Pressable,
} from 'react-native';
import ReadMore from '@fawazahmed/react-native-read-more';
import moment from 'moment';
import Carousel from 'react-native-snap-carousel';
import {format} from 'react-string-format';
import {strings} from '../../../Localization/translation';
import TCEditHeader from '../TCEditHeader';
import {widthPercentageToDP} from '../../utils';
import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import * as Utility from '../../utils';
import UserInfoGroupItem from './User/UserInfoGroupItem';
import TCClubClipView from '../TCClubClipView';
import images from '../../Constants/ImagePath';
import AuthContext from '../../auth/context';
import EventMapView from '../Schedule/EventMapView';
import Verbs from '../../Constants/Verbs';
import {getSportName} from '../../utils/sportsActivityUtils';
import MemberList from './MemberList';
import GroupIcon from '../GroupIcon';

export default function GroupInfo({
  navigation,
  membersList = [],
  groupDetails = {},
  isAdmin = false,
  onGroupPress = () => {},
  onGroupListPress = () => {},
}) {
  const authContext = useContext(AuthContext);
  const [sportName, setSportName] = useState('');
  useEffect(() => {
    if (groupDetails.entity_type === Verbs.entityTypeClub) {
      if (groupDetails.sports?.length > 0) {
        let name = '';

        groupDetails.sports.forEach((item, index) => {
          const sportname = getSportName(
            item.sport,
            item.sport_type,
            authContext.sports,
          );

          if (index < 4) {
            name += index !== 0 ? `, ${sportname}` : sportname;
          }
        });

        if (groupDetails.sports.length > 4) {
          name += ` ${format(
            strings.andMoreText,

            groupDetails.sports.length - 4,
          )}`;
        }

        setSportName(name);
      } else {
        setSportName('');
      }
    }
  }, [groupDetails, authContext]);

  const renderTeam = ({item, index}) => (
    <>
      <Pressable
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => {
          onGroupPress(item);
        }}>
        <GroupIcon
          entityType={item.entity_type}
          groupName={item.group_name}
          imageUrl={groupDetails.thumbnail}
        />
        <View style={{marginLeft: 10}}>
          <Text style={[styles.longTextStyle, {fontFamily: fonts.RMedium}]}>
            {item.group_name}
          </Text>

          <Text
            style={{
              fontSize: 14,
              lineHeight: 21,
              fontFamily: fonts.RRegular,
              color: colors.lightBlackColor,
            }}>{`${Utility.displayLocation(
            groupDetails,
          )} · ${sportName}`}</Text>
        </View>
      </Pressable>
      {index !== groupDetails.joined_teams.length - 1 ? (
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

  const renderLeague = ({item}) => (
    <UserInfoGroupItem
      title={item.group_name}
      imageData={item.thumbnail ? images.leagueDemo : undefined}
      entityType={'league'}
      onGroupPress={() => {
        console.log('renderLeague press');
        onGroupPress(item);
      }}
    />
  );

  let office = groupDetails.office_address;
  let homefield = groupDetails.homefield_address;

  let memberage = strings.NA;

  if (!groupDetails.office_address) {
    office = isAdmin ? strings.addoffice : strings.NA;
  }
  if (!groupDetails.homefield_address) {
    homefield = isAdmin ? strings.addhomefield : strings.NA;
  }

  const coordinates = [];
  const markers = [];

  if (
    groupDetails.homefield_address_latitude &&
    groupDetails.homefield_address_longitude
  ) {
    coordinates.push({
      latitude: Number(groupDetails.homefield_address_latitude),
      longitude: Number(groupDetails.homefield_address_longitude),
    });
    markers.push({
      id: '1',
      latitude: groupDetails.homefield_address_latitude,
      longitude: groupDetails.homefield_address_longitude,
      name: strings.homeaddress,
      adddress: homefield,
      pinColor: 'red',
    });
  }

  if (
    groupDetails.office_address_latitude &&
    groupDetails.office_address_longitude
  ) {
    coordinates.push({
      latitude: Number(groupDetails.office_address_latitude),
      longitude: Number(groupDetails.office_address_longitude),
    });
    markers.push({
      id: '2',
      latitude: Number(groupDetails.office_address_latitude),
      longitude: Number(groupDetails.office_address_longitude),
      name: strings.officeaddress,
      adddress: office,
      pinColor: 'green',
    });
  }

  if (groupDetails.min_age && groupDetails.max_age) {
    memberage = `${strings.minPlaceholder} ${groupDetails.min_age} ${strings.maxPlaceholder} ${groupDetails.max_age}`;
  } else if (groupDetails.max_age) {
    memberage = `${strings.maxPlaceholder} ${groupDetails.max_age}`;
  } else if (groupDetails.min_age) {
    memberage = `${strings.minPlaceholder} ${groupDetails.min_age}`;
  }

  const renderVenues = ({item}) => {
    console.log('venue item:=>', item);
    return (
      <View style={styles.venueContainer}>
        <Text style={styles.venueTitle}>{item.name}</Text>
        <Text style={styles.venueAddress}>{item.address}</Text>

        <EventMapView
          coordinate={item.coordinate}
          region={item.region}
          style={{width: Dimensions.get('window').width - 60}}
        />
      </View>
    );
  };

  return (
    <View style={{flex: 1, paddingTop: 20}}>
      {/* Bio section */}
      <View style={styles.sectionStyle}>
        <TCEditHeader
          title={strings.bio}
          showEditButton={isAdmin}
          onEditPress={() => {
            navigation.navigate('GroupLongTextScreen', {
              groupDetails,
            });
          }}
        />

        {groupDetails.bio && (
          <ReadMore
            numberOfLines={7}
            style={styles.longTextStyle}
            seeMoreText={strings.moreText}
            seeLessText={strings.lessText}
            seeLessStyle={styles.moreLessText}
            seeMoreStyle={styles.moreLessText}>
            {groupDetails.bio}
          </ReadMore>
        )}

        <Text style={[styles.moreLessText, {marginTop: 5}]}>
          {strings.signedupin}
          {moment(Utility.getJSDate(groupDetails.createdAt)).format('YYYY')}
        </Text>

        {groupDetails.club && (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              height: 30,
              marginTop: 10,
              maxWidth: '80%',
            }}>
            <TCClubClipView
              name={groupDetails.club.group_name}
              image={groupDetails.club.thumbnail}
            />
          </View>
        )}
      </View>

      <View style={styles.dividor} />

      {/* Basic Info section */}
      <View style={styles.sectionStyle}>
        <TCEditHeader
          title={strings.basicinfotitle}
          showEditButton={isAdmin}
          onEditPress={() => {
            navigation.navigate('EditGroupBasicInfoScreen', {
              groupDetails,
            });
          }}
        />

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={[styles.longTextStyle, {fontFamily: fonts.RMedium}]}>
              {strings.sport}
            </Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.longTextStyle}>
              {groupDetails.entity_type === Verbs.entityTypeClub
                ? groupDetails.sports_string
                : getSportName(
                    groupDetails.sport,
                    groupDetails.sport_type,
                    authContext.sports,
                  )}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={[styles.longTextStyle, {fontFamily: fonts.RMedium}]}>
              {strings.homeCity}
            </Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.longTextStyle}>{groupDetails.city}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={[styles.longTextStyle, {fontFamily: fonts.RMedium}]}>
              {strings.membersgender}
            </Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.longTextStyle}>
              {groupDetails.gender
                ? Utility.capitalize(groupDetails.gender)
                : '--'}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={[styles.longTextStyle, {fontFamily: fonts.RMedium}]}>
              {strings.membersage}
            </Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.longTextStyle}>{memberage}</Text>
          </View>
        </View>

        <View style={[styles.row, {marginBottom: 0}]}>
          <View style={styles.col}>
            <Text style={[styles.longTextStyle, {fontFamily: fonts.RMedium}]}>
              {strings.languages}
            </Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.longTextStyle}>
              {groupDetails.language?.toString() ?? '--'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.dividor} />

      {/* Home facility */}
      {groupDetails.entity_type === Verbs.entityTypeTeam && (
        <>
          <View style={styles.sectionStyle}>
            <TCEditHeader
              title={strings.homeFacility}
              showEditButton={isAdmin}
            />
          </View>
          <View style={styles.dividor} />
        </>
      )}

      {/* Members list section */}
      <View style={styles.sectionStyle}>
        <TCEditHeader
          title={strings.membersTitle}
          showEditButton={isAdmin}
          showSeeAll
          onSeeAll={() => {
            navigation.navigate('GroupMembersScreen', {
              groupObj: groupDetails,
              groupID: groupDetails.group_id,
              fromProfile: true,
            });
          }}
        />
        <MemberList
          list={membersList}
          isAdmin={isAdmin}
          onPressMember={(groupObject) => {
            navigation.push('HomeScreen', {
              uid: groupObject?.group_id,
              role: groupObject?.entity_type,
            });
          }}
          onPressMore={() => {
            navigation.navigate('GroupMembersScreen', {
              groupObj: groupDetails,
              groupID: groupDetails.group_id,
              fromProfile: true,
            });
          }}
        />
      </View>
      <View style={styles.dividor} />

      {/* TC Point section */}
      {groupDetails.entity_type === Verbs.entityTypeTeam && (
        <View>
          <View style={styles.sectionStyle}>
            <TCEditHeader
              title={strings.tcLevelPointsText}
              showEditButton={false}
              // subTitle={`${groupDetails.point} P`}
              onEditPress={() => {}}
            />

            <View style={styles.row}>
              <View style={styles.col}>
                <Text
                  style={[styles.longTextStyle, {fontFamily: fonts.RMedium}]}>
                  {strings.tcLevel}
                </Text>
              </View>
              <View style={[styles.col, {alignItems: 'flex-end'}]}>
                <Text style={[styles.longTextStyle, {textAlign: 'right'}]}>
                  {groupDetails.level ?? '--'}
                </Text>
              </View>
            </View>
            <View style={[styles.row, {marginBottom: 0}]}>
              <View style={styles.col}>
                <Text
                  style={[styles.longTextStyle, {fontFamily: fonts.RMedium}]}>
                  {strings.tcpoint}
                </Text>
              </View>
              <View style={[styles.col, {alignItems: 'flex-end'}]}>
                <Text style={[styles.longTextStyle, {textAlign: 'right'}]}>
                  {groupDetails.point ?? '--'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.dividor} />
        </View>
      )}

      {/* TC Ranking */}
      {groupDetails.entity_type === Verbs.entityTypeTeam && (
        <>
          <View style={styles.sectionStyle}>
            <TCEditHeader title={strings.tcranking} showEditButton={isAdmin} />
          </View>
          <View style={styles.dividor} />
        </>
      )}

      {/* Match Venues */}
      {groupDetails.entity_type === Verbs.entityTypeTeam && (
        <View>
          <View style={styles.sectionStyle}>
            <TCEditHeader
              title={strings.matchVenues}
              showEditButton={isAdmin}
              onEditPress={() => {
                navigation.navigate('Venue', {
                  settingObj: authContext?.entity?.obj?.setting ?? {},
                  comeFrom: 'EntityInfoScreen',
                  sportName: groupDetails.sport,
                  sportType: groupDetails.sport_type,
                });
              }}
            />
          </View>

          {groupDetails.setting?.venue &&
          groupDetails.setting.venue.length > 0 ? (
            <Carousel
              data={groupDetails.setting?.venue ?? []} // recentMatch
              scrollEnabled={
                groupDetails.setting?.venue &&
                groupDetails.setting.venue.length > 1
              }
              renderItem={renderVenues}
              inactiveSlideScale={1}
              inactiveSlideOpacity={1}
              sliderWidth={widthPercentageToDP(100)}
              itemWidth={widthPercentageToDP(100)}
            />
          ) : (
            <Text style={styles.venuePlaceholderTitle}>
              {strings.noVenueFound}
            </Text>
          )}
          <View style={styles.dividor} />
        </View>
      )}

      {/* Leagues section */}
      {groupDetails.entity_type === Verbs.entityTypeTeam && (
        <View>
          <View style={[styles.sectionStyle, {marginHorizontal: 0}]}>
            <TCEditHeader title={strings.leagues} />
            {groupDetails.joined_leagues?.length > 0 ? (
              <FlatList
                data={groupDetails.joined_leagues}
                horizontal
                renderItem={renderLeague}
                keyExtractor={(item) => item.group_id}
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <Text style={styles.venuePlaceholderTitle}>
                {strings.noVenueFound}
              </Text>
            )}
          </View>
          <View style={styles.dividor} />
        </View>
      )}

      {/* Membership fees */}
      <View style={styles.sectionStyle}>
        <TCEditHeader
          title={strings.membershipFeesTitle}
          showEditButton={isAdmin}
          onEditPress={() => {
            navigation.navigate('EditGroupBasicInfoScreen', {
              groupDetails,
            });
          }}
        />
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={[styles.longTextStyle, {fontFamily: fonts.RMedium}]}>
              {strings.membershipfee}
            </Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.longTextStyle}>
              {groupDetails?.membership_fee
                ? `${groupDetails.membership_fee} ${Verbs.cad}/${groupDetails.membership_fee_type}`
                : '--'}
            </Text>
          </View>
        </View>

        <View style={[styles.row, {marginBottom: 0}]}>
          <View style={styles.col}>
            <Text style={[styles.longTextStyle, {fontFamily: fonts.RMedium}]}>
              {strings.membershipregfee}
            </Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.longTextStyle}>
              {groupDetails?.registration_fee
                ? `${groupDetails.registration_fee}/${Verbs.cad}`
                : '--'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.dividor}></View>

      {/* Team section */}
      {groupDetails.joined_teams && groupDetails.joined_teams.length > 0 && (
        <View>
          <View style={styles.sectionStyle}>
            <TCEditHeader
              title={strings.teamstitle}
              showSeeAll
              onSeeAll={() => {
                onGroupListPress(
                  groupDetails.joined_teams,
                  Verbs.entityTypeTeam,
                );
              }}
            />
            <FlatList
              data={groupDetails.joined_teams}
              renderItem={renderTeam}
              keyExtractor={(item) => item.group_id}
              showsVerticalScrollIndicator={false}
            />
          </View>
          <View style={styles.dividor} />
        </View>
      )}

      {/* ByLaw section */}
      <View style={styles.sectionStyle}>
        <TCEditHeader
          title={strings.bylaw}
          showEditButton={isAdmin}
          showSeeAll
          onEditPress={() => {
            navigation.navigate('GroupLongTextScreen', {
              groupDetails,
              isBylaw: true,
            });
          }}
        />
        {groupDetails.bylaw && (
          <ReadMore
            numberOfLines={7}
            style={styles.longTextStyle}
            seeMoreText={strings.moreText}
            seeLessText={strings.lessText}
            seeLessStyle={styles.moreLessText}
            seeMoreStyle={styles.moreLessText}>
            {groupDetails.bylaw}
          </ReadMore>
        )}
      </View>
      <View style={styles.dividor}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionStyle: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: colors.whiteColor,
  },
  longTextStyle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  venueAddress: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    width: Dimensions.get('window').width - 60,
  },
  venueContainer: {
    marginTop: 5,
    marginBottom: 5,
    margin: 15,
    padding: 15,
    backgroundColor: colors.whiteColor,
    width: Dimensions.get('window').width - 30,
    borderRadius: 8,

    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  venueTitle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginBottom: 5,
  },
  venuePlaceholderTitle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.grayColor,
    textAlign: 'center',
    marginBottom: 15,
  },
  dividor: {
    height: 7,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 25,
  },
  moreLessText: {
    fontSize: 12,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  col: {flex: 1, alignItems: 'flex-start'},
});
