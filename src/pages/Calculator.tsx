import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const basicButtons = [
  ["C", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

const sciButtons = [
  ["sin", "cos", "tan", "π"],
  ["ln", "log", "√", "x²"],
  ["(", ")", "xʸ", "e"],
  ["1/x", "|x|", "n!", "⌫"],
];

export default function Calculator() {
  const navigate = useNavigate();
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [sciMode, setSciMode] = useState(false);

  const handleNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleDot = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) setDisplay(display + ".");
  };

  const handleOperator = (op: string) => {
    const opMap: Record<string, string> = { "÷": "/", "×": "*", "−": "-", "+": "+" };
    const newExpr = expression + parseFloat(display) + " " + (opMap[op] || op) + " ";
    setExpression(newExpr);
    setWaitingForOperand(true);
  };

  const handleEquals = () => {
    try {
      const result = Function('"use strict"; return (' + expression + parseFloat(display) + ')')();
      setDisplay(parseFloat(result.toFixed(10)).toString());
      setExpression("");
      setWaitingForOperand(true);
    } catch {
      setDisplay("Ошибка");
      setExpression("");
      setWaitingForOperand(true);
    }
  };

  const handleSci = (label: string) => {
    const val = parseFloat(display);
    const resultMap: Record<string, () => string> = {
      sin: () => parseFloat(Math.sin((val * Math.PI) / 180).toFixed(10)).toString(),
      cos: () => parseFloat(Math.cos((val * Math.PI) / 180).toFixed(10)).toString(),
      tan: () => parseFloat(Math.tan((val * Math.PI) / 180).toFixed(10)).toString(),
      ln:  () => parseFloat(Math.log(val).toFixed(10)).toString(),
      log: () => parseFloat(Math.log10(val).toFixed(10)).toString(),
      "√": () => parseFloat(Math.sqrt(val).toFixed(10)).toString(),
      "x²": () => (val * val).toString(),
      "1/x": () => parseFloat((1 / val).toFixed(10)).toString(),
      "|x|": () => Math.abs(val).toString(),
      "n!": () => {
        let r = 1;
        for (let i = 2; i <= val; i++) r *= i;
        return r.toString();
      },
      π: () => Math.PI.toFixed(10),
      e: () => Math.E.toFixed(10),
    };

    if (label === "⌫") {
      setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
      return;
    }
    if (label === "(") {
      setExpression(expression + display + " * (");
      setDisplay("0");
      setWaitingForOperand(true);
      return;
    }
    if (label === ")") {
      setExpression(expression + display + ")");
      setDisplay("0");
      setWaitingForOperand(true);
      return;
    }
    if (label === "xʸ") {
      setExpression(expression + display + " ** ");
      setWaitingForOperand(true);
      return;
    }
    if (resultMap[label]) {
      setDisplay(resultMap[label]());
      setWaitingForOperand(true);
    }
  };

  const handleClear = () => { setDisplay("0"); setExpression(""); setWaitingForOperand(false); };
  const handleSign = () => setDisplay((parseFloat(display) * -1).toString());
  const handlePercent = () => setDisplay((parseFloat(display) / 100).toString());

  const handleButton = (label: string) => {
    if (label >= "0" && label <= "9") return handleNumber(label);
    if (label === ".") return handleDot();
    if (label === "=") return handleEquals();
    if (label === "C") return handleClear();
    if (label === "±") return handleSign();
    if (label === "%") return handlePercent();
    handleOperator(label);
  };

  const isOperator = (label: string) => ["÷", "×", "−", "+"].includes(label);
  const isAction = (label: string) => ["C", "±", "%"].includes(label);
  const isSciAction = (label: string) => ["sin","cos","tan","ln","log","√","x²","1/x","|x|","n!","⌫"].includes(label);
  const isSciConst = (label: string) => ["π", "e"].includes(label);
  const isSciOp = (label: string) => ["(", ")", "xʸ"].includes(label);

  return (
    <div className="min-h-screen bg-[#020d1a] flex flex-col items-center justify-center p-4">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm"
      >
        <Icon name="ArrowLeft" size={16} />
        Назад
      </button>

      <div className="w-full max-w-sm">
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase">Физмат Калькулятор</span>
          <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/graph")}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all font-mono bg-violet-500/20 border-violet-500/30 text-violet-400 hover:bg-violet-500/30"
          >
            <Icon name="LineChart" size={12} />
            Графики
          </button>
          <button
            onClick={() => setSciMode(!sciMode)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all font-mono ${
              sciMode
                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                : "bg-slate-800/50 border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30"
            }`}
          >
            <Icon name={sciMode ? "ChevronUp" : "FlaskConical"} size={12} />
            {sciMode ? "Скрыть" : "Расширенный"}
          </button>
          </div>
        </div>

        <div className="bg-[#040f1e] border border-[#0e2a3a] rounded-2xl overflow-hidden shadow-2xl shadow-cyan-900/20">
          <div className="px-6 pt-5 pb-4 min-h-[100px] flex flex-col justify-end items-end">
            <div className="text-slate-500 text-sm font-mono min-h-[20px] truncate max-w-full">{expression}</div>
            <div className="text-white text-5xl font-light font-mono mt-1 break-all text-right leading-tight">
              {display}
            </div>
          </div>

          {/* Расширенная панель */}
          {sciMode && (
            <div className="px-4 pb-2 pt-1 border-t border-[#0e2a3a] grid grid-cols-4 gap-2">
              {sciButtons.flat().map((label) => (
                <button
                  key={label}
                  onClick={() => handleSci(label)}
                  className={`h-11 rounded-xl text-sm font-mono font-medium transition-all active:scale-95
                    ${isSciConst(label)
                      ? "bg-violet-500/20 text-violet-300 border border-violet-500/30 hover:bg-violet-500/30"
                      : isSciOp(label)
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
                      : label === "⌫"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                      : "bg-slate-700/40 text-slate-200 border border-slate-700/50 hover:bg-slate-700/70"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Основная панель */}
          <div className="p-4 grid gap-3">
            {basicButtons.map((row, ri) => (
              <div key={ri} className="grid grid-cols-4 gap-3">
                {row.map((label, ci) => {
                  const isZero = label === "0" && row.length === 3 && ci === 0;
                  return (
                    <button
                      key={label}
                      onClick={() => handleButton(label)}
                      className={`
                        ${isZero ? "col-span-2" : "col-span-1"}
                        h-16 rounded-xl text-xl font-medium transition-all active:scale-95
                        ${label === "="
                          ? "bg-cyan-500 text-black hover:bg-cyan-400 border-0"
                          : isZero
                          ? "bg-slate-600/50 text-white border border-slate-500/50 hover:bg-slate-500/60 ring-1 ring-slate-400/30"
                          : isOperator(label)
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
                          : isAction(label)
                          ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                          : "bg-[#0a1f35] text-white hover:bg-[#0e2a45] border border-[#0e2a3a]"
                        }
                      `}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-4 font-mono">
          ℏ = 1.055×10⁻³⁴ · G = 6.674×10⁻¹¹ · c = 3×10⁸
        </p>
      </div>
    </div>
  );
}