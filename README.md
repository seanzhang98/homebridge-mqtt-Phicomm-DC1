# Homebridge MQTT Power Strip

 [![npm version](https://img.shields.io/npm/v/homebridge-mqtt-power-strip)](https://www.npmjs.com/package/homebridge-mqtt-power-strip) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A Homebridge plugin to create grouped switches to control a power strip through MQTT.

## Installation

Run `npm install homebridge-mqtt-power-strip -g`

## Configuration

**Note**: The `{id}` string in the topics is replaced by a number (starting by one) representing each relay. So for the first relay the `{id}` will be replaced by `1` and so on. The maximum number is `relayCount`. Instead of numbers you can use your custom strings by using the `ids` key in the config (see below).

| Key | Subkey | Required | Default Value | Note |
|-----|--------|----------|---------------|------|
| accessory | | Yes | | Must be 'mqttPowerStrip'. |
| name | | Yes | | The name of your power strip. |
| manufacturer | | No | Oxixes | The manufacturer of the power strip. |
| model | | No | MQTT Power Strip | The model of the power strip. |
| serial | | No | 00N00 | The serial number of the power strip. |
| relayCount | | Yes | | The amount of relays your power strip has (as int). |
| mqtt | | Yes | | The MQTT configuration. |
| | host | Yes | | The MQTT host. |
| | port | Yes | | The MQTT port (as int). |
| | username | No | | The username to log in. |
| | password | No | | The password to log in. |
| | qos | No | 1 | The Quality Of Service (subscribe and pusblish). |
| | reconnectInterval | No | 2000 (ms) | The time between reconnections when the connection is lost with the broker (in ms). |
| | connectTimeout | No | 10000 (ms) | The time to timeout with the broker (in ms). |
| | maxErrorCount | No | 10 | Maximum time of reconnection attempts with the broker until the plugin gives up. You can use -1 to disable it. |
| topics | | Yes (at least one topic is needed) | | An object with the topics. |
| | setOn | No | | The topic to set a relay state. Use `{id}` in the topic for it to be replaced  with a number from 1 - relayCount (see [config. example](example-config.json)). |
| | getOn | No |  | The topic to get a relay state. Use `{id}` in the topic for it to be replaced  with a number from 1 - relayCount (see [config. example](example-config.json)). |
| | retrieve | No | | An object that contains the topics needed to retrieve the state of the relays at boot.
| | notify (inside retrieve) | No | | A topic to sent a message to retrieve the data. You can use `{id}`. |
| | get (inside retrieve) | No | | A topic to receive the state of each relay. You can use `{id}` and if it's the same topic as the getOn, you don't need to specify it. |
| | message (inside retrieve) | No | | The message to be sent on the notify topic. If it is not specified an empty message is sent. |
| names | | No | An array with `"{name} Switch {id}"` i.e. `Test power strip Switch 1` | An array that contains the name for each id IN ORDER, so the first element is the first id and so on. |
| ids | | No | An array with the numbers 1 to `relayCount` | An array that contains the IDs for each device IN ORDER, so the first element is the first name and so on. |
| onValue | | No | `"true"` | The value the device sends as 'on'. |
| offValue | | No | `"false"` | The value the device sends as 'off'. |

## Roadmap

- [ ] Add support for SSL on the MQTT connection.
- [x] Allow to specify custom ids instead of numbers from 1 - relayCount.
- [ ] Log less errors when something occurs.
- [ ] Add ability to detect when the power strip goes online or offline.
- [ ] Add UI support.

## Bugs

If you discover a bug, please open an issue and I will try to solve it as fast as I can. Please provide the logs (the console output) and configuration file (only the relevant part) and be careful to not provide the MQTT username and password (replace those values with other ones) when submitting the issue.

## Acknowledgment

This plugin was heavily inspired by [homebridge-mqttthing](https://github.com/arachnetech/homebridge-mqttthing).

## License
[MIT](LICENSE)
