# CosyncJWTReactNative

## License

This software is licensed under the Apache 2.0 open source license

http://www.apache.org/licenses/LICENSE-2.0

## Installation

React Native Sample App for CosyncJWT

On the Cosync portal

- create an application called CosyncJWTReactNative
- In the JWT tab/Metadata Fields section
- Select 'Automatically add email field to meta data with handle'.
- Add two meta data fields
- Path 'user_data.name.first' with field name 'firstName'
- Path 'user_data.name.last' with field name 'lastName'

On the MongoDB Atlas side

- Create a Free Atlas Cluster. Under 'Additional Settings' select version 'MongoDB 4.4'
- Name new Atlas Cluster CosyncJWTReactNative
- Hit Create Cluster

Once the cluster has been created, select the Realm tab

- Select Create a New App
- Hit 'Start a new Realm App'
- Name the new Realm App 'CosyncJWTS='
- Link it to the  cluster created above (default choice)
- Hit Create Realm Application

Set up Sync in Dev Mode

- Select Cluster to Sync 'CosyncJWTReactNative'
- Define a Database called 'CosyncJWTReactNative_DB'
- Create a partition key called '\_partition' as a string
- Hit 'Turn Dev Mode On'

Set up user provider

- Copy the Realm Public Key for the Application from the Keys section in the CosyncJWT portal
- In the Realm app go to the User tab
- Select the Providers tab
- Select 'Custom JWT Authentication' and hit 'Edit'
- Toggle the Provider Enable control to on
- Select 'Signing Algorithm" as RS256
- Create a Signing Key called 'CosyncJWTReactNativeKey' and enter the Public Key copied above
- Add a metadata field with path "user_data.email' and with field name email
- Hit 'Save'

Deploy the Realm App

- Hit 'REVIEW & DEPLOY'

React Native Project

- Download the source code from Github: https://github.com/Cosync/CosyncSamples.git
- Go to CosyncSamples/CosyncJWT/ReactNative/CosyncJWT
- Install npm package - npm install
- Copy the Realm id from the top left button in the Realm panel in the web UI
- Edit the Realm appId in the config/Config.js file with the copied Realm Id
- Edit the CosyncApp appToken in the config/Config.js file with the APP_TOKEN from the Cosync Portal

Run the app 'react-native run-ios'
