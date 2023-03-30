// @flow
import React, {useState} from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

import images from '../../Constants/ImagePath';

import {strings} from '../../../Localization/translation';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

import TCFollowerList from '../TCFollowerList';
import TCThinDivider from '../TCThinDivider';

const MemberListModal = ({
  isVisible,
  closeList = () => {},
  sportsList = [],
  onNext = () => {},
  onItemPress = () => {},
  sport = null,
  title = '',
}) => {
  const [follower, setFollower] = useState();

  const [followersSelection, setFollowersSelection] = useState();

  const renderFollowers = ({item}) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        onItemPress();
        setFollowersSelection(item.user_id);

        setFollower(item);
      }}>
      <View
        style={{
          // padding: 20,
          paddingVertical: 15,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          // backgroundColor: 'red',
          marginLeft: 20,
          marginRight: 30,
        }}>
        <TCFollowerList
          type={'medium'}
          name={item.full_name}
          location={item.city}
          image={
            item?.thumbnail ? {uri: item.thumbnail} : images.profilePlaceHolder
          }
        />
        <View style={styles.checkbox}>
          {followersSelection === item.user_id ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.parent}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={{flex: 1}}>
              <Pressable style={{width: 26, height: 26}} onPress={closeList}>
                <Image source={images.crossImage} style={styles.image} />
              </Pressable>
            </View>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>
                {sport?.sport ? strings.sportTextTitle : title}
              </Text>
            </View>
            <Pressable
              style={styles.buttonContainer}
              onPress={() => {
                onNext(follower);
              }}>
              <Text style={styles.buttonText}>
                {sport?.sport ? strings.apply : strings.next}
              </Text>
            </Pressable>
          </View>
          <View style={styles.divider} />
          <View style={styles.container}>
            <Text style={styles.title}>
              {strings.whoDoYouwantToCreateTeamWith}
            </Text>
            <View>
              <FlatList
                ItemSeparatorComponent={() => <TCThinDivider />}
                data={sportsList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderFollowers}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MemberListModal;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: colors.modalBackgroundColor,
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: colors.whiteColor,
    height: Dimensions.get('window').height - 50,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: colors.shadowColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 15,
  },
  headerRow: {
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 17,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RBold,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  divider: {
    height: 1,
    backgroundColor: colors.grayBackgroundColor,
  },
  container: {
    paddingVertical: 20,
    flex: 1,
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RMedium,
    marginBottom: 7,
    marginLeft: 30,
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },

  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
