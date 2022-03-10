## Fingerprint Scanning Simulation API

This CLI tool is designed to get you up and running with a mock fingerprint scanner that can be accessed via a request to your `localhost`.

### Quickstart

Install the package

```
npm i @kiva/fingerprint-api-simulator
```

Once installed, set up a script in your `package.json` file.

```
{
    ...
    "scripts": {
        "simulator": "ssim"
    }
    ...
}

...

npm run simulator
```

This will automatically boot up a server on your `localhost` for port `9907`. We have included a clipart image of a fingerprint for convenience, so you should be able to get the data you need by running (in a separate terminal window):

```
curl http://localhost:9907/EKYC/Fingerprint
```

### Customizing Output

We have included lots of customization options, if you want to include data beyond the default response from the API. None are required, and you can mix and match them to your heart's content.

### `-p`, `--port`

Use this option to specify which port your API runs on. Defaults to `9907`.

### `-i`, `--image`

Use this option to provide a path to an image file that will be included as the fingerprint image in the server response. The image will be automatically converted into a base64 string. We have provided a default for this option.

### `--endpoints`

Use this option to create a list of endpoints that can be called in order to get the fingerprint data. All of the endpoints will return the same data. This option can be space- or comma-separated values, or you can mix and match. Defaults to `['/EKYC/Info', '/EKYC/Fingerprint']`.

```
# Would give you # ['/MyCoolPath/', '/MyOtherCoolPath', '/HeresAnotherCoolPath', '/AndOneMoreForFun']
ssim --endpoints /MyCoolPath,/MyOtherCoolPath /HeresAnotherCoolPath /AndOneMoreForFun
```

### `-f`, `--file`

You can use this option to provide a file containing extra data that you want to include in the API response. You can use a JS or JSON file, and we support both `CommonJS` and `ESModule` files.

### Custom Options

Don't have enough extra data for you to want to create a whole extra file? No worries - you're allowed to simply add your own custom option to the command line, and the data will automatically be included.

```
ssim --token <a token> --password <secret... until someone calls your API>
```
