import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import tempImg from "../Assets/Product_3.webp";
import { BaseContext } from "../Context";
import { isAuthenticated } from "../APIs/user/user";
import { toast } from "react-toastify";
import { Product } from "../Interfaces/Products";
import { useSelector, useDispatch } from "react-redux";
import { cartItem, Store } from "../Interfaces/Store";
import {
	addProductInCart,
	increaseQuantityOfProductInCart,
	decreaseQuantityOfProductInCart,
	addProductInWishlist,
	removeProductFromWishlist,
} from "../Data/storingData";

export default function ShopCard({
	product,
}: {
	product: Product;
}): JSX.Element {
	const dispatch = useDispatch();
	const [addStatus, setAddStatus] = useState("");
	const [plusMinus, setPlusMinus] = useState(1);
	const [animateButton, setAnimateButton] = useState(false);
	const wishlistItems = useSelector(
		(state: Store) => state.wishlist[cookies?.user?.[0]?.id]
	);
	const cartItems = useSelector(
		(state: Store) => state.cart[cookies?.user?.[0]?.id]
	);
	const { cookies }: any = useContext(BaseContext);
	const isInWishlist = (id: string) => {
		return wishlistItems.find((item: string) => item === id);
	};
	const isInCart = (id: string, userID: string) => {
		return !!!cartItems.find((item: cartItem) => item.guid === id);
	};
	const handlePlus = () => {
		setPlusMinus(plusMinus + 1);
	};
	const handleMinus = () => {
		if (plusMinus > 1) setPlusMinus(plusMinus - 1);
	};
	useEffect(() => {
		const timer = setTimeout(() => setAnimateButton(false), 1000);
		return () => {
			clearTimeout(timer);
		};
	}, [animateButton]);
	useEffect(() => {
		if (addStatus === "add" && (async () => await isAuthenticated())) {
			dispatch(
				increaseQuantityOfProductInCart({
					guid: product?.guid,
				})
			);
			setAddStatus("");
		}
	}, [addStatus]);
	return (
		<div className="col-lg-3 col-12 mt-4">
			<div className="card mycard border-0 shadow hovergoup">
				<Link
					className="text-center"
					to={`/shop/products/${product?.guid}`}
				>
					<img
						className="w-75"
						// height="250px"
						alt="Product_Image"
						src={`${
							product.Product_Images?.[0]?.dbImage || tempImg
						}`}
					/>
				</Link>
				<span
					className="d-flex justify-content-center align-items-center"
					id="mydiscountper"
				>
					{Math.abs(
						parseInt(product?.Product_Discount.toString()) -
							parseFloat(product?.Product_Discount.toString())
					) > 0.5
						? parseInt(product?.Product_Discount.toString()) + 1
						: parseInt(product?.Product_Discount.toString())}
					%
				</span>
				<button className="d-flex hvr-icon-pulse border-0 justify-content-center align-items-center mywishlist heartredhover">
					<div
						className={`${
							isInWishlist(product.guid)
								? "fas fa-heart heartred hvr-icon"
								: "far fa-heart"
						}`}
						onClick={() => {
							isInWishlist(product.guid)
								? dispatch(
										removeProductFromWishlist({
											guid: product?.guid,
										})
								  )
								: dispatch(
										addProductInWishlist({
											guid: product?.guid,
										})
								  );
						}}
					/>
				</button>
				<div className="text-center mycardbody">
					<div className="row my-1">
						<div className="col">
							<h5 className="mb-0">
								<Link
									to={`/shop/products/${product?.guid}`}
									className="colorblue lightbluehover"
								>
									{product?.Product_Name}
								</Link>
							</h5>
						</div>
					</div>
					<div className="row my-1">
						<div className="col">
							<p className="mb-0">
								<span className="fontsize20 fw-bold colorlightblue">
									₹ {product?.Product_SellingPrice}
								</span>
								&nbsp;&nbsp;
								<span className="fontsize18" id="mydiscountpri">
									₹ {product?.Product_MRP}
								</span>
							</p>
						</div>
					</div>
					<div className="row my-1">
						<div className="col ms-3 d-flex justify-content-center align-items-center">
							<button
								className="h-75 w-75 colorblue border-0 border5px bgyellow bglightblue"
								onClick={handleMinus}
							>
								<i className="fas fa-minus" />
							</button>
							<input
								className="bgcolorgreyish text-center colorblue h-75 w-75 border-0 border5px mx-2"
								type="number"
								value={plusMinus}
								onChange={(e: any) => {
									setPlusMinus(e.target.value);
								}}
							/>
							<button
								className="h-75 w-75 colorblue border-0 border5px bgyellow bglightblue"
								onClick={handlePlus}
							>
								<i className="fas fa-plus" />
							</button>
						</div>
						<div className="col me-3 d-flex align-items-center">
							{isInCart(product.guid, cookies?.user?.[0]?.id) ? (
								<button
									className={`${
										animateButton
											? "add-to-cart w-100 h-75 fontsize14 d-flex justify-content-center align-items-center mybtnsame position-relative overflow-hidden bglightblue colorblue bgyellow border5px border-0 text-uppercase is-added"
											: "add-to-cart w-100 h-75 fontsize14 d-flex justify-content-center align-items-center mybtnsame position-relative overflow-hidden bglightblue colorblue bgyellow border5px border-0 text-uppercase"
									}`}
									onClick={() => {
										if (
											async () => await isAuthenticated()
										) {
											setAnimateButton(true);
											dispatch(
												addProductInCart({
													guid: product?.guid,
													quantity: plusMinus,
													Product_MRP:
														product?.Product_MRP,
													Product_Name:
														product?.Product_Name,
													Product_SellingPrice:
														product?.Product_SellingPrice,
												})
											);
										} else {
											return toast.warning(
												"Please login to access Cart!"
											);
										}
									}}
								>
									<span>Add to Cart</span>
									<svg
										x="0px"
										y="0px"
										width="32px"
										height="32px"
										viewBox="0 0 32 32"
									>
										<path
											className={`${
												animateButton ? "pathatc" : ""
											}`}
											strokeDasharray="19.79 19.79"
											strokeDashoffset="19.79"
											fill="none"
											stroke="#000000"
											strokeWidth={2}
											strokeLinecap="square"
											strokeMiterlimit={10}
											d="M9,17l3.9,3.9c0.1,0.1,0.2,0.1,0.3,0L23,11"
										/>
									</svg>
								</button>
							) : (
								<button
									className={`${
										animateButton
											? "add-to-cart w-100 h-75 fontsize14 d-flex justify-content-center align-items-center mybtnsame position-relative overflow-hidden bglightblue colorblue bgyellow border5px border-0 text-uppercase is-added"
											: "add-to-cart w-100 h-75 fontsize14 d-flex justify-content-center align-items-center mybtnsame position-relative overflow-hidden bglightblue colorblue bgyellow border5px border-0 text-uppercase"
									}`}
									onClick={() => {
										if (
											async () => await isAuthenticated()
										) {
											setAnimateButton(true);
											setAddStatus("add");
										} else {
											return toast.warning(
												"Please login first!"
											);
										}
									}}
								>
									<span>Add More</span>
									<svg
										x="0px"
										y="0px"
										width="32px"
										height="32px"
										viewBox="0 0 32 32"
									>
										<path
											className={`${
												animateButton ? "pathatc" : ""
											}`}
											strokeDasharray="19.79 19.79"
											strokeDashoffset="19.79"
											fill="none"
											stroke="#000000"
											strokeWidth={2}
											strokeLinecap="square"
											strokeMiterlimit={10}
											d="M9,17l3.9,3.9c0.1,0.1,0.2,0.1,0.3,0L23,11"
										/>
									</svg>
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
