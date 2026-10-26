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
    if (typeof to === 'number') {
      window.history.go(to);
      return;
    }
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

  // Flatten children (including fragments, arrays, and conditional elements)
  const flatChildren = [];
  const flatten = (nodes) => {
    React.Children.forEach(nodes, (node) => {
      if (!node) return;
      if (node.type === React.Fragment) {
        flatten(node.props?.children);
      } else if (Array.isArray(node)) {
        flatten(node);
      } else if (React.isValidElement(node)) {
        flatChildren.push(node);
      }
    });
  };
  flatten(children);

  let matchedElement = null;

  // 1. Exact match
  for (const child of flatChildren) {
    if (!child.props || !child.props.path) continue;
    const routePath = cleanPath(child.props.path);
    if (
      routePath === current ||
      (current === '/index.html' && routePath === '/') ||
      (current === '/login.html' && routePath === '/login')
    ) {
      matchedElement = child.props.element;
      break;
    }
  }

  // 2. Wildcard fallback
  if (!matchedElement) {
    for (const child of flatChildren) {
      if (!child.props) continue;
      if (child.props.path === '*') {
        matchedElement = child.props.element;
        break;
      }
    }
  }

  return matchedElement;
}

export function Route({ path, element }) {
  return null;
}

export function Link({ to, children, className, onClick, ...props }) {
  const { pathname, navigate } = useContext(RouterContext);

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.altKey && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      navigate(to);
    }
  };

  const cleanPath = (p) => {
    if (!p) return '/';
    let path = p.replace(/\/+$/, '');
    if (path === '') path = '/';
    return path;
  };

  const current = cleanPath(pathname);
  const target = cleanPath(to);
  const isActive = current === target;
  const resolvedClassName = typeof className === 'function' ? className({ isActive }) : className;

  return React.createElement(
    'a',
    { href: to, className: resolvedClassName, onClick: handleClick, ...props },
    typeof children === 'function' ? children({ isActive }) : children
  );
}

export function NavLink({ to, children, className, onClick, end, style, ...props }) {
  const { pathname, navigate } = useContext(RouterContext);

  const cleanPath = (p) => {
    if (!p) return '/';
    let path = p.replace(/\/+$/, '');
    if (path === '') path = '/';
    return path;
  };

  const current = cleanPath(pathname);
  const target = cleanPath(to);
  const isActive = end
    ? current === target
    : (current === target || (target !== '/' && current.startsWith(target + '/')));

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.altKey && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      navigate(to);
    }
  };

  const resolvedClassName = typeof className === 'function' ? className({ isActive }) : className;
  const resolvedStyle = typeof style === 'function' ? style({ isActive }) : style;
  const resolvedChildren = typeof children === 'function' ? children({ isActive }) : children;

  return React.createElement(
    'a',
    {
      href: to,
      className: resolvedClassName,
      style: resolvedStyle,
      onClick: handleClick,
      'aria-current': isActive ? 'page' : undefined,
      ...props
    },
    resolvedChildren
  );
}

export function Outlet() { return null; }
