package com.iieee.server.app;

import com.iieee.server.app.dto.network.ParseSenetRequestDto;
import com.iieee.server.app.dto.network.SenetRequestDto;
import com.iieee.server.app.dto.sensor.SensorListResponseDto;
import com.iieee.server.app.dto.sensor.SensorResponseDto;
import com.iieee.server.app.dto.sensor.SensorSaveRequestDto;
import com.iieee.server.service.SensorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/sensors")
public class SensorApiController {
    private final SensorService sensorService;

    @GetMapping
    public List<SensorListResponseDto> retrieveAllSensors() {
        return sensorService.findAll();
    }

    @GetMapping("/{id}")
    public SensorResponseDto findById(@PathVariable Long id) { return sensorService.findById(id); }

    @GetMapping("/stations/{station_id}")
    public List<SensorListResponseDto> retrieveSensorListByDateTimeAndStation(@PathVariable Long station_id, @RequestParam String start, @RequestParam String end) {
        return sensorService.findSensorListByDateTimeAndStation(station_id, LocalDateTime.parse(start), LocalDateTime.parse(end));
    }

    @GetMapping("/stations/{station_id}/1")
    public SensorResponseDto retrieveLatestByStation(@PathVariable Long station_id) {
        return sensorService.findLatestByStation(station_id);
    }

    @PostMapping("/stations/{station_id}")
    public Long save(@PathVariable Long station_id, @RequestBody SensorSaveRequestDto sensor) {
        return sensorService.save(station_id, sensor);
    }

    @PostMapping
    public Long save(@RequestBody SenetRequestDto requestDto) {
        ParseSenetRequestDto parseSenetRequestDto = new ParseSenetRequestDto(requestDto);
        return sensorService.saveBySenet(parseSenetRequestDto.getSenetCityId(), parseSenetRequestDto.toSensorSaveRequestDto());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { sensorService.delete(id); }
}