import React, {useContext} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {strings} from '../../../../Localization/translation';
import TCEditHeader from '../../TCEditHeader';

import fonts from '../../../Constants/Fonts';
import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import TCInfoField from '../../TCInfoField';
import * as Utility from '../../../utils';
import UserInfoGroupItem from './UserInfoGroupItem';
import UserInfoPlaysInItem from './UserInfoPlaysInItem';
import UserInfoRefereesInItem from './UserInfoRefereesInItem';
import AuthContext from '../../../auth/context';

export default function UserInfo({
  navigation,
  userDetails,
  isAdmin,
  onGroupPress,
  onRefereesInPress,
  onPlayInPress,
  onGroupListPress,
}) {
  const authContext = useContext(AuthContext);

  console.log('RK ', userDetails);
  const playin = userDetails.games && userDetails.games.length > 0;
  const refereesIn =
    userDetails.referee_data && userDetails.referee_data.length > 0;

  const renderTeam = ({item}) => (
    <UserInfoGroupItem
      title={item.group_name}
      imageData={item.thumbnail ? {uri: item.thumbnail} : undefined}
      entityType={'team'}
      onGroupPress={() => {
        console.log('user team', navigation);
        if (onGroupPress) {
          onGroupPress(item);
        }
      }}
    />
  );

  const renderClub = ({item}) => (
    <UserInfoGroupItem
      title={item.group_name}
      imageData={item.thumbnail ? {uri: item.thumbnail} : undefined}
      onGroupPress={() => {
        console.log('user club', navigation);
        if (onGroupPress) {
          onGroupPress(item);
        }
      }}
    />
  );

  const renderPlayIn = ({item}) => (
    <UserInfoPlaysInItem
      title={Utility.getSportName(item, authContext)}
      totalGames={item.totalGames}
      thumbURL={item.thumbnail ? {uri: item.thumbnail} : undefined}
      onPlayInPress={() => {
        console.log('renderPlayIn', navigation);
        if (onPlayInPress) {
          onPlayInPress(item);
        }
      }}
    />
  );

  const renderRefereesIn = ({item}) => (
    <UserInfoRefereesInItem
      title={Utility.getSportName(item, authContext)}
      thumbURL={images.gameGoal}
      onRefereesInPress={() => {
        console.log('renderPlayIn', navigation);
        if (onRefereesInPress) {
          onRefereesInPress(item);
        }
      }}
    />
  );

  const birthdayInString = (birthDate) =>
    `${Utility.monthNames[new Date(birthDate * 1000).getMonth()]} ${new Date(
      birthDate * 1000,
    ).getDate()}, ${new Date(birthDate * 1000).getFullYear()}`;

  let email = userDetails.email;
  let phone = userDetails.phone;
  let address = userDetails.address;
  let birth = birthdayInString(userDetails.birthday);
  let gender = userDetails.gender;
  let height = userDetails.height;
  let weight = userDetails.weight;

  if (!userDetails.email) {
    email = isAdmin ? strings.addemail : strings.NA;
  }
  if (!userDetails.phone) {
    phone = isAdmin ? strings.addphone : strings.NA;
  }
  if (!userDetails.address) {
    address = isAdmin ? strings.addaddress : strings.NA;
  }
  if (!userDetails.birthday) {
    birth = isAdmin ? strings.addbirth : strings.NA;
  }
  if (!userDetails.gender) {
    gender = isAdmin ? strings.addgender : strings.NA;
  }
  if (!userDetails.height) {
    height = isAdmin ? strings.addheight : strings.NA;
  }
  if (!userDetails.weight) {
    weight = isAdmin ? strings.addweight : strings.NA;
  }

  const onTeamListPress = () => {
    if (onGroupListPress) {
      onGroupListPress(userDetails.joined_teams, 'team');
    }
  };

  const onClubListPress = () => {
    if (onGroupListPress) {
      onGroupListPress(userDetails.joined_clubs, 'club');
    }
  };

  return (
    <View>
      {/* About section */}
      <View style={styles.sectionStyle}>
        <TCEditHeader
          title={strings.abouttitle}
          showEditButton={isAdmin}
          onEditPress={() => {
            navigation.navigate('UserAboutScreen', {
              userDetails,
            });
          }}
        />
        <View style={{marginTop: 21}}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.RLight,
              color: colors.lightBlackColor,
            }}>
            {userDetails.about}
          </Text>
        </View>
        <View style={{marginTop: 4}}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: fonts.RLight,
              color: colors.userPostTimeColor,
            }}>
            {strings.signedupin}
            {userDetails.sign_in}
          </Text>
        </View>
      </View>
      {/* Gray divider */}
      <View
        style={{height: 7, backgroundColor: colors.grayBackgroundColor}}></View>
      {/* Basic section */}
      <View style={styles.sectionStyle}>
        <TCEditHeader
          title={strings.basicinfotitle}
          showEditButton={isAdmin}
          onEditPress={() => {
            navigation.navigate('UserBasicInfoScreen', {
              userDetails,
            });
          }}
        />
        <TCInfoField
          title={strings.emailtitle}
          value={email}
          marginLeft={10}
          marginTop={20}
        />
        <TCInfoField title={strings.phone} value={phone} marginLeft={10} />
        <TCInfoField
          title={strings.addressPlaceholder}
          value={address}
          marginLeft={10}
        />
        <TCInfoField title={strings.birth} value={birth} marginLeft={10} />
        <TCInfoField title={strings.gender} value={gender} marginLeft={10} />
        <TCInfoField title={strings.height} value={height} marginLeft={10} />
        <TCInfoField title={strings.weight} value={weight} marginLeft={10} />
      </View>
      {/* Gray divider */}
      <View
        style={{height: 7, backgroundColor: colors.grayBackgroundColor}}></View>
      {/* Play in section */}
      {playin && (
        <View>
          <View style={[styles.sectionStyle, {marginHorizontal: 0}]}>
            <TCEditHeader
              containerStyle={{marginHorizontal: 15}}
              title={strings.playin}
              showNextArrow={true}
            />
            <FlatList
              style={{marginTop: 15}}
              data={userDetails.games}
              horizontal
              renderItem={renderPlayIn}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          {/* Gray divider */}
          <View
            style={{
              height: 7,
              backgroundColor: colors.grayBackgroundColor,
            }}></View>
        </View>
      )}
      {refereesIn && (
        <View>
          <View style={[styles.sectionStyle, {marginHorizontal: 0}]}>
            <TCEditHeader
              containerStyle={{marginHorizontal: 10}}
              title={strings.refereesin}
              showNextArrow={true}
            />
            <FlatList
              style={{marginTop: 15}}
              data={userDetails.referee_data}
              horizontal
              renderItem={renderRefereesIn}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          {/* Gray divider */}
          <View
            style={{
              height: 7,
              backgroundColor: colors.grayBackgroundColor,
            }}></View>
        </View>
      )}

      {/* Team section */}
      <View style={[styles.sectionStyle, {marginHorizontal: 0}]}>
        <TCEditHeader
          containerStyle={{marginHorizontal: 15}}
          title={strings.teamstitle}
          showNextArrow={true}
          onNextArrowPress={onTeamListPress}
        />
        <FlatList
          style={{marginTop: 15, backgroundColor: colors.whiteColor}}
          data={userDetails.joined_teams}
          horizontal
          renderItem={renderTeam}
          keyExtractor={(item) => item.group_id}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {/* Gray divider */}
      <View
        style={{height: 7, backgroundColor: colors.grayBackgroundColor}}></View>
      {/* Club section */}
      <View style={[styles.sectionStyle, {marginHorizontal: 0}]}>
        <TCEditHeader
          containerStyle={{marginHorizontal: 15}}
          title={strings.clubstitle}
          showNextArrow={true}
          onNextArrowPress={onClubListPress}
        />
        <FlatList
          style={{marginTop: 15, backgroundColor: colors.whiteColor}}
          data={userDetails.joined_clubs}
          horizontal
          renderItem={renderClub}
          keyExtractor={(item) => item.group_id}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {/* Gray divider */}
      <View
        style={{height: 7, backgroundColor: colors.grayBackgroundColor}}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionStyle: {
    flex: 1,
    marginTop: 25,
    marginBottom: 14,
    marginHorizontal: 15,
    backgroundColor: colors.whiteColor,
  },
});
