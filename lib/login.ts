import { getInput, info, setFailed } from "@actions/core";
import { exec } from "child_process";
import { promisify } from "util";

import { authenticationScript } from "./scripts";

export default async function herokuLogin() {
  try {
    const { stdout } = await promisify(exec)(authenticationScript(getInput('email'), getInput('api_key')));

    info('Logged in successfully. 🔐');
    info(`stdout: ${stdout}`)
  } catch (error) {
    setFailed(`Authentication process failed. Error: ${(error as Error).message}`);
  }
}
