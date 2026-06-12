"use client";

import { ImagePlus, Plus, RotateCcw, Save, Upload, X } from "lucide-react";
import type {
  FormatType,
  GameCardData,
  ProjectState,
  RankingItem,
  ResolutionType,
  ScoreCriterion,
  ScoreData,
  TemplateType,
  ThemeType,
} from "@/lib/types";
import { FORMAT_SIZES, RESOLUTION_LABELS } from "@/lib/types";
import { createInitialProject } from "@/lib/demoData";

type Props = {
  project: ProjectState;
  onChange: (project: ProjectState) => void;
  onSave: () => void;
  onLoad: () => void;
  onDemo: () => void;
};

export function EditorPanel({ project, onChange, onSave, onLoad, onDemo }: Props) {
  const active = project.data[project.template];

  function updateTemplate<T extends TemplateType>(template: T, nextData: ProjectState["data"][T]) {
    onChange({ ...project, data: { ...project.data, [template]: nextData } });
  }

  return (
    <aside className="space-y-5 rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-2xl">
      <div className="grid grid-cols-2 gap-3">
        <Select label="Formato" value={project.format} onChange={(value) => onChange({ ...project, format: value as FormatType })}>
          {Object.entries(FORMAT_SIZES).map(([key, format]) => (
            <option key={key} value={key}>{format.label}</option>
          ))}
        </Select>
        <Select label="Resolución" value={project.resolution} onChange={(value) => onChange({ ...project, resolution: value as ResolutionType })}>
          {Object.entries(RESOLUTION_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </Select>
        <Select label="Tema" value={project.theme} onChange={(value) => onChange({ ...project, theme: value as ThemeType })}>
          <option value="dark">Oscuro</option>
          <option value="colorful">Colorido</option>
          <option value="minimal">Minimalista</option>
          <option value="no-solo-dados">No Solo Dados</option>
        </Select>
      </div>

      {project.template === "game-card" ? (
        <GameCardForm data={active as GameCardData} onChange={(data) => updateTemplate("game-card", data)} />
      ) : null}
      {project.template === "pros-cons" ? (
        <section className="space-y-4">
          <TextInput label="Nombre del juego" value={project.data["pros-cons"].gameName} onChange={(gameName) => updateTemplate("pros-cons", { ...project.data["pros-cons"], gameName })} />
          <ListEditor title="Pros" values={project.data["pros-cons"].pros} onChange={(pros) => updateTemplate("pros-cons", { ...project.data["pros-cons"], pros })} />
          <ListEditor title="Contras" values={project.data["pros-cons"].cons} onChange={(cons) => updateTemplate("pros-cons", { ...project.data["pros-cons"], cons })} />
          <Textarea label="Veredicto corto" value={project.data["pros-cons"].verdict} onChange={(verdict) => updateTemplate("pros-cons", { ...project.data["pros-cons"], verdict })} />
        </section>
      ) : null}
      {project.template === "score" ? (
        <ScoreForm data={project.data.score} onChange={(score) => updateTemplate("score", score)} />
      ) : null}
      {project.template === "ranking" ? (
        <RankingForm items={project.data.ranking.items} title={project.data.ranking.title} onTitle={(title) => updateTemplate("ranking", { ...project.data.ranking, title })} onItems={(items) => updateTemplate("ranking", { ...project.data.ranking, items })} />
      ) : null}
      {project.template === "versus" ? (
        <VersusForm project={project} onChange={(data) => updateTemplate("versus", data)} />
      ) : null}

      <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
        <IconButton icon={Save} label="Guardar proyecto" onClick={onSave} />
        <IconButton icon={Upload} label="Cargar proyecto" onClick={onLoad} />
        <IconButton icon={ImagePlus} label="Cargar demo" onClick={onDemo} />
        <IconButton icon={RotateCcw} label="Resetear" onClick={() => onChange(createInitialProject(project.template))} />
      </div>
    </aside>
  );
}

function GameCardForm({ data, onChange }: { data: GameCardData; onChange: (data: GameCardData) => void }) {
  async function handleImage(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ ...data, coverImage: String(reader.result || "") });
    reader.readAsDataURL(file);
  }

  return (
    <section className="space-y-4">
      <TextInput label="Nombre del juego" value={data.gameName} onChange={(gameName) => onChange({ ...data, gameName })} />
      <div className="grid grid-cols-2 gap-3">
        <TextInput label="Editorial" value={data.publisher} onChange={(publisher) => onChange({ ...data, publisher })} />
        <TextInput label="Año" value={data.year} onChange={(year) => onChange({ ...data, year })} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <TextInput label="Jugadores" value={data.players} onChange={(players) => onChange({ ...data, players })} />
        <TextInput label="Duración" value={data.duration} onChange={(duration) => onChange({ ...data, duration })} />
        <TextInput label="Edad" value={data.age} onChange={(age) => onChange({ ...data, age })} />
      </div>
      <Range label="Dificultad" value={data.difficulty} max={5} step={0.5} onChange={(difficulty) => onChange({ ...data, difficulty })} />
      <TextInput label="Tipo / categorías" value={data.categories} onChange={(categories) => onChange({ ...data, categories })} />
      <Textarea label="¿Para quién es el juego?" value={data.verdict} onChange={(verdict) => onChange({ ...data, verdict })} />
      <label className="block">
        <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Imagen de portada</span>
        <input type="file" accept="image/*" onChange={(event) => handleImage(event.target.files?.[0] ?? null)} className="block w-full rounded-lg border border-white/10 bg-black/25 p-3 text-sm text-zinc-300 file:mr-4 file:rounded-md file:border-0 file:bg-teal-300 file:px-3 file:py-2 file:text-sm file:font-bold file:text-zinc-950" />
      </label>
      {data.coverImage ? <IconButton icon={X} label="Quitar imagen" onClick={() => onChange({ ...data, coverImage: "" })} /> : null}
    </section>
  );
}

