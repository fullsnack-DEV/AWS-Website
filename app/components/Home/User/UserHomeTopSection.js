/* eslint-disable consistent-return */
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useContext,
  // useState,
} from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import strings from '../../../Constants/String';
import TCEditHeader from '../../TCEditHeader';
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
let sportsData = [];
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

  Utility.getStorage('sportsList').then((list) => {
    console.log('list:=>>', list);
    sportsData = list;
  });
  Utility.getStorage('appSetting').then((setting) => {
    console.log('APPSETTING:=', setting);
    image_url = setting.base_url_sporticon;
  });

  useEffect(() => {
    isSectionEnable();
  }, []);

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

  const oneLineSection = () => {
    console.log('authContext::=>>', authContext.entity.obj.sport_setting);
    if (authContext?.entity?.obj?.sport_setting?.activity_order?.length > 0) {
      return [
        ...(authContext?.entity?.obj?.sport_setting?.activity_order ?? []),
        { sport_name: strings.addrole, item_type: EntityStatus.addNew },
      ];
    }
    return [
      ...(authContext?.entity?.obj?.registered_sports ?? []),
      ...(authContext?.entity?.obj?.referee_data ?? []),
      ...(authContext?.entity?.obj?.scorekeeper_data ?? []),
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

  const renderPlayIn = ({ item }) => {
    if (item.item_type) {
      return renderAddPlayInRole({ item });
    }

    return (
      <UserInfoPlaysInItem
        title={item.sport_name}
        totalGames={item.totalGames}
        thumbURL={
          item?.type
            ? {
                uri: `${image_url}${getSportImage(item.sport_name, item.type)}`,
              }
            : images.addRole
        }
        onPlayInPress={() => {
          if (onPlayInPress) onPlayInPress(item);
        }}
      />
    );
  };

  const renderRefereesIn = useCallback(
    ({ item }) => {
      if (item.item_type) {
        return renderAddRefereeRole({ item });
      }

      return (
        <UserInfoRefereesInItem
          title={item.sport_name}
          thumbURL={
            item?.type
              ? {
                  uri: `${image_url}${getSportImage(
                    item.sport_name,
                    item.type,
                  )}`,
                }
              : images.addRole
          }
          onRefereesInPress={() => {
            if (onRefereesInPress) onRefereesInPress(item);
          }}
        />
      );
    },
    [onRefereesInPress],
  );

  const renderScorekeeperIn = useCallback(
    ({ item }) => {
      if (item.item_type) {
        return renderAddScorekeeperRole({ item });
      }

      return (
        <UserInfoScorekeeperInItem
          title={item.sport_name}
          thumbURL={
            item?.type
              ? {
                  uri: `${image_url}${getSportImage(
                    item.sport_name,
                    item.type,
                  )}`,
                }
              : images.addRole
          }
          onRefereesInPress={() => {
            if (onScorekeeperInPress) onScorekeeperInPress(item);
          }}
        />
      );
    },
    [onScorekeeperInPress],
  );

  const renderAddRefereeRole = useCallback(
    ({ item }) => {
      if (isAdmin) {
        return (
          <UserInfoAddRole
            title={item.sport_name}
            thumbURL={images.addRole}
            onPress={() => {
              if (onRefereesInPress) onRefereesInPress();
            }}
          />
        );
      }
      return null;
    },
    [isAdmin, onRefereesInPress],
  );

  const renderAddScorekeeperRole = useCallback(
    ({ item }) => {
      if (isAdmin) {
        return (
          <UserInfoAddRole
            title={item.sport_name}
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
    [isAdmin, onScorekeeperInPress],
  );

  const renderAddPlayInRole = useCallback(
    ({ item }) => {
      if (isAdmin) {
        return (
          <UserInfoAddRole
            title={item.sport_name}
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
    [isAdmin, onPlayInPress],
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  // eslint-disable-next-line no-unused-vars
  const renderPlayInGames = useMemo(
    () => userDetails?.games?.length > 0 && (
      <View>
        <View style={[styles.sectionStyle, { marginHorizontal: 0 }]}>
          <TCEditHeader
              containerStyle={{ marginHorizontal: 15 }}
              title={strings.playin}
            />
          <FlatList
              style={{ marginTop: 10, marginBottom: 0 }}
              data={[
                ...userDetails.games,
                {
                  sport_name: strings.addPlaying,
                  item_type: EntityStatus.addNew,
                },
              ]}
              horizontal
              renderItem={renderPlayIn}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
            />
        </View>
      </View>
      ),
    [userDetails.games],
  );

  const getSportImage = (sportName, type) => {
    if (
      sportsData.filter(
        (obj) => obj.sport_name.toLowerCase() === sportName.toLowerCase(),
      ).length > 0
    ) {
      const tempObj = sportsData.filter(
        (obj) => obj.sport_name.toLowerCase() === sportName.toLowerCase(),
      )[0];

      if (type === 'player') return tempObj.player_image;
      if (type === 'referee') return tempObj.referee_image;
      if (type === 'scorekeeper') return tempObj.scorekeeper_image;
    }
    return null;
  };
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
