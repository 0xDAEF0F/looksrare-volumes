import { SimpleIntervalJob, AsyncTask } from 'toad-scheduler'
// import { PrismaClient } from '@prisma/client'
// import { getLastDayExchangeLog } from 'api/utils/TheGraph/LooksRare/getLastXLogs'

// const prisma = new PrismaClient()

const task = new AsyncTask(
  'Update DB for latest exchange information',
  () => {
    return new Promise((res) =>
      setTimeout(() => {
        console.log('Running Job.')
        res()
      }, 0)
    )
  },
  (err: Error) => {
    console.log(err)
  }
)

export const job1 = new SimpleIntervalJob(
  { seconds: 30, runImmediately: true },
  task,
  'id_1'
)
