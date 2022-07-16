# GPS Offroad SLAM
SLAM for the offroad environment using GPS data. The code is based on the ORB-SLAM2.


## Based on ORB-SLAM2
**ORB-SLAM2 Authors:** [Raul Mur-Artal](http://webdiis.unizar.es/~raulmur/), [Juan D. Tardos](http://webdiis.unizar.es/~jdtardos/), [J. M. M. Montiel](http://webdiis.unizar.es/~josemari/) and [Dorian Galvez-Lopez](http://doriangalvez.com/) ([DBoW2](https://github.com/dorian3d/DBoW2)).
The original implementation can be found [here](https://github.com/raulmur/ORB_SLAM2.git).

## Features
- Full ROS compatibility
- Supports a lot of cameras out of the box, such as the Intel RealSense family. See the run section for a list
- Data I/O via ROS topics
- Parameters can be set with the rqt_reconfigure gui during runtime
- Very quick startup through considerably sped up vocab file loading
- Full Map save and load functionality based on [this PR](https://github.com/raulmur/ORB_SLAM2/pull/381).
- Loading of all parameters via launch file
- Supports loading cam parameters from cam_info topic

### Related Publications:
[Monocular] Raúl Mur-Artal, J. M. M. Montiel and Juan D. Tardós. **ORB-SLAM: A Versatile and Accurate Monocular SLAM System**. *IEEE Transactions on Robotics,* vol. 31, no. 5, pp. 1147-1163, 2015. (**2015 IEEE Transactions on Robotics Best Paper Award**). **[PDF](http://webdiis.unizar.es/~raulmur/MurMontielTardosTRO15.pdf)**.

[Stereo and RGB-D] Raúl Mur-Artal and Juan D. Tardós. **ORB-SLAM2: an Open-Source SLAM System for Monocular, Stereo and RGB-D Cameras**. *IEEE Transactions on Robotics,* vol. 33, no. 5, pp. 1255-1262, 2017. **[PDF](https://128.84.21.199/pdf/1610.06475.pdf)**.

[DBoW2 Place Recognizer] Dorian Gálvez-López and Juan D. Tardós. **Bags of Binary Words for Fast Place Recognition in Image Sequences**. *IEEE Transactions on Robotics,* vol. 28, no. 5, pp.  1188-1197, 2012. **[PDF](http://doriangalvez.com/php/dl.php?dlp=GalvezTRO12.pdf)**


# 1. Building gps_offroad_slam
We have tested the library in **Ubuntu 16.04** with **ROS Kinetic** and **Ubuntu 18.04** with **ROS Melodic**. A powerful computer (e.g. i7) will ensure real-time performance and provide more stable and accurate results.
A C++11 compiler is needed.

## Getting the code
Clone the repository into your catkin workspace:
```
git clone 
```

## ROS
This ROS node requires catkin_make_isolated or catkin build to build. This package depends on a number of other ROS packages which ship with the default installation of ROS.
If they are not installed use [rosdep](http://wiki.ros.org/rosdep) to install them. In your catkin folder run
```
sudo rosdep init
rosdep update
rosdep install --from-paths src --ignore-src -r -y
```
to install all dependencies for all packages. If you already initialized rosdep you get a warning which you can ignore.

## Eigen3
Required by g2o. Download and install instructions can be found [here](http://eigen.tuxfamily.org).
Otherwise Eigen can be installed as a binary with:
```
sudo apt install libeigen3-dev
```
**Required at least Eigen 3.1.0**.

## Building
To build the node run
```
catkin build
```
in your catkin folder.

# 2. Configuration
## Vocab file
To run the algorithm expects both a vocabulary file (see the paper) which ships with this repository.

# Config
The config files for camera calibration and tracking hyper paramters from the original implementation are replaced with ros paramters which get set from a launch file.

## ROS parameters, topics and services
### Parameters
There are three types of parameters right now: static- and dynamic ros parameters and camera settings.
The static parameters:

- **load_map** 
- **map_file** for loading the map
- **voc_file** for loading the voc file
- **publish_pointcloud** for pusblishing pointcloud2 which is map point in the map
- **publish_pose** for pusblishing pose of the camera
- **pointcloud_frame_id** 
- **camera_frame_id**
- **target_frame_id**
- **load_calibration_from_cam**.
- **localize_only**
- **reset_map** 
- **min_num_kf_in_map**
- **min_observations_for_ros_map**

### Subscribed topics

- **/camera/rgb/image_raw** for the RGB image
- **/camera/depth_registered/image_raw** for the depth information
- **/camera/rgb/camera_info** for camera calibration (if `load_calibration_from_cam`) is `true`


# 3. Run
After sourcing your setup bash using
```
source devel/setup.bash
```
## Suported cameras

Intel RealSense d435I 
``` 
roslaunch gps_offroad_slam gps_slam_d435I_rgbd.launch 
```

```
roslaunch realsense2_camera realsense2_camera.launch
```

**Note** you need to source your catkin workspace in your terminal in order for the services to become available.

# 4. Save the map
To save the map with a simple command line command run one the commands
```
rosservice call /gps_offroad_slam/save_map map.bin

```
You can replace "map.bin" with any file name you want.
The file will be saved at ROS_HOME which is by default ~/.ros

