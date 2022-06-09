// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   ScrollView,
//   StyleSheet,
// } from 'react-native';

// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';

// import LinearGradient from 'react-native-linear-gradient';

// import colors from '../../../../Constants/Colors';
// import fonts from '../../../../Constants/Fonts';
// import images from '../../../../Constants/ImagePath';
// import strings from '../../../../Constants/String';
// import TCKeyboardView from '../../../../components/TCKeyboardView';
// import TCFormProgress from '../../../../components/TCFormProgress';

// export default function CreateClubForm2({ navigation, route }) {
//   const [registrationFee, setRegistrationFee] = useState('');
//   const [membershipUserSelected, setMembershipUserSelected] = useState(0);
//   const [membershipTeamSelected, setMembershipTeamSelected] = useState(0);

//   return (
//     <>
//       <TCFormProgress totalSteps={3} curruentStep={2}/>

//       <TCKeyboardView>
//         <ScrollView style={ styles.mainContainer }>

//           <Text style={ styles.whoJoinText }>{strings.whoJoinText}</Text>

//           <View style={ styles.radioButtonView }>
//             <TouchableWithoutFeedback onPress={ () => setMembershipUserSelected(0) }>
//               {membershipUserSelected === 0 ? (
//                 <Image source={ images.radioSelect } style={ styles.radioImage } />
//             ) : (
//               <Image
//               source={ images.radioUnselect }
//               style={ styles.unSelectRadioImage }
//             />
//             )}
//             </TouchableWithoutFeedback>
//             <Text style={ styles.radioText }>{strings.everyoneText}</Text>
//           </View>
//           <View style={ styles.radioButtonView }>
//             <TouchableWithoutFeedback onPress={ () => setMembershipUserSelected(1) }>
//               {membershipUserSelected === 1 ? (
//                 <Image source={ images.radioSelect } style={ styles.radioImage } />
//             ) : (
//               <Image
//               source={ images.radioUnselect }
//               style={ styles.unSelectRadioImage }
//             />
//             )}
//             </TouchableWithoutFeedback>
//             <Text style={ styles.radioText }>{strings.onlyPersonText}</Text>
//           </View>

//           <Text style={ styles.whoJoinText }>{strings.whoseApprovalText}</Text>

//           <View style={ styles.radioButtonView }>
//             <TouchableWithoutFeedback onPress={ () => setMembershipTeamSelected(0) }>
//               {membershipTeamSelected === 0 ? (
//                 <Image source={ images.radioSelect } style={ styles.radioImage } />
//             ) : (
//               <Image
//               source={ images.radioUnselect }
//               style={ styles.unSelectRadioImage }
//             />
//             )}
//             </TouchableWithoutFeedback>
//             <Text style={ styles.radioText }>{strings.noneText}</Text>
//           </View>
//           <View style={ styles.radioButtonView }>
//             <TouchableWithoutFeedback onPress={ () => setMembershipTeamSelected(1) }>
//               {membershipTeamSelected === 1 ? (
//                 <Image source={ images.radioSelect } style={ styles.radioImage } />
//             ) : (
//               <Image
//               source={ images.radioUnselect }
//               style={ styles.unSelectRadioImage }
//             />
//             )}
//             </TouchableWithoutFeedback>
//             <Text style={ styles.radioText }>{strings.clubAdminText}</Text>
//           </View>
//           <View style={ styles.fieldView }>
//             <Text style={ styles.fieldTitle }>{strings.registerTitle}</Text>
//           </View>
//           <View style={ styles.matchFeeView }>
//             <TextInput
//           placeholder={ strings.enterFeePlaceholder }
//           style={ styles.feeText }
//           onChangeText={ (text) => setRegistrationFee(text) }
//           value={ registrationFee }
//           keyboardType={ 'decimal-pad' }></TextInput>
//             <Text style={ styles.curruency }>CAD</Text>
//           </View>
//           <TouchableOpacity
//         onPress={ () => {
//           const form2 = {};
//           if (membershipUserSelected === 0) {
//             form2.join_type = 'anyone';
//           } else {
//             form2.join_type = 'invited';
//           }
//           if (membershipTeamSelected === 0) {
//             form2.approval_required = false;
//           } else {
//             form2.approval_required = true;
//           }
//           if (registrationFee !== 0) {
//             form2.registration_fee = registrationFee;
//           }
//           navigation.navigate('CreateClubForm3', {
//             createClubForm2: { ...route.params.createClubForm1, ...form2 },
//           });
//         } }>
//             <LinearGradient
//           colors={ [colors.yellowColor, colors.themeColor] }
//           style={ styles.nextButton }>
//               <Text style={ styles.nextButtonText }>{strings.nextTitle}</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </ScrollView>
//       </TCKeyboardView>
//     </>
//   );
// }
// const styles = StyleSheet.create({
//   curruency: {
//     alignSelf: 'flex-end',
//     fontSize: wp('4%'),
//   },

