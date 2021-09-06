var mqtt = require('mqtt')

var Service, Characteristic, HomebridgeAPI, UUIDGen;
var that;

module.exports = function(homebridge) {

  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  HomebridgeAPI = homebridge;
  UUIDGen = homebridge.hap.uuid;
  homebridge.registerAccessory("homebridge-mqtt-Phicomm-DC1", "mqttPhicommDC1", PowerStrip);
}

function PowerStrip(log, config) {
  this.log = log;
  this.config = config;
  this.name = config.name;
  this.services = [];
  this.ids = [];

  if (!config) {
    return;
  }

  if (!this.name) {
    this.log("\x1b[31mName not specified!\x1b[0m");
    return;
  } else if (!config.mqtt) {
    this.log("\x1b[31mMQTT config not specified!\x1b[0m");
    return;
  } else if (!config.mqtt.host || !config.mqtt.port) {
    this.log("\x1b[31mYou need to specify the MQTT host and port!\x1b[0m");
    return;
  } else if (!config.topics || (!config.topics.getOn && !config.topics.setOn)) {
    this.log("\x1b[31mYou need to specify the topics!\x1b[0m");
    return;
  }

   // TODO Allow SSL.
  var mqttOptions = {
    port: config.mqtt.port,
    clientId: 'homebridge_' + this.name,
    username: config.mqtt.username,
    password: config.mqtt.password,
    reconnectPeriod: config.mqtt.reconnectInterval || 2000,
    connectTimeout: config.mqtt.connectTimeout || 10000
  }

  this.mqttClient = mqtt.connect('mqtt://' + config.mqtt.host, mqttOptions);
  this.mqttClient.on('message', this.mqttMessage);
  this.mqttClient.on('connect', this.mqttConnect);
  this.mqttClient.on('error', this.mqttError);

  this.mqttErrorCount = 0;
  this.maxMqttErrorCount = config.mqtt.maxErrorCount || 10;

  var informationService = new Service.AccessoryInformation();

  informationService
    .setCharacteristic(Characteristic.Manufacturer, 'Phicomm')
    .setCharacteristic(Characteristic.Model, 'DC1')
    .setCharacteristic(Characteristic.SerialNumber, config.serial || "SN02311D6F200")
    .setCharacteristic(Characteristic.FirmwareRevision, "1.0.0");

  for (let i = 0; i < 4; i++) {
    if (config.ids && config.ids[i]) {
      this.ids.push(config.ids[i]);
    } else {
      this.ids.push((i + 1).toString());
    }

    let uuid = UUIDGen.generate(this.name + i);
    let name;

    if (this.config.names && this.config.names[i]) {
      name = this.config.names[i];
    } else {
      name = this.name + "开关" + (i + 1);
    }

    let switchService = new Service.Outlet(name, uuid);
    switchService.getCharacteristic(Characteristic.On)
      .on('set', this.setOn.bind(this, i));

    this.services.push(switchService);
  }

  this.services.push(informationService);

  that = this;
}

PowerStrip.prototype.mqttConnect = function() {
  that.log("Successful conection to " + that.config.mqtt.host + ":" + that.config.mqtt.port);

  that.mqttGetOnTopics = [];

  if(that.config.topics.getOn) {
    for (i = 0; i < 4; i++) {
      let topic = that.config.topics.getOn.replace(/{id}/, that.ids[i]);
      that.mqttClient.subscribe(topic, {'qos': that.config.mqtt.qos || 1});
      that.mqttGetOnTopics.push([topic, i]);
    }
  }

  if (that.config.topics.retrieve) {
    if (that.config.topics.retrieve.notify) {
      if (that.config.topics.retrieve.get) {
        for (i = 0; i < 4; i++) {
          let topic = that.config.topics.retrieve.get.replace(/{id}/, that.ids[i]);
          that.mqttClient.subscribe(topic, {'qos': that.config.mqtt.qos || 1});
          that.mqttGetOnTopics.push([topic, i]);
        }
      }
      for (i = 0; i < 4; i++) {
        let topic = that.config.topics.retrieve.notify.replace(/{id}/, that.ids[i]);
        that.mqttClient.publish(topic, that.config.topics.retrieve.message || '', {'qos': that.config.mqtt.qos || 1});
      }
    } else {
      that.log("\x1b[31mYou need to specify the notify topic to retrieve the state!\x1b[0m");
    }
  }
}

PowerStrip.prototype.mqttError = function(err) {
  that.log("\x1b[31mAn error has ocurred while connecting to mqtt broker: " + err + "\x1b[0m");
  that.mqttErrorCount++;
  if (that.mqttErrorCount >= that.maxMqttErrorCount) {
    that.mqttClient.end();
  }
}

PowerStrip.prototype.mqttMessage = function(topic, msg, packet) {
  if (that.checkValueInArrayOfArrays(topic, that.mqttGetOnTopics)) {
    let id = that.checkValueInArrayOfArrays(topic, that.mqttGetOnTopics)[1];
    if (msg == (that.config.onValue || "true")) {
      that.services[id].getCharacteristic(Characteristic.On).updateValue(true);
    } else if (msg == (that.config.offValue || "false")) {
      that.services[id].getCharacteristic(Characteristic.On).updateValue(false);
    } else {
      that.log("\x1b[31mThe received value on the getOn topic (" + msg + ") is not one of the accepted values, state cannot be set.\x1b[0m");
    }
  }
}

PowerStrip.prototype.setOn = function (id, on, callback) {
  if (this.config.topics.setOn) {
    let topic = this.config.topics.setOn.replace(/{id}/, this.ids[id]);
    if (on) {
      this.mqttClient.publish(topic, this.config.onValue || "true", {'qos': that.config.mqtt.qos || 1});
    } else {
      this.mqttClient.publish(topic, this.config.offValue || "false", {'qos': that.config.mqtt.qos || 1});
    }
    callback();
  } else {
    this.log("\x1b[31msetOn topic has not been specified so the state can't be set\x1b[0m");
    callback(on);
  }
}

PowerStrip.prototype.getServices = function() {
  return this.services;
};

PowerStrip.prototype.checkValueInArrayOfArrays = function(value, array) {
  let arrayToReturn = null;

  array.forEach(i => {
    i.forEach((j, n, arr) => {
      if (j == value) {
        arrayToReturn = arr;
      }
    });
  });

  return arrayToReturn;
}
