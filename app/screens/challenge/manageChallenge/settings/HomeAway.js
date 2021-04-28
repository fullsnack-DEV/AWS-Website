import React, {
     useState, useLayoutEffect,
    } from 'react';
   import {
    Alert, StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView,

   } from 'react-native';

   import strings from '../../../../Constants/String';
   import fonts from '../../../../Constants/Fonts';
   import colors from '../../../../Constants/Colors';
   import TCLabel from '../../../../components/TCLabel';
import images from '../../../../Constants/ImagePath';

   export default function HomeAway({ navigation }) {
     const [teams, setteams] = useState([{ name: 'Kishan Team', city: 'Vancuver', state_abbr: 'BC' }, { name: 'Challenger' }]);

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

     const swapTeam = () => {
        setteams([teams[1], teams[0]]);
      };

     return (

       <SafeAreaView>
         <View>
           <TCLabel title={strings.homeAwayTitle} style={{ marginRight: 15 }} />

           <View>

             <View style={styles.teamContainer}>
               <Text style={styles.homeLableStyle}>HOME</Text>
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
                   <Text style={styles.teamNameLable}>
                     {teams[0].name}
                   </Text>
                   {teams[0].city && <Text style={styles.locationLable}>
                     {`${teams[0].city}, ${teams[0].state_abbr}`}
                   </Text>}
                 </View>
               </View>
             </View>
             <TouchableOpacity
            style={styles.swapContainer}
            onPress={() => swapTeam()}>
               <Image source={images.swapTeam} style={styles.swapImageStyle} />
             </TouchableOpacity>
             <View style={styles.teamContainer}>
               <Text style={styles.homeLableStyle}>AWAY</Text>
               <View style={styles.teamViewStyle}>
                 <View style={styles.imageShadowView}>
                   <Image
                  source={
                    // teams[1].thumbnail
                    //   ? { uri: teams[1].thumbnail }
                    //   : images.teamPlaceholder
                    images.teamPlaceholder
                  }
                  style={styles.imageView}
                />
                 </View>
                 <View style={styles.teamTextContainer}>
                   <Text style={styles.teamNameLable}>
                     {teams[1].name}
                   </Text>
                   {teams[1].city && <Text style={styles.locationLable}>
                     {`${teams[1].city}, ${teams[1].state_abbr}`}
                   </Text>}
                 </View>
               </View>
             </View>

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

      teamContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15,
      },
      homeLableStyle: {
        margin: 15,
        marginRight: 20,
        fontFamily: fonts.RLight,
        fontSize: 14,
        color: colors.lightBlackColor,
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
      swapImageStyle: {
        height: 25,
        width: 25,
        resizeMode: 'cover',
        marginLeft: 20,
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
      swapContainer: {
        marginLeft: 15,
        marginTop: 5,
        marginBottom: 5,
      },

   });
