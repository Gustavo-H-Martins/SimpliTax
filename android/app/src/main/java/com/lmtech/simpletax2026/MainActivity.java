package com.lmtech.simpletax2026;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Registrar plugin RevenueCat
        registerPlugin(RevenueCatPlugin.class);
    }
}
