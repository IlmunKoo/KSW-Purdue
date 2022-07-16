/**
* GPS
*
*/

#ifndef GPS_H
#define GPS_H
#include<vector>
#include<cmath>
#include "BoostArchiver.h"

namespace GPS_OFF_SLAM
{

class GPS
{
public:

    GPS();
    GPS(double latitude, double longitude);

    void SetGPS(double latitude, double longitude);
    std::pair<const double, const double> GetGPS();

    double GetDistanceWithGPS(double flatitude, double flongitude);

protected:
    // ***latitude and longitude***
    double mkLatitude;
    double mkLongitude;

private:
// serialize is recommended to be private
    friend class boost::serialization::access;
    template<class Archive>
    void serialize(Archive &ar, const unsigned int version);
};


}//namespace GPS_OFF_SLAM


#endif // GPS_H