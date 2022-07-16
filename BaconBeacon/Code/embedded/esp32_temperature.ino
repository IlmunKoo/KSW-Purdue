#include <WiFi.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>

#define DHTPIN 15
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

const char *ssid =  "IITP";   
const char *password =  "K0r3anSquar3!20"; 

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

//make JSON Data from temperature and humidity value
String makeData(int temp, int humi){
  DynamicJsonDocument doc(1024);
  doc["id"] = 1;
  doc["temperature"] = temp;
  doc["humidity"] = humi;
  String data;
  serializeJson(doc, data);
  return data;
}
//Send data to Server
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
  //Get temp, humid data from DHT11
  int humi = dht.readHumidity();
  int temp = dht.readTemperature();
  
  String data = makeData(temp, humi);
  sendData(data);

  //in every 10 sec
  delay(10000);
}
