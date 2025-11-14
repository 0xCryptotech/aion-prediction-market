# Live Features - React Frontend

## Komponen Baru yang Ditambahkan

### 1. LiveAIPredictions Component
**Location:** `src/components/LiveAIPredictions.js`

Komponen React untuk menampilkan prediksi AI real-time dengan fitur:
- 3 AI models (GPT-4 Oracle, Claude Predictor, Llama Vision)
- Auto-update setiap 10 detik
- Sentiment indicator (Bullish/Bearish)
- Confidence score dengan color coding
- Smooth animations

**Props:** None (standalone component)

**Usage:**
```jsx
import LiveAIPredictions from '../components/LiveAIPredictions';

<LiveAIPredictions />
```

### 2. LivePriceFeed Component
**Location:** `src/components/LivePriceFeed.js`

Komponen React untuk menampilkan harga crypto real-time dari Pyth Network:
- BTC/USD, ETH/USD, SOL/USD price feeds
- Auto-update setiap 5 detik dari Pyth Hermes API
- Price change percentage dengan trend indicators
- Loading states
- Responsive design

**Props:** None (standalone component)

**Usage:**
```jsx
import LivePriceFeed from '../components/LivePriceFeed';

<LivePriceFeed />
```

## Integration dengan Dashboard

Kedua komponen telah diintegrasikan ke `Dashboard.js`:

```jsx
// Import components
import LiveAIPredictions from '../components/LiveAIPredictions';
import LivePriceFeed from '../components/LivePriceFeed';

// Add to Dashboard render
<div className="grid gap-4 md:grid-cols-2">
  <LiveAIPredictions />
  <LivePriceFeed />
</div>
```

## Pyth Network Integration

### API Endpoint
```javascript
const PYTH_HERMES_URL = 'https://hermes.pyth.network';
```

### Price Feed IDs
```javascript
const PRICE_FEEDS = {
    BTC: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
    ETH: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
    SOL: '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d'
};
```

### Fetch Function
```javascript
const fetchPythPrice = async (symbol, priceId) => {
    const response = await fetch(
        `${PYTH_HERMES_URL}/api/latest_price_feeds?ids[]=${priceId}`
    );
    const data = await response.json();
    // Process price data
};
```

## Features

### LiveAIPredictions
- ✅ Real-time AI model predictions
- ✅ Sentiment analysis (Bullish/Bearish)
- ✅ Confidence scores
- ✅ Auto-refresh every 10 seconds
- ✅ Animated updates
- ✅ Responsive card layout

### LivePriceFeed
- ✅ Real-time crypto prices from Pyth Network
- ✅ Price change percentage
- ✅ Trend indicators (up/down arrows)
- ✅ Auto-refresh every 5 seconds
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive design

## Styling

Kedua komponen menggunakan:
- **Tailwind CSS** untuk styling
- **Lucide React** untuk icons
- **Gradient backgrounds** untuk visual appeal
- **Border animations** untuk live indicators
- **Responsive grid layout**

## Dependencies

Required packages (sudah ada di package.json):
- `lucide-react` - Icons
- `react` - Core framework
- Tailwind CSS classes

## Customization

### Update Intervals

**LiveAIPredictions:**
```javascript
// Default: 10000ms (10 detik)
useEffect(() => {
    const interval = setInterval(updatePredictions, 10000);
    return () => clearInterval(interval);
}, []);
```

**LivePriceFeed:**
```javascript
// Default: 5000ms (5 detik)
useEffect(() => {
    updatePrices();
    const interval = setInterval(updatePrices, 5000);
    return () => clearInterval(interval);
}, []);
```

### Adding More Crypto Pairs

Edit `LivePriceFeed.js`:
```javascript
const PRICE_FEEDS = {
    BTC: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
    ETH: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
    SOL: '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
    // Add more pairs here
    AVAX: 'price_feed_id_here'
};
```

### Styling Customization

Komponen menggunakan Tailwind utility classes. Untuk customize:

```jsx
// Change gradient colors
className="bg-gradient-to-br from-purple-900/20 to-black"

// Change border colors
className="border border-purple-500/30"

// Change text colors
className="text-purple-500"
```

## Testing

### Manual Testing
1. Start development server: `npm start`
2. Navigate to Dashboard
3. Scroll down untuk melihat Live Features
4. Verify:
   - Prices update setiap 5 detik
   - AI predictions update setiap 10 detik
   - Animations berjalan smooth
   - Responsive di berbagai screen sizes

### Console Debugging
```javascript
// Add console logs untuk debugging
console.log('Fetched price:', price);
console.log('Updated predictions:', predictions);
```

## Troubleshooting

### Prices tidak update
- Check browser console untuk errors
- Verify internet connection
- Check Pyth Network API status
- Ensure CORS tidak blocking requests

### Component tidak render
- Check import paths
- Verify Lucide React installed
- Check Tailwind CSS configuration
- Inspect browser console untuk errors

### Styling issues
- Ensure Tailwind CSS properly configured
- Check `tailwind.config.js`
- Verify PostCSS setup
- Clear browser cache

## Future Enhancements

- [ ] WebSocket integration untuk real-time updates
- [ ] Historical price charts
- [ ] More crypto pairs
- [ ] Price alerts/notifications
- [ ] Comparison dengan AI predictions
- [ ] Export data functionality
- [ ] Dark/Light theme toggle
- [ ] Mobile optimization

## Resources

- [Pyth Network Docs](https://docs.pyth.network/)
- [Lucide React Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hooks](https://react.dev/reference/react)
