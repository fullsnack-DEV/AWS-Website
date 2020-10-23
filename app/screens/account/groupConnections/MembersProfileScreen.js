import React, {
  useLayoutEffect,
} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import images from '../../../Constants/ImagePath'
import colors from '../../../Constants/Colors'
import fonts from '../../../Constants/Fonts'
import TCProfileView from '../../../components/TCProfileView';
import TCThickDivider from '../../../components/TCThickDivider';
import TCBorderButton from '../../../components/TCBorderButton';
import TCInfoField from '../../../components/TCInfoField';
import strings from '../../../Constants/String';
import TCMessageButton from '../../../components/TCMessageButton';
import TCThinDivider from '../../../components/TCThinDivider';
import GroupMembership from '../../../components/groupConnections/GroupMembership';

export default function MembersProfileScreen({ navigation }) {
  // const [editable, setEditable] = useState(true);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback
          onPress={ () => console.log('3 Dot pressed') }>
          <Image source={ images.vertical3Dot } style={ styles.navigationRightItem } />
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.roleViewContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <TCProfileView/>
            <TouchableWithoutFeedback>
              <Image source={ images.editSection } style={ styles.editImage } />
            </TouchableWithoutFeedback>
          </View>
          <Text style={styles.undatedTimeText} numberOfLines={2}>Joined club on May 9, 2019
            {'\n'}Last updated by Neymar JR on May 9, 2019</Text>
          <TCBorderButton title={strings.connectAccountText} marginTop={20}/>

        </View>
        <TCThickDivider marginTop={20}/>
        <View>

          <View style={styles.sectionEditView}>
            <Text style={styles.basicInfoTitle}>Basic Info</Text>
            <TouchableWithoutFeedback>
              <Image source={ images.editSection } style={ styles.editImage } />
            </TouchableWithoutFeedback>
          </View>
          <TCInfoField title={'E-mail'} value={'van@whitecaps.com'}/>
          <TCInfoField title={'Phone'} value={'+1 (778) 123-4567'}/>
          <TCInfoField title={'Address'} value={'100 E Broadway, Vancouver, BC, Canada'}/>
          <TCInfoField title={'Age'} value={'35'}/>
          <TCInfoField title={'Birthday'} value={'Nov 27, 1988'}/>
          <TCInfoField title={'Gender'} value={'Male'}/>
        </View>
        <TCThickDivider marginTop={20}/>
        <View>
          <View style={styles.sectionEditView}>
            <Text style={styles.basicInfoTitle}>Family</Text>
            <TouchableWithoutFeedback>
              <Image source={ images.editSection } style={ styles.editImage } />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.familyView}>
            <TCProfileView type={'medium'} />
            <TCMessageButton />
          </View>
          <TCThinDivider/>
          <View style={styles.familyView}>
            <TCProfileView type={'medium'} />
            <TCMessageButton title={'Email'} color={colors.googleColor}/>

          </View>
          <TCThinDivider/>
          <View style={styles.familyView}>
            <TCProfileView type={'medium'} />
            <TCMessageButton />
          </View>
        </View>
        <TCThickDivider marginTop={20}/>
        <View>
          <View style={styles.sectionEditView}>
            <Text style={styles.basicInfoTitle}>Membership</Text>
          </View>
          <GroupMembership/>
          <GroupMembership/>

        </View>
        <TCThickDivider marginTop={20}/>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  navigationRightItem: {
    height: 15,
    marginRight: 20,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
    width: 15,
  },
  roleViewContainer: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
    justifyContent: 'space-between',
  },
  undatedTimeText: {
    marginTop: 10,
    fontSize: 12,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    flexShrink: 1,
  },
  basicInfoTitle: {

    fontSize: 20,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  familyView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
  },
  editImage: {
    alignSelf: 'center',
    height: 18,
    resizeMode: 'contain',
    width: 18,
  },
  sectionEditView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 15,
  },
});
