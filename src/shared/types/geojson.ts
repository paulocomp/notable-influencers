import type {Feature, FeatureCollection, Point} from 'geojson';

export interface InfluencerProperties {
    title: string;
    url: string;
    location: string;
}

export type InfluencerFeature = Feature<Point, InfluencerProperties>;
export type InfluencerFeatureCollection = FeatureCollection<Point, InfluencerProperties>;