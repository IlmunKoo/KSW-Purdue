package com.iieee.server.domain.sensor;

import com.iieee.server.domain.station.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SensorRepository extends JpaRepository<Sensor, Long> {
    List<Sensor> findByDateTimeBetweenAndStation(LocalDateTime start, LocalDateTime end, Station station);
    Optional<Sensor> findTopByStationOrderByIdDesc(Station station);
}
