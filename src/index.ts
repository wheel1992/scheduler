import { DefaultConfig, RunConfig, StopRunConfig } from './types';
import Cron from 'croner';

export class Scheduler {
  private verbose?: boolean;
  private runners = new Map<string, Cron>();

  constructor(config?: DefaultConfig) {
    this.verbose = config ? config.verbose : false;
  }

  public run = (config: RunConfig) => {
    const {
      job,
      jobName,
      immediate,
      immediateCallback,
      interval,
      delay,
      delayDuration,
      timezone,
      onError,
    } = config;

    if (interval.length <= 0) {
      throw new Error('Interval must be provided');
    }

    if (jobName.length <= 0) {
      throw new Error('Job name must be provided');
    }

    if (immediate) {
      setTimeout(
        () => {
          job();
          if (immediateCallback) immediateCallback();
        },
        delay ? delayDuration || 0 : 0,
      );
    }

    const instance = new Cron(
      interval,
      {
        catch: (e: any, job) => {
          if (onError) onError();
          if (this.verbose) {
            console.error(`[Scheduler] Job: ${job.name} error: ${e}`);
          }
        },
        timezone,
      },
      (self: Cron) => {
        job();

        if (this.verbose) {
          const previousRunDate = self.previousRun();
          const nextRunDate = self.nextRun();

          console.info(
            `[Scheduler] Job: ${jobName}`,
            `Previous run: ${
              previousRunDate
                ? previousRunDate.toISOString()
                : '<no previous run>'
            }`,
            `Next run: ${
              nextRunDate ? nextRunDate.toISOString() : '<no next run>'
            }`,
          );
        }
      },
    );

    this.runners.set(jobName, instance);
  };

  public stop = (config: StopRunConfig) => {
    const { jobName } = config;
    if (!this.runners.has(jobName)) {
      throw new Error(
        `[Scheduler] Unable to stop job ${jobName} due to non-existence`,
      );
    }

    const run = this.runners.get(jobName);

    if (run.isStopped()) {
      return;
    }

    try {
      run.stop();
      if (this.verbose) {
        console.info(`[Scheduler] Job ${jobName} has stopped`);
      }
    } catch (e) {
      if (this.verbose) {
        console.error(`[Scheduler] Unable to stop job ${jobName} due to ${e}`);
      }
    } finally {
      return;
    }
  };
}
