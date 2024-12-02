import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
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

const Changelog = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-bold text-accent truncate">Changelog</h2>
        <Link to="/" className="btn btn-outline transition">
          Back
        </Link>
      </div>

      <div className="mt-6 text-sm md:text-base">
        <p>welcome to LyricOcean v2.0! here's what's new:</p><br/>
        <ul>
          <li><p>- Rewrite of the system</p></li>
          <li><p>- There is now a different URL for each song instead of a parameter</p></li>
          <li><p>- Song IDs are now strings instead of random numbers</p></li>
          <li><p>- More mobile friendly design</p></li>
          <li><p>- Small visual upgrade</p></li>
          <li><p>- Added 'not found' page</p></li>
        </ul>
      </div>
    </div>
  );
};

const NotFound = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-bold text-accent truncate">Error 404</h2>
        <Link to="/" className="btn btn-outline transition">
          Back to Home
        </Link>
      </div>

      <div className="mt-6 text-sm md:text-base">
        <p>page not found -- but there are plenty of fish in the sea.</p>
      </div>
    </div>
  );
};

const ItemDetail = ({ selectedItem }) => {
  const formatLyrics = (lyrics) => {
    return lyrics.split('\n').map((line, index) => (
      <span key={index}>{line}<br /></span>
    ));
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <MetaTags
        title={selectedItem.name + " | LyricOcean"}
        description={"by " + selectedItem.artist}
        image={"https://lyrics.sushii64.com/" + selectedItem.image}
        color="#0f172a"
      />
      <div className="flex items-center space-x-4">
        <Link to="/" className="btn btn-outline btn-circle transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h2 className="text-2xl font-bold text-accent truncate">{selectedItem.name}</h2>
      </div>

      <div className="mt-6">
        <div className="accordion bg-base-200 rounded-lg shadow-lg">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button 
                className="accordion-button w-full text-xl font-medium bg-neutral text-neutral-content p-4 rounded-t-lg focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? 'Song Info (click to hide)' : 'Song Info (click to reveal)'}
              </button>
            </h2>
            {isOpen && (
              <div className="accordion-body bg-neutral text-neutral-content p-4 rounded-b-lg">
                <p><strong>Artist:</strong> {selectedItem.artist || '???'}</p>
                <p><strong>Date:</strong> {selectedItem.date || '???'}</p>
                <p><strong>BPM:</strong> {selectedItem.bpm || '???'}</p>
                <p><strong>Key:</strong> {selectedItem.key || '???'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm md:text-base">
        {formatLyrics(selectedItem.lyrics)}
      </div>
    </div>
  );
};

const ItemListItem = ({ item }) => {
  return (
    <li className="flex items-center p-4 mb-2 border border-primary rounded-lg cursor-pointer">
      <Link to={`/song/${item.id}`} className="flex items-center w-full">
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

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const App = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/items.json')
      .then(response => response.json())
      .then(data => setItems(shuffleArray(data)))
      .catch(error => console.error('Error loading items:', error));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <MetaTags
        title="LyricOcean"
        description="A quick and snappy lyrics website!"
        image="https://lyrics.sushii64.com/logo512.png"
        color="#0f172a"
      />
      <Router basename="/">
        <Routes>
          <Route path="/" element={<Home items={items} />} />
          <Route path="/song/:id" element={<ItemDetailPage />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/*" element={<NotFound />} />
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

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h1 className="text-4xl font-extrabold text-primary-focus mb-4 md:mb-0">
                LyricOcean
            </h1>
            <input
                type="text"
                placeholder="Search items..."
                className="input input-bordered input-primary w-full md:w-80 text-lg shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <ul className="space-y-4">
            {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                    <ItemListItem
                        key={item.id}
                        item={item}
                        className="rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    />
                ))
            ) : (
                <li className="text-center text-gray-500 italic">
                    No items found.
                </li>
            )}
        </ul>

        <footer className="text-center text-sm text-gray-500 mt-8">
            version 2.0 - {" "}
            <Link
                to="/changelog"
                className="text-primary hover:underline"
            >
                see changelog 
            </Link>
            {" "} | 
            Created by{" "}
            <a
                href="https://sushii64.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
            >
                sushii64 
            </a>
            {" "}:3
        </footer>
    </div>
  );
};

const ItemDetailPage = () => {
  const { id } = useParams();
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetch(`/items/${id}.json`)
      .then(response => response.json())
      .then(data => setSelectedItem(data))
      .catch(error => console.error('Error loading item:', error));
  }, [id]);

  return selectedItem ? (
    <ItemDetail selectedItem={selectedItem} />
  ) : (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center space-x-4">
        <Link to="/" className="btn btn-outline btn-circle transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h2 className="text-2xl font-bold text-accent truncate">Loading...</h2>
      </div>

      <div className="mt-6">
        <div class="flex w-full flex-col gap-4">
          <div class="skeleton h-20 w-full"></div>
          <div class="skeleton h-4 w-3/4"></div>
          <div class="skeleton h-4 w-full"></div>
          <div class="skeleton h-4 w-1/2"></div>
          <div class="skeleton h-4 w-3/4"></div>
          <div class="skeleton h-4 w-full"></div>
          <div class="skeleton h-4 w-1/2"></div>
          <div class="skeleton h-4 w-3/4"></div>
          <div class="skeleton h-4 w-full"></div>
          <div class="skeleton h-4 w-1/2"></div>
          <div class="skeleton h-4 w-3/4"></div>
          <div class="skeleton h-4 w-full"></div>
          <div class="skeleton h-4 w-1/2"></div>
          <div class="skeleton h-4 w-3/4"></div>
          <div class="skeleton h-4 w-full"></div>
          <div class="skeleton h-4 w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default App;
