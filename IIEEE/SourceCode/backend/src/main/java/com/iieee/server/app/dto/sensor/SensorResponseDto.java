package com.iieee.server.app.dto.sensor;

import com.iieee.server.domain.sensor.Sensor;
import com.iieee.server.domain.sensor.type.Air;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class SensorResponseDto {
    private Long id;
    private Air air;
    private Double windSpeed;
    private LocalDateTime dateTime;

    public SensorResponseDto(Sensor entity) {
        this.id = entity.getId();
        this.air = entity.getAir();
        this.windSpeed = entity.getWindSpeed();
        this.dateTime = entity.getDateTime();
    }
}
