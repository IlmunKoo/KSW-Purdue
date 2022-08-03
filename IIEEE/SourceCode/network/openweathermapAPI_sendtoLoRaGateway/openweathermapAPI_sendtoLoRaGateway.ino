#include <WiFi.h> // WiFi header library
#include <HTTPClient.h> //open weather API HTTP get request library
#include <Arduino_JSON.h> // Json transform library
#include <ESP32_LoRaWAN.h>
#include "Arduino.h"
#include <LoRa.h> // Lora network library

JSONVar myObject;



//open weather API
const char* ssid = "IITP"; //wifi name
const char* password = "K0r3anSquar3!20"; //wifi password

String openWeatherMapApiKey = "INSERT YOUR API KEY"; //My API KEY insert 

// API request per minutes
unsigned long lastTime = 0;
unsigned long timerDelay = 1000; //api 60 calls per 60 seconds

//City code
String jsonBuffer;
int citynum = 0;
String cityid[] = {"4046255", "4064310", "4078964", "4098518", "4674001", "4682991", "4692658", "4700168", "4708328", "4716826", "4724530", "4737506", "5518301", "5530022", "4749627", "4761277", "4776585", "4794531", "4112638", "4128103", "4146219", "4152003", "4157827", "4161785", "4167003", "4172139", "4177779", "4255151", "4263024", "4920199", "4925304", "4270356", "4276873", "4282305", "4294180", "4304448", "4317412", "4329654", "4339881", "4350461"};


//license for Heltec ESP32 LoRaWan
uint32_t  license[4] = {"INSERT YOUR ESP LoRs 32 LICENSE KEY"};

//OTAA
uint8_t DevEui[] = { "INSERT YOUR Device EUI" };
uint8_t AppEui[] = { "INSERT YOUR APP EUI"};
uint8_t AppKey[] = { "INSERT YOUR APP KEY"};


//LoraWan channelsmask, default channels 0-7
uint16_t userChannelsMask[6]={ 0x00FF,0x0000,0x0000,0x0000,0x0000,0x0000 };

//LoraWan Class, ESP 32 = Class A
DeviceClass_t  loraWanClass = CLASS_A;

//the application data transmission duty cycle.  value in MS
uint32_t appTxDutyCycle = 1000;

//OTTA
bool overTheAirActivation = true;


//Indicates if the node is sending confirmed or unconfirmed messages
bool isTxConfirmed = true;

// Application port 
uint8_t appPort = 2;

uint8_t confirmedNbTrials = 8;

uint8_t debugLevel = LoRaWAN_DEBUG_LEVEL;

//LoraWan region, select in arduino IDE tools
LoRaMacRegion_t loraWanRegion = ACTIVE_REGION;

//PARSING THE DATA JSON TO ASCII
void itoa(char arr[], int num, int* count) {
  char temp[100];
  int t = 0;
  if(num == 0) {
    arr[*count] = (char)48;
    (*count)++;
    return;
  }
  while(num) {
    temp[t] = (char)((num%10)+48);
    num /= 10;
    t++;
  }
  for(int i=t-1; i>=0; i--) {
    arr[*count] = temp[i];
    (*count)++;
  }
 
}

static void prepareTxFrame( uint8_t port )
{
    int count = 0;
    char arr[100];
  

    itoa(arr, cityid[citynum].toInt(), &count);
    arr[count] = ' ';
    count++;
    itoa(arr, myObject["main"]["temp"], &count);
    arr[count] = ' ';
    count++;
    itoa(arr, myObject["main"]["humidity"], &count);
    arr[count] = ' ';
    count++;
    itoa(arr, myObject["wind"]["speed"], &count);
    arr[count] = ' ';
    count++;
    itoa(arr, myObject["main"]["pressure"], &count);
//    itoa(arr, 777, &count);
   
    appDataSize = count;
    for(int i=0; i<count; i++) {
      appData[i] = arr[i];
    }
 
}

// Add your initialization code
void setup()
{
  Serial.begin(115200);
  while (!Serial);
  SPI.begin(SCK,MISO,MOSI,SS);
  Mcu.init(SS,RST_LoRa,DIO0,DIO1,license);
  deviceState = DEVICE_STATE_INIT;

  //OPEN WEATHER CONNECTING CODE
  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
 
  Serial.println("Timer set to 10 seconds (timerDelay variable), it will take 10 seconds before publishing the first reading.");
  
}

// The loop function is called in an endless loop
void loop()
{
  if(citynum == sizeof(cityid)/sizeof(cityid[0]))
    citynum = 0;

  switch( deviceState )
  {
    case DEVICE_STATE_INIT:
    {
#if(LORAWAN_DEVEUI_AUTO)
LoRaWAN.generateDeveuiByChipID();
#endif
      LoRaWAN.init(loraWanClass,loraWanRegion);
      break;
    }
    case DEVICE_STATE_JOIN:
    {
      LoRaWAN.join();
      break;
    }
    case DEVICE_STATE_SEND:
    {
      
      if ((millis() - lastTime) > timerDelay) {
            // Check WiFi connection status
            if(WiFi.status()== WL_CONNECTED){
            String serverPath = "http://api.openweathermap.org/data/2.5/weather?id=" + cityid[citynum] + "&APPID=" + openWeatherMapApiKey;
           
            jsonBuffer = httpGETRequest(serverPath.c_str());
            Serial.println(jsonBuffer);
              myObject = JSON.parse(jsonBuffer);
       
            
            if (JSON.typeof(myObject) == "undefined") {
              Serial.println("Parsing input failed!");
              return;
            }
         
          }
          else {
            Serial.println("WiFi Disconnected");
          }
          lastTime = millis();
      }      
      
      if(myObject["main"]["temp"] == null || myObject["main"]["humidity"] == null || myObject["wind"]["speed"] == null || myObject["main"]["pressure"] == null) {
        deviceState = DEVICE_STATE_CYCLE;
        break;
      }
      prepareTxFrame( appPort );
            Serial.println(cityid[citynum]);
            Serial.print("Temperature: ");
            Serial.println(myObject["main"]["temp"]);
            Serial.print("Humidity: ");
            Serial.println(myObject["main"]["humidity"]);
            Serial.print("Wind Speed: ");
            Serial.println(myObject["wind"]["speed"]);
            Serial.print("Pressure: ");
            Serial.println(myObject["main"]["pressure"]);
      citynum++;
      LoRaWAN.send(loraWanClass);
   
      deviceState = DEVICE_STATE_CYCLE;
      break;
    }
    case DEVICE_STATE_CYCLE:
    {
      LoRaWAN.cycle(appTxDutyCycle);
      deviceState = DEVICE_STATE_SLEEP;
      break;
    }
    case DEVICE_STATE_SLEEP:
    {
      LoRaWAN.sleep(loraWanClass,debugLevel);
      break;
    }
    default:
    {
      deviceState = DEVICE_STATE_INIT;
      break;
    }
  }
}

String httpGETRequest(const char* serverName) {
  WiFiClient client;
  HTTPClient http;
  http.begin(client, serverName);
  int httpResponseCode = http.GET();
 
  String payload = "{}";
 
  if (httpResponseCode>0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    payload = http.getString();
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  http.end();

  return payload;
}
