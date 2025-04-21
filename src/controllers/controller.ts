import type { Request, Response } from "express"
import axios from "axios";
import dotenv from 'dotenv'
import Redis from 'redis'

dotenv.config()



export const requestData = async (req: Request, res: Response) => {
    const { city } = req.body;

    try {
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${process.env.KEY}&contentType=json`

        const redisClient = Redis.createClient();

        await redisClient.connect();
        const exp = 4000;       

        const cacheKey = `weather:${city}`
        const cached = await redisClient.get(cacheKey);

        if (cached) {
            return res.json(JSON.parse(cached))
        }

        const response = axios.get(url);

        axios.get(url)
        .then(async function (response) {
            const data = {
                address: response.data.resolvedAddress,
                temp: response.data.currentConditions.temp
            }
            await redisClient.setEx(cacheKey, exp, JSON.stringify(cached))
            res.json(data)
        })


    }

    catch (err) {
        console.log(err);
        res.status(500).json({ Internal: Error })
    }
}
