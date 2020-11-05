import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
} from 'react-native';
import strings from '../../../Constants/String';
import TCEditHeader from '../../TCEditHeader'

import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import TCInfoField from '../../TCInfoField';
import * as Utility from '../../../utils';
import UserInfoGroupItem from './UserInfoGroupItem';
import UserInfoPlaysInItem from './UserInfoPlaysInItem';
import UserInfoRefereesInItem from './UserInfoRefereesInItem';

export default function UserInfo({
  navigation, userDetails,
}) {
  const renderTeam = ({ item }) => (
    <UserInfoGroupItem title={item.group_name}
    imagedata={item.thumbnail ? { uri: item.thumbnail } : undefined}
    entityType={'team'} />
  );

  const renderClub = ({ item }) => (
    <UserInfoGroupItem title={item.group_name}
    imageData={item.thumbnail ? { uri: item.thumbnail } : undefined}/>
  );

  const renderPlayIn = ({ item }) => (
    <UserInfoPlaysInItem title={item.sport_name}
    totalGames={item.totalGames}
    thumbURL={item.thumbnail ? { uri: item.thumbnail } : undefined}/>
  );

  const renderRefereesIn = ({ item }) => (
    <UserInfoRefereesInItem title={item.sport_name}
    thumbURL={images.gameGoal}/>
  );

  const birthdayInString = (birthDate) => `${Utility.monthNames[new Date(birthDate * 1000).getMonth()]} ${new Date(birthDate * 1000).getDate()}, ${new Date(birthDate * 1000).getFullYear()}`

  return (
    <View>
      {/* About section 123 */}
      <View style={styles.sectionStyle}>
        <TCEditHeader title= {strings.abouttitle} showEditButton={true}
          onEditPress={() => {
            navigation.navigate('UserAboutScreen', {
              userDetails,
            });
          }}/>
        <View style={{ marginTop: 21 }}>
          <Text style={{
            fontSize: 16,
            fontFamily: fonts.RLight,
            color: colors.lightBlackColor,
          }}>
            {userDetails.about}
          </Text>
        </View>
        <View style={{ marginTop: 4 }}>
          <Text style={{
            fontSize: 12,
            fontFamily: fonts.RLight,
            color: colors.userPostTimeColor,
          }}>{strings.signedupin}{userDetails.sign_in}</Text>
        </View>
      </View>
      {/* Gray divider */}
      <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>
      {/* Basic section */}
      <View style={styles.sectionStyle}>
        <TCEditHeader title= {strings.basicinfotitle} showEditButton={true}
          onEditPress={() => {
            navigation.navigate('UserBasicInfoScreen', {
              userDetails,
            });
          }}/>
        <TCInfoField title={'Email'} value={userDetails.email ? userDetails.email : 'n/a'} marginLeft={10} marginTop={20}/>
        <TCInfoField title={'Phone'} value={userDetails.phone ? userDetails.phone : 'n/a'} marginLeft={10} marginTop={2}/>
        <TCInfoField title={'Address'} value={userDetails.address ? userDetails.address : 'n/a'} marginLeft={10} marginTop={2}/>
        <TCInfoField title={'Birth'} value={userDetails.birthday ? birthdayInString(userDetails.birthday) : 'n/a'} marginLeft={10} marginTop={2}/>
        <TCInfoField title={'Gender'} value={userDetails.gender ? userDetails.gender : 'n/a'} marginLeft={10} marginTop={2}/>
        <TCInfoField title={'Height'} value={userDetails.height ? userDetails.height : 'n/a'} marginLeft={10} marginTop={2}/>
        <TCInfoField title={'Weight'} value={userDetails.weight ? userDetails.weight : 'n/a'} marginLeft={10} marginTop={2}/>
      </View>
      {/* Gray divider */}
      <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>
      {/* Play in section */}
      {userDetails.games.length && <View>
        <View style={[styles.sectionStyle, { marginHorizontal: 0 }]}>
          <TCEditHeader containerStyle={{ marginHorizontal: 15 }} title= {strings.playin} showNextArrow={true}/>
          <FlatList
            style={{ marginTop: 15 }}
            data={userDetails.games}
            horizontal
            renderItem={renderPlayIn}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        {/* Gray divider */}
        <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>
      </View>}
      {userDetails.referee_data.length && <View>
        <View style={[styles.sectionStyle, { marginHorizontal: 0 }]}>
          <TCEditHeader containerStyle={{ marginHorizontal: 10 }} title= {strings.refereesin} showNextArrow={true}/>
          <FlatList
            style={{ marginTop: 15 }}
            data={userDetails.referee_data}
            horizontal
            renderItem={renderRefereesIn}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        {/* Gray divider */}
        <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>
      </View>}

      {/* Team section */}
      <View style={[styles.sectionStyle, { marginHorizontal: 0 }]}>
        <TCEditHeader containerStyle={{ marginHorizontal: 15 }} title= {strings.teamstitle} showNextArrow={true}/>
        <FlatList
          style={{ marginTop: 15, backgroundColor: colors.whiteColor }}
            data={userDetails.joined_teams}
            horizontal
            renderItem={renderTeam}
            keyExtractor={(item) => item.group_id}
            showsHorizontalScrollIndicator={false}
        />
      </View>
      {/* Gray divider */}
      <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>
      {/* Club section */}
      <View style={[styles.sectionStyle, { marginHorizontal: 0 }]}>
        <TCEditHeader containerStyle={{ marginHorizontal: 15 }} title= {strings.clubstitle} showNextArrow={true}/>
        <FlatList
          style={{ marginTop: 15, backgroundColor: colors.whiteColor }}
            data={userDetails.joined_clubs}
            horizontal
            renderItem={renderClub}
            keyExtractor={(item) => item.group_id}
            showsHorizontalScrollIndicator={false}
        />
      </View>
      {/* Gray divider */}
      <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>
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
})
