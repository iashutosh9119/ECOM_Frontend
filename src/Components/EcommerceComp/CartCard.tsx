import { useState, useContext, useEffect } from "react";
import { CartContext } from "../../Contexts/CartContext";
import "hover.css";
import "animate.css";
import { Link } from "react-router-dom";
import { WishlistContext } from "../../Contexts/WishlistContext";
import tempImg from "../../Assets/images/Product_3.webp";
import { isAuthenticated } from "../../helpers/auth/authentication";
import { toast } from "react-toastify";
import { BaseContext } from "../../Context";
const CartCard = ({ item }) => {
	const [deleteToggle, setDeleteToggle] = useState(false);
	const [plusminusStatus, setPlusMinusStatus] = useState("");
	const { increase, decrease, removeProduct } = useContext(CartContext);
	const { addProductToWishlist, removeProductFromWishlist, wishlistItems } = useContext(WishlistContext);
	const { cookies } = useContext(BaseContext);
	const isProductInWishlist = (guid) => {
		return wishlistItems.products.find((item) => item.product.guid === guid && item.userID === cookies?.user?.[0]?.id);
	};
	const deletebutton = () => {
		if (item?.product?.guid) {
			setDeleteToggle(!deleteToggle);
			setTimeout(() => {
				removeProduct(item?.product?.guid);
				setDeleteToggle(false);
			}, 900);
		}
	};
	useEffect(() => {
		if (plusminusStatus === "increase" && isAuthenticated()) {
			increase({
				product: item?.product,
				quantity: 1,
				userID: cookies.user[0].id,
			});
			setPlusMinusStatus("");
		} else if (plusminusStatus === "decrease" && isAuthenticated()) {
			decrease({
				product: item?.product,
				quantity: 1,
				userID: cookies.user[0].id,
			});
			if (item?.quantity === 0) {
				deletebutton();
			}
			setPlusMinusStatus("");
		}
	}, [plusminusStatus]);
	return (
		<>
			<div className={`${deleteToggle ? "row py-2 animate__animated animate__fadeOutLeft" : "row px-2 py-3"}`}>
				<div className="col-4">
					<Link to={`/shop/products/${item?.product?.guid}`}>
						<img className="border5px shadow w-100 h-auto" src={item?.product?.Product_Images?.[0]?.dbImage || tempImg} alt="Product_Image" />
					</Link>
				</div>
				<div className="col-8 text-start">
					<div className="row">
						<div className="col-lg-12">
							<Link className="colorblue fw-bold fontsize20 lightbluehover" to={`/shop/products/${item?.product?.guid}`}>
								{item?.product?.Product_Name}
							</Link>
						</div>
					</div>
					{item?.product && (
						<>
							<div className="row mt-3">
								<div className="col-lg-12">
									<button
										className="colorblue border-0 border5px bgyellow bglightblue"
										onClick={() => {
											if (isAuthenticated()) {
												setPlusMinusStatus("decrease");
											} else {
												return toast("Please login first!", { type: "warning" });
											}
										}}
										style={{ width: 40, height: 40 }}
									>
										<i className="fas fa-minus" />
									</button>
									<input className="bgcolorgreyish text-center colorblue border-0 border5px mx-2" type="number" value={item?.quantity} disabled style={{ width: 50, height: 40 }} />
									<button
										className="colorblue border-0 border5px bgyellow bglightblue"
										onClick={() => {
											if (isAuthenticated()) {
												setPlusMinusStatus("increase");
											} else {
												return toast("Please login first!", { type: "warning" });
											}
										}}
										style={{ width: 40, height: 40 }}
									>
										<i className="fas fa-plus" />
									</button>
									<button
										className="ms-2 colorblue border-0 border5px bgyellow bglightblue"
										onClick={() => {
											deletebutton();
										}}
										style={{ width: 40, height: 40 }}
									>
										<i className="fas fa-times" />
									</button>
								</div>
							</div>
							<div className="row mt-3">
								<div className="col-lg-12">
									<p className="colorblue mypara mb-0 fontsize20">
										₹ {item?.product?.Product_SellingPrice} x {item?.quantity} = ₹ {item?.product?.Product_SellingPrice * item?.quantity}
									</p>
								</div>
							</div>
						</>
					)}
					<div className="row mt-3">
						<div className="col-lg-12">
							{item?.product ? (
								<button
									className="hvr-icon-pulse border-0 mywish border5px heartredhover"
									onClick={() => {
										isProductInWishlist(item?.product?.guid)
											? removeProductFromWishlist({ guid: item?.product?.guid, userID: cookies?.user?.[0]?.id })
											: addProductToWishlist({ product: item?.product, userID: cookies?.user?.[0].id });
									}}
								>
									<i className={`${isProductInWishlist(item?.product?.guid) ? "fas fa-heart heartred hvr-icon" : "far fa-heart"}`} />
								</button>
							) : (
								<>
									{!item.product && (
										<button
											className="colorblue border-0 border5px bgyellow bglightblue me-3"
											onClick={() => {
												deletebutton();
											}}
											style={{ width: 40, height: 40 }}
										>
											<i className="fas fa-times" />
										</button>
									)}
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default CartCard;
