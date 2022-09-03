import axios from "axios";

const baseURL = "https://openlibrary.org";

const client = axios.create({ baseURL });

const searchBook = (query: object) => {
  return client.get("search.json", { params: query });
};

export default searchBook;
