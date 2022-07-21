#include <Lora.h>
#include <SPI.h>
#include <ESP32_LoRaWAN.h>
#include <WiFi.h>
#include <Arduino.h>

void setup() { Serial.begin(9600); }

void loop(){
  float sensorValue = analogRead(A0);
  Serial.print("Analog Value =");
  Serial.println(sensorValue);
  float voltage = (sensorValue / 1023) * 5;
  Serial.print("Voltage =");
  Serial.print(voltage);
  //correct low end jitter
  if(voltage < .02){
    voltage = 0;
  }
  Serial.println(" V");
  float wind_speed = mapfloat(voltage, 0.0, 2, 0, 32.4);
  float speed_mph = ((wind_speed *3600)/1609.344);
  Serial.print("Wind Speed =");
  Serial.print(wind_speed);
  Serial.println("m/s");
  Serial.print(speed_mph);
  Serial.println("mph");
  delay(3000);
}

float mapfloat(float x, float in_min, float in_max, float out_min, float out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
