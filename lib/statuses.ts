export const ALL_STATUSES = [
  "pending",
  "processing",
  "cargo_on_air",
  "on_transit",
  "cargo_on_transit",
  "custom_check",
  "on_customs_hold",
  "cargo_on_move",
  "arrived",
  "out_for_delivery",
  "on_hold",
] as const

export type ShipmentStatus = (typeof ALL_STATUSES)[number]

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  cargo_on_air: "Cargo on Air",
  on_transit: "On Transit",
  cargo_on_transit: "Cargo on Transit",
  custom_check: "Custom Check",
  on_customs_hold: "On Customs Hold",
  cargo_on_move: "Cargo on Move",
  arrived: "Arrived",
  out_for_delivery: "Out for Delivery",
  on_hold: "On Hold",
}

export const STATUS_COLORS: Record<string, { backgroundColor: string; color: string }> = {
  pending: { backgroundColor: "var(--badge-warning-bg)", color: "var(--badge-warning-text)" },
  processing: { backgroundColor: "var(--badge-info-bg)", color: "var(--badge-info-text)" },
  cargo_on_air: { backgroundColor: "var(--badge-cyan-bg)", color: "var(--badge-cyan-text)" },
  on_transit: { backgroundColor: "var(--badge-indigo-bg)", color: "var(--badge-indigo-text)" },
  cargo_on_transit: { backgroundColor: "var(--badge-purple-bg)", color: "var(--badge-purple-text)" },
  custom_check: { backgroundColor: "var(--badge-orange-bg)", color: "var(--badge-orange-text)" },
  on_customs_hold: { backgroundColor: "var(--badge-error-bg)", color: "var(--badge-error-text)" },
  cargo_on_move: { backgroundColor: "var(--badge-purple-bg)", color: "var(--badge-purple-text)" },
  arrived: { backgroundColor: "var(--badge-success-bg)", color: "var(--badge-success-text)" },
  out_for_delivery: { backgroundColor: "var(--badge-info-bg)", color: "var(--badge-info-text)" },
  on_hold: { backgroundColor: "var(--badge-neutral-bg)", color: "var(--badge-neutral-text)" },
}

export const STATUS_COLORS_3: Record<string, { color: string; borderColor: string; backgroundColor: string }> = {
  pending: { color: "var(--badge-warning-text)", borderColor: "var(--badge-warning-bg)", backgroundColor: "var(--badge-warning-bg)" },
  processing: { color: "var(--badge-info-text)", borderColor: "var(--badge-info-bg)", backgroundColor: "var(--badge-info-bg)" },
  cargo_on_air: { color: "var(--badge-cyan-text)", borderColor: "var(--badge-cyan-bg)", backgroundColor: "var(--badge-cyan-bg)" },
  on_transit: { color: "var(--badge-indigo-text)", borderColor: "var(--badge-indigo-bg)", backgroundColor: "var(--badge-indigo-bg)" },
  cargo_on_transit: { color: "var(--badge-purple-text)", borderColor: "var(--badge-purple-bg)", backgroundColor: "var(--badge-purple-bg)" },
  custom_check: { color: "var(--badge-orange-text)", borderColor: "var(--badge-orange-bg)", backgroundColor: "var(--badge-orange-bg)" },
  on_customs_hold: { color: "var(--badge-error-text)", borderColor: "var(--badge-error-bg)", backgroundColor: "var(--badge-error-bg)" },
  cargo_on_move: { color: "var(--badge-purple-text)", borderColor: "var(--badge-purple-bg)", backgroundColor: "var(--badge-purple-bg)" },
  arrived: { color: "var(--badge-success-text)", borderColor: "var(--badge-success-bg)", backgroundColor: "var(--badge-success-bg)" },
  out_for_delivery: { color: "var(--badge-info-text)", borderColor: "var(--badge-info-bg)", backgroundColor: "var(--badge-info-bg)" },
  on_hold: { color: "var(--badge-neutral-text)", borderColor: "var(--badge-neutral-bg)", backgroundColor: "var(--badge-neutral-bg)" },
}

export const PROGRESS_STATUSES = ALL_STATUSES.filter((s) => s !== "on_hold")

export function getStatusIndex(status: string): number {
  return ALL_STATUSES.indexOf(status as ShipmentStatus)
}

export function isValidStatus(status: string): boolean {
  return ALL_STATUSES.includes(status as ShipmentStatus)
}
