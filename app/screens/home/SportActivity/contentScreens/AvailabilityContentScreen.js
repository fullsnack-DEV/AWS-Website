import React, {useEffect, useState, useContext} from 'react';
import AuthContext from '../../../../auth/context';
import * as Utility from '../../../../utils/index';
import AvailibilityScheduleScreen from '../../../account/schedule/AvailibityScheduleScreen';

const AvailabilityContentScreen = ({userData}) => {
    const authContext = useContext(AuthContext);
    const [data, setData] = useState([]);

    useEffect(() => {
        getSlotData()
    },[]);

    const getSlotData = () => {
        Utility.getEventsSlots(authContext?.entity?.uid, Utility.getTCDate(new Date()), 'future', 0)
        .then((response) => {
            let resCalenders = [];
            resCalenders = response.filter((obj) => {     
                if (obj.cal_type === 'blocked') {
                    return obj;
                }
                return false;
            });
            setData(resCalenders)
        });
    }

    const onDayPress = () => {
        getSlotData();
    }

    return (
        <>
        {
        data.length > 0 ? (
            <AvailibilityScheduleScreen
            allSlots={data}
            onDayPress={onDayPress}
            userData={userData}
            />
        ):null}
        </>
    );
};
export default AvailabilityContentScreen