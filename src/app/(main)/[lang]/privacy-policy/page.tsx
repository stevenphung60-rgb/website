import type { Metadata } from "next";
import type { Locale } from "src/lib/i18n/config";
import { generatePrivacyPolicyMetadata } from "src/lib/seo/metadata";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
	const { lang: locale } = await params;
	return generatePrivacyPolicyMetadata(locale);
}

const privacyPolicyText = {
	vi: {
		title: "Chính sách bảo mật",
		lastUpdated: "Cập nhật lần cuối: 30/09/2025",
		sections: [
			{
				title: "1. Giới thiệu",
				content: [
					'Công ty TNHH Nghiệp Hưng ("chúng tôi") cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng, đối tác và người dùng website. Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân của bạn.',
				],
			},
			{
				title: "2. Thông tin chúng tôi thu thập",
				content: ["Chúng tôi có thể thu thập các loại thông tin sau:"],
				list: [
					"Thông tin liên hệ: họ tên, email, số điện thoại, địa chỉ",
					"Thông tin doanh nghiệp: tên công ty, chức vụ, lĩnh vực hoạt động",
					"Thông tin kỹ thuật: địa chỉ IP, loại trình duyệt, thời gian truy cập",
					"Thông tin dự án: yêu cầu báo giá, thông số kỹ thuật, nhu cầu tư vấn",
				],
			},
			{
				title: "3. Cách chúng tôi sử dụng thông tin",
				content: ["Thông tin được thu thập có thể được sử dụng cho các mục đích sau:"],
				list: [
					"Cung cấp dịch vụ tư vấn và báo giá",
					"Liên hệ và hỗ trợ khách hàng",
					"Cải thiện chất lượng sản phẩm, dịch vụ và trải nghiệm website",
					"Gửi thông tin về sản phẩm, dịch vụ hoặc cập nhật mới khi phù hợp",
					"Tuân thủ các yêu cầu pháp lý hiện hành",
				],
			},
			{
				title: "4. Xác thực và đăng nhập",
				content: ["Khi bạn đăng nhập vào hệ thống quản trị thông qua Google OAuth:"],
				list: [
					"Chúng tôi chỉ truy cập các thông tin cơ bản của tài khoản Google như tên, email và ảnh đại diện",
					"Chúng tôi chỉ sử dụng các phạm vi quyền không nhạy cảm",
					"Chúng tôi không truy cập dữ liệu nhạy cảm hoặc riêng tư khác trong tài khoản Google của bạn",
					"Thông tin đăng nhập được mã hóa và bảo mật",
					"Bạn có thể thu hồi quyền truy cập bất kỳ lúc nào trong phần cài đặt tài khoản Google",
				],
			},
			{
				title: "5. Chia sẻ thông tin",
				content: [
					"Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba, ngoại trừ các trường hợp sau:",
				],
				list: [
					"Có sự đồng ý rõ ràng từ bạn",
					"Theo yêu cầu của pháp luật",
					"Chia sẻ với các đối tác tin cậy hỗ trợ cung cấp dịch vụ, với điều kiện các bên này phải tuân thủ nghĩa vụ bảo mật",
				],
			},
			{
				title: "6. Bảo mật thông tin",
				content: [
					"Chúng tôi áp dụng các biện pháp kỹ thuật và quản trị phù hợp nhằm bảo vệ thông tin cá nhân khỏi việc truy cập, sử dụng, tiết lộ, chỉnh sửa hoặc phá hủy trái phép.",
				],
			},
			{
				title: "7. Cookie và công nghệ theo dõi",
				content: [
					"Website của chúng tôi có thể sử dụng cookie để cải thiện trải nghiệm người dùng. Bạn có thể tắt cookie trong phần cài đặt trình duyệt, tuy nhiên điều này có thể ảnh hưởng đến một số chức năng của website.",
				],
			},
			{
				title: "8. Quyền của bạn",
				content: ["Bạn có các quyền sau đối với thông tin cá nhân của mình:"],
				list: [
					"Yêu cầu truy cập và xem thông tin cá nhân",
					"Yêu cầu chỉnh sửa thông tin chưa chính xác",
					"Yêu cầu xóa thông tin cá nhân",
					"Yêu cầu hạn chế việc xử lý thông tin",
					"Rút lại sự đồng ý trong các trường hợp áp dụng",
				],
			},
			{
				title: "9. Lưu trữ thông tin",
				content: [
					"Chúng tôi chỉ lưu trữ thông tin cá nhân trong thời gian cần thiết để thực hiện các mục đích đã nêu hoặc theo yêu cầu của pháp luật.",
				],
			},
			{
				title: "10. Thay đổi chính sách",
				content: [
					"Chúng tôi có thể cập nhật chính sách bảo mật này theo từng thời điểm. Mọi thay đổi sẽ được đăng tải trên website và có hiệu lực kể từ thời điểm đăng tải.",
				],
			},
			{
				title: "11. Liên hệ",
				content: [
					"Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này hoặc muốn thực hiện các quyền của mình, vui lòng liên hệ với chúng tôi:",
				],
			},
		],
		contact: {
			company: "Công ty TNHH Nghiệp Hưng",
			addressLabel: "Địa chỉ",
			address: "Cát Lái, TP. HCM",
			phoneLabel: "Điện thoại",
			phone: "0944111141",
			emailLabel: "Email",
			email: "info@nghiephung.vn",
		},
	},
	en: {
		title: "Privacy Policy",
		lastUpdated: "Last updated: Sep 30, 2025",
		sections: [
			{
				title: "1. Introduction",
				content: [
					'Nghiep Hung Co., Ltd. ("we", "our", "us") is committed to protecting the privacy and personal information of our customers, partners, and website users. This privacy policy describes how we collect, use, store, and protect your personal information.',
				],
			},
			{
				title: "2. Information We Collect",
				content: ["We may collect the following types of information:"],
				list: [
					"Contact information: name, email, phone number, address",
					"Business information: company name, position, industry",
					"Technical information: IP address, browser type, access time",
					"Project information: quote requests, technical specifications, consultation needs",
				],
			},
			{
				title: "3. How We Use Information",
				content: ["The collected information may be used for the following purposes:"],
				list: [
					"Provide consultation and quotation services",
					"Contact and support customers",
					"Improve product quality, service quality, and website experience",
					"Send information about products, services, or updates where appropriate",
					"Comply with applicable legal requirements",
				],
			},
			{
				title: "4. Authentication and Login",
				content: ["When you log into our admin system through Google OAuth:"],
				list: [
					"We only access basic Google account information such as name, email, and profile image",
					"We only use non-sensitive scopes",
					"We do not access other sensitive or private data in your Google account",
					"Login information is encrypted and secured",
					"You can revoke access at any time through your Google account settings",
				],
			},
			{
				title: "5. Information Sharing",
				content: [
					"We do not sell, rent, or share your personal information with third parties, except in the following cases:",
				],
				list: [
					"With your explicit consent",
					"As required by law",
					"With trusted partners who assist in providing services, provided that they are bound by confidentiality obligations",
				],
			},
			{
				title: "6. Information Security",
				content: [
					"We implement appropriate technical and administrative security measures to protect personal information from unauthorized access, use, disclosure, modification, or destruction.",
				],
			},
			{
				title: "7. Cookies and Tracking Technologies",
				content: [
					"Our website may use cookies to improve user experience. You can disable cookies in your browser settings; however, this may affect some website functionality.",
				],
			},
			{
				title: "8. Your Rights",
				content: ["You have the following rights regarding your personal information:"],
				list: [
					"Request access to and view your personal information",
					"Request correction of inaccurate information",
					"Request deletion of personal information",
					"Request restriction of information processing",
					"Withdraw consent where applicable",
				],
			},
			{
				title: "9. Information Storage",
				content: [
					"We only store personal information for as long as necessary to fulfill the stated purposes or as required by law.",
				],
			},
			{
				title: "10. Policy Changes",
				content: [
					"We may update this privacy policy from time to time. Any changes will be posted on the website and take effect immediately upon posting.",
				],
			},
			{
				title: "11. Contact",
				content: [
					"If you have any questions about this privacy policy or wish to exercise your rights, please contact us:",
				],
			},
		],
		contact: {
			company: "Nghiep Hung Co., Ltd.",
			addressLabel: "Address",
			address: "Cat Lai, Ho Chi Minh City",
			phoneLabel: "Phone",
			phone: "0944111141",
			emailLabel: "Email",
			email: "info@nghiephung.vn",
		},
	},
};

