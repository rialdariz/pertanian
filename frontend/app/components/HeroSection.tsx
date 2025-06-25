import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-green-700 to-green-500 text-white py-24 px-6 overflow-hidden">
      {/* Background Shape */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-green-900 rounded-full opacity-30 blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-56 h-56 bg-green-300 rounded-full opacity-20 blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Padi Berkualitas, <br className="hidden md:inline" />
            Langsung dari Petani
          </h1>
          <p className="text-lg md:text-xl text-green-100 mb-6">
            Dapatkan harga terbaik untuk padi pilihan langsung dari sawah Indonesia. Tanpa perantara. Lebih segar, lebih jujur.
          </p>
          <a
            href="#produk"
            className="inline-block bg-white text-green-800 font-semibold py-3 px-6 rounded-full shadow-md hover:bg-gray-100 transition"
          >
            Jelajahi Produk
          </a>
        </div>

        {/* Image */}
        <div className="md:w-1/2">
          <Image
            src="/images/Padi.jpg"
            alt="Padi berkualitas"
            width={500}
            height={500}
            className="rounded-2xl shadow-lg object-cover"
          />
        </div>
      </div>
    </section>
  )
}
