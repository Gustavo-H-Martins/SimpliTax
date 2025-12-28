// Plugin bridge para RevenueCat no Capacitor
import { registerPlugin } from '@capacitor/core';

export interface RevenueCatPlugin {
  checkSubscription(): Promise<{ isPremium: boolean; userId: string }>;
  purchasePackage(options: { packageId: string }): Promise<void>;
  restorePurchases(): Promise<{ isPremium: boolean }>;
}

const RevenueCat = registerPlugin<RevenueCatPlugin>('RevenueCatPlugin');

export default RevenueCat;
