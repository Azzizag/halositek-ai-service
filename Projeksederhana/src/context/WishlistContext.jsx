import { createContext, useContext, useReducer, useCallback } from 'react';

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_WISHLIST': {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (exists) {
        return { ...state, items: state.items.filter(item => item.id !== action.payload.id) };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_FROM_WISHLIST':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    default:
      return state;
  }
};

export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  const toggleWishlist = useCallback((product) => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
  }, []);

  const removeFromWishlist = useCallback((id) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: id });
  }, []);

  const isInWishlist = useCallback((id) => {
    return state.items.some(item => item.id === id);
  }, [state.items]);

  return (
    <WishlistContext.Provider
      value={{
        items: state.items,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount: state.items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
