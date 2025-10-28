# ExpenseWise Frontend

Nuxt.js 3 frontend application for ExpenseWise expense management system.

## Setup

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Environment Configuration
Create a `.env` file in the frontend directory:
```env
API_BASE_URL=http://localhost:8000/api
```

### 3. Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
frontend/
├── pages/                  # Application pages
│   ├── index.vue          # Landing page
│   ├── login.vue          # Login page
│   ├── register.vue       # Registration page
│   ├── dashboard.vue      # Main dashboard
│   ├── wallets.vue        # Wallets management
│   ├── transactions.vue   # Transactions page
│   ├── categories.vue     # Categories page
│   └── analytics.vue      # Analytics & reports
│
├── components/            # Reusable Vue components
│
├── stores/               # Pinia state management
│   ├── auth.ts          # Authentication state
│   ├── wallets.ts       # Wallets state
│   ├── categories.ts    # Categories state
│   ├── transactions.ts  # Transactions state
│   └── analytics.ts     # Analytics state
│
├── layouts/             # Application layouts
│   └── default.vue     # Default layout with navigation
│
├── middleware/          # Route middleware
│   └── auth.ts         # Authentication guard
│
├── plugins/            # Nuxt plugins
│   └── axios.ts       # Axios configuration
│
├── assets/            # Static assets
│   └── css/
│       └── main.css  # Global styles & Tailwind
│
├── nuxt.config.ts    # Nuxt configuration
├── tailwind.config.js # Tailwind CSS configuration
└── package.json       # Dependencies
```

## Pages Overview

### Landing Page (`/`)
- Welcome page with app introduction
- Links to login and registration

### Authentication
- **Login** (`/login`): User authentication
- **Register** (`/register`): New user registration

### Main Application (Authenticated Routes)
- **Dashboard** (`/dashboard`): Overview with key metrics
- **Wallets** (`/wallets`): Manage wallets and balances
- **Transactions** (`/transactions`): View and manage all transactions
- **Categories** (`/categories`): Manage expense categories
- **Analytics** (`/analytics`): Financial reports and insights

## State Management (Pinia)

### Auth Store
- User authentication state
- Login/logout functionality
- Current user information

### Wallets Store
- List of user wallets
- CRUD operations for wallets
- Add money functionality

### Categories Store
- List of categories
- CRUD operations for categories

### Transactions Store
- List of transactions
- CRUD operations
- Filtering capabilities

### Analytics Store
- Summary data (today, week, month)
- Top categories
- Wallet summaries

## Styling

### Tailwind CSS
The application uses Tailwind CSS for styling with custom configurations:

#### Custom Colors
```javascript
primary: {
  50: '#f0f9ff',
  // ... more shades
  900: '#0c4a6e',
}
```

#### Utility Classes
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.btn-danger` - Danger/delete button style
- `.input-field` - Standard input field
- `.card` - Card container
- `.stat-card` - Statistics card with border accent

## API Integration

### Axios Configuration
The app uses Axios with interceptors for:
- Automatic token injection
- Error handling
- 401 redirect to login

### Example API Call
```typescript
const { $api } = useNuxtApp()
const response = await $api.get('/wallets')
```

## Authentication Flow

1. User submits login credentials
2. Backend validates and returns JWT token
3. Token stored in localStorage
4. Token automatically added to all requests
5. On 401 error, user redirected to login

## Building for Production

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Generate Static Site
```bash
npm run generate
```

## Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

### Docker
```dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
```

## Environment Variables

### Development
```env
API_BASE_URL=http://localhost:8000/api
```

### Production
```env
API_BASE_URL=https://api.yourapp.com/api
```

## Features

### Implemented
- ✅ User authentication (JWT)
- ✅ Wallet management
- ✅ Category management
- ✅ Transaction management (Income/Expense/Transfer)
- ✅ Dashboard with key metrics
- ✅ Analytics and reports
- ✅ Responsive design
- ✅ Real-time balance updates

### Future Enhancements
- 📊 Interactive charts (Chart.js)
- 📱 PWA support
- 🌙 Dark mode
- 🔔 Notifications
- 📤 Export functionality
- 📷 Receipt uploads
- 🔍 Advanced search
- 🏷️ Tags system
- 💱 Multi-currency
- 📅 Recurring transactions

## Development Tips

### Hot Reload
The dev server supports hot module replacement. Changes will reflect immediately.

### TypeScript Support
The project uses TypeScript. Type checking:
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

## Troubleshooting

### Port Already in Use
Change port in `nuxt.config.ts`:
```typescript
export default defineNuxtConfig({
  devServer: {
    port: 3001
  }
})
```

### API Connection Issues
- Check API_BASE_URL in `.env`
- Ensure backend is running
- Check browser console for errors
- Verify CORS settings in backend

### Build Errors
- Clear `.nuxt` directory: `rm -rf .nuxt`
- Clear node_modules: `rm -rf node_modules && npm install`
- Update dependencies: `npm update`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

### Optimization Tips
1. Use lazy loading for components
2. Optimize images
3. Enable gzip compression
4. Use CDN for static assets
5. Implement service worker for caching

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

MIT License


