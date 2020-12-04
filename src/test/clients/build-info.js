import dateFormat from 'dateformat'
import moment from 'moment-timezone'

const RUN =
  dateFormat(new Date(), "yyyy-MM-dd'T'hh:mm:ss.l ") +
  moment()
    .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
    .zoneAbbr()
export const BUILD = `${process.env.GITHUB_RUN_ID ||
  /* istanbul ignore next: only gets executed locally */ 'LOCAL'}-${process.env
  .GITHUB_RUN_NUMBER ||
  /* istanbul ignore next: only gets executed locally */ RUN}`
