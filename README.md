# SpendWise Frontend

Nuxt.js 3 frontend application for SpendWise expense management system.

## Features

- 🔐 **User Authentication** - Secure login and registration with JWT
- 💰 **Wallet Management** - Multiple wallets with custom colors and icons
- 🏷️ **Category Management** - Organize expenses with categories and icons
- 💳 **Transaction Tracking** - Add, edit, and delete income/expense/transfer transactions
- 📊 **Advanced Analytics** - Beautiful charts and financial insights
- 💵 **Budget System** - Monthly and fixed budgets with visual progress tracking
- 🔁 **Recurring Transactions** - Automate bill payments and subscriptions
- 📷 **Receipt Management** - Upload, search, and view receipts
- 🏷️ **Tags System** - Flexible tagging for transaction organization
- 💱 **Multi-Currency** - Support for different currencies
- 🔔 **Notifications** - Real-time alerts for budgets and balances
- 📤 **Data Export** - Export transactions to CSV
- 👤 **Profile Management** - Customize profile with avatar upload
- 🌙 **Dark Mode** - Modern dark theme support
- 📱 **Responsive Design** - Works seamlessly on all devices

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
├── pages/                        # Application pages
│   ├── index.vue                # Landing page
│   ├── login.vue                # Login page
│   ├── register.vue             # Registration page
│   ├── dashboard.vue            # Main dashboard with overview
│   ├── wallets.vue              # Wallets management
│   ├── transactions.vue         # Transactions list and management
│   ├── categories.vue           # Categories management
│   ├── budgets.vue              # Budget management and tracking
│   ├── recurring.vue            # Recurring transactions
│   ├── receipts.vue             # Receipt search and management
│   ├── tags.vue                 # Tags management
│   ├── analytics.vue            # Analytics & reports with charts
│   └── profile.vue              # User profile settings
│
├── components/                  # Reusable Vue components
│   ├── NotificationCenter.vue   # Notification dropdown
│   ├── ReceiptUpload.vue        # Receipt upload component
│   ├── TagInput.vue             # Tag selector component
│   ├── BarChart.vue             # Bar chart component
│   ├── DoughnutChart.vue        # Doughnut chart component
│   ├── LineChart.vue            # Line chart component
│   ├── PieChart.vue             # Pie chart component
│   └── SpendingHeatmap.vue      # Spending heatmap visualization
│
├── stores/                     # Pinia state management
│   ├── auth.ts                 # Authentication state
│   ├── wallets.ts              # Wallets state
│   ├── categories.ts           # Categories state
│   ├── transactions.ts         # Transactions state
│   ├── analytics.ts            # Analytics state
│   ├── budgets.ts              # Budgets state
│   ├── recurring.ts septemberRecurring state
│   ├── tags.ts                 # Tags state
│   └── theme.ts                # Dark mode state
│
├── layouts/                    # Application layouts
│   └── default.vue             # Default layout with navigation
│
├── middleware/                 # Route middleware
│   └── auth.ts                 # Authentication guard
│
├── plugins/                    # Nuxt plugins
│   └── axios.client.ts         # Axios configuration
│
├── composables/               # Reusable composition functions
│   └── useCurrency.ts         # Currency formatting utilities
│
├── utils/                     # Utility functions
│   └── currency.ts            # Currency conversion utilities
│
├── assets/                    # Static assets
│   └── css/
│       └── main.css           # Global styles & Tailwind
│
├── nuxt.config.ts             # Nuxt configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── package.json               # Dependencies
```

## Pages Overview

### Landing Page (`/`)
- Welcome page with app introduction
- Links to login and registration

### Authentication
- **Login** (`/login`): User authentication with email/username
- **Register** (`/register`): New user registration

### Main Application (Authenticated Routes)

#### Dashboard (`/dashboard`)
- Quick overview of financial status
- Today's income and expenses
- Recent transactions
- Wallet balances
- Budget alerts summary
- Quick action buttons

#### Wallets (`/wallets`)
- View all wallets with balances
- Create/edit/delete wallets
- Add money to wallets
- Customize wallet appearance (color, icon)
- Support for multiple currencies

#### Transactions (`/transactions`)
- View and manage all transactions
- Filter by wallet, category, type, date range
- Create income, expense, or transfer transactions
- Edit and delete transactions
- Attach receipts to transactions

#### Categories (`/categories`)
- Manage expense and income categories
- Customize icons and colors
- Set budget limits
- Track category spending

#### Budgets (`/budgets`)
- View all budget statuses
- Create and manage monthly or fixed budgets
- Visual progress bars with color coding
- Budget alerts (warning, critical, danger)
- Toggle budget rollover
- Budget history charts

#### Recurring Transactions (`/recurring`)
- View all recurring transactions
- Create recurring bills and income
- Set frequency (daily, weekly, monthly, yearly)
- Pause/resume recurring transactions
- Manually process due transactions

#### Receipts (`/receipts`)
- View all uploaded receipts
- Search receipts by filename, transaction, or OCR text
- Filter by file type and date range
- Download or view receipt images
- Upload receipts for transactions

#### Tags (`/tags`)
- Create and manage transaction tags
- Tag analytics and usage statistics
- View most used tags
- Tag transactions for better organization

#### Analytics (`/analytics`)
- Financial summaries (today, week, month, custom)
- Interactive charts using Chart.js:
  - Income vs Expenses (Bar Chart)
  - Spending by Category (Doughnut Chart)
  - Spending Trends (Line Chart)
  - Wallet Distribution (Pie Chart)
- Top expense categories
- Wallet balance summaries
- Spending heatmap

#### Profile (`/profile`)
- View and edit user information
- Upload and change avatar
- Update full name and email
- Change home currency
- View account statistics

## State Management (Pinia)

### Auth Store
- User authentication state
- Login/logout functionality
- Current user information
- Token management

### Wallets Store
- List of user wallets
- CRUD operations for wallets
- Add money functionality
- Currency management

### Categories Store
- List of categories
- CRUD operations
- Budget management

### Transactions Store
- List of transactions
- CRUD operations
- Advanced filtering capabilities
- Receipt attachment

### Analytics Store
- Summary data (today, week, month)
- Top categories
- Wallet summaries
- Chart data

### Budgets Store
- Budget statuses
- Budget alerts
- Budget history
- Rollover management

### Recurring Store
- List of recurring transactions
- CRUD operations
- Processing due transactions
- Pause/resume functionality

### Tags Store
- List of tags
- CRUD operations
- Tag analytics
- Usage statistics

### Theme Store
- Dark mode toggle
- Theme persistence

## Styling

### Tailwind CSS
The application uses Tailwind CSS for styling with custom configurations.

#### Custom Colors
Primary, secondary, and semantic colors are defined in `tailwind.config.js`

#### Utility Classes
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.btn-danger` - Danger/delete button style
- `.btn-sm` - Small button variant
- `.input-field` - Standard input field
- `.card` - Card container
- `.stat-card` - Statistics card with border accent

