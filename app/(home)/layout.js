import CartDrawer from "@/components/drawer/CartDrawer";

import Nav from "@/components/layout/home/NavHeader/Nav";
import WhastappIcon from "@/components/layout/home/WhastappIcon";
import Footer from "@/components/layout/home/footer/Footer";

const layoutHome = ({ children }) => {
  return (
    <>
      <CartDrawer />

      <Nav />

      <WhastappIcon />
      {children}
      <Footer />
    </>
  );
};

export default layoutHome;
