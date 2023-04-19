// @flow
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import images from '../../Constants/ImagePath';

import {strings} from '../../../Localization/translation';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

import TCFollowerList from '../TCFollowerList';
import TCThinDivider from '../TCThinDivider';
import ActivityLoader from '../loader/ActivityLoader';
import CustomIosAlert from '../CustomIosAlert';
import TCSearchBox from '../TCSearchBox';

import CustomModalWrapper from '../CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';

const MemberListModal = ({
  isVisible,
  closeList = () => {},
  sportsList = [],
  onNext = () => {},
  onItemPress = () => {},
  sport = null,
  title = '',
  loading = false,
  visibleAlert = false,
  onGoBack = () => {},
  titleAlert = '',
  onCancetTerminationPress = () => {},
}) => {
  const [follower, setFollower] = useState();
  const [players, Setplayers] = useState(sportsList);

  const [followersSelection, setFollowersSelection] = useState();
  const isFocused = useIsFocused();

  useEffect(() => {
    setFollowersSelection('');
    Setplayers(sportsList);
  }, [isFocused, isVisible]);

  const renderFollowers = ({item}) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        onItemPress(item);
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

  const searchFilterFunction = (text) => {
    const result = sportsList.filter(
      (x) =>
        x.first_name.toLowerCase().includes(text.toLowerCase()) ||
        x.last_name.toLowerCase().includes(text.toLowerCase()),
    );
    if (text.length > 0) {
      Setplayers(result);
    } else {
      Setplayers(sportsList);
    }
  };

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={closeList}
      modalType={ModalTypes.style1}
      onRightButtonPress={() => onNext(follower)}
      headerRightButtonText={strings.next}
      title={sport?.sport ? strings.sportTextTitle : title}
      containerStyle={{padding: 0, flex: 1}}
      showBackButton>
      <CustomIosAlert
        visibleAlert={visibleAlert}
        onGoBack={onGoBack}
        alertTitle={titleAlert}
        onCancetTerminationPress={onCancetTerminationPress}
      />

      <ActivityLoader visible={loading} />

      <View style={styles.card}>
        <View style={styles.divider} />
        <View style={styles.container}>
          <Text style={styles.title}>
            {strings.whoDoYouwantToCreateTeamWith}
          </Text>

          <View
            style={{
              alignSelf: 'center',
              marginTop: 15,
              marginBottom: 25,
            }}>
            <TCSearchBox
              onChangeText={(text) => searchFilterFunction(text)}
              placeholderText={strings.searchText}
              style={{
                height: 40,
              }}
            />
          </View>

          <FlatList
            extraData={players}
            ItemSeparatorComponent={() => <TCThinDivider />}
            data={players}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderFollowers}
          />
        </View>
      </View>
    </CustomModalWrapper>
  );
};

export default MemberListModal;

const styles = StyleSheet.create({
  card: {
    flex: 1,
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

// <View style={styles.headerRow}>
// <View style={{flex: 1}}>
//   <Pressable style={{width: 26, height: 26}} onPress={closeList}>
//     <Image source={images.backArrow} style={styles.image} />
//   </Pressable>
// </View>
// <View style={styles.headerTitleContainer}>
//   <Text style={styles.headerTitle}>
//     {sport?.sport ? strings.sportTextTitle : title}
//   </Text>
// </View>
// <Pressable
//   style={styles.buttonContainer}
//   onPress={() => {
//     onNext(follower);
//   }}>
//   <Text style={styles.buttonText}>
//     {sport?.sport ? strings.apply : strings.next}
//   </Text>
// </Pressable>
// </View>
