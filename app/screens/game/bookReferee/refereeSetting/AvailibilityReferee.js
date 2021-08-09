import React, {
    useState, useLayoutEffect, useContext,
   } from 'react';
   import {

     StyleSheet,
     View,
     Text,
     Alert,
     SafeAreaView,
   } from 'react-native';
   import ActivityLoader from '../../../../components/loader/ActivityLoader';
   import AuthContext from '../../../../auth/context';

   import strings from '../../../../Constants/String';
   import fonts from '../../../../Constants/Fonts';
   import colors from '../../../../Constants/Colors';
   import TCLabel from '../../../../components/TCLabel';
   import ToggleView from '../../../../components/Schedule/ToggleView';
   import {
     patchChallengeSetting,
   } from '../../../../api/Challenge';

   export default function AvailibilityReferee({ navigation, route }) {
     const { comeFrom, sportName } = route?.params;
     const authContext = useContext(AuthContext);

     const [loading, setloading] = useState(false);
     const [acceptChallenge, setAcceptChallenge] = useState(route?.params?.settingObj?.refereeAvailibility ? route?.params?.settingObj?.refereeAvailibility === 'On' : true);

     useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <Text
            style={styles.saveButtonStyle}
            onPress={() => {
              onSavePressed()
            }}>
            Save
          </Text>
        ),
      });
    }, [navigation]);

     const onSavePressed = () => {
        const bodyParams = {
          sport: sportName,
          entity_type: 'referee',
          refereeAvailibility: acceptChallenge ? 'On' : 'Off',
        }

        console.log('data::=>', bodyParams);
        setloading(true);
        patchChallengeSetting(authContext?.entity?.uid, bodyParams, authContext)
        .then((response) => {
          setloading(false);
          navigation.navigate(comeFrom, { settingObj: response.payload })
          console.log('patch challenge response:=>', response.payload);
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
      }

     return (

       <SafeAreaView>
         <ActivityLoader visible={loading} />
         <View>

           <TCLabel title={strings.availibilityRefereeTitle} style={{ marginRight: 15 }} />

           <View
             style={{
               flexDirection: 'row',
               justifyContent: 'space-between',
               margin: 15,
               marginTop: 35,
             }}>
             <Text
               style={{
                 fontSize: 16,
                 fontFamily: fonts.RRegular,
                 color: colors.lightBlackColor,
               }}>
               {strings.AvailibilityRefereeSubTitle}
             </Text>
             <ToggleView
               isOn={acceptChallenge}

               onToggle={() => setAcceptChallenge(!acceptChallenge)}
               onColor={colors.themeColor}
               offColor={colors.grayBackgroundColor}
             />
           </View>
         </View>
       </SafeAreaView>

     );
   }
   const styles = StyleSheet.create({
     saveButtonStyle: {
       fontFamily: fonts.RMedium,
       fontSize: 16,
       marginRight: 10,
     },

   });
