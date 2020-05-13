# angry-panda

### Run

`npm run dev` - to start webpack watchers and the bundling process  
`npm start` - to start up project window  
`npm run test` - the run unit tests  

## Direectory Structure
- `src/assets` - where all static resources will live (such as the default .hbs template)  
- `src/lib` - any libraries used by project
- `src/windows` - each directory inside here houses a different electron window setup, including:
   - `index.js` - file that handles creating the BrowserWindow object
   - `script.js` - the main script file that inits execution of the window
   - `styles.scss` - the main stylesheet file for the window
