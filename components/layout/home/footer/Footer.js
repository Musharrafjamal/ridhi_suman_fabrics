import Link from "next/link";

import FooterCategories from "./FooterCategories";
import Image from "next/image";

const Footer = async () => {
  const footerInfo = {
    links: [
      { href: "/privacy-policy", text: "Privacy Policy" },
      { href: "/terms-and-condition", text: "Terms Of Condition" },
      { href: "/refund-policy", text: "Refund Policy" },
      { href: "/shipping-policy", text: "Shipping Policy" },
    ],
  };

  return (
    <footer className="bg-white pt-10 container mx-auto border-t border-gray-200 mt-10">
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-semibold mb-6">Categories</h2>

        <FooterCategories />

        <div className="mb-10 px-6">
          <h3 className="text-lg font-semibold mb-4">Ridhi Suman Fabric</h3>
          <p className="text-gray-600">
            Aims to make it easier for every community in the world to carry out
            various buying and selling transactions online. It is one of the
            worlds online buying and selling sites whose development is
            relatively fast. You can sell products online at the slabshop
            besides being able to enjoy the process of buying various products
            more quickly and effectively. You can sign up for the exclusive
            slabshop Seller community if you want to launch your own business.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 py-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm px-6">
          <span>&copy; Ridhi Suman © 2024-2025, All Rights Reserved</span>

          <div className="grid grid-cols-2 gap-4 md:flex mt-4 md:mt-0">
            {footerInfo.links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="hover:underline text-xs"
              >
                {link.text}
              </Link>
            ))}
          </div>
          <div className="flex gap-1 mt-4 md:mt-0">
            Designed and maintain by
            <Link href={"https://ghosting.in"} target="_blank" className="flex gap-1 items-center">
              <div className="font-semibold text-amber-500">Ghosting Tech</div>
              <Image src={"/Ghosting.png"} width={20} height={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
