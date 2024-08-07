import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "../Components/Breadcrumb";
import Base from "../Base";
import { Helmet } from "react-helmet-async";
import { verifyEmailInSignUp } from "../APIs/user/user";
import { toast } from "react-toastify";

export default function VerifyEmail(): JSX.Element {
	const location = useLocation();
	const navigate = useNavigate();
	const verifyEmail = async (e: any) => {
		e.preventDefault();
		await verifyEmailInSignUp({
			key: location.pathname.split("/")[3],
		}).then((data) => {
			if (data?.detail === "ok") {
				localStorage.removeItem("emailV");
				navigate("/signin");
				toast.success("Email Verified!");
			}
		});
	};
	const [changeImage, setChangeImage] = useState(false);
	const handleChangeImage = () => {
		setChangeImage(!changeImage);
	};
	return (
		<>
			<Helmet>
				<title>MeeMo Kidz | Confirm Email</title>
			</Helmet>
			<Base>
				<Breadcrumb title="Confirm E-Mail Address" />
				<div className="container" style={{ width: "350px" }}>
					<form
						className="bgcolorgreyish border-0 border5px my-4 p-4"
						onMouseEnter={handleChangeImage}
						onMouseLeave={handleChangeImage}
					>
						<div className="text-center w-100 mb-4">
							<img
								src={
									changeImage
										? "images/Verify_Email_Yellow.svg"
										: "images/Verify_Email_LightBlue.svg"
								}
								alt="Verify_Email"
								className="ps-3 loginsvg"
								height="200px"
							/>
						</div>
						<div className="text-center w-100">
							<p className="colorblue mb-4">
								Please confirm your e-mail address by clicking on the button
								below.
							</p>
						</div>
						<div className="text-center mt-2">
							<button
								onClick={verifyEmail}
								className="mybtnsame bglightblue colorblue bgyellow border5px border-0 text-uppercase d-inline-block"
							>
								Confirm
							</button>
						</div>
					</form>
				</div>
			</Base>
		</>
	);
}
