import * as serverUtils from "../../utils/serverUtils";
import {Application} from 'express';

describe('The Server Utilities', () => {
    let app: Application, running: any;

    const {serverInit, listenOnPort, configureEndpoints} = serverUtils;

    beforeAll(() => {
        app = serverInit();
        configureEndpoints(app, ['/Turtle', '/Toes'], {
            endlessShrimp: true,
            warmSun: true,
            cleanWater: true,
            assignedScritcher: 'Artie'
        });
        running = listenOnPort(app, 2002);
    })

    describe('The serverInit function returns an Express app with the right configurations', () => {
        console.log(running);
    })

})