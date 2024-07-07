import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import 'daisyui/dist/full.css';

const MetaTags = ({ title, description, image, color }) => {
  useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]').setAttribute('content', description);
    document.querySelector('meta[property="og:title"]').setAttribute('content', title);
    document.querySelector('meta[property="og:description"]').setAttribute('content', description);
    document.querySelector('meta[property="og:image"]').setAttribute('content', image);
    document.querySelector('meta[name="theme-color"]').setAttribute('content', color);
  }, [title, description, image, color]);

  return null;
};

const ItemDetail = ({ selectedItem }) => {
  const formatLyrics = (lyrics) => {
    return lyrics.split('\n').map((line, index) => (
      <span key={index}>{line}<br /></span>
    ));
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center">
        <Link to="/" className="btn btn-outline btn-circle mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h2 className="text-2xl font-bold text-accent">{selectedItem.name}</h2>
      </div>
      <div className="mt-4">
        <div className="collapse bg-base-200">
          <input type="checkbox" checked={isOpen} onChange={() => setIsOpen(!isOpen)} />
          <div className="collapse-title text-xl font-medium bg-neutral text-neutral-content">
            {isOpen ? 'Song Info (click to hide)' : 'Song Info (click to reveal)'}
          </div>
          {isOpen && (
            <div className="collapse-content bg-neutral text-neutral-content">
              <p><strong>Artist:</strong> {selectedItem.artist || '???'}</p>
              <p><strong>Date:</strong> {selectedItem.date || '???'}</p>
              <p><strong>BPM:</strong> {selectedItem.bpm || '???'}</p>
              <p><strong>Key:</strong> {selectedItem.key || '???'}</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        {formatLyrics(selectedItem.lyrics)}
      </div>
    </div>
  );
};

const ItemListItem = ({ item }) => {
  return (
    <li className="flex items-center p-4 mb-2 border border-primary rounded-lg cursor-pointer">
      <Link to={`item?id=${item.id}`} className="flex items-center w-full">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-lg mr-4 border border-secondary" />
        ) : (
          <div className="w-32 h-32 flex items-center justify-center border-secondary rounded-lg mr-4">
            <span className="text-3xl">???</span>
          </div>
        )}
        <div className="text-left">
          <span className="block text-2xl font-bold">{item.name}</span>
          <span className="block text-lg text-gray-500">{item.artist} - {item.year}</span>
        </div>
      </Link>
    </li>
  );
};

const App = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/items.json')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error loading items:', error));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <MetaTags
        title="LyricOcean"
        description="only the best lyrics website this side of uhhh"
        image="logo512.png"
        color="#00cdb7"
      />
      <Router basename="/">
        <Routes>
          <Route path="/" element={<Home items={items} />} />
          <Route path="/item" element={<ItemDetailPage items={items} />} />
        </Routes>
      </Router>
    </div>
  );
};

const Home = ({ items }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  document.title = `LyricOcean`;
  document.querySelector('meta[property="og:title"]').setAttribute('content', "LyricOcean");
  document.querySelector('meta[property="og:description"]').setAttribute('content', "only the best lyrics website this side of uhhh");
  document.querySelector('meta[property="og:image"]').setAttribute('content', "logo512.png");

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-primary">LyricOcean</h1>
        <p className='opacity-75'>created by <Link to="https://sushii64.com/"><span className='link link-accent'>sushii64</span></Link> :3</p>
        <p className='opacity-25'>(hit source code button to learn how to add more songs!)</p>
        <Link to="https://github.com/Sushii64/lyricocean/">
          <button className="btn btn-secondary text-white">Source Code</button>
        </Link>
      </div>
      <input
        type="text"
        placeholder="Search items..."
        className="input input-bordered w-full mb-4 text-lg"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="list-none p-0">
        {filteredItems.map(item => (
          <ItemListItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
};

const ItemDetailPage = ({ items }) => {
  const location = useLocation();
  const itemId = new URLSearchParams(location.search).get('id');
  const selectedItemId = parseInt(itemId);
  const selectedItem = items.find(item => item.id === selectedItemId);

  useEffect(() => {
    if (selectedItem) {
      document.title = `${selectedItem.name} - LyricOcean`;
      document.querySelector('meta[property="og:title"]').setAttribute('content', selectedItem.name);
      document.querySelector('meta[property="og:description"]').setAttribute('content', selectedItem.artist || 'Unknown Artist');
      document.querySelector('meta[property="og:image"]').setAttribute('content', selectedItem.image || 'logo512.png');
    }
  }, [selectedItem]);

  return selectedItem ? (
    <ItemDetail selectedItem={selectedItem} />
  ) : null;
};

export default App;
