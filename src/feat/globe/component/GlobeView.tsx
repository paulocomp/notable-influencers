import 'maplibre-gl/dist/maplibre-gl.css';
import {useMap} from "../hook/useMap.ts";
import useInfluencerLayers from "../hook/useInfluencerLayers.ts";

function GlobeView() {
    const { mapContainer, mapRef } = useMap();

    useInfluencerLayers(mapRef);

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

export default GlobeView;