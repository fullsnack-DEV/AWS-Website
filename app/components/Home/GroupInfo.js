import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {strings} from '../../../Localization/translation';
import TCEditHeader from '../TCEditHeader';
import {widthPercentageToDP} from '../../utils';

import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import TCInfoField from '../TCInfoField';
import * as Utility from '../../utils';
import UserInfoGroupItem from './User/UserInfoGroupItem';
import TCClubClipView from '../TCClubClipView';
import NewsFeedDescription from '../newsFeed/NewsFeedDescription';
import images from '../../Constants/ImagePath';
import AuthContext from '../../auth/context';
import EventMapView from '../Schedule/EventMapView';
import TCThickDivider from '../TCThickDivider';
import Verbs from '../../Constants/Verbs';

export default function GroupInfo({
  navigation,
  membersList,
  groupDetails,
  isAdmin,
  onGroupPress,
  onGroupListPress,
}) {
  const authContext = useContext(AuthContext);

  console.log('groupDetails?????', authContext);
  const members =
    groupDetails?.joined_members && groupDetails?.joined_members?.length > 0;

  const renderTeam = ({item}) => (
    <UserInfoGroupItem
      title={item.group_name}
      imageData={item.thumbnail ? {uri: item.thumbnail} : undefined}
      entityType={'team'}
      onGroupPress={() => {
        console.log('renderTeam press');
        if (onGroupPress) {
          onGroupPress(item);
        }
      }}
    />
  );

  const renderMember = ({item}) => (
    <View
      style={{
        height: 37,
        width: 37,
        resizeMode: 'contain',
        borderRadius: 74,
        shadowColor: colors.googleColor,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 13,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.whiteColor,
        margin: 5,
      }}>
      <Image
        source={
          item?.thumbnail ? {uri: item?.thumbnail} : images.profilePlaceHolder
        }
        style={{height: 35, width: 35, resizeMode: 'contain', borderRadius: 70}}
      />
    </View>
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

  let office = groupDetails?.office_address;
  let homefield = groupDetails?.homefield_address;

  let memberage = strings.NA;
  let membershipregfee = strings.NA;
  let membershipfee = strings.NA;

  if (!groupDetails?.office_address) {
    office = isAdmin ? strings.addoffice : strings.NA;
  }
  if (!groupDetails?.homefield_address) {
    homefield = isAdmin ? strings.addhomefield : strings.NA;
  }

  const coordinates = [];
  const markers = [];

  if (
    groupDetails?.homefield_address_latitude &&
    groupDetails?.homefield_address_longitude
  ) {
    coordinates.push({
      latitude: Number(groupDetails?.homefield_address_latitude),
      longitude: Number(groupDetails?.homefield_address_longitude),
    });
    markers.push({
      id: '1',
      latitude: groupDetails?.homefield_address_latitude,
      longitude: groupDetails?.homefield_address_longitude,
      name: strings.homeaddress,
      adddress: homefield,
      pinColor: 'red',
    });
  }

  if (
    groupDetails?.office_address_latitude &&
    groupDetails?.office_address_longitude
  ) {
    coordinates.push({
      latitude: Number(groupDetails?.office_address_latitude),
      longitude: Number(groupDetails?.office_address_longitude),
    });
    markers.push({
      id: '2',
      latitude: Number(groupDetails?.office_address_latitude),
      longitude: Number(groupDetails?.office_address_longitude),
      name: strings.officeaddress,
      adddress: office,
      pinColor: 'green',
    });
  }

  if (groupDetails?.min_age && groupDetails?.max_age) {
    memberage = `${strings.minPlaceholder} ${groupDetails?.min_age} ${strings.maxPlaceholder} ${groupDetails?.max_age}`;
  } else if (groupDetails?.max_age) {
    memberage = `${strings.maxPlaceholder} ${groupDetails?.max_age}`;
  } else if (groupDetails?.min_age) {
    memberage = `${strings.minPlaceholder} ${groupDetails?.min_age}`;
  }

  if (groupDetails?.registration_fee) {
    membershipregfee = `${groupDetails?.registration_fee} ${Verbs.CAD}`;
  }

  if (groupDetails?.membership_fee) {
    membershipfee = `${groupDetails?.membership_fee} ${Verbs.CAD}`;
    if (groupDetails?.membership_fee_type === 'weekly') {
      membershipfee = `${membershipfee}/${strings.week}`;
    } else if (groupDetails?.membership_fee_type === 'biweekly') {
      membershipfee = `${membershipfee}/${strings.biweek}`;
    } else if (groupDetails?.membership_fee_type === 'monthly') {
      membershipfee = `${membershipfee}/${strings.month}`;
    } else if (groupDetails?.membership_fee_type === 'yealy') {
      membershipfee = `${membershipfee}/${strings.year}`;
    }
  }

  const onTeamListPress = () => {
    if (onGroupListPress) {
      onGroupListPress(groupDetails?.joined_teams, 'team');
    }
  };

  const signUpString = (signUpDate) =>
    `${Utility.monthNames[new Date(signUpDate * 1000).getMonth()]} ${new Date(
      signUpDate * 1000,
    ).getDate()}, ${new Date(signUpDate * 1000).getFullYear()}`;

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
    <View style={{flex: 1}}>
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
        <View style={{marginTop: 15}}>
          {groupDetails?.bio && (
            <NewsFeedDescription
              descriptions={groupDetails?.bio}
              character={200}
              descriptionTxt={styles.longTextStyle}
              descText={styles.moreTextStyle}
            />
          )}
        </View>
        <View style={{marginTop: 5}}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: fonts.RLight,
              color: colors.userPostTimeColor,
              marginLeft: 10,
            }}>
            {strings.signedupin}
            {signUpString(groupDetails?.createdAt)}
          </Text>
        </View>
        {groupDetails?.club && (
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
              name={groupDetails?.club.group_name}
              image={groupDetails?.club.thumbnail}
            />
          </View>
        )}
      </View>
      {/* Gray divider */}
      <View
        style={{height: 7, backgroundColor: colors.grayBackgroundColor}}></View>

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

        <TCInfoField
          title={strings.sport}
          value={
            groupDetails?.sports_string
              ? groupDetails?.sports_string
              : Utility.getSportName(groupDetails, authContext)
          }
          marginLeft={10}
          marginTop={20}
        />
        <TCInfoField
          title={strings.membersgender}
          value={
            groupDetails?.gender
              ? Utility.capitalize(groupDetails?.gender)
              : groupDetails?.gender
          }
          marginLeft={10}
        />
        <TCInfoField
          title={strings.membersage}
          value={memberage}
          marginLeft={10}
        />
        <TCInfoField
          title={strings.language}
          value={groupDetails?.languages?.toString() ?? strings.NAText}
          marginLeft={10}
        />
        <TCInfoField
          title={strings.officeAddress}
          value={groupDetails?.office_address}
          marginLeft={10}
        />
      </View>
      {/* Gray divider */}
      <View
        style={{height: 7, backgroundColor: colors.grayBackgroundColor}}></View>

      {/* Members list section */}
      {groupDetails?.entity_type === 'team' && (
        <View>
          <View style={styles.sectionStyle}>
            <TCEditHeader
              showNextArrow={true}
              title={strings.membersTitle}
              showEditButton={isAdmin}
              // subTitle={groupDetails?.setting?.game_fee?.fee ? `$${groupDetails?.setting?.game_fee?.fee} ${groupDetails?.setting?.game_fee?.currency_type} / match` : strings.NAText}
              subTitleTextStyle={{
                marginLeft: 28,
                fontFamily: fonts.RRegular,
                fontSize: 16,
                color: colors.lightBlackColor,
              }}
              onEditPress={() => {
                navigation.navigate('GroupMembersScreen', {
                  groupObj: groupDetails,
                  groupID: groupDetails?.group_id,
                  fromProfile: true,
                });
              }}
            />
            <FlatList
              style={{marginTop: 15, backgroundColor: colors.whiteColor}}
              data={membersList}
              horizontal
              renderItem={renderMember}
              keyExtractor={(item) => item.group_id}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View
            style={{
              height: 7,
              backgroundColor: colors.grayBackgroundColor,
            }}></View>
        </View>
      )}

      {/* match fee section */}
      {groupDetails?.entity_type === 'team' && (
        <View>
          <View style={styles.sectionStyle}>
            <TCEditHeader
              // iconImage={images.myClubs}
              title={strings.matchAmountTitle}
              showEditButton={isAdmin}
              subTitle={
                groupDetails?.setting?.game_fee?.fee
                  ? `$${groupDetails?.setting?.game_fee?.fee} ${groupDetails?.setting?.game_fee?.currency_type} / match`
                  : strings.NAText
              }
              subTitleTextStyle={{
                marginLeft: 28,
                fontFamily: fonts.RRegular,
                fontSize: 16,
                color: colors.lightBlackColor,
              }}
              onEditPress={() => {
                navigation.navigate('GameFee', {
                  settingObj: groupDetails?.setting,
                  comeFrom: 'EntityInfoScreen',
                  sportName: groupDetails?.sport,
                });
              }}
            />
          </View>
          <View
            style={{
              height: 7,
              backgroundColor: colors.grayBackgroundColor,
            }}></View>
        </View>
      )}

      {groupDetails?.entity_type === 'team' && (
        <View>
          <View style={styles.sectionStyle}>
            <TCEditHeader
              title={
                groupDetails?.setting?.venue &&
                groupDetails.setting.venue.length > 1
                  ? strings.availableVenuesForMatch
                  : strings.availableVenues
              }
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

          {groupDetails?.setting?.venue &&
          groupDetails.setting.venue.length > 0 ? (
            <Carousel
              data={groupDetails?.setting?.venue ?? []} // recentMatch
              scrollEnabled={
                groupDetails?.setting?.venue &&
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
          <TCThickDivider marginTop={10} />
        </View>
      )}

      {/* TC Point section */}
      {groupDetails?.entity_type === 'team' && (
        <View>
          <View style={styles.sectionStyle}>
            <TCEditHeader
              // iconImage={images.myClubs}
              title={strings.tcpoint}
              showEditButton={false}
              subTitle={`${groupDetails?.point} P`}
              subTitleTextStyle={{
                marginLeft: 28,
                fontFamily: fonts.RRegular,
                fontSize: 16,
                color: colors.lightBlackColor,
              }}
              onEditPress={() => {}}
            />
          </View>
          <View
            style={{
              height: 7,
              backgroundColor: colors.grayBackgroundColor,
            }}></View>
        </View>
      )}

      {/* Members section */}
      {members && (
        <View>
          <View style={[styles.sectionStyle, {marginHorizontal: 0}]}>
            <TCEditHeader
              containerStyle={{marginHorizontal: 15}}
              title={strings.membersTitle}
              showNextArrow={true}
            />
            <FlatList
              style={{marginTop: 15, backgroundColor: colors.whiteColor}}
              data={groupDetails?.joined_members}
              horizontal
              renderItem={renderMember}
              keyExtractor={(item) => item.group_id}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View
            style={{
              height: 7,
              backgroundColor: colors.grayBackgroundColor,
            }}></View>
        </View>
      )}

      {/* Leagues section */}
      <View>
        <View style={[styles.sectionStyle, {marginHorizontal: 0}]}>
          <TCEditHeader
            containerStyle={{marginHorizontal: 15}}
            title={strings.leagues}
            showNextArrow={true}
          />
          <FlatList
            style={{marginTop: 15, backgroundColor: colors.whiteColor}}
            data={groupDetails?.joined_leagues}
            horizontal
            renderItem={renderLeague}
            keyExtractor={(item) => item.group_id}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View
          style={{
            height: 7,
            backgroundColor: colors.grayBackgroundColor,
          }}></View>
      </View>

      {/* Team section */}
      {groupDetails?.joined_teams && groupDetails?.joined_teams.length > 0 && (
        <View>
          <View style={[styles.sectionStyle, {marginHorizontal: 0}]}>
            <TCEditHeader
              containerStyle={{marginHorizontal: 15}}
              title={strings.teamstitle}
              showNextArrow={true}
              onNextArrowPress={onTeamListPress}
            />
            <FlatList
              style={{marginTop: 15, backgroundColor: colors.whiteColor}}
              data={groupDetails?.joined_teams}
              horizontal
              renderItem={renderTeam}
              keyExtractor={(item) => item.group_id}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          {/* Gray divider */}
          <View
            style={{
              height: 7,
              backgroundColor: colors.grayBackgroundColor,
            }}></View>
        </View>
      )}

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

        <TCInfoField
          title={strings.membershipregfee}
          value={membershipregfee}
          marginLeft={10}
        />
        <TCInfoField
          title={strings.membershipfee}
          value={membershipfee}
          marginLeft={10}
        />
      </View>
      {/* Gray divider */}
      <View
        style={{height: 7, backgroundColor: colors.grayBackgroundColor}}></View>

      {/* ByLaw section */}
      <View style={styles.sectionStyle}>
        <TCEditHeader
          showNextArrow={true}
          title={strings.bylaw}
          showEditButton={isAdmin}
          onEditPress={() => {
            navigation.navigate('GroupLongTextScreen', {
              groupDetails,
              isBylaw: true,
            });
          }}
        />
        <View style={{marginTop: 20}}>
          {groupDetails?.bylaw && (
            <NewsFeedDescription
              descriptions={groupDetails?.bylaw}
              character={200}
              descriptionTxt={styles.longTextStyle}
              descText={styles.moreTextStyle}
            />
          )}
        </View>
      </View>
      {/* Gray divider */}
      <View
        style={{height: 7, backgroundColor: colors.grayBackgroundColor}}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionStyle: {
    flex: 1,
    marginTop: 25,
    marginBottom: 14,
    marginHorizontal: 15,
    backgroundColor: colors.whiteColor,
  },

  longTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,

    textAlign: 'justify',
  },
  moreTextStyle: {
    fontFamily: fonts.RLight,
    fontSize: 12,
    color: colors.userPostTimeColor,
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
    marginBottom: 5,
  },
});
