import React, {useEffect, useState} from 'react';
import {Text, View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import moment from 'moment';
import images from '../../../Constants/ImagePath';


export default function WeeklyCalender({colors, onDayPress, blockedDaySlots, selectedDate , setSelectedDate}) {

    const [data , setData] = useState([]);
    const [startDate, setStartDate] = useState(0);
    const [endDate, setEndDate] = useState(0);

    const CalendarDaysIndex = {
        Sun: 1,
        Mon: 2,
        Tue: 3,
        Wed: 4,
        Thu: 5,
        Fri: 6,
        Sat: 7,
    };


    const getDaysArray = (start, end, steps = 1) => {
        const dateArray = [];
        const date = new Date(`${start}`);
        while (date <= new Date(end)) {
            const day = moment(date).utc().format('ddd');
            dateArray.push({
            day,
            date: moment(date).utc().format('D'),
            customDate: moment(date).utc().format('YYYY-MM-DD'),
            is_past : moment(date).endOf('day') < moment().endOf('day'),
            showDates : moment(date).utc().format('M') === moment().utc().format('M')
            });

            // Use UTC date to prevent problems with time zones and DST
            date.setUTCDate(date.getUTCDate() + steps);
        }
        return dateArray;
    };



    function showCurrentWeekData() {
        const todaysDay = moment(selectedDate).utc().format('ddd');
        const different = CalendarDaysIndex[todaysDay];
        const date = new Date(selectedDate);
        const sevenDays = new Date(selectedDate);
        date.setDate(date.getDate() - different);
        sevenDays.setDate(sevenDays.getDate() + 7);
        const range = getDaysArray(date, sevenDays);
        const weekOne = range.slice(1, 8);
        setData(weekOne)
        setStartDate(date.setDate(date.getDate() + 1));
        setEndDate(weekOne[6].customDate);
    }

    useEffect(() => {
        showCurrentWeekData();
    },[]);
 


    
    function showNextWeekData(referenceDate) {
        const date = new Date(referenceDate);
        const sevenDays = new Date(referenceDate);
        date.setDate(date.getDate() + 1);
        sevenDays.setDate(sevenDays.getDate() + 7);
        const range = getDaysArray(date, sevenDays);
        const weekOne = range.slice(0, 7);
        setData(weekOne)
        setStartDate(date);
        setEndDate(weekOne[6].customDate);
    }



    function showPreviousWeekData(referenceDate) {
        const date = new Date(referenceDate);
        const sevenDays = new Date(referenceDate);
        date.setDate(date.getDate() - 1);
        sevenDays.setDate(sevenDays.getDate() - 7);
        const range = getDaysArray(sevenDays, date);
        const weekOne = range.slice(0, 7);
        setData(weekOne)
        setStartDate(weekOne[0].customDate);
        setEndDate(weekOne[6].customDate);
    }


    const backGroundColor = (item) => {
        let color;
        if(item.is_past) {
            color = colors.whiteColor;
        }else if(moment(selectedDate).format('YYYY-MM-DD') === item.customDate) {
            color = colors.themeColor;
        }else if(blockedDaySlots.includes(item.customDate)) {
            color = colors.lightGrey;
        }else if(moment(new Date()).format('YYYY-MM-DD') === item.customDate){
            color = colors.whiteColor;
        }else{
            color = colors.whiteColor;
        }

        return color;
    }


    const textColor = (item) => {
        let color;
        if(item.is_past) {
            color = '#ccc';
        }else if(moment(selectedDate).format('YYYY-MM-DD') === item.customDate) {
            color = colors.whiteColor;
        }else if(blockedDaySlots.includes(item.customDate)) {
            color = colors.grayColor;
        }else if(moment(new Date()).format('YYYY-MM-DD') === item.customDate){
            color = colors.themeColor;
        }else{
            color =  colors.greenGradientStart;
        }

        return color;
    }


    return (
        <>
           <View style={styles.calenderWrapper}>
                <View 
                style={styles.calInnerWrapper}>
                    <View 
                    style={styles.monthToggle}
                    >
                        <TouchableOpacity onPress={()  => showPreviousWeekData(startDate)}>
                            <Image 
                                source={images.leftArrow}
                                style={{width : 8, height: 15, marginLeft: 7, marginTop: 5}}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around', marginLeft: 10, marginRight: 10}}>
                        {
                            moment(startDate).utc().format('MMMM') === moment(endDate).utc().format('MMMM') ? (
                                <Text style={{fontSize: 17}}>
                                    {moment(startDate).utc().format('MMMM')} {moment(selectedDate).utc().format('YYYY')}
                                </Text>
                            ):(
                                <Text style={{fontSize: 17}}>
                                    {moment(endDate).utc().format('MMMM')} {moment(selectedDate).utc().format('YYYY')}
                                </Text>
                            )
                        }
                    </View>
                    <View 
                    style={styles.monthToggle}
                    >
                        <TouchableOpacity onPress={() => showNextWeekData(endDate)}>
                            <Image 
                                source={images.rightArrow}
                                style={{width : 8, height: 15, marginLeft: 10, marginTop: 5}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                    {
                    data.map((item , key) => (
                        <View key={key} style={{flexDirection: 'column', alignItems :'center'}}>
                            <View style={{marginBottom: 20}}>
                                <Text>{item.day}</Text>
                            </View>
                            <TouchableOpacity onPress={() => {
                                    setSelectedDate(item.customDate)
                                    onDayPress(item.customDate)
                            }}>
                            <View style={{
                                backgroundColor: backGroundColor(item), 
                                borderRadius: 5,
                                width: 35,
                                height: 35,
                                alignContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                                <Text style={{color : textColor(item)}}>{item.date}</Text>
                            </View>
                            </TouchableOpacity>
                        </View>
                    ))
                    }
                </View>
           </View>
        </>
    );
}

const styles = StyleSheet.create({
   calenderWrapper : {
    paddingHorizontal: 15, paddingVertical: 5
   },
   calInnerWrapper : {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    marginBottom: 20,
    marginLeft: 15
   },
   monthToggle: {
    width : 25, 
    height: 25,
    backgroundColor: '#f5f5f5',
    borderRadius: 5
   }
})