#include "GPS.h"
#include<mutex>

namespace GPS_OFF_SLAM
{
GPS::GPS():mkLatitude(0.),mkLongitude(0.)
{
}

GPS::GPS(double latitude, double longitude):mkLatitude(latitude),mkLongitude(longitude)
{
}

void GPS::SetGPS(double latitude, double longitude)
{
    //unique_lock<mutex> lock(mMutexPos);
    mkLatitude = latitude;
    mkLongitude = longitude;
}

std::pair<const double, const double> GPS::GetGPS()
{
    //unique_lock<mutex> lock(mMutexPos);
    return std::make_pair(mkLatitude,mkLongitude);
}

double GPS::GetDistanceWithGPS(double flatitude, double flongitude)
{
    //unique_lock<mutex> lock(mMutexPos);   
    double R = 6378.137; // Radius of earth in KM
    double dLatitude = (mkLatitude-flatitude) * M_PI / 180;
    double dLongitude = (mkLongitude-flongitude) * M_PI  / 180;
    double a = std::pow(sin(dLatitude/2),2) + cos(flatitude * M_PI / 180) * cos(mkLatitude * M_PI / 180) * std::pow(sin(dLongitude/2),2);
    double c = 2 * atan2(sqrt(a), sqrt(1-a));
    double distance = R * c;
    return distance * 1000; // meters
}
// map serialization addition
template<class Archive>
void GPS::serialize(Archive &ar, const unsigned int version)
{
    ar & mkLatitude;
    ar & mkLongitude;
}
template void GPS::serialize(boost::archive::binary_iarchive&, const unsigned int);
template void GPS::serialize(boost::archive::binary_oarchive&, const unsigned int);

}//namespace GPS_OFF_SLAM