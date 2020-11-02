import React, {
  useLayoutEffect, useEffect, useState,
} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
  Alert,
  FlatList,
} from 'react-native';

import { getGroupMembersInfo } from '../../../api/Groups';
import * as Utility from '../../../utils/index';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import images from '../../../Constants/ImagePath'
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts'
import TCProfileView from '../../../components/TCProfileView';
import TCThickDivider from '../../../components/TCThickDivider';
import TCBorderButton from '../../../components/TCBorderButton';
import TCInfoField from '../../../components/TCInfoField';
import strings from '../../../Constants/String';
import TCMessageButton from '../../../components/TCMessageButton';
import TCThinDivider from '../../../components/TCThinDivider';
import GroupMembership from '../../../components/groupConnections/GroupMembership';

let entity = {};
export default function MembersProfileScreen({ navigation, route }) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
    'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const [loading, setloading] = useState(true);
  // const [editable, setEditable] = useState(true);
  const [editProfile, setEditProfile] = useState(false);
  const [editBasicInfo, setEditBasicInfo] = useState(false);
  const [editTeam, setEditTeam] = useState(false);
  const [memberDetail, setMemberDetail] = useState({});

  useEffect(() => {
    getMemberInformation()
  }, [])
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback
          onPress={ () => console.log('3 Dot pressed') }>
          <Image source={ images.vertical3Dot } style={ styles.navigationRightItem } />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);
  const getAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }
    return age;
  }
  const getMemberInformation = async () => {
    entity = await Utility.getStorage('loggedInEntity');
    // Seeting of Edit option
    if (entity.role === 'club') {
      setEditProfile(true)
      setEditBasicInfo(true)
      setEditTeam(true)
    } else if (route.params.whoSeeID === entity.uid) {
      setEditProfile(true)
      setEditBasicInfo(true)
    }

    getGroupMembersInfo(route.params.groupID, route.params.memberID).then((response) => {
      if (response.status) {
        console.log('PROFILE RESPONSE::', response.payload);
        setMemberDetail(response.payload);
        setloading(false)
      }
    })
      .catch((e) => {
        setloading(false)
        Alert.alert('', e.messages)
      });
  }
  return (
    <SafeAreaView>
      <ActivityLoader visible={loading} />
      <ScrollView>
        <View style={styles.roleViewContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <TCProfileView image={memberDetail.thumbnail ? { uri: memberDetail.thumbnail } : images.profilePlaceHolder} name={`${memberDetail.first_name} ${memberDetail.last_name}`} location={`${memberDetail.city}, ${memberDetail.state_abbr}, ${memberDetail.country}`}/>
            {editProfile && <TouchableWithoutFeedback>
              <Image source={ images.editSection } style={ styles.editImage } />
            </TouchableWithoutFeedback>}
          </View>
          <Text style={styles.undatedTimeText} numberOfLines={2}>Joined club on May 9, 2019
            {'\n'}Last updated by Neymar JR on May 9, 2019</Text>
          {!memberDetail.connected && <TCBorderButton title={strings.connectAccountText} marginTop={20} onPress={() => {
            navigation.navigate('UserNotFoundScreen', { memberObj: memberDetail, groupID: route.params.groupID })
          }}/>}

        </View>
        <TCThickDivider marginTop={20}/>
        <View>

          <View style={styles.sectionEditView}>
            <Text style={styles.basicInfoTitle}>Basic Info</Text>
            {editBasicInfo && <TouchableWithoutFeedback>
              <Image source={ images.editSection } style={ styles.editImage } />
            </TouchableWithoutFeedback>}
          </View>
          <TCInfoField title={'E-mail'} value={memberDetail.email ? memberDetail.email : 'N/A'}/>
          <TCInfoField title={'Phone'} value={memberDetail.phone_numbers ? `${memberDetail.phone_numbers[0].country_code} ${memberDetail.phone_numbers[0].phone_number}` : 'N/A'}/>
          <TCInfoField title={'Address'} value={memberDetail.street_address ? `${memberDetail.street_address}, ${memberDetail.city}, ${memberDetail.state_abbr}, ${memberDetail.country}` : `${memberDetail.city}, ${memberDetail.state_abbr}, ${memberDetail.country}`}/>
          <TCInfoField title={'Age'} value={getAge(new Date(memberDetail.birthday))}/>
          <TCInfoField title={'Birthday'} value={`${monthNames[new Date(memberDetail.birthday).getMonth()]} ${new Date(memberDetail.birthday).getDate()} ,${new Date(memberDetail.birthday).getFullYear()}`}/>
          <TCInfoField title={'Gender'} value={memberDetail.gender ? memberDetail.gender : 'N/A'}/>
        </View>
        <TCThickDivider marginTop={20}/>
        {memberDetail.family && <>
          <View>
            <View style={styles.sectionEditView}>
              <Text style={styles.basicInfoTitle}>Family</Text>
              <TouchableWithoutFeedback>
                <Image source={ images.editSection } style={ styles.editImage } />
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.familyView}>
              <TCProfileView type={'medium'} />
              <TCMessageButton title={'Email'} color={colors.googleColor}/>

            </View>
            <TCThinDivider/>
            <View style={styles.familyView}>
              <TCProfileView type={'medium'} />
              <TCMessageButton />
            </View>
          </View>
          <TCThickDivider marginTop={20}/>
        </>}
        <View>
          <View style={styles.sectionEditView}>
            <Text style={styles.basicInfoTitle}>Membership</Text>
          </View>
          {memberDetail.group && <GroupMembership groupData = {memberDetail.group} switchID={entity.uid} edit={editTeam}/>}
          <FlatList
                  data={memberDetail.teams}
                  renderItem={({ item }) => <GroupMembership groupData = {item} switchID={entity.uid} edit={editTeam}/>}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={false}
                  />

        </View>
        <TCThickDivider marginTop={20}/>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  navigationRightItem: {
    height: 15,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 15,
  },
  roleViewContainer: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
    justifyContent: 'space-between',
  },
  undatedTimeText: {
    marginTop: 10,
    fontSize: 12,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    flexShrink: 1,
  },
  basicInfoTitle: {

    fontSize: 20,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  familyView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
  },
  editImage: {
    alignSelf: 'center',
    height: 18,
    resizeMode: 'contain',
    width: 18,
  },
  sectionEditView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 15,
  },
});
