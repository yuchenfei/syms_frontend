import React from 'react';
import { Chart, Tooltip, Geom, Guide } from 'bizcharts';
import autoHeight from '../autoHeight';
import styles from '../index.less';

const { Line } = Guide;

@autoHeight()
export default class MiniBar extends React.Component {
  render() {
    const { height, forceFit = true, color = '#1890FF', data = [], average } = this.props;

    const scale = {
      x: {
        type: 'cat',
      },
      y: {
        min: 0,
      },
    };

    const padding = [36, 5, 30, 5];

    const tooltip = [
      'x*y',
      (x, y) => ({
        name: x,
        value: y,
      }),
    ];

    // for tooltip not to be hide
    const chartHeight = height + 54;

    return (
      <div className={styles.miniChart} style={{ height }}>
        <div className={styles.chartContent}>
          <Chart
            scale={scale}
            height={chartHeight}
            forceFit={forceFit}
            data={data}
            padding={padding}
          >
            <Tooltip showTitle={false} crosshairs={false} />
            <Geom type="interval" position="x*y" color={color} tooltip={tooltip} />
            <Guide>
              <Line
                start={['min', average]}
                end={['max', average]}
                lineStyle={{
                  stroke: '#000',
                  lineDash: [0, 2, 2],
                  lineWidth: 2,
                }}
              />
            </Guide>
          </Chart>
        </div>
      </div>
    );
  }
}