### Dark Mode
Dark mode is fully supported throughout the application with automatic theme detection and manual toggle.

## API Integration

### Axios Configuration
The app uses Axios with interceptors for:
- Automatic token injection
- Error handling
- 401 redirect to login
- Request/response logging

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
6. Protected routes check authentication status

## Components

### NotificationCenter
Displays user notifications in a dropdown with:
- Unread count badge
- Notification list
- Mark as read functionality
- Check for new alerts

### ReceiptUpload
Upload and manage receipts with:
- Drag and drop support
- File type validation
- Image preview
- Progress indicators

### TagInput
Interactive tag selection with:
- Tag creation on the fly
- Color-coded tags
- Remove tags easily

### Chart Components
- **BarChart**: Income vs expenses comparison
- **DoughnutChart**: Category spending distribution
- **LineChart**: Spending trends over time
- **PieChart**: Wallet balance distribution
- **SpendingHeatmap**: Calendar heatmap for spending patterns

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

## Dependencies

### Core
- **Nuxt 3** - Vue.js framework
- **Vue 3** - Progressive JavaScript framework
- **Pinia** - State management

### UI
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons

### Charts & Data Visualization
- **Chart.js** - Chart library
- **Vue-ChartJS** - Vue wrapper for Chart.js

### HTTP Client
- **Axios** - Promise-based HTTP client

## Features Implementation Status

### ✅ Implemented
- User authentication (JWT)
- Wallet management with multiple currencies
- Category management with budgets
- Transaction management (Income/Expense/Transfer)
- Dashboard with key metrics
- Advanced analytics with interactive charts
- Budget system (monthly and fixed)
- Budget rollover functionality
- Budget alerts and warnings
- Recurring transactions management
- Receipt upload and search
- OCR text extraction (backend)
- Tags system with analytics
- Multi-currency support
- Exchange rate conversion
- Real-time notifications
- Profile management with avatar upload
- Dark mode theme
- Responsive design
- Data export to CSV
- Transaction filtering and search

### 🚀 Performance Optimizations
- Lazy loading for components
- Optimized bundle size
- Efficient state management
- Fast navigation with Nuxt

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

### Chart Not Displaying
- Check if Chart.js data is properly formatted
- Verify browser console for errors
- Ensure data is loaded before rendering

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

### Optimization Tips
1. Images are optimized and lazy-loaded
2. Components are code-split automatically
3. API calls are cached where appropriate
4. State management keeps data in memory
5. Dark mode uses CSS variables for smooth transitions

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

MIT License