import React, {useState , useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  Platform,
  Dimensions,
  Alert
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import Header from '../../../components/Home/Header';
import colors from '../../../Constants/Colors';
import Verbs from '../../../Constants/Verbs';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import {strings} from '../../../../Localization/translation';
import AuthContext from '../../../auth/context';
import TCThinDivider from '../../../components/TCThinDivider';
import {getGroups, getTeamsOfClub } from '../../../api/Groups';
import * as Utility from '../../../utils/index';
import ChangeOtherListScreen from './ChangeOtherListScreen';
import ChangeSportsOrderScreen from './ChangeSportsOrderScreen';
import {getUserSettings, saveUserSettings} from '../../../api/Users';



export default function ViewEventSettingsScreen({navigation}) {

    const authContext = useContext(AuthContext);
    const sortFilterData = [
        strings.eventFilterNoneTitle,
        strings.eventFilterOrganiserTitle, 
        strings.eventFilterRoleTitle,
        strings.eventFilterSportTitle, 
    ];

    const sortFilterDataClub = [
        strings.eventFilterNoneTitle, 
        strings.eventFilterOrganiserTitle, 
        strings.eventFilterSportTitle
    ];

    const [loading, setLoading] = useState(false);
    const [sortFilterOption, setSortFilterOpetion] = useState(1);
    const [hasGroup, setHasGroup] = useState(false);
    const [hasSports, setHasSports] = useState(true);
    const [hasRole, setHasRole] = useState(false);
    const [registeredSports, setRegisteredSports] = useState([]);
    const [listOfOrganiser, setListOfOrganiser] = useState(false);
    const [listOfSports, setListOfSports] = useState(false)
    const [optionValue, setOptionValue] = useState(1);
    const [userSetting, setUserSetting] = useState();


    useEffect(() => {
        checkHasSports(authContext);
        checkHasRole(authContext);
        getUserSettings(authContext).then((setting) => {
          const eventViewOption = [Verbs.entityTypeClub].includes(authContext.entity.role) ? 
          setting?.payload?.user?.club_event_view_settings_option : setting?.payload?.user?.event_view_settings_option;
          if(eventViewOption) {
            setSortFilterOpetion(eventViewOption)
            setOptionValue(eventViewOption)
          }
          setUserSetting(setting.payload.user);
        });

        if([Verbs.entityTypeClub].includes(authContext.entity.role)) {
          getTeamsOfClub(authContext.entity.uid, authContext)
          .then((response) => {
            checkHasGroup(response);
            setLoading(false);
          })
          .catch((e) => {
            setLoading(false);
            Alert.alert(strings.townsCupTitle, e.message);
          });
        }else{
          getGroups(authContext)
          .then((response) => {
              checkHasGroup(response);
              setLoading(false);
          })
          .catch((e) => {
            setLoading(false);
            Alert.alert(strings.townsCupTitle, e.message);
          });
        }
    }, [authContext, hasGroup, hasSports, hasRole ]);



    // Check user has any role
    const checkHasRole = () => {
      let role = false;

      // Check if role contains referee
      if(authContext?.entity?.obj?.referee_data) {
        role = true;
      }

      // Check if role contains scorekeeper
      if(authContext?.entity?.obj?.scorekeeper_data) {
        role = true
      }

      // Check if user has any registered sport
      if(authContext?.entity?.obj?.registered_sports) {
        role = true
      }

      setHasRole(role)
    }



    // Check user belong to any group 
    const checkHasGroup = (data) =>{
      if([Verbs.entityTypeClub].includes(authContext.entity.role)) {
        if(data.payload && data.payload.length > 0) {
          setHasGroup(true);
        }else{
          setHasGroup(true);
        }
      }else if(Object.entries(data.payload).length > 0) {
          const group = data.payload?.teams.length + data?.payload?.clubs.length
          if(group > 0) {
              setHasGroup(true);
          }
      }else{
          setHasGroup(true);
      }
    }

   

    // Check user has any registered sports
    const checkHasSports = () => {
        if([Verbs.entityTypeClub].includes(authContext.entity.role)) {
            const res = authContext?.entity?.obj?.sports.map((obj) =>  ({
                sport: obj.sport 
            }));

            const data = Utility.uniqueArray(res, Verbs.sportType);
            if(data.length === 0) {
                setHasSports(false);
            }
            setRegisteredSports(data);
        }else{
            const sportsList = [
                ...(authContext?.entity?.obj?.registered_sports?.filter(
                (obj) => obj.is_active,
                ) || []),
                ...(authContext?.entity?.obj?.referee_data?.filter(
                (obj) => obj.is_active,
                ) || []),
                ...(authContext?.entity?.obj?.scorekeeper_data?.filter(
                (obj) => obj.is_active,
                ) || []),
            ];
            const res = sportsList.map((obj) => ({
                sport: obj.sport,
            }));
            const data = Utility.uniqueArray(res, Verbs.sportType);
            if(data.length === 0) {
              setHasSports(false);
            }
            setRegisteredSports(data);
        }
    }


    const renderSortFilterOpetions = ({index, item}) => {

        if(item === strings.eventFilterSportTitle && !hasSports) {
          return null;
        }

        if(item === strings.eventFilterRoleTitle && !hasRole) {
          return null;
        }
    
        return (
            <View
            style={{
                flexDirection: 'row',
                marginBottom: 15,
                justifyContent: 'space-between',
                marginLeft: 15,
                marginRight: 15,
            }}>
            <View>
                <Text style={styles.filterTitle}>{item}</Text>
                {item === strings.eventFilterSportTitle &&
                sortFilterOption === index && registeredSports.length > 1 &&
                (
                    <Text
                    style={styles.changeOrderStyle}
                    onPress={() => {
                      setListOfSports(true)
                    }}>
                    {strings.changeListOfSport} 
                    </Text>
                )}

                {item === strings.eventFilterOrganiserTitle  &&
                sortFilterOption === index && hasGroup &&
                (
                    <Text
                    style={styles.changeOrderStyle}
                    onPress={() => {
                      setListOfOrganiser(true)
                    }}>
                    {strings.chnageListOfOrganizer}
                    </Text>
                )}
            </View>
            <TouchableOpacity
                onPress={() => {
                setSortFilterOpetion(index);
                setOptionValue(index)
                }}>
                <Image
                source={
                    sortFilterOption === index
                    ? images.radioRoundOrange
                    : images.radioUnselect
                }
                style={styles.radioButtonStyle}
                />
            </TouchableOpacity>
            </View>
        )
    };
    

    const onDonePress = () => {
      setLoading(true)
      let params;
      if([Verbs.entityTypeClub].includes(authContext.entity.role)) {
        params = {
          ...userSetting,
          club_event_view_settings_option : optionValue,
        };
      }else{
        params = {
          ...userSetting,
          event_view_settings_option : optionValue,
        };
      }
      saveUserSettings(params, authContext)
      .then(async () => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    }

    return (
    <>
    <View
      style={styles.mainContainerStyle}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <ActivityLoader visible={loading} />
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTextStyle}>{strings.eventsViewSettings}</Text>
        }
        rightComponent={
          <TouchableOpacity
            style={{padding: 2}}
            onPress={async() =>  {
              await onDonePress()
              navigation.navigate('ScheduleScreen', {
                refresh : Date.now(),
                optionValue
              });
            }}>
            <Text style={{fontFamily: fonts.RMedium, fontSize: 16}}>
              {strings.save}
            </Text>
          </TouchableOpacity>
        }
      />
      <SafeAreaView>
        {[
            Verbs.entityTypeUser,
            Verbs.entityTypePlayer,
            Verbs.entityTypeClub,
        ].includes(authContext.entity.role) && (
        <View>
            <TCThinDivider width={'100%'} marginBottom={15} />
            <View>
                <Text style={styles.titleText}>{strings.sortBy}</Text>
                <FlatList
                data={
                    [Verbs.entityTypeClub].includes(authContext.entity.role)
                    ? sortFilterDataClub
                    : sortFilterData
                }
                renderItem={renderSortFilterOpetions}
                style={{marginTop: 15}}
                />
            </View>
        </View>
        )}
      </SafeAreaView>
    </View>

    
    <Modal
      isVisible={listOfOrganiser}
      backdropColor="black"
      style={{margin: 0, justifyContent: 'flex-end'}}
      hasBackdrop
      onBackdropPress={() => {
        setListOfOrganiser(false);
       
      }}
      backdropOpacity={0.5}
    >
      <View
        style={[
          styles.bottomPopupContainer,
          {height: Dimensions.get('window').height - 50},
        ]}
      >
          <ChangeOtherListScreen 
          closeBtn={setListOfOrganiser}
          userSetting={userSetting} 
          setUserSetting={setUserSetting}
          />
      </View>
    </Modal>

    {/* change list of sports modal */}
    <Modal
      isVisible={listOfSports}
      backdropColor="black"
      style={{margin: 0, justifyContent: 'flex-end'}}
      hasBackdrop
      onBackdropPress={() => {
        setListOfSports(false);
      }}
      backdropOpacity={0.5}
    >
      <View
        style={[
          styles.bottomPopupContainer,
          {height: Dimensions.get('window').height - 50},
        ]}
      >
          <ChangeSportsOrderScreen 
          closeBtn={setListOfSports} 
          userSetting={userSetting} 
          setUserSetting={setUserSetting}
          />
      </View>
    </Modal>
    </>
    );
}

const styles = StyleSheet.create({
  bottomPopupContainer: {
    paddingBottom: Platform.OS === 'ios' ? 30 : 0,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: colors.googleColor,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  mainContainerStyle: {
    flex: 1,
  },
  backImageStyle: {
    height: 20,
    width: 16,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  eventTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
  titleText: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    marginLeft: 15,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },
  changeOrderStyle: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.themeColor,
    textDecorationLine: 'underline',
    marginLeft: 20,
  },
  radioButtonStyle: {
    height: 22,
    width: 22,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
});
