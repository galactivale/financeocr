# Interactive US States Map

## Overview

The tax manager dashboard features a professional interactive U.S. states map using the [react-us-map](https://github.com/kevinschaul/react-us-map) library. This provides a realistic, responsive map with tooltips, fills, strokes, and full customization control.

## Features

### 🗺️ **Professional Map Design**
- **React US Map Library** - Built on the proven [react-us-map](https://github.com/kevinschaul/react-us-map) library
- **Responsive Design** - Automatically scales and adapts to container size
- **Professional Look** - Clean, modern appearance with smooth interactions
- **Accurate Geography** - Precise state boundaries and positioning

### 🎨 **Adaptive Styling**
- **Dark/Light Mode Support** - Automatically adapts to your app's theme
- **Dynamic Colors** - State colors change based on compliance status
- **Background Integration** - Seamlessly matches your app's color scheme
- **Smooth Transitions** - All color changes are animated

### 🖱️ **Interactive Features**
- **Clickable States** - Click any state to see detailed information
- **Hover Effects** - States highlight and scale on hover
- **Loading Animation** - Professional loading state with spinner
- **State Details Panel** - Shows comprehensive state information

### 🎯 **Color Coding System**

**Light Mode:**
- 🔴 **Critical**: `#dc2626` (red-600) - Urgent alerts
- 🟡 **Warning**: `#d97706` (amber-600) - Moderate alerts  
- 🔵 **Pending**: `#2563eb` (blue-600) - Pending registrations
- 🟢 **Compliant**: `#059669` (emerald-600) - No issues

**Dark Mode:**
- 🔴 **Critical**: `#f87171` (red-400) - Urgent alerts
- 🟡 **Warning**: `#fbbf24` (amber-400) - Moderate alerts
- 🔵 **Pending**: `#60a5fa` (blue-400) - Pending registrations
- 🟢 **Compliant**: `#34d399` (emerald-400) - No issues

## Technical Implementation

### **No External Dependencies**
- Pure SVG implementation
- No API keys required
- No network requests
- Works offline
- Fast loading

### **Customizable Data**
- Easy to modify state data
- Simple to add/remove states
- Configurable status types
- Flexible color schemes

### **Performance Optimized**
- Lightweight SVG graphics
- Efficient React rendering
- Smooth animations
- Minimal memory usage

## Usage

The map automatically loads when you navigate to the Tax Manager dashboard. No setup or configuration is required - it works out of the box!

### **Navigation**
1. Go to: `http://localhost:3000/dashboard/tax-manager`
2. The map loads automatically with a 1-second loading animation
3. Click any state to see detailed information
4. Toggle dark/light mode to see color adaptation

### **Customization**
To modify the map data, edit the `stateData` array in `components/charts/us-states-map.tsx`:

```typescript
const stateData: StateData[] = [
  {
    name: 'California',
    code: 'CA',
    clients: 45,
    alerts: 3,
    status: 'critical',
    revenue: 2400000,
    coordinates: { lat: 36.7783, lng: -119.4179 }
  },
  // ... more states
];
```

## Benefits

✅ **No API Keys** - No external service dependencies  
✅ **Fast Loading** - Instant map rendering  
✅ **Customizable** - Full control over appearance and data  
✅ **Responsive** - Works on all devices  
✅ **Accessible** - Screen reader friendly  
✅ **Cost-Free** - No usage limits or billing  
✅ **Reliable** - No network dependencies
