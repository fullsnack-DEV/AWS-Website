import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import strings from '../../Constants/String';
import TCEditHeader from '../TCEditHeader'

import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import TCInfoField from '../TCInfoField';
import * as Utility from '../../utils';
import UserInfoGroupItem from './User/UserInfoGroupItem';
import UserInfoMemberItem from './User/UserInfoMemberItem';
import TCClubClipView from '../TCClubClipView'
import NewsFeedDescription from '../newsFeed/NewsFeedDescription'
import images from '../../Constants/ImagePath';
import TCGradientButton from '../TCGradientButton';

export default function GroupInfo({
  navigation, groupDetails, isAdmin, onGroupPress, onMemberPress, onGroupListPress,
}) {
  const members = groupDetails.joined_members && groupDetails.joined_members.length > 0

  const renderTeam = ({ item }) => (

    <UserInfoGroupItem title={item.group_name}
    imageData={item.thumbnail ? { uri: item.thumbnail } : undefined}
    entityType={'team'}
    onGroupPress={() => {
      console.log('renderTeam press')
      if (onGroupPress) {
        onGroupPress(item)
      }
    }} />

  );

  const renderMember = ({ item }) => (
    <UserInfoMemberItem title={`${item.first_name} ${item.last_name}`}
    imageData={item.thumbnail ? { uri: item.thumbnail } : undefined}
    onMemberPress={() => {
      console.log('renderMember press')
      if (onMemberPress) {
        onMemberPress(item)
      }
    }} />
  )

  const renderLeague = ({ item }) => (
    <UserInfoGroupItem title={item.group_name}
    imageData={item.thumbnail ? images.leagueDemo : undefined}
    entityType={'league'}
    onGroupPress={() => {
      console.log('renderLeague press')
      onGroupPress(item)
    }} />
  );

  const renderHistory = ({ item }) => (
    <View style={{ marginLeft: 10, marginVertical: 10 }}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontFamily: fonts.RBold, fontSize: 16, color: colors.lightBlackColor }}>{item.name}</Text>
        {item.winner && <TCGradientButton title={'WINNER'.toUpperCase()}
        rightIcon={images.whiteTrophySmall}
        rightIconStyle={styles.winnerIconStyle}
        outerContainerStyle={styles.winnerbtnContainerStyle}
        style = {styles.winnerButtonStyle}
        textStyle = {styles.winnerTextStyle} />}
      </View>
      <Text style={{ fontFamily: fonts.RRegular, fontSize: 12, color: colors.veryLightBlack }}>{item.year}</Text>
    </View>
  );

  let website = groupDetails.webSite
  let email = groupDetails.email
  let phone = groupDetails.phone
  let office = groupDetails.office_address
  let homefield = groupDetails.homefield_address

  let memberage = strings.NA
  let membershipregfee = strings.NA
  let membershipfee = strings.NA

  if (!groupDetails.webSite) {
    website = isAdmin ? strings.addwebsite : strings.NA
  }
  if (!groupDetails.email) {
    email = isAdmin ? strings.addemail : strings.NA
  }
  if (!groupDetails.phone) {
    phone = isAdmin ? strings.addphone : strings.NA
  }
  if (!groupDetails.office_address) {
    office = isAdmin ? strings.addoffice : strings.NA
  }
  if (!groupDetails.homefield_address) {
    homefield = isAdmin ? strings.addhomefield : strings.NA
  }

  const coordinates = []
  const markers = []

  if (groupDetails.homefield_address_latitude && groupDetails.homefield_address_longitude) {
    coordinates.push({
      latitude: Number(groupDetails.homefield_address_latitude),
      longitude: Number(groupDetails.homefield_address_longitude),
    })
    markers.push({
      id: '1',
      latitude: groupDetails.homefield_address_latitude,
      longitude: groupDetails.homefield_address_longitude,
      name: strings.homeaddress,
      adddress: homefield,
      pinColor: 'red',
    })
  }

  if (groupDetails.office_address_latitude && groupDetails.office_address_longitude) {
    coordinates.push({
      latitude: Number(groupDetails.office_address_latitude),
      longitude: Number(groupDetails.office_address_longitude),
    })
    markers.push({
      id: '2',
      latitude: Number(groupDetails.office_address_latitude),
      longitude: Number(groupDetails.office_address_longitude),
      name: strings.officeaddress,
      adddress: office,
      pinColor: 'green',
    })
  }

  if (groupDetails.min_age && groupDetails.max_age) {
    memberage = `${strings.minPlaceholder} ${groupDetails.min_age} ${strings.maxPlaceholder} ${groupDetails.max_age}`
  } else if (groupDetails.max_age) {
    memberage = `${strings.maxPlaceholder} ${groupDetails.max_age}`
  } else if (groupDetails.min_age) {
    memberage = `${strings.minPlaceholder} ${groupDetails.min_age}`
  }

  if (groupDetails.registration_fee) {
    membershipregfee = `${groupDetails.registration_fee} ${strings.CAD}`
  }

  if (groupDetails.membership_fee) {
    membershipfee = `${groupDetails.membership_fee} ${strings.CAD}`
    if (groupDetails.membership_fee_type === 'weekly') {
      membershipfee = `${membershipfee}/${strings.week}`
    } else if (groupDetails.membership_fee_type === 'biweekly') {
      membershipfee = `${membershipfee}/${strings.biweek}`
    } else if (groupDetails.membership_fee_type === 'monthly') {
      membershipfee = `${membershipfee}/${strings.month}`
    } else if (groupDetails.membership_fee_type === 'yealy') {
      membershipfee = `${membershipfee}/${strings.year}`
    }
  }

  const onTeamListPress = () => {
    if (onGroupListPress) {
      onGroupListPress(groupDetails.joined_teams, 'team')
    }
  }

  const signUpString = (signUpDate) => `${Utility.monthNames[new Date(signUpDate * 1000).getMonth()]} ${new Date(signUpDate * 1000).getDate()}, ${new Date(signUpDate * 1000).getFullYear()}`

  // const region = Utility.getRegionFromMarkers(coordinates)
  return (
    <View>
      {/* Bio section */}
      <View style={styles.sectionStyle}>
        <TCEditHeader title= {strings.bio} showEditButton={isAdmin}
          onEditPress={() => {
            navigation.navigate('GroupLongTextScreen', {
              groupDetails,
            });
          }}/>
        <View style={{ marginTop: 20 }}>
          {groupDetails.bio && <NewsFeedDescription descriptions={groupDetails.bio}
          character={200} descriptionTxt={styles.longTextStyle}
          descText={styles.moreTextStyle} />}
        </View>
        <View style={{ marginTop: 5 }}>
          <Text style={{
            fontSize: 12,
            fontFamily: fonts.RLight,
            color: colors.userPostTimeColor,
          }}>{strings.signedupin}{signUpString(groupDetails.createdAt)}</Text>
        </View>
        {groupDetails.club && <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              height: 30,
              marginTop: 10,
              maxWidth: '80%',
            }}>
          <TCClubClipView name={groupDetails.club.group_name} image={groupDetails.club.thumbnail} />
        </View>}

      </View>
      {/* Gray divider */}
      <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>

      {/* Basic Info section */}
      <View style={styles.sectionStyle}>
        <TCEditHeader title= {strings.basicinfotitle} showEditButton={isAdmin}
          onEditPress={() => {
            navigation.navigate('EditGroupBasicInfoScreen', {
              groupDetails,
            });
          }}/>

        <TCInfoField title={strings.sport} value={groupDetails.sport ? Utility.capitalize(groupDetails.sport) : groupDetails.sport} marginLeft={10} marginTop={20}/>
        <TCInfoField title={strings.membersgender} value={groupDetails.gender ? Utility.capitalize(groupDetails.gender) : groupDetails.gender} marginLeft={10}/>
        <TCInfoField title={strings.membersage} value={memberage} marginLeft={10}/>
        <TCInfoField title={strings.language} value={groupDetails.languages} marginLeft={10}/>
        <TCInfoField title={strings.membershipregfee} value={membershipregfee} marginLeft={10}/>
        <TCInfoField title={strings.membershipfee} value={membershipfee} marginLeft={10}/>
      </View>
      {/* Gray divider */}
      <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>

      {/* Contact section */}
      <View style={styles.sectionStyle}>
        <TCEditHeader title= {strings.contact} showEditButton={isAdmin}
          onEditPress={() => {
            navigation.navigate('EditGroupContactScreen', {
              groupDetails,
            });
          }}/>
        <TCInfoField titleStyle={styles.infoFieldTitle} title={strings.website} value={website} marginLeft={10} marginTop={20}/>
        <TCInfoField titleStyle={styles.infoFieldTitle} title={strings.emailtitle} value={email} marginLeft={10}/>
        <TCInfoField titleStyle={styles.infoFieldTitle} title={strings.phone} value={phone} marginLeft={10}/>
        <TCInfoField titleStyle={styles.infoFieldTitle} title={strings.office} value={office} marginLeft={10}/>
        <TCInfoField titleStyle={styles.infoFieldTitle} title={strings.homefield} value={homefield} marginLeft={10}/>
        {coordinates.length > 0 && <MapView
          style={styles.mapViewStyle}>
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              identifier={marker.id}
              coordinate={{
                latitude: marker.latitude.toString(),
                longitude: marker.longitude.toString(),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              description={marker.adddress}
              title={marker.name}
              pinColor={marker.pinColor}
            />
          ))}
        </MapView>
         }
      </View>
      {/* Gray divider */}
      <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>

      {/* TC Point section */}
      {groupDetails.entity_type === 'team' && <View>
        <View style={styles.sectionStyle}>
          <TCEditHeader iconImage={images.myClubs} title= {strings.tcpoint} showEditButton={isAdmin}
          subTitle={'550P'}
          subTitleTextStyle ={{ marginLeft: 28, fontFamily: fonts.RRegular, fontSize: 16 }}
          onEditPress={() => {}}/>
          <View style={{ marginTop: 20 }}>
            {groupDetails.bylaw && <NewsFeedDescription descriptions={groupDetails.bylaw}
          character={200} descriptionTxt={styles.longTextStyle}
          descText={styles.moreTextStyle} />}
          </View>
        </View>
        <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>
      </View>}

      {/* TC Ranking section */}
      {groupDetails.entity_type === 'team' && <View>
        <View style={styles.sectionStyle}>
          <TCEditHeader title= {strings.tcranking} showEditButton={isAdmin}
          onEditPress={() => {}}/>
          <TCInfoField titleStyle={styles.infoFieldTitle} title={'Vancouver'} value={'7 th'} marginLeft={10} marginTop={20}/>
          <TCInfoField titleStyle={styles.infoFieldTitle} title={'BC'} value={'24 th'} marginLeft={10}/>
          <TCInfoField titleStyle={styles.infoFieldTitle} title={'Canada'} value={'100 th'} marginLeft={10}/>
          <TCInfoField titleStyle={styles.infoFieldTitle} title={'World'} value={'-'} marginLeft={10}/>
        </View>
        <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>
      </View>}

      {/* Game Fee section */}
      {groupDetails.entity_type === 'team' && <View>
        <View style={styles.sectionStyle}>
          <TCEditHeader title= {strings.gamefeetitle} subTitle={strings.perhoursinbracket}
          showEditButton={isAdmin}
          onEditPress={() => {
            navigation.navigate('GameFeeEditScreen', {
              groupDetails,
            });
          }}/>
          <TCInfoField
          title={strings.gamefeeperhour}
          value={groupDetails.game_fee ? `$${groupDetails.game_fee} ${groupDetails.currency_type}` : undefined }
          titleStyle = {{ flex: 0.40 }}
          marginLeft={10} marginTop={20}/>
        </View>
        {/* Gray divider */}
        <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>
      </View>}

      {/* ByLaw section */}
      <View style={styles.sectionStyle}>
        <TCEditHeader title= {strings.bylaw} showEditButton={isAdmin}
          onEditPress={() => {
            navigation.navigate('GroupLongTextScreen', {
              groupDetails,
              isBylaw: true,
            });
          }}/>
        <View style={{ marginTop: 20 }}>
          {groupDetails.bylaw && <NewsFeedDescription descriptions={groupDetails.bylaw}
          character={200} descriptionTxt={styles.longTextStyle}
          descText={styles.moreTextStyle} />}
        </View>
      </View>
      {/* Gray divider */}
      <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>

      {/* Members section */}
      {members && <View>
        <View style={[styles.sectionStyle, { marginHorizontal: 0 }]}>
          <TCEditHeader containerStyle={{ marginHorizontal: 15 }} title= {strings.membersTitle} showNextArrow={true}/>
          <FlatList
            style={{ marginTop: 15, backgroundColor: colors.whiteColor }}
              data={groupDetails.joined_members}
              horizontal
              renderItem={renderMember}
              keyExtractor={(item) => item.group_id}
              showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>
      </View>}

      {/* Team section */}
      {(groupDetails.joined_teams && groupDetails.joined_teams.length > 0) && <View>
        <View style={[styles.sectionStyle, { marginHorizontal: 0 }]}>
          <TCEditHeader containerStyle={{ marginHorizontal: 15 }}
          title= {strings.teamstitle} showNextArrow={true}
          onNextArrowPress={onTeamListPress}/>
          <FlatList
            style={{ marginTop: 15, backgroundColor: colors.whiteColor }}
              data={groupDetails.joined_teams}
              horizontal
              renderItem={renderTeam}
              keyExtractor={(item) => item.group_id}
              showsHorizontalScrollIndicator={false}
          />
        </View>
        {/* Gray divider */}
        <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>
      </View>}

      {/* Leagues section */}
      <View>
        <View style={[styles.sectionStyle, { marginHorizontal: 0 }]}>
          <TCEditHeader containerStyle={{ marginHorizontal: 15 }} title= {strings.leagues} showNextArrow={true}/>
          <FlatList
            style={{ marginTop: 15, backgroundColor: colors.whiteColor }}
              data={groupDetails.joined_leagues}
              horizontal
              renderItem={renderLeague}
              keyExtractor={(item) => item.group_id}
              showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>
      </View>

      {/* History section */}
      <View>
        <View style={styles.sectionStyle}>
          <TCEditHeader title= {strings.history} showEditButton={isAdmin}
          onEditPress={() => {}}/>
          <FlatList
            style={{ marginTop: 15, backgroundColor: colors.whiteColor }}
              data={groupDetails.history}
              renderItem={renderHistory}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>
      </View>

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
  infoFieldTitle: {
    fontSize: 16,
  },
  longTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    padding: 0,
    textAlign: 'justify',
  },
  moreTextStyle: {
    fontFamily: fonts.RLight,
    fontSize: 12,
    color: colors.userPostTimeColor,
  },
  winnerIconStyle: {
    width: 9,
    height: 9,
    marginRight: 6,
  },
  winnerbtnContainerStyle: {
    margin: 0,
    marginLeft: 10,
    shadowColor: colors.grayColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    alignSelf: 'center',
  },
  winnerButtonStyle: {
    margin: 0,
    height: 18,
    borderRadius: 5,
  },
  winnerTextStyle: {
    paddingLeft: 6,
    paddingRight: 3,
    alignSelf: 'center',
    color: colors.whiteColor,
    fontSize: 12,
    fontFamily: fonts.RMedium,
  },
  mapViewStyle: {
    height: 150,
    borderRadius: 5,
  },
})
