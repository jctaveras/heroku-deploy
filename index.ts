import { getInput, info, setFailed } from "@actions/core";
import { exec } from "child_process";

import { herokuActionSetup } from "./lib/scripts";
import herokuLogin from "./lib/login";

const herokuAction = herokuActionSetup(getInput('app_name'));

herokuLogin()
  .then(async () => {
    const child = exec(herokuAction('push'), { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) throw new Error(`stderr: ${stderr}`);

      info(`stdout: ${stdout}`);
    });

    child.on('close', () => info('Your Docker image was built and pushed to Heroku Container Registry.'));
    child.on('error', (err) => { throw new Error(err.message) });
  })
  .then(async () => {
    const child = exec(herokuAction('release'), { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) throw new Error(`stderr: ${stderr}`);

      info(`stdout: ${stdout}`);
    });

    child.on('close', () => info('Your Appliction was deployed successfully.'));
    child.on('error', (err) => { throw new Error(err.message) });
  })
  .catch(error => {
    setFailed(`Something went wrong building your image. [Error]: ${(error as Error).message}`);
  })
