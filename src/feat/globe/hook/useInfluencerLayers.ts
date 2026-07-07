import {type RefObject, useEffect} from "react";
import {Map} from "maplibre-gl";

function handleHover(map: Map) {
    map.on('click', 'labels-influenciadores', (e) => {
        const url = e.features?.[0].properties?.url;
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
    });

    map.on('mouseenter', 'labels-influenciadores', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'labels-influenciadores', () => {
        map.getCanvas().style.cursor = '';
    });
}

function useInfluencerLayers(mapRef: RefObject<Map | null>) {
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const handleMapLoad = () => {
            if (map.getSource('influencers-source')) return;

            map.addSource('influencers-source', {
                type: 'geojson',
                data: '/influencer-map/data/04_map_data.geojson',
            });

            map.addLayer({
                id: 'labels-influenciadores',
                type: 'symbol',
                source: 'influencers-source',
                layout: {
                    'text-field': ['get', 'title'],
                    'text-size': 12,
                    'text-variable-anchor': [
                        'top',
                        'bottom',
                        'left',
                        'right',
                        'top-left',
                        'top-right',
                        'bottom-left',
                        'bottom-right'
                    ],
                    'text-radial-offset': 0.5,
                    'text-justify': 'auto',
                    'text-allow-overlap': false,
                },
                paint: {
                    'text-color': '#dd2d4a',
                    'text-halo-color': '#dd2d4a',
                    'text-halo-width': 0.1
                }
            });

            handleHover(map)
        };

        if (map.loaded()) {
            handleMapLoad();
        } else {
            map.on('load', handleMapLoad);
        }

        return () => {
            if (!mapRef["current"]) {
                return;
            }
            mapRef["current"].off('load', handleMapLoad);
        };
    }, [mapRef]);
}

export default useInfluencerLayers