//   feeText: {
//     alignSelf: 'center',
//     fontSize: wp('3.8%'),
//     height: 40,
//     width: '96%',
//   },

//   fieldTitle: {
//     marginTop: hp('2%'),

//     fontSize: wp('3.8%'),
//     textAlign: 'left',
//     // fontFamily: fonts.RBold,
//     paddingLeft: 15,

//     color: colors.lightBlackColor,
//   },

//   mainContainer: {
//     flex: 1,
//     flexDirection: 'column',
//   },
//   matchFeeView: {
//     alignSelf: 'center',
//     backgroundColor: colors.offwhite,

//     borderRadius: 5,
//     color: 'black',
//     elevation: 3,
//     flexDirection: 'row',
//     fontSize: wp('3.5%'),
//     height: 40,

//     marginTop: 12,
//     paddingHorizontal: 15,
//     paddingRight: 30,

//     paddingVertical: 12,
//     shadowColor: colors.googleColor,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.5,
//     shadowRadius: 1,
//     width: wp('92%'),
//   },

//   nextButton: {
//     alignSelf: 'center',
//     borderRadius: 30,
//     height: 45,
//     marginBottom: 40,
//     marginTop: wp('12%'),
//     width: '90%',
//   },
//   nextButtonText: {
//     alignSelf: 'center',
//     color: colors.whiteColor,
//     fontFamily: fonts.RBold,
//     fontSize: wp('4%'),
//     marginVertical: 10,
//   },
//   radioButtonView: {
//     flexDirection: 'row',
//     marginLeft: 20,
//     marginRight: 15,
//     marginTop: 10,
//   },
//   radioImage: {
//     alignSelf: 'center',
//     height: 22,
//     resizeMode: 'contain',
//     tintColor: colors.radioButtonColor,
//     width: 22,
//   },
//   radioText: {
//     alignSelf: 'center',
//     color: colors.lightBlackColor,
//     fontSize: wp('4%'),
//     marginLeft: 15,
//     marginRight: 15,
//   },

//   unSelectRadioImage: {
//     alignSelf: 'center',
//     height: 22,
//     resizeMode: 'contain',
//     tintColor: colors.grayColor,
//     width: 22,
//   },
//   whoJoinText: {
//     color: colors.lightBlackColor,
//     fontFamily: fonts.RRegular,
//     fontSize: wp('4%'),
//     marginBottom: 20,
//     marginLeft: 20,
//     marginRight: 20,
//     marginTop: 15,
//   },
// });

import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  FlatList,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';

import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import {getHitSlop, languageList} from '../../../../utils';
import TCFormProgress from '../../../../components/TCFormProgress';

import TCThinDivider from '../../../../components/TCThinDivider';
import TCGradientButton from '../../../../components/TCGradientButton';

