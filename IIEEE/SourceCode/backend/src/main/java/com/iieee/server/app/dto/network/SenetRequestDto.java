package com.iieee.server.app.dto.network;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@NoArgsConstructor
@Getter
@Setter
public class SenetRequestDto {
    @JsonProperty("PDU")
    private String pdu;

    @JsonProperty("GW")
    private String gw;

    @JsonProperty("EUI")
    private String eui;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("TXTime")
    private LocalDateTime txtTime;

    @JsonProperty("SeqNo")
    private Integer seqNo;

    @JsonProperty("Port")
    private Integer port;
}
