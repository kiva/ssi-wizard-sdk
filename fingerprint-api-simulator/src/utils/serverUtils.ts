import express, {Application} from 'express';
import cors from 'cors';
import IConfig from '../interfaces/IConfig';

export function serverInit(): Application {
    const app = express();
    const options: cors.CorsOptions = {
        origin: '*'
    };
    app.use(cors(options));

    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    return app;
}

export function configureEndpoints(app: Application, endpointArray: string[], returnValue: IConfig) {
    const len = endpointArray.length;
    for (let i = 0; i < len; i++) {
        app.get(endpointArray[i], (request, response) => {
            console.log(request.params);
            return response.send(returnValue);
        });
    }
}

export function listenOnPort(app: Application, port: number, apiName: string = 'Finger tool') {
    return app.listen(port, () => {
      console.log(`${apiName} is running`);
    });
}
