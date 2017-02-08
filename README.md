## Chat-bot Platform

## Table of Contents
* [Manifesto](#manifesto)
* [Code style](#code-style)
* [How to run the project locally:](#how-to-run-the-project-locally)
  * [Backend](#backend)
  * [Frontend](#frontend)
* [Deploying project](#deploying-project)
  * [Build project in Jazz Hub](#build-project-in-jazz-hub)
  * [Database](#database)
* [How to source images from Cloudant](#how-to-source-images-from-cloudant)
* [Documentation](#documentation)
  * [Custom tags in messages](#custom-tags-in-messages)
* [Authors](#authors)

## Manifesto

## Code style
For code style we follow [StandardJS](http://standardjs.com/). It has nice set of basic rules while not being too prescriptive. You can use their tool to check your code. Use of ESLint or StandardJS integration into your editor of choice is recommended. There are configuration files in the project for [EditorConfig](http://editorconfig.org/) and [ESLint](http://eslint.org/).

## How to run the project locally:

### Backend

0. install node.js (Tested with version v6.9.1 - note that we are using some ES6 features)

1. install necessary node.js modules
npm install

2. create file with local settings.
The file may contain different settings of the application.
It is mainly intended to setup the application the same way as bluemix, which means setting up environment variables.
Use command `cf env <APLICATION_NAME> ./app/config/app_env` to load variables from Bluemix to local file. Script in *app/config/local-settings.js* will parse it.

4. run the application
npm start

### Frontend

0. You will need npm and node installed. You can install both from https://nodejs.org/.

1. Afterwards `cd` into the frontend repo and run following commands

  1. add required global libraries
  ```
  npm install typings webpack-dev-server rimraf webpack -g
  ```
  2. install the repo with npm
  ```
  npm install
  ```

3. start the server
```
npm start
```
4. do some coding ...

5. build files and export `dist` folder to the `public` folder in the backend repository so that it is ready to be deployed
```
npm run build:prod
```

6. Additional information about the frontend repo structure and other commands is in its `README.md` file

## Deploying project
### Build project in Jazz Hub
The build process should have at least these two commands:
```
#!/bin/bash
npm install -g npm@3.10.9
npm install npm@3.10.9
export PATH=/opt/IBM/node-v4.2/bin:$PATH
export PATH=/opt/IBM/node-v5.10/bin:$PATH
npm install		// installs backend dependencies
npm run build	// installs frontend dependencies and builds production files
```
The other option is to upload the files over CloudFoundry command tool

### Database

For logging create these tables in DashDB:
CONVERSATIONS_QA

## How to source images from Cloudant

0. Log in to Cloudant.

1. Enter/create database `images`.

2. Edit/create document `images`.

3. Upload your `image-name.jpg` via `Upload attachment`.

4. In HTML set `src="/api/attachments/image-name.jpg"`.

## Documentation

### Custom tags in messages
We currently support these tags:
* `<ui:date>Tue Oct 04 2016 13:23:42 GMT+0200 (CEST)</ui:date>`
 * the inside is output of new Date() function in JavaScript. This tag parses the date and outputs it in a locale of the user e.g. 4. října 2016 for Czech user
* `<ui:buttoninput>user input</ui:buttoninput>`
 * renders a button with 'user input' text inside. Clicking the button will send the text as user input into chat-bot service
* `<ui:imageinput src="" alt="">user input</ui:buttoninput>`
 * same as buttoninput but the content of the button is an image
* `<ui:image src="" alt="" />`
 * replacement for HTML img tag, which does not render. Additionally shows full screen image on click
* `<ui:suggest text="user input" />`
 * rendered as a small button below main user input field. Contains the suggestion which is sent as user input when clicked
* `<ui:rnr id="123">HTML content of a document</ui:rnr>`
 * renders preview of a document from RnR service. Shows first 200 characters and the rest on click
 * has thumbs up and down buttons that send document feedback to the server `/api/rnrfeedback`. The data is JSON in the format:
 ```
 {
      id: '123', // id of the document
      feedback: 'positive', // or 'negative if user clicks on thumbs down
      context: {
         ... // the contents of the context that was sent with last conversation message from the server
      }
 }
 ```


## Authors

- Daniel Chabr, daniel_chabr@cz.ibm.com
- Petr Fejfar, petr_fejfar@cz.ibm.com
- Jakub Mikulasek, jakub_mikulasek@cz.ibm.com
- Peter Gerek, PGerek@cz.ibm.com
