# EchoReads Home Screen API Contracts

These endpoints are required to power the redesigned home screen. They follow the existing token-based auth and `EchoInstance` Axios setup. All responses must be JSON with `success` flag and `data` payloads. Pagination is optional where noted.

## Common Types

```json
{
  "_id": "string",
  "mid": 123,
  "name": "string",
  "image": "https://...",
  "file": "https://...",
  "type": "pro|free",
  "fileType": "pdf|epub|web",
  "magzineType": "magzine|article|digest",
  "isActive": true,
  "category": "string",
  "downloads": 0,
  "description": "string",
  "rating": 4.5,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## 1) Featured Magazine
- **Method**: GET
- **URL**: `/home/featured-magazine`
- **Auth**: Bearer token
- **Query**: none

Response:
```json
{
  "success": true,
  "data": { /* MagazineDTO or null */ }
}
```

## 2) Recently Published (Magazines)
- **Method**: GET
- **URL**: `/home/recent-magazines`
- **Auth**: Bearer token
- **Query (optional)**: `page` (number, default 1), `limit` (number, default 20), `sort` ("newest"|"popular")

Response:
```json
{
  "success": true,
  "data": [ /* MagazineDTO[] where magzineType === "magzine" */ ],
  "meta": { "page": 1, "limit": 20, "total": 200 }
}
```

## 3) Pegham Digest for Kids (Digests)
- **Method**: GET
- **URL**: `/home/kids-digests`
- **Auth**: Bearer token
- **Query (optional)**: `page`, `limit`, `sort` ("popular")
- **Server filter**: Only `magzineType === "digest"`, age-appropriate content

Response:
```json
{
  "success": true,
  "data": [ /* MagazineDTO[] */ ],
  "meta": { "page": 1, "limit": 20, "total": 75 }
}
```

## 4) Recommended for You (Articles)
- **Method**: GET
- **URL**: `/home/recommended-articles`
- **Auth**: Bearer token
- **Query (optional)**: `page`, `limit`
- **Server logic**: Personalized recommendations using user profile, recent reads, favorites

Response:
```json
{
  "success": true,
  "data": [ /* MagazineDTO[] where magzineType === "article" */ ],
  "meta": { "page": 1, "limit": 20, "total": 120 }
}
```

## 5) Favorites by Others (Magazines)
- **Method**: GET
- **URL**: `/home/favorites-magazines`
- **Auth**: Bearer token
- **Query (optional)**: `page`, `limit`, `sort` ("popular")
- **Server logic**: Aggregate most-favorited magazines across users

Response:
```json
{
  "success": true,
  "data": [ /* MagazineDTO[] */ ],
  "meta": { "page": 1, "limit": 20, "total": 300 }
}
```

---

## Notes for Backend
- Ensure `magzineType` discriminator is set correctly ("magzine", "article", "digest").
- Provide enough items (>10) for each list for smooth horizontal carousels.
- Ratings should be numeric 0..5 with one decimal place.
- `image` should be an absolute URL with CDN-friendly sizing.
- Keep base auth headers consistent with existing API and 401 behavior.

## Error Shape
```json
{
  "success": false,
  "message": "Human-readable message"
}
```


