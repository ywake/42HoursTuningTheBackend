import axios from 'axios';

const backendHost = process.env.REACT_APP_BACKEND_HOST || 'http://localhost:3000';
const apiBasePath = '/api/client/';
const url = `${backendHost}${apiBasePath}`;

const httpClient = async (url: string, options: any = {}) => {
  if (!options.headers) {
    options.headers = { 'content-type': 'application/json' };
  } else {
    options.headers['content-type'] = 'application/json';
  }

  //サンプルアプリでは、特定のユーザに固定したログイン状態。
  options.headers['x-app-key'] = `user1`;
  return axios({ url, headers: options.headers, method: options.method, data: options.body });
};

interface PostRecords {
  title: string;
  detail: string;
  categoryId: number;
  fileIdList: { fileId: string; thumbFileId: string }[];
}
interface PostComments {
  value: string;
}
interface UpdateRecord {
  status: string;
}
interface ListQuery {
  limit: number;
  offset: number;
}
interface PostFiles {
  name: string;
  data: string;
}
/*
    postFiles,
    */
export const restClient = {
  postRecords: async (data: PostRecords): Promise<any> => {
    const path = 'records';

    const res = await httpClient(url + path, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return res;
  },
  getRecord: async (recordId: string): Promise<any> => {
    const path = `records/${recordId}`;

    const res = await httpClient(url + path);

    return res;
  },
  updateRecord: async (recordId: string, data: UpdateRecord): Promise<any> => {
    const path = `records/${recordId}`;

    const res = await httpClient(url + path, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    return res;
  },
  tomeActive: async (query: ListQuery): Promise<any> => {
    const path = `record-views/tomeActive?offset=${query.offset}&limit=${query.limit}`;

    const res = await httpClient(url + path);

    return res;
  },
  allActive: async (query: ListQuery): Promise<any> => {
    const path = `record-views/allActive?offset=${query.offset}&limit=${query.limit}`;

    const res = await httpClient(url + path);

    return res;
  },
  allClosed: async (query: ListQuery): Promise<any> => {
    const path = `record-views/allClosed?offset=${query.offset}&limit=${query.limit}`;

    const res = await httpClient(url + path);

    return res;
  },
  mineActive: async (query: ListQuery): Promise<any> => {
    const path = `record-views/mineActive?offset=${query.offset}&limit=${query.limit}`;

    const res = await httpClient(url + path);

    return res;
  },
  getCategories: async (): Promise<any> => {
    const path = `categories`;

    const res = await httpClient(url + path);

    return res;
  },
  postComments: async (recordId: string, data: PostComments): Promise<any> => {
    const path = `records/${recordId}/comments`;

    const res = await httpClient(url + path, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return res;
  },
  getComments: async (recordId: string): Promise<any> => {
    const path = `records/${recordId}/comments`;

    const res = await httpClient(url + path);

    return res;
  },
  postFiles: async (data: PostFiles): Promise<any> => {
    const path = 'files';

    const res = await httpClient(url + path, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return res;
  },
  getFile: async (recordId: string, itemId: number, isThumbnail: boolean): Promise<any> => {
    const path = !isThumbnail ? `records/${recordId}/files/${itemId}` : `records/${recordId}/files/${itemId}/thumbnail`;

    const res = await httpClient(url + path);

    return res;
  }
};

export const getImageUrl = (recordId: string, itemId: number) => {
  return `${url}records/${recordId}/files/${itemId}`;
};
