package com.iieee.server.app.dto.station;

import com.iieee.server.domain.sensor.Sensor;
import com.iieee.server.domain.station.Location;
import com.iieee.server.domain.station.Station;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
public class StationResponseDto {
    private Long id;
    private String name;
    private Location location;
    private List<Long> sensorIds;

    public StationResponseDto(Station entity) {
        this.id = entity.getId();
        this.name = entity.getName();
        this.location = entity.getLocation();
        this.sensorIds =  entity.getSensors().stream().map(Sensor::getId).collect(Collectors.toList());
    }
}
