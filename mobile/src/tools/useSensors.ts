import * as Location from 'expo-location';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

export type Perm = 'unknown' | 'granted' | 'denied';

/**
 * Heading + position from on-device sensors and GNSS while the screen is focused.
 * No network location provider is involved.
 */
export function useSensors() {
  const [perm, setPerm] = useState<Perm>('unknown');
  const [heading, setHeading] = useState<Location.LocationHeadingObject | null>(null);
  const [position, setPosition] = useState<Location.LocationObject | null>(null);

  const request = useCallback(async () => {
    const res = await Location.requestForegroundPermissionsAsync();
    setPerm(res.granted ? 'granted' : 'denied');
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      const subs: Location.LocationSubscription[] = [];
      void (async () => {
        const current = await Location.getForegroundPermissionsAsync();
        if (cancelled) return;
        if (!current.granted) {
          setPerm(current.canAskAgain ? 'unknown' : 'denied');
          return;
        }
        setPerm('granted');
        subs.push(await Location.watchHeadingAsync(setHeading));
        subs.push(
          await Location.watchPositionAsync({ accuracy: Location.Accuracy.BestForNavigation, timeInterval: 2000, distanceInterval: 1 }, setPosition),
        );
        if (cancelled) subs.forEach((s) => s.remove());
      })();
      return () => {
        cancelled = true;
        subs.forEach((s) => s.remove());
      };
    }, [perm]),
  );

  const trueAvailable = heading !== null && heading.trueHeading >= 0;
  const degrees = heading ? (trueAvailable ? heading.trueHeading : heading.magHeading) : null;
  return { perm, request, heading, position, degrees, trueAvailable };
}
