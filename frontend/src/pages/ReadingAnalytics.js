"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReadingAnalytics;
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const Header_1 = __importDefault(require("@/components/layout/Header"));
const Footer_1 = __importDefault(require("@/components/layout/Footer"));
const recharts_1 = require("recharts");
const lucide_react_1 = require("lucide-react");
const mockSessions = [
    { id: "1", bookTitle: "Language Arts - JSS 1", bookLevel: "JSS", duration: 45, cost: 0.75, date: new Date(2025, 10, 1), sessionType: "reading" },
    { id: "2", bookTitle: "Mathematics - JSS 2", bookLevel: "JSS", duration: 60, cost: 1.0, date: new Date(2025, 10, 2), sessionType: "listening" },
    { id: "3", bookTitle: "English Literature - SSS 1", bookLevel: "SSS", duration: 90, cost: 3.0, date: new Date(2025, 10, 2), sessionType: "reading" },
    { id: "4", bookTitle: "Biology - SSS 2", bookLevel: "SSS", duration: 75, cost: 2.5, date: new Date(2025, 10, 3), sessionType: "listening" },
    { id: "5", bookTitle: "Advanced Physics", bookLevel: "Other", duration: 120, cost: 5.0, date: new Date(2025, 10, 3), sessionType: "reading" },
];
function calculateDailyStats(sessions) {
    const dailyMap = new Map();
    sessions.forEach((session) => {
        const dateStr = session.date.toISOString().split("T")[0];
        if (!dailyMap.has(dateStr)) {
            dailyMap.set(dateStr, { date: dateStr, totalMinutes: 0, totalCost: 0, sessionCount: 0 });
        }
        const daily = dailyMap.get(dateStr);
        daily.totalMinutes += session.duration;
        daily.totalCost += session.cost;
        daily.sessionCount += 1;
    });
    return Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}
