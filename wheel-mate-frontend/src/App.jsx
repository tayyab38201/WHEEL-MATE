import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, Search, Navigation, Star, Plus, X, Loader2, AlertTriangle,
  HeartPulse, Siren, Phone, Send, Accessibility, Store, Utensils, Wrench,
  ShieldAlert, User, Lock, LogIn, LogOut, UserPlus, Home, MapPinned,
  Bell, Heart, SlidersHorizontal, TrendingUp, Award, Camera, MessageSquare,
  ThumbsUp, Share2, Moon, Sun, Users, Activity, BarChart3, Target, Trophy,
  Crown, Medal, Flame, Zap, Sparkles, ChevronRight, Info, CheckCircle,
  XCircle, Upload, Eye
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

// Mock data
const MOCK_PHOTOS = [
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
  'https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?w=400',
  'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400',
];

const MOCK_COMMENTS = [
  { id: 1, user: 'Ahmed Khan', text: 'Great accessibility! Ramps available.', time: '2h ago', likes: 12 },
  { id: 2, user: 'Sara Ali', text: 'Very helpful staff, highly recommended.', time: '5h ago', likes: 8 },
];

const MOCK_LEADERBOARD = [
  { rank: 1, user: 'Ahmed Khan', points: 450, contributions: 23, avatar: '👨' },
  { rank: 2, user: 'Sara Ali', points: 380, contributions: 19, avatar: '👩' },
  { rank: 3, user: 'Ali Hassan', points: 320, contributions: 16, avatar: '👨' },
];

function getDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 0.5 - Math.cos(dLat) / 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    (1 - Math.cos(dLon)) / 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('wheel-mate-token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('wheel-mate-user')));
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('dark-mode') === 'true');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dark-mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLoginSuccess = (data) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('wheel-mate-token', data.token);
    localStorage.setItem('wheel-mate-user', JSON.stringify(data.user));
    setMessage({ type: 'success', text: 'Welcome! 🎉' });
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('wheel-mate-token');
    localStorage.removeItem('wheel-mate-user');
    setMessage({ type: 'success', text: 'Logged out!' });
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      {message && <MessageBox type={message.type} text={message.text} onClose={() => setMessage(null)} />}
      {loading && <LoadingSpinner />}
      
      {!token ? (
        <LoginPage 
          onLoginSuccess={handleLoginSuccess} 
          setMessage={setMessage} 
          setLoading={setLoading}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      ) : (
        <WheelMateApp 
          token={token} 
          user={user} 
          onLogout={handleLogout}
          setMessage={setMessage}
          setLoading={setLoading}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}
    </div>
  );
}

