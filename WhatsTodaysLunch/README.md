💫 IEEE-International Conference on Robotic Computing Regular Paper (accepted, 8 pages) 


2022 Purdue UAV Payload Detection   
by What is Today's Lunch?
=================================================================


:clipboard: Project title
```markdown
UAV payload detection using deep learning algorithms. 
```


:calendar: Project Period
```markdown
04-17-2022(SUN) ~ 08-05-2022(FRI)  
```

:pushpin: Problem Statement
```markdown
Over the years, as Unmanned Aerial Vehicle technology has continued to advance,  it has become much easier and cheaper to access UAVs.  
It is certain that UAVs are providing comfort to our lives. However, while UAV accessibility has grown, malicious activities have also been  
increasingly common. Especially, UAVs with payloads can easily be employed to endanger innocent civillians or government dignitaries  
with their airborne contents.  
For example, UAVs with payloads could throw harmful materials or explosives into the public airspace.  
Also, some accidents concerning UAVs with payloads occured frequently. In this situation, it is required to  
correctly dectect UAVs with payloads in order to reduce expected harm to the victims. 
```


:desert_island: Novelty
```markdown
1. Conducting data collection utilizing laptop
In the prior study [1], data collection was conducted by utilizing several Raspberry Pis as microphones.  
However, Uosing Raspberry Pis was not as practical as of a method of a method as we'd like,  
due to the time and effort expended setting up every piece of equipment. However,  
employing laptops or cell phones as recording devices instead is a more cost-effective and easily accessible method. 

2. Currently only 600 audio samples were secured for UAV payload classification. Since the dataset is not enough  
for applying deep learning algorithms in the prior study, data augmentation will also be exercised in order to obtain  
a sufficient amount of data. At least 1000 data samples are required for deep learning algorithms and normally 360 audio samples. 
can be obtained by a single collection trip. 

[1] Wang, Y., Fagian, F. E., Ho, K. E., & Matson, E. T. (2021, November). A Feature Engineering Focused System for Acoustic UAV Detection. In 2021 Fifth IEEE International Conference on Robotic Computing (IRC) (pp. 125-130). IEEE.
```


:classical_building: System Overview  

![KakaoTalk_Photo_2022-06-02-10-00-25](https://user-images.githubusercontent.com/59404684/171646959-d5b5710d-703a-4257-80fd-f90237e9f64c.png)

```markdown!
🏄 Hardware

DJI Phantom 4 Pro
EVO Pro 2
MacBook Pro 16(2019) as a microphone. 
Two Payloads of 64g and 68g

🏂 Software

- Feature Extraction
 1. MFCC
 2. Mel
 3. Contrast
 4. Tonnetz
 5. Chroma

- Data Augmentation
 1. Time Stretching(Raw Data)
 2. Pitch Scaling(Raw Data)
 3. Time Masking(Spectrogram)
 4. Frequency Masking(Spectrogram)
```


:desktop_computer: Environment Setting
```markdown
✔️ Python 3.10.x  
✔️ Librosa v0.9.2
✔️ Keras 2.8.0
✔️ Numpy 1.21.6
✔️ Pandas 1.4.3
✔️ Soundfile 0.10.3.post1
✔️ Scikit-learn 0.24
```

:dizzy: Installation
```markdown
$ git clone https://github.com/MINJILEE-PURDUE/KSW_2022_Spring_Program.git
$ cd WhatsTodaysLunch
```


:family_man_woman_girl_boy: Collaborator
```markdown
🧑‍✈️ Ilmun Ku
- Hankuk University of Foreign Studies
- Major in Artificial Intelligence Convergence
- mun90505@hufs.ac.kr
- https://github.com/ilmunkoo

🕵️‍♀️ Seungyeon Roh
- Konkuk University
- Major in Computer Science and Engineering
- shtmddus99@konkuk.ac.kr
- https://github.com/seungyeonroh

🥷 Gyeongyeong Kim
- Sunmoon University
- Major in Computer Science and Engineering
- kky57389@sunmoon.ac.kr
- https://github.com/kky5738

💂‍♂️ Charlse Taylor
- Purdue Univerisity
- Major in Computer and Information Technology
- taylo869@purdue.edu
- https://github.com/charlesjtaylor


```



