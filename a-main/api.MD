# EchoReads API Spec (Home, Articles, Magazines)

Audience: Backend developers implementing endpoints to power the current frontend. All filters and pagination are sent in the request body (POST). Responses are JSON and include a top-level `success` flag.

Base URL: `https://api.echoreads.online/api/v1`

Auth: Bearer token (JWT) in `Authorization: Bearer <token>` header for all endpoints unless noted otherwise.

Content Types: `application/json` request and response bodies.

---

## Common Types

MagazineDTO / ArticleDTO / DigestDTO share the same shape and are disambiguated by `magzineType`.

```json
{
  "_id": "6893101648d9a39cd664f0b1",
  "mid": 7,
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
  "rating": 0,
  "reviews": [{ "userId": 1, "rating": 4, "review": "text", "time": "2025-08-09T06:37:33.301Z", "_id": "..." }],
  "createdAt": "2025-08-06T08:19:34.951Z",
  "__v": 0
}
```

PaginationMeta

```json
{ "page": 1, "limit": 20, "total": 200 }
```

Error

```json
{ "success": false, "message": "Human readable error" }
```

---

## Home Page Endpoints

These endpoints power the Home screen sections. All requests are POST with filters in the body. Server must filter by `magzineType` where applicable.

### 1) Featured Magazine
- Method: POST
- URL: `/home/featured-magazine`

Request body:
```json
{ "userId": "optional-string" }
```

Response:
```json
{ "success": true, "data": MagazineDTO | null }
```

### 2) Recently Published (Magazines)
- Method: POST
- URL: `/home/recent-magazines`

Request body:
```json
{
  "page": 1,
  "limit": 20,
  "category": "optional-string",
  "sort": "newest"
}
```

Response:
```json
{ "success": true, "data": [MagazineDTO], "meta": PaginationMeta }
```

### 3) Recommended Magazines
- Method: POST
- URL: `/home/recommended-magazines`

Request body:
```json
{
  "page": 1,
  "limit": 20,
  "userId": "optional-string"
}
```

Response:
```json
{ "success": true, "data": [MagazineDTO], "meta": PaginationMeta }
```

### 4) Featured Digest
- Method: POST
- URL: `/home/featured-digest`

Request body:
```json
{ "userId": "optional-string" }
```

Response:
```json
{ "success": true, "data": DigestDTO | null }
```

### 5) Popular Digests
- Method: POST
- URL: `/home/popular-digests`

Request body:
```json
{ "page": 1, "limit": 20 }
```

Response:
```json
{ "success": true, "data": [DigestDTO], "meta": PaginationMeta }
```

### 6) New Digests
- Method: POST
- URL: `/home/new-digests`

Request body:
```json
{ "page": 1, "limit": 20 }
```

Response:
```json
{ "success": true, "data": [DigestDTO], "meta": PaginationMeta }
```

### 7) Featured Article
- Method: POST
- URL: `/home/featured-article`

Request body:
```json
{ "userId": "optional-string" }
```

Response:
```json
{ "success": true, "data": ArticleDTO | null }
```

### 8) New Articles
- Method: POST
- URL: `/home/new-articles`

Request body:
```json
{ "page": 1, "limit": 10 }
```

Response:
```json
{ "success": true, "data": [ArticleDTO], "meta": PaginationMeta }
```

### 9) Trending Articles
- Method: POST
- URL: `/home/trending-articles`

Request body:
```json
{ "page": 1, "limit": 10 }
```

Response:
```json
{ "success": true, "data": [ArticleDTO], "meta": PaginationMeta }
```

### 10) Categories (Explore grid)
- Method: POST
- URL: `/home/categories`

Request body:
```json
{ "limit": 6 }
```

Response:
```json
{ "success": true, "data": ["Technology", "Lifestyle", "Science", "Arts", "Travel", "Education"] }
```

Notes:
- Server is free to compute personalized recommendations using `userId`.
- All list endpoints must only return items where `isActive: true`.

---

## Magazines Page Endpoints

These power `/(app)/magazine` screen with a Most Popular carousel and an All Magazines grid plus category dropdown.

### 1) Most Popular Magazines
- Method: POST
- URL: `/magazines/popular`

Popularity score (server recommended): `rating * 1000 + downloads` (descending)

Request body:
```json
{
  "page": 1,
  "limit": 12,
  "category": "optional-string"
}
```

Response:
```json
{ "success": true, "data": [MagazineDTO], "meta": PaginationMeta }
```

### 2) All Magazines (with category filter)
- Method: POST
- URL: `/magazines/list`

Request body:
```json
{
  "page": 1,
  "limit": 30,
  "category": "optional-string",
  "sort": "newest|rating|downloads"
}
```

Response:
```json
{ "success": true, "data": [MagazineDTO], "meta": PaginationMeta }
```

### 3) Magazine Categories
- Method: POST
- URL: `/magazines/categories`

Request body:
```json
{ }
```

Response:
```json
{ "success": true, "data": ["Technology", "Lifestyle", "Science", "Arts", "Travel", "Education", "Finance", "Automotive"] }
```

---

## Articles Page Endpoints

This powers `/(app)/article` screen featuring a header hero and a list below.

### 1) Featured Article
- Method: POST
- URL: `/articles/featured`

Request body:
```json
{ "userId": "optional-string" }
```

Response:
```json
{ "success": true, "data": ArticleDTO | null }
```

### 2) Articles List
- Method: POST
- URL: `/articles/list`

Request body:
```json
{
  "page": 1,
  "limit": 20,
  "category": "optional-string",
  "sort": "newest|trending|rating"
}
```

Response:
```json
{ "success": true, "data": [ArticleDTO], "meta": PaginationMeta }
```

### 3) Article Categories
- Method: POST
- URL: `/articles/categories`

Request body:
```json
{ }
```

Response:
```json
{ "success": true, "data": ["Technology", "Lifestyle", "Science", "Arts", "Travel", "Education"] }
```

---

## Server-side Rules & Validations

- Always enforce `magzineType` on each endpoint:
  - Magazines endpoints → `magzineType === "magzine"`
  - Articles endpoints → `magzineType === "article"`
  - Digests endpoints → `magzineType === "digest"`
- Validate `page` (>=1) and `limit` (1..100). Provide `meta.total` for UI pagination.
- Sort options:
  - `newest` → `createdAt` DESC
  - `rating` → `rating` DESC
  - `downloads` → `downloads` DESC
  - `trending` (articles) → recommended: `7d views/reads` DESC or `rating`+`engagement` composite
- Responses must return complete URLs for `image` and `file`.
- Keep response times low; paginate to avoid large payloads.

---

## Migration Note (Current GET Endpoint)

The frontend currently consumes `GET /user/magzines` and filters by `magzineType` client-side as an interim solution. Once the POST endpoints above are implemented, the frontend will switch to type-specific requests with filters sent in the body.


