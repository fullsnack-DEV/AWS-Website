import React, { useRef, useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, FlatList, SafeAreaView, TouchableOpacity, Image,
} from 'react-native';
import moment from 'moment';
import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actionsheet';
import {
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
import EditEventItem from '../Schedule/EditEventItem';
import EventMapView from '../Schedule/EventMapView';
import BasicInfoItem from './BasicInfoItem';
import TeamClubLeagueView from './TeamClubLeagueView';
import UserCategoryView from './User/UserCategoryView';
import Header from './Header';
import EventItemRender from '../Schedule/EventItemRender';
import RadioBtnItem from '../Schedule/RadioBtnItem';
import EventTextInput from '../Schedule/EventTextInput';
import TCPicker from '../TCPicker';
import SearchLocationTextView from './SearchLocationTextView';

const leagues_Data = [
  {
    id: 0,
    teamImage: images.uefaChampionsImage,
    teamTitle: strings.leagueTeamTitle,
    teamIcon: images.myLeagues,
    teamCity: strings.infoTeamCity,
  },
];

const privacy_Data = [
  {
    id: 0,
    title: 'Everyone',
    isSelected: true,
  },
  {
    id: 1,
    title: 'Followers',
    isSelected: false,
  },
  {
    id: 2,
    title: 'Members in groups',
    isSelected: false,
  },
  {
    id: 3,
    title: 'Only me',
    isSelected: false,
  },
];

function PersonalSportsInfo({
  data,
  onItemPress,
  searchLocation,
  locationDetail,
  onSavePress,
  sportName,
}) {
  let latVal = null;
  let longVal = null;
  if (locationDetail) {
    latVal = locationDetail.lat;
    longVal = locationDetail.lng;
  }
  let bioDefault = strings.aboutValue;
  let ntrpDefault = '5.5';
  let homePlaceDefault = strings.homePlaceValue;
  let latiDefault = latVal;
  let longiDefault = longVal;
  let teams_Data = [];
  let clubs_Data = [];
  if (data) {
    if (data && data.registered_sports && data.registered_sports.length > 0) {
      bioDefault = data.registered_sports[0].descriptions;
      ntrpDefault = data.registered_sports[0].ntrp;
      if (searchLocation) {
        homePlaceDefault = searchLocation;
      } else {
        homePlaceDefault = data.registered_sports[0].homePlace;
      }
      if (locationDetail) {
        latiDefault = locationDetail.lat;
        longiDefault = locationDetail.lng;
      } else {
        latiDefault = data.registered_sports[0].latitude;
        longiDefault = data.registered_sports[0].longitude;
      }
    }
    if (data && data.joined_teams && data.joined_teams.length > 0) {
      teams_Data = data.joined_teams;
    }
    if (data && data.joined_clubs && data.joined_clubs.length > 0) {
      clubs_Data = data.joined_clubs;
    }
  }

  const [teamsData] = useState(teams_Data);
  const [clubsData] = useState(clubs_Data);
  const [leaguesData] = useState(leagues_Data);
  const [editPressTitle, setEditPressTitle] = useState(null);
  const [info] = useState({
    genderText: data.gender || 'Male',
    birthdayText: data.birthday ? new Date(data.birthday * 1000) : '',
    heightText: data.height || '',
    weightText: data.weight || '',
    currentCity: `${data.city || ''} ${data.stateAbbr || ''}`,
    homePlaceText: homePlaceDefault,
    latiValue: latiDefault,
    longiValue: longiDefault,
  });
  const [bioText, setBioText] = useState(bioDefault);
  const [ntrpSelect, setNtrpSelect] = useState(ntrpDefault);
  const [mostusetFootSelect, setMostUsedFootSelect] = useState('');
  const [privacyModal, setPrivacyModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [privacyData, setPrivacyData] = useState(privacy_Data);

  const actionSheet = useRef();

  const privacySettingModal = () => {
    setPrivacyModal(!privacyModal);
  };

  const editInfoModal = () => {
    setEditModal(!editModal);
  };

  return (
    <ScrollView style={styles.containerStyle}>
      <EditEventItem
        title={strings.bio}
        onEditPress={() => {
          setEditPressTitle(strings.bio);
          setTimeout(() => {
            actionSheet.current.show();
          }, 200);
        }}
        containerStyle={{ marginTop: 10 }}
      >
        <Text style={styles.bioTextStyle}>{bioText}</Text>
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
        onEditPress={() => {
          setEditPressTitle(strings.basicinfotitle);
          setTimeout(() => {
            actionSheet.current.show();
          }, 200);
        }}
      >
        <BasicInfoItem
          title={strings.gender}
          value={info.genderText}
        />
        <BasicInfoItem
          title={strings.yearOfBirth}
          value={moment(info.birthdayText).format('YYYY')}
        />
        <BasicInfoItem
          title={strings.height}
          value={info.heightText}
        />
        <BasicInfoItem
          title={strings.weight}
          value={info.weightText}
        />
        <BasicInfoItem
          title={strings.mostUsedFoot}
          value={'Both'}
        />
        <BasicInfoItem
          title={strings.currrentCityTitle}
          value={info.currentCity}
          fieldView={{ marginBottom: 10 }}
        />
      </EditEventItem>
      <View style={styles.dividerStyle} />
      <EditEventItem
        title={strings.ntrpTitle}
        subTitle={strings.ntrpSubTitle}
        onEditPress={() => {
          setEditPressTitle(strings.ntrpTitle);
          setTimeout(() => {
            actionSheet.current.show();
          }, 200);
        }}
      >
        <Text style={styles.ntrpValueStyle}>{ntrpSelect}</Text>
      </EditEventItem>
      <View style={styles.dividerStyle} />
      <EditEventItem
        title={strings.homePlaceTitle}
        onEditPress={() => {
          setEditPressTitle(strings.homePlaceTitle);
          setTimeout(() => {
            actionSheet.current.show();
          }, 200);
        }}
      >
        <Text style={styles.bioTextStyle}>{info.homePlaceText}</Text>
        <EventMapView
            region={{
              latitude: info.latiValue !== null ? Number(info.latiValue) : 0.0,
              longitude: info.longiValue !== null ? Number(info.longiValue) : 0.0,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            coordinate={{
              latitude: info.latiValue !== null ? Number(info.latiValue) : 0.0,
              longitude: info.longiValue !== null ? Number(info.longiValue) : 0.0,
            }}
            style={{ marginVertical: 15 }}
        />
      </EditEventItem>
      <View style={styles.dividerStyle} />
      <EditEventItem
        title={strings.teamstitle}
        onEditPress={() => {
          setEditPressTitle(strings.teamstitle);
          setTimeout(() => {
            actionSheet.current.show();
          }, 200);
        }}
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
            teamImage={attachItem.thumbnail ? { uri: attachItem.thumbnail } : images.team_ph}
            teamTitle={attachItem.group_name}
            teamIcon={images.myTeams}
            teamCityName={`${attachItem.city}, ${attachItem.country}`}
            />}
            keyExtractor={(item, index) => index.toString()}
        />
      </EditEventItem>
      <View style={styles.dividerStyle} />
      <EditEventItem
        title={strings.clubstitle}
        onEditPress={() => {
          setEditPressTitle(strings.clubstitle);
          setTimeout(() => {
            actionSheet.current.show();
          }, 200);
        }}
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
            teamImage={attachItem.thumbnail ? { uri: attachItem.thumbnail } : images.club_ph}
            teamTitle={attachItem.group_name}
            teamIcon={images.myClubs}
            teamCityName={`${attachItem.city}, ${attachItem.country}`}
            />}
            keyExtractor={(item, index) => index.toString()}
        />
      </EditEventItem>
      <View style={styles.dividerStyle} />
      <EditEventItem
        title={strings.leaguesTitle}
        onEditPress={() => {
          setEditPressTitle(strings.leaguesTitle);
          setTimeout(() => {
            actionSheet.current.show();
          }, 200);
        }}
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

      <Modal
        isVisible={privacyModal}
        backdropColor="black"
        style={{
          margin: 0, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)',
        }}
        hasBackdrop
        onBackdropPress={() => setPrivacyModal(false)}
        backdropOpacity={0}
      >
        <SafeAreaView style={[styles.modalContainerViewStyle, { backgroundColor: colors.whiteColor }]}>
          <Header
            mainContainerStyle={[styles.headerMainContainerStyle, { backgroundColor: colors.orangeColor }]}
            leftComponent={
              <TouchableOpacity onPress={() => setPrivacyModal(false)}>
                <Image source={images.backArrow} style={styles.cancelImageStyle} resizeMode={'contain'} />
              </TouchableOpacity>
            }
            centerComponent={
              <View style={styles.headerCenterViewStyle}>
                <Image source={images.soccerImage} style={styles.soccerImageStyle} resizeMode={'contain'} />
                <Text style={styles.playInTextStyle}>{'Privacy Setting'}</Text>
              </View>
            }
            rightComponent={
              <TouchableOpacity onPress={() => setPrivacyModal(false)}>
                <Text style={{ fontSize: 16, fontFamily: fonts.RLight, color: colors.whiteColor }}>{'Save'}</Text>
              </TouchableOpacity>
            }
          />
          <EventItemRender
            title={(editPressTitle === strings.bio && strings.bioPrivacyTitle)
            || (editPressTitle === strings.ntrpTitle && strings.ntrpPrivacyTitle)
            || (editPressTitle === strings.homePlaceTitle && strings.homePlacePrivacyTitle)
            || (editPressTitle === strings.teamstitle && strings.teamPrivacyTitle)
            || (editPressTitle === strings.clubstitle && strings.clubPrivacyTitle)
            || (editPressTitle === strings.leaguesTitle && strings.leaguePrivacyTitle)}
            containerStyle={{ marginTop: 10 }}
          >
            <FlatList
              data={privacyData}
              style={{ marginTop: 10 }}
              ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
              renderItem={ ({ item }) => <RadioBtnItem
                titleName={item.title}
                selected={item.isSelected}
                touchRadioBtnStyle={{ marginRight: 5 }}
                onRadioBtnPress={() => {
                  privacyData.map((scheduleItem) => {
                    const schedule = scheduleItem;
                    if (schedule.id === item.id) {
                      schedule.isSelected = true;
                    } else {
                      schedule.isSelected = false;
                    }
                    return null;
                  })
                  setPrivacyData([...privacyData])
                }}
              />
              }
              keyExtractor={ (item, index) => index.toString() }
            />
          </EventItemRender>
        </SafeAreaView>
      </Modal>

      <Modal
        isVisible={editModal}
        backdropColor="black"
        style={{
          margin: 0, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0)',
        }}
        hasBackdrop
        onBackdropPress={() => setEditModal(false)}
        backdropOpacity={0}
      >
        <SafeAreaView style={[styles.modalContainerViewStyle, { backgroundColor: colors.whiteColor }]}>
          <Header
            mainContainerStyle={[styles.headerMainContainerStyle, { backgroundColor: colors.orangeColor }]}
            leftComponent={
              <TouchableOpacity onPress={() => setEditModal(false)}>
                <Image source={images.backArrow} style={styles.cancelImageStyle} resizeMode={'contain'} />
              </TouchableOpacity>
            }
            centerComponent={
              <View style={styles.headerCenterViewStyle}>
                <Image source={images.soccerImage} style={styles.soccerImageStyle} resizeMode={'contain'} />
                <Text style={styles.playInTextStyle}>{'Edit'} {
                  (editPressTitle === strings.bio && strings.bio)
                  || (editPressTitle === strings.basicinfotitle && strings.basicinfotitle)
                  || (editPressTitle === strings.ntrpTitle && strings.ntrpTitle)
                  || (editPressTitle === strings.homePlaceTitle && strings.homePlaceTitle)
                }</Text>
              </View>
            }
            rightComponent={
              <TouchableOpacity onPress={() => {
                const params = {
                  registered_sports: [{
                    cancellation_policy: 'strict',
                    descriptions: bioText,
                    fee: 0.0,
                    ntrp: ntrpSelect,
                    point: 500,
                    sport_name: sportName,
                    latitude: info.latiValue !== null ? Number(info.latiValue) : 0.0,
                    homePlace: info.homePlaceText,
                    longitude: info.longiValue !== null ? Number(info.longiValue) : 0.0,
                  }],
                }
                onSavePress(params);
                setEditModal(false)
              }}>
                <Text style={{ fontSize: 16, fontFamily: fonts.RLight, color: colors.whiteColor }}>{'Save'}</Text>
              </TouchableOpacity>
            }
          />
          {editPressTitle === strings.bio && <EventTextInput
            // placeholder={strings.aboutValue}
            value={bioText}
            multiline={true}
            onChangeText={(text) => {
              setBioText(text);
            }}
          />}

          {editPressTitle === strings.basicinfotitle && <View>
            <EventItemRender
              title={strings.gender}
              containerStyle={{ marginTop: 15 }}
            >
              <Text style={styles.basicinfoValueStyle}>{info.genderText}</Text>
            </EventItemRender>
            <EventItemRender
              title={strings.yearOfBirth}
              containerStyle={{ marginTop: 15 }}
            >
              <Text style={styles.basicinfoValueStyle}>{moment(info.birthdayText).format('YYYY')}</Text>
            </EventItemRender>
            <EventItemRender
              title={strings.height}
              containerStyle={{ marginTop: 15 }}
            >
              <Text style={styles.basicinfoValueStyle}>{info.heightText}</Text>
            </EventItemRender>
            <EventItemRender
              title={strings.weight}
              containerStyle={{ marginTop: 15 }}
            >
              <Text style={styles.basicinfoValueStyle}>{info.weightText}</Text>
            </EventItemRender>
            <EventItemRender
              title={strings.mostUsedFoot}
              containerStyle={{ marginTop: 15 }}
            >
              <View style={{ marginTop: 8 }}>
                <TCPicker
                  dataSource={[
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' },
                    { label: 'Both', value: 'Both' },
                  ]}
                  placeholder={'Never'}
                  value={mostusetFootSelect}
                  onValueChange={(value) => {
                    setMostUsedFootSelect(value);
                  }}
                />
              </View>
            </EventItemRender>
            <EventItemRender
              title={strings.currrentCityTitle}
              containerStyle={{ marginTop: 15 }}
            >
              <Text style={styles.basicinfoValueStyle}>{info.currentCity}</Text>
            </EventItemRender>
          </View>}

          {editPressTitle === strings.ntrpTitle && <View style={{ marginTop: 20 }}>
            <TCPicker
              dataSource={[
                { label: '1.0', value: '1.0' },
                { label: '1.5', value: '1.5' },
                { label: '2.0', value: '2.0' },
                { label: '2.5', value: '2.5' },
                { label: '3.0', value: '3.0' },
                { label: '3.5', value: '3.5' },
                { label: '4.0', value: '4.0' },
                { label: '4.5', value: '4.5' },
                { label: '5.0', value: '5.0' },
                { label: '5.5', value: '5.5' },
                { label: '6.0', value: '6.0' },
                { label: '6.5', value: '6.5' },
                { label: '7.0', value: '7.0' },
              ]}
              placeholder={ntrpSelect}
              value={ntrpSelect}
              onValueChange={(value) => {
                setNtrpSelect(value);
              }}
            />
          </View>}

          {editPressTitle === strings.homePlaceTitle && <SearchLocationTextView
            value={info.homePlaceText}
            onItemPress={() => {
              setEditModal(false);
              onItemPress();
            }}
          />}
        </SafeAreaView>
      </Modal>

      <ActionSheet
        ref={actionSheet}
        options={[
          (editPressTitle === strings.bio && 'Edit Bio')
          || (editPressTitle === strings.basicinfotitle && 'Edit Basic Info')
          || (editPressTitle === strings.ntrpTitle && 'Edit NTRP')
          || (editPressTitle === strings.homePlaceTitle && 'Edit Home Place')
          || (editPressTitle === strings.teamstitle && ' ')
          || (editPressTitle === strings.clubstitle && ' ')
          || (editPressTitle === strings.leaguesTitle && ' '),
          'Privacy Setting',
          'Cancel',
        ]}
        cancelButtonIndex={2}
        onPress={(index) => {
          if (index === 0 && (
            editPressTitle === strings.bio
            || editPressTitle === strings.basicinfotitle
            || editPressTitle === strings.ntrpTitle
            || editPressTitle === strings.homePlaceTitle
          )) {
            editInfoModal();
          } else if (index === 1 && (
            editPressTitle === strings.bio
            || editPressTitle === strings.ntrpTitle
            || editPressTitle === strings.homePlaceTitle
            || editPressTitle === strings.teamstitle
            || editPressTitle === strings.clubstitle
            || editPressTitle === strings.leaguesTitle
          )) {
            privacySettingModal();
          } else if (index === 2) {
            setEditPressTitle(null);
          }
        }}
      />
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
  modalContainerViewStyle: {
    height: hp('94%'),
    backgroundColor: colors.themeColor,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerMainContainerStyle: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 15,
  },
  cancelImageStyle: {
    height: 17,
    width: 17,
    tintColor: colors.whiteColor,
  },
  soccerImageStyle: {
    height: 20,
    width: 20,
    marginHorizontal: 10,
  },
  headerCenterViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  playInTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.whiteColor,
  },
  basicinfoValueStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    paddingLeft: 15,
    marginTop: 5,
  },
});

export default PersonalSportsInfo;
