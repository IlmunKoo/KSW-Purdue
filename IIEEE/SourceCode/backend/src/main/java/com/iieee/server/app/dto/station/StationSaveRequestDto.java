package com.iieee.server.app.dto.station;

import com.iieee.server.domain.station.Location;
import com.iieee.server.domain.station.Station;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class StationSaveRequestDto {
    private String name;

    // Location
    private Double latitude;
    private Double longitude;
    private String zipCode;

    public Station toEntity() {
        Location location = locationToEntity();

        return Station.builder()
                .name(name)
                .location(location)
                .build();
    }

    private Location locationToEntity() {
        return Location.builder()
                .latitude(latitude)
                .longitude(longitude)
                .zipCode(zipCode)
                .build();
    }
}
