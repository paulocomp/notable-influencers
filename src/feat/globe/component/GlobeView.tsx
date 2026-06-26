import {useEffect, useRef} from "react";
import maplibregl, {Map} from "maplibre-gl";
import 'maplibre-gl/dist/maplibre-gl.css';

function GlobeView() {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);

    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return;

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://demotiles.maplibre.org/style.json',
            center: [0, 0],
            zoom: 2,
        });

        map.on('style.load', () => {
            map.setProjection({
                type: 'globe',
            });
        });

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    return (
        <div
            ref={mapContainer}
            style={{
                width: '100%',
                height: '100vh',
            }}
        />
    );
}

export default GlobeView