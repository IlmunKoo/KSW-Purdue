package com.iieee.server.service;

import com.iieee.server.app.dto.sensor.SensorListResponseDto;
import com.iieee.server.app.dto.station.StationListResponseDto;
import com.iieee.server.app.dto.station.StationResponseDto;
import com.iieee.server.app.dto.station.StationSaveRequestDto;
import com.iieee.server.domain.station.Station;
import com.iieee.server.domain.station.StationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class StationService {
    private final StationRepository stationRepository;

    @Transactional(readOnly = true)
    public List<StationListResponseDto> findAll() {
        return stationRepository.findAll().stream()
                .map(StationListResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StationResponseDto findById(Long id) {
        Station entity = stationRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("There is no station. id=" + id));
        return new StationResponseDto(entity);
    }

    @Transactional
    public List<SensorListResponseDto> getSensorListById(Long id) {
        Station entity = stationRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("There is no station. id=" + id));

        return entity.getSensors().stream()
                .map(SensorListResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public Long save(StationSaveRequestDto requestDto) {
        Station savedStation = requestDto.toEntity();
        return stationRepository.save(savedStation).getId();
    }

    @Transactional
    public void delete(Long id) {
        Station station = stationRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("There is no station. id=" + id));
        stationRepository.delete(station);
    }
}
