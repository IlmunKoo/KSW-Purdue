package com.iieee.server.domain.station;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StationRepository extends JpaRepository<Station, Long> {
    @Deprecated
    Optional<Station> findByEui(String eui);
    Optional<Station> findBySenetCityId(Long senetCityId);
}
