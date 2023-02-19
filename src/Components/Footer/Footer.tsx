import { Link } from "react-router-dom";
import { useState } from "react";
import "hover.css";
import CSRFToken from "../../CSRFToken";
import { emailSubscriber } from "../../helpers/others/emailSubscription";
import { toast } from "react-toastify";
const Footer = () => {
	const [email, setEmail] = useState("");
	const subscribe = async (e) => {
		e.preventDefault();
		if (email.includes("@")) {
			await emailSubscriber({ email: email.toLowerCase() }).then((data) => {
				setEmail("");
				return toast("Subscription Added", { type: "success", autoClose: 5000, position: "bottom-center", hideProgressBar: false, pauseOnHover: true, pauseOnFocusLoss: true });
			});
		} else {
			return toast("You have not entered an email.", { type: "error", autoClose: 5000, position: "bottom-center", hideProgressBar: false, pauseOnHover: true, pauseOnFocusLoss: true });
		}
	};
	return (
		<>
			<footer className="bgcolordarkblue overflow-hidden" style={{ zIndex: 99999 }}>
				<div className="container">
					<div className="row py-4 pb-md-0">
						<div className="col-md text-md-start text-center px-1">
							<h4 className="my-4 colorwhite letterspacing1 text-uppercase">Explore</h4>
							<ul className="list-unstyled">
								<li className="my-2">
									<Link className="lightbluehover letterspacing1 coloryellow fontsize14" to="/aboutus">
										About Us
									</Link>
								</li>
								<li className="my-2">
									<Link className="lightbluehover letterspacing1 coloryellow fontsize14" to="/aboutus#ourteam">
										Our Team
									</Link>
								</li>
								<li className="my-2">
									<Link className="lightbluehover letterspacing1 coloryellow fontsize14" to="/testimonials">
										Testimonials
									</Link>
								</li>
								<li className="hvr-icon-float d-inline-block" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
									<a href="https://www.facebook.com/kiranaforhome/" rel="noopener noreferrer" target="_blank">
										<img className="hvr-icon" height="20px" alt="Facebook" src="images/Logo/FB_Logo.svg" />
									</a>
								</li>
								<li className="ms-2 hvr-icon-float d-inline-block" data-aos="fade-up" data-aos-anchor-placement="top-bottom" data-aos-delay={100}>
									<a href="https://wa.me/+918130626971" rel="noopener noreferrer" target="_blank">
										<img className="hvr-icon" height="20px" alt="WhatsApp" src="images/Logo/WA_Logo.svg" />
									</a>
								</li>
								<li className="ms-2 hvr-icon-float d-inline-block" data-aos="fade-up" data-aos-anchor-placement="top-bottom" data-aos-delay={400}>
									<a href="https://www.instagram.com/kiranaforhome/" rel="noopener noreferrer" target="_blank">
										<img className="hvr-icon" height="20px" alt="Instagram" src="images/Logo/Instagram_Logo.svg" />
									</a>
								</li>
							</ul>
						</div>
						<div className="col-md text-md-start text-center px-1">
							<h4 className="my-4 colorwhite letterspacing1 text-uppercase">Need Help</h4>
							<ul className="list-unstyled">
								<li className="my-2">
									<Link className="lightbluehover letterspacing1 coloryellow fontsize14" to="/contactus">
										Contact Us
									</Link>
								</li>
								<li className="my-2">
									<Link className="lightbluehover letterspacing1 coloryellow fontsize14" to="/policiesandfaqs">
										Policies & FAQs
									</Link>
								</li>
								<li className="my-2">
									<Link className="lightbluehover letterspacing1 coloryellow fontsize14" to="/reportabug">
										Report A Bug
									</Link>
								</li>
								<li className="my-2">
									<Link className="lightbluehover letterspacing1 coloryellow fontsize14" to="/feedback">
										Feedback
									</Link>
								</li>
							</ul>
						</div>
						<div className="col-md text-md-start text-center px-1">
							<h4 className="my-4 colorwhite letterspacing1 text-uppercase">Subscribe</h4>
							<form action="#">
								<CSRFToken />
								<div className="d-flex justify-content-between mx-3 mx-lg-0">
									<input
										className="input100 fontsize14 px-3 w-100 border5px border-0 colorblue me-2"
										type="email"
										placeholder="Email"
										value={email.toLowerCase()}
										onChange={(e) => {
											setEmail(e.target.value);
										}}
									/>
									<button
										onClick={(e) => {
											subscribe(e);
										}}
										className="bglightblue bgyellow fontsize14 colorblue text-uppercase border5px border-0"
										type="submit"
									>
										Subscribe
									</button>
								</div>
							</form>
							<p className="mt-3 mb-2 letterspacing1 coloryellow fontsize14">WE ACCEPT PAYMENTS FROM</p>
							<ul className="list-unstyled d-flex justify-content-md-start justify-content-center mb-0">
								<li className="hvr-icon-float" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
									<img className="hvr-icon" src="images/Logo/Visa_Logo.svg" width="30px" alt="Visa_Logo" />
								</li>
								<li className="hvr-icon-float" data-aos="fade-up" data-aos-anchor-placement="top-bottom" data-aos-delay={100}>
									<img className="ms-2 hvr-icon" src="images/Logo/Mastercard_Logo.svg" width="30px" alt="Mastercard_Logo" />
								</li>
								<li className="hvr-icon-float" data-aos="fade-up" data-aos-anchor-placement="top-bottom" data-aos-delay={200}>
									<img className="ms-2 hvr-icon" src="images/Logo/Amex_Logo.svg" width="30px" alt="Amex_Logo" />
								</li>
								<li className="hvr-icon-float" data-aos="fade-up" data-aos-anchor-placement="top-bottom" data-aos-delay={300}>
									<img className="ms-2 hvr-icon" src="images/Logo/Maestro_Logo.svg" width="30px" alt="Maestro_Logo" />
								</li>
								<li className="hvr-icon-float" data-aos="fade-up" data-aos-anchor-placement="top-bottom" data-aos-delay={400}>
									<img className="ms-2 hvr-icon" src="images/Logo/Rupay_Logo.svg" width="30px" alt="Rupay_Logo" />
								</li>
								<li className="hvr-icon-float" data-aos="fade-up" data-aos-anchor-placement="top-bottom" data-aos-delay={500}>
									<img className="ms-2 hvr-icon" src="images/Logo/UPI_Logo_Small.svg" width="30px" alt="UPI_Logo_Small" />
								</li>
							</ul>
						</div>
					</div>
					<div className="row pb-2 fontsize14">
						<div className="col text-center">
							<p className="m-0 letterspacing1 coloryellow">
								Copyright © 2021 <b>Manglam Traders</b> | All Rights Reserved | Designed by&nbsp;
								<a className="lightbluehover letterspacing1 coloryellow" href="https://www.tristack.tech" rel="noopener noreferrer" target="_blank">
									<b>triStack.tech</b>
								</a>
							</p>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
};
export default Footer;
