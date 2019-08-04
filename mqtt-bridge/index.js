const mosquitto = require('mqtt')
const pg = require('pg')
const postgres = new pg.Client({
  connectionString: "postgresql://postgres:mvB0@postgres:5432/postgres"
})

async function main() {
  try {
    var mqtt  = mosquitto.connect(`mqtt://${process.env.MQTT_HOST}`, {
      username: `${process.env.MQTT_USER}`,
      password: `${process.env.MQTT_PASS}`
    })
    mqtt.subscribe([ '#', '$SYS/#' ])
    await postgres.connect()
    
    mqtt.on('message', async function (topic, message) {
      // console.log(`${topic}: ${message}`)
      let payload = {}
      try {
        payload = JSON.parse(message)
      } catch(error) { }

      try {
        await postgres.query({
          text: 'INSERT INTO mqtt_messages(topic, message, payload) VALUES($1, $2, $3)',
          values: [topic.toString(), message, payload],
        })
      } catch (error) {
        console.error(error)
      }
    })
  } catch (error) {
    console.error(error)
  }
  
}
main()
