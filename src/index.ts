import { RunConfig, StopRunConfig } from './types';
import Cron from 'croner';

export class Scheduler {
  private runners = new Map<string, Cron>()
  
  public run = (config: RunConfig) => {
    const {
      job,
      jobName,
      immediate,
      immediateCallback,
      interval,
      delay,
      delayDuration,
      debug,
    } = config;

    if (interval.length <= 0) {
      throw new Error('Interval must be provided')
    }

    if (jobName.length <= 0) {
      throw new Error('Job name must be provided')
    }

    if (!immediate) {
      setTimeout(
        () => {
          job();
          if (immediate && immediateCallback) {
            immediateCallback();
          }
        },
        delay ? delayDuration || 0 : 0,
      );
    }

    const instance = new Cron(interval, (self: Cron) => {
      job();

      if (debug) {
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
      console.info(`[Scheduler] Job ${jobName} has stopped`)
    } catch (e) {
      console.error(`[Scheduler] Unable to stop job ${jobName} due to ${e}`)
    } finally { 
      return 
    }
  }
}
