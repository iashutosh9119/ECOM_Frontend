import TestimonialsCard from "./TestimonialsCard";
import Slider from "react-slick";
import { testimonialData } from "../APIs/misc/misc";
import { useState, useEffect } from "react";
import { Testimonials } from "../Interfaces/Misc";

export default function TestimonialsList(): JSX.Element {
	const [allTestimonials, setAllTestimonials] = useState<Testimonials[]>([]);
	var settings = {
		dots: true,
		dotsClass: "d-flex mb-0 mt-3 dotcss list-unstyled justify-content-center",
		arrows: false,
		infinite: false,
		speed: 500,
		autoplay: true,
		slidesToShow: 3,
		slidesToScroll: 1,
		pauseOnHover: true,
		pauseOnDotsHover: true,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};
	useEffect(() => {
		const getTestimonial = async () => {
			await testimonialData().then((data: Testimonials[]) => {
				setAllTestimonials(data);
			});
		};
		getTestimonial();
	}, []);
	return (
		<section className="section bluebgrightinv pt-3 overflow-hidden">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-12">
						<div
							className="section-title mb-2"
							data-aos="zoom-in"
							data-aos-duration="1000"
							data-aos-once="true"
						>
							<h1 className="title text-center colorblue">Our Testimonials</h1>
						</div>
					</div>
				</div>
				<div className="row justify-content-center">
					<div className="col-lg-12 mt-4">
						<Slider {...settings}>
							{allTestimonials.map(
								(testimonial: Testimonials, index: number) => {
									return (
										<TestimonialsCard key={index} testimonial={testimonial} />
									);
								}
							)}
						</Slider>
					</div>
				</div>
			</div>
		</section>
	);
}
