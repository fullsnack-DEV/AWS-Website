import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
} from 'react-native';
import strings from '../../Constants/String';
import TCEditHeader from '../TCEditHeader'

import fonts from '../../Constants/Fonts';
import colors from '../../Constants/Colors';
import TCInfoField from '../TCInfoField';
import * as Utility from '../../utils';
import UserInfoGroupItem from './User/UserInfoGroupItem';
import UserInfoMemberItem from './User/UserInfoMemberItem';

export default function GroupInfo({
  navigation, groupDetails, isAdmin,
}) {
  const members = groupDetails.joined_members && groupDetails.joined_members.length > 0

  const renderTeam = ({ item }) => (
    <UserInfoGroupItem title={item.group_name}
    imageData={item.thumbnail ? { uri: item.thumbnail } : undefined}
    entityType={'team'} />
  );

  const renderMember = ({ item }) => (
    <UserInfoMemberItem title={`${item.first_name} ${item.last_name}`}
    imageData={item.thumbnail ? { uri: item.thumbnail } : undefined} />
  )

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

  if (groupDetails.min_age && groupDetails.max_age) {
    memberage = `${strings.minPlaceholder} ${groupDetails.min_age} ${strings.maxPlaceholder} ${groupDetails.max_age}`
  } else if (groupDetails.max_age) {
    memberage = `${strings.maxPlaceholder} ${groupDetails.max_age}`
  } else if (groupDetails.min_age) {
    memberage = `${strings.minPlaceholder} ${groupDetails.min_age}`
  }

  if (groupDetails.registration_fee) {
    membershipregfee = `${groupDetails.registration_fee} ${strings.CADpermatch}`
  }

  if (groupDetails.membership_fee) {
    membershipfee = `${groupDetails.membership_fee} ${strings.CADpermatch}`
  }

  const signUpString = (signUpDate) => `${Utility.monthNames[new Date(signUpDate * 1000).getMonth()]} ${new Date(signUpDate * 1000).getDate()}, ${new Date(signUpDate * 1000).getFullYear()}`

  return (
    <View>
      {/* About section */}
      <View style={styles.sectionStyle}>
        <TCEditHeader title= {strings.bio} showEditButton={isAdmin}
          onEditPress={() => {
            navigation.navigate('GroupBioScreen', {
              groupDetails,
            });
          }}/>
        <View style={{ marginTop: 21 }}>
          <Text style={{
            fontSize: 16,
            fontFamily: fonts.RLight,
            color: colors.lightBlackColor,
          }}>
            {groupDetails.bio}
          </Text>
        </View>
        <View style={{ marginTop: 4 }}>
          <Text style={{
            fontSize: 12,
            fontFamily: fonts.RLight,
            color: colors.userPostTimeColor,
          }}>{strings.signedupin}{signUpString(groupDetails.createdAt)}</Text>
        </View>
      </View>
      {/* Gray divider */}
      <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>

      {/* Basic section */}
      {groupDetails.entity_type === 'team' && <View>
        <View style={styles.sectionStyle}>
          <TCEditHeader title= {strings.basicinfotitle} showEditButton={isAdmin}
          onEditPress={() => {
            navigation.navigate('GroupBasicInfoScreen', {
              groupDetails,
            });
          }}/>

          <TCInfoField title={strings.sport} value={groupDetails.sport } marginLeft={10} marginTop={20}/>
          <TCInfoField title={strings.hometown} value={groupDetails.city} marginLeft={10}/>
          <TCInfoField title={strings.membersgender} value={groupDetails.gender ? groupDetails.gender : strings.NA} marginLeft={10}/>
          <TCInfoField title={strings.membersage} value={memberage} marginLeft={10}/>
          <TCInfoField title={strings.language} value={groupDetails.language ? groupDetails.language : strings.NA} marginLeft={10}/>
          <TCInfoField title={strings.membershipregfee} value={membershipregfee} marginLeft={10}/>
          <TCInfoField title={strings.membershipfee} value={membershipfee} marginLeft={10}/>
        </View>
        {/* Gray divider */}
        <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>
      </View>}

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
      </View>
      {/* Gray divider */}
      <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>

      {/* Club section */}
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
          <TCEditHeader containerStyle={{ marginHorizontal: 15 }} title= {strings.teamstitle} showNextArrow={true}/>
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
})
