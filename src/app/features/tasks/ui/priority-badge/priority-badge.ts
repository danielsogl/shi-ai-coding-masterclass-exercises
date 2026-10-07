import { Component, input } from "@angular/core";
import { TaskPriority } from "../../data/models/task.model";

@Component({
  selector: "app-priority-badge",
  template: `
    <span class="badge badge--{{ priority() }}">
      <span class="badge-dot" aria-hidden="true"></span>
      {{ priority() }}
    </span>
  `,
  styles: `
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px 3px 8px;
      border-radius: 999px;
      font: var(--mat-sys-label-small);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      border: 1px solid transparent;
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
      box-shadow: 0 0 0 2px color-mix(in srgb, currentColor 22%, transparent);
    }

    .badge--high {
      background-color: #fde2e1;
      color: #8a1c13;
      border-color: color-mix(in srgb, var(--mat-sys-error) 35%, transparent);
    }

    .badge--medium {
      background-color: #fff1d6;
      color: #7a4b00;
      border-color: color-mix(
        in srgb,
        var(--mat-sys-tertiary) 30%,
        transparent
      );
    }

    .badge--low {
      background-color: #e3f0e8;
      color: #1e5b34;
      border-color: color-mix(
        in srgb,
        var(--mat-sys-secondary) 30%,
        transparent
      );
    }
  `,
})
export class PriorityBadge {
  readonly priority = input.required<TaskPriority>();
}
