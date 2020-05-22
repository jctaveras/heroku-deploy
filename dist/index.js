module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(609);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 609:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const core = __webpack_require__(661);
const { promisify } = __webpack_require__(669);

const exec = promisify(__webpack_require__(129).exec);

async function loginHeroku() {
  const login = core.getInput('email');
  const password = core.getInput('api_key');

  try {
    await exec(`cat >~/.netrc <<EOF
    machine api.heroku.com
        login ${login}
        password ${password}
    EOF`);
    console.log('.netrc file create ✅');

    await exec(`echo ${password} | docker login --username=${login} registry.heroku.com --password-stdin`);
    console.log('Logged in succefully ✅');
  } catch (error) {
    core.setFailed(`Authentication process faild. Error: ${error.message}`);
  }
}

async function buildPushAndDeploy() {
  const appName = core.getInput('app_name');
  const dockerFilePath = core.getInput('dockerfile');
  const buildOptions = core.getInput('options') ? core.getInput('options') : "";
  
  try {
    await exec(`(cd ${dockerFilePath}; docker build . --file Dockerfile ${buildOptions} --tag registry.heroku.com/${appName}/web)`);
    console.log('Image built ✅');

    await exec(`(cd ${dockerFilePath}; docker push registry.heroku.com/${appName}/web)`);
    console.log('Container pushed to Heroku Container Registry ✅');

    await exec(`(cd ${dockerFilePath}; heroku container:release web --app ${appName})`);
    console.log('App Deployed successfully ✅');
  } catch (error) {
    core.setFailed(`Somthing went wrong building your image. Error: ${error.message}`);
  } 
}

try {
  loginHeroku();
  buildPushAndDeploy();
} catch (error) {
  console.log({ message: error.message });
  core.setFailed(error.message);
}


/***/ }),

/***/ 661:
/***/ (function(module) {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 669:
/***/ (function(module) {

module.exports = require("util");

/***/ })

/******/ });