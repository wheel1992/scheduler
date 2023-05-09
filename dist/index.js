"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduler = void 0;
const croner_1 = __importDefault(require("croner"));
class Scheduler {
    debug;
    runners = new Map();
    constructor(config) {
        this.debug = config ? config.debug : false;
    }
    run = (config) => {
        const { job, jobName, immediate, immediateCallback, interval, delay, delayDuration, timezone, onError, } = config;
        if (interval.length <= 0) {
            throw new Error('Interval must be provided');
        }
        if (jobName.length <= 0) {
            throw new Error('Job name must be provided');
        }
        if (immediate) {
            setTimeout(() => {
                job();
                if (immediateCallback)
                    immediateCallback();
            }, delay ? delayDuration || 0 : 0);
        }
        const instance = new croner_1.default(interval, {
            catch: (e, job) => {
                if (onError)
                    onError();
                if (this.debug) {
                    console.error(`[Scheduler] Job: ${job.name} error: ${e}`);
                }
            },
            timezone,
        }, (self) => {
            job();
            if (this.debug) {
                const previousRunDate = self.previousRun();
                const nextRunDate = self.nextRun();
                console.info(`[Scheduler] Job: ${jobName}`, `Previous run: ${previousRunDate ? previousRunDate.toISOString() : '<no previous run>'}`, `Next run: ${nextRunDate ? nextRunDate.toISOString() : '<no next run>'}`);
            }
        });
        this.runners.set(jobName, instance);
    };
    stop = (config) => {
        const { jobName } = config;
        if (!this.runners.has(jobName)) {
            throw new Error(`[Scheduler] Unable to stop job ${jobName} due to non-existence`);
        }
        const run = this.runners.get(jobName);
        if (run.isStopped()) {
            return;
        }
        try {
            run.stop();
            if (this.debug) {
                console.info(`[Scheduler] Job ${jobName} has stopped`);
            }
        }
        catch (e) {
            if (this.debug) {
                console.error(`[Scheduler] Unable to stop job ${jobName} due to ${e}`);
            }
        }
        finally {
            return;
        }
    };
}
exports.Scheduler = Scheduler;
//# sourceMappingURL=index.js.map