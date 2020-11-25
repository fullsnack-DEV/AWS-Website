import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, FlatList,
} from 'react-native';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import EditEventItem from '../Schedule/EditEventItem';
import EventMapView from '../Schedule/EventMapView';
import BasicInfoItem from './BasicInfoItem';
import TeamClubLeagueView from './TeamClubLeagueView';
import UserCategoryView from './User/UserCategoryView';

const teams_Data = [
  {
    id: 0,
    teamImage: images.commentReport,
    teamTitle: strings.infoTeamTitle,
    teamIcon: images.myTeams,
    teamCity: strings.infoTeamCity,
  },
];

const clubs_Data = [
  {
    id: 0,
    teamImage: images.usaImage,
    teamTitle: strings.clubTeamTitle1,
    teamIcon: images.myClubs,
    teamCity: strings.clubTeamCity1,
  },
  {
    id: 1,
    teamImage: images.chelseaFCImage,
    teamTitle: strings.clubTeamTitle2,
    teamIcon: images.myClubs,
    teamCity: strings.infoTeamCity,
  },
  {
    id: 2,
    teamImage: images.FCBarcelonaImage,
    teamTitle: strings.clubTeamTitle3,
    teamIcon: images.myClubs,
    teamCity: strings.clubTeamCity1,
  },
];

const leagues_Data = [
  {
    id: 0,
    teamImage: images.uefaChampionsImage,
    teamTitle: strings.leagueTeamTitle,
    teamIcon: images.myLeagues,
    teamCity: strings.infoTeamCity,
  },
];

function PersonalSportsInfo() {
  const [teamsData] = useState(teams_Data);
  const [clubsData] = useState(clubs_Data);
  const [leaguesData] = useState(leagues_Data);
  return (
    <ScrollView style={styles.containerStyle}>
      <EditEventItem
        title={strings.bio}
        containerStyle={{ marginTop: 10 }}
      >
        <Text style={styles.bioTextStyle}>{strings.aboutValue}</Text>
        <Text style={styles.signUpTimeStyle}>{strings.signedUpTime}</Text>
        <View style={styles.userCategoryView}>
          <UserCategoryView title='Player' titleColor={colors.blueColor}/>
          <UserCategoryView title='Coach' titleColor={colors.greeColor}/>
          <UserCategoryView title='Tainer' titleColor={colors.yellowColor}/>
          <UserCategoryView title='scorekeeper' titleColor={colors.playerBadgeColor}/>
        </View>
      </EditEventItem>
      <View style={styles.dividerStyle} />
      <EditEventItem
        title={strings.basicinfotitle}
      >
        <BasicInfoItem
            title={strings.emailtitle}
            value={'dongwonkang@gmail.com'}
        />
        <BasicInfoItem
            title={strings.phone}
            value={'778-777-1981'}
        />
        <BasicInfoItem
            title={strings.addressPlaceholder}
            value={'1200 Alberni street, Vancouver '}
        />
        <BasicInfoItem
            title={strings.birth}
            value={'JAN 18, 1981'}
        />
        <BasicInfoItem
            title={strings.gender}
            value={'Male'}
        />
        <BasicInfoItem
            title={strings.height}
            value={'187 cm'}
        />
        <BasicInfoItem
            title={strings.weight}
            value={'76 kg'}
            fieldView={{ marginBottom: 10 }}
        />
      </EditEventItem>
      <View style={styles.dividerStyle} />
      <EditEventItem
        title={strings.ntrpTitle}
        subTitle={strings.ntrpSubTitle}
      >
        <Text style={styles.ntrpValueStyle}>{'5.5'}</Text>
      </EditEventItem>
      <View style={styles.dividerStyle} />
      <EditEventItem
        title={strings.homePlaceTitle}
      >
        <Text style={styles.bioTextStyle}>{strings.homePlaceValue}</Text>
        <EventMapView
            region={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            coordinate={{
              latitude: 37.78825,
              longitude: -122.4324,
            }}
            style={{ marginVertical: 15 }}
        />
      </EditEventItem>
      <View style={styles.dividerStyle} />
      <EditEventItem
        title={strings.teamstitle}
      >
        <FlatList
            data={teamsData}
            bounces={false}
            style={{ paddingHorizontal: 2 }}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{
              height: 1, backgroundColor: colors.grayBackgroundColor, marginVertical: 10,
            }} />}
            renderItem={({ item: attachItem }) => <TeamClubLeagueView
            teamImage={attachItem.teamImage}
            teamTitle={attachItem.teamTitle}
            teamIcon={attachItem.teamIcon}
            teamCityName={attachItem.teamCity}
            />}
            keyExtractor={(item, index) => index.toString()}
        />
      </EditEventItem>
      <View style={styles.dividerStyle} />
      <EditEventItem
        title={strings.clubstitle}
      >
        <FlatList
            data={clubsData}
            bounces={false}
            style={{ paddingHorizontal: 2 }}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{
              height: 1, backgroundColor: colors.grayBackgroundColor, marginVertical: 10,
            }} />}
            renderItem={({ item: attachItem }) => <TeamClubLeagueView
            teamImage={attachItem.teamImage}
            teamTitle={attachItem.teamTitle}
            teamIcon={attachItem.teamIcon}
            teamCityName={attachItem.teamCity}
            />}
            keyExtractor={(item, index) => index.toString()}
        />
      </EditEventItem>
      <View style={styles.dividerStyle} />
      <EditEventItem
        title={strings.leaguesTitle}
      >
        <FlatList
            data={leaguesData}
            bounces={false}
            style={{ paddingHorizontal: 2 }}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{
              height: 1, backgroundColor: colors.grayBackgroundColor, marginVertical: 10,
            }} />}
            renderItem={({ item: attachItem }) => <TeamClubLeagueView
            teamImage={attachItem.teamImage}
            teamTitle={attachItem.teamTitle}
            teamIcon={attachItem.teamIcon}
            teamCityName={attachItem.teamCity}
            />}
            keyExtractor={(item, index) => index.toString()}
        />
      </EditEventItem>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: colors.whiteColor,
  },
  bioTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  signUpTimeStyle: {
    fontSize: 12,
    fontFamily: fonts.RLight,
    color: colors.lightBlackColor,
    marginVertical: 4,
  },
  userCategoryView: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 10,
  },
  dividerStyle: {
    height: 7,
    backgroundColor: colors.grayBackgroundColor,
    marginVertical: 10,
  },
  ntrpValueStyle: {
    fontSize: 16,
    fontFamily: fonts.LRegular,
    color: colors.lightBlackColor,
    marginBottom: 10,
  },
});

export default PersonalSportsInfo;
