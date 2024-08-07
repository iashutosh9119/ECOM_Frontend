import { Product_Category, Product_Images } from "./Products";
import { User } from "./User";

export interface tokenObject {
	[key: string]: string;
}

export interface cartItem {
	guid: string;
	quantity: number;
	Product_Name: string;
	Product_MRP: number;
	Product_SellingPrice: number;
	Product_Images: Product_Images[];
}

export interface cartObject {
	[key: string]: cartItem[];
}

export interface wishlistObject {
	[key: string]: string[];
}

export interface Store {
	token: tokenObject;
	cart: cartObject;
	wishlist: wishlistObject;
	allCartItemsCount: number;
	allCartItemsTotalPrice: number;
	allCartItemsTotalDiscount: number;
	allWishlistItemsCount: number;
	allProductCategories: Product_Category[];
	userProfile: User;
}