function LoginPage({ onLoginSuccess, setMessage, setLoading, darkMode, toggleDarkMode }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/${isLoginView ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      if (isLoginView) {
        onLoginSuccess(data);
      } else {
        setMessage({ type: 'success', text: 'Account created! Please login.' });
        setIsLoginView(true);
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
      >
        {darkMode ? <Sun className="h-6 w-6 text-yellow-300" /> : <Moon className="h-6 w-6 text-white" />}
      </button>

      <div className="w-full max-w-md">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl mb-4">
              <Accessibility className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              WHEEL-MATE
            </h1>
            <p className="text-gray-600 dark:text-gray-300">{isLoginView ? 'Welcome back!' : 'Join us!'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
            />
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
            />
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center"
            >
              {isLoginView ? <><LogIn className="h-5 w-5 mr-2" /> Sign In</> : <><UserPlus className="h-5 w-5 mr-2" /> Create Account</>}
            </button>
          </form>

          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="w-full mt-4 text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {isLoginView ? "Don't have an account? Sign up" : 'Have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

function WheelMateApp({ token, user, onLogout, setMessage, setLoading, darkMode, toggleDarkMode }) {
  const [view, setView] = useState('home');
  const [facilities, setFacilities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('distance');
  const [userStats, setUserStats] = useState({ placesAdded: 0, reviewsGiven: 0, points: 0 });

  useEffect(() => {
    fetchFacilities();
    getUserLocation();
    const saved = localStorage.getItem('wheel-mate-favorites');
    if (saved) setFavorites(JSON.parse(saved));
    const stats = localStorage.getItem('wheel-mate-stats');
    if (stats) setUserStats(JSON.parse(stats));
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      );
    }
  };

  const fetchFacilities = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/facilities`);
      const data = await res.json();
      setFacilities(data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load facilities' });
    }
  };

  const handleAddFacility = async (facilityData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/facilities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(facilityData),
      });
      if (!res.ok) throw new Error('Failed to add');
      await fetchFacilities();
      const newStats = { ...userStats, placesAdded: userStats.placesAdded + 1, points: userStats.points + 50 };
      setUserStats(newStats);
      localStorage.setItem('wheel-mate-stats', JSON.stringify(newStats));
      setMessage({ type: 'success', text: 'Added! +50 points 🎉' });
      setView('explore');
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id) => {
    const newFavs = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem('wheel-mate-favorites', JSON.stringify(newFavs));
  };

  const facilitiesWithDistance = useMemo(() => {
    return facilities.map(f => ({
      ...f,
      distance: userLocation ? getDistance(userLocation.lat, userLocation.lng, f.lat, f.lng) : null
    }));
  }, [facilities, userLocation]);

  const filteredFacilities = useMemo(() => {
    let result = facilitiesWithDistance;
    if (filterType !== 'all') result = result.filter(f => f.type === filterType);
    if (searchTerm) result = result.filter(f => 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    result.sort((a, b) => {
      if (sortBy === 'distance' && a.distance && b.distance) return a.distance - b.distance;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
    return result;
  }, [facilitiesWithDistance, filterType, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl">
                <Accessibility className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">WHEEL-MATE</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.username}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={toggleDarkMode} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700">
                {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-600" />}
              </button>
              
              <button
                onClick={() => setView('favorites')}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 relative"
              >
                <Heart className={`h-5 w-5 ${favorites.length > 0 ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-300'}`} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 text-sm font-medium"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {view === 'home' && <HomeView setView={setView} facilities={facilitiesWithDistance} userStats={userStats} />}
        {view === 'explore' && (
          <ExploreView
            facilities={filteredFacilities}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedFacility={selectedFacility}
            setSelectedFacility={setSelectedFacility}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            token={token}
            fetchFacilities={fetchFacilities}
            setMessage={setMessage}
            userStats={userStats}
            setUserStats={setUserStats}
          />
        )}
        {view === 'favorites' && (
          <FavoritesView
            facilities={facilitiesWithDistance.filter(f => favorites.includes(f._id))}
            setSelectedFacility={setSelectedFacility}
            toggleFavorite={toggleFavorite}
            setView={setView}
          />
        )}
        {view === 'profile' && <ProfileView user={user} userStats={userStats} setView={setView} />}
        {view === 'leaderboard' && <LeaderboardView userStats={userStats} />}
        {view === 'emergency' && <EmergencyView facilities={facilitiesWithDistance} userLocation={userLocation} setMessage={setMessage} />}
        {view === 'add' && <AddFacilityView setView={setView} setMessage={setMessage} onAdd={handleAddFacility} />}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around h-16">
            <NavBtn icon={Home} label="Home" active={view === 'home'} onClick={() => setView('home')} />
            <NavBtn icon={MapPinned} label="Explore" active={view === 'explore'} onClick={() => setView('explore')} />
            <NavBtn icon={Plus} label="Add" onClick={() => setView('add')} special />
            <NavBtn icon={Trophy} label="Rank" active={view === 'leaderboard'} onClick={() => setView('leaderboard')} />
            <NavBtn icon={User} label="Profile" active={view === 'profile'} onClick={() => setView('profile')} />
          </div>
        </div>
      </nav>
    </div>
  );
}

function NavBtn({ icon: Icon, label, active, onClick, special }) {
  if (special) {
    return (
      <button onClick={onClick} className="relative -mt-8">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-xl">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </button>
    );
  }
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center px-4 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
      <Icon className="h-5 w-5" />
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
}

function HomeView({ setView, facilities, userStats }) {
  const nearby = facilities.filter(f => f.distance && f.distance < 5).slice(0, 3);
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back!</h2>
        <p className="text-indigo-100">Ready to explore accessible places?</p>
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center">
            <MapPin className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold">{facilities.length}</p>
            <p className="text-xs sm:text-sm text-indigo-100">Places</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center">
            <Star className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold">{userStats.points}</p>
            <p className="text-xs sm:text-sm text-indigo-100">Points</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center">
            <Award className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold">{nearby.length}</p>
            <p className="text-xs sm:text-sm text-indigo-100">Nearby</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ActionCard icon={MapPinned} title="Explore" desc="Find places" color="from-blue-500 to-cyan-500" onClick={() => setView('explore')} />
        <ActionCard icon={Plus} title="Add Place" desc="Help others" color="from-green-500 to-emerald-500" onClick={() => setView('add')} />
        <ActionCard icon={ShieldAlert} title="Emergency" desc="Quick help" color="from-red-500 to-rose-500" onClick={() => setView('emergency')} />
        <ActionCard icon={Trophy} title="Leaderboard" desc="Top users" color="from-amber-500 to-yellow-500" onClick={() => setView('leaderboard')} />
      </div>

      {nearby.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Nearby Places</h3>
          <div className="space-y-3">
            {nearby.map(f => (
              <div key={f._id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{f.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{f.address}</p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">{f.distance?.toFixed(1)} km away</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ActionCard({ icon: Icon, title, desc, color, onClick }) {
  return (
    <button onClick={onClick} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg transition-all text-left">
      <div className={`bg-gradient-to-br ${color} p-3 rounded-xl w-fit mb-3`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h4 className="font-bold text-gray-900 dark:text-white mb-1">{title}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
    </button>
  );
}

function ExploreView({ facilities, searchTerm, setSearchTerm, filterType, setFilterType, sortBy, setSortBy, selectedFacility, setSelectedFacility, favorites, toggleFavorite, token, fetchFacilities, setMessage, userStats, setUserStats }) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow mb-6">
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Search places..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-xl ${showFilters ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>

        {showFilters && (
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {['all', 'hospital', 'police', 'restaurant', 'repair', 'toilet'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium ${filterType === type ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {['distance', 'rating', 'name'].map(sort => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium ${sortBy === sort ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                >
                  {sort.charAt(0).toUpperCase() + sort.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4"><span className="font-bold text-gray-900 dark:text-white">{facilities.length}</span> places found</p>

      <div className="space-y-4">
        {facilities.map(f => (
          <div key={f._id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{f.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{f.address}</p>
              </div>
              <button onClick={() => toggleFavorite(f._id)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700">
                <Heart className={`h-5 w-5 ${favorites.includes(f._id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(f.rating || 0) ? 'text-amber-400 fill-current' : 'text-gray-300'}`} />
                ))}
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{f.rating?.toFixed(1) || 'N/A'}</span>
              </div>
              {f.distance && <span className="text-sm text-indigo-600 dark:text-indigo-400">{f.distance.toFixed(1)} km</span>}
            </div>

            <button
              onClick={() => setSelectedFacility(f)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-2.5 rounded-xl"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {selectedFacility && (
        <FacilityModal
          facility={selectedFacility}
          onClose={() => setSelectedFacility(null)}
          isFavorite={favorites.includes(selectedFacility._id)}
          toggleFavorite={() => toggleFavorite(selectedFacility._id)}
          token={token}
          fetchFacilities={fetchFacilities}
          setMessage={setMessage}
          userStats={userStats}
          setUserStats={setUserStats}
        />
      )}
    </div>
  );
}

function FacilityModal({ facility, onClose, isFavorite, toggleFavorite, token, fetchFacilities, setMessage, userStats, setUserStats }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [tab, setTab] = useState('details');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setMessage({ type: 'error', text: 'Select a rating' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/facilities/${facility._id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ rating, feedback }),
      });
      if (!res.ok) throw new Error('Failed');
      
      const newStats = { ...userStats, reviewsGiven: userStats.reviewsGiven + 1, points: userStats.points + 10 };
      setUserStats(newStats);
      localStorage.setItem('wheel-mate-stats', JSON.stringify(newStats));
      setMessage({ type: 'success', text: 'Thanks! +10 points 🙏' });
      fetchFacilities();
      onClose();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 flex justify-between items-center border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Details</h2>
          <div className="flex gap-2">
            <button onClick={toggleFavorite} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700">
              <Heart className={`h-6 w-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
            </button>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700">
              <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex border-b dark:border-gray-700 px-6">
          {['details', 'photos', 'reviews'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 font-medium ${tab === t ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'details' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{facility.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{facility.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < Math.floor(facility.rating || 0) ? 'text-amber-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{facility.rating?.toFixed(1) || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{facility.ratings?.length || 0} reviews</p>
                </div>

                {facility.distance && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
                    <Navigation className="h-6 w-6 text-indigo-600 mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{facility.distance.toFixed(1)} km</p>
                    <p className="text-sm text-gray-500">Distance</p>
                  </div>
                )}
              </div>

              {facility.notes && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Accessibility Notes</h4>
                  <p className="text-gray-700 dark:text-gray-300">{facility.notes}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 border-t dark:border-gray-700 pt-6">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">Leave Feedback</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Rating</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star className={`h-10 w-10 ${s <= rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows="4"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                />

                <button
                  type="submit"
                  disabled={submitting || rating === 0}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center"
                >
                  {submitting ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Submitting...</> : <><Send className="h-5 w-5 mr-2" /> Submit (+10 pts)</>}
                </button>
              </form>
            </div>
          )}

          {tab === 'photos' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-900 dark:text-white">Photos ({MOCK_PHOTOS.length})</h4>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm">
                  <Upload className="h-4 w-4 inline mr-2" />Upload (+5 pts)
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {MOCK_PHOTOS.map((p, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden aspect-square">
                    <img src={p} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-3">
              {MOCK_COMMENTS.map(c => (
                <div key={c.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">{c.user}</h5>
                      <p className="text-xs text-gray-500">{c.time}</p>
                    </div>
                    <button className="flex items-center gap-1 text-gray-500">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm">{c.likes}</span>
                    </button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{c.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FavoritesView({ facilities, setSelectedFacility, toggleFavorite, setView }) {
  if (facilities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center">
        <Heart className="h-20 w-20 mx-auto mb-4 text-gray-300" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No favorites yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Start adding places!</p>
        <button onClick={() => setView('explore')} className="bg-indigo-600 text-white px-6 py-3 rounded-xl">
          Explore Places
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white">
        <Heart className="h-10 w-10 mb-3 fill-current" />
        <h2 className="text-2xl font-bold mb-2">Your Favorites</h2>
        <p className="text-pink-100">{facilities.length} places</p>
      </div>

      <div className="space-y-4">
        {facilities.map(f => (
          <div key={f._id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{f.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{f.address}</p>
                {f.distance && <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">{f.distance.toFixed(1)} km</p>}
              </div>
              <button onClick={() => toggleFavorite(f._id)} className="p-2">
                <Heart className="h-5 w-5 text-red-500 fill-current" />
              </button>
            </div>
            <button onClick={() => setSelectedFacility(f)} className="w-full bg-indigo-600 text-white py-2 rounded-xl">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileView({ user, userStats, setView }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-white/20 p-4 rounded-2xl">
            <User className="h-12 w-12" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.username}</h1>
            <p className="text-purple-100">Member</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <MapPin className="h-5 w-5 mx-auto mb-1" />
            <p className="text-xl font-bold">{userStats.placesAdded}</p>
            <p className="text-xs text-purple-100">Places</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <Star className="h-5 w-5 mx-auto mb-1" />
            <p className="text-xl font-bold">{userStats.reviewsGiven}</p>
            <p className="text-xs text-purple-100">Reviews</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <Award className="h-5 w-5 mx-auto mb-1" />
            <p className="text-xl font-bold">{userStats.points}</p>
            <p className="text-xs text-purple-100">Points</p>
          </div>
        </div>
      </div>

      <button onClick={() => setView('leaderboard')} className="w-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow text-left">
        <Trophy className="h-8 w-8 text-amber-500 mb-3" />
        <h3 className="font-bold text-gray-900 dark:text-white mb-1">Leaderboard</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">See top contributors</p>
      </button>
    </div>
  );
}

function LeaderboardView({ userStats }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-3xl p-8 text-white">
        <Trophy className="h-12 w-12 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-amber-100">Top contributors</p>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white">
        <div className="flex justify-between">
          <div>
            <p className="text-indigo-100 mb-1">Your Points</p>
            <h2 className="text-4xl font-bold">{userStats.points}</h2>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow">
        <div className="p-6 border-b dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Top Contributors</h3>
        </div>
        <div className="divide-y dark:divide-gray-700">
          {MOCK_LEADERBOARD.map((e, i) => (
            <div key={i} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`text-3xl ${e.rank === 1 ? 'text-amber-500' : e.rank === 2 ? 'text-gray-400' : 'text-orange-600'}`}>
                    {e.rank === 1 && <Crown className="h-8 w-8" />}
                    {e.rank === 2 && <Medal className="h-8 w-8" />}
                    {e.rank === 3 && <Award className="h-8 w-8" />}
                  </div>
                  <div className="text-3xl">{e.avatar}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{e.user}</h4>
                    <p className="text-sm text-gray-500">{e.contributions} contributions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-600">{e.points}</p>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmergencyView({ facilities, userLocation, setMessage }) {
  const findNearest = (type) => {
    if (!userLocation) {
      setMessage({ type: 'error', text: 'Location needed' });
      return;
    }
    const filtered = facilities.filter(f => f.type === type);
    if (filtered.length === 0) {
      setMessage({ type: 'error', text: `No ${type} nearby` });
      return;
    }
    const nearest = filtered.sort((a, b) => a.distance - b.distance)[0];
    setMessage({ type: 'success', text: `${nearest.name} (${nearest.distance.toFixed(1)} km)` });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl p-8 text-white">
        <ShieldAlert className="h-16 w-16 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Emergency SOS</h1>
        <p className="text-red-100">Get help fast</p>
      </div>

      <div className="space-y-4">
        <button onClick={() => findNearest('hospital')} className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white p-6 rounded-2xl shadow-xl text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-xl">
                <HeartPulse className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Medical Emergency</h3>
                <p className="text-white/80 text-sm">Find nearest hospital</p>
              </div>
            </div>
            <ChevronRight className="h-6 w-6" />
          </div>
        </button>

        <button onClick={() => findNearest('police')} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-xl text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-xl">
                <Siren className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Police</h3>
                <p className="text-white/80 text-sm">Find nearest police station</p>
              </div>
            </div>
            <ChevronRight className="h-6 w-6" />
          </div>
        </button>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-xl p-4">
        <div className="flex gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-amber-900 dark:text-amber-300">Important</h4>
            <p className="text-sm text-amber-800 dark:text-amber-400">In emergencies, call local emergency number immediately.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddFacilityView({ setView, setMessage, onAdd }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState('restaurant');
  const [notes, setNotes] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setMessage({ type: 'info', text: 'Getting location...' });
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude.toString());
          setLng(pos.coords.longitude.toString());
          setMessage({ type: 'success', text: 'Location captured!' });
        },
        () => setMessage({ type: 'error', text: 'Could not get location' })
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !address || !lat || !lng) {
      setMessage({ type: 'error', text: 'Fill all required fields' });
      return;
    }
    setSubmitting(true);
    onAdd({ name, address, type, notes, lat: parseFloat(lat), lng: parseFloat(lng) })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-8 text-white mb-6">
        <Plus className="h-12 w-12 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Add New Place</h1>
        <p className="text-green-100">Help others discover accessible locations</p>
        <div className="mt-4 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
          <Award className="h-4 w-4" />
          <span className="text-sm font-medium">Earn 50 points!</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow space-y-5">
        <input
          type="text"
          placeholder="Facility Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
        />

        <input
          type="text"
          placeholder="Address *"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
        >
          <option value="restaurant">Restaurant</option>
          <option value="hospital">Hospital</option>
          <option value="police">Police Station</option>
          <option value="repair">Repair Shop</option>
          <option value="toilet">Public Toilet</option>
          <option value="other">Other</option>
        </select>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            step="any"
            placeholder="Latitude *"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude *"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
          />
        </div>

        <button
          type="button"
          onClick={getCurrentLocation}
          className="w-full bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-300 font-medium py-3 rounded-xl flex items-center justify-center"
        >
          <Navigation className="h-5 w-5 mr-2" />
          Use My Location
        </button>

        <textarea
          rows="4"
          placeholder="Accessibility notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-xl disabled:opacity-50 flex items-center justify-center"
        >
          {submitting ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Submitting...</> : <><Plus className="h-5 w-5 mr-2" /> Add Place (+50 pts)</>}
        </button>
      </form>
    </div>
  );
}

function MessageBox({ type, text, onClose }) {
  const colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' };
  const Icon = { success: CheckCircle, error: XCircle, info: Info }[type];

  return (
    <div className={`fixed top-4 right-4 ${colors[type]} text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3 max-w-md`}>
      <Icon className="h-5 w-5" />
      <p className="flex-1 font-medium">{text}</p>
      <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-lg">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto" />
        <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">Loading...</p>
      </div>
    </div>
  );
}