# Favorites API - Testing Guide

## Endpoint Documentation

### 1. Get Favorites (Paginated)
**Endpoint:** `GET /api/favorites`
**Auth:** Required (JWT token)
**Query Parameters:**
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page, default 10

**Example Request:**
```
GET /api/favorites?page=1&limit=10
Authorization: Bearer {jwt_token}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Lấy danh sách yêu thích thành công",
  "data": {
    "favorites": [
      {
        "_id": "objectId",
        "userId": "userId",
        "articleId": {
          "_id": "articleId",
          "title": "Article Title",
          "slug": "article-slug",
          "thumbnail": "image-url",
          "category": "Knowledge"
        },
        "type": "article",
        "title": "Article Title",
        "thumbnail": "image-url",
        "category": "Knowledge",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "pages": 3
    }
  }
}
```

---

### 2. Add to Favorites
**Endpoint:** `POST /api/favorites`
**Auth:** Required
**Content-Type:** application/json

**Request Body:**
```json
{
  "articleId": "objectId",
  "type": "article"  // Can be "article" or "tuvi"
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Thêm vào yêu thích thành công",
  "data": {
    "favorite": {
      "_id": "favoriteId",
      "userId": "userId",
      "articleId": "articleId",
      "type": "article",
      "title": "Article Title",
      "thumbnail": "image-url",
      "category": "Knowledge",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Error Response (Duplicate):**
```json
{
  "success": false,
  "message": "Đã thêm vào yêu thích rồi"
}
```

---

### 3. Remove from Favorites
**Endpoint:** `DELETE /api/favorites/:id`
**Auth:** Required
**URL Parameters:**
- `id`: Favorite item ID (MongoDB ObjectId)

**Example Request:**
```
DELETE /api/favorites/5f5c8d5d5d5d5d5d5d5d5d5d
Authorization: Bearer {jwt_token}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Xóa khỏi yêu thích thành công"
}
```

---

### 4. Check if Favorited
**Endpoint:** `GET /api/favorites/check/:articleId`
**Auth:** Required
**URL Parameters:**
- `articleId`: Article ID (MongoDB ObjectId)

**Example Request:**
```
GET /api/favorites/check/5f5c8d5d5d5d5d5d5d5d5d5d
Authorization: Bearer {jwt_token}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "isFavorited": true,
    "favorite": {
      "_id": "favoriteId",
      "userId": "userId",
      "articleId": "articleId",
      "type": "article",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

---

### 5. Get Favorites Count
**Endpoint:** `GET /api/favorites/count`
**Auth:** Required

**Example Request:**
```
GET /api/favorites/count
Authorization: Bearer {jwt_token}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "count": 15
  }
}
```

---

## Testing with cURL

### Add a Favorite
```bash
curl -X POST http://localhost:5000/api/favorites \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "articleId": "5f5c8d5d5d5d5d5d5d5d5d5d",
    "type": "article"
  }'
```

### Get Favorites
```bash
curl -X GET "http://localhost:5000/api/favorites?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Remove a Favorite
```bash
curl -X DELETE http://localhost:5000/api/favorites/5f5c8d5d5d5d5d5d5d5d5d5d \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Check if Favorited
```bash
curl -X GET http://localhost:5000/api/favorites/check/5f5c8d5d5d5d5d5d5d5d5d5d \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Count
```bash
curl -X GET http://localhost:5000/api/favorites/count \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Important Notes

1. **Route Order:** The `/count` and `/check/:articleId` routes must come BEFORE the `/:id` route to avoid conflicts with Express route matching.

2. **Authentication:** All routes require valid JWT authentication. Token should be passed in the `Authorization` header as `Bearer {token}`.

3. **Ownership Verification:** Users can only remove their own favorites. The system will return a 403 error if attempting to delete another user's favorite.

4. **Duplicate Prevention:** Attempting to add the same item twice will return a 400 error with message "Đã thêm vào yêu thích rồi".

5. **Type Support:** Currently supports "article" and "tuvi" types. Other types will be rejected.

6. **Pagination:** Default page size is 10. Maximum recommended is 50 items per page.

---

## Frontend Usage Example

```javascript
import { useFavorites } from '../contexts/FavoritesContext.jsx';

function MyComponent() {
  const { favorites, loading, fetchFavorites, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    fetchFavorites(); // Load page 1 with 10 items
  }, []);

  const handleAdd = async () => {
    try {
      await addFavorite('articleId123', 'article');
      // Toast notification shown automatically
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (favoriteId) => {
    try {
      await removeFavorite(favoriteId);
      // Toast notification shown automatically
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
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
