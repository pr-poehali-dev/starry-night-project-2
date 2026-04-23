import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

type Subject = "physics" | "chemistry" | "geometry" | "algebra" | "informatics";

interface Formula {
  name: string;
  formula: string;
  description: string;
}

interface SubjectData {
  label: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  formulas: Formula[];
}

const SUBJECTS: Record<Subject, SubjectData> = {
  physics: {
    label: "Физика",
    icon: "Zap",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    formulas: [
      { name: "Второй закон Ньютона", formula: "F = ma", description: "Сила равна произведению массы на ускорение" },
      { name: "Кинетическая энергия", formula: "E = mv² / 2", description: "Энергия движущегося тела" },
      { name: "Потенциальная энергия", formula: "E = mgh", description: "Энергия тела в поле тяготения" },
      { name: "Закон Гука", formula: "F = kx", description: "Сила упругости пружины" },
      { name: "Закон всемирного тяготения", formula: "F = G·m₁m₂ / r²", description: "G = 6.674×10⁻¹¹ Н·м²/кг²" },
      { name: "Скорость света", formula: "c = 3×10⁸ м/с", description: "Скорость электромагнитных волн в вакууме" },
      { name: "Закон Кулона", formula: "F = k·q₁q₂ / r²", description: "k = 9×10⁹ Н·м²/Кл²" },
      { name: "Закон Ома", formula: "I = U / R", description: "Ток, напряжение и сопротивление" },
      { name: "Мощность", formula: "P = UI = I²R", description: "Электрическая мощность" },
      { name: "Импульс тела", formula: "p = mv", description: "Механический импульс" },
      { name: "Уравнение МКТ", formula: "pV = νRT", description: "R = 8.314 Дж/(моль·К)" },
      { name: "Формула де Бройля", formula: "λ = h / p", description: "ℏ = 1.055×10⁻³⁴ Дж·с" },
      { name: "Энергия фотона", formula: "E = hν = hc / λ", description: "Квант электромагнитного излучения" },
      { name: "Релятивистская энергия", formula: "E = mc²", description: "Полная энергия покоя тела" },
    ],
  },
  chemistry: {
    label: "Химия",
    icon: "FlaskConical",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    formulas: [
      { name: "Закон Авогадро", formula: "Nₐ = 6.022×10²³ моль⁻¹", description: "Число частиц в одном моле вещества" },
      { name: "Молярная масса", formula: "M = m / ν", description: "М — молярная масса, m — масса, ν — количество вещества" },
      { name: "Уравнение состояния газа", formula: "pV = νRT", description: "R = 8.314 Дж/(моль·К)" },
      { name: "pH раствора", formula: "pH = −lg[H⁺]", description: "Водородный показатель кислотности" },
      { name: "Закон Гесса", formula: "ΔH = ΣΔHпрод − ΣΔHисх", description: "Тепловой эффект реакции" },
      { name: "Скорость реакции", formula: "v = k·[A]ⁿ·[B]ᵐ", description: "Закон действующих масс" },
      { name: "Уравнение Аррениуса", formula: "k = A·e^(−Eₐ/RT)", description: "Зависимость константы скорости от температуры" },
      { name: "Константа равновесия", formula: "Kc = [C]ᵖ[D]ᵍ / [A]ⁿ[B]ᵐ", description: "Отношение концентраций продуктов к реагентам" },
      { name: "Закон Фарадея", formula: "m = M·I·t / (n·F)", description: "F = 96485 Кл/моль" },
      { name: "Массовая доля", formula: "ω = m(в-ва) / m(р-ра) × 100%", description: "Концентрация растворённого вещества" },
    ],
  },
  geometry: {
    label: "Геометрия",
    icon: "Triangle",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    formulas: [
      { name: "Площадь круга", formula: "S = πr²", description: "r — радиус окружности" },
      { name: "Длина окружности", formula: "C = 2πr", description: "Периметр круга" },
      { name: "Теорема Пифагора", formula: "a² + b² = c²", description: "Для прямоугольного треугольника" },
      { name: "Площадь треугольника", formula: "S = ½·a·h = ½·ab·sinC", description: "Через основание и высоту / через две стороны и угол" },
      { name: "Формула Герона", formula: "S = √(p(p−a)(p−b)(p−c))", description: "p = (a+b+c)/2 — полупериметр" },
      { name: "Объём шара", formula: "V = (4/3)πr³", description: "r — радиус шара" },
      { name: "Площадь сферы", formula: "S = 4πr²", description: "Поверхность сферы" },
      { name: "Объём цилиндра", formula: "V = πr²h", description: "r — радиус, h — высота" },
      { name: "Объём конуса", formula: "V = (1/3)πr²h", description: "r — радиус основания, h — высота" },
      { name: "Теорема косинусов", formula: "c² = a² + b² − 2ab·cosC", description: "Обобщение теоремы Пифагора" },
      { name: "Теорема синусов", formula: "a/sinA = b/sinB = c/sinC = 2R", description: "R — радиус описанной окружности" },
      { name: "Объём пирамиды", formula: "V = (1/3)·S·h", description: "S — площадь основания, h — высота" },
    ],
  },
  algebra: {
    label: "Алгебра",
    icon: "Sigma",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    formulas: [
      { name: "Квадратное уравнение", formula: "x = (−b ± √(b²−4ac)) / 2a", description: "ax² + bx + c = 0, дискриминант D = b²−4ac" },
      { name: "Формула разности квадратов", formula: "a² − b² = (a−b)(a+b)", description: "Сокращённое умножение" },
      { name: "Квадрат суммы", formula: "(a+b)² = a² + 2ab + b²", description: "Сокращённое умножение" },
      { name: "Квадрат разности", formula: "(a−b)² = a² − 2ab + b²", description: "Сокращённое умножение" },
      { name: "Куб суммы", formula: "(a+b)³ = a³ + 3a²b + 3ab² + b³", description: "Бином Ньютона при n=3" },
      { name: "Прогрессия арифметическая", formula: "Sₙ = n(a₁+aₙ)/2 = n(2a₁+(n−1)d)/2", description: "d — разность, n — число членов" },
      { name: "Прогрессия геометрическая", formula: "Sₙ = a₁(1−qⁿ)/(1−q)", description: "q — знаменатель прогрессии" },
      { name: "Логарифм", formula: "log_a(xy) = log_a(x) + log_a(y)", description: "Основное свойство логарифма" },
      { name: "Формула перехода", formula: "log_a(b) = ln(b)/ln(a)", description: "Смена основания логарифма" },
      { name: "Бином Ньютона", formula: "(a+b)ⁿ = Σ C(n,k)·aⁿ⁻ᵏ·bᵏ", description: "C(n,k) = n! / (k!(n−k)!)" },
      { name: "Производная степени", formula: "(xⁿ)' = nxⁿ⁻¹", description: "Основное правило дифференцирования" },
      { name: "Интеграл степени", formula: "∫xⁿdx = xⁿ⁺¹/(n+1) + C", description: "Таблица первообразных" },
    ],
  },
  informatics: {
    label: "Информатика",
    icon: "Cpu",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    formulas: [
      { name: "Количество информации", formula: "I = log₂(N)", description: "N — число равновероятных событий" },
      { name: "Объём данных", formula: "1 байт = 8 бит", description: "1 КБ = 1024 Б, 1 МБ = 1024 КБ" },
      { name: "Перевод в двоичную", formula: "N₁₀ → N₂: делить на 2, записать остатки снизу вверх", description: "Алгоритм перевода из десятичной в двоичную" },
      { name: "Булева алгебра — И", formula: "A AND B: 1 только если A=1 и B=1", description: "Конъюнкция" },
      { name: "Булева алгебра — ИЛИ", formula: "A OR B: 0 только если A=0 и B=0", description: "Дизъюнкция" },
      { name: "Булева алгебра — НЕ", formula: "NOT A: инвертирует бит", description: "Отрицание" },
      { name: "Сложность алгоритма", formula: "O(1) < O(log n) < O(n) < O(n log n) < O(n²)", description: "Иерархия временных сложностей" },
      { name: "Число адресов", formula: "N = 2ⁿ", description: "n — разрядность адреса/шины" },
      { name: "Скорость передачи", formula: "t = V / v", description: "V — объём, v — скорость передачи данных" },
      { name: "Пропускная способность", formula: "C = B·log₂(1 + S/N)", description: "Формула Шеннона, B — полоса пропускания" },
      { name: "Хэш-функция (MD5)", formula: "len(hash) = 128 бит = 32 hex", description: "SHA-256 = 256 бит = 64 hex" },
      { name: "IP-адрес IPv4", formula: "4 байта = 32 бита → 2³² адреса", description: "IPv6 = 128 бит → 2¹²⁸ адресов" },
    ],
  },
};

