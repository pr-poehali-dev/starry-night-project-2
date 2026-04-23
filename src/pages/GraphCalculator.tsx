import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import Icon from "@/components/ui/icon";

const COLORS = ["#22d3ee", "#a78bfa", "#34d399", "#f87171", "#fbbf24"];

interface GraphFunction {
  id: number;
  expr: string;
  color: string;
  visible: boolean;
  error: string;
}

const EXAMPLES = ["sin(x)", "x^2", "cos(x) * x", "Math.sqrt(Math.abs(x))", "1/x", "x^3 - 3*x"];

function evalFn(expr: string, x: number): number | null {
  try {
    const prepared = expr
      .replace(/\^/g, "**")
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/abs\(/g, "Math.abs(")
      .replace(/log\(/g, "Math.log10(")
      .replace(/ln\(/g, "Math.log(")
      .replace(/exp\(/g, "Math.exp(")
      .replace(/pi/gi, "Math.PI")
      .replace(/\be\b/g, "Math.E");
    const result = Function('"use strict"; const x = ' + x + '; return (' + prepared + ')')();
    if (!isFinite(result) || isNaN(result)) return null;
    return result;
  } catch {
    return null;
  }
}

function buildData(fns: GraphFunction[], xMin: number, xMax: number, steps = 400) {
  const data: Record<string, number | null | string>[] = [];
  const step = (xMax - xMin) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = parseFloat((xMin + i * step).toFixed(6));
    const point: Record<string, number | null | string> = { x: parseFloat(x.toFixed(3)) };
    fns.forEach((fn) => {
      if (fn.visible && !fn.error) {
        point[`y${fn.id}`] = evalFn(fn.expr, x);
      }
    });
    data.push(point);
  }
  return data;
}

export default function GraphCalculator() {
  const navigate = useNavigate();
  const [functions, setFunctions] = useState<GraphFunction[]>([
    { id: 1, expr: "sin(x)", color: COLORS[0], visible: true, error: "" },
  ]);
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [findX, setFindX] = useState("");
  const [findResults, setFindResults] = useState<{ expr: string; y: string }[]>([]);

  const nextId = functions.length > 0 ? Math.max(...functions.map((f) => f.id)) + 1 : 1;

  const validate = (expr: string) => {
    if (!expr.trim()) return "Введите выражение";
    try {
      evalFn(expr, 1);
      return "";
    } catch {
      return "Ошибка в выражении";
    }
  };

  const updateExpr = (id: number, expr: string) => {
    setFunctions((prev) =>
      prev.map((f) => (f.id === id ? { ...f, expr, error: validate(expr) } : f))
    );
  };

  const toggleVisible = (id: number) => {
    setFunctions((prev) => prev.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f)));
  };

  const addFunction = () => {
    if (functions.length >= 5) return;
    setFunctions((prev) => [
      ...prev,
      { id: nextId, expr: "", color: COLORS[prev.length % COLORS.length], visible: true, error: "" },
    ]);
  };

  const removeFunction = (id: number) => {
    setFunctions((prev) => prev.filter((f) => f.id !== id));
  };

  const handleFind = useCallback(() => {
    const x = parseFloat(findX);
    if (isNaN(x)) return;
    const results = functions
      .filter((f) => f.visible && !f.error && f.expr)
      .map((f) => {
        const y = evalFn(f.expr, x);
        return { expr: f.expr, y: y !== null ? parseFloat(y.toFixed(8)).toString() : "не определено" };
      });
    setFindResults(results);
  }, [findX, functions]);

  const validFns = functions.filter((f) => f.visible && !f.error && f.expr);
  const data = buildData(validFns, xMin, xMax);

  return (
    <div className="min-h-screen bg-[#020d1a] text-white flex flex-col">
      <div className="flex items-center gap-4 px-6 py-4 border-b border-[#0e2a3a]">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm"
        >
          <Icon name="ArrowLeft" size={16} />
          Назад
        </button>
        <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase">Построение графиков</span>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 gap-0 overflow-hidden">
        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-[#040f1e] border-b lg:border-b-0 lg:border-r border-[#0e2a3a] flex flex-col p-4 gap-4 overflow-y-auto">
          {/* Функции */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Функции</span>
              <button
                onClick={addFunction}
                disabled={functions.length >= 5}
                className="text-xs text-cyan-400 hover:text-cyan-300 disabled:opacity-30 flex items-center gap-1"
              >
                <Icon name="Plus" size={12} />
                Добавить
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {functions.map((fn) => (
                <div key={fn.id} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleVisible(fn.id)}>
                      <div className="w-3 h-3 rounded-full flex-shrink-0 border-2" style={{ backgroundColor: fn.visible ? fn.color : "transparent", borderColor: fn.color }} />
                    </button>
                    <span className="text-slate-400 text-sm font-mono flex-shrink-0">y =</span>
                    <input
                      value={fn.expr}
                      onChange={(e) => updateExpr(fn.id, e.target.value)}
                      placeholder="sin(x)"
                      className={`flex-1 bg-[#0a1f35] border rounded-lg px-3 py-1.5 text-sm font-mono text-white placeholder-slate-600 outline-none focus:border-cyan-500/50 min-w-0 ${fn.error ? "border-red-500/50" : "border-[#0e2a3a]"}`}
                    />
                    {functions.length > 1 && (
                      <button onClick={() => removeFunction(fn.id)} className="text-slate-600 hover:text-red-400 flex-shrink-0">
                        <Icon name="X" size={14} />
                      </button>
                    )}
                  </div>
                  {fn.error && <p className="text-red-400 text-xs ml-5 font-mono">{fn.error}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Диапазон X */}
          <div>
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block mb-3">Диапазон X</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={xMin}
                onChange={(e) => setXMin(parseFloat(e.target.value) || -10)}
                className="w-full bg-[#0a1f35] border border-[#0e2a3a] rounded-lg px-3 py-1.5 text-sm font-mono text-white outline-none focus:border-cyan-500/50"
              />
              <span className="text-slate-600 text-sm">до</span>
              <input
                type="number"
                value={xMax}
                onChange={(e) => setXMax(parseFloat(e.target.value) || 10)}
                className="w-full bg-[#0a1f35] border border-[#0e2a3a] rounded-lg px-3 py-1.5 text-sm font-mono text-white outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          {/* Найти значение */}
          <div>
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block mb-3">Найти значение при x =</span>
            <div className="flex gap-2">
              <input
                type="number"
                value={findX}
                onChange={(e) => setFindX(e.target.value)}
                placeholder="0"
                className="flex-1 bg-[#0a1f35] border border-[#0e2a3a] rounded-lg px-3 py-1.5 text-sm font-mono text-white outline-none focus:border-cyan-500/50"
              />
              <button
                onClick={handleFind}
                className="px-4 py-1.5 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors"
              >
                <Icon name="Search" size={14} />
              </button>
            </div>
            {findResults.length > 0 && (
              <div className="mt-2 flex flex-col gap-1">
                {findResults.map((r, i) => (
                  <div key={i} className="bg-[#0a1f35] border border-[#0e2a3a] rounded-lg px-3 py-2 text-xs font-mono">
                    <span className="text-slate-400">f(x) = {r.expr}</span>
                    <br />
                    <span className="text-cyan-400">y = {r.y}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Примеры */}
          <div>
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block mb-3">Примеры</span>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => updateExpr(functions[0].id, ex)}
                  className="text-xs font-mono px-2 py-1 bg-slate-800/60 border border-slate-700/50 rounded text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Подсказка синтаксиса */}
          <div className="bg-[#0a1f35] border border-[#0e2a3a] rounded-xl p-3 text-xs font-mono text-slate-500 leading-relaxed">
            <p className="text-slate-400 mb-1">Синтаксис:</p>
            sin(x) · cos(x) · tan(x)<br />
            sqrt(x) · abs(x) · ln(x)<br />
            log(x) · exp(x)<br />
            x^2 · pi · e
          </div>
        </div>

        {/* График */}
        <div className="flex-1 p-4 lg:p-6 flex flex-col">
          <ResponsiveContainer width="100%" height="100%" minHeight={400}>
            <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0e2a3a" />
              <XAxis
                dataKey="x"
                stroke="#334155"
                tick={{ fill: "#64748b", fontSize: 11, fontFamily: "monospace" }}
                tickLine={false}
              />
              <YAxis
                stroke="#334155"
                tick={{ fill: "#64748b", fontSize: 11, fontFamily: "monospace" }}
                tickLine={false}
                width={50}
              />
              <Tooltip
                contentStyle={{ background: "#040f1e", border: "1px solid #0e2a3a", borderRadius: 8, fontFamily: "monospace", fontSize: 12 }}
                labelStyle={{ color: "#94a3b8" }}
                itemStyle={{ color: "#22d3ee" }}
                formatter={(value: number) => value !== null ? parseFloat(value.toFixed(6)) : "н/о"}
                labelFormatter={(x) => `x = ${x}`}
              />
              <ReferenceLine y={0} stroke="#1e3a4a" strokeWidth={1} />
              <ReferenceLine x={0} stroke="#1e3a4a" strokeWidth={1} />
              {validFns.map((fn) => (
                <Line
                  key={fn.id}
                  type="monotone"
                  dataKey={`y${fn.id}`}
                  stroke={fn.color}
                  dot={false}
                  strokeWidth={2}
                  connectNulls={false}
                  name={`y = ${fn.expr}`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
