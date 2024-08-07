import { useEffect, useState } from "react";
import Base from "../Base";
import ReactImageMagnify from "react-image-magnify";
import { Helmet } from "react-helmet-async";
import { singleProduct } from "../APIs/ecommerce/ecommerce";
import { useLocation, useParams } from "react-router-dom";
import {
	FacebookShareButton,
	LinkedinShareButton,
	TelegramShareButton,
	TwitterShareButton,
	WhatsappShareButton,
} from "react-share";
import {
	deleteReview,
	updateReview,
	reviewRating,
} from "../APIs/ecommerce/ecommerce";
import tempImg from "../Assets/Product_3.webp";
import tempImg1 from "../Assets/User_Image.webp";
import { toast } from "react-toastify";
import DataLoader from "../Components/DataLoader";
import DataLoader2 from "../Components/DataLoader2";
import { useSelector } from "react-redux";
import { Store } from "../Interfaces/Store";
import { addProductInCart } from "../Data/storingData";
import { insertStars, isProductInCart } from "../Utilities/Utils";
import {
	Product,
	Product_Category,
	Product_Images,
	Product_Reviews,
} from "../Interfaces/Products";
import {
	AddToCartButtonForProductSingle,
	ViewCartButtonForProductSingle,
} from "../Components/ActionButtons";
import { WishlistButtonForProductSingle } from "../Components/WishlistButtons";

