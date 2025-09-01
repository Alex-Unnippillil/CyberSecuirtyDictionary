import React, { useState } from "react";

interface FavoriteButtonProps {
  term: string;
}

/**
 * Button that stores a term in localStorage favorites and shows a toast.
 */
export default function FavoriteButton({ term }: FavoriteButtonProps) {
  const [added, setAdded] = useState(false);

  const showToast = (message: string) => {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "1rem";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#333";
    toast.style.color = "#fff";
    toast.style.padding = "0.5rem 1rem";
    toast.style.borderRadius = "4px";
    toast.style.zIndex = "1000";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  const addToFavorites = () => {
    const favorites: string[] = JSON.parse(
      localStorage.getItem("favorites") || "[]",
    );
    if (!favorites.includes(term)) {
      favorites.push(term);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setAdded(true);
      showToast("Added to favorites");
    }
  };

  return (
    <button
      onClick={addToFavorites}
      disabled={added}
      aria-label="Add to favorites"
    >
      {added ? "Favorited" : "Add to Favorites"}
    </button>
  );
}
