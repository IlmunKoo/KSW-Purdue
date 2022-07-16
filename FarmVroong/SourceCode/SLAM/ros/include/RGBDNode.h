#ifndef GPS_OFFROAD_SLAM_ROS_RGBDODE_H_
#define GPS_OFFROAD_SLAM_ROS_RGBDODE_H_

#include <iostream>
#include <algorithm>
#include <fstream>
#include <chrono>

#include <ros/ros.h>
#include <message_filters/subscriber.h>
#include <message_filters/time_synchronizer.h>
#include <message_filters/sync_policies/approximate_time.h>
#include <image_transport/image_transport.h>
#include <cv_bridge/cv_bridge.h>
#include <sensor_msgs/image_encodings.h>
#include <sensor_msgs/NavSatFix.h>
#include <std_msgs/String.h>
#include <opencv2/core/core.hpp>
#include <tf/transform_broadcaster.h>

#include "System.h"
#include "Node.h"


class RGBDNode : public Node
{
  public:
    RGBDNode (const GPS_OFF_SLAM::System::eSensor sensor, ros::NodeHandle &node_handle, image_transport::ImageTransport &image_transport);
    ~RGBDNode ();
    void ImageCallback (const sensor_msgs::ImageConstPtr& msgRGB,const sensor_msgs::ImageConstPtr& msgD);
    void GpsCallBack(const sensor_msgs::NavSatFix::ConstPtr& msgG);

  private:
    typedef message_filters::sync_policies::ApproximateTime<sensor_msgs::Image, sensor_msgs::Image> sync_pol;
    message_filters::Subscriber<sensor_msgs::Image> *rgb_subscriber_;
    message_filters::Subscriber<sensor_msgs::Image> *depth_subscriber_;
    message_filters::Synchronizer<sync_pol> *sync_;
    message_filters::Subscriber<sensor_msgs::NavSatFix> *gps_subscriber_;
    double latitude;
    double longitude;
};

#endif //GPS_OFFROAD_SLAM_ROS_RGBDODE_H_
