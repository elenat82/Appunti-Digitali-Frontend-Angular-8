export interface MenuVoice {
    id: number;
    tipo: string;
    titolo: string;
    tagsangular: TaxonomyInMenu[];
    tagshtml: TaxonomyInMenu[];
    tagscss: TaxonomyInMenu[];
    tagsdrupal: TaxonomyInMenu[];
    tagsjs: TaxonomyInMenu[];
    tagsphp: TaxonomyInMenu[];
    tagsgenerici: TaxonomyInMenu[];
}

export interface TaxonomyInMenu {
    id: string;
    title: string;
}