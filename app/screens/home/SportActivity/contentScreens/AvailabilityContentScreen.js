import React, {useEffect, useState, useContext, useCallback} from 'react';
import AuthContext from '../../../../auth/context';
import * as Utility from '../../../../utils/index';
import AvailibilityScheduleScreen from '../../../account/schedule/AvailibityScheduleScreen';

const AvailabilityContentScreen = ({userData}) => {
  const authContext = useContext(AuthContext);
  const [data, setData] = useState([]);

  const getSlotData = useCallback(() => {
    Utility.getEventsSlots([userData.user_id ?? userData.group_id]).then(
      (response) => {
        let resCalenders = [];
        resCalenders = response.filter((obj) => {
          if (obj.cal_type === 'blocked') {
            return obj;
          }
          return false;
        });
        setData(resCalenders);
      },
    );
  }, [userData.user_id, userData.group_id]);

  useEffect(() => {
    getSlotData();
  }, [getSlotData]);

  const onDayPress = () => {
    getSlotData();
  };

  return (
    <>
      {data.length > 0 ? (
        <AvailibilityScheduleScreen
          allSlots={data}
          onDayPress={onDayPress}
          isAdmin={userData.user_id === authContext.entity.uid}
        />
      ) : null}
    </>
  );
};
export default AvailabilityContentScreen;
