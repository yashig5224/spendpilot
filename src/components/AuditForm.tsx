"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ArrowRight, Zap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TOOL_PRICING, getToolPlans, getPlanPrice } from "@/lib/pricing";
import type { AiTool, UseCase } from "@/lib/types";
import { runAudit } from "@/lib/audit";
import { nanoid, formatCurrency } from "@/lib/utils";

const STORAGE_KEY = "spendpilot_form";

const toolEntrySchema = z.object({
  id: z.string(),
  tool: z.string().min(1, "Select a tool"),
  plan: z.string().min(1, "Select a plan"),
  monthlySpend: z.coerce.number().min(0, "Must be ≥ 0"),
  seats: z.coerce.number().min(1, "At least 1 seat"),
  teamSize: z.coerce.number().min(1, "At least 1"),
  useCase: z.string().min(1, "Select a use case"),
});

const formSchema = z.object({
  tools: z.array(toolEntrySchema).min(1, "Add at least one tool"),
});

type FormValues = z.infer<typeof formSchema>;

const AI_TOOLS = Object.entries(TOOL_PRICING).map(([value, info]) => ({
  value: value as AiTool,
  label: info.label,
}));

const USE_CASES: { value: UseCase; label: string }[] = [
  { value: "coding", label: "Coding / Development" },
  { value: "writing", label: "Writing / Content" },
  { value: "research", label: "Research / Analysis" },
  { value: "customer-support", label: "Customer Support" },
  { value: "data-analysis", label: "Data Analysis" },
  { value: "general", label: "General Use" },
];

function defaultEntry(): FormValues["tools"][0] {
  return {
    id: nanoid(),
    tool: "",
    plan: "",
    monthlySpend: 0,
    seats: 1,
    teamSize: 5,
    useCase: "",
  };
}

export function AuditForm() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { tools: [defaultEntry()] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tools",
  });

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        form.reset(parsed);
      }
    } catch {}
  }, [form]);

  // Persist to localStorage on change
  const values = form.watch();
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch {}
  }, [values]);

  const onSubmit = useCallback(
    (data: FormValues) => {
      const entries = data.tools.map((t) => ({
        ...t,
        tool: t.tool as AiTool,
        useCase: t.useCase as UseCase,
      }));
      const auditResult = runAudit(entries);
      const id = nanoid(12);
      const slug = nanoid(8);
      const full = {
        ...auditResult,
        id,
        shareSlug: slug,
        createdAt: new Date().toISOString(),
      };
      sessionStorage.setItem(`audit_${id}`, JSON.stringify(full));
      localStorage.removeItem(STORAGE_KEY);
      router.push(`/results?id=${id}`);
    },
    [router]
  );

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <p className="text-xs text-cyan-400 uppercase tracking-widest font-500 mb-3">Step 1 of 1</p>
        <h1 className="font-display text-4xl font-700 tracking-tight text-white mb-2">
          Your AI stack
        </h1>
        <p className="text-white/40 text-base">
          Add each AI tool your team uses. We&apos;ll calculate exact savings per tool.
        </p>
      </motion.div>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {fields.map((field, index) => (
              <ToolCard
                key={field.id}
                index={index}
                form={form}
                onRemove={() => remove(index)}
                canRemove={fields.length > 1}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Add tool */}
        <motion.div layout className="mt-4">
          <button
            type="button"
            onClick={() => append(defaultEntry())}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-4 text-sm text-white/30 transition-all hover:border-cyan-400/30 hover:text-cyan-400 hover:bg-cyan-400/[0.03]"
          >
            <Plus className="h-4 w-4" />
            Add another tool
          </button>
        </motion.div>

        {/* Summary + Submit */}
        <SpendSummary values={values} />

        {form.formState.errors.tools?.root && (
          <p className="mt-2 text-xs text-red-400">
            {form.formState.errors.tools.root.message}
          </p>
        )}

        <motion.div layout className="mt-6">
          <Button
            type="submit"
            size="lg"
            className="w-full text-base font-600"
            disabled={form.formState.isSubmitting}
          >
            <Zap className="h-4 w-4" />
            Run audit — find my savings
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="mt-3 text-center text-xs text-white/25">
            Free · No account needed · Results in seconds
          </p>
        </motion.div>
      </form>
    </div>
  );
}

// ─── Tool Card ────────────────────────────────────────────────────────────────