function ScoreForm({ data, onChange }: { data: ScoreData; onChange: (data: ScoreData) => void }) {
  function updateCriteria(criteria: ScoreCriterion[]) {
    onChange({ ...data, criteria });
  }

  return (
    <section className="space-y-4">
      <TextInput label="Nombre del juego" value={data.gameName} onChange={(gameName) => onChange({ ...data, gameName })} />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Diseño" value={data.layout} onChange={(layout) => onChange({ ...data, layout: layout as ScoreData["layout"] })}>
          <option value="full">Pantalla completa</option>
          <option value="lower-third">Franja inferior</option>
        </Select>
        <Select label="Animación" value={data.animationMode} onChange={(animationMode) => onChange({ ...data, animationMode: animationMode as ScoreData["animationMode"] })}>
          <option value="sequential">Una a una</option>
          <option value="together">Todas a la vez</option>
        </Select>
      </div>
      <CriteriaEditor values={data.criteria} onChange={updateCriteria} />
      <NumberInput label="Nota final" value={data.finalScore} min={0} max={10} step={0.5} onChange={(finalScore) => onChange({ ...data, finalScore })} />
      <TextInput label="Etiqueta final" value={data.finalLabel} onChange={(finalLabel) => onChange({ ...data, finalLabel })} />
      <NumberInput label="Duración animación (s)" value={data.animationDuration ?? 1.6} min={0.3} max={8} step={0.1} onChange={(animationDuration) => onChange({ ...data, animationDuration })} />
    </section>
  );
}

function CriteriaEditor({ values, onChange }: { values: ScoreCriterion[]; onChange: (values: ScoreCriterion[]) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-zinc-200">Criterios de evaluación</p>
        <button type="button" onClick={() => onChange([...values, { id: crypto.randomUUID(), name: "Nuevo criterio", value: 7 }])} className="inline-flex items-center gap-2 rounded-md bg-teal-300 px-3 py-2 text-xs font-bold text-zinc-950">
          <Plus className="size-4" /> Añadir
        </button>
      </div>
      {values.map((criterion, index) => (
        <div key={criterion.id} className="space-y-3 rounded-lg border border-white/10 bg-black/18 p-3">
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <TextInput label="Nombre" value={criterion.name} onChange={(name) => onChange(values.map((entry, i) => (i === index ? { ...entry, name } : entry)))} />
            <button type="button" disabled={values.length <= 1} onClick={() => onChange(values.filter((_, i) => i !== index))} className="mt-6 grid size-10 place-items-center rounded-md bg-rose-400/18 text-rose-200 disabled:opacity-40">
              <X className="size-4" />
            </button>
          </div>
          <Range label="Nota" value={criterion.value} max={10} step={0.5} onChange={(value) => onChange(values.map((entry, i) => (i === index ? { ...entry, value } : entry)))} />
        </div>
      ))}
    </div>
  );
}

