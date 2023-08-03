import {
    AppConfigDataClient,
    GetLatestConfigurationCommand,
    StartConfigurationSessionCommand,
} from "@aws-sdk/client-appconfigdata";
import * as fs from "fs";
import {parse} from 'yaml'
import * as path from "path";

interface ConfigurationProps {
    applicationIdentifier: string;
    environmentIdentifier: string;
    profileIdentifier: string;
}

export const getConfiguration = async (
    {applicationIdentifier, environmentIdentifier, profileIdentifier}: ConfigurationProps
) => {
    const client = new AppConfigDataClient({region: process.env.AWS_REGION});
    const token = await client.send(
        new StartConfigurationSessionCommand({
            ApplicationIdentifier: applicationIdentifier,
            EnvironmentIdentifier: environmentIdentifier,
            ConfigurationProfileIdentifier: profileIdentifier,
        })
    );
    const params = {
        ConfigurationToken: token.InitialConfigurationToken,
    };
    const command = new GetLatestConfigurationCommand(params);
    const response = await client.send(command);
    // @ts-ignore
    return new TextDecoder("utf-8").decode(response.Configuration);
};

interface Props extends ConfigurationProps {
    envPath: string;
}

export const getEnvFromAppConfig = async (applicationIdentifier: string, environmentIdentifier: string, profileIdentifier: string) => {
    const config = await getConfiguration({
        applicationIdentifier,
        environmentIdentifier,
        profileIdentifier
    });

    // Parse the YAML content into an object
    return parse(config);
};

const setConfigurationToEnv = async ({
                                         applicationIdentifier,
                                         environmentIdentifier,
                                         profileIdentifier,
                                         envPath,
                                     }: Props) => {
    const yaml = await getEnvFromAppConfig(applicationIdentifier, environmentIdentifier, profileIdentifier);

    // Convert the YAML object to a string of key-value pairs
    const envContent = Object.entries(yaml).map(([key, value]) => `${key}=${value}`).join('\n');

    // Write the env content to a .env file
    fs.writeFileSync(path.join(envPath), envContent, 'utf8');
}

export default setConfigurationToEnv;