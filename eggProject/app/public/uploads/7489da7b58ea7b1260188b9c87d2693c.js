const mt = require('mqtt')
export const mqtt = {
  data () {
    return {
      client: {}
    }
  },
  methods: {
    // 订阅
    subscribe (obj, cb) {
      // console.log(this.client)
      this.client.subscribe(obj)
      this.client.on('message', function (topic, message) {
        // message is Buffer
        // console.log('top:', topic)
        // console.log('message:', message.toString())
        cb(message.toString())
      })
    },

    // 发布
    publish (topic, message, cb = null) {
      this.client.publish(topic, message, cb)
    },
    // 取消订阅
    unsubscribe (obj) {
      this.client.unsubscribe(obj)
      this.client.end()
    }
  },
  mounted () {
    // console.log(this.mqttType)
    if (this.$route.query.mqttType === 'publish') {
      this.client = mt.connect('ws://192.168.0.112:61623/', { username: 'admin', password: 'password', clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8) })
    } else {
      this.client = mt.connect('ws://192.168.0.112:61623/', { username: 'test', password: 'test', clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8) })
    }
    this.client.on('error', (error) => {
      console.log(error)
    })
  }
}
