import React, {
  useState, useLayoutEffect, useRef,
} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,

} from 'react-native';
import ActionSheet from 'react-native-actionsheet';

import UserRoleView from '../../../components/groupConnections/UserRoleView';

import TCScrollableTabs from '../../../components/TCScrollableTabs';
import TCSearchBox from '../../../components/TCSearchBox';

import images from '../../../Constants/ImagePath'
import colors from '../../../Constants/Colors'

export default function GroupMembersScreen({ navigation }) {
  const actionSheet = useRef();
  const actionSheetInvite = useRef();
  const [searchText, setSearchText] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback
          onPress={ () => actionSheet.current.show() }>
          <Image source={ images.horizontal3Dot } style={ styles.navigationRightItem } />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);
  return (
    <View style={styles.mainContainer}>

      <TCScrollableTabs>
        <View tabLabel='Members' style={{ flex: 1 }}>
          <View style={styles.searchBarView}>
            <TCSearchBox value={searchText} onChangeText={(text) => setSearchText(text)}/>
            <Image source={ images.filterIcon } style={ styles.filterImage } />
          </View>

          <UserRoleView onPressProfile = {() => navigation.navigate('MembersProfileScreen')}/>
          <UserRoleView/>
          <UserRoleView/>
          <UserRoleView/>

        </View>
        <View tabLabel='Followers' style={{ flex: 1 }}></View>
      </TCScrollableTabs>
      <ActionSheet
                ref={actionSheet}
                // title={'News Feed Post'}
                options={['Group Message', 'Invite Member', 'Create Member Profile', 'Connect Member Account', 'Privacy Setting', 'Setting', 'Cancel']}
                cancelButtonIndex={6}
                // destructiveButtonIndex={1}
                onPress={(index) => {
                  if (index === 0) {
                    console.log('Pressed sheet :', index);
                  } else if (index === 1) {
                    actionSheetInvite.current.show();
                  } else if (index === 2) {
                    console.log('Pressed sheet :', index);
                  } else if (index === 3) {
                    console.log('Pressed sheet :', index);
                  } else if (index === 4) {
                    console.log('Pressed sheet :', index);
                  } else if (index === 5) {
                    console.log('Pressed sheet :', index);
                  }
                }}
              />
      <ActionSheet
                ref={actionSheetInvite}
                // title={'News Feed Post'}
                options={['Invite by Search', 'Invite by E-mail', 'Cancel']}
                cancelButtonIndex={2}
                // destructiveButtonIndex={1}
                onPress={(index) => {
                  if (index === 0) {
                    console.log('Pressed sheet :', index);
                  } else if (index === 1) {
                    console.log('Pressed sheet :', index);
                  }
                }}
              />
    </View>
  );
}
const styles = StyleSheet.create({

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  filterImage: {
    marginLeft: 10,
    alignSelf: 'center',
    height: 25,
    resizeMode: 'contain',
    width: 25,
  },
  searchBarView: {
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 20,
  },
  navigationRightItem: {
    height: 15,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 15,
  },
});
