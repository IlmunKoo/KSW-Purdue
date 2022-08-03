package com.iieee.server.app.dto.sensor;

import com.iieee.server.domain.sensor.Sensor;
import com.iieee.server.domain.sensor.type.Air;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class SensorListResponseDto {
    private Long id;
    private Air air;
    private Double windSpeed;
    private LocalDateTime dateTime;

    public SensorListResponseDto(Sensor entity) {
        this.id = entity.getId();
        this.air = entity.getAir();
        this.windSpeed = entity.getWindSpeed();
        this.dateTime = entity.getDateTime();
    }
}
