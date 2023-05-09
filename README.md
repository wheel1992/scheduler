# Scheduler

# Dependencies

- [`croner`](https://www.npmjs.com/package/croner)

# Usage

```js
const { Scheduler } = require('../dist/index');

// Create a new instance
const scheduler = new Scheduler({ verbose: true });

// Add and execute a job
scheduler.run({
  job: () => {
    console.log('Job 1');
  },
  jobName: 'job-1',
  immediate: true,
  immediateCallback: () => {
    console.log('Immediate callback called');
  },
  interval: '*/1 * * * *',
  delay: true,
  delayDuration: 1000,
});

// Stop an existing job
scheduler.stop('job-1');
```
