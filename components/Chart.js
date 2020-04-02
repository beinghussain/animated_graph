import React from 'react';
import {View, Dimensions, StyleSheet, Animated} from 'react-native';
import Svg, {Path, Defs, LinearGradient, Stop} from 'react-native-svg';
import {scaleTime, scaleLinear} from 'd3-scale';

import * as shape from 'd3-shape';
const d3 = {
  shape,
};

const height = 112;
let {width} = Dimensions.get('window');
const verticalPadding = 5;
const cursorRadius = 10;
const labelWidth = 100;
const margin = 30;
const border = 3;
width = width - (margin * 2 + border);

// To do.

// Add a tooltip
// Add A Pointer

class Chart extends React.Component {
  state = {
    x: new Animated.Value(0),
  };

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    this.initLine();
    this.initBaseLine();
    this.initLineGradient();
    // this.initAnimation();
  };

  initAnimation = () => {
    const {data = []} = this.props;
    let {durationIntervalSecond = 0} = this.state;
    let interval;
    interval = setInterval(() => {
      if (durationIntervalSecond < data.length) {
        durationIntervalSecond++;
        this.setState({durationIntervalSecond});
        this.initLine();
      } else {
        clearInterval(interval);
      }
    }, 10);
    // only works if data is small
  };

  initLineGradient = () => {
    const {data} = this.props;
    const points = data.length;
    let items = [];
    const stops = []; // array of values of gradient that renders Stop for Linear gradient

    for (let i = 0; i < points; i++) {
      items.push(i * (data[points - 1].y / points));
    } // creating an array of average values based of min and max values and total number of data points

    data.forEach((d, index) => {
      stops.push({
        offset: `${Math.ceil((index * 100) / data.length)}%`,
        color: items[index] <= d.y ? '#0CB401' : '#FFB60E',
      });
    });

    this.setState({stops});
    // the color of the line that changes its color to green if below average and orange if above average
  };

  initLine = () => {
    const {data = []} = this.props;
    const minX = data[0].x;
    const maxX = data[data.length - 1].x;

    const maxY = data[data.length - 1].y;

    const scaleX = scaleTime()
      .domain([minX, maxX])
      .range([0, width]);
    const scaleY = scaleLinear()
      .domain([0, maxY])
      .range([height - verticalPadding, verticalPadding]);

    const chartLine = d3.shape
      .line()
      .x(d => scaleX(d.x))
      .y(d => scaleY(d.y))
      .curve(d3.shape.curveCatmullRom)(data);

    // the line that is created in front

    this.setState({chartLine});
  };

  initBaseLine = () => {
    const {data} = this.props;

    const minX = data[0].x;
    const maxX = data[data.length - 1].x;

    const maxY = data[data.length - 1].y;

    const scaleX = scaleTime()
      .domain([minX, maxX])
      .range([0, width]);

    const scaleY = scaleLinear()
      .domain([0, maxY])
      .range([height - verticalPadding, verticalPadding]);

    const baseLine = d3.shape
      .line()
      .x(d => scaleX(d.x))
      .y(d => scaleY(d.y))
      .curve(d3.shape.curveLinear)([data[0], data[data.length - 1]]);

    // the grey colored dashed line

    this.setState({baseLine});
  };

  render() {
    const {stops = [], baseLine, chartLine} = this.state;
    return (
      <View style={styles.graphContainer}>
        <View style={styles.container}>
          <Svg {...{width, height}}>
            <Defs>
              <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="gradient">
                <Stop stopColor="#CDE3F8" offset="0%" />
                <Stop stopColor="#eef6fd" offset="80%" />
                <Stop stopColor="#FEFFFF" offset="100%" />
              </LinearGradient>
              <LinearGradient
                id="line-gradient"
                gradientUnits="userSpaceOnUse"
                d={`${chartLine} L ${width} ${height} L 0 ${height}`}>
                {stops.map((d, index) => {
                  return (
                    <Stop key={index} offset={d.offset} stopColor={d.color} />
                  );
                })}
              </LinearGradient>
            </Defs>
            <Path
              d={baseLine}
              strokeDasharray="5,3"
              fill="transparent"
              stroke="#dedede"
              strokeWidth={2}
            />
            <Path
              d={baseLine}
              strokeDasharray="5,3"
              fill="transparent"
              stroke="#dedede"
              strokeWidth={2}
            />
            <Path
              strokeLinecap="round"
              d={chartLine}
              fill="transparent"
              stroke="url(#line-gradient)"
              strokeWidth={3}
            />
          </Svg>
        </View>
      </View>
    );
  }
}

export default Chart;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  graphContainer: {
    margin: 15,
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: 8,
    padding: 15,
  },
  scrollView: {
    backgroundColor: '#fff',
  },
  container: {
    marginTop: 60,
    height,
    width,
  },
  cursor: {
    width: cursorRadius * 2,
    height: cursorRadius * 2,
    borderRadius: cursorRadius,
    borderColor: '#367be2',
    borderWidth: 3,
    backgroundColor: 'white',
  },
  label: {
    position: 'absolute',
    top: -45,
    left: 0,
    opacity: 0,
    backgroundColor: 'white',
    width: labelWidth,
  },
});
