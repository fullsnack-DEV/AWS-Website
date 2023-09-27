import {
  Text,
  View,
  Alert,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
} from 'react-native';
import React, {useMemo, useState, useContext, useEffect} from 'react';
import {format} from 'react-string-format';
import {useNavigation} from '@react-navigation/native';

// eslint-disable-next-line import/no-extraneous-dependencies
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import colors from '../../Constants/Colors';
import AuthContext from '../../auth/context';
import {getGroupFollowers} from '../../api/Groups';
import {strings} from '../../../Localization/translation';
import fonts from '../../Constants/Fonts';
import TCNoDataView from '../../components/TCNoDataView';

import Verbs from '../../Constants/Verbs';
import GroupIcon from '../../components/GroupIcon';
import {displayLocation} from '../../utils';
import UserListShimmer from '../../components/shimmer/commonComponents/UserListShimmer';
import images from '../../Constants/ImagePath';

const renderBackdrop = (props) => (
  <BottomSheetBackdrop
    {...props}
    disappearsOnIndex={-1}
    appearsOnIndex={1}
    style={{
      backgroundColor: colors.modalBackgroundColor,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      height: '99%',
    }}
    opacity={6}
  />
);

export default function FollowFollowingModal({
  visibleMemberModal,
  followModalRef,
  closeModal,
  groupID,
}) {
  const snapPoints = useMemo(() => ['95%', '95%'], []);
  const [loading, setLoading] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const authContext = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    fetchList(groupID);
  }, [groupID, visibleMemberModal]);

  const fetchList = (groupId) => {
    setLoading(true);
    getGroupFollowers(groupId, authContext)
      .then((res) => {
        setFollowersList([...res.payload]);

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        Alert.alert(strings.alertmessagetitle, err.message);
      });
  };

  const renderList = () => {
    if (followersList.length > 0) {
      const filteredList = followersList.filter((item) => {
        const itemName = item.group_name ?? item.full_name;
        return itemName.toLowerCase().includes(searchQuery.toLowerCase());
      });
      return (
        <FlatList
          data={filteredList}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <>
              <View style={[styles.row, {justifyContent: 'space-between'}]}>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    navigation.navigate('HomeScreen', {
                      uid: item.user_id ?? item.group_id,
                      role: item.entity_type,
                    });
                  }}>
                  <GroupIcon
                    imageUrl={item.full_image}
                    entityType={Verbs.entityTypePlayer}
                    containerStyle={styles.iconContainer}
                  />
                  <View style={{marginLeft: 10}}>
                    <Text style={styles.userName}>
                      {item.group_name ?? item.full_name}
                    </Text>
                    <Text style={styles.locationText}>
                      {displayLocation(item)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.separator} />
            </>
          )}
        />
      );
    }

    return (
      <View style={{flex: 1}}>
        <TCNoDataView
          title={format(strings.noTabsFoundText_dy, Verbs.privacyTypeFollowers)}
        />
      </View>
    );
  };

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        onDismiss={closeModal}
        ref={followModalRef}
        backgroundStyle={{
          borderRadius: 10,
        }}
        index={1}
        handleIndicatorStyle={{
          backgroundColor: colors.modalHandleColor,
          width: 40,
          height: 5,
          marginTop: 5,
          alignSelf: 'center',
          borderRadius: 5,
        }}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableDismissOnClose
        backdropComponent={renderBackdrop}>
        <View style={{flex: 1, paddingHorizontal: 15}}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholderTextColor={colors.userPostTimeColor}
              style={styles.textInputStyle}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={strings.searchText}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                }}>
                <Image
                  source={images.closeRound}
                  style={{height: 15, width: 15}}
                />
              </TouchableOpacity>
            )}
          </View>

          {loading ? <UserListShimmer /> : renderList()}
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderWidth: 0,
  },
  userName: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  locationText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },

  separator: {
    height: 1,
    marginVertical: 15,
    backgroundColor: colors.grayBackgroundColor,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: colors.inputBgOpacityColor,
    height: 45,
    marginBottom: 20,
    marginTop: 15,
  },
  textInputStyle: {
    flex: 1,
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    padding: 0,
  },
});
