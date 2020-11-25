import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import testingLocations from './'
import API from '../../../utils/API';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

const dataUrl = "https://data.sfgov.org/resource/dtit-7gp4.geojson?$where=point+is+not+null";

// let locations;

// fetch(dataUrl)
//     .then(function (response) {
//         if (!response.ok) {
//             throw new Error
//         }
//         return response.json();
//     })
//     .then(function (data) {
//         locations = data;
//         return;
//     });



class Application extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: -122.431297,
            lat: 37.773972,
            zoom: 12,
            bounds: [-122.517910874663, 37.6044780500533, -122.354995082683, 37.8324430069081],
            coords: [],
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            address: "",
        };
    }
    // This function loads the API Request
    loadAPI = async () => {
        return await API.search()
    };

    async componentDidMount() {
        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom,
            maxBounds: this.state.bounds
        });
        map.on('move', () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2)
            });
        });
        map.on('load', function (e) {
            map.addSource('covid cases', {
                type: 'geojson',
                data: dataUrl
            });
        })

        const coords = await this.loadAPI();
        // console.log('I am coords', coords);
        let positionArray = []
        // positionArray will become the empty array 'coords', 
        // which is waiting empty in state at this point
        coords.map(coordinate => positionArray.push(
            {
                lat: coordinate.point[1],
                lng: coordinate.point[0],
                id: coordinate.id,
                address: coordinate.address,
                name: coordinate.name,
                activeMarker: null,
                showingInfoWindow: false
            }));
        // this line sets position array as the array 'coords' in our state
        this.setState({ coords: positionArray })

        const createMarker = () => {
            this.state.coords.map((coord, index) => {
                const marker = new mapboxgl.Marker()
                    .setLngLat([coord.lng, coord.lat])
                    .addTo(map);
            });
        };
        createMarker();
    };
    render() {
        return (
            <div>
                <div className='sidebarStyle'>
                    <div>Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</div>
                </div>
                <div ref={el => this.mapContainer = el} className='mapContainer' />
            </div>
        )
    }
}

export default Application;