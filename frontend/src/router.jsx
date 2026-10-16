import React, { createContext, useContext, useState, useEffect } from 'react';

const RouterContext = createContext({
  pathname: window.location.pathname || '/',
  navigate: () => {}
});

export function BrowserRouter({ children }) {
  const [pathname, setPathname] = useState(window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to, options) => {
    if (typeof to !== 'string') return;
    if (to.startsWith('http://') || to.startsWith('https://')) {
      window.location.href = to;
      return;
    }
    const cleanTo = to.split('?')[0];
    if (options && options.replace) {
      window.history.replaceState(null, '', to);
    } else {
      window.history.pushState(null, '', to);
    }
    setPathname(cleanTo || '/');
  };

  return React.createElement(
    RouterContext.Provider,
    { value: { pathname, navigate } },
    children
  );
}

export const HashRouter = BrowserRouter;

export function useNavigate() {
  const ctx = useContext(RouterContext);
  return ctx.navigate;
}

export function useLocation() {
  const ctx = useContext(RouterContext);
  return { pathname: ctx.pathname, search: window.location.search, hash: window.location.hash };
}

export function useParams() {
  return {};
}

export function useSearchParams() {
  const [search, setSearch] = useState(new URLSearchParams(window.location.search));
  const setSearchParams = (params) => {
    const sp = new URLSearchParams(params);
    window.history.pushState(null, '', `?${sp.toString()}`);
    setSearch(sp);
  };
  return [search, setSearchParams];
}

export function Navigate({ to, replace }) {
  const { navigate } = useContext(RouterContext);
  useEffect(() => {
    if (to) {
      navigate(to, { replace: Boolean(replace) });
    }
  }, [to, replace]);
  return null;
}

export function Routes({ children }) {
  const { pathname } = useContext(RouterContext);

  const cleanPath = (p) => {
    if (!p) return '/';
    let path = p.replace(/\/+$/, '');
    if (path === '') path = '/';
    return path;
  };

  const current = cleanPath(pathname);

  let matchedElement = null;

  // 1. Exact match
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child) || matchedElement) return;
    const routePath = cleanPath(child.props.path);
    if (
      routePath === current ||
      (current === '/index.html' && routePath === '/') ||
      (current === '/login.html' && routePath === '/login')
    ) {
      matchedElement = child.props.element;
    }
  });

  // 2. Wildcard fallback
  if (!matchedElement) {
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child) || matchedElement) return;
      if (child.props.path === '*') {
        matchedElement = child.props.element;
      }
    });
  }

  return matchedElement;
}

export function Route({ path, element }) {
  return null;
}

export function Link({ to, children, className, onClick, ...props }) {
  const { navigate } = useContext(RouterContext);

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.altKey && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      navigate(to);
    }
  };

  return React.createElement(
    'a',
    { href: to, className, onClick: handleClick, ...props },
    children
  );
}

export const NavLink = Link;
export function Outlet() { return null; }
