'use client';

/**
 * react-router-dom compatibility shim backed by Next.js navigation.
 *
 * The app was originally written with react-router-dom. To keep the page
 * components unchanged, this module re-exports Next.js navigation under the
 * same names/signatures the components already use. Routing itself is now
 * file-based under `app/` — this only covers in-component navigation helpers.
 *
 * Covered: Link (with `to`), NavLink, useNavigate, useParams, useSearchParams.
 * (Outlet / Navigate / Routes are handled by the Next.js `app/` structure.)
 */
import NextLink from 'next/link';
import {
  useRouter,
  usePathname,
  useParams as useNextParams,
  useSearchParams as useNextSearchParams,
} from 'next/navigation';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string;
  children: ReactNode;
};

export function Link({ to, children, ...rest }: LinkProps) {
  return (
    <NextLink href={to} {...rest}>
      {children}
    </NextLink>
  );
}

type NavLinkClassName = string | ((args: { isActive: boolean }) => string);
type NavLinkChildren = ReactNode | ((args: { isActive: boolean }) => ReactNode);

export function NavLink({
  to,
  end,
  className,
  children,
  onClick,
}: {
  to: string;
  end?: boolean;
  className?: NavLinkClassName;
  children: NavLinkChildren;
  onClick?: () => void;
}) {
  const pathname = usePathname() ?? '';
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
  const cls = typeof className === 'function' ? className({ isActive }) : className;
  const content = typeof children === 'function' ? children({ isActive }) : children;
  return (
    <NextLink href={to} onClick={onClick} className={cls}>
      {content}
    </NextLink>
  );
}

/**
 * Returns a navigate(to) function. `navigate(-1)` goes back; a string pushes a
 * new route. (Replace semantics aren't needed by the current components.)
 */
export function useNavigate() {
  const router = useRouter();
  return (to: string | number) => {
    if (typeof to === 'number') {
      router.back();
      return;
    }
    router.push(to);
  };
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  return (useNextParams() ?? {}) as T;
}

/**
 * react-router-style tuple: [searchParams, setSearchParams]. The setter
 * navigates with `router.replace` to update the query string.
 */
type SetParams = (next: URLSearchParams, opts?: { replace?: boolean }) => void;

export function useSearchParams(): [URLSearchParams, SetParams] {
  const sp = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const params = new URLSearchParams(sp?.toString() ?? '');
  const setParams: SetParams = (next, opts) => {
    const qs = next.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    if (opts?.replace === false) router.push(url);
    else router.replace(url);
  };
  return [params, setParams];
}
