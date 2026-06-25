import Hero from '@/components/home/hero'
import FeaturedProducts from '@/components/home/featured-products'
import AboutPreview from '@/components/home/about-preview'
import Testimonials from '@/components/home/testimonials'
import InstagramSection from '@/components/home/instagram'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <AboutPreview />
      <Testimonials />
      <InstagramSection />
    </>
  )
}
