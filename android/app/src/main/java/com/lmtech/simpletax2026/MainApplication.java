package com.lmtech.simpletax2026;

import android.app.Application;
import com.revenuecat.purchases.LogLevel;
import com.revenuecat.purchases.Purchases;
import com.revenuecat.purchases.PurchasesConfiguration;

/**
 * Application class para inicializar o RevenueCat
 */
public class MainApplication extends Application {
    
    @Override
    public void onCreate() {
        super.onCreate();
        
        // Configurar RevenueCat
        Purchases.setLogLevel(LogLevel.DEBUG);
        
        PurchasesConfiguration.Builder builder = new PurchasesConfiguration.Builder(
            this,
            "test_tbIAxLOLVapVygyLidABqbXJFSa" // API Key do .env
        );
        
        Purchases.configure(builder.build());
    }
}
