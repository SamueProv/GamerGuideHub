// DinoGames Theme based on the Figma design
export const theme = {
  colors: {
    // Primary color changed to black as requested
    primary: '#000000',
    primaryDark: '#121212',
    primaryLight: '#333333',
    
    // Background colors
    background: '#121212',
    backgroundDark: '#000000',
    
    // Text colors
    text: '#FFFFFF',
    textLight: '#CCCCCC',
    textDark: '#FFFFFF',
    textOnPrimary: '#FFFFFF',
    
    // UI elements
    border: '#333333',
    input: '#222222',
    error: '#FF3333',
    success: '#00CC66',
    warning: '#FFCC00',
    
    // Social login
    facebook: '#3B5998',
    google: '#DB4437',
  },
  
  // Typography
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
  },
  
  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  // Border radius
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    rounded: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
  
  // Animation
  animation: {
    fast: '0.2s',
    normal: '0.3s',
    slow: '0.5s',
  },
};

// Helper for creating React Native styled styles
export const createRNStyles = (styles: any) => styles;

// React Native styled components helper
export const rnStyled = (Component: any, styles: any) => Component;