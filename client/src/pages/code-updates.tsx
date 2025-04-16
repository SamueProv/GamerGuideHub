import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import EmailCodeSender from "@/components/email-code-sender";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CodeUpdates() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("web");
  
  // This would be populated with actual code updates
  const webCode = `
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>DinoGames</Text>
      <Text style={styles.subtitle}>Discover the best game guides</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Categories')}
      >
        <Text style={styles.buttonText}>Browse Games</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#aaaaaa',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#8c43ff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
  `;
  
  const appCode = `
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import VideoListScreen from './screens/VideoListScreen';
import VideoDetailScreen from './screens/VideoDetailScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import { AuthProvider, useAuth } from './context/AuthContext';

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#121212',
        },
        headerTintColor: '#ffffff',
        cardStyle: { backgroundColor: '#121212' }
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#121212',
        },
        headerTintColor: '#ffffff',
        cardStyle: { backgroundColor: '#121212' }
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="VideoList" component={VideoListScreen} />
      <Stack.Screen name="VideoDetail" component={VideoDetailScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <ActivityIndicator size="large" color="#8c43ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
  `;
  
  const serverCode = `
// server.js for DinoGames API
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'dinogames-secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error);
  }
});

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // Check if username exists
    const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }
    
    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, email || '']
    );
    
    const user = result.rows[0];
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Login failed after registration' });
      }
      return res.status(201).json({ success: true, user: { id: user.id, username: user.username, email: user.email } });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    if (!user) {
      return res.status(401).json({ success: false, message: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      return res.json({ 
        success: true, 
        user: { id: user.id, username: user.username, email: user.email } 
      });
    });
  })(req, res, next);
});

app.post('/api/logout', (req, res) => {
  req.logout();
  res.json({ success: true });
});

app.get('/api/user', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  
  res.json({ 
    success: true, 
    user: { 
      id: req.user.id, 
      username: req.user.username, 
      email: req.user.email 
    } 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
  `;
  
  const getCodeContent = () => {
    switch (selectedTab) {
      case "web":
        return webCode;
      case "app":
        return appCode;
      case "server":
        return serverCode;
      default:
        return webCode;
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeContent());
    toast({
      title: "Copied to clipboard",
      description: "The code has been copied to your clipboard",
    });
  };
  
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([getCodeContent()], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `dinogames-${selectedTab}-code.js`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "File downloaded",
      description: `dinogames-${selectedTab}-code.js has been downloaded`,
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">DinoGames Code Updates</h1>
      <p className="text-gray-400 mb-6">
        Here's the latest code for the DinoGames React Native application. You can copy, download, or email the code.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs 
            defaultValue="web" 
            value={selectedTab} 
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="web">React Native UI</TabsTrigger>
                <TabsTrigger value="app">App Navigation</TabsTrigger>
                <TabsTrigger value="server">Server Code</TabsTrigger>
              </TabsList>
              
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={handleCopy}>
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
                <Button size="sm" variant="outline" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
            </div>
            
            <TabsContent value="web" className="mt-0">
              <div className="bg-darklight rounded-lg p-4 overflow-auto max-h-[500px]">
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                  {webCode}
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="app" className="mt-0">
              <div className="bg-darklight rounded-lg p-4 overflow-auto max-h-[500px]">
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                  {appCode}
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="server" className="mt-0">
              <div className="bg-darklight rounded-lg p-4 overflow-auto max-h-[500px]">
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                  {serverCode}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <EmailCodeSender codeContent={getCodeContent()} />
        </div>
      </div>
    </div>
  );
}