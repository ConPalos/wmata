import { get } from 'https';
import { NextApiRequest, NextApiResponse } from 'next';

// handler for the /api/wmata endpoint
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('Received request:', req.method, req.url);
}
// call the wmata static gtfs api to search for places
async function searchPlaces(query: string): Promise<any[]> {
    get('https://api.wmata.com/gtfs/rail-bus-gtfs-static.zip', (res) => {
        const { statusCode } = res;
        if (statusCode !== 200) {
            throw new Error(`Request Failed. Status Code: ${statusCode}`);
        }

        // unzip the response and parse the GTFS data

    })
}
