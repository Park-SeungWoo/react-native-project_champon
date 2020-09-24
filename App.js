import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  PowerTranslator,
  ProviderTypes,
  TranslatorConfiguration,
  TranslatorFactory,
} from 'react-native-power-translator';
import MapApp from './MapApp';

let pwidth = Dimensions.get('window').width;
let pheight = Dimensions.get('window').height;

const API_KEY = 'AIzaSyBnFTdbCGJDFEfHXjwIy6z8403DmwGxuro';

export default class App extends Component {
  state = {
    locarr: [], // to save each safe restaurant data
    loccoors: [], // to save each safe restaurant's latitude, longitude as a object
  };

  _getSafeRestaurant = () => {
    // get safe restaurant data
    fetch(
      `http://211.237.50.150:7080/openapi/2532cb13adf711228d1059388c96ca0020080e57dc386ebd4e2280d494aaba48/json/Grid_20200713000000000605_1/1/100?`,
    )
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          locarr: json.Grid_20200713000000000605_1.row,
        });
        this._Translator();
      });
  };

  _Translator = () => {
    // translate Korean address to English
    TranslatorConfiguration.setConfig(
      ProviderTypes.Google,
      API_KEY,
      'en', // target lang
      'ko', // source lang
    );
    const translator = TranslatorFactory.createTranslator();
    this.state.locarr.map((arr, idx) => {
      translator.translate(arr.RELAX_ADD1, 'en').then(
        (res) => {
          this._GoogleAPIgeocoding(res, idx);
        },
        (error) => {
          console.log(error);
        },
      );
    });
  };

  _GoogleAPIgeocoding = (loc, idx) => {
    // get latitude, longitude by using translated address
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${loc}&key=${API_KEY}`,
    )
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          loccoors: this.state.loccoors.concat({
            id: idx,
            lat: json.results[0].geometry.location.lat,
            long: json.results[0].geometry.location.lng,
          }),
        });
      });
  };

  componentDidMount() {
    this._getSafeRestaurant();
  }

  render() {
    const {loccoors} = this.state;
    return (
      <View style={styles.container}>
        <MapApp style={styles.map} locarr={loccoors} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: pwidth,
    height: pheight,
  },
  map: {
    flex: 1,
  },
  main: {
    width: pwidth,
    height: pheight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  text: {
    fontSize: 40,
  },
  button: {
    width: 100,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
