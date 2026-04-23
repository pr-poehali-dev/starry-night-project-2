import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const buttons = [
  ["C", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

export default function Calculator() {
  const navigate = useNavigate();
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [waitingForOperand, setWaitingForOperand] = useState(false);

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
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleOperator = (op: string) => {
    const opMap: Record<string, string> = { "÷": "/", "×": "*", "−": "-", "+": "+" };
    const current = parseFloat(display);
    const newExpr = expression + current + " " + (opMap[op] || op) + " ";
    setExpression(newExpr);
    setWaitingForOperand(true);
  };

  const handleEquals = () => {
    try {
      const result = Function('"use strict"; return (' + expression + parseFloat(display) + ')')();
      const rounded = parseFloat(result.toFixed(10)).toString();
      setDisplay(rounded);
      setExpression("");
      setWaitingForOperand(true);
    } catch {
      setDisplay("Ошибка");
      setExpression("");
      setWaitingForOperand(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setExpression("");
    setWaitingForOperand(false);
  };

  const handleSign = () => {
    setDisplay((parseFloat(display) * -1).toString());
  };

  const handlePercent = () => {
    setDisplay((parseFloat(display) / 100).toString());
  };

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
        <div className="mb-3 text-center">
          <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase">Физмат Калькулятор</span>
        </div>

        <div className="bg-[#040f1e] border border-[#0e2a3a] rounded-2xl overflow-hidden shadow-2xl shadow-cyan-900/20">
          <div className="px-6 pt-6 pb-4 min-h-[110px] flex flex-col justify-end items-end">
            <div className="text-slate-500 text-sm font-mono min-h-[20px]">{expression}</div>
            <div className="text-white text-5xl font-light font-mono mt-1 break-all text-right leading-tight">
              {display}
            </div>
          </div>

          <div className="p-4 grid gap-3">
            {buttons.map((row, ri) => (
              <div
                key={ri}
                className={`grid gap-3 ${row.length === 3 ? "grid-cols-4" : "grid-cols-4"}`}
              >
                {row.map((label, ci) => {
                  const isZero = label === "0" && row.length === 3 && ci === 0;
                  return (
                    <button
                      key={label}
                      onClick={() => handleButton(label)}
                      className={`
                        ${isZero ? "col-span-2" : "col-span-1"}
                        h-16 rounded-xl text-xl font-medium transition-all active:scale-95
                        ${isOperator(label)
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
                          : isAction(label)
                          ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                          : "bg-[#0a1f35] text-white hover:bg-[#0e2a45] border border-[#0e2a3a]"
                        }
                        ${label === "=" ? "bg-cyan-500 text-black hover:bg-cyan-400 border-0" : ""}
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

        <p className="text-center text-slate-600 text-xs mt-4">
          ℏ = 1.055×10⁻³⁴ · G = 6.674×10⁻¹¹ · c = 3×10⁸
        </p>
      </div>
    </div>
  );
}
