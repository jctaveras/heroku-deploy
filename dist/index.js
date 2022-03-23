"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const child_process_1 = require("child_process");
const util_1 = require("util");
const scripts_1 = require("./lib/scripts");
const login_1 = __importDefault(require("./lib/login"));
const herokuAction = (0, scripts_1.herokuActionSetup)((0, core_1.getInput)('app_name'));
(0, login_1.default)()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, util_1.promisify)(child_process_1.exec)(herokuAction('push'));
    (0, core_1.info)('Your Docker image was built and pushed to Heroku Container Registry.');
}))
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, util_1.promisify)(child_process_1.exec)(herokuAction('release'));
    (0, core_1.info)('Your Appliction was deployed successfully.');
}))
    .catch(error => {
    (0, core_1.setFailed)(`Something went wrong building your image. [Error]: ${error.message}`);
});
