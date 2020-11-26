import React, { useRef, useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, FlatList, SafeAreaView, TouchableOpacity, Image,
} from 'react-native';
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

function PersonalSportsInfo() {
  const [teamsData] = useState(teams_Data);
  const [clubsData] = useState(clubs_Data);
  const [leaguesData] = useState(leagues_Data);
  const [editPressTitle, setEditPressTitle] = useState(null);
  const [bioText, setBioText] = useState(strings.aboutValue);
  const [homePlaceText, setHomePlaceText] = useState(strings.homePlaceValue);
  const [ntrpSelect, setNtrpSelect] = useState('');
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
        onEditPress={() => {
          setEditPressTitle(strings.basicinfotitle);
          setTimeout(() => {
            actionSheet.current.show();
          }, 200);
        }}
      >
        <BasicInfoItem
          title={strings.gender}
          value={'Male'}
        />
        <BasicInfoItem
          title={strings.yearOfBirth}
          value={'1981'}
        />
        <BasicInfoItem
          title={strings.height}
          value={'187 cm'}
        />
        <BasicInfoItem
          title={strings.weight}
          value={'76 kg'}
        />
        <BasicInfoItem
          title={strings.mostUsedFoot}
          value={'Both'}
        />
        <BasicInfoItem
          title={strings.currrentCityTitle}
          value={'Vancouver BC'}
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
        <Text style={styles.ntrpValueStyle}>{'5.5'}</Text>
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
              <TouchableOpacity onPress={() => setEditModal(false)}>
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
              <Text style={styles.basicinfoValueStyle}>{'Male'}</Text>
            </EventItemRender>
            <EventItemRender
              title={strings.yearOfBirth}
              containerStyle={{ marginTop: 15 }}
            >
              <Text style={styles.basicinfoValueStyle}>{'1981'}</Text>
            </EventItemRender>
            <EventItemRender
              title={strings.height}
              containerStyle={{ marginTop: 15 }}
            >
              <Text style={styles.basicinfoValueStyle}>{'187 cm'}</Text>
            </EventItemRender>
            <EventItemRender
              title={strings.weight}
              containerStyle={{ marginTop: 15 }}
            >
              <Text style={styles.basicinfoValueStyle}>{'76 kg'}</Text>
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
              <Text style={styles.basicinfoValueStyle}>{'Vancouver BC'}</Text>
            </EventItemRender>
          </View>}

          {editPressTitle === strings.ntrpTitle && <View style={{ marginTop: 20 }}>
            <TCPicker
              dataSource={[
                { label: '0', value: '0' },
                { label: '0.5', value: '0.5' },
                { label: '1', value: '1' },
                { label: '1.5', value: '1.5' },
                { label: '2', value: '2' },
                { label: '2.5', value: '2.5' },
                { label: '3', value: '3' },
                { label: '3.5', value: '3.5' },
                { label: '4', value: '4' },
                { label: '4.5', value: '4.5' },
                { label: '5', value: '5' },
                { label: '5.5', value: '5.5' },
                { label: '6', value: '6' },
              ]}
              placeholder={'Never'}
              value={ntrpSelect}
              onValueChange={(value) => {
                setNtrpSelect(value);
              }}
            />
          </View>}

          {editPressTitle === strings.homePlaceTitle && <EventTextInput
            // placeholder={strings.aboutValue}
            value={homePlaceText}
            multiline={true}
            onChangeText={(text) => {
              setHomePlaceText(text);
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
