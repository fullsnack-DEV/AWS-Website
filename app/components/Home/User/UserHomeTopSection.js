/* eslint-disable consistent-return */
import React, {
  memo,
  useCallback,
  useEffect,
  useContext,
  // useState,
} from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import strings from '../../../Constants/String';
import AuthContext from '../../../auth/context';
import * as Utility from '../../../utils';

import colors from '../../../Constants/Colors';
import images from '../../../Constants/ImagePath';
import UserInfoPlaysInItem from './UserInfoPlaysInItem';
import UserInfoRefereesInItem from './UserInfoRefereesInItem';

import UserInfoAddRole from './UserInfoAddRole';
import UserInfoScorekeeperInItem from './UserInfoScorekeeperInItem';
import EntityStatus from '../../../Constants/GeneralConstants';

let image_url = '';
const UserHomeTopSection = ({
  userDetails,
  isAdmin,
  onRefereesInPress,
  onScorekeeperInPress,
  onPlayInPress,
  onAddRolePress,
}) => {
  const authContext = useContext(AuthContext);
  console.log('authContext:=>>', authContext);

  // const [activityList] = useState(
  //   authContext?.entity?.obj?.sport_setting?.activity_order || [
  //     ...(authContext?.entity?.obj?.registered_sports || []),
  //     ...(authContext?.entity?.obj?.referee_data || []),
  //     ...(authContext?.entity?.obj?.scorekeeper_data || []),
  //   ],
  // );

 

  const isSectionEnable = useCallback(() => {
    const gameLength = userDetails?.games?.length ?? 0;
    const refereeLength = userDetails?.referee_data?.length ?? 0;
    const scorekeeperLength = userDetails?.scorekeeper_data?.length ?? 0;
    const totalLength = gameLength + refereeLength + scorekeeperLength;

    if (totalLength > 500) return true;
    return false;
  }, [
    userDetails?.games,
    userDetails?.referee_data,
    userDetails?.scorekeeper_data,
  ]);


  Utility.getStorage('appSetting').then((setting) => {
     
    image_url = setting.base_url_sporticon;
    console.log('APPSETTING:= top', setting.base_url_sporticon);
    
  });
  useEffect(() => {
    
      isSectionEnable();

   
  }, [isSectionEnable]);

  
  const oneLineSection = () => {
    console.log('userDetails::=>>', userDetails);
    if (userDetails?.sport_setting?.activity_order?.length > 0) {
      return [
        ...(userDetails?.sport_setting?.activity_order ?? []),
        { sport_name: strings.addrole, item_type: EntityStatus.addNew },
      ];
    }
    return [
      ...(userDetails?.registered_sports?.filter((obj) => obj.is_published) ?? []),
      ...(userDetails?.referee_data?.filter((obj) => obj.is_published) ?? []),
      ...(userDetails?.scorekeeper_data?.filter((obj) => obj.is_published) ?? []),
      { sport_name: strings.addrole, item_type: EntityStatus.addNew },
    ];
  };

  const renderAddRole = useCallback(() => {
    if (isAdmin) {
      return (
        <UserInfoAddRole
          title={strings.addrole}
          thumbURL={images.addRole}
          onPress={() => {
            if (onAddRolePress) onAddRolePress();
          }}
        />
      );
    }
    return null;
  }, [isAdmin, onAddRolePress]);

  const renderUserRole = useCallback(({ item }) => {
    if (item?.item_type === EntityStatus.addNew) {
      return renderAddRole();
    }
    if (item?.type === EntityStatus.playin) {
      return renderPlayIn({ item });
    }
    if (item?.type === EntityStatus.refereein) {
      return renderRefereesIn({ item });
    }
    if (item?.type === EntityStatus.scorekeeperin) {
      return renderScorekeeperIn({ item });
    }
  }, []);

  const renderPlayIn = useCallback(({ item }) => {
    console.log('OKOK player:=>',image_url);
    if (item.item_type) {
      return renderAddPlayInRole({ item });
    }
    return (
      <UserInfoPlaysInItem
        title={Utility.getSportName(item, authContext)}
        totalGames={item.totalGames}
        thumbURL={
          item?.type
            ? {
                uri: image_url + Utility.getSportImage(item.sport, item.type, authContext),
              }
            : images.addRole
        }
        onPlayInPress={() => {
          if (onPlayInPress) onPlayInPress(item);
        }}
      />
    );
  },[authContext, onPlayInPress]);

  const renderRefereesIn = useCallback(
    ({ item }) => {
      console.log('OKOK referee:=>',image_url + Utility.getSportImage(
        item.sport,
        'referee',
        authContext,
      ));
      if (item.item_type) {
        return renderAddRefereeRole({ item });
      }

      return (
        <UserInfoRefereesInItem
          title={Utility.getSportName(item, authContext)}
          thumbURL={
            item?.type
              ? {
                  uri: image_url + Utility.getSportImage(
                    item.sport,
                    item.type,
                    authContext,
                  ),
                }
              : images.addRole
          }
          onRefereesInPress={() => {
            if (onRefereesInPress) onRefereesInPress(item);
          }}
        />
      );
    },
    [authContext, onRefereesInPress],
  );

  const renderScorekeeperIn = useCallback(
    ({ item }) => {
      if (item.item_type) {
        return renderAddScorekeeperRole({ item });
      }

      return (
        <UserInfoScorekeeperInItem
          title={Utility.getSportName(item, authContext)}
          thumbURL={
            item?.type
              ? {
                  uri: image_url + Utility.getSportImage(
                    item.sport,
                    item.type,
                    authContext,
                  ),
                }
              : images.addRole
          }
          onRefereesInPress={() => {
            if (onScorekeeperInPress) onScorekeeperInPress(item);
          }}
        />
      );
    },
    [authContext, onScorekeeperInPress],
  );

  const renderAddRefereeRole = useCallback(
    ({ item }) => {
      if (isAdmin) {
        return (
          <UserInfoAddRole
            title={Utility.getSportName(item, authContext)}
            thumbURL={images.addRole}
            onPress={() => {
              if (onRefereesInPress) onRefereesInPress();
            }}
          />
        );
      }
      return null;
    },
    [authContext, isAdmin, onRefereesInPress],
  );

  const renderAddScorekeeperRole = useCallback(
    ({ item }) => {
      if (isAdmin) {
        return (
          <UserInfoAddRole
            title={Utility.getSportName(item, authContext)}
            thumbURL={images.addRole}
            onPress={() => {
              if (onScorekeeperInPress) {
                onScorekeeperInPress();
              }
            }}
          />
        );
      }
      return null;
    },
    [authContext, isAdmin, onScorekeeperInPress],
  );

  const renderAddPlayInRole = useCallback(
    ({ item }) => {
      if (isAdmin) {
        return (
          <UserInfoAddRole
            title={Utility.getSportName(item, authContext)}
            thumbURL={images.addRole}
            onPress={() => {
              if (onPlayInPress) {
                onPlayInPress();
              }
            }}
          />
        );
      }
      return null;
    },
    [authContext, isAdmin, onPlayInPress],
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  return (
    <View style={{ paddingTop: 20, paddingBottom: 20 }}>
      <View style={[styles.sectionStyle, { marginHorizontal: 0 }]}>
        {/* <FlatList
            style={{ marginTop: 10, marginBottom: 0 }}
            data={oneLineSection}
            horizontal
            renderItem={renderUserRole}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
          /> */}
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={oneLineSection()}
          keyExtractor={keyExtractor}
          renderItem={renderUserRole}
          // renderItem={({ item }) => (
          //   <UserInfoAddRole
          //     title={item.sport_name}
          //     thumbURL={
          //       item?.type
          //         ? {
          //             uri: `${image_url}${getSportImage(
          //               item.sport_name,
          //               item.type,
          //             )}`,
          //           }
          //         : images.addRole
          //     }
          //     // || (item.type === 'player' && onPlayInPress(item)) || (item.type === 'referee' && onRefereesInPress(item)) || (item.type === 'scorekeeper' && onScorekeeperInPress(item))
          //     // onPress={() => ((!item?.type && onAddRolePress) || (item.type === 'player' && onPlayInPress({ item })) || (item.type === 'referee' && onRefereesInPress({ item })) || (item.type === 'scorekeeper' && onScorekeeperInPress({ item }))) }
          //   />
          // )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionStyle: {
    flex: 1,
    marginBottom: 0,
    marginHorizontal: 15,
    backgroundColor: colors.whiteColor,
  },
});

export default memo(UserHomeTopSection);
