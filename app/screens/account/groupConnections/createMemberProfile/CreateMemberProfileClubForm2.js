import React, {useLayoutEffect, useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import images from '../../../../Constants/ImagePath';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import AuthContext from '../../../../auth/context';
import {getTeamsOfClub} from '../../../../api/Groups';
import TCGroupNameBadge from '../../../../components/TCGroupNameBadge';
import TCThinDivider from '../../../../components/TCThinDivider';
import strings from '../../../../Constants/String';

let entity = {};
export default function CreateMemberProfileClubForm2({navigation, route}) {
  const [auth, setAuth] = useState({});
  const authContext = useContext(AuthContext);
  const [teamList, setTeamList] = useState([]);
  const [groupAdmin, setGroupAdmin] = useState(false);
  // const [memberDetail, setMemberDetail] = useState({
  //   group_id: entity.uid,
  //   is_admin: false,
  // });

  useEffect(() => {
    getAuthEntity();
  }, []);
  const getAuthEntity = async () => {
    entity = authContext.entity;
    setAuth(entity);
    getTeamsList();
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => pressedNext()}>
          Next
        </Text>
      ),
    });
  }, [navigation, auth, groupAdmin, teamList]);

  const pressedNext = () => {
    const membersAuthority = {
      ...route.params.form1,
      group_member_detail: {group_id: entity.uid, is_admin: groupAdmin},
      teams: teamList.map(({group_id, is_admin, is_member}) => ({
        group_id,
        is_admin,
        is_member,
      })),
    };
    navigation.navigate('CreateMemberProfileClubForm3', {
      form2: membersAuthority,
    });
  };
  const getTeamsList = async () => {
    getTeamsOfClub(entity.uid, authContext)
      .then((response) => {
        // eslint-disable-next-line array-callback-return
        response.payload.map((e) => {
          e.is_admin = false;
          e.is_member = false;
        });
        setTeamList(response.payload);
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };
  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.formSteps}>
        <View style={styles.form1}></View>
        <View style={styles.form2}></View>
        <View style={styles.form3}></View>
      </View>

      <Text style={styles.checkBoxTitle}>
        Team Membership {'&'} Admin Authority
      </Text>
      <View style={styles.mainCheckBoxContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 15,
            marginBottom: 15,
          }}>
          <View style={styles.profileView}>
            <Image
              source={
                ((auth || {}).obj || {}).thumbnail
                  ? {uri: auth.obj.thumbnail}
                  : images.clubPlaceholder
              }
              style={styles.profileImage}
            />
          </View>
          <TCGroupNameBadge
            name={((auth || {}).obj || {}).group_name || ''}
            groupType={'club'}
          />
        </View>
        <View style={styles.checkBoxContainer}>
          <TouchableOpacity
            onPress={() => {
              setGroupAdmin(!groupAdmin);
            }}>
            <Image
              source={groupAdmin ? images.uncheckWhite : images.checkGreenBG}
              style={{height: 22, width: 22, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
          <Text style={styles.checkBoxItemText}>Admin</Text>
        </View>
      </View>
      <TCThinDivider />
      <FlatList
        data={teamList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <>
            <View style={styles.mainCheckBoxContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 15,
                  marginBottom: 15,
                }}>
                <View style={styles.profileView}>
                  <Image
                    source={
                      item.thumbnail
                        ? {uri: item.thumbnail}
                        : images.teamPlaceholder
                    }
                    style={styles.profileImage}
                  />
                </View>
                <TCGroupNameBadge name={item.group_name} groupType={'team'} />
              </View>
              <View style={styles.checkBoxContainer}>
                <TouchableOpacity
                  onPress={() => {
                    const tempList = [...teamList];
                    tempList[index].is_member = !item.is_member;
                    setTeamList(tempList);
                  }}>
                  <Image
                    source={
                      item.is_member ? images.checkGreenBG : images.uncheckWhite
                    }
                    style={{height: 22, width: 22, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
                <Text style={styles.checkBoxItemText}>Member</Text>
              </View>
              <View style={styles.checkBoxContainer}>
                <TouchableOpacity
                  onPress={() => {
                    const tempList = [...teamList];
                    tempList[index].is_admin = !item.is_admin;
                    setTeamList(tempList);
                  }}>
                  <Image
                    source={
                      item.is_admin ? images.checkGreenBG : images.uncheckWhite
                    }
                    style={{height: 22, width: 22, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
                <Text style={styles.checkBoxItemText}>Admin</Text>
              </View>
            </View>
            <TCThinDivider />
          </>
        )}
      />

      <View style={{marginBottom: 20}} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  form1: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form2: {
    backgroundColor: colors.themeColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  form3: {
    backgroundColor: colors.lightgrayColor,
    height: 5,
    marginLeft: 2,
    marginRight: 2,
    width: 10,
  },
  formSteps: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginRight: 15,
    marginTop: 15,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  profileView: {
    backgroundColor: colors.whiteColor,
    height: 26,
    width: 26,
    borderRadius: 54,
    marginRight: 5,

    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    alignSelf: 'center',
    height: 25,
    resizeMode: 'cover',
    width: 25,
    borderRadius: 50,
  },

  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 25,
    marginBottom: 10,
  },
  mainCheckBoxContainer: {
    marginLeft: 15,
    marginTop: 20,
  },
  checkBoxTitle: {
    fontFamily: fonts.RRegular,
    fontSize: 20,
    color: colors.lightBlackColor,
    marginLeft: 20,
    marginBottom: 10,
  },
  checkBoxItemText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 10,
  },
});
