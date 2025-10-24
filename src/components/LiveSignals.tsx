import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";
import { Users, Activity, TrendingUp, UserCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { profileStorage } from "@/utils/profileStorage";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

// Foreign names for more global feel
const foreignNames = [
  // Middle East (Arabic, Persian, Turkish, Hebrew)
  "Muhammad", "Ahmed", "Omar", "Youssef", "Hassan", "Ali", "Khalid", "Ibrahim", "Tariq", "Bilal",
  "Fatima", "Aisha", "Zainab", "Maryam", "Nour", "Layla", "Amira", "Salma", "Noor", "Huda",
  "Reza", "Hossein", "Amir", "Navid", "Saeed", "Parsa", "Shirin", "Neda", "Leyla", "Darya",
  "Mehmet", "Mustafa", "Emre", "Can", "Kerem", "Ayşe", "Elif", "Zeynep", "Merve", "Selin",
  "David", "Yossi", "Avi", "Noam", "Eitan", "Yael", "Shira", "Tamar", "Leah", "Rivka",

  // South Asia & Southeast Asia (India, Pakistan, Bangladesh, Sri Lanka, Nepal, Indonesia, Malaysia, Singapore, Thailand, Vietnam, Philippines, Myanmar, Cambodia, Laos)
  "Arjun", "Rahul", "Rohan", "Vikram", "Ravi", "Amit", "Sanjay", "Kunal", "Naveen", "Aditya",
  "Priya", "Ananya", "Aisha", "Kavya", "Sneha", "Nisha", "Ishita", "Pooja", "Meera", "Riya",
  "Aarav", "Vihaan", "Ishaan", "Advait", "Vivaan", "Aanya", "Dia", "Myra", "Anika", "Kiara",
  "Hassan", "Zain", "Hamza", "Usman", "Imran", "Mariam", "Areeba", "Hiba", "Sana", "Iqra",
  "Abdullah", "Owais", "Shoaib", "Aqsa", "Emaan",
  "Hasan", "Tanvir", "Shakib", "Mashrur", "Nayeem", "Tahsin", "Mahiya", "Nusrat", "Sabina", "Moumita",
  "Kamal", "Ruwan", "Dilshan", "Nadeesha", "Tharindu", "Ishara", "Thilini", "Sachini", "Sanduni", "Kavindi",
  "Sujan", "Prakash", "Nabin", "Dipesh", "Sanjiv", "Sunita", "Pabitra", "Asmita", "Sita", "Anjali",
  "Putra", "Budi", "Agus", "Hendra", "Rizky", "Dewi", "Sari", "Ayu", "Intan", "Wulan",
  "Ahmad", "Syafiq", "Hafiz", "Iskandar", "Farid", "Nurul", "Aisyah", "Siti", "Hani", "Zulaikha",
  "Wei Ling", "Jia Hui", "Hui Min", "Yong Jun", "Minhui", "Shawn", "Aishwarya", "Suresh", "Kiran", "Liyana",
  "Somchai", "Nattapong", "Anan", "Apichai", "Somporn", "Suda", "Narumon", "Kanya", "Malee", "Chanya",
  "Nguyen", "Minh", "Anh", "Duc", "Quang", "Trang", "Linh", "Thao", "Huong", "Ngoc",
  "Juan", "Jose", "Miguel", "Carlos", "Maria", "Isabela", "Sofia", "Camila", "Ana", "Lucia",
  "Juanito", "Aljon", "Mark", "Christian", "Joshua", "Angelica", "Jessa", "Kristine", "Rochelle", "Aubrey",
  "Aung", "Ko Ko", "Min", "Hlaing", "Zaw", "Thazin", "Ei Mon", "Su Su", "Nandar", "Hnin",
  "Sok", "Vannak", "Piseth", "Rith", "Srey", "Pisey", "Chanthou", "Dara", "Sophea", "Malis",
  "Somphong", "Khamla", "Phouthone", "Bounmy", "Seng", "Noy", "Ketsana", "Alisa", "Manivanh", "Daovone",

  // East Asia (balance)
  "Wei", "Liang", "Chen", "Jia", "Yue", "Mei", "Hiroshi", "Yuki", "Sora", "Aiko",

  // Africa (MENA balance + broader)
  "Omar", "Karim", "Samir", "Nadia", "Laila", "Rania", "Yara", "Farah", "Amal", "Hanin",
  "Amina", "Kofi", "Kwame", "Ade", "Chinonso", "Ngozi", "Zanele", "Naledi", "Thabo", "Sipho",

  // Europe & Americas (to keep global variety)
  "Lucas", "Emma", "Noah", "Olivia", "Liam", "Sophia", "Isabella", "Mia", "Charlotte", "Amelia",
  "Mateo", "Santiago", "Valentina", "Martina", "Thiago", "Benjamín", "Franco", "Giulia", "Luca", "Sofia",
  "Jakub", "Zuzanna", "Anna", "Tomas", "Marek", "Elena", "Eva", "Nina", "Maja", "Anja"
];

const userProfiles = Array.from({ length: 100 }, (_, i) => {
  const name = foreignNames[i % foreignNames.length];
  return {
    name,
    strategy: [
      "Breakout Strategy", "Fibonacci Retracement", "Trend Following", "ICT Concept", "SMC Strategy",
      "Advanced SMC", "Volatility Breakout", "Carry Trade", "Options Straddle", "Momentum"
    ][getRandomInt(0, 9)],
    tier: ["Free", "Pro", "Max"][getRandomInt(0, 2)],
    winRate: [68, 72, 75, 81, 79, 84, 86][getRandomInt(0, 6)],
    credits: [2, 5, 8, 10][getRandomInt(0, 3)],
    risk: ["Low", "Medium", "High", "Variable"][getRandomInt(0, 3)],
  };
});

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomTradeType() {
  return ["Scalping", "Swing", "Day Trading", "Position"][getRandomInt(0, 3)];
}

function getInitial(name: string): string {
  if (!name || typeof name !== 'string') return '?';
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed.charAt(0).toUpperCase() : '?';
}

function LiveSignals() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // Subscribers: start at 1210, increase by 1 every hour
  const [subscribers, setSubscribers] = useState(1210);
  // Live Now: starts at 300, changes up/down every 5 seconds
  const [liveUsers, setLiveUsers] = useState(300);
  // TP Hit in 24h: start at 280, increase by 1 every 15 seconds, never decreases
  const [tpHit, setTpHit] = useState(280);
  const [profitChartData, setProfitChartData] = useState<number[]>([]);
  const [popupUser, setPopupUser] = useState(userProfiles[getRandomInt(0, 99)]);
  
  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user?.email) {
        try {
          const profile = await profileStorage.getProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error('Failed to load user profile:', error);
        }
      }
    };
    
    loadUserProfile();
  }, [user]);

  useEffect(() => {
    // TP Hit increments every 15 seconds
    const tpInterval = setInterval(() => {
      setTpHit((prev) => prev + 1);
    }, 15000);

    // Live Now changes up/down every 5 seconds
    const liveInterval = setInterval(() => {
      setLiveUsers((prev) => {
        // Randomly increase or decrease by 1-5, but not below 250 or above 350
        const change = getRandomInt(-5, 5);
        let next = prev + change;
        if (next < 250) next = 250;
        if (next > 350) next = 350;
        return next;
      });
    }, 5000);

    // Subscribers increment every hour
    const subInterval = setInterval(() => {
      setSubscribers((prev) => prev + 1);
    }, 60 * 60 * 1000);

    // Chart data update
    setProfitChartData(Array.from({ length: 24 }, () => getRandomInt(10, 40)));

    // Popup user update
    const popupInterval = setInterval(() => {
      setPopupUser(userProfiles[getRandomInt(0, 99)]);
    }, 8000);

    return () => {
      clearInterval(tpInterval);
      clearInterval(subInterval);
      clearInterval(liveInterval);
      clearInterval(popupInterval);
    };
  }, []);

  // Calculate Pro strategy users and their profit score
  const proUsers = userProfiles.filter(u => u.tier === "Pro");
  const proProfitScore = proUsers.length > 0 ? 90 : 0;

  const chartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i + 1}h`),
    datasets: [
      {
        label: "Profit Users (24h)",
        data: profitChartData,
        backgroundColor: "rgba(34,197,94,0.7)",
        borderRadius: 8,
        barPercentage: 0.7,
      },
    ],
  };

  const chartOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#888" } },
      y: { grid: { color: "#eee" }, ticks: { color: "#888", stepSize: 10 } },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Card className="p-2 md:p-4 bg-gradient-glass backdrop-blur-sm border-border/20 shadow-2xl rounded-2xl w-full max-w-md mx-auto">
      {/* Recent Profit User - Full Width, Always on Top */}
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-5 h-5 text-primary" />
        <span className="text-lg font-semibold">Live</span>
      </div>
      <div className="w-full flex flex-col items-center justify-center mb-6">
        <div className="relative flex flex-col items-center bg-gradient-dark rounded-xl px-5 py-6 shadow-lg w-full border border-primary/20 hover:shadow-2xl hover:border-primary/60 transition-all duration-300 group">
          <div className="w-20 h-20 rounded-full border-4 border-primary shadow-lg mb-3 bg-white overflow-hidden animate-bounce-slow group-hover:scale-105 transition flex items-center justify-center">
            <span className="text-3xl font-bold text-primary">
              {getInitial(popupUser.name)}
            </span>
          </div>
          <div className="flex flex-col items-center text-center w-full">
            <span className="font-semibold text-lg text-foreground mb-1">{popupUser.name}</span>
            <Badge className="bg-gradient-profit text-white mb-2">{popupUser.strategy}</Badge>
            <div className="text-xs md:text-sm text-muted-foreground mb-2">
              {popupUser.name} just made a profit using <span className="font-bold text-primary">{popupUser.strategy}</span> ({getRandomTradeType()}) with our <span className="font-bold text-trading-profit">Pro Strategy</span>!
              {userProfile && (
                <div className="hidden mt-2 p-2 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-xs text-muted-foreground">
                    {userProfile.trading_experience && `Experience: ${userProfile.trading_experience}`}
                    {userProfile.preferred_pairs && ` • Pairs: ${userProfile.preferred_pairs.split(',').slice(0, 2).join(', ')}`}
                    {userProfile.risk_tolerance && ` • Risk: ${userProfile.risk_tolerance}`}
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 justify-center mb-2">
              <Badge variant="outline" className="text-xs">{popupUser.tier} Tier</Badge>
              <Badge variant="outline" className="text-xs">{popupUser.winRate}% win rate</Badge>
              <Badge variant="outline" className="text-xs">{popupUser.credits} credits</Badge>
              <Badge variant="outline" className="text-xs">{popupUser.risk} risk</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-primary" />
          <span className="text-lg font-semibold">Platform Stats</span>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 border border-blue-400 rounded-lg px-4 py-3">
            <Activity className="w-7 h-7 text-blue-400" />
            <div>
              <span className="text-xl md:text-2xl font-bold text-primary">{subscribers.toLocaleString()}</span>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">Total Subscribers</div>
            </div>
          </div>
          <div className="flex items-center gap-3 border border-green-500 rounded-lg px-4 py-3">
            <TrendingUp className="w-7 h-7 text-green-500" />
            <div>
              <span className="text-xl md:text-2xl font-bold text-trading-profit">{liveUsers}</span>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">Active Traders</div>
            </div>
          </div>
          <div className="flex items-center gap-3 border border-yellow-400 rounded-lg px-4 py-3">
            <UserCheck className="w-7 h-7 text-yellow-400" />
            <div>
              <span className="text-xl md:text-2xl font-bold text-yellow-400">{tpHit}</span>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">TP Hits in 24h</div>
            </div>
          </div>
        </div>
      </div>

      {/* 24h Profit Users Chart */}
      {/* <div>
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <span className="text-lg font-semibold">24h Profit Users' Chart</span>
        </div>
        <div className="bg-card/30 rounded-xl p-3 shadow mb-2">
          <div style={{ height: 160 }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div> */}

      <style>
        {`
        .animate-bounce-slow {
          animation: bounce 2.5s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-8px);}
        }
        `}
      </style>
    </Card>
  );
}

export default LiveSignals;