# Favorites Feature - Quick Reference Guide

## For Frontend Developers

### Using Favorites in a Component

```jsx
import { useFavorites } from '../contexts/FavoritesContext.jsx';

export function MyComponent() {
  const { 
    favorites,           // Array of favorite items
    loading,             // Boolean - is fetching?
    error,               // Error message or null
    fetchFavorites,      // async () => Load favorites
    addFavorite,         // async (articleId, type) => Add
    removeFavorite,      // async (favoriteId) => Remove
    checkFavorite,       // async (articleId) => Check
    getFavoritesCount,   // async () => Count
    isFavorited,         // (articleId) => Boolean
  } = useFavorites();

  // Load on mount
  useEffect(() => {
    fetchFavorites();
  }, []);

  // Add to favorites
  const handleAddFavorite = async (articleId) => {
    try {
      const fav = await addFavorite(articleId, 'article');
      // Toast notification shown automatically
    } catch (err) {
      // Toast error shown automatically
    }
  };

  // Remove from favorites
  const handleRemove = async (favoriteId) => {
    try {
      await removeFavorite(favoriteId);
      // Toast notification shown automatically
    } catch (err) {
      // Toast error shown automatically
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {favorites.map(fav => (
        <div key={fav._id}>
          <h3>{fav.title}</h3>
          <button onClick={() => handleRemove(fav._id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
```

## For Backend Developers

### Adding a Favorite - Business Logic

```javascript
// In controller
const favorite = await Favorite.create({
  userId: req.user._id,          // From JWT token
  articleId: articleId,           // From request body
  type: 'article',               // From request body
  title: article.title,          // Cached for performance
  thumbnail: article.thumbnail,  // Cached for display
  category: article.category,    // Cached for filtering
});

// Unique constraint prevents duplicates automatically
// If duplicate exists, MongoDB throws duplicate key error
```

### Getting User's Favorites

```javascript
// With pagination
const favorites = await Favorite.find({ userId: req.user._id })
  .populate('articleId', 'title slug thumbnail category')
  .sort({ createdAt: -1 })      // Newest first
  .skip((page - 1) * limit)
  .limit(limit);

// Get total count for pagination
const total = await Favorite.countDocuments({ userId: req.user._id });
```

### Checking Ownership

```javascript
// Before deletion, verify ownership
if (favorite.userId.toString() !== req.user._id.toString()) {
  return res.status(403).json({
    success: false,
    message: 'Bạn không có quyền xóa'
  });
}

// Delete after verification
await Favorite.findByIdAndDelete(id);
```

## Common Tasks

### Display Favorite Button with Status

```jsx
function ArticleCard({ article }) {
  const { checkFavorite, addFavorite, removeFavorite } = useFavorites();
  const [favorite, setFavorite] = useState(null);

  useEffect(() => {
    checkStatus();
  }, [article._id]);

  const checkStatus = async () => {
    const result = await checkFavorite(article._id, 'article');
    setFavorite(result.favorite);
  };

  const toggleFavorite = async () => {
    if (favorite) {
      await removeFavorite(favorite._id);
      setFavorite(null);
    } else {
      const newFav = await addFavorite(article._id, 'article');
      setFavorite(newFav);
    }
  };

  return (
    <button onClick={toggleFavorite}>
      {favorite ? '❤️ Liked' : '🤍 Like'}
    </button>
  );
}
```

### Get Favorites Count for Header Badge

```jsx
function Header() {
  const { getFavoritesCount } = useFavorites();
  const [count, setCount] = useState(0);

  useEffect(() => {
    loadCount();
  }, []);

  const loadCount = async () => {
    const total = await getFavoritesCount();
    setCount(total);
  };

  return (
    <div>
      <a href="/yeu-thich">
        ❤️ Favorites <span className="badge">{count}</span>
      </a>
    </div>
  );
}
```

### Add Favorite to New Item Type

