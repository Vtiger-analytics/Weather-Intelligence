import React from 'react';
import { X, Bookmark, MapPin, Trash2, ArrowRight } from 'lucide-react';
import { FavoriteLocation, GeoLocation } from '../types';

interface FavoriteLocationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteLocation[];
  onSelectFavorite: (fav: FavoriteLocation) => void;
  onRemoveFavorite: (id: number) => void;
}

export const FavoriteLocationsDrawer: React.FC<FavoriteLocationsDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectFavorite,
  onRemoveFavorite
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Bookmark className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-slate-100">Saved Locations</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-400 my-3">
            Quickly switch between your favorite saved cities across the world.
          </p>

          {/* List of Favorites */}
          <div className="mt-4 space-y-2.5 max-h-[calc(100vh-180px)] overflow-y-auto pr-1 scrollbar-thin">
            {favorites.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                No saved locations yet. Click the bookmark icon on any city card to save it here!
              </div>
            ) : (
              favorites.map((fav) => (
                <div
                  key={fav.id}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-sky-500/50 transition flex items-center justify-between group"
                >
                  <button
                    onClick={() => {
                      onSelectFavorite(fav);
                      onClose();
                    }}
                    className="flex-1 text-left flex items-center gap-3"
                  >
                    <MapPin className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-sm font-bold text-slate-200 group-hover:text-sky-300 transition-colors">
                        {fav.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {[fav.admin1, fav.country].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        onSelectFavorite(fav);
                        onClose();
                      }}
                      className="p-2 text-slate-400 hover:text-sky-400 transition"
                      title="Load weather"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveFavorite(fav.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 transition"
                      title="Remove location"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
          Saved locations stored locally in your browser session.
        </div>

      </div>
    </div>
  );
};
