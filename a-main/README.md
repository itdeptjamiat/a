# EchoReads - React Native Reading App

A modern React Native reading application built with Expo, featuring authentication, book management, and protected reading functionality.

## 🏗️ Project Structure

```
EchoReads/
├── app/                    # Expo Router screens ONLY
│   ├── (auth)/            # Authentication screens
│   │   ├── login.tsx      # Sign in screen
│   │   ├── signup.tsx     # Registration screen
│   │   ├── verifyEmail.tsx # Email verification
│   │   ├── forgotPassword.tsx # Password reset request
│   │   ├── resetPassword.tsx  # New password form
│   │   └── _layout.tsx    # Auth layout
│   ├── (app)/             # Main app screens
│   │   ├── (tabs)/        # Tab navigation screens
│   │   │   ├── index.tsx  # Home screen
│   │   │   ├── library.tsx # User library
│   │   │   ├── search.tsx  # Book search
│   │   │   ├── profile.tsx # User profile
│   │   │   └── _layout.tsx # Tab layout
│   │   ├── reader.tsx     # Protected PDF reader
│   │   ├── profile.tsx    # Extended profile
│   │   ├── settings.tsx   # App settings
│   │   └── _layout.tsx    # App layout
│   └── _layout.tsx        # Root layout with providers
├── src/
│   ├── redux/             # Redux state management
│   │   ├── slices/        # Redux slices
│   │   │   ├── authSlice.ts      # Authentication state
│   │   │   ├── listingSlice.ts   # Book listings
│   │   │   ├── bidSlice.ts       # Bidding system
│   │   │   ├── chatSlice.ts      # Chat functionality
│   │   │   └── ordersSlice.ts    # Order management
│   │   ├── actions/       # Async thunks
│   │   │   └── authActions.ts    # Auth API calls
│   │   ├── selectors/     # Memoized selectors
│   │   │   ├── authSelectors.ts  # Auth selectors
│   │   │   └── index.ts          # Selector exports
│   │   ├── hooks.ts       # Typed Redux hooks
│   │   └── store.ts       # Store configuration
│   ├── form/              # Form components & validation
│   │   ├── FormProvider.tsx      # React Hook Form wrapper
│   │   ├── TextField.tsx         # Themed text input
│   │   └── schemas/
│   │       └── authSchema.ts     # Zod validation schemas
│   ├── axios/             # API configuration
│   │   └── EchoInstance.ts       # Configured Axios instance
│   ├── styles/            # Theme system
│   │   ├── themeTypes.ts         # Theme TypeScript interfaces
│   │   ├── lightTheme.ts         # Light theme configuration
│   │   ├── darkTheme.ts          # Dark theme configuration
│   │   └── theme.ts              # Theme utilities
│   ├── context/           # React contexts
│   │   └── ThemeContext.tsx      # Theme provider & hook
│   ├── hooks/             # Custom hooks
│   ├── components/        # UI components
│   │   ├── CustomButton.tsx      # Themed button component
│   │   ├── ScreenWrapper.tsx     # Global screen wrapper with safe area & keyboard handling
│   │   ├── ScreenHeader.tsx      # Reusable header for tab screens
│   │   ├── PostCard.tsx          # Content display card
│   │   ├── SearchBar.tsx         # Search input component
│   │   ├── ButtonSelectorGroup.tsx # Button group selector
│   │   └── home/                 # Home screen specific components
│   │       ├── SectionHeader.tsx # Section title with optional "See All" button
│   │       ├── ContentCarousel.tsx # Horizontal content slider
│   │       ├── CategoryTabs.tsx  # Top navigation tabs
│   │       ├── FeaturedHero.tsx  # Featured content display
│   │       ├── CoverCardPortrait.tsx # Portrait cover image card
│   │       ├── ArticleRowCard.tsx # Article row display
│   │       ├── CategoryGrid.tsx  # 2x3 category grid
│   │       └── MasonryGrid.tsx   # 3x2 content grid
│   ├── typography/        # Typography system
│   │   └── index.tsx             # Text components (H1-H6, Body, etc.)
│   └── services/          # External services
```

