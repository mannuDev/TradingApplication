# Environment Variables Setup

## Create .env file in backend folder

Create a file named `.env` in the `backend` directory with the following content:

```
PORT=5000
MONGO_URI=mongodb+srv://mannu:mannu%409988@mini-trading-app.ochevnx.mongodb.net/
JWT_SECRET=yourSecretKey
```

## Important Notes:

1. **Password URL Encoding**: The password `mannu@9988` must be URL encoded as `mannu%409988` in the MongoDB URI
   - `@` becomes `%40`
   - This is critical for the connection to work

2. **Correct Format**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database
   ```
   
3. **Your Specific URI**:
   - Username: `mannu`
   - Password: `mannu@9988` (encoded as `mannu%409988`)
   - Cluster: `mini-trading-app.ochevnx.mongodb.net`
   - Full URI: `mongodb+srv://mannu:mannu%409988@mini-trading-app.ochevnx.mongodb.net/`

4. **Common Mistakes**:
   - ❌ `mongodb+srv://mannu:mannu@9988@mini-trading-app...` (two @ symbols)
   - ✅ `mongodb+srv://mannu:mannu%409988@mini-trading-app...` (URL encoded)

## Quick Setup:

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Create .env file (Windows PowerShell):
   ```powershell
   @"
   PORT=5000
   MONGO_URI=mongodb+srv://mannu:mannu%409988@mini-trading-app.ochevnx.mongodb.net/
   JWT_SECRET=yourSecretKey
   "@ | Out-File -FilePath .env -Encoding utf8
   ```

3. Or manually create the file with the content above.

