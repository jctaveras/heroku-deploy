import { getInput, info, setFailed } from "@actions/core";
import { promisify } from "util";
import { exec } from "child_process";

import { herokuActionSetup } from "./lib/scripts";
import herokuLogin from "./lib/login";

const herokuAction = herokuActionSetup(getInput('app_name'));

herokuLogin()
  .then(async () => {
    const { stdout } = await promisify(exec)(herokuAction('push'));

    info(`stdout: ${stdout}`);
    info('Your Docker image was built and pushed to Heroku Container Registry.');
  })
  .then(async () => {
    const { stdout } = await promisify(exec)(herokuAction('release'));

    info(`stdout: ${stdout}`);
    info('Your Appliction was deployed successfully.');
  })
  .catch(error => {
    setFailed(`Something went wrong building your image. [Error]: ${(error as Error).message}`);
  })