const SUBJECT_ORDER: Subject[] = ["physics", "chemistry", "geometry", "algebra", "informatics"];

export default function Formulas() {
  const navigate = useNavigate();
  const [active, setActive] = useState<Subject | null>(null);

  const subject = active ? SUBJECTS[active] : null;

  return (
    <div className="min-h-screen bg-[#020d1a] text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-[#0e2a3a]">
        <button
          onClick={() => active ? setActive(null) : navigate("/")}
          className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm"
        >
          <Icon name="ArrowLeft" size={16} />
          {active ? "К разделам" : "Назад"}
        </button>
        <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase">
          Формулы{active ? ` / ${SUBJECTS[active].label}` : ""}
        </span>
      </div>

      {/* Главная — выбор раздела */}
      {!active && (
        <div className="flex flex-col items-center justify-center flex-1 p-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight text-center">Справочник формул</h1>
          <p className="text-slate-400 text-sm mb-12 text-center">Выберите раздел</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl">
            {SUBJECT_ORDER.map((key) => {
              const s = SUBJECTS[key];
              return (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`group flex items-center gap-4 p-5 rounded-2xl border ${s.bg} ${s.border} hover:scale-[1.02] transition-all text-left`}
                >
                  <div className={`w-12 h-12 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center flex-shrink-0`}>
                    <Icon name={s.icon} size={22} className={s.color} />
                  </div>
                  <div>
                    <div className={`font-semibold text-lg ${s.color}`}>{s.label}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{s.formulas.length} формул</div>
                  </div>
                  <Icon name="ChevronRight" size={16} className="text-slate-600 ml-auto group-hover:text-slate-400 transition-colors" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Список формул */}
      {active && subject && (
        <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl ${subject.bg} border ${subject.border} flex items-center justify-center`}>
              <Icon name={subject.icon} size={18} className={subject.color} />
            </div>
            <h2 className={`text-2xl font-bold ${subject.color}`}>{subject.label}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subject.formulas.map((f, i) => (
              <div
                key={i}
                className={`rounded-xl border ${subject.border} bg-[#040f1e] p-4 hover:${subject.bg} transition-colors`}
              >
                <div className="text-slate-400 text-xs font-mono mb-2">{f.name}</div>
                <div className={`text-xl font-mono font-semibold ${subject.color} mb-2 leading-snug`}>{f.formula}</div>
                <div className="text-slate-500 text-xs leading-relaxed">{f.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}