## 🛠️ Technology Stack

### Core Technologies
- **React Native** with **Expo** - Cross-platform mobile development
- **expo-router** - File-based navigation system
- **Redux Toolkit** - State management with persistence
- **Zod + React Hook Form** - Form validation and handling
- **Axios** - HTTP client with auth interceptors
- **TypeScript** - Type safety and developer experience

### UI & Styling
- **expo-linear-gradient** - Modern gradient effects
- **react-native-reanimated** - Smooth animations
- **react-native-vector-icons** (Ionicons) - Consistent iconography
- **Custom Theme System** - Dark/light mode with semantic colors

### Storage & Security
- **redux-persist** with **AsyncStorage** - State persistence
- **expo-secure-store** - Secure credential storage
- **expo-localization** - Internationalization support

### Protected Reading Features
- **expo-file-system** - Offline encrypted PDF storage
- **expo-screen-capture** - Screenshot/recording protection
- **expo-crypto** - Cryptographic utilities
- **react-native-webview** - Secure web content rendering

### Profile Management Features
- **Dynamic Profile Data** - Real-time profile information from API
- **Profile Image Updates** - Full image picker with gallery, camera, and custom URL options
- **Profile Statistics** - Reading stats and user activity tracking
- **Profile Information Display** - User details, join date, and metadata

### Subscription Plans Management
- **Dynamic Plans Display** - Real-time subscription plans from API
- **Plan Comparison** - Beautiful card-based layout with feature comparison
- **Subscription Management** - Subscribe to plans with confirmation dialogs
- **Discount Display** - Automatic discount badge and pricing display
- **Current Plan Tracking** - Visual indication of user's current subscription
- **Responsive Design** - Optimized for mobile and tablet layouts

### User Experience
- **react-native-toast-message** - User feedback system
- **react-native-safe-area-context** - Safe area handling

## 🔐 Authentication Flow

### State Management
- **Redux Persist** stores auth tokens (auth slice only)
- **Axios interceptors** handle 401 errors automatically
- **Token attachment** on app startup via `_layout.tsx`

### Form Validation
- **Zod schemas** for all auth forms
- **React Hook Form** with resolver integration
- **Custom TextField** component with theme integration

### Security Features
- **JWT token management** via Redux + Axios
- **Automatic logout** on 401 responses
- **Secure token storage** with persistence
- **Form validation** with user-friendly error messages

## 🎨 Theme System

### Architecture
- **Semantic color naming** (primary, surface, text vs blue, gray)
- **Dark/light mode support** with system preference detection
- **Consistent spacing scale** (xs: 4px → 3xl: 64px)
- **Typography scale** with proper line heights
- **Shadow system** for elevation effects

## 🖥️ Screen Management

### ScreenWrapper Component
- **Global replacement** for SafeAreaView across all screens
- **Optional bottom safe area** with `bottomSafeArea` prop
- **Keyboard avoiding view** with `keyboardAvoidingView` prop
- **Customizable keyboard offset** for platform-specific behavior
- **Theme integration** with automatic background color
- **Consistent behavior** across iOS and Android

### Usage Examples
```typescript
// Basic usage (top safe area only)
<ScreenWrapper>
  <YourContent />
</ScreenWrapper>

// With bottom safe area
<ScreenWrapper bottomSafeArea>
  <YourContent />
</ScreenWrapper>

// With keyboard avoiding view (for forms)
<ScreenWrapper keyboardAvoidingView keyboardOffset={20}>
  <YourForm />
</ScreenWrapper>
```

### Usage
```typescript
const { theme } = useTheme();

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.lg,
  },
});
```

## 📱 Component System

### Core UI Components
- **ScreenWrapper** - Global screen wrapper with safe area handling and optional keyboard avoiding view
- **ScreenHeader** - Reusable header component for tab screens with profile integration
- **FormProvider** - React Hook Form wrapper
- **TextField** - Themed input with validation
- **CustomButton** - Animated button with variants (primary, gradient, ghost)

