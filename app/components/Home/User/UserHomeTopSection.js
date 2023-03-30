import React, {memo, useCallback, useEffect} from 'react';
import EntityStatus from '../../../Constants/GeneralConstants';
import OrderedSporList from '../OrderedSporList';
import Verbs from '../../../Constants/Verbs';

const UserHomeTopSection = ({
  userDetails,
  isAdmin,
  onRefereesInPress = () => {},
  onScorekeeperInPress = () => {},
  onPlayInPress = () => {},
  onAddRolePress = () => {},
  onMoreRolePress = () => {},
}) => {
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
    isSectionEnable();
  }, [isSectionEnable]);

  const handleCardPress = (sport, type) => {
    switch (type) {
      case EntityStatus.addNew:
        onAddRolePress();
        break;

      case EntityStatus.moreActivity:
        onMoreRolePress();
        break;

      case Verbs.entityTypePlayer:
        onPlayInPress(sport);
        break;

      case Verbs.entityTypeReferee:
        onRefereesInPress(sport);
        break;

      case Verbs.entityTypeScorekeeper:
        onScorekeeperInPress(sport);
        break;

      default:
        break;
    }
  };
  return (
    <OrderedSporList
      user={userDetails}
      type="horizontal"
      isAdmin={isAdmin}
      onCardPress={handleCardPress}
    />
  );
};

export default memo(UserHomeTopSection);
