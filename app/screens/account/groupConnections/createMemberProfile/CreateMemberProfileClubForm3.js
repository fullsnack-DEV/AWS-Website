import React, {useState, useLayoutEffect, useEffect, useContext} from 'react';
import {StyleSheet, View, Text, Image, ScrollView, Alert} from 'react-native';

import {createMemberProfile} from '../../../../api/Groups';
import uploadImages from '../../../../utils/imageAction';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCTextField from '../../../../components/TCTextField';
import AuthContext from '../../../../auth/context';
import TCGroupNameBadge from '../../../../components/TCGroupNameBadge';
import TCFormProgress from '../../../../components/TCFormProgress';

let entity = {};
export default function CreateMemberProfileClubForm3({navigation, route}) {
  const [note, setNote] = useState('');
  const authContext = useContext(AuthContext);
  const [auth, setAuth] = useState({});
  const [loading, setloading] = useState(false);
  const [groups, setGroups] = useState({
    createdAt: 0.0,
    homefield_address_latitude: 0.0,
    follower_count: 0,
    am_i_admin: false,
    homefield_address_longitude: 0.0,
    privacy_profile: 'members',
    allclubmembermannually_sync: true,
    member_count: 0,
    privacy_events: 'everyone',
    privacy_members: 'everyone',
    office_address_latitude: 0.0,
    office_address_longitude: 0.0,
    approval_required: false,
    is_following: false,
    should_hide: false,
    entity_type: '',
    privacy_followers: 'everyone',
    join_type: 'anyone',
    is_joined: false,
  });
  useEffect(() => {
    getAuthEntity();
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => createMember()}>
          Done
        </Text>
      ),
    });
  }, [navigation]);
  // const donePressed = () => {
  //   const noteDetails = { ...route.params.form1, group_member_detail: { group_id: entity.uid, is_admin: groupAdmin }, teams: teamList.map(({ group_id, is_admin, is_member }) => ({ group_id, is_admin, is_member })) }
  //   navigation.navigate('CreateMemberProfileClubForm3', { form2: membersAuthority })
  // }
  const getAuthEntity = async () => {
    entity = authContext.entity;
    setAuth(entity);
    setGroups({...groups, entity_type: entity.role});
  };
  const createMember = () => {
    setloading(true);
    let bodyParams = {};
    if (route.params.form2.full_image) {
      const imageArray = [];

      imageArray.push({path: route.params.form2.full_image});
      uploadImages(imageArray, authContext)
        .then((responses) => {
          const attachments = responses.map((item) => ({
            type: 'image',
            url: item.fullImage,
            thumbnail: item.thumbnail,
          }));

          bodyParams = {
            ...route.params.form2,
            full_image: attachments[0].url,
            thumbnail: attachments[0].thumbnail,
            group: groups,
            group_id: entity.uid,
            note,
          };

          console.log('BODY PARAMS:', bodyParams);
          createProfile(bodyParams);
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    } else {
      bodyParams = {
        ...route.params.form2,
        group: groups,
        group_id: entity.uid,
        note,
      };
      console.log('BODY PARAMS11:', bodyParams);

      createProfile(bodyParams);
    }
  };
  const createProfile = (params) => {
    createMemberProfile(entity.uid, params, authContext)
      .then((response) => {
        setloading(false);
        console.log('Response :', response.payload);

        if (
          response.payload.canConnect === true &&
          response.payload.connected === false
        ) {
          const title = strings.connectMemberProfile;
          navigation.navigate('MemberProfileCreatedScreen', {
            memberObj: response.payload,
            buttonTitle: title,
          });
        } else {
          const title = strings.sendInvite;
          navigation.navigate('MemberProfileCreatedScreen', {
            memberObj: response.payload,
            buttonTitle: title,
          });
        }
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };
  return (
    <ScrollView style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <TCFormProgress totalSteps={3} curruentStep={3} />

      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            margin: 15,
          }}
        >
          <View style={styles.profileView}>
            <Image
              source={images.clubPlaceholder}
              style={styles.profileImage}
            />
          </View>
          <TCGroupNameBadge
            name={((auth || {}).obj || {}).group_name || ''}
            groupType={'club'}
          />
        </View>
        <TCTextField
          value={note}
          height={100}
          multiline={true}
          onChangeText={(text) => setNote(text)}
          placeholder={strings.writeNotesPlaceholder}
          keyboardType={'default'}
        />
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
    resizeMode: 'contain',
    width: 25,
    borderRadius: 50,
  },

  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
});
