'use strict';

var formulas = require('./formulas');
var strava = require('./strava_api');

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
} = React;

var StravaTSSCalculator = React.createClass({
  getInitialState: function() {
    return {
      stream: null,
      np: null,
      avgWatts: null,
      ftp: null,
      loading: false,
      rideId: null,
      ride_duration: null,
    };
  },

  componentDidMount: function() {
  },

  onCalculate: function() {
    this.state.loading = true;

    strava
      .getRide(this.state.rideId)
      .then((responseData) => {
        console.log(responseData);
        this.setState({
          avgWatts: responseData.average_watts,
          ride_duration: responseData.moving_time
        });
      })
      .done();

    strava
      .getStream(this.state.rideId)
      .then((responseData) => {
        this.setState({
          np: formulas.getNormalizedPower(responseData[1].data),
        });
        console.log("NP:::::::::::" + this.state.np);
      })
      .done();
  },

  onRideIdChange: function(event) {
    this.setState({ rideId: event });
  },

  onFtpChange: function(event) {
    this.setState({ ftp: event });
  },

  render: function() {
    if (this.state.np && this.state.avgWatts) {
      return this.renderResults();
    }
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Strava TSS Calculator</Text>
        <TextInput
          style={styles.input}
          onChangeText={this.onRideIdChange}
          placeholder='Enter your Strava Ride ID'
        />
        <TextInput
          style={styles.input}
          onChangeText={this.onFtpChange}
          placeholder='Enter your Functional Threshold'
        />
        <Text style={styles.button} onPress={this.onCalculate}>CALCULATE</Text>
      </View>
    )
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Calculating...
        </Text>
      </View>
    );
  },

  renderResults: function() {
    var intensityFactor = formulas.getIf(this.state.np, this.state.ftp);
    var variabilityIndex = formulas.getVi(this.state.np, this.state.avgWatts);
    return (
      <View style={styles.container}>
        <Text style={styles.stat}>Average Watts: {this.state.avgWatts}</Text>
        <Text style={styles.stat}>NP: {this.state.np}</Text>
        <Text style={styles.stat}>VI: {intensityFactor}</Text>
        <Text style={styles.stat}>IF: {variabilityIndex}</Text>
        <Text style={styles.stat}>TSS: {formulas.tss(intensityFactor, this.state.ride_duration)}</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FC4C02',
  },
  title: {
    fontSize: 30,
  },
  button: {
    marginTop: 30,
    fontSize: 30,
    color: 'white',
  },
  stat: {
    fontSize: 40,
    color: 'white',
  },
  input : {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    width: 300,
    backgroundColor: 'white',
    marginTop: 10
  }
});

AppRegistry.registerComponent('StravaTSSCalculator', () => StravaTSSCalculator);
