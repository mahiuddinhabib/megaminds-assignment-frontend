export interface IMeta {
  limit: number;
  page: number;
  total: number;
}

export type ResponseSuccessType = {
  data: any;
  meta?: IMeta;
};

export type IGenericErrorResponse = {
  error: {
    statusCode: number;
    message: string;
    errorMessages: IGenericErrorMessage[];
  };
};

export type IGenericErrorMessage = {
  path: string | number;
  message: string;
};

export interface IUser {
  id: string,
  name: string,
  email: string,
  password: string,
  role: string,
  contactNo: string,
  address: string,
  profileImg: string,
}
