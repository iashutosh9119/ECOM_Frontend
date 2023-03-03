import Breadcrumb from "../../Components/Breadcrumb";
import { useState, useEffect, useContext } from "react";
import { CartContext } from "../../Contexts/CartContext";
import Base from "../../Base";
import { coupon, razorpaykey } from "../../helpers/ecom/checkout";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Payment_API, PaymentSuccess_API } from "../../backend";
import { Helmet } from "react-helmet-async";
import { BaseContext } from "../../Context";
import { toast } from "react-toastify";
import DataLoader2 from "../../Components/DataLoaders/DataLoader2";
import PhoneInput from "react-phone-input-2";
import { SingleEntityContext } from "../../Contexts/SingleEntityContext";
import { profileDataUpdate } from "../../data/users/profileData";
declare global {
	interface Window {
		Razorpay: any;
	}
}

const Checkout = () => {
	const navigate = useNavigate();
	const { cookies, setCookie, handleNotification }: any =
		useContext(BaseContext);
	const {
		cartItems,
		allItemsTotalPrice,
		allItemsTotalDiscount,
		handleCheckout,
	}: any = useContext(CartContext);
	const { singleEntityValue, handleSingleCheckout }: any =
		useContext(SingleEntityContext);
	const [changeRZKey, setChangeRZKey] = useState<any>("123");
	const [checkBoxState, setCheckBoxState] = useState(true);
	const [loading, setLoading] = useState(false);
	const [couponApplied, setCouponApplied] = useState(false);
	const [mycoupon, setMyCoupon] = useState("");
	const [shippingAddress, setShippingAddress] = useState({
		first_name: cookies.user[0].first_name,
		last_name: cookies.user[0].last_name,
		address_line_1: cookies.user[0].address_line_1,
		city: cookies.user[0].city,
		state: cookies.user[0].state,
		pin_code: cookies.user[0].pin_code,
		country: cookies.user[0].country,
		mobile: cookies.user[0].mobile,
		email: cookies.user[0].email,
	});
	const [dataObj, setDataObj] = useState({
		products: [],
		coupon_code: "",
		shipping_address: JSON.stringify(shippingAddress),
	});
	const [couponDiscount, setCouponDiscount] = useState(0);
	useEffect(() => {
		var mounted = true;
		if (mounted) {
			couponDiscount === 0 && setMyCoupon("");
		}
		return () => {
			mounted = false;
		};
	}, [couponDiscount]);
	const checkoutData1 = () => {
		let newProductsArray: any = [];
		if (!!!singleEntityValue?.guid) {
			cartItems.products
				.filter((item: any) => item.userID === cookies?.user?.[0]?.id)
				.map((item: any) =>
					newProductsArray.push({
						product: item.product.guid,
						quantity: item.quantity,
					})
				);
			setDataObj({
				products: newProductsArray,
				coupon_code: mycoupon,
				shipping_address:
					shippingAddress.first_name +
					" " +
					shippingAddress.last_name +
					", " +
					shippingAddress.address_line_1 +
					", " +
					shippingAddress.city +
					", " +
					shippingAddress.state +
					", " +
					shippingAddress.pin_code +
					", " +
					shippingAddress.country +
					", " +
					shippingAddress.mobile +
					", " +
					shippingAddress.email,
			});
		} else {
			singleEntityValue?.Product_Name &&
				newProductsArray.push({
					product: singleEntityValue.product.guid,
					quantity: singleEntityValue.quantity,
				});
			setDataObj({
				products: newProductsArray,
				coupon_code: mycoupon,
				shipping_address:
					shippingAddress.first_name +
					" " +
					shippingAddress.last_name +
					", " +
					shippingAddress.address_line_1 +
					", " +
					shippingAddress.city +
					", " +
					shippingAddress.state +
					", " +
					shippingAddress.pin_code +
					", " +
					shippingAddress.country +
					", " +
					shippingAddress.mobile +
					", " +
					shippingAddress.email,
			});
		}
	};
	useEffect(() => {
		var mounted = true;
		if (mounted) {
			checkoutData1();
		}
		return () => {
			mounted = false;
		};
	}, [mycoupon, shippingAddress]);
	useEffect(() => {
		var mounted = true;
		if (mounted) {
			if (checkBoxState) {
				setShippingAddress({
					first_name: cookies.user[0].first_name,
					last_name: cookies.user[0].last_name,
					address_line_1: cookies.user[0].address_line_1,
					city: cookies.user[0].city,
					state: cookies.user[0].state,
					pin_code: cookies.user[0].pin_code,
					country: cookies.user[0].country,
					mobile: cookies.user[0].mobile,
					email: cookies.user[0].email,
				});
			} else {
				setShippingAddress({
					first_name: "",
					last_name: "",
					address_line_1: "",
					city: "",
					state: "",
					pin_code: "",
					country: "",
					mobile: "",
					email: "",
				});
			}
		}
		return () => {
			mounted = false;
		};
	}, [checkBoxState]);
	const handlePaymentSuccess = async (response: any) => {
		const tokenValue = localStorage.getItem("token")!.replace(/['"]+/g, "");
		try {
			await fetch(PaymentSuccess_API, {
				method: "POST",
				body: JSON.stringify(response),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: "Token " + tokenValue,
				},
			})
				.then((res) => {
					if (res.ok) {
						navigate("/profile/myorders");
						!!singleEntityValue?.guid
							? handleSingleCheckout()
							: handleCheckout(cookies?.user?.[0]?.id);
						setDataObj({
							products: [],
							coupon_code: "",
							shipping_address: "",
						});
					}
					return res.json();
				})
				.then((data) => {
					return toast.success(data?.message);
				})
				.catch((err) => {
					console.log(err);
				});
		} catch (error) {
			console.log(error);
		}
	};
	function loadScript(src: any) {
		return new Promise((resolve) => {
			const script = document.createElement("script");
			script.src = src;
			script.onload = () => {
				resolve(true);
			};
			script.onerror = () => {
				resolve(false);
			};
			document.body.appendChild(script);
		});
	}
	const showRazorpay = async () => {
		const tokenValue = localStorage.getItem("token")!.replace(/['"]+/g, "");
		const res = await loadScript(
			"https://checkout.razorpay.com/v1/checkout.js"
		);
		if (!res) {
			alert("Razorpay SDK failed to load. Are you online?");
			return;
		}
		const data = await fetch(Payment_API, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: "Token " + tokenValue,
			},
			body: JSON.stringify(dataObj),
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			});
		if (!data) {
			alert("Server error. Are you online?");
			return;
		}
		var options = {
			key: changeRZKey.razorpay_id,
			amount: data?.payment?.amount,
			currency: "INR",
			name: "MeeMo Kidz",
			image: "https://www.meemokidz.com/images/Meta_Image.png",
			order_id: data?.payment?.id,
			handler: function (response: any) {
				handlePaymentSuccess(response);
			},
			prefill: {
				name: `${
					cookies.user[0].first_name !== "" ||
					cookies.user[0].last_name !== ""
						? cookies.user[0].first_name +
						  " " +
						  cookies.user[0].last_name
						: cookies.user[0].username
				}`,
				email: cookies.user[0].email,
				contact: `+${cookies.user[0].mobile}`,
			},
			notes: {
				address:
					cookies.user[0].address_line_1 +
					", " +
					cookies.user[0].city +
					", " +
					cookies.user[0].state +
					" - " +
					cookies.user[0].pin_code +
					", " +
					cookies.user[0].country,
			},
			theme: {
				color: "#00214d",
			},
		};
		var rzp1 = new window.Razorpay(options);
		rzp1.open();
	};
	const CouponValidity = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		await coupon({ coupon_code: mycoupon }).then((data) => {
			if (data?.cashback) {
				setLoading(false);
				if (singleEntityValue?.guid) {
					if (
						(data?.discount / 100) *
							parseFloat(
								parseFloat(
									singleEntityValue?.Product_SellingPrice
								).toFixed(2)
							) >
						data?.cashback
					) {
						setCouponDiscount(data.cashback);
					} else {
						setCouponDiscount(
							(data?.discount / 100) *
								parseFloat(
									parseFloat(
										singleEntityValue?.Product_SellingPrice
									).toFixed(2)
								)
						);
					}
				} else {
					if (
						(data?.discount / 100) *
							parseFloat(
								parseFloat(allItemsTotalPrice).toFixed(2)
							) -
							parseFloat(
								parseFloat(allItemsTotalDiscount).toFixed(2)
							) >
						data?.cashback
					) {
						setCouponDiscount(data.cashback);
					} else {
						setCouponDiscount(
							(data?.discount / 100) *
								parseFloat(
									parseFloat(allItemsTotalPrice).toFixed(2)
								) -
								parseFloat(
									parseFloat(allItemsTotalDiscount).toFixed(2)
								)
						);
					}
				}
				setCouponApplied(true);
			} else {
				setLoading(false);
				setCouponApplied(false);
			}
			return toast(data?.message, {
				type: `${data?.cashback ? "success" : "error"}`,
			});
		});
	};
	useEffect(() => {
		var mounted = true;
		if (mounted) {
			razorpaykey((data: any) => {
				setChangeRZKey(data);
			});
		}
		return () => {
			mounted = false;
		};
	}, []);
	function truncate(str: any, n: any) {
		return str?.length > n ? str.substr(0, n - 1) + "..." : str;
	}
	const redirect = (value: any) => {
		if (value === "/profile/account") {
			handleNotification("Enter Your Billing Address.", "error");
		}
		return <Navigate to={`${value}`} />;
	};
	// REVIEW
	return cookies.user[0]?.address_line_1 !== "" &&
		cookies.user[0]?.pin_code !== "" &&
		cookies.user[0]?.mobile != " " &&
		cookies.user[0]?.mobile != "" &&
		cookies.user[0]?.city != " " &&
		cookies.user[0]?.city != "" &&
		cookies.user[0]?.state != " " &&
		cookies.user[0]?.state != "" &&
		cookies.user[0]?.country != " " &&
		cookies.user[0]?.country != "" ? (
		!!singleEntityValue?.guid || cartItems.products.length > 0 ? (
			<>
				<Helmet>
					<title>MeeMo Kidz | Checkout</title>
				</Helmet>
				<Base>
					<Breadcrumb title="Checkout" />
					<section className="section">
						<div className="container">
							<div className="row mx-3">
								<div className="col-lg-6 bgcolorgreyish border5px p-4 h-100">
									<div className="row mb-4 pb-3">
										<div className="col-lg-12">
											<h2 className="colorblue mb-3 text-center">
												Shipping Details
											</h2>
											<div className="text-center">
												<p className="colorblue pb-3">
													If you want to update your
													billing address click the
													button below.
												</p>
												<Link
													to="/profile/account"
													className="mybtnsame fontsize16 h-100 w-100 bglightblue colorblue bgyellow border5px border-0 text-uppercase"
												>
													Update Billing Address
												</Link>
												<p className="colorblue pt-4 mt-1 mb-4">
													<input
														className="form-check-input shadow-none border-0"
														type="checkbox"
														checked={checkBoxState}
														onChange={() => {
															setCheckBoxState(
																!checkBoxState
															);
														}}
													/>
													&nbsp;&nbsp;Is your shipping
													address same as billing
													address?
												</p>
											</div>
										</div>
									</div>
									<form>
										<div className="row">
											<div className="col-lg-6">
												<div className="mb-4 pb-1">
													<h5 className="colorblue text-start mb-3 fontsize16">
														First Name
													</h5>
													<input
														className="input100 w-100 border5px ps-3 border-0 colorblue"
														type="text"
														placeholder="First Name"
														onChange={(e) => {
															setShippingAddress({
																...shippingAddress,
																first_name:
																	e.target
																		.value,
															});
														}}
														value={
															shippingAddress?.first_name
														}
														required
													/>
												</div>
											</div>
											<div className="col-lg-6">
												<div className="mb-4 pb-1">
													<h5 className="colorblue text-start mb-3 fontsize16">
														Last Name
													</h5>
													<input
														className="input100 w-100 border5px ps-3 border-0 colorblue"
														type="text"
														placeholder="Last Name"
														onChange={(e) => {
															setShippingAddress({
																...shippingAddress,
																last_name:
																	e.target
																		.value,
															});
														}}
														value={
															shippingAddress?.last_name
														}
														required
													/>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-lg-12">
												<div className="mb-4 pb-1">
													<h5 className="colorblue text-start mb-3 fontsize16">
														Address
													</h5>
													<input
														className="input100 w-100 border5px ps-3 border-0 colorblue"
														type="text"
														placeholder="Address"
														onChange={(e) => {
															setShippingAddress({
																...shippingAddress,
																address_line_1:
																	e.target
																		.value,
															});
														}}
														value={
															shippingAddress?.address_line_1 ===
															" "
																? ""
																: shippingAddress?.address_line_1
														}
														required
													/>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-lg-12">
												<div className="mb-4 pb-1">
													<h5 className="colorblue text-start mb-3 fontsize16">
														Pincode
													</h5>
													<input
														className="input100 w-100 border5px ps-3 border-0 colorblue"
														type="number"
														placeholder="Pincode"
														onChange={(e) => {
															setShippingAddress({
																...shippingAddress,
																pin_code:
																	e.target
																		.value,
															});
														}}
														value={
															shippingAddress?.pin_code
														}
														required
													/>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-lg-12">
												<div className="mb-4 pb-1">
													<h5 className="colorblue text-start mb-3 fontsize16">
														City
													</h5>
													<input
														className="input100 w-100 border5px ps-3 border-0 colorblue"
														type="text"
														placeholder="Town / City"
														onChange={(e) => {
															setShippingAddress({
																...shippingAddress,
																city: e.target
																	.value,
															});
														}}
														value={
															shippingAddress?.city ===
															" "
																? ""
																: shippingAddress?.city
														}
														required
													/>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-lg-6">
												<div className="mb-4 pb-1">
													<h5 className="colorblue text-start mb-3 fontsize16">
														State
													</h5>
													<input
														className="input100 w-100 border5px ps-3 border-0 colorblue"
														type="text"
														placeholder="State"
														onChange={(e) => {
															setShippingAddress({
																...shippingAddress,
																state: e.target
																	.value,
															});
														}}
														value={
															shippingAddress?.state ===
															" "
																? ""
																: shippingAddress?.state
														}
														required
													/>
												</div>
											</div>
											<div className="col-lg-6">
												<div className="mb-4 pb-1">
													<h5 className="colorblue text-start mb-3 fontsize16">
														Country
													</h5>
													<input
														className="input100 w-100 border5px ps-3 border-0 colorblue"
														type="text"
														placeholder="Country"
														onChange={(e) => {
															setShippingAddress({
																...shippingAddress,
																country:
																	e.target
																		.value,
															});
														}}
														value={
															shippingAddress?.country ===
															" "
																? ""
																: shippingAddress?.country
														}
														required
													/>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-lg-6">
												<div className="mb-4 mb-lg-0">
													<h5 className="colorblue text-start mb-3 fontsize16">
														Mobile Number
													</h5>
													<PhoneInput
														inputClass="input100 w-100 shadow-none border5px pe-5 border-0 colorblue"
														buttonClass="border5px border-0 ps-2 colorblue bgcolorwhite"
														inputStyle={{
															height: "50px",
														}}
														specialLabel={""}
														country={"in"}
														value={
															shippingAddress?.mobile ||
															""
														}
														onChange={(value) => {
															setShippingAddress({
																...shippingAddress,
																mobile: value,
															});
														}}
													/>
												</div>
											</div>
											<div className="col-lg-6">
												<div className="">
													<h5 className="colorblue text-start mb-3 fontsize16">
														Email
													</h5>
													<input
														className="input100 w-100 border5px ps-3 border-0 colorblue"
														type="email"
														placeholder="Email"
														required
														onChange={(e) => {
															setShippingAddress({
																...shippingAddress,
																email: e.target.value.toLowerCase(),
															});
														}}
														value={shippingAddress?.email.toLowerCase()}
													/>
												</div>
											</div>
										</div>
									</form>
								</div>
								<div className="col-lg-1"></div>
								<div className="col-lg-5">
									<div className="row position-sticky sticky-bar">
										<div className="col-lg-12 bgcolorgreyish border5px p-4 h-100 mt-4 mt-lg-0">
											<h2 className="colorblue mb-3 text-center">
												Your Order Summary
											</h2>
											{!!!singleEntityValue?.guid ? (
												<>
													{cartItems.products.filter(
														(item: any) =>
															item.userID ===
															cookies?.user?.[0]
																?.id
													).length > 0 && (
														<>
															<h5 className="colorblue mb-2 text-start">
																Products
															</h5>
															<ul className="list-unstyled colorblue fontsize14">
																{cartItems.products
																	.filter(
																		(
																			item: any
																		) =>
																			item.userID ===
																			cookies
																				?.user?.[0]
																				?.id
																	)
																	.map(
																		(
																			item: any,
																			index: any
																		) => {
																			const {
																				product,
																			} =
																				item;
																			return (
																				<li
																					key={
																						index
																					}
																					className="d-flex justify-content-between"
																					data-bs-toggle="tooltip"
																					data-bs-placement="top"
																					title={
																						product?.Product_Name
																					}
																				>
																					<Link
																						to={`/shop/products/${product?.slug}`}
																						className="colorblue lightbluehover"
																					>
																						{truncate(
																							product?.Product_Name,
																							25
																						)}
																					</Link>
																					x&nbsp;
																					{
																						item?.quantity
																					}
																					<span>
																						₹&nbsp;
																						{(Math.abs(
																							parseInt(
																								product?.Product_SellingPrice
																							) -
																								parseFloat(
																									product?.Product_SellingPrice
																								)
																						) >
																						0.5
																							? parseInt(
																									product?.Product_SellingPrice
																							  ) +
																							  1
																							: parseInt(
																									product?.Product_SellingPrice
																							  )
																						).toLocaleString(
																							undefined,
																							{
																								maximumFractionDigits: 2,
																							}
																						)}
																					</span>
																				</li>
																			);
																		}
																	)}
															</ul>
														</>
													)}
												</>
											) : (
												<>
													<ul className="list-unstyled colorblue fontsize14">
														{
															<li
																className="d-flex justify-content-between"
																data-bs-toggle="tooltip"
																data-bs-placement="top"
																title={
																	singleEntityValue?.Product_Name
																}
															>
																<Link
																	to={`/shop/products/${singleEntityValue?.slug}`}
																	className="colorblue lightbluehover"
																>
																	{truncate(
																		singleEntityValue?.Product_Name,
																		25
																	)}
																</Link>
																<span>
																	₹&nbsp;
																	{(Math.abs(
																		parseInt(
																			singleEntityValue?.Product_SellingPrice
																		) -
																			parseFloat(
																				singleEntityValue?.Product_SellingPrice
																			)
																	) > 0.5
																		? parseInt(
																				singleEntityValue?.Product_SellingPrice
																		  ) + 1
																		: parseInt(
																				singleEntityValue?.Product_SellingPrice
																		  )
																	).toLocaleString(
																		undefined,
																		{
																			maximumFractionDigits: 2,
																		}
																	)}
																</span>
															</li>
														}
													</ul>
												</>
											)}
											{!!!singleEntityValue?.guid ? (
												<div className="d-flex py-3 justify-content-between align-items-center bordertopcheckout">
													<h3 className="mb-0 colorblue">
														Subtotal
													</h3>
													<p className="mb-0 colorblue">
														₹{" "}
														{(
															parseFloat(
																parseFloat(
																	allItemsTotalPrice
																).toFixed(2)
															) -
															allItemsTotalDiscount
														).toLocaleString(
															undefined,
															{
																maximumFractionDigits: 2,
															}
														)}
													</p>
												</div>
											) : (
												<div className="d-flex py-3 justify-content-between align-items-center bordertopcheckout">
													<h3 className="mb-0 colorblue">
														Subtotal
													</h3>
													<p className="mb-0 colorblue">
														₹{" "}
														{(singleEntityValue?.Product_SellingPrice).toLocaleString(
															undefined,
															{
																maximumFractionDigits: 2,
															}
														)}
													</p>
												</div>
											)}
											{couponApplied ? (
												<div className="py-3 bordertopcheckout">
													<h3 className="mb-0 colorblue">
														Discount
													</h3>
													<div className="d-flex justify-content-between align-items-center">
														<p className="mt-1 mb-0 colorblue">
															Coupon Code "
															{mycoupon}" applied!
														</p>
														{couponDiscount > 0 && (
															<button
																className="ms-2 colorblue border-0 border5px bgyellow bglightblue"
																onClick={() => {
																	setCouponDiscount(
																		0
																	);
																	setCouponApplied(
																		false
																	);
																}}
																style={{
																	width: 25,
																	height: 25,
																}}
															>
																<i className="fas fa-times" />
															</button>
														)}
														<p className="mb-0 accepted">
															-&nbsp;&nbsp;&nbsp;₹{" "}
															{couponDiscount.toLocaleString(
																undefined,
																{
																	maximumFractionDigits: 2,
																}
															)}
														</p>
													</div>
												</div>
											) : (
												<div className="d-flex py-3 justify-content-between align-items-center bordertopcheckout">
													<h3 className="mb-0 colorblue">
														Discount
													</h3>
													<p className="mb-0 accepted">
														-&nbsp;&nbsp;&nbsp;₹{" "}
														{couponDiscount.toLocaleString(
															undefined,
															{
																maximumFractionDigits: 2,
															}
														)}
													</p>
												</div>
											)}
											<div className="d-flex py-3 justify-content-between align-items-center bordertopcheckout">
												<h3 className="mb-0 colorblue">
													Total
												</h3>
												{!!!singleEntityValue?.guid ? (
													<p className="mb-0 colorblue">
														₹&nbsp;
														{Math.abs(
															parseFloat(
																parseFloat(
																	allItemsTotalPrice
																).toFixed(2)
															) -
																allItemsTotalDiscount -
																couponDiscount
														).toLocaleString(
															undefined,
															{
																maximumFractionDigits: 2,
															}
														)}
													</p>
												) : (
													<p className="mb-0 colorblue">
														₹&nbsp;
														{Math.abs(
															singleEntityValue?.Product_SellingPrice -
																couponDiscount
														).toLocaleString(
															undefined,
															{
																maximumFractionDigits: 2,
															}
														)}
													</p>
												)}
											</div>
											<div className="py-3 bordertopcheckout">
												<div className="row d-flex justify-content-center align-items-center">
													<h4 className="mb-3 text-center colorblue">
														Discount Code
													</h4>
													<form action="#">
														<div className="row">
															<div className="col-lg-9 col-7">
																<input
																	className="input100 w-100 border5px ps-3 border-0 colorblue"
																	type="text"
																	placeholder="Coupon Code"
																	value={
																		mycoupon
																	}
																	onChange={(
																		e
																	) => {
																		setMyCoupon(
																			e
																				.target
																				.value
																		);
																	}}
																	required
																/>
															</div>
															<div className="col-lg-3 col-5">
																<button
																	className="mybtnsame fontsize16 w-100 h-100 bglightblue colorblue bgyellow border5px border-0 text-uppercase"
																	onClick={(
																		e
																	) => {
																		CouponValidity(
																			e
																		);
																	}}
																	disabled={
																		loading
																			? true
																			: false
																	}
																>
																	{loading ? (
																		<DataLoader2 />
																	) : (
																		"Apply"
																	)}
																</button>
															</div>
														</div>
													</form>
												</div>
											</div>
											<button
												className="mt-2 mybtnsame fontsize16 w-100 bglightblue colorblue bgyellow border5px border-0 text-uppercase"
												onClick={showRazorpay}
											>
												PAY
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				</Base>
			</>
		) : (
			redirect("")
		)
	) : (
		redirect("/profile/account")
	);
};
export default Checkout;