export default function ProductSingle(): JSX.Element {
	const location = useLocation();
	const { guid } = useParams();
	const userId = useSelector((state: Store) => state.userProfile.id);
	const cartItems = useSelector((state: Store) => state.cart[userId]);
	const wishlistItems = useSelector((state: Store) => state.wishlist[userId]);
	const [plusMinus, setPlusMinus] = useState(1);
	const [animateButton, setAnimateButton] = useState(false);
	const [changeImage, setChangeImage] = useState(false);
	const [loading, setLoading] = useState(true);
	const [currentImage, setCurrentImage] = useState(0);
	const [target, setTarget] = useState(-1);
	const [review, setReview] = useState("");
	const [rating, setRating] = useState(-1);
	const [productData, setProductData] = useState<Product>();
	const [dataLoading, setDataLoading] = useState(false);
	const [userReview, setUserReview] = useState<Product_Reviews>({
		guid: "",
		id: -1,
		rating: -1,
		review: "",
		user_dp: "",
		user_id: -1,
		user_name: "",
	});
	useEffect(() => {
		const getSingleProduct = async () => {
			await singleProduct({ guid }).then((data: Product) => {
				setProductData(data);
				setUserReview(
					data.Product_Reviews.find(
						(data: Product_Reviews) => data.user_id === userId
					) || {
						guid: "",
						id: -1,
						rating: -1,
						review: "",
						user_dp: "",
						user_id: -1,
						user_name: "",
					}
				);
				setLoading(false);
			});
		};
		getSingleProduct();
	}, []);
	const addReviewRating = async (e: any) => {
		setDataLoading(true);
		e.preventDefault();
		await reviewRating({
			guid: productData?.guid!,
			rating,
			review,
		}).then((data) => {
			if (data.id !== null) {
				let arr = productData?.Product_Reviews;
				arr?.push({
					guid: productData?.guid!,
					id: data.id,
					rating: data.rating,
					review: data.review,
					user_id: data.user_id,
					user_dp: data.user_dp,
					user_name: data.user_name,
				});
				setUserReview({
					guid: productData?.guid!,
					id: data.id,
					rating: data.rating,
					review: data.review,
					user_id: data.user_id,
					user_dp: data.user_dp,
					user_name: data.user_name,
				});
				setProductData({
					...productData!,
					Product_Reviews: arr!,
				});
				setDataLoading(false);
				return toast.success("Review Posted Successfully!");
			} else {
				setDataLoading(false);
				return toast.error("Cannot add review currently!");
			}
		});
	};
	const updateReviewRating = async (e: any, id: any) => {
		setDataLoading(true);
		e.preventDefault();
		await updateReview({ id, rating, review }).then((data) => {
			if (data.id !== null) {
				setProductData({
					...productData!,
					Product_Reviews: productData?.Product_Reviews?.map((data) => {
						if (data.id === id) {
							return {
								id: data.id,
								rating: rating,
								review: review,
								guid: data.guid,
								user_id: data.user_id,
								user_dp: data.user_dp,
								user_name: data.user_name,
							};
						} else return data;
					})!,
				});
				setDataLoading(false);
				return toast.success("Review Updated Successfully!");
			} else {
				setDataLoading(false);
				return toast.error("Cannot update review currently!");
			}
		});
	};
	const deleteReviewRating = async (e: any, id: any) => {
		setDataLoading(true);
		e.preventDefault();
		await deleteReview({ id }).then((data) => {
			if (data.id === null) {
				setProductData({
					...productData!,
					Product_Reviews: productData?.Product_Reviews.filter(
						(item: Product_Reviews) => item.id !== id
					)!,
				});
				setDataLoading(false);
				setRating(-1);
				setReview("");
				setUserReview({
					guid: "",
					id: -1,
					rating: -1,
					review: "",
					user_dp: "",
					user_id: -1,
					user_name: "",
				});
				return toast.success("Review Deleted Successfully!");
			} else {
				setDataLoading(false);
				return toast.error("Cannot delete review currently!");
			}
		});
	};
	useEffect(() => {
		const timer = setTimeout(() => setAnimateButton(false), 1000);
		return () => {
			clearTimeout(timer);
		};
	}, [animateButton]);
	return (
		<>
			<Helmet title={`MeeMo Kidz | ${productData?.Product_Name}`}></Helmet>
			<Base>
				{loading ? (
					<DataLoader />
				) : (
					<section className="section">
						<div className="container">
							<div className="row">
								<div className="col-lg-6">
									<div className="mb-3 card border-0 shadow">
										{productData?.Product_Images?.length ? (
											<ReactImageMagnify
												{...{
													enlargedImagePosition: "over",
													imageClassName: "border5px w-50 ml-image",
													enlargedImageContainerClassName: "border5px",
													pressDuration: 250,
													smallImage: {
														isFluidWidth: true,
														src: `${productData?.Product_Images?.[currentImage]?.dbImage}`,
													},
													largeImage: {
														src: `${productData?.Product_Images?.[currentImage]?.dbImage}`,
														width: 600,
														height: 900,
													},
												}}
											/>
										) : (
											<img height="400px" alt="Product_Image" src={tempImg} />
										)}
										<span
											className="d-flex justify-content-center align-items-center"
											id="mydiscountpersin"
										>
											{Math.abs(
												parseInt(productData?.Product_Discount?.toString()!) -
													parseFloat(productData?.Product_Discount?.toString()!)
											) > 0.5
												? parseInt(productData?.Product_Discount?.toString()!) +
												  1
												: parseInt(productData?.Product_Discount?.toString()!)}
											%
										</span>
										<WishlistButtonForProductSingle
											guid={guid || ""}
											wishlistItems={wishlistItems}
										/>
									</div>
									<div className="row" style={{ overflow: "scroll" }}>
										{productData?.Product_Images?.slice(0, 4).map(
											(item: Product_Images, index: number) => {
												return (
													<>
														{item ===
														productData?.Product_Images?.slice(-1)[0] ? (
															<div key={index} className="col-3">
																<img
																	className="border5px h-100 w-100 shadow cursorpointer"
																	onClick={() => setCurrentImage(index)}
																	src={`${item?.dbImage || tempImg}`}
																	alt=""
																/>
															</div>
														) : (
															<div key={index} className="col-3">
																<img
																	className="border5px h-100 w-100 shadow cursorpointer"
																	onClick={() => setCurrentImage(index)}
																	src={`${item?.dbImage || tempImg}`}
																	alt=""
																/>
															</div>
														)}
													</>
												);
											}
										)}
										<div className="col-3">
											{productData?.Product_Video && (
												<iframe
													src={`https://www.youtube.com/embed/${productData?.Product_Video.slice(
														17,
														productData?.Product_Video.length
													)}`}
													title="YouTube video player"
													allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
													allowFullScreen
												/>
											)}
										</div>
									</div>
								</div>
								<div className="col-lg-6 ps-lg-4">
									<h1 className="colorblue mb-2 mt-3 mt-lg-0 text-center fw-bold text-lg-start">
										{productData?.Product_Name}
									</h1>
									<ul className="list-unstyled text-center text-lg-start coloryellow mb-3">
										{insertStars(
											Math.abs(
												parseInt(productData?.Product_Rating.toFixed()!) -
													parseFloat(productData?.Product_Rating.toFixed(2)!)
											) > 0.5
												? productData?.Product_Rating! + 1
												: productData?.Product_Rating!,
											"showStars1"
										)}
									</ul>
									<p className="mb-3 text-center text-lg-start">
										<span
											className="colorblue fw-bold"
											style={{ fontSize: 28 }}
										>
											₹ {productData?.Product_SellingPrice}
										</span>
										&nbsp;&nbsp;
										<span className="fontsize16 notaccepted text-decoration-line-through">
											₹ {productData?.Product_MRP}
										</span>
									</p>
									<div className="row">
										{!isProductInCart(cartItems, productData?.guid!) ? (
											<>
												<div className="col d-flex justify-content-center align-items-center">
													<button
														className="h-100 w-75 colorblue fontsize16 border-0 border5px bgyellow bglightblue"
														onClick={() =>
															plusMinus > 1 && setPlusMinus(plusMinus - 1)
														}
													>
														<i className="fas fa-minus" />
													</button>
													<input
														className="bgcolorgreyish text-center fontsize16 colorblue h-100 w-75 border-0 border5px mx-2"
														type="number"
														value={plusMinus}
														onChange={(
															e: React.ChangeEvent<HTMLInputElement>
														) => {
															setPlusMinus(e.target.valueAsNumber);
														}}
													/>
													<button
														className="h-100 w-75 colorblue fontsize16 border-0 border5px bgyellow bglightblue"
														onClick={() => setPlusMinus(plusMinus + 1)}
													>
														<i className="fas fa-plus" />
													</button>
												</div>
												<div className="col d-flex align-items-center">
													<AddToCartButtonForProductSingle
														isAuthenticated={userId !== -1 ? true : false}
														animateButton={animateButton}
														plusMinus={plusMinus}
														setAnimateButton={setAnimateButton}
														product={productData}
														addProductInCart={addProductInCart}
													/>
												</div>
											</>
										) : (
											<div className="col d-flex align-items-center">
												<ViewCartButtonForProductSingle />
											</div>
										)}
									</div>
									<ul className="fontsize16 mb-2 mt-4 list-unstyled text-start">
										<li
											className="my-1"
											style={{
												borderBottom: "2.5px dotted #ebebeb",
											}}
										>
											<span className="fw-bold colorblue">SKU :</span>
											<span className="colorlightblue">
												&nbsp;&nbsp;&nbsp;
												{productData?.Product_ID}
											</span>
										</li>
										<li
											className="my-1"
											style={{
												borderBottom: "2.5px dotted #ebebeb",
											}}
										>
											<span className="fw-bold colorblue">Brand :</span>
											<span className="colorlightblue">
												&nbsp;&nbsp;&nbsp;
												{productData?.Product_Brand}
											</span>
										</li>
										<li
											className="my-1"
											style={{
												borderBottom: "2.5px dotted #ebebeb",
											}}
										>
											<span className="fw-bold colorblue">Category :</span>
											<span className="colorlightblue">
												&nbsp;&nbsp;&nbsp;
												{productData?.Product_Category.map(
													(data: Product_Category, index: number) => {
														return index ===
															productData.Product_Category.length - 1
															? `${data.category}`
															: `${data.category}, `;
													}
												)}
											</span>
										</li>
										<li
											className="my-1"
											style={{
												borderBottom: "2.5px dotted #ebebeb",
											}}
										>
											<span className="fw-bold colorblue">Contents :</span>
											<span className="colorlightblue">
												&nbsp;&nbsp;&nbsp;
												{productData?.Product_Contents}
											</span>
										</li>
										<li className="mt-3 mt-lg-2 text-center">
											<WhatsappShareButton
												className="me-3 hvr-icon-float"
												url={`https://www.meemokidz.com${location.pathname}`}
											>
												<img
													className="hvr-icon"
													height="25px"
													alt="WhatsApp"
													src="images/Logo/WA_Logo.svg"
												/>
											</WhatsappShareButton>
											<FacebookShareButton
												className="me-3 hvr-icon-float"
												url={`https://www.meemokidz.com${location.pathname}`}
											>
												<img
													className="hvr-icon"
													height="25px"
													alt="Facebook"
													src="images/Logo/FB_Logo.svg"
												/>
											</FacebookShareButton>
											<TelegramShareButton
												className="me-3 hvr-icon-float"
												url={`https://www.meemokidz.com${location.pathname}`}
											>
												<img
													className="hvr-icon"
													height="25px"
													alt="Telegram"
													src="images/Logo/Telegram.svg"
												/>
											</TelegramShareButton>
											<TwitterShareButton
												className="me-3 hvr-icon-float"
												url={`https://www.meemokidz.com${location.pathname}`}
											>
												<img
													className="hvr-icon"
													height="25px"
													alt="Twitter"
													src="images/Logo/Twitter.svg"
												/>
											</TwitterShareButton>
											<LinkedinShareButton
												className="hvr-icon-float"
												url={`https://www.meemokidz.com${location.pathname}`}
											>
												<img
													className="hvr-icon"
													height="25px"
													alt="LinkedIn"
													src="images/Logo/LinkedIn.svg"
												/>
											</LinkedinShareButton>
										</li>
									</ul>
								</div>
							</div>
							<div className="row">
								<div className="col-lg-12 mt-3">
									<ul
										className="nav d-flex justify-content-center nav-pills mb-3"
										id="pills-tab"
										style={{
											borderBottom: "2.5px dotted #ebebeb",
										}}
										role="tablist"
									>
										<li className="nav-item" role="presentation">
											<button
												className="nav-link fontsize16 mybtnsame lightbluehover colorblue bgcolorwhite text-uppercase active"
												id="pills-description-tab"
												data-bs-toggle="pill"
												data-bs-target="#pills-description"
												type="button"
												role="tab"
												aria-controls="pills-description"
												aria-selected="true"
												style={{
													border: "2.5px",
													borderRadius: "0px",
													borderRight: "2.5px dotted #ebebeb",
												}}
											>
												Description
											</button>
										</li>
										<li className="nav-item" role="presentation">
											<button
												className="nav-link fontsize16 mybtnsame lightbluehover colorblue bgcolorwhite text-uppercase"
												id="pills-Reviews-tab"
												data-bs-toggle="pill"
												data-bs-target="#pills-Reviews"
												type="button"
												role="tab"
												aria-controls="pills-Reviews"
												aria-selected="false"
												style={{
													border: "2.5px",
													borderRadius: "0px",
													borderRight: "2.5px dotted #ebebeb",
												}}
											>
												Reviews
											</button>
										</li>
										<li className="nav-item" role="presentation">
											<button
												className="nav-link fontsize16 mybtnsame lightbluehover colorblue bgcolorwhite text-uppercase"
												id={
													userReview.id !== -1
														? "pills-editreview-tab"
														: "pills-addareview-tab"
												}
												data-bs-toggle="pill"
												data-bs-target={
													userReview.id !== -1
														? "#pills-editreview"
														: "#pills-addareview"
												}
												type="button"
												role="tab"
												aria-controls={
													userReview.id !== -1
														? "pills-editreview"
														: "pills-addareview"
												}
												aria-selected="false"
											>
												{userReview.id !== -1 ? "Edit Review" : "Add Review"}
											</button>
										</li>
									</ul>
									<div className="tab-content" id="pills-tabContent">
										<div
											className="tab-pane fade show mypara text-center active"
											id="pills-description"
											role="tabpanel"
											aria-labelledby="pills-description-tab"
										>
											{productData?.Product_Description ? (
												<p>{productData?.Product_Description}</p>
											) : (
												<h2 className="colorblue pt-3 text-center">
													No description added by the administrator!
												</h2>
											)}
										</div>
										<div
											className="tab-pane fade"
											id="pills-Reviews"
											role="tabpanel"
											aria-labelledby="pills-Reviews-tab"
											onMouseEnter={(e) => setChangeImage(!changeImage)}
											onMouseLeave={(e) => setChangeImage(!changeImage)}
										>
											{productData?.Product_Reviews?.length! > 0 ? (
												productData?.Product_Reviews?.sort(
													(a: Product_Reviews, b: Product_Reviews) =>
														b.rating - a.rating
												).map((review: Product_Reviews, index: number) => {
													return (
														<div key={index} className="row my-4">
															<div className="col-12">
																<div className="teacher d-flex justify-content-end align-items-center">
																	<img
																		src={review.user_dp || tempImg1}
																		className="avatar-md-lg rounded-circle shadow"
																		alt=""
																	/>
																	<div className="ms-3 flex-grow-1">
																		<h6 className="mb-1">
																			<p className="mb-0 d-flex align-items-center colorblue">
																				{review.user_name.trim()
																					? review.user_name
																					: "Anonymous"}
																				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
																				{insertStars(
																					review?.rating,
																					"showStarsForRating"
																				)}
																			</p>
																		</h6>
																		<p className="colorblue mb-0 mypara">
																			{review?.review}
																		</p>
																	</div>
																	{userReview.id === review.id && (
																		<button
																			disabled={dataLoading}
																			onClick={(e) => {
																				deleteReviewRating(e, review.id);
																			}}
																			className="ms-2 colorblue border-0 border5px bgyellow bglightblue"
																			style={{
																				width: 35,
																				height: 35,
																			}}
																		>
																			<i className="fas fa-times" />
																		</button>
																	)}
																</div>
															</div>
														</div>
													);
												})
											) : (
												<div className="row mt-5">
													<div className="col-lg-12 text-center">
														<img
															width="250px"
															src={
																changeImage
																	? "images/No_Reviews_Yellow.svg"
																	: "images/No_Reviews_LightBlue.svg"
															}
															className="loginsvg"
															alt=""
														/>
														<h3 className="mt-4 pt-3 text-center colorblue letterspacing1">
															There are no reviews to show as of now!
														</h3>
													</div>
												</div>
											)}
										</div>
										<div
											className="tab-pane fade"
											id={
												userReview.id !== -1
													? "pills-editreview"
													: "pills-addareview"
											}
											role="tabpanel"
											aria-labelledby={
												userReview.id !== -1
													? "pills-editreview-tab"
													: "pills-addareview-tab"
											}
										>
											<section className="feedback">
												<div className="row align-items-center">
													<div className="col-lg-12">
														<div className="card bgcolorgreyish border-0 border5px p-4">
															<form className="">
																<div className="row">
																	<div className="col-lg-12">
																		<div className="position-relative mb-4">
																			<h5 className="colorblue">Your Rating</h5>
																			{[1, 2, 3, 4, 5].map(
																				(val: any, index: any) => {
																					return (
																						<div className="d-flex align-items-center">
																							<input
																								className="d-none"
																								type="radio"
																								name="star_review"
																								id={`star${index + 1}`}
																								value={`${index + 1}`}
																								onChange={(e: any) => {
																									setRating(e.target.value);
																								}}
																								style={{
																									margin: "3px 3px 0px 5px",
																								}}
																								required
																							/>
																							<label
																								className="yellowhover hvr-icon-grow"
																								onClick={() => {
																									setTarget(index);
																								}}
																								htmlFor={`star${index + 1}`}
																							>
																								{insertStars(
																									index + 1,
																									"showStarsForRatingForm",
																									index,
																									target
																								)}
																							</label>
																						</div>
																					);
																				}
																			)}
																			<p className="mt-2">
																				{userReview.rating !== -1 &&
																					`Previous Rating - ${userReview.rating}`}
																			</p>
																		</div>
																	</div>
																	<div className="col-lg-12">
																		<div className="position-relative mb-4">
																			<textarea
																				className="colorblue bgcolorwhite p-3 border5px border-0 w-100"
																				style={{
																					height: "150px",
																					resize: "none",
																				}}
																				placeholder="Your review"
																				value={review}
																				onChange={(e) => {
																					setReview(e.target.value);
																				}}
																				required
																			/>
																		</div>
																	</div>
																	<div className="col-lg-12">
																		<div className="d-grid">
																			<button
																				className="mybtnsame bglightblue colorblue bgyellow border5px border-0 text-uppercase d-inline-block"
																				style={{
																					fontSize: "25px",
																				}}
																				type="submit"
																				onClick={(e) => {
																					userReview.id !== -1
																						? updateReviewRating(
																								e,
																								userReview.id
																						  )
																						: addReviewRating(e);
																				}}
																				disabled={dataLoading}
																			>
																				{dataLoading ? (
																					<DataLoader2 />
																				) : (
																					"Submit"
																				)}
																			</button>
																		</div>
																	</div>
																</div>
															</form>
														</div>
													</div>
												</div>
											</section>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				)}
			</Base>
		</>
	);
}
