const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

// Create a Secrets Manager client
const client = new SecretsManagerClient({ region: 'eu-west-2' });

const secretName = 'practice_key';

async function getSecretValue(secretName) {
    try {
        const command = new GetSecretValueCommand({ SecretId: secretName });
        const data = await client.send(command);

        if (data.SecretString) {
            const secret = data.SecretString;
            console.log('Secret:', JSON.parse(secret));
        } else {
            const buff = Buffer.from(data.SecretBinary.data, 'base64');
            const decodedBinarySecret = buff.toString('ascii');
            console.log('Secret:', decodedBinarySecret);
        }

    } catch (err) {
        if (err.name === 'ResourceNotFoundException') {
            console.error(`The requested secret ${secretName} was not found`);
        } else if (err.name === 'InvalidRequestException') {
            console.error(`The request was invalid due to: ${err.message}`);
        } else if (err.name === 'InvalidParameterException') {
            console.error(`The request had invalid params: ${err.message}`);
        } else {
            console.error(`Error retrieving secret: ${err.message}`);
        }
    }
}

const key = getSecretValue(secretName)[0];

console.log(key.test_key)

