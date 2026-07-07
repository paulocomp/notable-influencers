# Notable Influencers

<div style="text-align: center; margin-top: 50px">

![React](https://img.shields.io/badge/-React-61DAFB?logo=react\&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript\&logoColor=white)
![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite\&logoColor=white)
![MapLibre](https://img.shields.io/badge/-MapLibre-396CB2?logo=maplibre\&logoColor=white)
![GeoJSON](https://img.shields.io/badge/-GeoJSON-8BC34A?logo=json\&logoColor=white)

## [🌎️ CLIQUE AQUI para acessar o Mapa](https://paulocomp.github.io/notable-influencers/)

</div>

## Sobre o projeto

O _Notable Influencers_ é um mapa interativo que reúne influenciadores e criadores de
conteúdo com relevância para o público brasileiro. O foco do projeto não está apenas em
influenciadores brasileiros, mas em personalidades cuja atuação possui impacto 
significativo no Brasil.

A ideia foi inspirada pelo projeto [Notable People](https://tjukanovt.github.io/notable-people),
adaptando o conceito para o universo de influenciadores digitais e criadores de conteúdo.

## Coleta e processamento dos dados

A base de dados foi construída por meio de um pipeline de **web scraping** desenvolvido 
num projeto separado. O processo utiliza buscas avançadas na **Wikipedia** por meio da
**Wikimedia API**, combinadas com critérios de inclusão e exclusão baseados em palavras-chave
para identificar criadores de conteúdo e filtrar perfis fora do escopo do projeto.

Após a etapa inicial de coleta, os resultados passam por processos adicionais de 
filtragem e enriquecimento dos dados. Em seguida, é realizado o **scraping** das páginas 
da Wikipedia para obter informações geográficas, como local de nascimento. A partir 
desses dados geográficos em formato textual, as coordenadas geográficas são obtidas por 
meio de consultas à **API do OpenStreetMap (OSM)**, permitindo a geração da base **GeoJSON** 
utilizada no mapa.

A identificação de influenciadores em larga escala envolve critérios subjetivos, o que 
pode resultar na inclusão de alguns perfis não estritamente classificados como 
influenciadores e na ausência de outros relevantes. A base continuará a ser refinada 
com a evolução dos critérios de coleta e filtragem.

## Objetivos do projeto

Além da visualização dos dados, o projeto foi desenvolvido como uma oportunidade para 
estudar e aplicar conceitos de web scraping, processamento de dados, GeoJSON, aplicações 
SPA com React, TypeScript e visualização de informações geográficas em mapas interativos.

O projeto também funciona como uma **Proof of Concept (PoC)** para uma iniciativa mais ampla voltada 
ao estudo da influência digital no Brasil. Em versões futuras, a proposta é evoluir a coleta 
e o processamento dos dados, incorporar métricas de relevância, construir ‘rankings’ dinâmicos 
e explorar análises geográficas e socioeconômicas relacionadas à distribuição de 
influenciadores e criadores de conteúdo no país.
