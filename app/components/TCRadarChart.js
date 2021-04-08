import React, { useEffect, useState } from 'react';
import {
  VictoryChart,
  VictoryTheme,
  VictoryGroup,
  VictoryArea,
  VictoryPolarAxis,
} from 'victory-native'
import _ from 'lodash';
import colors from '../Constants/Colors';

const BASE_CHART_COLOR = colors.grayBackgroundColor;
const BORDER_CHART_COLOR = colors.whiteColor;
const TEAM1_CHART_COLOR = 'rgba(0, 122, 255,0.8)';
const TEAM2_CHART_COLOR = 'rgba(255, 138, 1, 0.8)';

const CHART_COLOR = [
  BASE_CHART_COLOR,
  BORDER_CHART_COLOR,
  BASE_CHART_COLOR,
  BORDER_CHART_COLOR,
  BASE_CHART_COLOR,
  BORDER_CHART_COLOR,
  BASE_CHART_COLOR,
  BORDER_CHART_COLOR,
  BASE_CHART_COLOR,
  TEAM2_CHART_COLOR,
  TEAM1_CHART_COLOR,
]
const BASE_CHART_POLY = [5, 4.2, 4, 3.2, 3, 2.2, 2, 1.2, 1];

const TCRadarChart = ({
  radarChartAttributes,
  radarChartData = [],
}) => {
  const getMaxima = (data) => {
    if (data?.length) {
      const groupedData = Object.keys(data[0]).reduce((obj, key) => {
        const memoData = obj;
        memoData[key] = data.map((d) => d[key]);
        return memoData;
      }, {});
      return Object.keys(groupedData).reduce((obj, key) => {
        const memoData = obj;
        memoData[key] = Math.max(...groupedData[key]);
        return memoData;
      }, {});
    }
    return {}
  }

  const processData = (data) => {
    if (data?.length) {
      const maxByGroup = getMaxima(data);
      const makeDataArray = (d) => Object.keys(d).map((key) => ({ x: key, y: d[key] / maxByGroup[key] }));
      return data.map((datum) => makeDataArray(datum));
    }
    return [];
  }
  const [radarChart, setRadarChart] = useState([]);
  const [chartData, setChartData] = useState([])
  const [maxima, setMaximaData] = useState([])

  useEffect(() => {
    let data = [];
    BASE_CHART_POLY.map((polyRating) => {
      const attributes = {};
      if (radarChartAttributes?.length) {
        radarChartAttributes.map((attr) => {
          attributes[attr.toString()] = polyRating;
          return <></>
        });
      }
      data.push(attributes);
      return <></>
    });
    data = [...data, ...radarChartData];
    setRadarChart([...data]);
  }, [radarChartData]);

  useEffect(() => {
    setChartData(processData(radarChart));
    setMaximaData(getMaxima(radarChart));
  }, [radarChart])

  return (
    <VictoryChart
        polar
        theme={VictoryTheme.material}
        domain={{ y: [0, 1] }}
            >
      <VictoryGroup
          colorScale={CHART_COLOR}
          style={{ data: { strokeWidth: 3 } }}
                >
        {chartData.map((data, i) => (
          <VictoryArea
                key={i}
                data={data}
            />
        ))}
      </VictoryGroup>
      {
          Object.keys(maxima).map((key, i) => (
            <VictoryPolarAxis key={i}
                dependentAxis
                style={{
                  axisLabel: { padding: 20 },
                  axis: { stroke: 'none' },
                  grid: { stroke: 'none', strokeWidth: 0, opacity: 0 },
                }}
                tickLabelComponent={<></>}
                labelPlacement="perpendicular"
                axisValue={i + 1}
                label={_.startCase(key)}
                tickFormat={(t) => Math.ceil(t * maxima[key])}
                tickValues={[0.20, 0.40, 0.60, 0.80, 1]}
            />
          ))
        }
      <VictoryPolarAxis
                    labelPlacement="parallel"
                    tickFormat={() => ''}
                    style={{
                      axis: { stroke: 'none' },
                      grid: { stroke: 'white', strokeWidth: 3, opacity: 0.1 },
                    }}
                />
    </VictoryChart>
  );
}

export default TCRadarChart;
