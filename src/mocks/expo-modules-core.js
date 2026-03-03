import * as ExpoModulesCore from '../../node_modules/expo-modules-core/build/index';

export const Platform = ExpoModulesCore.Platform;
export const EventEmitter = ExpoModulesCore.EventEmitter;
export const NativeModulesProxy = ExpoModulesCore.NativeModulesProxy;
export const CodedError = ExpoModulesCore.CodedError;
export const UnavailabilityError = ExpoModulesCore.UnavailabilityError;
export const uuid = ExpoModulesCore.uuid;
export const DeviceEventEmitter = ExpoModulesCore.DeviceEventEmitter;
export const SyntheticPlatformEmitter = ExpoModulesCore.SyntheticPlatformEmitter;
export const createPermissionHook = ExpoModulesCore.createPermissionHook;

// Mock requireNativeViewManager to return a dummy component
export const requireNativeViewManager = (viewName) => {
  const ViewManager = (props) => {
    return null; 
  };
  return ViewManager;
};

// Mock requireNativeModule to return a proxy
export const requireNativeModule = (moduleName) => {
  return new Proxy({}, {
    get: (target, prop) => {
      if (prop === 'addListener') return () => {};
      if (prop === 'removeListeners') return () => {};
      return () => {};
    }
  });
};

export const registerWebModule = (module) => {
  // no-op
};

export const requireOptionalNativeModule = (moduleName) => {
  return null;
};

export class NativeModule {
  // base class
}

export const createSnapshotFriendlyRef = (ref) => ref;