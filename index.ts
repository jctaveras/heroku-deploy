import { getInput, info, setFailed } from "@actions/core";
import { spawn } from "child_process";

import { herokuActionSetup } from "./lib/scripts";
import herokuLogin from "./lib/login";

const herokuAction = herokuActionSetup(getInput('app_name'));

herokuLogin()
  .then(async () => {
    const child = spawn(herokuAction('push'));

    child.stdout.on('data', (chunk) => info(chunk.toString()));
    info('Your Docker image was built and pushed to Heroku Container Registry.');
  })
  .then(async () => {
    const child = spawn(herokuAction('release'));

    child.stdout.on('data', (chunk) => info(chunk.toString()));
    info('Your Appliction was deployed successfully.')
  })
  .catch(error => {
    setFailed(`Something went wrong building your image. [Error]: ${(error as Error).message}`);
  })
