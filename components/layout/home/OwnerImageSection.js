import Image from "next/image";

export default function OwnerImageSection() {
  return (
    <div className="bg-white mx-4 mt-0 lg:mx-8 lg:mt-8 flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-1/3 flex justify-center">
        <Image
          src="https://img.freepik.com/free-vector/best-seller-award-badge-label-design-your-product_1017-12388.jpg"
          alt="Award Ceremony"
          width={500}
          height={1500}
          className="rounded-lg object-cover"
        />
      </div>

      <div className="w-full lg:w-2/3">
        <h1 className="text-xl lg:text-3xl font-bold text-red-600 mb-4">
          Ridhi Suman Fabrics - Rated #1 Most Trusted Textile Company in Surat,
          Gujarat (India)
        </h1>
        <p className="text-gray-700 mb-4">
          Welcome to Ridhi suman fabrics, where elegance meets tradition in the
          world of Indian ethnic wear. We take pride in being a leading
          destination for the finest <strong>Indian Sarees in Surat</strong>. As
          you explore our collection of Indian Sarees, you’ll be captivated by
          the diverse styles, vibrant colors, and intricate detailing that
          define our offerings. Our sarees are crafted with precision, blending
          traditional techniques with modern aesthetics.
        </p>
        <ul className="list-none space-y-4 text-gray-700">
          <li className="flex items-start">
            <span className="text-red-600 mr-2 hidden sm:block">&#10003;</span>
            <p>
              <strong>Diverse Range:</strong> Our extensive collection spans a
              wide range of saree types, from the timeless Banarasi silk to the
              lightweight and breezy georgette. Whatever the occasion, we have
              the perfect saree to complement your style.
            </p>
          </li>
          <li className="flex items-start">
            <span className="text-red-600 mr-2 hidden sm:block">&#10003;</span>
            <p>
              <strong>Quality Assurance:</strong> We prioritize quality. Each
              saree is crafted using premium fabrics and undergoes rigorous
              quality checks to ensure that our customers receive nothing but
              the best.
            </p>
          </li>
          <li className="flex items-start">
            <span className="text-red-600 mr-2 hidden sm:block">&#10003;</span>
            <p>
              <strong>Customization Options:</strong> We understand that
              individual preferences vary. That’s why we offer customization
              options, allowing you to tailor your saree according to your
              specific requirements, ensuring a unique and personalized touch.
            </p>
          </li>
          <li className="flex items-start">
            <span className="text-red-600 mr-2 hidden sm:block">&#10003;</span>
            <p>
              <strong>Affordable Luxury:</strong> Experience the joy of draping
              yourself in luxurious Indian sarees without breaking the bank. Our
              company is committed to offering affordable yet high-quality
              options, making traditional Indian attire accessible to all.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
