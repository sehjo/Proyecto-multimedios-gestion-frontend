import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

// Opens the create flow when the route carries ?action=new (e.g. navigated from
// the dashboard), then strips the query param so a refresh doesn't reopen it.
export function useOpenCreateFromQuery(onOpen: () => void) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'new') {
      onOpen();
      navigate(location.pathname, { replace: true });
    }
    // onOpen is intentionally omitted: we only react to URL changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, location.pathname, navigate]);
}
