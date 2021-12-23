import React, {
  useContext,
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import * as Utility from '../../../utils/index';
import {getUserSettings, saveUserSettings} from '../../../api/Users';
import AuthContext from '../../../auth/context';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import GroupEventItems from '../../../components/Schedule/GroupEvent/GroupEventItems';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import images from '../../../Constants/ImagePath';
import strings from '../../../Constants/String';
import { getUnreadCount } from '../../../api/Notificaitons';

export default function GroupEventScreen({navigation}) {
  const authContext = useContext(AuthContext);
  const [groupsList, setGroupsList] = useState([]);
  const [isAll, setIsAll] = useState(false);

  const [loading, setLoading] = useState(false);

  const onDonePress = useCallback(() => {
    setLoading(true);

    const checkedGroup = groupsList.filter((obj) => obj.isSelected);
    const resultOfIds = checkedGroup.map((obj) => obj.group_id);
    console.log('resultOfIds', resultOfIds);

    if (checkedGroup.length > 0) {
      const params = {
        schedule_group: resultOfIds,
      };
      saveUserSettings(params, authContext)
        .then(async(response) => {
          console.log('After save setting', response);
          await Utility.setStorage('scheduleSetting', response.payload.schedule_group)
          navigation.goBack()
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
          Alert.alert('', e.messages);
        });
    } else {
      Alert.alert('Please select any of the group.');
    }
  }, [authContext, groupsList, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.doneButtonStyle} onPress={() => onDonePress()}>
          Done
        </Text>
      ),
    });
  }, [navigation, onDonePress]);

  useEffect(() => {
    setLoading(true);
    // getGroups(authContext)
    getUnreadCount(authContext)
      .then((response) => {
        const {teams, clubs} = response.payload;

        // const groups = [...teams, ...clubs].map((obj) => ({
        //   ...obj,
        //   isSelected: false,
        // }));

        getUserSettings(authContext).then((setting) => {
          setLoading(false);
          console.log('Settings:=>', setting);
          if (setting?.payload?.user?.schedule_group) {
            const groups = [...teams, ...clubs].map((obj) =>
              setting?.payload?.user?.schedule_group.includes(obj.group_id)
                ? {
                    ...obj,
                    isSelected: true,
                  }
                : {
                    ...obj,
                    isSelected: false,
                  },
            );
            setGroupsList([...groups]);
          }
          // await Utility.setStorage('appSetting', response.payload.app);
        });
      })
      .catch((e) => {
        setLoading(false);
        Alert.alert('', e.messages);
      });
  }, [authContext]);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', async () => {
  //     const allSelectValue = await Utility.getStorage('groupEventValue');
  //     setCheckBoxSelect(allSelectValue);
  //     eventGroupsData.filter(async (event_item) => {
  //       const event_data = event_item;
  //       if (allSelectValue) {
  //         event_data.isSelected = true;
  //         setCheckBoxSelect(true);
  //       } else {
  //         event_data.isSelected = false;
  //         setCheckBoxSelect(false);
  //       }
  //       return null;
  //     });
  //     setEventGroupsData([...eventGroupsData]);
  //   });
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  const renderGroups = ({item, index}) => {
    return (
      <GroupEventItems
        eventImageSource={item.eventImage}
        eventText={item.group_name}
        groupImageSource={item.thumbnail}
        checkBoxImage={
          item.isSelected ? images.checkWhiteLanguage : images.uncheckWhite
        }
        onCheckBoxPress={() => {
          groupsList[index].isSelected = !groupsList[index].isSelected;
          setGroupsList([...groupsList]);
          setIsAll(false);
        }}
      />
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ActivityLoader visible={loading} />
      <Text style={styles.headerTextStyle}>{strings.groupEventTitle}</Text>
      <View style={styles.allStyle}>
        <Text style={styles.titleTextStyle}>{strings.all}</Text>
        <TouchableOpacity
          onPress={() => {
            setIsAll(!isAll);
            const groups = groupsList.map((obj) => ({
              ...obj,
              isSelected: !isAll,
            }));
            setGroupsList([...groups]);
          }}>
          <Image
            source={isAll ? images.checkWhiteLanguage : images.uncheckWhite}
            style={styles.imageStyle}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={[...groupsList]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{height: wp('4%')}} />}
        renderItem={renderGroups}
        keyExtractor={(item, index) => index.toString()}
        style={styles.listStyle}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listStyle: {
    marginBottom: 15,
    marginTop: 15,
  },

  doneButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },
  allStyle: {
    flexDirection: 'row',
    // backgroundColor:'red',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 15,
    marginBottom: 0,
  },
  titleTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: 15,
    marginRight: 15,
  },

  imageStyle: {
    width: 23,
    height: 23,
    resizeMode: 'contain',
    marginRight: 12,
  },

  headerTextStyle: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    margin: 15,
  },
});
