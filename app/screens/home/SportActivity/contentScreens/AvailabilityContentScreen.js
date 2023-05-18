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
        let nextThreeMonth = new Date()
        nextThreeMonth = nextThreeMonth.setMonth(nextThreeMonth.getMonth() + 3);
        const startDateUnixTime = Utility.getTCDate(new Date());
        const endDateUnixTime = Utility.getTCDate(new Date(nextThreeMonth));
        Utility.getEventsSlots([authContext?.entity?.uid], startDateUnixTime, endDateUnixTime)
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