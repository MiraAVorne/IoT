import React, { useState } from 'react';
import './App.css';
import Chart from "react-google-charts";
import axios from 'axios';


function App() {

const initWeather = [];
const [weather, setWeather] = useState(initWeather);

function convertUTCDateToLocalDate(date){
  new Date(date.getTime() + date.getTimezoneOffset()*60*1000);
  return date;
}


fetch('https://iot-opettaja.azurewebsites.net/api/HttpTriggerCSharp2?code=mDniSJtbOvdFMvOqapzzY506azTIbraWxtejgzhX8Ti4sY2p/kjoDg==&deviceId=1f0038001847393035313138&amount=10')
  .then(response => response.json())
  .then(json => setWeather([...json]));

let humtempkey = 1;
let chartHumData = [
  ['Aika', '%'],
  ['Loading data', 0],
];

let chartTempData = [
  ['Aika', '°C'],
  ['Loading data', 0],
  
];
const rows = () => weather.reverse().map(temphum => {
  if(chartHumData[1][0]==='Loading data')
  {
    chartHumData.pop();
  }
  if(chartTempData[1][0]==='Loading data')
  {
    chartTempData.pop();
  }
  chartHumData.push([String(convertUTCDateToLocalDate(new Date(temphum.Timestamp))).split(' ')[4], parseInt(temphum.Hum)]);

  chartTempData.push([String(convertUTCDateToLocalDate(new Date(temphum.Timestamp))).split(' ')[4], parseInt(temphum.Temp)]);

  return <div key={humtempkey++}>
    <b>Klo: </b>{String(convertUTCDateToLocalDate(new Date(temphum.Timestamp))).split(' ')[4]}&nbsp;&nbsp;  
    <b>Ilmankosteus: </b>{temphum.Hum}%&nbsp;&nbsp;  
    <b>Lämpötila: </b>{temphum.Temp}°C&nbsp;&nbsp;
  </div> 
})

const toggleLedOn = () => {
  axios.post("https://api.particle.io/v1/devices/1f0038001847393035313138/led?access_token=7949abdc07659bc63a8ac28c29b7e79315d0aae7", {args: 'on'})
}
const toggleLedOff = () => {
  axios.post("https://api.particle.io/v1/devices/1f0038001847393035313138/led?access_token=7949abdc07659bc63a8ac28c29b7e79315d0aae7", {args: 'off'})
}

  return (
    <div className="App">
      {rows()}
      <div style={{ display: 'flex', maxWidth: 1800, margin:'10px' }}>
        <Chart
          width={1800}
          height={300}
          chartType="ColumnChart"
          loader={<div>Loading Chart</div>}
          data={chartHumData}
          options={{
            title: 'Ilmankosteus',
            chartArea: { width: '50%' },
          }}
          legendToggle
        />
        </div>
        <div style={{ display: 'flex', maxWidth: 1800 }}>
        <Chart
          width={1800}
          height={'300px'}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={chartTempData}
          options={{
            title: 'Lämpötila',
            chartArea: { width: '50%', height: '70%' },
          }}
        />
      </div>
      <div><button onClick={toggleLedOn}>On</button><button onClick={toggleLedOff}>Off</button></div>
    </div>
  );
}

export default App;
