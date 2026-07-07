import { useState, useEffect } from 'react';

interface WikiSummary {
    title: string;
    extract: string;
    thumbnail?: string;
    isLoading: boolean;
    error: boolean;
}

function useWikiData(wikipediaUrl: string | undefined) {

    const [data, setData] = useState<WikiSummary>(() => {
        const hasValidUrl = wikipediaUrl && wikipediaUrl.includes('/wiki/');
        return {
            title: '',
            extract: '',
            isLoading: !!hasValidUrl,
            error: false,
        };
    });

    useEffect(() => {
        if (!wikipediaUrl) return;

        const urlParts = wikipediaUrl.split('/wiki/');
        if (urlParts.length < 2) {
            setData(prev => ({ ...prev, isLoading: false }));
            return;
        }

        const pageTitle = decodeURIComponent(urlParts[1]);
        let isMounted = true;

        fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${pageTitle}`)
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(wikiJson => {
                if (!isMounted) return;

                setData({
                    title: wikiJson.title,
                    extract: wikiJson.extract ? wikiJson.extract.split(' ').slice(0, 30).join(' ') + '...' : '',
                    thumbnail: wikiJson.thumbnail?.source,
                    isLoading: false,
                    error: false
                });
            })
            .catch(() => {
                if (!isMounted) return;
                setData(prev => ({ ...prev, isLoading: false, error: true }));
            });

        return () => {
            isMounted = false;
        };
    }, [wikipediaUrl]);

    return data;
}

export default useWikiData