export interface filter_data {
    words: string[] | [];
    limit: number;
    skip: number;
    operational: 'ONE' | 'NONE' | 'LIMIT_SKIP';
}

export interface fetched_data {
    data?: any;
    error?: any;
}