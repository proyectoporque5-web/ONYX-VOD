import React, { createContext, useContext, useState, useEffect } from 'react';

// Simple Router Context
const RouterContext = createContext({
  route: '/',
  params: {},
  push: (path) => {},
  replace: (path) => {},
  back: () => {},
});

export const useRouter = () => useContext(RouterContext);

export const useLocalSearchParams = () => {
  const { params } = useContext(RouterContext);
  return params || {};
};

export const Link = ({ href, asChild, children }) => {
  const { push } = useRouter();
  
  const handlePress = (e) => {
    e.preventDefault();
    push(href);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onPress: handlePress });
  }

  return (
    <a href={href} onClick={handlePress}>
      {children}
    </a>
  );
};

// Router Provider Component to wrap the App
export const RouterProvider = ({ children }) => {
  const [history, setHistory] = useState([{ path: '/', params: {} }]);
  
  const currentRoute = history[history.length - 1];

  const push = (path) => {
    // Parse path and params
    // Example: /movie/123 -> path: /movie/[id], params: { id: 123 }
    let routePath = path;
    let params = {};

    if (path.startsWith('/movie/')) {
      const id = path.split('/')[2];
      routePath = '/movie/[id]';
      params = { id };
    } else if (path.startsWith('/player/')) {
      const url = path.split('/')[2];
      routePath = '/player/[url]';
      params = { url: decodeURIComponent(url) };
    }

    setHistory((prev) => [...prev, { path: routePath, params }]);
  };

  const replace = (path) => {
     // Similar logic to push but replaces last entry
     let routePath = path;
    let params = {};

    if (path.startsWith('/movie/')) {
      const id = path.split('/')[2];
      routePath = '/movie/[id]';
      params = { id };
    } else if (path.startsWith('/player/')) {
      const url = path.split('/')[2];
      routePath = '/player/[url]';
      params = { url: decodeURIComponent(url) };
    }

    setHistory((prev) => [...prev.slice(0, -1), { path: routePath, params }]);
  };

  const back = () => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  return (
    <RouterContext.Provider value={{ ...currentRoute, push, replace, back }}>
      {children}
    </RouterContext.Provider>
  );
};
