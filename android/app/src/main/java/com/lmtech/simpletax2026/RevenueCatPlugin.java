package com.lmtech.simpletax2026;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.revenuecat.purchases.CustomerInfo;
import com.revenuecat.purchases.Package;
import com.revenuecat.purchases.Purchases;
import com.revenuecat.purchases.PurchasesError;
import com.revenuecat.purchases.interfaces.ReceiveCustomerInfoCallback;
import com.revenuecat.purchases.interfaces.PurchaseCallback;

/**
 * Plugin Capacitor para integrar RevenueCat com JavaScript
 */
@CapacitorPlugin(name = "RevenueCatPlugin")
public class RevenueCatPlugin extends Plugin {

    @PluginMethod
    public void checkSubscription(PluginCall call) {
        Purchases.getSharedInstance().getCustomerInfo(new ReceiveCustomerInfoCallback() {
            @Override
            public void onReceived(CustomerInfo customerInfo) {
                JSObject ret = new JSObject();
                ret.put("isPremium", customerInfo.getEntitlements().getActive().containsKey("premium"));
                ret.put("userId", customerInfo.getOriginalAppUserId());
                call.resolve(ret);
            }

            @Override
            public void onError(PurchasesError error) {
                call.reject("Error checking subscription: " + error.getMessage());
            }
        });
    }

    @PluginMethod
    public void purchasePackage(PluginCall call) {
        String packageId = call.getString("packageId");
        if (packageId == null) {
            call.reject("Package ID is required");
            return;
        }

        // Buscar offerings e fazer compra
        // Implementação completa requer activity context
        call.reject("Not implemented yet - use RevenueCat Paywall UI");
    }

    @PluginMethod
    public void restorePurchases(PluginCall call) {
        Purchases.getSharedInstance().restorePurchases(new ReceiveCustomerInfoCallback() {
            @Override
            public void onReceived(CustomerInfo customerInfo) {
                JSObject ret = new JSObject();
                ret.put("isPremium", customerInfo.getEntitlements().getActive().containsKey("premium"));
                call.resolve(ret);
            }

            @Override
            public void onError(PurchasesError error) {
                call.reject("Error restoring purchases: " + error.getMessage());
            }
        });
    }
}
