# ⚡KSW 2022 Spring Program Project by TEAM_IIEEE⚡

<hr>

📑 **Project Title**

A Comparison Distributed Systems before and after using Kubernetes for Smart Farm Visualization Platform based on LoRaWAN

📅 **Project Period**

04-18-2022 (Mon) ~ 08-05-2022 (Fri)

🧖🏻‍♀️ **Problem Statement**

  According to recent population growth, agriculture has become an important thing all around the world. Thus, meticulous farm management has also become a critical thing for crop yield. To solve the problem, IoT has been applied in farming.
  In particular, America with large land already uses the IoT on their farm. In addition, a data platform service for farmers has emerged. 

  As the service grows, the number of data increases. When a large amount of data is collected, data traffic appears, and load balancing has been performed to handle bottleneck phenomena and overloads. However, load balancing has its disadvantage.  It can not able to auto-scale system and self-healing, so it cannot be recovered when one server shuts down.
  
  To solve this problem, Kubernetes, which can automatically scale bottleneck phenomenon and system loads and self-healing, have applied to efficiently manage systems. Therefore, this paper conveys the performance of Kubernetes by comparing them before and after applying Kubernetes to distributed systems.

📖 **Considerations**

🥕Software : Develop an distributed computing system with Load Balancer and Kubernetes. 

🥕Hardware : Build own server based on LoRaWAN with ESP32. 

💡 **Novelty**

1. Comparison of distributed computing system before and after using Kubernetes!

=> Our topic is A Comparison of Distributed Systems before and after using Kubernetes for Smart Farm Visualization Platform based on LoRaWAN. We compare Traditional load balancer with ochestration tool, Kubernetes.


2. Building data visualization platform for Smart Farm based on LoRaWAN! 

=> IoT enables farmers to manage overall farms meticulously. There are many IoT network systems for agriculture. Among them, especially LoRaWAN is implemented in farming. It is suitable for IoT which should be able to cover wide range and get many sensing data. According to this advantage, many nations use LoRaWAN network protocol in farms. LoRaWaN can cover 2-5km in urban, 15km in rural.

🏛 **System Overview**

![new-system-architecture](https://user-images.githubusercontent.com/77658361/170851189-5a318b33-27a4-4b6d-9b25-6699d9230cad.png)

1. The farm data is transmitted to the gateway through LoRa communication.

- Due to the time constraints, it is impossible to build own LoRaWAN. The real farm data comes from only one farm, and the rest comes from ThingBoard API. However, the settings from the API are different from those from the real farm environment because the API communicates with Wifi. Therefore, LoRa communication is performed using ESP32 to set and simulate the same as the real farm environment.

2. The gateway sends the data to Chirpstack server which is a network server supporting LoRa communication.

3. The data arrives in the Cloud from the Chirpstack server using HTTP protocol.

4. The master node continuously monitors the worker node and self-healing when a problem occurs. In addiction, as the overload occurs, the load is distributed by auto-scaling.

🖥️ **Environment Setting**

✔️ macOS Monterey version 12.3.1

✔️ window10 OS Home version 21H1

✔️ React version 18.0.0

✔️ Spring Boot 2.7.0

✔️ Docker version 4.8.1

✔️ Kubernetes version 1.24.0

✔️ Google Cloud Platform

✔️ Elastic Load Balancing from AWS

✔️ Arduino IDE version 1.8.19

✔️ ESP 32 LoRa version 2

📤 **Installation**

~~$ git clone https://github.com/MINJILEE-PURDUE/KSW_2021_Fall_Program.git~~

~~$ cd thomas~~

👨‍👩‍👧‍👧 **Collaborator**

👩‍💻Sungjin Park

-Chunbuk National University

-Major in Computer Science and Engineering

-huitseize@chungbuk.ac.kr

-[https://github.com/L-o-g-a-n](https://github.com/L-o-g-a-n)

🎅🏻Gayoung Yeom

-Hankuk University of Foreign Studies

-Major in Computer and Electronic System

-gayoung@hufs.ac.kr

-[https://github.com/gayoungyeom](https://github.com/gayoungyeom)

👰Dayeon Won

-Kwangwoon University

-Major in Information of Convergence

-aakk9350@kw.ac.kr

-[https://github.com/dazzel3](https://github.com/dazzel3)

👩‍🚀Haegyeong Im

-Soongsil University

-Major in AI Convergence

-fine632@soongsil.ac.kr

-[https://github.com/iamhge](https://github.com/iamhge)

Minji Kim

-Jeju National University

-Major in Fashion designing & textiles and Computing engineering

-minzyk0729@jejunu.ac.kr

-[https://github.com/minzzz0729](https://github.com/minzzz0729)

👨🏻‍💼Xavier Lopez

-Purdue University

-Major in Cybersecurity and Network Engineering

-lopezx@purdue.edu