function RankingForm({
  title,
  items,
  onTitle,
  onItems,
}: {
  title: string;
  items: RankingItem[];
  onTitle: (title: string) => void;
  onItems: (items: RankingItem[]) => void;
}) {
  return (
    <section className="space-y-4">
      <TextInput label="Título del ranking" value={title} onChange={onTitle} />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-zinc-200">Juegos del ranking</p>
          <button type="button" disabled={items.length >= 10} onClick={() => onItems([...items, { position: items.length + 1, name: "", comment: "" }])} className="inline-flex items-center gap-2 rounded-md bg-teal-300 px-3 py-2 text-xs font-bold text-zinc-950 disabled:opacity-40">
            <Plus className="size-4" /> Añadir
          </button>
        </div>
        {items.map((item, index) => (
          <div key={index} className="space-y-2 rounded-lg border border-white/10 bg-black/18 p-3">
            <div className="grid grid-cols-[70px_1fr_auto] gap-2">
              <NumberInput label="Pos." value={item.position} min={1} max={10} step={1} onChange={(position) => onItems(items.map((entry, i) => (i === index ? { ...entry, position } : entry)))} />
              <TextInput label="Nombre" value={item.name} onChange={(name) => onItems(items.map((entry, i) => (i === index ? { ...entry, name } : entry)))} />
              <button type="button" onClick={() => onItems(items.filter((_, i) => i !== index))} className="mt-6 grid size-10 place-items-center rounded-md bg-rose-400/18 text-rose-200">
                <X className="size-4" />
              </button>
            </div>
            <Textarea label="Comentario corto" value={item.comment} onChange={(comment) => onItems(items.map((entry, i) => (i === index ? { ...entry, comment } : entry)))} rows={2} />
          </div>
        ))}
      </div>
    </section>
  );
}

function VersusForm({ project, onChange }: { project: ProjectState; onChange: (data: ProjectState["data"]["versus"]) => void }) {
  const data = project.data.versus;
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <TextInput label="Juego A" value={data.gameA} onChange={(gameA) => onChange({ ...data, gameA })} />
        <TextInput label="Juego B" value={data.gameB} onChange={(gameB) => onChange({ ...data, gameB })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextInput label="Duración A" value={data.durationA} onChange={(durationA) => onChange({ ...data, durationA })} />
        <TextInput label="Duración B" value={data.durationB} onChange={(durationB) => onChange({ ...data, durationB })} />
      </div>
      <Range label="Dificultad A" value={data.difficultyA} max={5} step={0.5} onChange={(difficultyA) => onChange({ ...data, difficultyA })} />
      <Range label="Dificultad B" value={data.difficultyB} max={5} step={0.5} onChange={(difficultyB) => onChange({ ...data, difficultyB })} />
      <Range label="Interacción A" value={data.interactionA} max={10} step={0.5} onChange={(interactionA) => onChange({ ...data, interactionA })} />
      <Range label="Interacción B" value={data.interactionB} max={10} step={0.5} onChange={(interactionB) => onChange({ ...data, interactionB })} />
      <Textarea label="Mejor para A" value={data.bestForA} onChange={(bestForA) => onChange({ ...data, bestForA })} rows={2} />
      <Textarea label="Mejor para B" value={data.bestForB} onChange={(bestForB) => onChange({ ...data, bestForB })} rows={2} />
      <Textarea label="Ganador / conclusión" value={data.winner} onChange={(winner) => onChange({ ...data, winner })} />
    </section>
  );
}

function ListEditor({ title, values, onChange }: { title: string; values: string[]; onChange: (values: string[]) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-zinc-200">{title}</p>
        <button type="button" onClick={() => onChange([...values, ""])} className="inline-flex items-center gap-2 rounded-md bg-teal-300 px-3 py-2 text-xs font-bold text-zinc-950">
          <Plus className="size-4" /> Añadir
        </button>
      </div>
      {values.map((value, index) => (
        <div key={index} className="grid grid-cols-[1fr_auto] gap-2">
          <input value={value} onChange={(event) => onChange(values.map((entry, i) => (i === index ? event.target.value : entry)))} className={fieldClass} />
          <button type="button" onClick={() => onChange(values.filter((_, i) => i !== index))} className="grid size-11 place-items-center rounded-md bg-rose-400/18 text-rose-200">
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

function IconButton({ icon: Icon, label, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.055] px-3 py-2 text-sm font-bold text-zinc-100 transition hover:border-teal-300/50 hover:bg-white/[0.09]">
      <Icon className="size-4" />
      {label}
    </button>
  );
}

const fieldClass = "w-full rounded-lg border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-300";

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <Field label={label}><input value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass} /></Field>;
}

function NumberInput({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return <Field label={label}><input type="number" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className={fieldClass} /></Field>;
}

function Textarea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return <Field label={label}><textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} className={`${fieldClass} resize-none`} /></Field>;
}

function Select({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return <Field label={label}><select value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass}>{children}</select></Field>;
}

function Range({ label, value, max, onChange, step = 1 }: { label: string; value: number; max: number; onChange: (value: number) => void; step?: number }) {
  return (
    <Field label={`${label}: ${value}`}>
      <input type="range" min={0} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="range-thumb h-2 w-full appearance-none rounded-full bg-white/12 accent-orange-400" />
    </Field>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">{label}</span>
      {children}
    </label>
  );
}
