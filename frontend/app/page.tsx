import HeroSection from './components/HeroSection'
import ProductList from './components/ProductList'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ProductList />
      <Footer />
    </main>
  )
}
