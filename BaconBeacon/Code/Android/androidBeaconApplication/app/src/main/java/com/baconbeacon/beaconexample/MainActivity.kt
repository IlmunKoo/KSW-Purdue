package com.baconbeacon.beaconexample

import android.Manifest
import android.annotation.SuppressLint
import android.app.AlertDialog
import android.content.Context
import android.content.pm.PackageManager
import android.net.wifi.WifiManager
import android.os.Bundle
import android.os.CountDownTimer
import android.os.Environment
import android.provider.Settings
import android.util.Log
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.lifecycle.Observer
import com.baconbeacon.beaconexample.csv.CSVHelper
import com.baconbeacon.beaconexample.kalman.KalmanFilter
import com.google.firebase.ml.modeldownloader.CustomModel
import com.google.firebase.ml.modeldownloader.CustomModelDownloadConditions
import com.google.firebase.ml.modeldownloader.DownloadType
import com.google.firebase.ml.modeldownloader.FirebaseModelDownloader
import org.altbeacon.beacon.Beacon
import org.altbeacon.beacon.BeaconManager
import org.altbeacon.beacon.MonitorNotifier
import org.altbeacon.beaconreference.databinding.ActivityMainBinding
import org.tensorflow.lite.Interpreter
import java.io.File
import java.net.NetworkInterface
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*
import kotlin.math.abs
import kotlin.math.pow

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    private lateinit var beaconReferenceApplication: BeaconExample
    var alertDialog: AlertDialog? = null
    var neverAskAgainPermissions = ArrayList<String>()

    private val fileName = "AOS_exp4_"
    var beaconDataList = arrayListOf<Array<String>>()
    var filteredRssiArr = arrayListOf<Float>()
    lateinit var filePath: String
    private lateinit var csvHelper: CSVHelper
    private lateinit var timer: CountDownTimer

    private lateinit var kalman: KalmanFilter
    var previousRssi = 0

    lateinit var wifiManager: WifiManager

    lateinit var conditions: CustomModelDownloadConditions
    lateinit var modelFile: File
    lateinit var interpreter: Interpreter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        val view = binding.root
        setContentView(view)

        beaconReferenceApplication = application as BeaconExample

        // Set up a Live Data observer for beacon data
        val regionViewModel = BeaconManager.getInstanceForApplication(this)
            .getRegionViewModel(beaconReferenceApplication.region)
        // observer will be called each time the monitored regionState changes (inside vs. outside region)
        regionViewModel.regionState.observe(this, monitoringObserver)
        // observer will be called each time a new list of beacons is ranged (typically ~1 second in the foreground)
        regionViewModel.rangedBeacons.observe(this, rangingObserver)

        binding.beaconCount.text = "No beacons detected"
        binding.beaconList.adapter =
            ArrayAdapter(this, android.R.layout.simple_list_item_1, arrayOf("--"))

        beaconDataList.add(arrayOf("Date",
            "UUID",
            "Major",
            "Minor",
            "RSSI",
            "Filtered RSSI",
            "Error",
            "AP RSSI"))
