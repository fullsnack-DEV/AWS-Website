import React, { useState } from 'react';
import {
  VictoryChart,
  VictoryTheme,
  VictoryGroup,
  VictoryArea,
  VictoryPolarAxis,
} from 'victory-native'
import colors from '../Constants/Colors';

const BASE_CHART_COLOR = colors.grayBackgroundColor;
const BORDER_CHART_COLOR = colors.whiteColor;
const TEAM1_CHART_COLOR = colors.blueGradiantStart;
const TEAM2_CHART_COLOR = colors.yellowColor;
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
  TEAM1_CHART_COLOR,
  TEAM2_CHART_COLOR,
]
// const GRAPH_POLY_STOP = [5, 4.2, 4, 3.2, 3, 2.2, 2, 1.2, 1];
const characterData = [
  {
    Speed: 5, Physical: 5, Defence: 5, Mental: 5, Aerial: 5, Technical: 5, Attack: 5, Creativity: 5,
  },
  {
    Speed: 4.2, Physical: 4.2, Defence: 4.2, Mental: 4.2, Aerial: 4.2, Technical: 4.2, Attack: 4.2, Creativity: 4.2,
  },
  {
    Speed: 4, Physical: 4, Defence: 4, Mental: 4, Aerial: 4, Technical: 4, Attack: 4, Creativity: 4,
  },
  {
    Speed: 3.2, Physical: 3.2, Defence: 3.2, Mental: 3.2, Aerial: 3.2, Technical: 3.2, Attack: 3.2, Creativity: 3.2,
  },
  {
    Speed: 3, Physical: 3, Defence: 3, Mental: 3, Aerial: 3, Technical: 3, Attack: 3, Creativity: 3,
  },
  {
    Speed: 2.2, Physical: 2.2, Defence: 2.2, Mental: 2.2, Aerial: 2.2, Technical: 2.2, Attack: 2.2, Creativity: 2.2,
  },
  {
    Speed: 2, Physical: 2, Defence: 2, Mental: 2, Aerial: 2, Technical: 2, Attack: 2, Creativity: 2,
  },
  {
    Speed: 1.2, Physical: 1.2, Defence: 1.2, Mental: 1.2, Aerial: 1.2, Technical: 1.2, Attack: 1.2, Creativity: 1.2,
  },
  {
    Speed: 1, Physical: 1, Defence: 1, Mental: 1, Aerial: 1, Technical: 1, Attack: 1, Creativity: 1,
  },
  {
    Speed: 4, Physical: 1, Defence: 4, Mental: 2, Aerial: 3, Technical: 2, Attack: 4, Creativity: 3,
  },
  {
    Speed: 3, Physical: 4, Defence: 2, Mental: 4, Aerial: 1, Technical: 5, Attack: 2, Creativity: 5,
  },
];
const TCRadarChart = ({
  radarChartData = characterData,
}) => {
  const getMaxima = (data) => {
    if (data?.length) {
      const groupedData = Object.keys(data[0]).reduce((memo, key) => {
        const memoData = memo;
        memoData[key] = data.map((d) => d[key]);
        return memoData;
      }, {});
      return Object.keys(groupedData).reduce((memo, key) => {
        const memoData = memo;
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

  const [chartData] = useState(processData(radarChartData))
  const [maxima] = useState(getMaxima(radarChartData))

  return (
    <VictoryChart
        polar
        theme={VictoryTheme.grayscale}
        domain={{ y: [0, 1] }}
            >
      <VictoryGroup
          colorScale={CHART_COLOR}
          style={{ data: { fillOpacity: 0.8, strokeWidth: 2 } }}
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
                  axisLabel: { padding: 10 },
                  axis: { stroke: 'none' },
                  grid: { stroke: 'none', strokeWidth: 0, opacity: 0 },
                }}
                tickLabelComponent={<></>}
                labelPlacement="perpendicular"
                axisValue={i + 1} label={key}
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
