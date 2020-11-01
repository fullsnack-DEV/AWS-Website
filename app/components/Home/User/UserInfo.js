import React from 'react';
import {
  View, Text, StyleSheet, FlatList, Image,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import strings from '../../../Constants/String';
import TCEditHeader from '../../TCEditHeader'

import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import TCInfoField from '../../TCInfoField';
import images from '../../../Constants/ImagePath';
import * as Utility from '../../../utils';

export default function UserInfo({
  navigation, userDetails,
}) {
  const Item = ({ title, imagedata }) => (
    <View style={{ width: 55, height: 'auto', marginLeft: 26 }}>
      <View style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        shadowColor: colors.blackColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.16,
        shadowRadius: 3,
        elevation: 3,
        backgroundColor: '#ffffff',
      }}><Image style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        alignSelf: 'center',
        resizeMode: 'cover',
      }}
      defaultSource = {images.teamPlaceholder}
      source={imagedata}/>

        <View style={{
          marginLeft: 35,
          marginTop: 35,
          width: 15,
          height: 15,
          borderRadius: 7.5,
          shadowColor: colors.blackColor,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.16,
          shadowRadius: 3,
          backgroundColor: '#ffffff',
          zIndex: 100,
          position: 'absolute',
        }}>
          <Image
        style={{
          width: 15,
          height: 15,
          borderRadius: 7.5,
        }} source={images.teamT}/>
        </View>
      </View>

      <Text style={{
        marginTop: 5,
        color: colors.lightBlackColor,
        fontSize: 14,
        fontFamily: fonts.RBold,
        textAlign: 'center',
      }} numberOfLines={ 2 }>{title}</Text>
    </View>
  );

  const renderTeam = ({ item }) => (
    <Item title={item.group_name}
    imagedata={item.thumbnail ? { uri: item.thumbnail } : undefined} />
  );

  const renderClub = ({ item }) => (
    <Item title={item.group_name}
    imagedata={item.thumbnail ? { uri: item.thumbnail } : undefined} />
  );

  const birthdayInString = (birthDate) => `${Utility.monthNames[new Date(birthDate * 1000).getMonth()]} ${new Date(birthDate * 1000).getDate()}, ${new Date(birthDate * 1000).getFullYear()}`

  return (
    <View>
      <ScrollView>
        {/* About section 123 */}
        <View style={styles.sectionStyle}>
          <TCEditHeader title= {strings.abouttitle} showEditButton={true}
          onEditPress={() => {
            navigation.navigate('UserAboutScreen', {
              userDetails,
            });
          }}/>
          <View style={{ marginTop: 21 }}>
            <Text style={{
              fontSize: 16,
              fontFamily: fonts.RLight,
              color: colors.lightBlackColor,
            }}>
              {userDetails.about}
            </Text>
          </View>
          <View style={{ marginTop: 4 }}>
            <Text style={{
              fontSize: 12,
              fontFamily: fonts.RLight,
              color: colors.userPostTimeColor,
            }}>{strings.signedupin}{userDetails.sign_in}</Text>
          </View>
        </View>
        {/* Gray divider */}
        <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>
        {/* Basic section */}
        <View style={styles.sectionStyle}>
          <TCEditHeader title= {strings.basicinfotitle} showEditButton={true}
          onEditPress={() => {
            navigation.navigate('UserBasicInfoScreen', {
              userDetails,
            });
          }}/>
          <TCInfoField title={'Email'} value={userDetails.email ? userDetails.email : 'n/a'} marginLeft={10} marginTop={20}/>
          <TCInfoField title={'Phone'} value={userDetails.phone ? userDetails.phone : 'n/a'} marginLeft={10} marginTop={2}/>
          <TCInfoField title={'Address'} value={userDetails.address ? userDetails.address : 'n/a'} marginLeft={10} marginTop={2}/>
          <TCInfoField title={'Birth'} value={userDetails.birthday ? birthdayInString(userDetails.birthday) : 'n/a'} marginLeft={10} marginTop={2}/>
          <TCInfoField title={'Gender'} value={userDetails.gender ? userDetails.gender : 'n/a'} marginLeft={10} marginTop={2}/>
          <TCInfoField title={'Height'} value={userDetails.height ? userDetails.height : 'n/a'} marginLeft={10} marginTop={2}/>
          <TCInfoField title={'Weight'} value={userDetails.weight ? userDetails.weight : 'n/a'} marginLeft={10} marginTop={2}/>
        </View>
        {/* Gray divider */}
        <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>
        {/* Team section */}
        <View style={[styles.sectionStyle, { marginHorizontal: 0 }]}>
          <TCEditHeader containerStyle={{ marginHorizontal: 15 }} title= {strings.teamstitle} showNextArrow={true}/>
          <FlatList
          style={{ marginTop: 15 }}
            data={userDetails.joined_teams}
            horizontal
            renderItem={renderTeam}
            keyExtractor={(item) => item.group_id}
            showsHorizontalScrollIndicator={false}
        />
        </View>
        {/* Gray divider */}
        <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>
        {/* Club section */}
        <View style={[styles.sectionStyle, { marginHorizontal: 0 }]}>
          <TCEditHeader containerStyle={{ marginHorizontal: 15 }} title= {strings.clubstitle} showNextArrow={true}/>
          <FlatList
          style={{ marginTop: 15 }}
            data={userDetails.joined_clubs}
            horizontal
            renderItem={renderClub}
            keyExtractor={(item) => item.group_id}
            showsHorizontalScrollIndicator={false}
        />
        </View>
        {/* Gray divider */}
        <View style={{ height: 7, backgroundColor: colors.grayBackgroundColor }}></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionStyle: {
    flex: 1,
    marginTop: 25,
    marginBottom: 14,
    marginHorizontal: 15,
  },
})