### Content Display Components
- **PostCard** - General-purpose content display card
- **CoverCardPortrait** - Portrait-oriented cover image card for magazines/digests
- **ArticleRowCard** - Row-style display for articles
- **SearchBar** - Themed search input component
- **ButtonSelectorGroup** - Interactive button group selector

### Home Screen Components
- **SectionHeader** - Section title with optional "See All" button
- **ContentCarousel** - Horizontal content slider with ScrollView-based navigation
- **CategoryTabs** - Top navigation tabs for content filtering
- **FeaturedHero** - Prominent featured content display
- **CategoryGrid** - 2x3 grid layout for categories
- **MasonryGrid** - 3x2 grid layout for content items

### Typography Components
- **H1-H6** - Semantic heading components
- **Body** - Main text component
- **Caption, Small** - Supporting text components

### Theme Integration
- All components use `useTheme()` hook
- No hardcoded colors or spacing values
- Consistent animation patterns with Reanimated
- Responsive design with useWindowDimensions hook

## 🗃️ Redux Store Shape

```typescript
interface RootState {
  auth: {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  };
  profile: {
    profileData: ProfileData | null;
    loading: boolean;
    error: string | null;
    lastUpdated: string | null;
  };
  plans: {
    plans: SubscriptionPlan[];
    loading: boolean;
    error: string | null;
    lastUpdated: string | null;
    currentPlan: string | null;
  };
  listing: {
    listings: any[];
    loading: boolean;
    error: string | null;
  };
  bid: {
    bids: any[];
    loading: boolean;
    error: string | null;
  };
  chat: {
    conversations: any[];
    messages: any[];
    loading: boolean;
    error: string | null;
  };
  orders: {
    orders: any[];
    loading: boolean;
    error: string | null;
  };
}
```

### Persistence Strategy
- **Whitelist**: Only `auth` slice persisted
- **Storage**: AsyncStorage for cross-platform compatibility
- **Rehydration**: PersistGate in root layout

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator / Android Emulator

### Installation
```bash
npm install
```

### Development
```bash
npm start
```

### Platform-specific
```bash
npm run ios     # iOS simulator
npm run android # Android emulator
npm run web     # Web browser
```

## 📋 Development Rules

### Enforced Patterns
- ✅ **Redux Toolkit** for all state management
- ✅ **Zod + React Hook Form** for all forms
- ✅ **EchoInstance.ts** for all API calls
- ✅ **Theme system** for all styling
- ✅ **createAsyncThunk** for all async operations
- ✅ **Toast.show()** for all user feedback

### Prohibited Patterns
- ❌ No inline styling - use StyleSheet.create()
- ❌ No hardcoded colors - use theme system
- ❌ No custom HTTP clients - only EchoInstance
- ❌ No business logic in /app folder
- ❌ No unapproved packages without rules update

## 🔧 Configuration Files

- **package.json** - Dependencies and scripts
- **app.json** - Expo configuration
- **tsconfig.json** - TypeScript configuration with path aliases
- **babel.config.js** - Babel with Reanimated plugin
- **metro.config.js** - Metro bundler configuration

## 📚 Next Steps

1. **API Integration** - Update EchoInstance.ts with real API endpoints
2. **Component Library** - Add PostCard, SearchBar, ButtonSelectorGroup
3. **Book Management** - Implement listing, bid, and order functionality
4. **Protected Reader** - Add PDF viewing with security features
5. **Chat System** - Real-time messaging between users
6. **Testing** - Add unit and integration tests
7. **Performance** - Optimize with React.memo and useMemo where needed

## 📖 Documentation

- All new features must update this README
- All new patterns must update rules.md
- Redux changes must follow MODULE_CREATION_TEMPLATE.md
- Component documentation in respective files

---

Built with ❤️ using React Native, Expo, and modern development practices."# a" 
