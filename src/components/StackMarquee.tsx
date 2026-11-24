import { STACK_ICONS } from "@/components/StackIcons";
import type { CSSProperties } from "react";

function ItemGroup() {
  return (
    <div className="sm2-group">
      {STACK_ICONS.map(({ name, color, Icon }, i) => (
        <span key={name} className="sm2-part">
          {i > 0 ? (
            <span aria-hidden className="sm2-dot">
              ·
            </span>
          ) : null}
          <span
            className="sm2-item"
            style={{ "--brand": color } as CSSProperties}
          >
            <Icon size={22} muted />
            <span>{name}</span>
          </span>
        </span>
      ))}
    </div>
  );
}

export function StackMarquee() {
  return (
    <div
      aria-hidden="true"
      className="sm2-mask flex h-20 items-center overflow-hidden border-y border-border bg-background sm:h-24 lg:h-28"
    >
      <div className="sm2-track">
        <ItemGroup />
        <ItemGroup />
      </div>
    </div>
  );
}
