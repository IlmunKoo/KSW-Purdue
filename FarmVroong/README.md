# 2022 Purdue Off-road Autonomous Driving Project by Team FarmVroong 🚜
<hr>

📑 *Project Title*
        
    Off-road SLAM and Path Planning with GPS for Stable Off-road Autonomous Driving

📅 *Project Period*

    04-17-2022(SUN) ~ 08-05-2022(FRI)

🧖🏻‍♀️ *Problem Statement*

     As self-driving cars are commercialized, a lot of data accumulates and technology is rapidly developing as well. 
     Therefore, in on-road environment, the robust performance of autonomous vehicles is already shown.

     However, in off-road environment, self driving shows low performance yet. 
     The reason why it does not perform well is that it is hard to build datasets since off-road environments have unstructured class boundaries, uneven terrain, strong textures, and irregular characteristics. 

     Moreover, there is no uniform data for off-road experiments due to the various environments, including deserts, forests, and farms. Thus, it is more difficult to recognize the surrounding environments at the off-road than the on-road and is required to determine the scope.

     In an unknown environment, an autonomous vehicle must percept the map of its environment and determine its location through Simultaneous Localization and Mapping (SLAM). 
     It is critical that there are some limitations and delimitations of sensor data at the outdoor. 
     For example, since the depth sensor of camera does not work well due to the ultravioloet rays, RGB-D SLAM methods cannot be applicable. 

     In addition, 3D LiDAR is not cost efficient. Therefore, we used one camera and added GPS data as well.
     Meanwhile, on the road, the optimal route is decided based on time, fuel efficiency, and distance. 
     On the other hand, on off-road, considering the irregular condition of the path, such as fine sand, mud and gravel, it is important to take into a consideration the condition of the path. 

     Therefore, even if one path spends more time than the other, it can be decided as a optimal path. 
     Likewise, SLAM and Path Planning methods which optimizes at the off-road is required. 

📖 *Considerations*

    🚜Software
      - Manage processes that make multiple process to operate simultaneously and in real time.
      - Error handling in case of malfunction for safety.
    
    🚜Hardware
      - Robust frame for driving in bumpy terrain.
      - Independent vehicles platform without network connectivity.
      - Heat dissipation to withstand high temperatures and direct rays of the sun.

💡 *Novelty*

    1. Developed visual SLAM using monocular camera and GPS.
       => SLAM method is usually based on a Camera or 3D-LiDAR. 
       This research used camera, which is much cheaper than 3D-LiDAR, and utilized the advantage of GPS sensor that performs well at the open outdoor. 
       Most of all, GPS data prevented bootless computing, contributed to making Covisibility Graph, and localized the position of the vehicle when the
       tracking failed.  
      
    2. Developed Path planning considering path conditions to improve driving quality.
       => Path Planning methods are fundamentally estimated based on the shortest path. 
       However, when it comes to off-road, Path Planning should consider not only the time but also the stability of the road. 
       In order to achieve the goal, geographical features such as slope, trunk, and rocks is required and used for calculating the priority of the path. 
       A stable path can be marked using GPS coordinates and given more weight. Thus, the vehicle can select more stable paths stochastically. 

🏛 *System Overview*
 <p align="center">
<img width="600" alt="스크린샷 2022-08-01 오후 3 16 23" src="https://user-images.githubusercontent.com/66895650/182228554-3b9fa7dc-c5ee-4ffb-8b8d-52470c84d6c0.png">
</p>

    
    This is an overview of system architecture. 
    It consists of hardware, middleware, and software, and collects data through camera and GPS.

<p align="center">
<img width="886" alt="스크린샷 2022-08-01 오후 9 09 11" src="https://user-images.githubusercontent.com/52185595/182270340-b3366554-00d5-4807-a131-ff6af70a1949.png">
</p>
    
    🚜Hardware    
       As shown in the left figure, the John Deere’s electrical toy vehicle is remodeled. Two DC motors for progress, one DC motor for steering, wheels, and electrical system were maintained. 
              
       These all gears are controlled by an electronic circuit. The figure on the right shows an electronic circuit.
       
       * Parts *
        ✔️ John Deere GROUND FORCE
        ✔️ Jetson NANO 4GB Developer Kit (SUB)
        ✔️ RoboClaw 2x60A Motor Controller
        ✔️ RoboClaw 2x15A Motor Controller
        ✔️ 12V DC motor (3EA)
        ✔️ 22V Battery
       
        All the systems are controlled by ROS. 
        In case of the robot operation based on keyboard input, 'teleop_twist_keyboard' package has to be run before the main code starts. 

    🚜 *Driving system diagram*
        
        
<p align="center"><img src="https://user-images.githubusercontent.com/52185595/182275036-3c873ed2-1956-48cc-95f4-829e0bceab79.png" width="300"></p>

        
        🚜 *Prototype Video : Mobile robot running by Joystick*
        
<p align="center"><img src="https://user-images.githubusercontent.com/52185595/182276119-696ce968-8ce6-4e08-9efb-a36b48b7205f.gif"/></p>

        🚜 *Prototype Video 2 : Steering wheel operating*

<p align="center"><img src="https://user-images.githubusercontent.com/52185595/182273700-a99055b7-bd37-46da-a930-796a91164410.gif"/></p>

    🚜Software  

       - visual SLAM  
         It consists of three steps: camera tracking, local mapping and loop closing. GPS data was utilized for enhancing the accuracy and lessen the computing time. 

          1. Camera tracking: The new keyframe will be chosen with map points and GPS data. 
          Each new frame is decided as a keyframe only if they have similar map points compared with previous keyframes. 
          In this process, GPS made it possible to select the keyframe only when the vehicle moves certain distance to prevent bootless computing.   
            
          2. Local mapping: The new keyframe will be inserted using graph and GPS. 
          The local map is made of graph, and each keyframe is connected with the nearest keyframe as a node. 
          GPS data is used to find the nearest keyframe with a new keyframe and utilized when calculating the weight for making the covisibility graph.  

          3. Loop closing: In order to find the loop candidates of the current KeyFrame, covisibility graph is called for calculating the similarities. 
          However, GPS data can complement while detecting the loop and early stops the Loop Closing process if there is no near KeyFrame. 
  

       - Path Planning  
          A sampling-based path planning method is used. 
          Since it starts path planning from the sampled location, it is added the priority for certain paths, considering geographical features such as slope, trunk, and rocks. 
          A stable path can be marked using GPS coordinates and given more weight. 
          As a result, the vehicle can select more stable paths stochastically.   

🖥️ *Environment Setting*

    ✔️Jetson NANO 4GB Developer Kit (SUB)

    ✔️Ubuntu 18.04

    ✔️ROS Melodic Morenia

    ✔️GoPro HERO 10 Camera (It includes GPS sensor)

    ✔️Python 2.7.x
  

📤 *Installation*

## Package needed 

    ✔️ openCV
    ✔️ teleop_twist_keyboard
    ✔️ Roboclaw Driver (from. https://github.com/SV-ROS/roboclaw_driver/blob/master/nodes/roboclaw_node.py)

    $ git clone https://github.com/MINJILEE-PURDUE/KSW_2022_Spring_Program.git
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
       -Major in Software Convergence & Economics
       -jiwung22@gmail.com
       -https://github.com/Jamalun
       
    👩‍🚀Jiwon Park
       -Kyung Hee University
       -Major in Software Convergence & Electronic Engineering
       -overflow21@khu.ac.kr
       -https://github.com/zzziito
    
    👩🏼‍💼Chaea Cho
       -Purdue University
       -Major in CNIT
       -cho418@purdue.edu
       -https://github.com/Jaycee-C
