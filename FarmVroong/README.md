# 2022 Purdue Off-road Autonomous Driving Project by Team FarmVroong 🚜
<hr>

📑 *Project Title*
        
    Off-road RGB-D SLAM and Path planning with GPS

📅 *Project Period*

    04-17-2022(SUN) ~ 08-05-2022(FRI)

🧖🏻‍♀️ *Problem Statement*

    As self-driving cars are commercialized, a lot of data is accumulated, and accordingly, technology is rapidly developing. By the way, this shows robust performance in on-road environments with data on routes, however, it shows poor performance in off-road such as mountains, farms, and deserts. Because it is difficult to recognize the surrounding environment in an environment that you have never been to before, and there are too many unpredictable places.

    In an unknown environment, an autonomous vehicle must recognize its environment and determine its location through SLAM(Simultaneous Localization and Mapping). In the on-road environment, it has sufficient information about the road, so SLAM is not required, and it is easily operated in a relatively easy surrounding environment indoors. However, there are still many problems to be solved to show perfect performance on off-road.

    In addition, on the road, the optimal route is selected based on time, fuel efficiency, and distance, but off-road, there are various roads such as uneven roads, dry soil, and unstable roads such as mud slopes. Therefore, even if more time is spent on off-road, it is judged that a special path planning method using additional information is more appropriate to select a stable path.

    In conclusion, it is required that special SLAM and path planning methods are optimized off-road.

📖 *Considerations*

    🚜Software
      - Manage processes that allow multiple processes to operate simultaneously and in real time.
      - Stable error handling in case of malfunction for safety.
    
    🚜Hardware
      - Robust frame for driving in rugged terrain.
      - Independent vehicles platform without network connectivity.
      - Heat dissipation to withstand high temperatures and direct rays of the sun.

💡 *Novelty*

    1. Develop RGB-D SLAM using RGB-D Camera with GPS.
       => The existing SLAM method is on a Camera or LiDAR basis. However, we use RGB-D cameras and GPS data together to achieve robust performance in off-road environments. 
      
    2. Develop Path planning considering path conditions to improve driving quality.
       => Existing path planning methods are estimated based on the shortest path. However, the vehicle can search stable paths using additional information on the characteristics of the road. The additional information includes the priority for certain paths, considering geographical features such as slope, trunk, and rocks. A stable path can be marked using GPS coordinates and given more weight. As a result, the vehicle can select more stable paths stochastically. 

🏛 *System Overview*
 <p align="center">
<img width="424" alt="image" src="https://user-images.githubusercontent.com/53038354/170869198-8e1b3fe9-45b0-4cf2-b9ed-6c7433c0f1f3.png">
</p>
    
    This is an overview of system architecture. It consists of hardware, middleware, and software, and collects data through RGB-D camera, GPS and IMU.

<p align="center">
<img width="608" alt="image" src="https://user-images.githubusercontent.com/53038354/170869449-d4f0c003-6d6f-40da-b7f7-e889dc32b6ba.png">
</p>
    
    🚜Hardware    
       As shown in the left figure, the Johndeere’s electrical toy vehicle is remodeled. Two DC motors for progress, one servo motor for steering, wheels, and electrical system were maintained. Then, gearbox and additional frame were added for making stronger power. We made the frames by a 3D printer. These all gears are controlled by an electronic circuit. The figure on the right shows an electronic circuit.

    🚜Software  

       - RGB-D SLAM  
         It consists of three steps, camera tracking, local mapping and loop closing. GPS data was additionally used for existing RGB-D SLAM.

          1. Camera tracking: The new keyframe will be chosen with map points and GPS data. Each new frame is decided as a keyframe only if they have similar map points compared with previous keyframes. In this process, GPS would make it possible to select the keyframe only when the vehicle moves certain distance.   
            
          2. Local mapping: The new keyframe will be inserted using graph and GPS. The local map is made of graph, and each keyframe is connected with the nearest keyframe as a node. GPS data will be used to find the nearest keyframe with a new keyframe.  

          3. Loop closing: The feature is extracted in each frame using DBoW(bag of words based loop detector) and GPS. In off-road, it might be hard to extract the specific feature for each frame. For this reason we use the GPS for finding loop.  

       - Path Planning  
          A sampling-based path planning method is used. Since it starts path planning from the sampled location, it is added the priority for certain paths, considering geographical features such as slope, trunk, and rocks. A stable path can be marked using GPS coordinates and given more weight. As a result, the vehicle can select more stable paths stochastically.   

🖥️ *Environment Setting*

    ✔️Jetson NANO 4GB Developer Kit (SUB)

    ✔️Ubuntu 18.04

    ✔️ROS Melodic Morenia

    ✔️Intel RealSense Depth Camera D435i

    ✔️GPS BU-353S4

    ✔️Python 3.10.x
  

📤 *Installation*

    $ git clone https://github.com/MINJILEE-PURDUE/KSW_2021_Fall_Program.git
    $ cd FarmVroong


👨‍👩‍👧‍👧 *Collaborator*
     
    🤴🏼Seongil Heo
       -Hankuk University of Foreign Studies  
       -Major in Computer Engineering  
       -tjddlf101@hufs.ac.kr  
       -https://github.com/SeongilHeo  
      
    👩‍💻Jueun Mun 
       -Kyung Hee University
       -Major in Computer Engineering
       -kimmin9624@dgu.ac.kr
       -https://github.com/Moon1x21
      
    👨🏻‍🦱Jiwoong Choi
       -Kyung Hee University
       -Major in Software convergence & Economics
       -jwtiger22@khu.ac.kr
       -https://github.com/Jamalun
       
    👩‍🚀Jiwon Park
       -Kyung Hee University
       -Major in Electronic Engineering
       -overflow21@khu.ac.kr
       -https://github.com/zzziito
    
    👩🏼‍💼Chaea Cho
       -Purdue University
       -Major in CNIT
       -cho418@purdue.edu
       -https://github.com/Jaycee-C
