export default function Testimonials() {
  return (
    <section className="bg-gray-100 py-12 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">Apa Kata Mereka</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <blockquote className="bg-white p-6 rounded shadow">
          <p>"Kualitas padi sangat bagus dan pengirimannya cepat!"</p>
          <footer className="mt-4 font-semibold">– Pak Budi, Petani</footer>
        </blockquote>
        <blockquote className="bg-white p-6 rounded shadow">
          <p>"Harga bersaing dan pelayanan sangat ramah."</p>
          <footer className="mt-4 font-semibold">– Ibu Rina, Pedagang Beras</footer>
        </blockquote>
      </div>
    </section>
  );
}
