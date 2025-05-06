import {useEffect, useState} from "react";
import { Link } from "react-router-dom";


export default function Home() {
    const [items, setItems] = useState([]);
  
    useEffect(() => {
      fetch("http://localhost:4000/api/items")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error(err));
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
  