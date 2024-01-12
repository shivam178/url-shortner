export interface ApiResponseType {
  statusCode: number;
  result: {
    list?: any[];
    count?: number;
    data?: any;
  };
  error: any;
  message?: string;
  errKey?: any;
};