export default async function PrivacyPolicyPage({
	params,
}: {
	params: Promise<{ lang: Locale }>;
}) {
	const { lang: locale } = await params;
	const lang = locale === "en" ? "en" : "vi";
	const text = privacyPolicyText[lang];

	return (
		<main className="min-h-screen bg-[#F7F1E6] text-[#342312]">
			<section className="w-full border-b border-[#E7D0AF] bg-[#FAF7F0] px-4 py-14 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
				<div className="mx-auto max-w-5xl">
					<p className="text-[13px] font-bold uppercase tracking-[0.26em] text-[#A87E3C]">
						{text.title}
					</p>

					<h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-[#342312] sm:text-5xl lg:text-[56px]">
						{text.title}
					</h1>

					<p className="mt-5 text-[16px] leading-8 text-[#342312]/70">
						{text.lastUpdated}
					</p>
				</div>
			</section>

			<section className="w-full px-4 py-12 sm:px-6 sm:py-14 lg:px-10 xl:px-16 2xl:px-24">
				<div className="mx-auto max-w-5xl">
					<div className="space-y-10">
						{text.sections.map((section) => (
							<section
								key={section.title}
								className="border-b border-[#E7D0AF] pb-9 last:border-b-0"
							>
								<h2 className="font-serif text-2xl font-semibold leading-tight text-[#342312] sm:text-3xl">
									{section.title}
								</h2>

								<div className="mt-4 space-y-4">
									{section.content.map((paragraph) => (
										<p
											key={paragraph}
											className="text-[16px] leading-8 text-[#342312]/76"
										>
											{paragraph}
										</p>
									))}

									{section.list ? (
										<ul className="ml-5 list-disc space-y-3 text-[16px] leading-8 text-[#342312]/76">
											{section.list.map((item) => (
												<li key={item}>{item}</li>
											))}
										</ul>
									) : null}
								</div>
							</section>
						))}

						<div className="border border-[#E7D0AF] bg-[#FAF7F0] p-6 sm:p-8">
							<p className="text-[18px] font-bold uppercase tracking-[0.08em] text-[#342312]">
								{text.contact.company}
							</p>

							<div className="mt-5 space-y-2 text-[16px] leading-8 text-[#342312]/76">
								<p>
									<strong className="text-[#342312]">
										{text.contact.addressLabel}:
									</strong>{" "}
									{text.contact.address}
								</p>

								<p>
									<strong className="text-[#342312]">
										{text.contact.phoneLabel}:
									</strong>{" "}
									{text.contact.phone}
								</p>

								<p>
									<strong className="text-[#342312]">
										{text.contact.emailLabel}:
									</strong>{" "}
									{text.contact.email}
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}