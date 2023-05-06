import { DefaultConfig, RunConfig, StopRunConfig } from './types';
import Cron from 'croner';

export class Scheduler {
  private debug?: boolean;
  private runners = new Map<string, Cron>()
  
  constructor(config?: DefaultConfig) {
    this.debug = config ? config.debug : false
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
    } = config;

    if (interval.length <= 0) {
      throw new Error('Interval must be provided')
    }

    if (jobName.length <= 0) {
      throw new Error('Job name must be provided')
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

    const instance = new Cron(interval, (self: Cron) => {
      job();

      if (this.debug) {
        const previousRunDate = self.previousRun()
        const nextRunDate = self.nextRun()
        
        console.info(`[Scheduler] Job: ${jobName}`,
          `Previous run: ${previousRunDate ? previousRunDate.toISOString() : '<no previous run>'}`,
          `Next run: ${nextRunDate ? nextRunDate.toISOString() : '<no next run>'}`,
        )
      }
    });

    this.runners.set(jobName, instance)
  };

  public stop = (config: StopRunConfig) => {
    const { jobName } = config
    if (!this.runners.has(jobName)) {
      throw new Error(`[Scheduler] Unable to stop job ${jobName} due to non-existence`)
    }

    const run = this.runners.get(jobName)
    
    if (run.isStopped()) {
      return
    }
    
    try {
      run.stop()
      if (this.debug) {
        console.info(`[Scheduler] Job ${jobName} has stopped`)
      }
    } catch (e) {
      if (this.debug) { 
        console.error(`[Scheduler] Unable to stop job ${jobName} due to ${e}`)
      }
    } finally { 
      return 
    }
  }
}
