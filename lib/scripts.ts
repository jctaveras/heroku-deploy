import { getInput } from "@actions/core"

type Actions = 'push' | 'release';

export const authenticationScript = (username: string, password: string) => 
  `echo ${password} | docker login --username=${username} registry.heroku.com --password-stdin`;

export const herokuActionSetup = (appName: string) => {
  return (action: Actions) => {
    const HEROKU_API_KEY = getInput('api_key');
    const contextPath = getInput('dockerfile_path');
    const processType = getInput('process_type');

    return action === 'push'
      ? `HEROKU_API_KEY=${HEROKU_API_KEY} heroku container:${action} \
          --recursive \
          --context-path ${contextPath} \
          --app ${appName}`
      : `HEROKU_API_KEY=${HEROKU_API_KEY} heroku container:${action} ${processType}`;
  }
}
