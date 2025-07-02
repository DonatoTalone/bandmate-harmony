
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
   Set these variables in Coolify:
   ```
   POSTGRES_PASSWORD=your_secure_password
   VITE_DB_HOST=db
   VITE_DB_PORT=5432
   VITE_DB_NAME=bandmate_harmony
   VITE_DB_USER=postgres
   VITE_DB_PASSWORD=your_secure_password
   ```

3. **Deploy**
   - Push changes to your GitHub repository
   - Trigger deployment in Coolify
   - Monitor logs for any issues

4. **Access Your App**
   - App will be available on port 3000
   - Database accessible on port 5432

## Database Management

The PostgreSQL database includes:
- Auto-initialization with required tables
- Persistent data storage via Docker volumes
- Proper indexes for performance

## Troubleshooting

- Check container logs in Coolify dashboard
- Ensure all environment variables are set
- Verify network connectivity between services
- Database connection issues: check POSTGRES_PASSWORD matches in all places
