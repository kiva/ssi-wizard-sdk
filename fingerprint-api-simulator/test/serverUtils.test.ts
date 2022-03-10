import axios from 'axios';
import {serverInit, listenOnPort, configureEndpoints} from "../src/utils/serverUtils";
import IConfig from '../src/interfaces/IConfig';
import {Application} from 'express';

describe('The Server Utilities', () => {
    const response: IConfig = {
        endlessShrimp: true,
        warmSun: true,
        cleanWater: true,
        assignedScritcher: 'Artie',
        ImageBase64: 'tttttt',
        FingerprintSensorSerialNumber: "Kiva-Simulator"
    };
    let app: Application, running: any;

    beforeAll(() => {
        app = serverInit();
        configureEndpoints(app, ['/Turtle', '/Toes'], {
            endlessShrimp: true,
            warmSun: true,
            cleanWater: true,
            assignedScritcher: 'Artie',
            ImageBase64: 'tttttt',
            FingerprintSensorSerialNumber: "Kiva-Simulator"
        });
        running = listenOnPort(app, 2002);
    });

    afterAll(() => {
        running && running.close();
    })

    it('responds with the correct data for all endpoints on the correct port', async () => {
        const {data: turtleData} = await axios.get('http://localhost:2002/Turtle');
        const {data: toesData} = await axios.get('http://localhost:2002/Toes');
        expect(turtleData).toEqual(response);
        expect(toesData).toEqual(response);
    });

    it('throws an error when making a request to the wrong port', async () => {
        await expect(axios.get('http://localhost:2022/Turtle')).rejects.toThrow();
        await expect(axios.get('http://localhost:2022/Toes')).rejects.toThrow();
    });

    it('throws an error when making a request to an incorrect endpoint', async () => {
        await expect(axios.get('http://localhost:2002/TurtleToes')).rejects.toThrow();
    });

});