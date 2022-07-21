package com.iieee.server.app;

import com.iieee.server.app.dto.sensor.SensorListRequestDto;
import com.iieee.server.app.dto.sensor.SensorListResponseDto;
import com.iieee.server.app.dto.sensor.SensorResponseDto;
import com.iieee.server.app.dto.sensor.SensorSaveRequestDto;
import com.iieee.server.service.SensorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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
    public List<SensorListResponseDto> retrieveSensorListByDateTimeAndStation(@PathVariable Long station_id, @RequestBody SensorListRequestDto requestDto) {
        return sensorService.findSensorListByDateTimeAndStation(station_id, requestDto);
    }

    @GetMapping("/stations/{station_id}/1")
    public SensorResponseDto retrieveLatestByStation(@PathVariable Long station_id) {
        return sensorService.findLatestByStation(station_id);
    }

    @PostMapping("/stations/{station_id}")
    public Long save(@PathVariable Long station_id, @RequestBody SensorSaveRequestDto sensor) {
        return sensorService.save(station_id, sensor);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { sensorService.delete(id); }
}