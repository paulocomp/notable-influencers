import useWikiData from '../hook/useWikiData';

interface WikiPopupProps {
    title: string;
    url: string;
}

export function WikiPopup({ title, url }: WikiPopupProps) {
    const { extract, thumbnail, isLoading, error } = useWikiData(url);

    // Avatar padrão caso o influenciador não tenha foto na Wikipédia
    const defaultAvatar = "https://www.w3schools.com/howto/img_avatar.png";

    return (
        <div style={{
            fontFamily: 'sans-serif',
            padding: '5px',
            maxWidth: '240px',
            color: '#333'
        }}>
            {/* O link se torna azul, maior e sublinhado no hover via estilos normais */}
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#0066cc',
                    textDecoration: 'none',
                    display: 'block',
                    marginBottom: '8px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
                {title}
            </a>

            {isLoading && <p style={{ fontSize: '12px', color: '#666' }}>Buscando dados da Wikipédia...</p>}
            {error && <p style={{ fontSize: '12px', color: '#ff4d4d' }}>Não foi possível carregar o preview.</p>}

            {!isLoading && !error && (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <img
                        src={thumbnail || defaultAvatar}
                        alt={title}
                        style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1px solid #ccc'
                        }}
                    />
                    <p style={{ fontSize: '12px', margin: 0, lineHeight: '1.4', color: '#555' }}>
                        {extract || 'Nenhum resumo disponível.'}
                    </p>
                </div>
            )}
        </div>
    );
}

export default WikiPopup