**Backend:**
```javascript
// In favoriteController.js addFavorite:
} else if (type === 'book') {
  const book = await Book.findById(articleId);
  if (!book) {
    return res.status(404).json({ success: false, message: 'Book not found' });
  }
  title = book.title;
  thumbnail = book.cover;
  category = book.genre;
}
```

**Frontend:**
```javascript
// Just call with different type
await addFavorite(bookId, 'book');
```

## Error Handling Examples

### User Tries to Add Already Favorited Item
```
Response: 400 Bad Request
Message: "Đã thêm vào yêu thích rồi"
Toast: Shown automatically
```

### User Tries to Delete Another User's Favorite
```
Response: 403 Forbidden
Message: "Bạn không có quyền xóa"
Toast: Shown automatically
```

### Article Not Found
```
Response: 404 Not Found
Message: "Bài viết không tồn tại"
Toast: Shown automatically
```

### Invalid Article ID
```
Response: 400 Bad Request
Message: "Invalid ID format"
Toast: Shown automatically
```

## Performance Tips

### Reduce API Calls
```javascript
// DON'T do this
for (let id of articleIds) {
  await checkFavorite(id);  // Multiple API calls!
}

// DO this instead
const favorites = await fetchFavorites();
const favIds = new Set(favorites.map(f => f.articleId._id));
```

### Pagination for Large Lists
```javascript
// DON'T load all at once
const all = await fetchFavorites(1, 1000);

// DO use pagination
const page1 = await fetchFavorites(1, 10);
const page2 = await fetchFavorites(2, 10);
// Load more on scroll
```

### Cache Favorite Status
```javascript
// Instead of checking every render
const [favMap, setFavMap] = useState({}); // { articleId: boolean }

const isFav = (id) => favMap[id] ?? false;

// Update when add/remove
setFavMap(prev => ({
  ...prev,
  [articleId]: true
}));
```

## Database Queries

### Find All Favorites by User
```javascript
const favs = await Favorite.find({ userId: userId });
```

### Find All Favorites of Type "article"
```javascript
const articles = await Favorite.find({
  userId: userId,
  type: 'article'
});
```

### Count Favorites by Category
```javascript
const counts = await Favorite.aggregate([
  { $match: { userId: userId } },
  { $group: { _id: '$category', count: { $sum: 1 } } }
]);
```

### Get Trending Articles (Most Favorited)
```javascript
const trending = await Favorite.aggregate([
  { $match: { type: 'article' } },
  { $group: { _id: '$articleId', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 }
]);
```

## Testing Endpoints

### Add Favorite (cURL)
```bash
curl -X POST http://localhost:5000/api/favorites \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"articleId":"5f5c...", "type":"article"}'
```

### Get Favorites (cURL)
```bash
curl -X GET "http://localhost:5000/api/favorites?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Remove Favorite (cURL)
```bash
curl -X DELETE http://localhost:5000/api/favorites/5f5c... \
  -H "Authorization: Bearer $TOKEN"
```

## Debugging Tips

### Check if User is Authenticated
```javascript
// In component
const { user } = useAuth();
if (!user) {
  return <div>Please login</div>;
}
```

### Log API Response
```javascript
const result = await fetchFavorites();
console.log('Favorites loaded:', result);
```

### Check Network Requests
- Open DevTools > Network tab
- Filter by "api"
- Look for `/api/favorites` requests
- Check Authorization header is present
- Check response status (200 = success)

### Common Issues

**Toast not showing?**
- Check ToastProvider wraps component
- Check useToast() is called
- Check browser console for errors

**Favorites not loading?**
- Check JWT token is valid
- Check user is authenticated
- Check API endpoint returns 200
- Check response has `data.favorites` field

**API returns 401?**
- Token expired - logout and login again
- Token not in header - check Authorization header format
- Token is invalid - regenerate token

---

**Reference Documentation:**
- Full API docs: `server/routes/favoriteRoutes.test.md`
- Implementation guide: `FAVORITES_IMPLEMENTATION.md`
