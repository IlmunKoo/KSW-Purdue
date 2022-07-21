package com.iieee.server.domain.sensor.type;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Embeddable;

@Embeddable
@Getter
@NoArgsConstructor
public class Air {
    private Double temperature;
    private Double humidity;

    @Builder
    public Air(Double temperature, Double humidity) {
        this.temperature = temperature;
        this.humidity = humidity;
    }
}
