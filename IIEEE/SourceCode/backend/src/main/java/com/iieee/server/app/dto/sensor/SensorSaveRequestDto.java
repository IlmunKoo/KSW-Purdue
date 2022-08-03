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
    private Double airPressure;

    private Double windSpeed;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateTime;

    @Builder
    public SensorSaveRequestDto(Double airTemperature, Double airHumidity, Double airPressure, Double windSpeed, LocalDateTime dateTime) {
        this.airTemperature = airTemperature;
        this.airHumidity = airHumidity;
        this.airPressure =airPressure;
        this.windSpeed = windSpeed;
        this.dateTime = dateTime;
    }

    public Sensor toEntity() {
        Air air = airToEntity();

        return Sensor.builder()
                .air(air)
                .windSpeed(windSpeed)
                .dateTime(dateTime)
                .build();
    }

    private Air airToEntity() {
        return Air.builder()
                .temperature(airTemperature)
                .humidity(airHumidity)
                .pressure(airPressure)
                .build();
    }
}
