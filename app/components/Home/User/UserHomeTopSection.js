/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
import React, {
  memo,
  useCallback,
  useEffect,
  useContext,
  // useState,
} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {strings} from '../../../../Localization/translation';
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
  onMoreRolePress,
}) => {
  const authContext = useContext(AuthContext);
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

  useEffect(() => {
    image_url = global.sport_icon_baseurl;
    isSectionEnable();
  }, [isSectionEnable]);

  const oneLineSection = () => {
    if (
      userDetails?.sport_setting?.activity_order &&
      userDetails?.sport_setting?.activity_order?.length > 0
    ) {
      if (isAdmin) {
        return [
          ...(userDetails?.sport_setting?.activity_order.filter(
            (obj) => obj.is_active === true,
          ) ?? []),
        ];
      }
      return [
        ...(userDetails?.sport_setting?.activity_order.filter(
          (obj) =>
            (!('is_hide' in obj) || obj?.is_hide === false) &&
            obj.is_active === true,
        ) ?? []),
      ];
    }
    return [
      ...(userDetails?.registered_sports?.filter(
        (obj) =>
          obj.is_published &&
          (obj?.is_active === true || !('is_active' in obj)),
      ) ?? []),
      ...(userDetails?.referee_data?.filter(
        (obj) =>
          obj.is_published &&
          (obj?.is_active === true || !('is_active' in obj)),
      ) ?? []),
      ...(userDetails?.scorekeeper_data?.filter(
        (obj) =>
          obj.is_published &&
          (obj?.is_active === true || !('is_active' in obj)),
      ) ?? []),
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

  const renderMoreRole = useCallback(() => {
    if (isAdmin) {
      return (
        <UserInfoAddRole
          title={strings.moreText}
          thumbURL={images.moreIcon}
          onPress={() => {
            if (onMoreRolePress) onMoreRolePress();
          }}
        />
      );
    }
    return null;
  }, [isAdmin, onMoreRolePress]);

  const renderUserRole = useCallback(({item}) => {
    if (item?.item_type === EntityStatus.addNew) {
      return renderAddRole();
    }
    if (item?.item_type === EntityStatus.moreActivity) {
      return renderMoreRole();
    }
    if (item?.type === EntityStatus.playin) {
      return renderPlayIn({item});
    }
    if (item?.type === EntityStatus.refereein) {
      return renderRefereesIn({item});
    }
    if (item?.type === EntityStatus.scorekeeperin) {
      return renderScorekeeperIn({item});
    }
  }, []);

  const renderPlayIn = useCallback(
    ({item}) => {
      if (item.item_type) {
        return renderAddPlayInRole({item});
      }
      return (
        <UserInfoPlaysInItem
          isOpacity={isAdmin ? item?.is_hide : false}
          title={Utility.getSportName(item, authContext)}
          totalGames={item.totalGames}
          thumbURL={
            item?.type
              ? {
                  uri:
                    image_url +
                    Utility.getSportImage(item.sport, item.type, authContext),
                }
              : images.addRole
          }
          onPlayInPress={() => {
            if (onPlayInPress) onPlayInPress(item);
          }}
        />
      );
    },
    [authContext, onPlayInPress],
  );

  const renderRefereesIn = useCallback(
    ({item}) => {
      if (item.item_type) {
        return renderAddRefereeRole({item});
      }

      return (
        <UserInfoRefereesInItem
          isOpacity={isAdmin ? item?.is_hide : false}
          title={Utility.firstLetterCapital(item.sport)}
          thumbURL={
            item?.type
              ? {
                  uri:
                    image_url +
                    Utility.getSportImage(item.sport, item.type, authContext),
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
    ({item}) => {
      if (item.item_type) {
        return renderAddScorekeeperRole({item});
      }

      return (
        <UserInfoScorekeeperInItem
          isOpacity={isAdmin ? item?.is_hide : false}
          title={Utility.firstLetterCapital(item.sport)}
          thumbURL={
            item?.type
              ? {
                  uri:
                    image_url +
                    Utility.getSportImage(item.sport, item.type, authContext),
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
    ({item}) => {
      if (isAdmin) {
        return (
          <UserInfoAddRole
            isOpacity={isAdmin ? item?.is_hide : false}
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
    ({item}) => {
      if (isAdmin) {
        return (
          <UserInfoAddRole
            isOpacity={isAdmin ? item?.is_hide : false}
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
    ({item}) => {
      if (isAdmin) {
        return (
          <UserInfoAddRole
            isOpacity={isAdmin ? item?.is_hide : false}
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
    <View style={{paddingTop: 20, paddingBottom: 10}}>
      <View style={[styles.sectionStyle, {marginHorizontal: 0}]}>
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
          data={
            oneLineSection().length < 1
              ? [{sport_name: strings.addrole, item_type: EntityStatus.addNew}]
              : oneLineSection().length > 10
              ? [
                  ...oneLineSection().slice(0, 10),
                  {
                    sport_name: strings.more,
                    item_type: EntityStatus.moreActivity,
                  },
                ]
              : [
                  ...oneLineSection(),
                  {
                    sport_name: strings.more,
                    item_type: EntityStatus.moreActivity,
                  },
                ]
          }
          keyExtractor={keyExtractor}
          renderItem={renderUserRole}
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
