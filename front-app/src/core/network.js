import axios from "axios";

const baseURL = "localhost:8000";

const postRequest = async (body, query, params, endPoint) => {
  return await axios.post(
    `${baseURL}/${endPoint}/${params ? params : ""}`,
    body,
    {
      params: query,
      headers:{
        "Accept":"json"
      }
    },
  );
};

const getRequest = async (query, params, endPoint) => {
  return await axios.get(`${baseURL}/${endPoint}${params ? params : ""}`, {
    params: query,
  });
};

const delRequest = async (query, params, endPoint) => {
  return await axios.delete(`${baseURL}/${endPoint}${params ? params : ""}`, {
    params: query,
  });
};

const putRequest = async (body, query, params, endPoint) => {
  return await axios.put(
    `${baseURL}/${endPoint}/${params ? params : ""}`,
    body,
    {
      params: query,
      headers: {
        
      },
    }
  );
};

export { postRequest, getRequest, delRequest, putRequest };
