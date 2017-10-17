# LiveDashboard
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0.

## Development
### Development server
1. Copy file `index.tpl.html` and rename it to `index.html` (in the same path)
2. Fill all params at the new file.
3. Run `ng serve` for a dev server.
4. Navigate to `http://localhost:4200/dev`

### ClientLib Setup
1. Open folder 'kaltura-typescript-client-custom' in terminal.
2. Run npm link
3. Open application root folder (where package.json exists).
4. Run npm link kaltura-typescript-client

### Build
Run `ng build` to build the project. 
The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

1. Open terminal and move to project's folder.
2. Run the following build command: `ng build -bh /apps/liveDashboard/{version} --env=prod` where {version} is the version of the build (e.g. v0.1.20).
3. Remove the folder `dev` from the new `dist` folder that was created after the build.
4. Rename `dist` folder to the version name.
5. Zip the renamed folder.

## Deployment instructions
### KMC Deployment

1. Go to kmc-live-dashboard repository in GitHub.
2. Under `releases` locate the desired version you wish to deploy.
3. Download the zip file do the following directory: `/opt/kaltura/apps/liveDashboard`.
4. Unzip the file and make sure folder contains the bew version (e.g. /opt/kaltura/apps/liveDashboard/v0.1.20). 

Note: In order for KMC to run the new version it must match the liveDashboard version in the base.ini configuration file! 

## Testing Section ##

## Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
