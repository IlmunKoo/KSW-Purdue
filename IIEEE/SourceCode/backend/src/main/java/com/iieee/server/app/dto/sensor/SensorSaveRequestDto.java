package com.iieee.server.app.dto.sensor;

import com.iieee.server.domain.sensor.Sensor;
import com.iieee.server.domain.sensor.type.Air;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@NoArgsConstructor
@Getter
@Setter
public class SensorSaveRequestDto {
    // Air
    private Double airTemperature;
    private Double airHumidity;

    private Double windSpeed;

    private Double uv;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateTime;

    @Builder
    public SensorSaveRequestDto(Double airTemperature, Double airHumidity, Double windSpeed, Double uv, LocalDateTime dateTime) {
        this.airTemperature = airTemperature;
        this.airHumidity = airHumidity;
        this.windSpeed = windSpeed;
        this.uv = uv;
        this.dateTime = dateTime;
    }

    public Sensor toEntity() {
        Air air = airToEntity();

        return Sensor.builder()
                .air(air)
                .windSpeed(windSpeed)
                .uv(uv)
                .dateTime(dateTime)
                .build();
    }

    private Air airToEntity() {
        return Air.builder()
                .temperature(airTemperature)
                .humidity(airHumidity)
                .build();
    }
}
