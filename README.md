# AWS AppConfig to .env converter

This Node.js module provides a function that allows you to fetch the latest configuration from AWS AppConfig and store it in a .env file.

## Installation

To install the module, run the following command:

```bash
npm install aws-app-config-to-env
```

Or, if you prefer Yarn:

```bash
yarn add aws-app-config-to-env
```

## Usage

```typescript
import setConfigurationToEnv from 'aws-app-config-to-env';

await setConfigurationToEnv({
  applicationIdentifier: 'my-app',
  environmentIdentifier: 'dev',
  profileIdentifier: 'my-profile',
  envPath: '.env',
});
```

The setConfigurationToEnv() function takes an object with the following properties:

`applicationIdentifier`: The ID of the AppConfig application that contains the configuration you want to fetch.
`environmentIdentifier`: The ID of the AppConfig environment that contains the configuration you want to fetch.
`profileIdentifier`: The ID of the AppConfig configuration profile that contains the configuration you want to fetch.
`envPath`: The path where the .env file should be created.


When you call `setConfigurationToEnv()`, it will fetch the latest configuration from AWS AppConfig using the `GetLatestConfigurationCommand()` method. The configuration will be parsed from YAML format to a string of key-value pairs, which will then be written to a `.env` file at the specified envPath.

## Requirements
- Node.js v10.x or later
- @aws-sdk/client-appconfigdata package
- yaml package