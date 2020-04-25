package com.marocovid.changeDeviceName;

import android.app.AlertDialog;
import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.DialogInterface;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;


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
    public void setName(String name,Promise promise) {
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
            promise.reject("Bluetooth not supported");
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

        if(BTAdapter.getState() == BluetoothAdapter.STATE_ON){
            BTAdapter.setName(name);
            promise.resolve(true);
        }else{
            promise.reject("Bluetooth not on");
        }
    }
}