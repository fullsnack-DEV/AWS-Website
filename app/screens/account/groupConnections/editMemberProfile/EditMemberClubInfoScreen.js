// import React, {useLayoutEffect, useState, useEffect, useContext} from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   Image,
//   ScrollView,
//   Alert,
//   FlatList,
//   TouchableOpacity,
// } from 'react-native';
// import images from '../../../../Constants/ImagePath';
// import fonts from '../../../../Constants/Fonts';
// import colors from '../../../../Constants/Colors';
// import AuthContext from '../../../../auth/context';
// import {getTeamsOfClub} from '../../../../api/Groups';
// import TCGroupNameBadge from '../../../../components/TCGroupNameBadge';
// import TCThinDivider from '../../../../components/TCThinDivider';
// import strings from '../../../../Constants/String';
// import ActivityLoader from '../../../../components/loader/ActivityLoader';

// let entity = {};
// export default function EditMemberClubInfoScreen({navigation}) {
//   const [auth, setAuth] = useState({});
//   const [loading, setLoading] = useState(false);

//   const authContext = useContext(AuthContext);
//   const [teamList, setTeamList] = useState([]);
//   const [groupAdmin, setGroupAdmin] = useState(false);
//   // const [memberDetail, setMemberDetail] = useState({
//   //   group_id: entity.uid,
//   //   is_admin: false,
//   // });

//   useEffect(() => {
//     getAuthEntity();
//   }, []);
//   const getAuthEntity = async () => {
//     entity = authContext.entity;
//     setAuth(entity);
//     getTeamsList();
//   };
//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => (
//         <Text style={styles.nextButtonStyle} onPress={() => pressedNext()}>
//           Done
//         </Text>
//       ),
//     });
//   }, [navigation, auth, groupAdmin, teamList]);

//   const pressedNext = () => {
//     console.log('Team list :',teamList);
//     navigation.goBack();
//   };
//   const getTeamsList = async () => {
//     setLoading(true);
//     getTeamsOfClub(entity.uid, authContext)
//       .then((response) => {
//         setLoading(false);

//         setTeamList(response.payload);
//       })
//       .catch((e) => {
//         setLoading(false);
//         setTimeout(() => {
//           Alert.alert(strings.alertmessagetitle, e.message);
//         }, 0);
//       });
//   };
//   return (
//     <ScrollView style={styles.mainContainer}>
//       <ActivityLoader visible={loading} />

//       <Text style={styles.checkBoxTitle}>
//         Team Membership {'&'} Admin Authority
//       </Text>
//       <View style={styles.mainCheckBoxContainer}>
//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             marginRight: 15,
//             marginBottom: 15,
//           }}>
//           <View style={styles.profileView}>
//             <Image
//               source={
//                 ((auth || {}).obj || {}).thumbnail
//                   ? {uri: auth.obj.thumbnail}
//                   : images.clubPlaceholder
//               }
//               style={styles.profileImage}
//             />
//           </View>
//           <TCGroupNameBadge
//             name={((auth || {}).obj || {}).group_name || ''}
//             groupType={'club'}
//           />
//         </View>
//         <View style={styles.checkBoxContainer}>
//           <TouchableOpacity
//             onPress={() => {
//               setGroupAdmin(!groupAdmin);
//             }}>
//             <Image
//               source={groupAdmin ? images.uncheckWhite : images.checkGreenBG}
//               style={{height: 22, width: 22, resizeMode: 'contain'}}
//             />
//           </TouchableOpacity>
//           <Text style={styles.checkBoxItemText}>Admin</Text>
//         </View>
//       </View>
//       <TCThinDivider />
//       <FlatList
//         data={teamList}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({item, index}) => (
//           <>
//             <View style={styles.mainCheckBoxContainer}>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   marginRight: 15,
//                   marginBottom: 15,
//                 }}>
//                 <View style={styles.profileView}>
//                   <Image
//                     source={
//                       item.thumbnail
//                         ? {uri: item.thumbnail}
//                         : images.teamPlaceholder
//                     }
//                     style={styles.profileImage}
//                   />
//                 </View>
//                 <TCGroupNameBadge name={item.group_name} groupType={'team'} />
//               </View>
//               <View style={styles.checkBoxContainer}>
//                 <TouchableOpacity
//                   onPress={() => {
//                     const tempList = [...teamList];
//                     tempList[index].is_member = !item.is_member;
//                     setTeamList(tempList);
//                   }}>
//                   <Image
//                     source={
//                       // item.join_membership_acceptedadmin === false
//                       item.is_member
//                         ? images.checkGreenBG
//                         : images.uncheckWhite
//                     }
//                     style={{height: 22, width: 22, resizeMode: 'contain'}}
//                   />
//                 </TouchableOpacity>
//                 <Text style={styles.checkBoxItemText}>Member</Text>
//               </View>
//               <View style={styles.checkBoxContainer}>
//                 <TouchableOpacity
//                   onPress={() => {
//                     const tempList = [...teamList];
//                     tempList[index].is_admin = !item.is_admin;
//                     if(tempList[index].is_admin){
//                       tempList[index].is_member = true;
//                     }

