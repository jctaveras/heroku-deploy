import * as core from "@actions/core";
import { exec } from "child_process";
import { promisify } from "util";

import { authenticationScript } from "./scripts";

export default async function herokuLogin() {
  try {
    await promisify(exec)(authenticationScript(core.getInput('email'), core.getInput('password')));
    core.info('Logged in successfully.');
  } catch (error) {
    core.setFailed(`Authentication process failed. Error: ${(error as Error).message}`);
  }
}
