// import React, { useState, useLayoutEffect } from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   FlatList,
//   SafeAreaView,
//   TouchableWithoutFeedback,
//   Image,
//   TouchableOpacity,
//   Dimensions,
// } from 'react-native';

// import Modal from 'react-native-modal';
// import strings from '../../../../Constants/String';
// import fonts from '../../../../Constants/Fonts';
// import colors from '../../../../Constants/Colors';
// import TCLabel from '../../../../components/TCLabel';
// import TCThinDivider from '../../../../components/TCThinDivider';
// import images from '../../../../Constants/ImagePath';
// import TCTextInputClear from '../../../../components/TCTextInputClear';
// import TCKeyboardView from '../../../../components/TCKeyboardView';

// export default function ScorekeepersSetting({ navigation, route }) {
//   const { comeFrom } = route?.params;

//   const [selection, setSelection] = useState();
//   const [visibleModal, setVisibleModal] = useState(false);
//   const [detail, setDetail] = useState('');

//   const [scorekeeper, setScorekeeper] = useState([]);

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => (
//         <Text
//           style={styles.saveButtonStyle}
//           onPress={() => {
//             navigation.navigate(comeFrom)
//           }}>
//           Save
//         </Text>
//       ),
//     });
//   }, [comeFrom, navigation]);

//   const renderNumbersOf = ({ item }) => (
//     <TouchableWithoutFeedback
//       style={styles.listItem}
//       onPress={() => {
//         setSelection(item);
//         const arr = [];

//         for (let i = 0; i < item; i++) {
//           const obj = {
//             id: i,
//             isChallengee: true,
//             isChallenger: false,
//           };
//           arr.push(obj);
//         }
//         setScorekeeper(arr);
//         setTimeout(() => {
//           setVisibleModal(false);
//         }, 300);
//       }}>
//       <View
//         style={{
//           padding: 20,
//           alignItems: 'center',
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//         }}>
//         <Text style={styles.languageList}>{item}</Text>
//         <View style={styles.checkbox}>
//           {selection === item ? (
//             <Image
//               source={images.radioCheckYellow}
//               style={styles.checkboxImg}
//             />
//           ) : (
//             <Image source={images.radioUnselect} style={styles.checkboxImg} />
//           )}
//         </View>
//       </View>
//     </TouchableWithoutFeedback>
//   );

//   const renderScorekeeper = ({ index, item }) => (
//     <View>
//       <View style={styles.viewTitleContainer}>
//         <Text style={styles.venueCountTitle}>
//           Scorekeeper {index + 1} {index === 0 && '(Chief)'}
//         </Text>
//       </View>
//       <Text
//         style={{
//           fontSize: 16,
//           marginLeft: 15,
//           marginRight: 15,
//           marginBottom: 10,
//           fontFamily: fonts.RRegular,
//           color: colors.lightBlackColor,
//         }}>
//         {strings.scorekeeperSettingNote}
//       </Text>
//       <TouchableOpacity
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           margin: 15,
//           marginBottom: 5,
//         }} onPress={() => {
//             const ref = [...scorekeeper];
//             scorekeeper[index].isChallenger = !scorekeeper[index].isChallenger;
//             scorekeeper[index].isChallengee = !scorekeeper[index].isChallengee;
//             setScorekeeper(ref);
//         }}>
//         <View style={styles.teamContainer}>
//           <View style={styles.teamViewStyle}>
//             <View style={styles.imageShadowView}>
//               <Image
//                 source={
//                   // teams[0].thumbnail
//                   //   ? { uri: teams[0].thumbnail }
//                   //   : images.teamPlaceholder
//                   images.teamPlaceholder
//                 }
//                 style={styles.imageView}
//               />
//             </View>
//             <View style={styles.teamTextContainer}>
//               <Text style={styles.teamNameLable}>Kishan Team</Text>
//               <Text style={styles.locationLable}>Surat ,GJ</Text>
//             </View>
//           </View>
//         </View>
//         <View style={styles.checkbox}>
//           {item?.isChallenger === true ? (
//             <Image
//               source={images.radioCheckYellow}
//               style={styles.checkboxImg}
//             />
//           ) : (
//             <Image source={images.radioUnselect} style={styles.checkboxImg} />
//           )}
//         </View>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           margin: 15,
//           marginBottom: 5,

//         }} onPress={() => {
//             const ref = [...scorekeeper];
//             scorekeeper[index].isChallenger = !scorekeeper[index].isChallenger;
//             scorekeeper[index].isChallengee = !scorekeeper[index].isChallengee;
//             setScorekeeper(ref);
//         }}>
//         <View style={styles.teamContainer}>
//           <View style={styles.teamViewStyle}>
//             <View style={styles.imageShadowView}>
//               <Image
//                 source={
//                   // teams[0].thumbnail
//                   //   ? { uri: teams[0].thumbnail }
//                   //   : images.teamPlaceholder
//                   images.teamPlaceholder
//                 }
//                 style={styles.imageView}
//               />
//             </View>
//             <View style={styles.teamTextContainer}>
//               <Text style={styles.teamNameLable}>Challenger</Text>

//             </View>
//           </View>
//         </View>
//         <View style={styles.checkbox}>
//           {item?.isChallengee === true ? (
//             <Image
//               source={images.radioCheckYellow}
//               style={styles.checkboxImg}
//             />
//           ) : (
//             <Image source={images.radioUnselect} style={styles.checkboxImg} />
//           )}
//         </View>
//       </TouchableOpacity>

//       {/* <TCTextInputClear
//         placeholder={strings.venueDetailsPlaceholder}
//           onChangeText={(text) => {
//             const ven = [...venue];
//             venue[index].details = text;
//             setVenue(ven);
//           }}
//           value={venue[index].details}
//           onPressClear={() => {
//             const ven = [...venue];
//             venue[index].details = '';
//             setVenue(ven);
//           }}
//           multiline={true}
//         /> */}
//     </View>
//   );

//   return (
//     <TCKeyboardView style={{ flex: 1 }}>
//       <SafeAreaView>
//         <TCLabel
//           title={strings.scorekeeperSettingTitle}
//           style={{ marginRight: 15 }}
//         />
//         <TouchableOpacity
//           style={styles.viewContainer}
//           onPress={() => setVisibleModal(true)}>
//           <Text style={styles.itemView}> {selection || '-'}</Text>
//           <View style={{ flexDirection: 'row' }}>
//             <Text style={styles.itemView}>{'Scorekeeper(s)'}</Text>
//             <Image
//               source={images.dropDownArrow}
//               style={styles.downArrowImage}
//             />
//           </View>
//         </TouchableOpacity>

//         {/* <View
//           style={{
//             flexDirection: 'row',
//             margin: 15,
//             marginTop: 35,
//           }}>
//           <Text
//             style={{
//               fontSize: 16,
//               fontFamily: fonts.RRegular,
//               color: colors.lightBlackColor,
//             }}>
//             {strings.AvailibilitySubTitle}
//           </Text>
//         </View> */}
//         <FlatList
//           data={scorekeeper}
//           renderItem={renderScorekeeper}
//           keyExtractor={(item, index) => index.toString()}

//           style={{ marginBottom: 15 }}
//         />
//         {selection && <TCTextInputClear
//             placeholder={strings.venueDetailsPlaceholder}
//             onChangeText={(text) => setDetail(text)}
//             value={detail}
//             onPressClear={() => {
//               setDetail('');
//             }}
//             multiline={true}/>}

//         <Modal
//         isVisible={visibleModal}
//         backdropColor="black"
//         onBackdropPress={() => setVisibleModal(false)}
//         onRequestClose={() => setVisibleModal(false)}
//         backdropOpacity={0}
//         style={styles.modalStyle}>
//           <View style={styles.modalViewContainer}>
//             <View style={styles.modalHeaderContainer}>
//               <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setVisibleModal(false)}>
//                 <Image source={images.cancelImage} style={styles.closeButton} />
//               </TouchableOpacity>
//               <Text style={styles.itemText}>{strings.scorekeeperTitle}</Text>
//               <Text></Text>
//             </View>
//             <View style={styles.separatorLine} />
//             <FlatList
//             ItemSeparatorComponent={() => <TCThinDivider />}
//             data={[1, 2, 3, 4, 5]}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={renderNumbersOf}
//           />
//           </View>
//         </Modal>
//       </SafeAreaView>
//     </TCKeyboardView>

//   );
// }
// const styles = StyleSheet.create({
//   saveButtonStyle: {
//     fontFamily: fonts.RMedium,
//     fontSize: 16,
//     marginRight: 10,
//   },
//   itemView: {
//     alignSelf: 'center',
//     color: colors.blackColor,
//   },
//   viewContainer: {
//     alignSelf: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: colors.offwhite,
//     borderRadius: 5,
//     color: colors.lightBlackColor,
//     elevation: 3,
//     flexDirection: 'row',

//     height: 40,
//     width: '92%',
//     marginTop: 12,
//     paddingHorizontal: 15,

//     shadowColor: colors.googleColor,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.5,
//     shadowRadius: 1,
//   },

//   closeButton: {
//     alignSelf: 'center',
//     width: 13,
//     height: 13,
//     resizeMode: 'contain',
//   },

//   separatorLine: {
//     alignSelf: 'center',
//     backgroundColor: colors.grayColor,
//     height: 0.5,
//     marginTop: 14,
//     width: '92%',
//   },

//   languageList: {
//     color: colors.lightBlackColor,
//     fontFamily: fonts.RRegular,
//     fontSize: 16,
//   },

//   checkboxImg: {
//     width: 22,
//     height: 22,
//     resizeMode: 'contain',
//     alignSelf: 'center',
//   },
//   downArrowImage: {
//     width: 12,
//     height: 12,
//     resizeMode: 'contain',
//     tintColor: colors.lightBlackColor,
//     alignSelf: 'center',
//     marginLeft: 10,
//   },
//   modalViewContainer: {
//     width: '100%',
//     height: Dimensions.get('window').height / 2,
//     backgroundColor: 'white',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.5,
//     shadowRadius: 5,
//     elevation: 15,
//   },
//   modalHeaderContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 15,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   itemText: {
//     alignSelf: 'center',
//     marginVertical: 20,
//     fontSize: 16,
//     fontFamily: fonts.RBold,
//     color: colors.lightBlackColor,
//   },
//   modalStyle: {
//     margin: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },

//   venueCountTitle: {
//     fontSize: 16,
//     fontFamily: fonts.RMedium,
//     color: colors.lightBlackColor,
//     marginLeft: 15,
//     marginTop: 15,
//     marginBottom: 10,
//   },

//   viewTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },

//   teamContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 15,
//     marginRight: 15,
//   },

//   teamViewStyle: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   imageShadowView: {
//     shadowColor: colors.googleColor,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.4,
//     shadowRadius: 1,
//   },
//   imageView: {
//     height: 40,
//     width: 40,
//     resizeMode: 'cover',
//     borderRadius: 20,
//   },

//   teamNameLable: {
//     fontFamily: fonts.RMedium,
//     fontSize: 16,
//     color: colors.lightBlackColor,
//   },
//   locationLable: {
//     fontFamily: fonts.RLight,
//     fontSize: 14,
//     color: colors.lightBlackColor,
//   },
//   teamTextContainer: {
//     marginLeft: 20,
//   },
// });

/* eslint-disable no-nested-ternary */
import React, { useState, useLayoutEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import AuthContext from '../../../../auth/context';
import ActivityLoader from '../../../../components/loader/ActivityLoader';

import { patchChallengeSetting } from '../../../../api/Challenge';
import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCLabel from '../../../../components/TCLabel';
import TCThinDivider from '../../../../components/TCThinDivider';
import images from '../../../../Constants/ImagePath';
import TCTextInputClear from '../../../../components/TCTextInputClear';
import TCKeyboardView from '../../../../components/TCKeyboardView';

export default function ScorekeepersSetting({ navigation, route }) {
  console.log('route?.params?.settingObj?.responsible_for_scorekeeper', route?.params?.settingObj?.responsible_for_scorekeeper);
  const { comeFrom, sportName } = route?.params;
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);

  const [selection, setSelection] = useState(
    route?.params?.settingObj?.responsible_for_scorekeeper
      && route?.params?.settingObj?.responsible_for_scorekeeper?.who_secure === 'None' ? 'None' : route?.params?.settingObj?.responsible_for_scorekeeper?.who_secure?.length,
  );

  const [detail, setDetail] = useState(
    route?.params?.settingObj?.responsible_for_scorekeeper?.details
      ? route?.params?.settingObj?.responsible_for_scorekeeper?.details
      : '',
  );

  const [scorekeeper, setScorekeeper] = useState(
    route?.params?.settingObj?.responsible_for_scorekeeper && route?.params?.settingObj?.responsible_for_scorekeeper?.who_secure !== 'None'
      ? route?.params?.settingObj?.responsible_for_scorekeeper?.who_secure
      : [],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.saveButtonStyle}
          onPress={() => {
            onSavePressed();
          }}>
          Save
        </Text>
      ),
    });
  }, [comeFrom, navigation, scorekeeper, detail, selection]);

  const renderNumbersOf = ({ item }) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        if (item !== 'None') {
          setSelection(item);
          const arr = [];

          for (let i = 0; i < item; i++) {
            const obj = {
              id: i,
              responsible_to_secure_scorekeeper: 'challengee',
              is_chief: i === 0,
            };
            arr.push(obj);
          }
          setScorekeeper(arr);
          setTimeout(() => {
            setVisibleModal(false);
          }, 300);
        } else {
          setSelection(item);
          const arr = [];

          for (let i = 0; i < item; i++) {
            const obj = {
              id: i,
              responsible_to_secure_scorekeeper: 'None',
              is_chief: i === 0,
            };
            arr.push(obj);
          }
          setScorekeeper(arr);
          setTimeout(() => {
            setVisibleModal(false);
          }, 300);
        }
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>{item}</Text>
        <View>
          {selection === item ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const renderScorekeeper = ({ index, item }) => (
    <View>
      {item !== 'None' ? <View>
        <View style={styles.viewTitleContainer}>
          <Text style={styles.venueCountTitle}>
            Scorekeeper {index + 1} {index === 0 && '(Chief)'}
          </Text>
        </View>
        <Text
        style={{
          fontSize: 16,
          marginLeft: 15,
          marginRight: 15,
          marginBottom: 10,
          fontFamily: fonts.RRegular,
          color: colors.lightBlackColor,
        }}>
          {strings.scorekeeperSettingNote}
        </Text>
        <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 15,
          marginBottom: 5,
        }}
        onPress={() => {
            const ref = [...scorekeeper];
            scorekeeper[index].responsible_to_secure_scorekeeper = 'challengee';
            scorekeeper[index].is_chief = index === 0;
            setScorekeeper(ref);
        }}>
          <View style={styles.teamContainer}>
            <View style={styles.teamViewStyle}>
              <View style={styles.imageShadowView}>
                <Image
                source={
                  authContext?.entity?.role === 'user'
                  || authContext?.entity?.role === 'player'
                    ? authContext?.entity?.obj?.thumbnail
                      ? { uri: authContext?.entity?.obj?.thumbnail }
                      : images.profilePlaceHolder
                    : authContext?.entity?.obj?.thumbnail
                    ? { uri: authContext?.entity?.obj?.thumbnail }
                    : images.teamPlaceholder
                }
                style={styles.imageView}
              />
              </View>
              <View style={styles.teamTextContainer}>
                <Text style={styles.teamNameLable}>
                  {authContext?.entity?.role === 'user'
                || authContext?.entity?.role === 'player'
                  ? authContext?.entity?.obj?.full_name
                  : authContext?.entity?.obj?.group_name}
                </Text>
                <Text style={styles.locationLable}>
                  {authContext?.entity?.obj?.city},{' '}
                  {authContext?.entity?.obj?.state_abbr}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.checkbox}>
            {item?.responsible_to_secure_scorekeeper === 'challengee' ? (
              <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 15,
          marginBottom: 5,
        }}
        onPress={() => {
          const ref = [...scorekeeper];
          scorekeeper[index].responsible_to_secure_scorekeeper = 'challenger';
          scorekeeper[index].is_chief = index === 0;
          setScorekeeper(ref);
        }}>
          <View style={styles.teamContainer}>
            <View style={styles.teamViewStyle}>
              <View style={styles.imageShadowView}>
                <Image
                source={
                  // teams[0].thumbnail
                  //   ? { uri: teams[0].thumbnail }
                  //   : images.teamPlaceholder
                  images.teamPlaceholder
                }
                style={styles.imageView}
              />
              </View>
              <View style={styles.teamTextContainer}>
                <Text style={styles.teamNameLable}>Challenger</Text>
              </View>
            </View>
          </View>
          <View style={styles.checkbox}>
            {item?.responsible_to_secure_scorekeeper === 'challenger' ? (
              <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
          </View>
        </TouchableOpacity>

        {/* <TCTextInputClear
        placeholder={strings.venueDetailsPlaceholder}
          onChangeText={(text) => {
            const ven = [...venue];
            venue[index].details = text;
            setVenue(ven);
          }}
          value={venue[index].details}
          onPressClear={() => {
            const ven = [...venue];
            venue[index].details = '';
            setVenue(ven);
          }}
          multiline={true}
        /> */}
      </View> : <View/>}
    </View>
  );

  const onSavePressed = () => {
    if (comeFrom === 'InviteChallengeScreen' || comeFrom === 'EditChallenge') {
        navigation.navigate(comeFrom, {
          scorekeeperSetting: selection !== 'None' ? {
            who_secure: scorekeeper.map((e) => {
              delete e.id;
              return e;
            }),
            details: detail,
          } : {
            who_secure: 'None',
          },
        });
    } else {
      let bodyParams;
      if (selection === 'None') {
        bodyParams = {
          sport: sportName,
          entity_type: authContext.entity.role === 'user' ? 'player' : 'team',
          responsible_for_scorekeeper: {
            who_secure: 'None',
          },
        };
      } else {
         bodyParams = {
          sport: sportName,
          entity_type: authContext.entity.role === 'user' ? 'player' : 'team',
          responsible_for_scorekeeper: {
            who_secure: scorekeeper.map((e) => {
              delete e.id;
              return e;
            }),
            details: detail,
          },
        };
      }

        console.log('scorekeeper secure:=>', bodyParams);

        setloading(true);
        patchChallengeSetting(authContext?.entity?.uid, bodyParams, authContext)
          .then((response) => {
            setloading(false);
            navigation.navigate(comeFrom, { settingObj: response.payload });
            console.log('patch challenge response:=>', response.payload);
          })
          .catch((e) => {
            setloading(false);
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });
      }
  };

  return (
    <TCKeyboardView style={{ flex: 1 }}>
      <SafeAreaView>
        <ActivityLoader visible={loading} />

        <TCLabel
          title={strings.scorekeeperSettingTitle}
          style={{ marginRight: 15 }}
        />
        <TouchableOpacity
          style={styles.viewContainer}
          onPress={() => setVisibleModal(true)}>
          <Text style={styles.itemView}> {selection || '-'}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.itemView}>{'Scorekeeper(s)'}</Text>
            <Image
              source={images.dropDownArrow}
              style={styles.downArrowImage}
            />
          </View>
        </TouchableOpacity>

        {/* <View
          style={{
            flexDirection: 'row',
            margin: 15,
            marginTop: 35,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.RRegular,
              color: colors.lightBlackColor,
            }}>
            {strings.AvailibilitySubTitle}
          </Text>
        </View> */}
        <FlatList
          data={scorekeeper}
          renderItem={renderScorekeeper}
          keyExtractor={(item, index) => index.toString()}
          style={{ marginBottom: 15 }}
        />
        {selection !== 'None' && (
          <TCTextInputClear
            placeholder={strings.venueDetailsPlaceholder}
            onChangeText={(text) => setDetail(text)}
            value={detail}
            onPressClear={() => {
              setDetail('');
            }}
            multiline={true}
          />
        )}

        <Modal
          isVisible={visibleModal}
          backdropColor="black"
          onBackdropPress={() => setVisibleModal(false)}
          onRequestClose={() => setVisibleModal(false)}
          backdropOpacity={0}
          style={styles.modalStyle}>
          <View style={styles.modalViewContainer}>
            <View style={styles.modalHeaderContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setVisibleModal(false)}>
                <Image source={images.cancelImage} style={styles.closeButton} />
              </TouchableOpacity>
              <Text style={styles.itemText}>{strings.scorekeeperTitle}</Text>
              <Text></Text>
            </View>
            <View style={styles.separatorLine} />
            <FlatList
              ItemSeparatorComponent={() => <TCThinDivider />}
              data={['None', 1, 2, 3, 4, 5]}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderNumbersOf}
            />
          </View>
        </Modal>
      </SafeAreaView>
    </TCKeyboardView>
  );
}
const styles = StyleSheet.create({
  saveButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },
  itemView: {
    alignSelf: 'center',
    color: colors.blackColor,
  },
  viewContainer: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: colors.lightBlackColor,
    elevation: 3,
    flexDirection: 'row',

    height: 40,
    width: '92%',
    marginTop: 12,
    paddingHorizontal: 15,

    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },

  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    resizeMode: 'contain',
  },

  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    marginTop: 14,
    width: '92%',
  },

  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },

  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  downArrowImage: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: colors.lightBlackColor,
    alignSelf: 'center',
    marginLeft: 10,
  },
  modalViewContainer: {
    width: '100%',
    height: Dimensions.get('window').height / 2,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 15,
  },
  modalHeaderContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    alignSelf: 'center',
    marginVertical: 20,
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  modalStyle: {
    margin: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  venueCountTitle: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 10,
  },

  viewTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },

  teamViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageShadowView: {
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
  },
  imageView: {
    height: 40,
    width: 40,
    resizeMode: 'cover',
    borderRadius: 20,
  },

  teamNameLable: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    color: colors.lightBlackColor,
  },
  locationLable: {
    fontFamily: fonts.RLight,
    fontSize: 14,
    color: colors.lightBlackColor,
  },
  teamTextContainer: {
    marginLeft: 20,
  },
});
