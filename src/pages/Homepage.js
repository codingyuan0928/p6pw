import React, { useState, useEffect } from "react";
import Search from "../components/Search";
import Picture from "../components/Picture";
const Homepage = () => {
  let [input, setInput] = useState("");
  let [data, setData] = useState(null);
  let [page, setPage] = useState(1); //去解決增加相片的問題
  let [currentSearch, setCurrentSearch] = useState(""); //解決搜尋紀錄影響input的問題
  const auth = "kEY18C5xuAcF1b5pJnIViFh3EgzNBVr7b4t4FUM1oHAgUyRvdKGpCgVN";
  const initialURL = "https://api.pexels.com/v1/curated?page=1&per_page=15";
  const searchURL = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=15&page=1`;
  //fetch data from pexels api
  const search = async (url) => {
    setPage(2); //避免按下load more出現同樣的相片
    const dataFetch = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json", Authorization: auth },
    });
    let parsedData = await dataFetch.json();
    setData(parsedData.photos);
  };
  //load more picture
  const morepicture = async () => {
    let newURL;
    if (input === "") {
      newURL = `https://api.pexels.com/v1/curated?page=${page}&per_page=15`;
    } else {
      newURL = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=15&page=${page}`;
    }
    setPage(page + 1);
    const dataFetch = await fetch(newURL, {
      method: "GET",
      headers: { Accept: "application/json", Authorization: auth },
    });
    let parsedData = await dataFetch.json();
    setData(data.concat(parsedData.photos)); //concat用於連接兩個array，並不改變原本的array
  };
  //fetch when the page loads up
  useEffect(() => {
    search(initialURL);
  }, []);
  //因為有js closure的問題，所以使用useEffect去解決
  useEffect(() => {
    if (currentSearch === "") {
      search(initialURL);
    } else {
      search(searchURL);
    }
  }, [currentSearch]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Search
        search={() => {
          //JS Closure
          setCurrentSearch(input);
        }}
        setInput={setInput}
      />
      <div className="pictures">
        {data &&
          data.map((d) => {
            return <Picture data={d} />;
          })}
      </div>
      <div className="morePicture">
        <button onClick={morepicture}>Load More</button>
      </div>
    </div>
  );
};

export default Homepage;
