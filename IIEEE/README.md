# ⚡KSW 2022 Spring Program Project by TEAM_IIEEE⚡


📑 **Project Title**

Performance Evaluation of Containerized Systems before and after using Kubernetes for Smart Farm Visualization Platform based on LoRaWAN.

📅 **Project Period**

04-18-2022 (Mon) ~ 08-05-2022 (Fri)

🧖🏻‍♀️ **Problem Statement**

  According to recent population growth, agriculture has become an important thing all around the world and meticulous farm management has also become a critical thing for crop yield. To solve the problem, IoT has been applied in farming.
  In particular, the United States with large land already uses the IoT on their farm and most smart farms use LoRa which is a Low Power Wide Area Network for reliable communication. 
  
  Thus, this project designed a data visualization platform for farmers who have smart farms based on LoRaWAN. In addition, Kubernetes is introduced to the platform to improve efficiency. Kubernetes is an open-source that has some advantages such as monitoring, auto-scaling, and self-healing. 
  
  The application with Kubernetes is expected to be highly effective in terms of its management, performance, and resource. Therefore, in this paper, the efficiency of data processing performance is investigated by comparing before and after Kubernetes.


📖 **Considerations**

🥕Software : Develop a web interface and server with Load Balancer and Kubernetes. 

🥕Hardware : Build own server based on LoRaWAN with ESP32. 

💡 **Novelty**

1. Analysis of the performance of the platform before and after using Kubernetes!

=> Our topic is Performance Evaluation of Containerized Systems before and after using Kubernetes. We analyze the data processing performance by comparing before and after Kubernetes.

2. Building data visualization platform for Smart Farm based on LoRaWAN! 

=> IoT enables farmers to manage overall farms meticulously. There are many IoT network systems for agriculture. Among them, especially LoRaWAN is suitable for IoT which should be able to cover a wide range and get a lot of sensing data. According to this, most smart farms use the LoRaWAN network protocol on farms. LoRaWaN can cover 2-5km in urban, and 15km in rural with low-power batteries.

🏛 **System Overview**

![system-architecture](https://user-images.githubusercontent.com/42757774/182229585-ab2bb044-4714-4048-9c89-dab665c109f1.png)


1. The farm data from Openweather API server is transmitted to the gateway through a device, ESP LoRa 32.

- The settings from the API are different from the real farm environment because the API communicates with Wifi. Therefore, LoRa communication is performed using ESP32 to set and simulate the same as the real farm environment.

2. The LoRa gateway by SENET sends the data to LoRaWAN server which is a network server supporting LoRa communication.

3. The data arrives in the Cloud from the LoRaWAN server using HTTP protocol.

4. The master node continuously monitors the worker node and self-healing when a problem occurs. In addiction, as the overload occurs, the load is distributed by auto-scaling.

🖥️ **Environment Setting**
<p align="left">
  <img src="https://img.shields.io/badge/Kubernetes-black?logo=kubernetes"/>
  <img src="https://img.shields.io/badge/Docker-black?logo=docker"/>
  <img src="https://img.shields.io/badge/Spring-black?logo=spring"/>
  <img src="https://img.shields.io/badge/React-black?logo=react"/>
</p>

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


💻 **Coding & Github message convention**  
##### Conding convention
- Variable name: caMel
- Class name: PasCal
- Branch name: ke-bab

##### Github message convention
- [ADD]: When you add new functional codes 
- [FIX]: When you fix some errors
- [DEL]: When you remove functional codes
- [RFT]: When you refactor codes
- [CHO]: When you do chore such as moving some files 
- [DOC]: When you write docs  

ex)  
git commit -m "[ADD] #(이슈번호) - add a login page"  
git commit -m "[DEL] #(이슈번호) - delete a login page"  
git commit -m "[DOC] #(이슈번호) - write a README.md"  


👨‍👩‍👧‍👧 **Collaborator**

🧑‍💻Sungjin Park

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

👩‍💻Minji Kim

-Jeju National University

-Major in Fashion designing & textiles and Computing engineering

-minzyk0729@jejunu.ac.kr

-[https://github.com/minzzz0729](https://github.com/minzzz0729)

👨🏻‍💼Xavier Lopez

-Purdue University

-Major in Cybersecurity and Network Engineering

-lopezx@purdue.edu


