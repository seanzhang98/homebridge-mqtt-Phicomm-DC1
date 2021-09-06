<p align="center">
  <a href="https://github.com/homebridge/homebridge"><img src="https://github.com/seanzhang98/homebridge-mqtt-Phicomm-DC1/raw/master/images/logo.png" height="240"></a>
</p>

<h1 align="center">
Homebridge MQTT Phicomm DC1 Powerstrip</h1>

[![npm version](https://badge.fury.io/js/homebridge-mqtt-phicomm-dc1-powerstrip.svg)](https://badge.fury.io/js/homebridge-mqtt-phicomm-dc1-powerstrip)

一款通过 MQTT 接入斐讯 DC1 排插的 Homebridge 插件。

## 安装

Run `npm install homebridge-mqtt-phicomm-dc1-powerstrip`

## 配置

需要刷入支持 MQTT 协议的固件，推荐参考 [qlwz/esp_dc1](https://github.com/qlwz/esp_dc1) 并使用该固件。

根据 Config UI 填写相关信息。
Topic 中的 {devicename} 需替换为固件中的主机名（位于控制页最下端），其他固件根据相应的 MQTT 格式进行填写。

## Acknowledgment

This plugin was heavily inspired by [homebridge-mqttthing](https://github.com/arachnetech/homebridge-mqttthing).

## License
[MIT](LICENSE)