//                     setTeamList(tempList);
//                   }}>
//                   <Image
//                     source={
//                       item.is_admin ? images.checkGreenBG : images.uncheckWhite
//                     }
//                     style={{height: 22, width: 22, resizeMode: 'contain'}}
//                   />
//                 </TouchableOpacity>
//                 <Text style={styles.checkBoxItemText}>Admin</Text>
//               </View>
//             </View>
//             <TCThinDivider />
//           </>
//         )}
//       />

//       <View style={{marginBottom: 20}} />
//     </ScrollView>
//   );
// }
// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     flexDirection: 'column',
//   },

//   profileView: {
//     backgroundColor: colors.whiteColor,
//     height: 26,
//     width: 26,
//     borderRadius: 54,
//     marginRight: 5,

//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: colors.grayColor,
//     shadowOffset: {width: 0, height: 3},
//     shadowOpacity: 0.5,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   profileImage: {
//     alignSelf: 'center',
//     height: 25,
//     resizeMode: 'cover',
//     width: 25,
//     borderRadius: 50,
//   },

//   nextButtonStyle: {
//     fontFamily: fonts.RRegular,
//     fontSize: 16,
//     marginRight: 10,
//   },
//   checkBoxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     height: 25,
//     marginBottom: 10,
//   },
//   mainCheckBoxContainer: {
//     marginLeft: 15,
//     marginTop: 20,
//   },
//   checkBoxTitle: {
//     fontFamily: fonts.RRegular,
//     fontSize: 20,
//     color: colors.lightBlackColor,
//     marginLeft: 20,
//     marginBottom: 10,
//     marginTop: 10,
//   },
//   checkBoxItemText: {
//     fontFamily: fonts.RRegular,
//     fontSize: 16,
//     color: colors.lightBlackColor,
//     marginLeft: 10,
//   },
// });

