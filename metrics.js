var SDC = require('statsd-client')
sdc = new SDC({port: 8125});

sdc.increment("USER_POST")
sdc.increment("USER_GET")
sdc.increment("USER_PUT")

sdc.increment("FILE_POST")
sdc.increment("FILE_GET")
sdc.increment("FILE_DELETE")

module.exports = sdc;