export function PartnerLogos() {
  const partners = [
    "Smith & Associates",
    "Johnson CPA Group", 
    "Williams Tax Services",
    "Brown Accounting",
    "Davis Financial",
    "Miller & Partners",
    "Wilson CPA",
    "Anderson Tax Group",
    "Taylor Accounting",
    "Clark Financial Services"
  ]

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-12">
            Powering compliance protection for today's CPA firms and tomorrow's accounting leaders.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
            {partners.map((partner, index) => (
              <div 
                key={index}
                className="text-gray-400 font-medium text-sm hover:text-gray-600 transition-colors cursor-pointer"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