//        filePath = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
//            .toString()
        filePath = Environment.getExternalStorageDirectory().absolutePath + "/Download"
        csvHelper = CSVHelper(filePath)
        permission()
        Toast.makeText(this@MainActivity.applicationContext, "Start Detect", Toast.LENGTH_LONG)
            .show()
        kalman = KalmanFilter(R = 0.001f, Q = 2f)
        wifiManager = applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager

        setupTimer()
        printDeviceInfo()
        loadMLmodel()
    }

    private fun printDeviceInfo() {
        Log.w("dddd", "${getMacAddress()}")
        // UUID ??? ?????? ???????????? ?????? ???????????? ?????? ?????????
        Log.w("cccc", "${UUID.randomUUID()}")
    }

    private fun loadMLmodel() {
        // Firebase ?????? ML ?????? ????????????
        conditions = CustomModelDownloadConditions.Builder().requireWifi().build()

        FirebaseModelDownloader.getInstance()
            .getModel("AOS_rssi_Model", DownloadType.LOCAL_MODEL_UPDATE_IN_BACKGROUND, conditions)
            .addOnSuccessListener { model: CustomModel? ->
                modelFile = model?.file!!
                if (modelFile != null) {
                    interpreter = Interpreter(modelFile)
                }
            }
    }

    private fun setupTimer() {
        timer = object : CountDownTimer(300000, 1000) {
            override fun onTick(time: Long) {
                Log.v("timer: ", time.toString())
            }

            override fun onFinish() {
                save()
                Toast.makeText(this@MainActivity.applicationContext, "CSV ?????? ??????", Toast.LENGTH_LONG)
                    .show()
            }
        }.start()
    }

    private fun permission() {
        if (ActivityCompat.checkSelfPermission(this,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED || ActivityCompat.checkSelfPermission(
                    this,
                    Manifest.permission.BLUETOOTH_SCAN) != PackageManager.PERMISSION_GRANTED || ActivityCompat.checkSelfPermission(
                    this,
                    Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED || ActivityCompat.checkSelfPermission(
                    this,
                    Manifest.permission.ACCESS_BACKGROUND_LOCATION) != PackageManager.PERMISSION_GRANTED || ActivityCompat.checkSelfPermission(
                    this,
                    Manifest.permission.ACCESS_NETWORK_STATE) != PackageManager.PERMISSION_GRANTED || ActivityCompat.checkSelfPermission(
                    this,
                    Manifest.permission.ACCESS_WIFI_STATE) != PackageManager.PERMISSION_GRANTED || ActivityCompat.checkSelfPermission(
                    this,
                    Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED

        ) {
            val permission = arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE,
                Manifest.permission.BLUETOOTH_SCAN,
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_BACKGROUND_LOCATION,
                Manifest.permission.ACCESS_NETWORK_STATE,
                Manifest.permission.ACCESS_WIFI_STATE,
                Manifest.permission.ACCESS_COARSE_LOCATION)
            ActivityCompat.requestPermissions(this, permission, 100)
        }
    }

    override fun onPause() {
        Log.d(TAG, "onPause")
        super.onPause()
    }

    private val monitoringObserver = Observer<Int> { state ->
        var dialogTitle = "Beacons detected"
        var dialogMessage = "didEnterRegionEvent has fired"
        var stateString = "inside"

        if (state == MonitorNotifier.OUTSIDE) {
            dialogTitle = "No beacons detected"
            dialogMessage = "didExitRegionEvent has fired"
            stateString == "outside"
            binding.beaconCount.text = "Outside of the beacon region -- no beacons detected"
            binding.beaconList.adapter =
                ArrayAdapter(this, android.R.layout.simple_list_item_1, arrayOf("--"))
        } else {
            binding.beaconCount.text = "Inside the beacon region."
        }
        Log.d(TAG, "monitoring state changed to : $stateString")

        val builder = AlertDialog.Builder(this)
        builder.setTitle(dialogTitle).setMessage(dialogMessage)
            .setPositiveButton(android.R.string.ok, null)

        alertDialog?.dismiss()
        alertDialog = builder.create()
        // alertDialog?.show()
    }

    @SuppressLint("MissingPermission")
    private val rangingObserver = Observer<Collection<Beacon>> { beacons ->
        Log.d(TAG, "Ranged: ${beacons.count()} beacons")
        if (BeaconManager.getInstanceForApplication(this).rangedRegions.isNotEmpty()) {
            binding.beaconCount.text = "Ranging enabled: ${beacons.count()} beacon(s) detected"
            binding.beaconList.adapter = ArrayAdapter(this,
                android.R.layout.simple_list_item_1,
                beacons.sortedBy { it.distance }.map {
                    "UUID: ${it.id1}\nmajor: ${it.id2} minor:${it.id3}\nRSSI: ${it.rssi}\n Filtered RSSI: ${
                        kalman.filter(it.rssi.toFloat())
                    }"
                }.toTypedArray())

            if (beacons.map { it.rssi }.isNotEmpty()) {
                var uuid = beacons.map { it.id1 }[0].toString()
                var major = beacons.map { it.id2 }[0].toString()
                var minor = beacons.map { it.id3 }[0].toString()
                var rssi = beacons.map { it.rssi }[0].toString()
                var filteredRssi = kalman.filter(rssi.toFloat()).toString()
                var error = (abs(rssi.toDouble()) - abs(filteredRssi.toDouble())).pow(2).toString()
                val wifi = wifiManager.connectionInfo

                // bssid : access point ??? ??????
                Log.w("$$$ WIFI INFO $$$",
                    "mac: ${wifi.macAddress}, RSSI: ${wifi.rssi}, BSSID:${wifi.bssid}, SSID:${wifi.ssid}")

                // threshold ???????????? reset
//                if (abs(abs(previousRssi)) - abs(rssi.toInt()) > 15) {
//                    kalman = KalmanFilter(R = 0.001f, Q = 2f)
//                    Log.w("$$$ Detected Beacons $$$", "Filter Reset")
//                }

                beaconDataList.add(arrayOf(LocalDateTime.now().toString(),
                    uuid,
                    major,
                    minor,
                    rssi,
                    filteredRssi,
                    error,
                    wifi.rssi.toString()))
                filteredRssiArr.add(filteredRssi.toFloat())
                doInference(filteredRssi)

//                Log.i("$$$ Detected Beacons $$$",
//                    "UUID: $uuid major: $major minor:$minor RSSI: $rssi Filtered RSSI: $filteredRssi")
                Log.i("$$$ Detected Beacons $$$",
                    "RSSI: $rssi Filtered RSSI: $filteredRssi, Error: $error")
                previousRssi = rssi.toInt()
            } else {
                Log.w("$$$ Detected Empty Beacons $$$", beacons.map { it.rssi }.toString())
            }
        }
    }

    fun save() {
        csvHelper.writeData("$fileName${
            LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_TIME)
        }.csv", beaconDataList)
    }

    fun rangingButtonTapped() {
        val beaconManager = BeaconManager.getInstanceForApplication(this)
        if (beaconManager.rangedRegions.isEmpty()) {
            beaconManager.startRangingBeacons(beaconReferenceApplication.region)
            binding.rangingButton.text = "Stop Ranging"
            binding.beaconCount.text = "Ranging enabled -- awaiting first callback"
        } else {
            beaconManager.stopRangingBeacons(beaconReferenceApplication.region)
            binding.rangingButton.text = "Start Ranging"
            binding.beaconCount.text = "Ranging disabled -- no beacons detected"
            binding.beaconList.adapter =
                ArrayAdapter(this, android.R.layout.simple_list_item_1, arrayOf("--"))
        }
    }

    fun monitoringButtonTapped(view: View) {
        var dialogTitle = ""
        var dialogMessage = ""
        val beaconManager = BeaconManager.getInstanceForApplication(this)
        if (beaconManager.monitoredRegions.isEmpty()) {
            beaconManager.startMonitoring(beaconReferenceApplication.region)
            dialogTitle = "Beacon monitoring started."
            dialogMessage =
                "You will see a dialog if a beacon is detected, and another if beacons then stop being detected."
            binding.monitoringButton.text = "Stop Monitoring"

        } else {
            beaconManager.stopMonitoring(beaconReferenceApplication.region)
            dialogTitle = "Beacon monitoring stopped."
            dialogMessage = "You will no longer see dialogs when becaons start/stop being detected."
            binding.monitoringButton.text = "Start Monitoring"
        }
        val builder = AlertDialog.Builder(this)
        builder.setTitle(dialogTitle)
        builder.setMessage(dialogMessage)
        builder.setPositiveButton(android.R.string.ok, null)
        alertDialog?.dismiss()
        alertDialog = builder.create()
        alertDialog?.show()
    }

    override fun onRequestPermissionsResult(requestCode: Int,
                                            permissions: Array<out String>,
                                            grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        for (i in 1 until permissions.size) {
            Log.d(TAG, "onRequestPermissionResult for " + permissions[i] + ":" + grantResults[i])
            if (grantResults[i] != PackageManager.PERMISSION_GRANTED) {
                //check if user select "never ask again" when denying any permission
                if (!shouldShowRequestPermissionRationale(permissions[i])) {
                    neverAskAgainPermissions.add(permissions[i])
                }
            }
        }
    }

    // ?????? mac ?????? : 0A:7B:45:A0:E2:6C
    // ???????????? mac ?????? : D4:11:A3:7C:89:0B
    // Android 8.0 ?????? Android ????????? ??????????????? ?????? ???????????? ?????? ???????????? ??? ??????????????? ????????? ??? ????????? MAC ?????? ??????.
    // Android 10 ????????? ??????????????? ??????????????? ??????, SoftAP, Wi-Fi Direct ?????? MAC ?????? ????????? ?????? ????????? ?????? ?????????.
    // Why? MAC ????????? Wi-Fi ?????? ????????? ?????? ????????? ????????? ???????????? ??? ???????????? ??????

    // ?????? ??? ????????? or ??????????????? ?????? ???????????? ??????!

    // wifi ???????????? ?????? MAC / ???????????? MAC ????????? ?????? MAC ??? ???????????? ??????????????????
    // ??????????????? ???????????? ????????? ???????????? ????????? Wi-Fi Mac ????????? ?????? ????????? ??????
    // WiFi ?????? ??? ???????????? ???????????? MAC ??? ???????????? ???????????? wifi mac ?????? ????????? ??? ??????!
    // ?????? ??????????????? ????????? ????????? ????????? ?????????????????????, ????????? ?????
    private fun getMacAddress(): String? = try {
        NetworkInterface.getNetworkInterfaces().toList().find { networkInterface ->
            networkInterface.name.equals("wlan0", ignoreCase = true)
        }?.hardwareAddress?.joinToString(separator = ":") { byte -> "%02X".format(byte) }
    } catch (exception: Exception) {
        exception.printStackTrace()
        null
    }

    // ANDROID_ID : ??????????????? ?????? Boot ??? ??? ?????? ?????? 64-bit ???
    // ??????????????? ??????????????? ?????? ?????? ?????? ????????? ?????? ?????? ???
    // ??? ?????? ????????? ANDROID_ID ??? ????????? ????????????.
    // => ??? ????????? ????????? ????????? ?????? APK ??? Android ID ??? ?????? ??? ??????!
    // ?????? ????????? ????????? ???????????? ????????? ??? ????????? ?????? ???!
    // ?????????, ?????? ???????????? ???????????? ?????? ??? ?????? ANDROID_ID ??? ????????????.

    // ????????? ???????????? ????????? ???????????? ?????? ???????????? ????????? ??? ??????!
    // ?????????: 100e2e222cfe79e1
    // ????????? or ??????????????? ?????? ???????????? ??????
    private fun deviceID(): String {
        return Settings.Secure.getString(applicationContext.contentResolver,
            Settings.Secure.ANDROID_ID)
    }

    private fun doInference(rssi: String) {
        val input = ByteBuffer.allocateDirect(4).order(ByteOrder.nativeOrder())
        input.putFloat(rssi.toFloat())

        val bufferSize = 1000 * java.lang.Float.SIZE / java.lang.Byte.SIZE
        val modelOutput = ByteBuffer.allocateDirect(bufferSize).order(ByteOrder.nativeOrder())
        interpreter?.run(input, modelOutput)

        modelOutput.rewind()
        val probabilities = modelOutput.float

        Log.w("tttt ", probabilities.toString())
    }

    companion object {
        val TAG = "MainActivity"
    }
}