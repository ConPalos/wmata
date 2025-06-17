import * as fs from 'fs';
import path from 'path';
// import { get } from 'https';
// import unzipper from 'unzipper';

// export function updateGtfs(): void {
//     // download the latest gtfs data from wmata
//     get('https://api.wmata.com/gtfs/rail-bus-gtfs-static.zip', (res) => {
//         const { statusCode } = res;
//         if (statusCode !== 200) {
//             throw new Error(`Request Failed. Status Code: ${statusCode}`);
//         }

//         // unzip the response and parse the GTFS data
//         let data = unzipper.unzip(res.readableStream());
//     });
// }

export function updateBusStops(): void {
    // download the latest bus stops from wmata
    console.log('Fetching bus stops');
    fetch('https://api.wmata.com/Bus.svc/json/jStops', {
        method: 'GET',
        // Request headers
        headers: {
            'Cache-Control': 'no-cache',
            'api_key': process.env.WMATA_API_KEY || ''
        }
    })
        .then(response => {
            // save the list of bus stops to a file
            const filePath = path.resolve(process.cwd(), 'data/bus_stops.json');
            console.log('Saving bus stops to', filePath);
            fs.openSync(filePath, 'w'); // ensure the file exists
            fs.writeFileSync(filePath, JSON.stringify(response.json(), null, 2));
        })
        .catch(err => console.error(err));
}

export function updateStations(): void {
    // download the latest stations from wmata
    fetch('https://api.wmata.com/Rail.svc/json/jStations', {
        method: 'GET',
        // Request headers
        headers: {
            'Cache-Control': 'no-cache',
            'api_key': process.env.WMATA_API_KEY || ''
        }
    })
        .then(response => {
            // save the list of stations to a file
            const filePath = path.resolve(process.cwd(), 'data/stations.json');
            fs.openSync(filePath, 'w'); // ensure the file exists
            fs.writeFileSync(filePath, JSON.stringify(response.json(), null, 2));
        })
        .catch(err => console.error(err));
}

export function getLastUpdateTime(): string {
    // read in a file in data/last_updated.txt
    console.log('Getting last update');
    const filePath = path.resolve(process.cwd(), 'data/last_gtfs_update.txt');
    let lastUpdated: string;
    try {
        lastUpdated = fs.readFileSync(filePath, 'utf8').trim();
    }
    catch (error) {
        // if the file doesn't exist, assume it was never updated
        lastUpdated = "Never";
    }

    console.log('Last GTFS update:', lastUpdated);

    return lastUpdated;
}

export function refreshDataIfNeeded() {
    // check the last update time
    const lastUpdated = getLastUpdateTime();

    if (lastUpdated === "Never" || new Date().getTime() - new Date(lastUpdated).getTime() > 24 * 60 * 60 * 1000) {
        // update the data
        try {
            // updateGtfs();
            updateBusStops();
            updateStations();
            // update the last updated time
            fs.writeFileSync(path.resolve(process.cwd(), 'data/last_gtfs_update.txt'), new Date().toISOString());
        }
        catch (error) {
            console.error("Error updating data:", error);
        }
    }
}