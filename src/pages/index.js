import React from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
import axios from 'axios';
import Layout from 'components/Layout';
import Map from 'components/Map';
import { Container, Row, Col } from 'reactstrap';

const LOCATION = {
  lat: 0,
  lng: 0
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;

const IndexPage = () => {
  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement: map } = {}) {
    //mod start
  const { data: countries = [] } = await axios.get('https://corona.lmao.ninja/v2/countries');
  const { data: stats = {} } =await axios.get('https://corona.lmao.ninja/v2/all');
  const dashboardStats = [
    {
      primary: {
        label: 'Total Cases',
        value: stats?.cases
      },
      secondary: {
        label: 'Per 1 Million',
        value: stats?.casesPerOneMillion
      }
    },
    {
      primary: {
        label: 'Total Deaths',
        value: stats?.deaths
      },
      secondary: {
        label: 'Per 1 Million',
        value: stats?.deathsPerOneMillion
      }
    },
    {
      primary: {
        label: 'Total Tests',
        value: stats?.tests
      },
      secondary: {
        label: 'Per 1 Million',
        value: stats?.testsPerOneMillion
      }
    },
    {
      primary: {
        label: 'Active Cases',
        value: stats?.active
      }
    },
    {
      primary: {
        label: 'Critical Cases',
        value: stats?.critical
      }
    },
    {
      primary: {
        label: 'Recovered Cases',
        value: stats?.recovered
      }
    }
  ]
  console.log(dashboardStats);
  //mod end
    /*let response;

    try {
      response = await axios.get('https://corona.lmao.ninja/v2/countries');
    } catch(e) {
      console.log(`Failed to fetch countries: ${e.message}`, e);
      return;
    }

    const { data = [] } = response;
    const hasData = Array.isArray(data) && data.length > 0;

    if ( !hasData ) return;*/

    const geoJson = {
      type: 'FeatureCollection',
      //features: data.map((country = {}) => {
        features: countries.map((country = {}) => {
          //above line is v2
        const { countryInfo = {} } = country;
        const { lat, long: lng } = countryInfo;
        return {
          type: 'Feature',
          properties: {
            ...country,
          },
          geometry: {
            type: 'Point',
            coordinates: [ lng, lat ]
          }
        }
      })
    }

    const geoJsonLayers = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latlng) => {
        const { properties = {} } = feature;
        let updatedFormatted;
        let casesString;

        const {
          country,
          updated,
          cases,
          deaths,
          recovered
        } = properties

        casesString = `${cases}`;

        if ( cases > 1000 ) {
          casesString = `${casesString.slice(0, -3)}k+`
        }

        if ( updated ) {
          updatedFormatted = new Date(updated).toLocaleString();
        }

        const html = `
          <span class="icon-marker">
            ${ casesString }
          </span>
        `;
        const popupHtml = `
          <span class="icon-marker-tooltip">
            <h2>${country}</h2>
            <ul>
              <li><strong>Confirmed:</strong> ${cases}</li>
              <li><strong>Deaths:</strong> ${deaths}</li>
              <li><strong>Recovered:</strong> ${recovered}</li>
              <li><strong>Last Update:</strong> ${updatedFormatted}</li>
            </ul>
          </span>
        `;

        const popup = L.popup({
          maxWidth: 400
        }).setContent(popupHtml);

        return L.marker( latlng, {
          icon: L.divIcon({
            className: 'icon',
            html
          }),
          riseOnHover: true
        }).bindPopup(popup);
      }
    });

    geoJsonLayers.addTo(map)
    //v2
    //total cases
    document.getElementById('label1pri').innerHTML=dashboardStats[0].primary.label+': '+dashboardStats[0].primary.value;
    document.getElementById('label1sec').innerHTML=dashboardStats[0].secondary.label+': '+dashboardStats[0].secondary.value;
    //total deaths
    document.getElementById('label2pri').innerHTML=dashboardStats[1].primary.label+': '+dashboardStats[1].primary.value;
    document.getElementById('label2sec').innerHTML=dashboardStats[1].secondary.label+': '+dashboardStats[1].secondary.value;  
    //total test
    document.getElementById('label3pri').innerHTML=dashboardStats[2].primary.label+': '+dashboardStats[2].primary.value;
    document.getElementById('label3sec').innerHTML=dashboardStats[2].secondary.label+': '+dashboardStats[2].secondary.value;
    //active cases//
    document.getElementById('label4pri').innerHTML=dashboardStats[3].primary.label+': '+dashboardStats[3].primary.value;
    //recovered cases//
    document.getElementById('label5pri').innerHTML=dashboardStats[4].primary.label+': '+dashboardStats[4].primary.value;
    //critical cases
    document.getElementById('label6pri').innerHTML=dashboardStats[5].primary.label+': '+dashboardStats[5].primary.value;
  }

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'Mapbox',
    zoom: DEFAULT_ZOOM,
    mapEffect
  };

  return (
    <Layout pageName="home">
      <Helmet>
      <meta property="og:title" content="COVID-19 TRACKER"/>
      <meta property="og:image" content="https://i.ibb.co/VxFjJN4/corona.jpg"/>
      <meta property="og:description" content="This website tracks the Covid-19 statistics and shows the data of all the countries in Realtime on map along with total number of cases and total number of deaths"/>
      <meta property="og:url" content="https://novelcovid19tracker.web.app/" />
      <title>COVID-19 TRACKER</title>
      </Helmet>
      <Map {...mapSettings} />
  <Container>
   <Row>
      <Col className="col-auto" style={{backgroundColor:'#FF5050',border:'3px solid black'}}>
      <strong><p id="label1pri" style={{padding:'2px'}}/></strong>
      <strong><p id="label1sec" style={{padding:'2px'}}/></strong>
      </Col>
      <Col className="col-auto" style={{backgroundColor:'lightblue',border:'3px solid black'}}>
      <strong><p id="label2pri" style={{padding:'2px'}}/></strong>
      <strong><p id="label2sec" style={{padding:'2px'}}/></strong>
      </Col>
      <Col className="col-auto" style={{backgroundColor:'#66FF66',border:'3px solid black'}}>
      <strong><p id="label3pri"style={{padding:'2px'}}/></strong>
      <strong><p id="label3sec"style={{padding:'2px'}}/></strong>
      </Col>
      <Col className="col-auto" style={{backgroundColor:'yellow',border:'3px solid black'}}>
      <strong><p id="label4pri"style={{padding:'2px',paddingBottom:'20px',paddingTop:'20px'}}/></strong>
      </Col>
      <Col className="col-auto" style={{backgroundColor:'#FF00CC',border:'3px solid black'}}>
      <strong><p id="label5pri"style={{padding:'2px',paddingBottom:'20px',paddingTop:'20px'}}/></strong>
      </Col>
      <Col className="col-auto" style={{backgroundColor:'#CCFF00',border:'3px solid black'}}>
      <strong><p id="label6pri"style={{padding:'2px',paddingBottom:'20px',paddingTop:'20px'}}/></strong>
      </Col>
    </Row>
    </Container>

    </Layout>
  );
};

export default IndexPage;

