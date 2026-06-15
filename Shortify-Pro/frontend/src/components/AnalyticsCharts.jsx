import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area, 
  PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';
import { FiActivity } from 'react-icons/fi';

const COLORS = ['#FFA116', '#F8FAFC', '#94A3B8', '#64748B', '#475569', '#1E293B'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-bg-surface border border-border-main shadow-xl rounded-md min-w-[120px]">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 text-text-muted">{label}</p>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand"></div>
            <p className="text-[11px] font-bold text-text-primary">{payload[0].name}</p>
          </div>
          <p className="text-xs font-bold text-text-primary tabular-nums">{payload[0].value.toLocaleString()}</p>
        </div>
      </div>
    );
  }
  return null;
};

export const ClickTrendsChart = ({ data = [] }) => {
  const sortedData = [...data].sort((a, b) => new Date(a._id) - new Date(b._id));
  const formattedData = sortedData.map(item => ({ 
    name: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
    clicks: item.clicks 
  }));

  return (
    <div className="h-full w-full font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFA116" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#FFA116" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
            allowDecimals={false} 
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#FFA116', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area 
            type="monotone" 
            dataKey="clicks" 
            name="Hits"
            stroke="#FFA116" 
            strokeWidth={2} 
            fillOpacity={1} 
            fill="url(#chartGradient)" 
            animationDuration={1000} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DeviceChart = ({ data = [] }) => {
  const formattedData = data.map(item => ({ name: item._id || 'Unknown', value: item.count }));
  if (data.length === 0) return (
    <div className="h-full flex flex-col items-center justify-center text-text-muted space-y-2 opacity-50">
      <FiActivity size={24} />
      <span className="text-[10px] font-bold uppercase tracking-widest">No Telemetry</span>
    </div>
  );

  return (
    <div className="h-full w-full font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie 
            data={formattedData} 
            cx="50%" 
            cy="50%" 
            innerRadius="65%" 
            outerRadius="85%" 
            paddingAngle={6} 
            dataKey="value" 
            stroke="none" 
            animationDuration={1000}
          >
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={4} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            align="center"
            iconType="circle" 
            wrapperStyle={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', paddingTop: '20px' }} 
            formatter={(value) => <span className="text-text-muted">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CountryChart = ({ data = [] }) => {
  const formattedData = data.slice(0, 5).map(item => ({ name: item._id || 'Unknown', value: item.count }));

  return (
    <div className="h-full w-full font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff03" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
            dx={-10}
          />
          <Tooltip cursor={{ fill: 'rgba(255, 161, 22, 0.05)' }} content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            name="Hits"
            fill="#FFA116" 
            radius={[4, 4, 0, 0]} 
            barSize={20} 
            animationDuration={1000} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const GenericBarChart = ({ data = [], color = '#FFA116' }) => {
   const formattedData = data.slice(0, 5).map(item => ({ name: item._id || 'Unknown', value: item.count }));
   return (
     <div className="h-full w-full font-sans">
       <ResponsiveContainer width="100%" height="100%">
         <BarChart data={formattedData}>
           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff03" />
           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} dy={10} />
           <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} dx={-10} />
           <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
           <Bar dataKey="value" name="Activity" fill={color} radius={[4, 4, 0, 0]} barSize={20} animationDuration={1000} />
         </BarChart>
       </ResponsiveContainer>
     </div>
   );
};

export const BrowserChart = CountryChart;

