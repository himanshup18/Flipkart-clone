import express from "express";
import { getWishlist, addToWishlist, removeFromWishlist, checkWishlist } from "../controllers/wishlistController.js";

const router = express.Router();

// Get wishlist items for authenticated user
router.get("/", getWishlist);

// Check if product is in wishlist
router.get("/check", checkWishlist);

// Add item to wishlist
router.post("/", addToWishlist);

// Remove item from wishlist
router.delete("/:id", removeFromWishlist);

export default router;
