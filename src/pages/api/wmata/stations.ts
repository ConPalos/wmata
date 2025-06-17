import { NextApiRequest, NextApiResponse } from 'next';

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { refreshDataIfNeeded } from './updateLocal';
import path from 'path';
dotenv.config();

// handler for the /api/wmata endpoint
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // refresh the data if needed
    refreshDataIfNeeded();

    // user has asked for a list of stations that could match the query text

    // read in all stations and stops from the local files
    const stationsFile = path.resolve(process.cwd(), 'data/stations.json');
    const stopsFile = path.resolve(process.cwd(), 'data/bus_stops.json');

    const stations = JSON.parse(fs.readFileSync(stationsFile, 'utf8'));
    const stops = JSON.parse(fs.readFileSync(stopsFile, 'utf8'));

    // if the request is a GET request, return the list of stations that match the query
    if (req.method === 'GET') {
        const query = req.query.query as string;    

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