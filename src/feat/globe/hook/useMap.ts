import { useEffect, useRef } from "react";
import maplibregl, { Map } from "maplibre-gl";

export function useMap() {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);

    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return;

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://tiles.openfreemap.org/styles/dark',
            center: [-55, -12],
            zoom: 3.2,
        });

        map.on('style.load', () => {
            map.setProjection({ type: 'globe' });
        });

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    return { mapContainer, mapRef };
}