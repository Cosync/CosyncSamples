# CosyncJWTiOS

## License

This software is licensed under the Apache 2.0 open source license

http://www.apache.org/licenses/LICENSE-2.0

## Installation

iOS Sample App for CosyncJWT

On the Cosync portal

* create an application called CosynJWTiOS
* In the JWT tab/Metadata Fields section
* Select 'Automatically add email field to meta data with handle'.
* Add two meta data fields
* Path 'user_data.name.first' with field name 'firstName'
* Path 'user_data.name.last' with field name 'lastName'

On the MongoDB Atlas side

* Create a Free Atlas Cluster. Under 'Additional Settings' select version 'MongoDB 4.4 - Beta'
* Name new Atlas Cluster CosyncJWTiOS
* Hit Create Cluster

Once the cluster has been created, select the Realm tab 

* Select Create a New App
* Hit 'Start a new Realm App'
* Name the new Realm App 'CosyncJWTiOS'
* Link it to the CosyncJWTiOS cluster created above (default choice)
* Hit Create Realm Application

Set up Sync in Dev Mode

* Select Cluster to Sync 'CosyncJWTiOS'
* Define a Database called 'CosyncJWTiOS_DB'
* Create a partition key called '_partition' as a string
* Hit 'Turn Dev Mode On'

Set up user provider 

* Copy the Realm Public Key for the Application from the Keys section in the CosyncJWT portal
* In the Realm app go to the User tab
* Select the Providers tab
* Select 'Custom JWT Authentication' and hit 'Edit'
* Toggle the Provider Enable control to on
* Select 'Signing Algorithm" as RS256
* Create a Signing Key called 'CosyncJWTiOSKey' and enter the Public Key copied above
* Add a metadata field with path "user_data.email' and with field name email
* Hit 'Save'

Deploy the Realm App

* Hit 'REVIEW & DEPLOY'

XCode Project

* Download the source code from Github
* Install CryptoSwift using the Swift Package Manger

    https://github.com/krzyzanowskim/CryptoSwift.git

* Install Realm & RealmSwift using the Swift Package Manager

    https://github.com/realm/realm-cocoa.git

    Leave the default value of Up to Next Major, then click Next.
    
    Select both Realm and RealmSwift, then click Finish.

* Copy the Realm id from the top left button in the Realm panel in the web UI
* Edit the REALM_APP_ID in the Constants.swift function with the copied Realm Id
* Edit the APP_TOKEN in the Constants.swift function with the APP_TOKEN from the Cosync Portal

Run the app
