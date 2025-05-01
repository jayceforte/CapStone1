import {useEffect, useState} from "react";
import { Link } from "react-router-dom";


export default function Home() {
    const [items, setItems] = useState([]);
  
    useEffect(() => {
      get("/items").then(res => setItems(res.data));
    }, []);
  
    return (
      <div>
        <h1>All Reviewed Items</h1>
        <ul>
          {items.map(item => (
            <li key={item._id}>
              <Link to={`/item/${item._id}`}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  