#include <WiFi.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>

#define DHTPIN 15
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

const char *ssid =  "IITP";   
const char *password =  "K0r3anSquar3!20"; 

WiFiClient wclient;
char messages[50];

// Connect to WiFi network
void setup_wifi() {
  Serial.print("\nConnecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password); 
  while (WiFi.status() != WL_CONNECTED) { 
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Received messages: ");
  Serial.print("None");
  for(int i=0; i<length; i++){
    Serial.println((char) payload[i]);
  }
  Serial.println();
}


int sendData(String json){
  HTTPClient http;
  http.begin("http://146.148.59.28:5000/get_sensor_data");
  http.addHeader("Content-Type",  "application/json");
  return http.POST(json);
}
void setup() {
  Serial.begin(9600); 
  delay(100);
  dht.begin();
  setup_wifi(); // Connect to network
}

void loop() {
  int humi = dht.readHumidity();
  int temp = dht.readTemperature();
  Serial.print(humi);
  Serial.print("\n");
  Serial.print(temp);
  Serial.print("\n");
  DynamicJsonDocument doc(1024);
  
  doc["id"] = 1;
  doc["temperature"] = temp;
  doc["humidity"] = humi;
  String data;
  serializeJson(doc, data);
  Serial.print(sendData(data));
  Serial.print(data);
  
  delay(10000);
}
