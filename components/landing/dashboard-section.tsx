import { Menu, TrendingUp, Users, DollarSign, BarChart3, ArrowUpRight } from "lucide-react"

export function DashboardSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Menu className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">CPA Compliance Dashboard</span>
          </div>
        </div>

        {/* Main Dashboard Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Client Compliance Chart */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Client compliance status.</h3>
                <div className="h-48 relative">
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    {/* Grid lines */}
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    {/* Y-axis labels */}
                    <text x="10" y="30" className="text-xs fill-gray-500">100%</text>
                    <text x="10" y="80" className="text-xs fill-gray-500">75%</text>
                    <text x="10" y="130" className="text-xs fill-gray-500">50%</text>
                    
                    {/* X-axis labels */}
                    <text x="80" y="190" className="text-xs fill-gray-500">Q1 2023</text>
                    <text x="160" y="190" className="text-xs fill-gray-500">Q2 2023</text>
                    <text x="240" y="190" className="text-xs fill-gray-500">Q3 2023</text>
                    <text x="320" y="190" className="text-xs fill-gray-500">Q4 2023</text>
                    
                    {/* Compliant clients line (orange) */}
                    <path
                      d="M 60 150 Q 140 120 220 100 Q 300 80 380 60"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="3"
                    />
                    
                    {/* At-risk clients line (light blue) */}
                    <path
                      d="M 60 160 Q 140 140 220 130 Q 300 120 380 110"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                    />
                    
                    {/* Tooltip for Sarah */}
                    <g transform="translate(240, 100)">
                      <rect x="-25" y="-30" width="50" height="20" fill="white" stroke="#e5e7eb" rx="4"/>
                      <text x="0" y="-15" textAnchor="middle" className="text-xs fill-gray-900">Sarah</text>
                    </g>
                  </svg>
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Compliant clients</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">At-risk clients</span>
                  </div>
                </div>
              </div>

              {/* Top Clients Table */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Top clients.</h3>
                <div className="overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-500 border-b border-gray-200">
                        <th className="text-left py-2">client</th>
                        <th className="text-left py-2">joined</th>
                        <th className="text-left py-2">state</th>
                        <th className="text-left py-2">revenue</th>
                        <th className="text-left py-2">compliance</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-900">
                      <tr className="border-b border-gray-100">
                        <td className="py-2">Smith & Associates</td>
                        <td className="py-2">12/2022</td>
                        <td className="py-2">CA</td>
                        <td className="py-2">$1,521,200</td>
                        <td className="py-2">98%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2">Johnson CPA Group</td>
                        <td className="py-2">11/2022</td>
                        <td className="py-2">TX</td>
                        <td className="py-2">$1,205,500</td>
                        <td className="py-2">95%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2">Williams Tax Services</td>
                        <td className="py-2">10/2022</td>
                        <td className="py-2">NY</td>
                        <td className="py-2">$980,750</td>
                        <td className="py-2">92%</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">AVERAGE $1,235,817</span> • <span className="font-medium">AVERAGE 95%</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>&lt;</span>
                      <span>1 / 24</span>
                      <span>&gt;</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Revenue by State Donut Chart */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Revenue by state.</h3>
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      {/* California segment (orange) */}
                      <path
                        className="text-orange-500"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="36.12, 100"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* Texas segment (light blue) */}
                      <path
                        className="text-blue-400"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="31.89, 100"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        strokeDashoffset="-36.12"
                      />
                      {/* New York segment (darker blue) */}
                      <path
                        className="text-blue-600"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="14.72, 100"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        strokeDashoffset="-68.01"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">Total</div>
                        <div className="text-sm font-bold text-gray-900">$4.32M</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-600">California</span>
                    </div>
                    <span className="text-gray-900 font-medium">36.12%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-600">Texas</span>
                    </div>
                    <span className="text-gray-900 font-medium">31.89%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-600">New York</span>
                    </div>
                    <span className="text-gray-900 font-medium">14.72%</span>
                  </div>
                </div>
              </div>

              {/* Client Revenue */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Client revenue.</h3>
                <div className="relative">
                  {/* Tooltip for Michael */}
                  <div className="absolute -top-8 -left-4 bg-white border border-gray-200 rounded px-2 py-1 text-xs">
                    Michael
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Average Monthly Revenue</div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">$201,530</div>
                    <div className="flex items-center justify-center space-x-1 text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-sm font-medium">20.5%</span>
                    </div>
                  </div>
                  
                  {/* Top right icons */}
                  <div className="absolute top-0 right-0 flex items-center space-x-2">
                    <div className="flex -space-x-1">
                      <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white"></div>
                      <div className="w-6 h-6 bg-gray-400 rounded-full border-2 border-white"></div>
                      <div className="w-6 h-6 bg-gray-500 rounded-full border-2 border-white"></div>
                    </div>
                    <span className="text-xs text-gray-500">+1</span>
                    <button className="text-xs text-gray-500 hover:text-gray-700">Add</button>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Compliance Cases by State Bar Chart */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Compliance cases by state.</h3>
                <div className="h-48 relative">
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    {/* Grid lines */}
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    {/* Y-axis labels */}
                    <text x="10" y="30" className="text-xs fill-gray-500">400</text>
                    <text x="10" y="80" className="text-xs fill-gray-500">200</text>
                    <text x="10" y="130" className="text-xs fill-gray-500">100</text>
                    
                    {/* X-axis labels */}
                    <text x="60" y="190" className="text-xs fill-gray-500">Q1 2020</text>
                    <text x="120" y="190" className="text-xs fill-gray-500">Q2 2020</text>
                    <text x="180" y="190" className="text-xs fill-gray-500">Q1 2021</text>
                    <text x="240" y="190" className="text-xs fill-gray-500">Q2 2021</text>
                    <text x="300" y="190" className="text-xs fill-gray-500">Q1 2022</text>
                    <text x="360" y="190" className="text-xs fill-gray-500">Q2 2023</text>
                    
                    {/* Bar groups */}
                    {/* 6/2020 */}
                    <rect x="50" y="150" width="8" height="20" fill="#f97316" />
                    <rect x="58" y="160" width="8" height="10" fill="#3b82f6" />
                    <rect x="66" y="170" width="8" height="0" fill="#1d4ed8" />
                    
                    {/* 12/2020 */}
                    <rect x="110" y="140" width="8" height="30" fill="#f97316" />
                    <rect x="118" y="150" width="8" height="20" fill="#3b82f6" />
                    <rect x="126" y="160" width="8" height="10" fill="#1d4ed8" />
                    
                    {/* 6/2021 */}
                    <rect x="170" y="130" width="8" height="40" fill="#f97316" />
                    <rect x="178" y="140" width="8" height="30" fill="#3b82f6" />
                    <rect x="186" y="150" width="8" height="20" fill="#1d4ed8" />
                    
                    {/* 12/2021 */}
                    <rect x="230" y="120" width="8" height="50" fill="#f97316" />
                    <rect x="238" y="130" width="8" height="40" fill="#3b82f6" />
                    <rect x="246" y="140" width="8" height="30" fill="#1d4ed8" />
                    
                    {/* 6/2022 */}
                    <rect x="290" y="110" width="8" height="60" fill="#f97316" />
                    <rect x="298" y="120" width="8" height="50" fill="#3b82f6" />
                    <rect x="306" y="130" width="8" height="40" fill="#1d4ed8" />
                    
                    {/* 12/2023 */}
                    <rect x="350" y="100" width="8" height="70" fill="#f97316" />
                    <rect x="358" y="110" width="8" height="60" fill="#3b82f6" />
                    <rect x="366" y="120" width="8" height="50" fill="#1d4ed8" />
                    
                    {/* Tooltip for David */}
                    <g transform="translate(300, 100)">
                      <rect x="-20" y="-25" width="40" height="15" fill="white" stroke="#e5e7eb" rx="3"/>
                      <text x="0" y="-10" textAnchor="middle" className="text-xs fill-gray-900">David</text>
                    </g>
                  </svg>
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">California</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Texas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-700 rounded-full"></div>
                    <span className="text-xs text-gray-600">New York</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