function calculateBookStats(sessions) {
    const bookMap = new Map();
    sessions.forEach((session) => {
        if (!bookMap.has(session.bookTitle)) {
            bookMap.set(session.bookTitle, { bookTitle: session.bookTitle, totalMinutes: 0, totalCost: 0, sessionCount: 0 });
        }
        const book = bookMap.get(session.bookTitle);
        book.totalMinutes += session.duration;
        book.totalCost += session.cost;
        book.sessionCount += 1;
    });
    return Array.from(bookMap.values()).sort((a, b) => b.totalCost - a.totalCost);
}
function ReadingAnalytics() {
    const [timeRange, setTimeRange] = (0, react_1.useState)("week");
    const [sessionType, setSessionType] = (0, react_1.useState)("all");
    const filteredSessions = mockSessions.filter((session) => {
        if (sessionType !== "all" && session.sessionType !== sessionType)
            return false;
        if (timeRange === "week") {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return session.date >= weekAgo;
        }
        else if (timeRange === "month") {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return session.date >= monthAgo;
        }
        return true;
    });
    const dailyStats = calculateDailyStats(filteredSessions);
    const bookStats = calculateBookStats(filteredSessions);
    const totalMinutes = filteredSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalCost = filteredSessions.reduce((sum, s) => sum + s.cost, 0);
    const totalSessions = filteredSessions.length;
    const averageSessionDuration = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
    const sessionTypeData = [
        { name: "Reading", value: filteredSessions.filter((s) => s.sessionType === "reading").length },
        { name: "Listening", value: filteredSessions.filter((s) => s.sessionType === "listening").length },
    ];
    const COLORS = ["#3b82f6", "#8b5cf6"];
    const levelData = [
        { level: "JSS", sessions: filteredSessions.filter((s) => s.bookLevel === "JSS").length, cost: filteredSessions.filter((s) => s.bookLevel === "JSS").reduce((sum, s) => sum + s.cost, 0) },
        { level: "SSS", sessions: filteredSessions.filter((s) => s.bookLevel === "SSS").length, cost: filteredSessions.filter((s) => s.bookLevel === "SSS").reduce((sum, s) => sum + s.cost, 0) },
        { level: "Other", sessions: filteredSessions.filter((s) => s.bookLevel === "Other").length, cost: filteredSessions.filter((s) => s.bookLevel === "Other").reduce((sum, s) => sum + s.cost, 0) },
    ];
    const handleExportReport = () => {
        const report = `
Reading Analytics Report
Generated: ${new Date().toLocaleDateString()}

Summary:
- Total Sessions: ${totalSessions}
- Total Reading Time: ${totalMinutes} minutes (${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m)
- Total Cost: ${totalCost.toFixed(2)} L
- Average Session Duration: ${averageSessionDuration} minutes

Session Details:
${filteredSessions.map((s) => `- ${s.bookTitle} (${s.sessionType}): ${s.duration} min, ${s.cost.toFixed(2)} L`).join("\n")}
    `;
        const element = document.createElement("a");
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(report));
        element.setAttribute("download", "reading-analytics.txt");
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };
    return (<div className="min-h-screen">
      <Header_1.default />
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container py-6 space-y-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Reading Analytics</h1>
            <p className="text-gray-600 mt-2">Track your reading time and associated costs in real-time</p>
          </div>
          <button_1.Button onClick={handleExportReport} className="bg-green-600 hover:bg-green-700 text-white">
            <lucide_react_1.Download className="w-4 h-4 mr-2"/>
            Export Report
          </button_1.Button>
        </div>

        <card_1.Card className="p-4 bg-white border-2 border-blue-200">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Time Range</label>
              <div className="flex gap-2">
                {["week", "month", "all"].map((range) => (<button_1.Button key={range} onClick={() => setTimeRange(range)} variant={timeRange === range ? "default" : "outline"} className={timeRange === range ? "bg-blue-600 text-white" : "text-gray-700"}>
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button_1.Button>))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Session Type</label>
              <div className="flex gap-2">
                {["all", "reading", "listening"].map((type) => (<button_1.Button key={type} onClick={() => setSessionType(type)} variant={sessionType === type ? "default" : "outline"} className={sessionType === type ? "bg-purple-600 text-white" : "text-gray-700"}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button_1.Button>))}
              </div>
            </div>
          </div>
        </card_1.Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <card_1.Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Sessions</p>
                <p className="text-3xl font-bold mt-2">{totalSessions}</p>
              </div>
              <lucide_react_1.BookOpen className="w-12 h-12 opacity-20"/>
            </div>
          </card_1.Card>
          <card_1.Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Time</p>
                <p className="text-3xl font-bold mt-2">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</p>
              </div>
              <lucide_react_1.Clock className="w-12 h-12 opacity-20"/>
            </div>
          </card_1.Card>
          <card_1.Card className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Total Cost</p>
                <p className="text-3xl font-bold mt-2">{totalCost.toFixed(2)} L</p>
              </div>
              <lucide_react_1.DollarSign className="w-12 h-12 opacity-20"/>
            </div>
          </card_1.Card>
          <card_1.Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Avg Duration</p>
                <p className="text-3xl font-bold mt-2">{averageSessionDuration}m</p>
              </div>
              <lucide_react_1.Zap className="w-12 h-12 opacity-20"/>
            </div>
          </card_1.Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <card_1.Card className="p-6 bg-white border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Daily Reading Time</h3>
            <recharts_1.ResponsiveContainer width="100%" height={300}>
              <recharts_1.BarChart data={dailyStats}>
                <recharts_1.CartesianGrid strokeDasharray="3 3"/>
                <recharts_1.XAxis dataKey="date"/>
                <recharts_1.YAxis />
                <recharts_1.Tooltip formatter={(value) => `${value} min`} labelFormatter={(label) => `Date: ${label}`}/>
                <recharts_1.Bar dataKey="totalMinutes" fill="#3b82f6" name="Minutes"/>
              </recharts_1.BarChart>
            </recharts_1.ResponsiveContainer>
          </card_1.Card>

          <card_1.Card className="p-6 bg-white border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">💰 Daily Costs</h3>
            <recharts_1.ResponsiveContainer width="100%" height={300}>
              <recharts_1.LineChart data={dailyStats}>
                <recharts_1.CartesianGrid strokeDasharray="3 3"/>
                <recharts_1.XAxis dataKey="date"/>
                <recharts_1.YAxis />
                <recharts_1.Tooltip formatter={(value) => `${typeof value === 'number' ? value.toFixed(2) : value} L`} labelFormatter={(label) => `Date: ${label}`}/>
                <recharts_1.Line type="monotone" dataKey="totalCost" stroke="#ef4444" strokeWidth={2} name="Cost (L)"/>
              </recharts_1.LineChart>
            </recharts_1.ResponsiveContainer>
          </card_1.Card>

          <card_1.Card className="p-6 bg-white border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📚 Session Type Distribution</h3>
            <recharts_1.ResponsiveContainer width="100%" height={300}>
              <recharts_1.PieChart>
                <recharts_1.Pie data={sessionTypeData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#8884d8" dataKey="value">
                  {sessionTypeData.map((entry, index) => (<recharts_1.Cell key={`cell-${index}`} fill={["#3b82f6", "#8b5cf6"][index % 2]}/>))}
                </recharts_1.Pie>
                <recharts_1.Tooltip />
              </recharts_1.PieChart>
            </recharts_1.ResponsiveContainer>
          </card_1.Card>

          <card_1.Card className="p-6 bg-white border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🎓 Reading by Level</h3>
            <recharts_1.ResponsiveContainer width="100%" height={300}>
              <recharts_1.BarChart data={levelData}>
                <recharts_1.CartesianGrid strokeDasharray="3 3"/>
                <recharts_1.XAxis dataKey="level"/>
                <recharts_1.YAxis yAxisId="left"/>
                <recharts_1.YAxis yAxisId="right" orientation="right"/>
                <recharts_1.Tooltip />
                <recharts_1.Legend />
                <recharts_1.Bar yAxisId="left" dataKey="sessions" fill="#3b82f6" name="Sessions"/>
                <recharts_1.Bar yAxisId="right" dataKey="cost" fill="#ef4444" name="Cost (L)"/>
              </recharts_1.BarChart>
            </recharts_1.ResponsiveContainer>
          </card_1.Card>
        </div>

        <card_1.Card className="p-6 bg-white border-2 border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📖 Top Books</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Book Title</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Sessions</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Time</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {bookStats.map((book, idx) => (<tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">{book.bookTitle}</td>
                    <td className="text-right py-3 px-4 text-gray-600">{book.sessionCount}</td>
                    <td className="text-right py-3 px-4 text-gray-600">{Math.floor(book.totalMinutes / 60)}h {book.totalMinutes % 60}m</td>
                    <td className="text-right py-3 px-4 text-red-600 font-semibold">{book.totalCost.toFixed(2)} L</td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </card_1.Card>

        <card_1.Card className="p-6 bg-white border-2 border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">⏱️ Session History</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredSessions.map((session) => (<div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{session.bookTitle}</p>
                  <p className="text-sm text-gray-600">{session.date.toLocaleDateString()} • {session.sessionType === "reading" ? "📖 Reading" : "🎧 Listening"}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{session.duration} min</p>
                  <p className="text-sm text-red-600">{session.cost.toFixed(2)} L</p>
                </div>
              </div>))}
          </div>
        </card_1.Card>
      </div>
    </div>
    <Footer_1.default />
  </div>);
}
