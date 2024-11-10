export interface BaseResponse<M, D> {
    code?: number;
    codeType?: string;
    codeMessage?: string;
    message?: M;
    data: D;
    pagination?: BasePagination;
    traceId?: string;
  }

  export interface BasePagination {
    current_page: number;
    per_page: number;
    count: number;
    total_records: number;
    link_parameter: Link;
    links: Link;
  }
  
  export interface Link {
    first: string;
    last: string;
    next: string;
    previous: string;
  }

  export interface BaseReqFind {
    page: number;
    size: number;
    value: any; // or a specific type if known
    sortBy: { [key: string]: any }; // or specific types for keys and values if known
  }