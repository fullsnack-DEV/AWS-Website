/* eslint-disable no-nested-ternary */
import React, {
    useState, useEffect, useContext, useCallback,
    } from 'react';
   import {
     StyleSheet,
     View,
     Text,
     Image,
     FlatList,
     TouchableWithoutFeedback,
     ScrollView,
     TouchableOpacity,
   } from 'react-native';

   import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
   import LinearGradient from 'react-native-linear-gradient';
   import AuthContext from '../../../auth/context';
   import colors from '../../../Constants/Colors';
   import fonts from '../../../Constants/Fonts';
   import images from '../../../Constants/ImagePath';
   import strings from '../../../Constants/String';

   export default function ScorekeeperReservationSetting({ navigation, route }) {
     const [settingObject, setSettingObject] = useState();
     const [showBottomNotes, setShowBottomNotes] = useState(true);
     const authContext = useContext(AuthContext);

     const [sportName] = useState(route?.params?.sportName);
     const getSettings = useCallback(() => {
      setSettingObject((authContext?.entity?.obj?.scorekeeper_data ?? []).filter((obj) => obj.sport === sportName)?.[0]?.setting);
     }, [authContext, sportName]);

     useEffect(() => {
       if (route?.params?.settingObj) {
         setSettingObject(route?.params?.settingObj);
       } else {
         getSettings();
       }
     }, [authContext, getSettings, route?.params?.settingObj, sportName]);

     const challengeSettingMenu = [
       { key: 'Availability', id: 1 },
       { key: 'Scorekeeper Fee', id: 2 },
       { key: 'Refund Policy', id: 3 },
       { key: 'Available Area', id: 4 },

     ];
     const handleOpetions = async (opetions) => {
       if (opetions === 'Availability') {
         if (settingObject) {
           navigation.navigate('AvailibilityScorekeeper', {
             settingObj: settingObject,
             comeFrom: 'ScorekeeperReservationSetting',
             sportName,
           });
         } else {
           navigation.navigate('AvailibilityScorekeeper', {
             comeFrom: 'ScorekeeperReservationSetting',
             sportName,
           });
         }
       } else if (opetions === 'Scorekeeper Fee') {
         if (settingObject) {
           navigation.navigate('ScorekeeperFee', {
             settingObj: settingObject,
             comeFrom: 'ScorekeeperReservationSetting',
             sportName,
           });
         } else {
           navigation.navigate('ScorekeeperFee', {
             comeFrom: 'ScorekeeperReservationSetting',
             sportName,
           });
         }
       } else if (opetions === 'Refund Policy') {
         if (settingObject) {
           navigation.navigate('RefundPolicyScorekeeper', {
             settingObj: settingObject,
             comeFrom: 'ScorekeeperReservationSetting',
             sportName,
           });
         } else {
           navigation.navigate('RefundPolicyScorekeeper', {
             comeFrom: 'ScorekeeperReservationSetting',
             sportName,
           });
         }
       } else if (opetions === 'Available Area') {
         console.log(settingObject);
         if (settingObject) {
           navigation.navigate('AvailableAreaScorekeeper', {
             settingObj: settingObject,
             comeFrom: 'ScorekeeperReservationSetting',
             sportName,
           });
         } else {
           navigation.navigate('AvailableAreaScorekeeper', {
             comeFrom: 'ScorekeeperReservationSetting',
             sportName,
           });
         }
       }
     };
     const getSettingValue = (item) => {
       if (item.key === 'Availability') {
         if (settingObject?.scorekeeperAvailibility) {
           return settingObject?.scorekeeperAvailibility;
         }
       }

       if (item.key === 'Scorekeeper Fee') {
         if (settingObject?.game_fee) {
           return `$${settingObject?.game_fee?.fee} ${settingObject?.game_fee?.currency_type}`;
         }
       }
       if (item.key === 'Refund Policy') {
         if (settingObject?.refund_policy) {
           return settingObject?.refund_policy;
         }
       }

       if (item.key === 'Available Area') {
         if (settingObject?.available_area) {
           return 'Complated';
         }
       }

       return 'incomplete';
     };
     const renderMenu = ({ item }) => (
       <TouchableWithoutFeedback
         style={styles.listContainer}
         onPress={() => {
           handleOpetions(item.key);
         }}>
         <View style={{ flexDirection: 'row' }}>
           <Text style={styles.listItems}>{item.key}</Text>

           {getSettingValue(item) === 'incomplete' ? (
             <Text style={styles.incompleteStyle}>
               {/* {getSettingValue(item)} */}
               incomplete
             </Text>
           ) : (
             <Text style={styles.completeStyle}>
               {getSettingValue(item)}
               {/* {`$${gameFee?.fee} ${gameFee?.currency_type}`} */}
             </Text>
           )}

           <Image source={images.nextArrow} style={styles.nextArrow} />
         </View>
       </TouchableWithoutFeedback>
     );

     return (
       <>
         <ScrollView style={styles.mainContainer}>

           <View
             style={{ padding: 15, backgroundColor: colors.grayBackgroundColor }}>
             <Text
               style={{
                 fontSize: 14,
                 fontFamily: fonts.RRegular,
                 color: colors.lightBlackColor,
               }}>
               {strings.scorekeeperSettingHeading}
             </Text>
           </View>
           <FlatList
             data={challengeSettingMenu}
             keyExtractor={(index) => index.toString()}
             renderItem={renderMenu}
             ItemSeparatorComponent={() => (
               <View style={styles.separatorLine}></View>
             )}
           />
           <View style={styles.separatorLine}></View>
         </ScrollView>
         {showBottomNotes && (
           <LinearGradient
             colors={[colors.yellowColor, colors.orangeGradientColor]}
             style={styles.challengeNotesView}>
             <Text
               style={{
                 color: colors.whiteColor,
                 fontFamily: fonts.RBold,
                 fontSize: 14,
                 width: '88%',
               }}>
               {strings.scorekeeperSettingNotes}
             </Text>
             <TouchableOpacity onPress={() => setShowBottomNotes(false)}>
               <Image
                 source={images.cancelWhite}
                 style={{
                   height: 10,
                   width: 10,
                   resizeMode: 'contain',
                   tintColor: colors.whiteColor,
                 }}
               />
             </TouchableOpacity>
           </LinearGradient>
         )}
       </>
     );
   }
   const styles = StyleSheet.create({
     listContainer: {
       flex: 1,
       flexDirection: 'row',
     },
     listItems: {
       flex: 1,
       padding: 20,
       paddingLeft: 15,
       fontSize: 16,
       fontFamily: fonts.RRegular,
       color: colors.blackColor,
       alignSelf: 'center',
     },
     incompleteStyle: {
       marginRight: 10,
       fontSize: 16,
       fontFamily: fonts.RRegular,
       color: colors.redColor,
       alignSelf: 'center',
     },
     completeStyle: {
       marginRight: 10,
       fontSize: 16,
       fontFamily: fonts.RRegular,
       color: colors.completeTextColor,
       alignSelf: 'center',
     },
     mainContainer: {
       flex: 1,
       flexDirection: 'column',
     },
     nextArrow: {
       alignSelf: 'center',
       flex: 0.1,
       height: 15,
       marginRight: 10,
       resizeMode: 'contain',
       tintColor: colors.grayColor,
       width: 15,
     },
     separatorLine: {
       alignSelf: 'center',
       backgroundColor: colors.lightgrayColor,
       height: 0.5,
       width: wp('90%'),
     },
     challengeNotesView: {
       padding: 15,
       borderTopLeftRadius: 20,
       borderTopRightRadius: 20,
       flexDirection: 'row',
       justifyContent: 'space-between',
       paddingBottom: 40,
     },
   });
