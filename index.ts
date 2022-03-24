import { getInput, info, setFailed } from "@actions/core";
import { exec } from "child_process";
import { promisify } from "util";

import { herokuActionSetup } from "./lib/scripts";
import herokuLogin from "./lib/login";

const herokuAction = herokuActionSetup(getInput('app_name'));

herokuLogin()
  .then(async () => {
    await promisify(exec)(herokuAction('push'));
    info('Your Docker image was built and pushed to Heroku Container Registry.');
  })
  .then(async () => {
    await promisify(exec)(herokuAction('release'));
    info('Your Appliction was deployed successfully.')
  })
  .catch(error => {
    setFailed(`Something went wrong building your image. [Error]: ${(error as Error).message}`);
  })
