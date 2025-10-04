export function TrustedSection() {
  const firms = [
    { name: "Baker Tilly", service: "Advisory Services" },
    { name: "CliftonLarsonAllen", service: "Tax & Advisory" },
    { name: "Grant Thornton", service: "Risk Advisory" },
    { name: "Moss Adams", service: "Compliance" }
  ]

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Trusted by Leading CPA Firms
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {firms.map((firm, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-600">{firm.name.charAt(0)}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{firm.name}</h3>
              <p className="text-sm text-gray-600">{firm.service}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
