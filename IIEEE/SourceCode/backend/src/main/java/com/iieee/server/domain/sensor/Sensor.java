package com.iieee.server.domain.sensor;

import com.iieee.server.domain.sensor.type.Air;
import com.iieee.server.domain.station.Station;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Sensor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Station station;

    @Embedded
    private Air air;

    private Double windSpeed;

    private Double uv;

    @Column(nullable = false)
    private LocalDateTime dateTime;

    @Builder
    public Sensor(Air air, Double windSpeed, Double uv, LocalDateTime dateTime) {
        this.air = air;
        this.windSpeed = windSpeed;
        this.uv = uv;
        this.dateTime = dateTime;
    }

    public void setStation(Station station) {
        this.station = station;

        if (!station.getSensors().contains(this)) {
            station.getSensors().add(this);
        }
    }
}
