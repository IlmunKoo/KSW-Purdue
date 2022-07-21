package com.iieee.server.domain.station;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Embeddable;

@Embeddable
@Getter
@NoArgsConstructor
public class Location {
    // 위도
    private Double latitude;

    // 경도
    private Double longitude;

    // Zip code
    private String zipCode;

    @Builder
    public Location(Double latitude, Double longitude, String zipCode) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.zipCode = zipCode;
    }
}