import React, {useLayoutEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import images from '../../../../Constants/ImagePath';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import AuthContext from '../../../../auth/context';
import {patchMember, deleteMember} from '../../../../api/Groups';
import TCGroupNameBadge from '../../../../components/TCGroupNameBadge';
import strings from '../../../../Constants/String';
import ActivityLoader from '../../../../components/loader/ActivityLoader';

let entity = {};
export default function EditMemberClubInfoScreen({navigation, route}) {
  const {groupMemberDetail} = route?.params;
  console.log('groupMemberDetail1', groupMemberDetail);
  const authContext = useContext(AuthContext);
  entity = authContext.entity;

  const [loading, setLoading] = useState(false);
  const [setting, setSetting] = useState({
    is_member: groupMemberDetail?.is_member === true,
    is_admin: groupMemberDetail.is_admin,
  });

  // const [memberDetail, setMemberDetail] = useState({
  //   group_id: entity.uid,
  //   is_admin: false,
  // });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.titleScreenText}>
          Team Membership {'&'} Admin Authority
        </Text>
      ),
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => pressedNext()}>
          Done
        </Text>
      ),
    });
  }, [navigation, setting]);

  const pressedNext = () => {
    console.log('Team list :', setting);
    doneSetting();
  };

  const doneSetting = () => {
    const bodyParams = {...groupMemberDetail, ...setting};

    if (!bodyParams?.is_member) {
      setLoading(true);
      Alert.alert(
        strings.alertmessagetitle,
        `Do you want to remove ${groupMemberDetail.first_name} ${groupMemberDetail.last_name} from ${entity.obj.group_name}?`,
        [
          {
            text: 'Cancel',
            onPress: () => {
              setLoading(false);
              console.log('Cancel cancel');
            },
            style: 'cancel',
          },
          {
            text: 'Ok',
            onPress: () =>
              patchMember(
                entity?.obj?.group_id,
                groupMemberDetail.user_id,
                bodyParams,
                authContext,
              )
                .then(() => {
                  if (!bodyParams?.is_member) {
                    deleteMember(
                      entity.uid,
                      groupMemberDetail.user_id,
                      authContext
                    ).then(() => {
                      setLoading(false);
                      navigation.goBack();
                    });
                  } else {
                    setLoading(false);
                    navigation.goBack();
                  }
                })
                .catch((e) => {
                  setLoading(false);
                  setTimeout(() => {
                    Alert.alert(strings.alertmessagetitle, e.message);
                  }, 10);
                }),
          },
        ],
        {cancelable: false},
      );
    } else {
      setLoading(true)
      patchMember(
        entity?.obj?.group_id,
        groupMemberDetail.user_id,
        bodyParams,
        authContext,
      )
        .then(() => {
          setLoading(false);
          navigation.goBack();
        })
        .catch((e) => {
          setLoading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <ActivityLoader visible={loading} />

      {/* <FlatList
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
                      // item.join_membership_acceptedadmin === false
                      item.is_member
                        ? images.checkGreenBG
                        : images.uncheckWhite
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
                    if(tempList[index].is_admin){
                      tempList[index].is_member = true;
                    }
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
      /> */}
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
                entity.obj.thumbnail
                  ? {uri: entity.obj.thumbnail}
                  : images.teamPlaceholder
              }
              style={styles.profileImage}
            />
          </View>
          <TCGroupNameBadge name={entity.obj.group_name} groupType={'team'} />
        </View>
        <View style={styles.checkBoxContainer}>
          <Text style={styles.checkBoxItemText}>Member</Text>
          <TouchableOpacity
            onPress={() => {
              const member_setting = !setting.is_member;
              setSetting({
                ...setting,
                is_member: member_setting,
              });
            }}>
            <Image
              source={
                // item.join_membership_acceptedadmin === false
                setting.is_member ? images.orangeCheckBox : images.uncheckWhite
              }
              style={{height: 22, width: 22, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.checkBoxContainer}>
          <Text style={styles.checkBoxItemText}>{`${entity.role.charAt(0).toUpperCase() + entity.role.slice(1)} Admin`}</Text>
          <TouchableOpacity
            onPress={() => {
              const admin_setting = !setting.is_admin;
              setSetting({
                ...setting,
                is_admin: admin_setting,
              });
            }}>
            <Image
              source={
                setting.is_admin ? images.orangeCheckBox : images.uncheckWhite
              }
              style={{height: 22, width: 22, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{marginBottom: 20}} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
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
    justifyContent: 'space-between',
    marginRight: 15,
  },
  mainCheckBoxContainer: {
    marginLeft: 15,
    marginTop: 20,
  },
  titleScreenText: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  checkBoxItemText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    color: colors.lightBlackColor,
    marginLeft: 10,
  },
});
