
# Deploying Bandmate Harmony with Coolify

## Prerequisites
- Coolify instance running
- GitHub repository connected
- Domain name (optional)

## Deployment Steps

1. **Create New Project in Coolify**
   - Add your GitHub repository
   - Select Docker Compose deployment type

2. **Environment Variables**
   Copy the variables from `.env.example` and set them in Coolify:
   ```
   POSTGRES_PASSWORD=your_secure_password
   DATABASE_URL=postgresql://postgres:your_secure_password@db:5432/bandmate_harmony
   JWT_SECRET=your_jwt_secret_32_chars_long
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   VITE_SUPABASE_URL=http://localhost:54321
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Generate Keys**
   Generate secure keys for JWT and Supabase:
   ```bash
   # JWT Secret (32 characters)
   openssl rand -base64 32
   
   # Supabase keys (use Supabase CLI or generate random strings)
   openssl rand -base64 64
   ```

4. **Deploy**
   - Push changes to your GitHub repository
   - Trigger deployment in Coolify
   - Monitor logs for any issues

5. **Access Your App**
   - App will be available on port 3000
   - Database accessible on port 5432
   - Supabase API on port 54321

## Database Management

The PostgreSQL database includes:
- Auto-initialization with required tables
- Persistent data storage via Docker volumes
- Proper indexes for performance

## Troubleshooting

- Check container logs in Coolify dashboard
- Ensure all environment variables are set
- Verify network connectivity between services
