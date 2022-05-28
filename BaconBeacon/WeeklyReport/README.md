# BEST (Beacon-Based Evacuation System and Technology)

### 1. Group members
- Hwawon Lee (Soongsil University)
- Dohyun Chung (Chungang University)
- Yoonha Bahng (Chungang University)
- Jiwon Lim (Kwangwoon University)
- Suhyun Park (Paichai University)
- Seongmin Kim (Kangwon National University)
- Myong Oh (Purdue University)


### 2. Project Period

    04-17-2022(SUN) ~ 08-04-2022(THU)


### 3. Project Title 
- Beacon-based Evacuation system & technology


### 4. Research problem statement
- Due to the limitation of current evacuation plan using EXIT sign, people feels hard to escape during actual situation of fire.


### 5. Research novelty (Significance)
- **High accuracy** of indoor localization using iBeacon

- Server sends **optimized evacuation route** to exit in **Real-Time**

- **Intuitive Escape Route**: using Augmented Reality (AR) to easily follow shortest path


### 6. Overview or diagram visual

 <p align="center">
   <img src="https://github.com/BeaconAR/BEST/blob/main/image/Overview.png" alt="Image Error"/>
</p>

![](./image/Overview.png)
##### Raspberry pi ↔ Cloud Server
- Raspberry pi → Cloud Server
  - Detect the fire with the temperature sensor and the humidity sensor

  - Sends out a HTTP request to the server to notify the fire

- Cloud Server → Raspberry pi
  - Service Check


##### Access Point & Beacons → Smartphone
- Access Point & Beacons → Smartphone
  - The smartphone start to collect UUID, Major, Minor value of the beacons

  - Calculates the RSSI of the access point and the beacons

  - Filters the data by Kalman Filter

##### Smartphone ↔ Cloud Server
- Smartphone → Cloud Server
  - Sends user's location

- Cloud Server → Smartphone
  - Update the optimal evacuation route in real-time


### 7. Environment settings
- Raspberry pi 3 & 4
  - Ubuntu 22.04 for Raspberry Pi
  - Raspberry pi OS

- Beacon using ESP32 (Planning to buy Beacons from Amazon due to fluctuation issue)
  - Arduino IDE version 1.8.13

- iOS Device (iPhone 12)
  - iOS 14.5 installed

- Android Device (Galaxy A31)
  - Android Studio
  - [Altbeacon](https://altbeacon.github.io/android-beacon-library/)



