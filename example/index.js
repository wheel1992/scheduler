const { Scheduler } = require('../dist/index');

(async () => {
  const scheduler = new Scheduler({ verbose: true });
  scheduler.run({
    job: () => {
      console.log('Job 1');
    },
    jobName: 'job-1',
    immediate: true,
    immediateCallback: () => {
      console.log('Immediate callback called');
    },
    onError: () => {
      console.log('error');
    },
    interval: '*/1 * * * *',
    delay: true,
    delayDuration: 1000,
    timezone: 'Asia/Singapore',
  });

  process.on('SIGINT', () => {
    console.log('SIGINT!');
    scheduler.stop({ jobName: 'job-1' });
  });
})();
