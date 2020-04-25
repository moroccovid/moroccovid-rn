package com.marocovid;

import android.app.AlertDialog;
import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


public class ChangeDeviceNameModule extends ReactContextBaseJavaModule {

    Context mContext;
    private BluetoothAdapter BTAdapter;

    public ChangeDeviceNameModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
        BTAdapter = BluetoothAdapter.getDefaultAdapter();
    }

    @Override
    public String getName() {
        return "ChangeDeviceName";
    }

    @ReactMethod
    public void setName(String name) {
        if (BTAdapter == null) {
            new AlertDialog.Builder(getReactApplicationContext())
                    .setTitle("Pas Compatible")
                    .setMessage("Votre telephone ne supporte pas Bluetooth")
                    .setPositiveButton("Exit", new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int which) {
                            System.exit(0);
                        }
                    })
                    .setIcon(android.R.drawable.ic_dialog_alert)
                    .show();
            return;
        }

        if (!BTAdapter.isEnabled()) {
            new AlertDialog.Builder(getReactApplicationContext())
                    .setTitle("Erreur")
                    .setMessage("Activer le bluetooth")
                    .setPositiveButton("Exit", new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int which) {
                            System.exit(0);
                        }
                    })
                    .setIcon(android.R.drawable.ic_dialog_alert)
                    .show();
        }
        //String macAddress = Settings.Secure.getString(getContentResolver(), SECURE_SETTINGS_BLUETOOTH_ADDRESS);
        if(BTAdapter.getState() == BluetoothAdapter.STATE_ON){
            BTAdapter.setName("1122334");
        }
    }
}