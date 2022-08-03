package com.iieee.server.app.dto.network;

import com.iieee.server.app.dto.sensor.SensorSaveRequestDto;
import com.iieee.server.parse.ParseHexadecimal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@Getter
public class ParseSenetRequestDto {
    private List<String> valueList;
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dataTime;

    public ParseSenetRequestDto(SenetRequestDto senetRequestDto) {
        this.valueList = ParseHexadecimal.hexToStringList(senetRequestDto.getPdu());
        this.dataTime = senetRequestDto.getTxtTime();
    }

    public Long getSenetCityId() {
        return Long.parseLong(this.valueList.get(0));
    }

    public SensorSaveRequestDto toSensorSaveRequestDto() {
        return new SensorSaveRequestDto(
                Double.parseDouble(valueList.get(1)),
                Double.parseDouble(valueList.get(2)),
                Double.parseDouble(valueList.get(4)),
                Double.parseDouble(valueList.get(3)),
                this.dataTime
        );
    }
}