export default function CreateClubForm2({navigation, route}) {
  const [createClubForm1] = useState(route?.params?.createClubForm1);

  const [languagesName, setLanguagesName] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [languages, setLanguages] = useState([]);

  const [description, setDescription] = useState('');

  const [isModalVisible, setModalVisible] = useState(false);

  const selectedLanguage = [];

  useEffect(() => {
    let languageText = '';
    if (selectedLanguages) {
      selectedLanguages.map((langItem, index) => {
        languageText = languageText + (index ? ', ' : '') + langItem;
        return null;
      });
      setLanguagesName(languageText);
    }
  }, [selectedLanguages]);

  useEffect(() => {
    const arr = [];
    for (const tempData of languageList) {
      tempData.isChecked = false;
      arr.push(tempData);
    }
    setLanguages(arr);
  }, []);

  const isIconCheckedOrNot = ({item, index}) => {
    languages[index].isChecked = !item.isChecked;

    setLanguages([...languages]);
  };

  const renderLanguage = ({item, index}) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        isIconCheckedOrNot({item, index});
      }}>
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>{item.language}</Text>
        <View style={styles.checkbox}>
          {languages[index].isChecked ? (
            <Image source={images.orangeCheckBox} style={styles.checkboxImg} />
          ) : (
            <Image source={images.uncheckWhite} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const nextOnPress = () => {
    console.log('createClubForm1:=>', createClubForm1);
    const obj = {
      language: selectedLanguages,
    };
    if (description !== '') {
      obj.descriptions = description;
    }

    navigation.navigate('CreateClubForm3', {
      createClubForm2: {
        ...createClubForm1,
        ...obj,
      },
    });
  };

  return (
    <>
      <TCFormProgress totalSteps={3} curruentStep={2} />
      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.LocationText}>{strings.languageText}</Text>
        <TouchableOpacity style={styles.languageView} onPress={toggleModal}>
          <Text
            style={
              languagesName
                ? styles.languageText
                : styles.languagePlaceholderText
            }
            numberOfLines={50}>
            {languagesName || 'Add language'}
          </Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={styles.LocationText}>
            {strings.descriptionClubTextDetails}
          </Text>
        </View>
        <TextInput
          style={styles.descriptionTxt}
          onChangeText={(text) => setDescription(text)}
          value={description}
          multiline
          maxLength={1000}
          textAlignVertical={'top'}
          numberOfLines={4}
          placeholder={strings.descriptionClubTextPlaceholder}
          placeholderTextColor={colors.userPostTimeColor}
        />
        <View style={{flex: 1}} />
      </ScrollView>
      <TCGradientButton
        isDisabled={languagesName === ''}
        title={strings.nextTitle}
        style={{marginBottom: 30}}
        onPress={nextOnPress}
      />
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onRequestClose={() => setModalVisible(false)}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
        }}>
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 1.3,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            left: 0,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              hitSlop={getHitSlop(15)}
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
              }}>
              Languages
            </Text>
            <TouchableOpacity
              onPress={() => {
                for (const temp of languages) {
                  if (temp.isChecked) {
                    selectedLanguage.push(temp.language);
                  }
                }
                setSelectedLanguages(selectedLanguage);
                toggleModal();
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  marginVertical: 20,
                  fontSize: 16,
                  fontFamily: fonts.RRegular,
                  color: colors.themeColor,
                }}>
                Apply
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.separatorLine} />
          <FlatList
            ItemSeparatorComponent={() => <TCThinDivider />}
            data={languages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderLanguage}
          />
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-unused-styles
  inputAndroid: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: wp('4%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,

    width: wp('92%'),
  },
  // eslint-disable-next-line react-native/no-unused-styles
  inputIOS: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: wp('3.5%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,

    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    width: wp('92%'),
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  languageView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    flexDirection: 'row',
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,

    width: wp('92%'),
  },
  languageText: {
    backgroundColor: colors.whiteColor,
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
  languagePlaceholderText: {
    backgroundColor: colors.whiteColor,
    color: colors.userPostTimeColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
  LocationText: {
    marginTop: hp('3%'),
    color: colors.lightBlackColor,
    fontSize: 20,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    paddingLeft: 15,
  },
  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginLeft: 5,
    resizeMode: 'contain',
  },

  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    marginTop: 14,
    width: wp('92%'),
  },

  languageList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
  },

  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },

  descriptionTxt: {
    height: 120,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    width: wp('92%'),
    alignSelf: 'center',
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: colors.lightBlackColor,
    paddingRight: 30,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
  },
});
