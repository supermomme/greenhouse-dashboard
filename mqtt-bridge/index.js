var mosquitto = require('mqtt')
var mqtt  = mosquitto.connect('mqtt://192.168.1.232', {
  username: 'ubuntu',
  password: '1234'
})

const Influx = require('influx');
const influx = new Influx.InfluxDB({
 host: 'influxdb',
 database: 'greenhouse_db',
 username: 'admin',
 password: 'admin',
 schema: [
   {
     measurement: 'greenhouse_topics',
     fields: {
       topic: Influx.FieldType.STRING,
       message: Influx.FieldType.STRING,
       value: Influx.FieldType.INTEGER
     },
     tags: []
   }
 ]
})

const subscribedTopics = [
  'greenhouse/temperature/+',
  'greenhouse/humidity/+'
]

mqtt.subscribe(subscribedTopics)

mqtt.on('message', function (topic, message) {
  console.log(`${topic}: ${message}`)
  influx.writePoints([
    {
      measurement: 'greenhouse_topics',
      fields: {
        topic,
        message,
        value: Number(message)
      }
    }
  ])
})
