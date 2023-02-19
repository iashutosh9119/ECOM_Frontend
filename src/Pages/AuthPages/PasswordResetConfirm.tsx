import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useHistory, useLocation } from "react-router";
import CSRFToken from "../../CSRFToken";
import { toast } from "react-toastify";
import { PasswordResetConfirm_API } from "../../backend";
import Base from "../../Base";
import { Helmet } from "react-helmet-async";
import DataLoader2 from "../../Components/DataLoaders/DataLoader2";
import Breadcrumb from "../../Components/Breadcrumb";
import { BaseContext } from "../../Context";
const PasswordResetConfirm = () => {
	const location = useLocation();
	const [password1, setpassword1] = useState("");
	const [password2, setpassword2] = useState("");
	const { handleNotification } = useContext(BaseContext);
	const history = useHistory();
	const [loading, setLoading] = useState(false);
	const passwordResetConfirm = async (e) => {
		e.preventDefault();
		return await fetch(PasswordResetConfirm_API, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				new_password1: password1,
				new_password2: password2,
				uid: location.pathname.split("/")[5].split("-")[0],
				token: `${location.pathname.split("/")[5].split("-")[1]}-${location.pathname.split("/")[5].split("-")[2]}`,
			}),
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				if (data?.detail) {
					setLoading(false);
					history.push("/signin");
					handleNotification(data.detail, "success");
				} else {
					setLoading(false);
					if (data?.new_password1?.[0]) {
						return toast(`password: ${data.new_password1[0]}`, {
							type: "error",
							autoClose: 5000,
							position: "bottom-center",
							hideProgressBar: false,
							pauseOnHover: true,
							pauseOnFocusLoss: true,
						});
					}
					if (data?.new_password2?.[0]) {
						return toast(`${data.new_password2[0]}`, {
							type: "error",
							autoClose: 5000,
							position: "bottom-center",
							hideProgressBar: false,
							pauseOnHover: true,
							pauseOnFocusLoss: true,
						});
					}
					if (data?.token?.[0] === "Invalid value") {
						return toast("Password reset link might have been expired.", {
							type: "warning",
							autoClose: 5000,
							position: "bottom-center",
							hideProgressBar: false,
							pauseOnHover: true,
							pauseOnFocusLoss: true,
						});
					}
				}
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};
	const [changeImage, setChangeImage] = useState(false);
	const handleChangeImage = () => {
		setChangeImage(!changeImage);
	};
	const [showPassword1, setShowPassword1] = useState(false);
	const seePassword1 = () => {
		setShowPassword1(!showPassword1);
	};
	const [showPassword2, setShowPassword2] = useState(false);
	const seePassword2 = () => {
		setShowPassword2(!showPassword2);
	};
	return (
		<>
			<Helmet>
				<title>Kirana For Home | Password Reset Confirm</title>
			</Helmet>
			<Base>
				<Breadcrumb title="Password Reset Confirm" />
				<section className="section">
					<div className="container">
						<div className="row align-items-center">
							<div className="col-lg-6 col-md-6" onMouseEnter={handleChangeImage} onMouseLeave={handleChangeImage}>
								<div className="me-lg-5 mb-5 mb-lg-0">
									<img src={changeImage ? "images/Password_Reset_Yellow.svg" : "images/Password_Reset_LightBlue.svg"} className="loginsvg" alt="Reset_Password_Confirm" />
								</div>
							</div>
							<div className="col-lg-6 col-md-6">
								<div className="card mx-2 bgcolorgreyish border-0 border5px p-4">
									<div className="card-body">
										<h2 className="card-title colorblue pb-2 text-center">Reset Password</h2>
										<form className="mt-2">
											<CSRFToken />
											<div className="row">
												<div className="col-lg-12">
													<p className="colorblue text-center">Please enter your new password.</p>
													<div className="position-relative mb-4">
														<input
															className="input100 w-100 border5px border-0 colorblue"
															type={showPassword1 ? "text" : "password"}
															placeholder="New Password"
															value={password1}
															onChange={(e) => {
																setpassword1(e.target.value);
															}}
															required
														/>
														<span className="focus-input100" />
														<span className="symbol-input100 d-flex align-items-center position-absolute colorblue h-100">
															<span>
																<i className="fas fa-lock" />
															</span>
														</span>
														<span onClick={seePassword1} className="symbol-input1000 d-flex align-items-center position-absolute colorblue h-100">
															<span>
																<i className={showPassword1 ? "far fa-eye-slash" : "far fa-eye"} />
															</span>
														</span>
													</div>
													<div className="position-relative mb-4">
														<input
															className="input100 w-100 border5px border-0 colorblue"
															type={showPassword2 ? "text" : "password"}
															placeholder="Confirm New Password"
															value={password2}
															onChange={(e) => {
																setpassword2(e.target.value);
															}}
															required
														/>
														<span className="focus-input100" />
														<span className="symbol-input100 d-flex align-items-center position-absolute colorblue h-100">
															<span>
																<i className="fas fa-lock" />
															</span>
														</span>
														<span onClick={seePassword2} className="symbol-input1000 d-flex align-items-center position-absolute colorblue h-100">
															<span>
																<i className={showPassword2 ? "far fa-eye-slash" : "far fa-eye"} />
															</span>
														</span>
													</div>
												</div>
												<div className="col-lg-12 mb-0">
													<div className="d-grid">
														<button
															onClick={(e) => {
																setLoading(true);
																passwordResetConfirm(e);
															}}
															className="mybtnsame fontsize16 bglightblue colorblue bgyellow border5px border-0 text-uppercase d-inline-block"
															disabled={loading ? true : false}
														>
															{loading ? <DataLoader2 loaderSize={15} loaderType="ScaleLoader" loaderColor="#00214d" /> : "Confirm"}
														</button>
													</div>
												</div>
												<div className="col-12 text-center">
													<p className="mb-0 mt-4 fontsize14">
														<span className="colorblue me-2">Remember your password ?</span>
														<Link to="/signin" className="colorblue lightbluehover cursorpointer">
															Sign in
														</Link>
													</p>
												</div>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</Base>
		</>
	);
};
export default PasswordResetConfirm;
