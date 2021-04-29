import React, {
    useEffect, useState, useContext, useLayoutEffect,
    } from 'react';
   import {
    Alert, StyleSheet, View, Text, FlatList,
     SafeAreaView,
   } from 'react-native';

   import { useIsFocused } from '@react-navigation/native';
   import AuthContext from '../../../../auth/context';
   import strings from '../../../../Constants/String';
   import fonts from '../../../../Constants/Fonts';
   import colors from '../../../../Constants/Colors';
   import TCKeyboardView from '../../../../components/TCKeyboardView';
   import TCLabel from '../../../../components/TCLabel';
   import TCMessageButton from '../../../../components/TCMessageButton';
   import TCTextInputClear from '../../../../components/TCTextInputClear';

   let entity = {};
   export default function GameDuration({ navigation, route }) {
     const isFocused = useIsFocused();
     const authContext = useContext(AuthContext);

     const [venue, setVenue] = useState([
       {
         id: 0,

         responsible_team_id: 'none',
         name: '',
         address: '',
         details: '',
       },
     ]);

     useLayoutEffect(() => {
       navigation.setOptions({
         headerRight: () => (
           <Text
             style={styles.saveButtonStyle}
             onPress={() => Alert.alert('Save')}>
             Save
           </Text>
         ),
       });
     }, [navigation]);

     useEffect(() => {
       entity = authContext.entity;
       console.log(entity);
       if (route && route.params && route.params.editable && route.params.body) {
         setVenue([...route.params.body.referee]);
       }
       if (
         route
         && route.params
         && route.params.editableAlter
         && route.params.body
       ) {
         setVenue([...route.params.body.referee]);
       }
     }, [isFocused]);

     const addVenue = () => {
       if (venue.length < 10) {
         const obj = {
           id: venue.length === 0 ? 0 : venue.length,

           responsible_team_id: 'none',
           name: '',
           address: '',
           details: '',
         };
         setVenue([...venue, obj]);
       } else {
         Alert.alert(strings.titleBasic, strings.maxVenue);
       }
     };

     const renderPeriods = ({ index }) => (
       <View>
         <View style={styles.viewTitleContainer}>
           <Text ></Text>
           {index !== 0 && (
             <Text
               style={styles.deleteButton}
               onPress={() => {
                 venue.splice(index, 1);
                 setVenue([...venue]);
               }}>
               Delete
             </Text>
           )}
         </View>

         <View style={styles.viewContainer}>

           <TCTextInputClear
            placeholder={strings.venueNamePlaceholder}
             onChangeText={(text) => {
               const ven = [...venue];
               venue[index].name = text;
               setVenue(ven);
             }}
             value={venue[index].name}
             onPressClear={() => {
               const ven = [...venue];
               venue[index].name = '';
               setVenue(ven);
             }}
             multiline={false}
           />

           <TCTextInputClear
           placeholder={strings.venueAddressPlaceholder}
             onChangeText={(text) => {
               const ven = [...venue];
               venue[index].address = text;
               setVenue(ven);
             }}
             value={venue[index].address}
             onPressClear={() => {
               const ven = [...venue];
               venue[index].address = '';
               setVenue(ven);
             }}
             multiline={false}
           />

           <TCTextInputClear
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
           />

         </View>
       </View>
     );
     const renderOverTime = ({ index }) => (
       <View>
         <View style={styles.viewTitleContainer}>
           <Text style={styles.venueCountTitle}></Text>
           {index !== 0 && (
             <Text
                style={styles.deleteButton}
                onPress={() => {
                  venue.splice(index, 1);
                  setVenue([...venue]);
                }}>
               Delete
             </Text>
            )}
         </View>

         <View style={styles.viewContainer}>

           <TCTextInputClear
            placeholder={strings.venueNamePlaceholder}
              onChangeText={(text) => {
                const ven = [...venue];
                venue[index].name = text;
                setVenue(ven);
              }}
              value={venue[index].name}
              onPressClear={() => {
                const ven = [...venue];
                venue[index].name = '';
                setVenue(ven);
              }}
              multiline={false}
            />

           <TCTextInputClear
            placeholder={strings.venueAddressPlaceholder}
              onChangeText={(text) => {
                const ven = [...venue];
                venue[index].address = text;
                setVenue(ven);
              }}
              value={venue[index].address}
              onPressClear={() => {
                const ven = [...venue];
                venue[index].address = '';
                setVenue(ven);
              }}
              multiline={false}
            />

           <TCTextInputClear
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
            />

         </View>
       </View>
      );
     return (
       <TCKeyboardView>
         <SafeAreaView>
           <View>
             <TCLabel title={strings.gameDurationTitle1} style={{ marginRight: 15 }} />

             <FlatList
             data={venue}
             renderItem={renderPeriods}
             keyExtractor={(item, index) => index.toString()}
             style={{ marginBottom: 15 }}
           />
             <TCMessageButton
             title={'+ Add Interval & Period'}
             width={150}
             alignSelf={'center'}
             marginTop={15}
             marginBottom={40}
             onPress={() => addVenue()}
           />
             <TCLabel title={strings.gameDurationTitle2} style={{ marginRight: 15 }} />
             <FlatList
             data={venue}
             renderItem={renderOverTime}
             keyExtractor={(item, index) => index.toString()}
             style={{ marginBottom: 15 }}
           />
             <TCMessageButton
             title={'+ Add Interval & Overtime'}
             width={160}
             alignSelf={'center'}
             marginTop={15}
             marginBottom={40}
             onPress={() => addVenue()}
           />
           </View>
         </SafeAreaView>

       </TCKeyboardView>
     );
   }
   const styles = StyleSheet.create({
     viewContainer: {
       marginLeft: 15,
       marginRight: 15,
     },

     deleteButton: {
       fontSize: 12,
       fontFamily: fonts.RRegular,
       color: colors.darkThemeColor,
       marginRight: 25,
     },
     viewTitleContainer: {
       flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'space-between',
     },
     saveButtonStyle: {
       fontFamily: fonts.RMedium,
       fontSize: 16,
       marginRight: 10,
     },

   });
