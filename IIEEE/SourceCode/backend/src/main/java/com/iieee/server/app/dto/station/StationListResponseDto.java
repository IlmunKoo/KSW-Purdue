package com.iieee.server.app.dto.station;

import com.iieee.server.domain.station.Location;
import com.iieee.server.domain.station.Station;
import lombok.Getter;

@Getter
public class StationListResponseDto {
    private Long id;
    private String name;
    private Location location;

    public StationListResponseDto(Station entity) {
        this.id = entity.getId();
        this.name = entity.getName();
        this.location = entity.getLocation();
    }
}
