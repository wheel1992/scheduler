const {Scheduler} = require('../dist/index');


  
(async () => { 
  const scheduler = new Scheduler({ debug: true })
  scheduler.run({
    job: () => { 
      console.log('Job 1')
    },
    jobName: 'job-1',
    immediate: true,
    immediateCallback: () => { 
      console.log('Immediate callback called')
    },
    interval: '*/1 * * * *',
    delay: true,
    delayDuration: 1000,
  })

  process.on('SIGINT', () => { 
    console.log('SIGINT!')
    scheduler.stop({ jobName: 'job-1'})
  })
})()



