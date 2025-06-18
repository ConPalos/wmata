import { NextApiRequest, NextApiResponse } from 'next';

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { refreshDataIfNeeded } from './updateLocal';
import path from 'path';
import { fileURLToPath } from 'url';
import { sleep } from '@/lib/utils';
dotenv.config();

async function readFileAsync(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        // read the file asynchronously and return its contents
        fs.readFile(filePath, 'utf8', (err, data) => {
            if(err) {
                console.error('Error reading stations file:', err);
                console.log('No files available at:', filePath);
                reject(new Error(`Failed to read file ${filePath}`));
            }
            else {
                resolve(data.toString());
            }
        })

    });
}

// handler for the /api/wmata endpoint
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // refresh the data if needed
    refreshDataIfNeeded();

    // user has asked for a list of stations that could match the query text

    // read in all stations and stops from the local files
    const stationsFile = path.resolve(process.cwd(), 'data/stations.json');
    const stopsFile = path.resolve(process.cwd(), 'data/bus_stops.json');

    const stationsPromise = readFileAsync(stationsFile);
    const stopsPromise = readFileAsync(stopsFile);

    const [rawStations, rawStops] = await Promise.all([stationsPromise, stopsPromise]);

    const { Stations } = JSON.parse(rawStations);
    const { Stops } = JSON.parse(rawStops);

    const stations = Stations;
    const stops = Stops;

    // check that stations and stops have been populated
    if(!stations || !stops) {
        res.status(500).json({ error: 'Stations or stops data not available' });
        console.log('Stations or stops data not available');
        return;
    }

    // if the request is a GET request, return the list of stations that match the query
    if (req.method === 'GET') {
        const query = req.query.query as string;    

        console.log('Searching for stations matching query:', query);

        if(!query) {
            // return no results if no query is provided
            res.status(200).json([]);
            return;
        }

        // filter the stations and stops based on the query
        const filteredStations = stations.filter((station: any) =>
            station.Name.toLowerCase().includes(query.toLowerCase())
        );
        const filteredStops = stops.filter((stop: any) =>
            stop.Name.toLowerCase().includes(query.toLowerCase())
        );

        // return the results in two segments: stations and stops
        res.status(200).json({
            stations: filteredStations.map((station: any) => ({
                id: station.Code,
                name: station.Name,
                lat: station.Lat,
                lon: station.Lon
            })),
            stops: filteredStops.map((stop: any) => ({
                id: stop.StopID,
                name: stop.Name,
                lat: stop.Lat,
                lon: stop.Lon
            }))
        });
    }
}