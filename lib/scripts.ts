import * as core from "@actions/core"

type Actions = 'push' | 'release';

export const authenticationScript = (username: string, password: string) => 
  `echo ${password} | docker login --username=${username} registry.heroku.com --password-stdin`;

export const herokuActionSetup = (appName: string) => {
  return (action: Actions) => {
    const HEROKU_API_KEY = core.getInput('api_key');
    const contextPath = core.getInput('dockerfile_path'); 

    return `HEROKU_API_KEY=${HEROKU_API_KEY} heroku container:${action} \
      --recursive \
      --context-path ${contextPath} \
      --app ${appName}`;
  }
}
