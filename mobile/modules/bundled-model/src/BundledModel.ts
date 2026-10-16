import { requireOptionalNativeModule } from 'expo';

interface Subscription {
  remove(): void;
}

interface BundledModelNative {
  hasAsset(assetPath: string): boolean;
  copyAsset(assetPath: string, destUri: string): Promise<number>;
  addListener(event: 'onCopyProgress', listener: (event: { bytes: number }) => void): Subscription;
}

/** Android only (null on iOS, where the model is read straight from the app bundle). */
export const BundledModel = requireOptionalNativeModule<BundledModelNative>('BundledModel');
