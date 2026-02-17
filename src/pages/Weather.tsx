import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { CloudSun, Droplets, Wind, Thermometer, CloudRain, Sun, CloudLightning, Snowflake, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const forecast = [
  { day: "Today", icon: <CloudSun className="h-8 w-8" />, high: "24°C", low: "16°C", rain: "10%", desc: "Partly Cloudy" },
  { day: "Tue", icon: <Sun className="h-8 w-8" />, high: "27°C", low: "18°C", rain: "5%", desc: "Sunny" },
  { day: "Wed", icon: <CloudRain className="h-8 w-8" />, high: "22°C", low: "15°C", rain: "70%", desc: "Rain Expected" },
  { day: "Thu", icon: <CloudRain className="h-8 w-8" />, high: "20°C", low: "14°C", rain: "85%", desc: "Heavy Rain" },
  { day: "Fri", icon: <CloudSun className="h-8 w-8" />, high: "23°C", low: "15°C", rain: "20%", desc: "Clearing" },
  { day: "Sat", icon: <Sun className="h-8 w-8" />, high: "26°C", low: "17°C", rain: "5%", desc: "Sunny" },
  { day: "Sun", icon: <CloudSun className="h-8 w-8" />, high: "25°C", low: "16°C", rain: "15%", desc: "Partly Cloudy" },
];

const alerts = [
  { severity: "warning", title: "Heavy Rain Warning", region: "Western Province", time: "Wed–Thu", detail: "Expected 40-60mm of rainfall. Risk of flooding in low-lying farm areas." },
  { severity: "info", title: "Frost Advisory", region: "Northern Highlands", time: "Thu night", detail: "Temperatures may drop below 5°C. Protect sensitive crops." },
];

const districts = [
  { name: "Kigali", temp: "24°C", condition: "Partly Cloudy", risk: "Low" },
  { name: "Musanze", temp: "18°C", condition: "Overcast", risk: "Medium" },
  { name: "Huye", temp: "22°C", condition: "Sunny", risk: "Low" },
  { name: "Rubavu", temp: "21°C", condition: "Rain", risk: "High" },
  { name: "Nyagatare", temp: "26°C", condition: "Sunny", risk: "Low" },
  { name: "Karongi", temp: "20°C", condition: "Cloudy", risk: "Medium" },
];

const riskColor = { Low: "bg-success/10 text-success", Medium: "bg-warning/10 text-warning", High: "bg-destructive/10 text-destructive" };

const Weather = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Weather Intelligence</h1>
        <p className="text-muted-foreground">Forecasts, alerts and climate risk for all districts</p>
      </div>

      {/* Current conditions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <CloudSun className="h-16 w-16 text-secondary" />
          <div className="text-center sm:text-left">
            <p className="font-display text-4xl font-bold text-card-foreground">24°C</p>
            <p className="text-muted-foreground">Kigali District — Partly Cloudy</p>
          </div>
          <div className="flex flex-1 justify-end gap-6">
            {[
              { icon: <Droplets className="h-4 w-4" />, label: "Humidity", value: "68%" },
              { icon: <Wind className="h-4 w-4" />, label: "Wind", value: "12 km/h" },
              { icon: <Thermometer className="h-4 w-4" />, label: "Feels like", value: "26°C" },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <div className="flex justify-center text-muted-foreground">{m.icon}</div>
                <p className="mt-1 text-xs text-muted-foreground">{m.label}</p>
                <p className="text-sm font-semibold text-card-foreground">{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 7-day forecast */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="font-display text-base font-bold text-card-foreground">7-Day Forecast</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {forecast.map((d) => (
            <div key={d.day} className="flex flex-col items-center rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-sm font-semibold text-card-foreground">{d.day}</p>
              <div className="my-2 text-secondary">{d.icon}</div>
              <p className="text-xs text-muted-foreground">{d.desc}</p>
              <p className="mt-1 text-sm font-bold text-card-foreground">{d.high}</p>
              <p className="text-xs text-muted-foreground">{d.low}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-info">
                <Droplets className="h-3 w-3" /> {d.rain}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Alerts */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="font-display text-base font-bold text-card-foreground">Weather Alerts</h3>
          <div className="mt-4 space-y-3">
            {alerts.map((a) => (
              <div key={a.title} className={`rounded-lg border-l-4 p-4 ${a.severity === "warning" ? "border-l-warning bg-warning/5" : "border-l-info bg-info/5"}`}>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <p className="text-sm font-semibold text-card-foreground">{a.title}</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{a.region} · {a.time}</p>
                <p className="mt-2 text-sm text-card-foreground">{a.detail}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* District conditions */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="font-display text-base font-bold text-card-foreground">District Conditions</h3>
          <div className="mt-4 space-y-2">
            {districts.map((d) => (
              <div key={d.name} className="flex items-center justify-between rounded-lg px-4 py-3 hover:bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-card-foreground">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.condition}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-card-foreground">{d.temp}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${riskColor[d.risk as keyof typeof riskColor]}`}>{d.risk}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </DashboardLayout>
);

export default Weather;
