const core = require('@actions/core');
const { promisify } = require('util');

const exec = promisify(require('child_process').exec);

async function loginHeroku() {
  const login = core.getInput('email');
  const password = core.getInput('api_key');

  try {	
    await exec(`echo ${password} | docker login --username=${login} registry.heroku.com --password-stdin`);	
    console.log('Logged in succefully ✅');	
  } catch (error) {	
    core.setFailed(`Authentication process faild. Error: ${error.message}`);	
  }	
}

async function buildPushAndDeploy() {
  const appName = core.getInput('app_name');
  const dockerFilePath = core.getInput('dockerfile_path');
  const buildOptions = core.getInput('options') || '';
  const herokuAction = herokuActionSetUp(appName);
  const formation = core.getInput('formation');
  
  try {
    await exec(`cd ${dockerFilePath}`);

    await exec(`docker build . --file Dockerfile ${buildOptions} --tag registry.heroku.com/${appName}/${formation}`);
    console.log('Image built 🛠');

    await exec(herokuAction('push'));
    console.log('Container pushed to Heroku Container Registry ⏫');

    await exec(herokuAction('release'));
    console.log('App Deployed successfully 🚀');
  } catch (error) {
    core.setFailed(`Something went wrong building your image. Error: ${error.message}`);
  } 
}

/**
 * 
 * @param {string} appName - Heroku App Name
 * @returns {function}
 */
function herokuActionSetUp(appName) {
  /**
   * @typedef {'push' | 'release'} Actions
   * @param {Actions} action - Action to be performed
   * @returns {string}
   */
  return function herokuAction(action) {
    const HEROKU_API_KEY = core.getInput('api_key');
    const exportKey = `HEROKU_API_KEY=${HEROKU_API_KEY}`;
  
    return `${exportKey} heroku container:${action} web --app ${appName}` 
  }
}

loginHeroku()
  .then(() => buildPushAndDeploy())
  .catch((error) => {
    console.log({ message: error.message });
    core.setFailed(error.message);
  })
