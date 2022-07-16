# Raspberry Pi Coding

## Devices
Raspberry Pi 4

DHT11 Sensor

## Python-based beacon scanner
it collects beacon's minor ID in 10 seconds, and send uncollected beacon's minor ID to server.
Looping the function above.

### Useage
```
sudo python3 scanner.py
```

## Python-based temperature and humidity sensing program
Collects the temperature and humidity data, and sends to server.
if temperature and humidity is as close as fire situation, server will decide that it is fire.

### Useage 
```
python3 sensor.py
```

# Arduino Coding

## Devices
ESP32

DHT11 Sensor

## Arduino-based temperature and humidity sensing program
Collects temperature and humidity data, and sends to server.
if temperature and humidity is as close as fire situation, server will decide that it is fire.

### Dependency
Arduino IDE
### Library
ArduinoJSON, WiFi, Adafruit Unified Sensor, DHT sensor library, HttpClient, WiFiConnect
