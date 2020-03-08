export interface ContentHtml {
    id: number;
    tipo: string;
    titolo: string;
    body: string, 
    tagshtml: TaxTerm[];
    tagsgenerici: TaxTerm[];
    versionihtml: TaxTerm[];
    approfondimenti: string[];
    correlati: string[];
    timestamp: string;
}

export interface ContentCss {
    id: number;
    tipo: string;
    titolo: string;
    body: string, 
    tagscss: TaxTerm[];
    tagsgenerici: TaxTerm[];
    versionicss: TaxTerm[];
    approfondimenti: string[];
    correlati: string[];
    timestamp: string;
}

export interface ContentJS {
    id: number;
    tipo: string;
    titolo: string;
    body: string, 
    tagsjs: TaxTerm[];
    tagsgenerici: TaxTerm[];
    versionijs: TaxTerm[];
    approfondimenti: string[];
    correlati: string[];
    timestamp: string;
}

export interface ContentAngular {
    id: number;
    tipo: string;
    titolo: string;
    body: string, 
    tagsangular: TaxTerm[];
    tagsgenerici: TaxTerm[];
    versioniangular: TaxTerm[];
    approfondimenti: string[];
    correlati: string[];
    timestamp: string;
}

export interface ContentPhp {
    id: number;
    tipo: string;
    titolo: string;
    body: string, 
    tagsphp: TaxTerm[];
    tagsgenerici: TaxTerm[];
    approfondimenti: string[];
    correlati: string[];
    timestamp: string;
}

export interface ContentDrupal {
    id: number;
    tipo: string;
    titolo: string;
    body: string, 
    tagsdrupal: TaxTerm[];
    tagsgenerici: TaxTerm[];
    approfondimenti: string[];
    correlati: string[];
    timestamp: string;
}

export interface ContentVarie {
    id: number;
    tipo: string;
    titolo: string;
    body: string, 
    tagsgenerici: TaxTerm[];
    approfondimenti: string[];
    correlati: string[];
    timestamp: string;
}

export interface TaxTerm {
    id: number;
    title: string;
}