function ToolCard({
  index,
  form,
  onRemove,
  canRemove,
}: {
  index: number;
  form: ReturnType<typeof useForm<FormValues>>;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const { register, watch, setValue, formState: { errors } } = form;
  const selectedTool = watch(`tools.${index}.tool`) as AiTool | "";
  const selectedPlan = watch(`tools.${index}.plan`);
  const seats = watch(`tools.${index}.seats`);

  const plans = selectedTool ? getToolPlans(selectedTool) : [];
  const planPrice = selectedTool && selectedPlan ? getPlanPrice(selectedTool as AiTool, selectedPlan) : 0;
  const isApiTool = selectedTool ? TOOL_PRICING[selectedTool as AiTool]?.isApiTool : false;

  const errs = errors.tools?.[index];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      layout
      className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5"
    >
      {/* Card header */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-600 text-white/30 uppercase tracking-widest">
          Tool {index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white/20 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tool selector */}
        <div className="space-y-1.5">
          <Label>AI Tool</Label>
          <Select
            value={selectedTool}
            onValueChange={(val) => {
              setValue(`tools.${index}.tool`, val);
              setValue(`tools.${index}.plan`, "");
              setValue(`tools.${index}.monthlySpend`, 0);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tool…" />
            </SelectTrigger>
            <SelectContent>
              {AI_TOOLS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errs?.tool && <p className="text-xs text-red-400">{errs.tool.message}</p>}
        </div>

        {/* Plan selector */}
        <div className="space-y-1.5">
          <Label>Plan</Label>
          <Select
            value={selectedPlan}
            onValueChange={(val) => setValue(`tools.${index}.plan`, val)}
            disabled={!selectedTool}
          >
            <SelectTrigger>
              <SelectValue placeholder={selectedTool ? "Select plan…" : "Select tool first"} />
            </SelectTrigger>
            <SelectContent>
              {plans.map((plan) => {
                const price = getPlanPrice(selectedTool as AiTool, plan);
                const info = TOOL_PRICING[selectedTool as AiTool]?.plans[plan];
                return (
                  <SelectItem key={plan} value={plan}>
                    {info?.name} {price > 0 ? `— $${price}/seat` : "— Free"}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {errs?.plan && <p className="text-xs text-red-400">{errs.plan.message}</p>}
        </div>

        {/* Monthly spend */}
        <div className="space-y-1.5">
          <Label>
            {isApiTool ? "Monthly API spend ($)" : "Monthly spend ($)"}
          </Label>
          <Input
            type="number"
            min="0"
            step="1"
            placeholder={isApiTool ? "e.g. 150" : planPrice > 0 ? `e.g. ${planPrice * (seats || 1)}` : "0"}
            {...register(`tools.${index}.monthlySpend`)}
          />
          {!isApiTool && planPrice > 0 && seats > 0 && (
            <p className="text-xs text-white/25">
              Expected: {formatCurrency(planPrice * seats)}/mo
            </p>
          )}
          {errs?.monthlySpend && <p className="text-xs text-red-400">{errs.monthlySpend.message}</p>}
        </div>

        {/* Seats */}
        <div className="space-y-1.5">
          <Label>{isApiTool ? "Team members using this API" : "Seats / Licenses"}</Label>
          <Input
            type="number"
            min="1"
            placeholder="e.g. 5"
            {...register(`tools.${index}.seats`)}
          />
          {errs?.seats && <p className="text-xs text-red-400">{errs.seats.message}</p>}
        </div>

        {/* Team size */}
        <div className="space-y-1.5">
          <Label>Total team size</Label>
          <Input
            type="number"
            min="1"
            placeholder="e.g. 12"
            {...register(`tools.${index}.teamSize`)}
          />
          {errs?.teamSize && <p className="text-xs text-red-400">{errs.teamSize.message}</p>}
        </div>

        {/* Use case */}
        <div className="space-y-1.5">
          <Label>Primary use case</Label>
          <Select
            value={watch(`tools.${index}.useCase`)}
            onValueChange={(val) => setValue(`tools.${index}.useCase`, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select use case…" />
            </SelectTrigger>
            <SelectContent>
              {USE_CASES.map(({ value, label }) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errs?.useCase && <p className="text-xs text-red-400">{errs.useCase.message}</p>}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Spend summary ────────────────────────────────────────────────────────────

function SpendSummary({ values }: { values: FormValues }) {
  const total = values.tools.reduce((sum, t) => {
    const n = Number(t.monthlySpend);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  if (total === 0) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-3"
    >
      <span className="text-sm text-white/40">Total monthly spend</span>
      <span className="font-display text-lg font-600 text-white">{formatCurrency(total)}</span>
    </motion.div>
  );
}
